'use client';
import PowerIndicator from "@/components/tiles/power-indicator";
import Brightness from "@/components/tiles/brightness";
import TimerModal from "@/components/tiles/timer-modal";
import TurnOnOff from "@/components/tiles/turn-on-off";
import { useEffect, useRef, useState } from "react";
import Wrapper from "@/components/wrapper";
import ScheduleModal from "@/components/tiles/schedule-modal";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { WsCommand, WsStatus, WsTimer } from "@/interfaces/types";
import AutoBrightness from "@/components/tiles/auto-brightness";
import { toast } from "sonner";

export type LightBulbTimer = {
  startedAt: number,
  initDelay: number,
  timerId?: string | number,
  commands: WsCommand[]
}

export type LightBulbState = {
  deviceId: string,
  isOn: boolean,
  brightnessLevel: number,
  balancedBrightness: boolean,
  timer: LightBulbTimer | null,
  schedule: null,
} 

export default function LightBulb() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout>(null);
  const [lightBulb, setLightBulb] = useState<LightBulbState>({
    deviceId: "device",
    isOn: false,
    brightnessLevel: 90,
    balancedBrightness: false,
    timer: null,
    schedule: null
  })

  // ws initializer
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080?token=client");

    ws.onopen = () => {
      toast.success("Połączono z serwerem WebSocket");
      console.log("Connected to ws server");
      const message: WsCommand = {
        type: "command",
        payload: {
          deviceId: "device",
          action: "turnOnOff",
          value: 0
        }
      };
      const timerInfoMessage = {
        type: "timer",
        action: "get"
      }
      ws.send(JSON.stringify(message));
      ws.send(JSON.stringify(timerInfoMessage))
      setSocket(ws);
    }

    ws.onmessage = async (event) => {
      const data: WsStatus | WsTimer = await JSON.parse(event.data);
      console.log("Received: ", data);
      if (data.type === "status") {
        lightBulb.isOn = data.status.isOn;
        lightBulb.brightnessLevel = data.status.brightnessLevel;
      } else if (data.type === "timer") {
        switch (data.action) {
          case "get":
            if (!data.currentDelay) return;
            const x: LightBulbTimer = {
              startedAt: data.currentDelay || 0,
              initDelay: data.initDelay || 0,
              commands: data.commands || [],
              timerId: data.jobId
            } 
            lightBulb.timer = x;
            setLightBulb({...lightBulb});
          case "set":
            if (!data.jobId || !lightBulb.timer) return;
            lightBulb.timer.timerId = data.jobId;
          case "del":
            if (data.currentDelay !== -404) return;
            lightBulb.timer = null;
          default:
            return;
        }
      }
      setLightBulb({...lightBulb});
    }

    ws.onclose = () => {
      toast.error("Rozłączono z serwerem WebSocket");
      console.log("Disconnected from ws server");
    }

    return () => ws.close();
  }, [])

  const turnOnTheLights = (turnOn: boolean) => {
    // optimistic state change
    lightBulb.isOn = turnOn;
    setLightBulb({...lightBulb});

    const message: WsCommand = {
      type: "command",
      payload: {
        deviceId: "device",
        action: "turnOnOff",
        value: turnOn ? 1 : 0
      }
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message)); 
    }
  }

  const adjustBrightness = (brightness: number[]) => {
    // optimistic state change
    lightBulb.brightnessLevel = brightness[0];
    setLightBulb({...lightBulb});
    
    const message: WsCommand = {
      type: "command",
      payload: {
        deviceId: "device",
        action: "setBrightness",
        value: brightness[0]
      }
    };

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (socket && socket.readyState == WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    }, 100);

  }

  const handleTimer = (turnOn: boolean, delayInSeconds: number, stop?: boolean) => {
    if (stop) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "timer",
          action: "del",
          jobId: lightBulb.timer?.timerId
        }))
      }

      // can not be optimistic, since this WS message above needs timer Id
      lightBulb.timer = null;
      setLightBulb({...lightBulb});
      return;
    }

    const newTimer: LightBulbTimer = {
      startedAt: Date.now(),
      initDelay: delayInSeconds,
      commands: [{
        type: "command",
        payload: {
          deviceId: "device",
          action: "turnOnOff",
          value: turnOn ? 1 : 0
        }
      }]
    };
    lightBulb.timer = newTimer;
    setLightBulb({...lightBulb});

    const message = {
      type: "timer",
      action: "set",
      initDelay: newTimer.initDelay,
      commands: [{
        type: "command",
        payload: {
          deviceId: "device",
          action: "turnOnOff",
          value: newTimer.commands[0].payload.value
        }
      }]
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message)); 
    }
  }

  // prevent timer from counting below zero
  // think someday about solution to which this function refers to
  // and then delete it
  const emergencyTimerStop = () => {
    lightBulb.timer = null;
    setLightBulb({...lightBulb})
  }

  return (
    <Wrapper>
      <Link href="/">
        <ChevronLeft />
      </Link>
      <PowerIndicator isOn={lightBulb.isOn}/>
      <TurnOnOff isOn={lightBulb.isOn} setIsOn={turnOnTheLights}/>
      <AutoBrightness brightness={lightBulb.brightnessLevel} setBrightness={adjustBrightness}></AutoBrightness>
      <Brightness brightness={lightBulb.brightnessLevel} setBrightness={adjustBrightness}/>

      <div className="flex flex-col w-full">
        <div className="flex w-full gap-2">
          <TimerModal timerData={lightBulb.timer} setTimerData={handleTimer} emergencyStopFunction={emergencyTimerStop}/>
          <ScheduleModal />
        </div>
      </div>
    </Wrapper>
  )
}

