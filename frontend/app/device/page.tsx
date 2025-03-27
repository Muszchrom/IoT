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
import { WsCommand, WsStatus } from "@/interfaces/types";

export default function LightBulb() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(12);
  /**  
   * original time set by timer, dont use it in COUNTING CIRCLE TIMER, 
   *  its used as a variable which holds time set by user for timer in seconds 
   */
  const [timerValue, setTimerValue] = useState(60); 
  const [isTimerCounting, setIsTimerCounting] = useState(false);
  // this is running timer stuff
  const [secondsLeft, setSecondsLeft] = useState(0);

  const lastSentTime = useRef(0);

  useEffect(() => {
    if (!isTimerCounting) return;
    if (secondsLeft <= 0) return stopCounter();
    const intervalId = setInterval(() => {
      setSecondsLeft((secs) => secs - 1);
    }, 1000);
    return () => clearInterval(intervalId);

  }, [secondsLeft, isTimerCounting])

  /** these two (useEffect and startCounter) are dependant on eachother 
   * so that secondsLeft updates properly. time-picker.tsx which sets timerValue
   * updates this state only on unmount (it has to be that way or else we're causing
   * a lot of rerenders and animations break). This behavior resulted in 
   * secondsLeft being late 1 state update. I've included this useEffect to update
   * secondsLeft only after isTimerCounting changes. Seems to work properly.
   */
  useEffect(() => {
    setSecondsLeft(timerValue)
  }, [isTimerCounting, timerValue])

  const startCounter = () => {
    setIsTimerCounting(true)
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    
    ws.onopen = () => {
      console.log("Connected to ws server");
      setSocket(ws);
    }

    ws.onmessage = async (event) => {
      const data: WsStatus = JSON.parse(event.data);
      console.log("Received: ", data);
      setIsOn(data.status.isOn);
      setBrightness(data.status.brightnessLevel)
      // setMessages((prev) => [dataReceived, ...prev]);
    }

    ws.onclose = () => {
      console.log("Disconnected from ws server");
    }

    return () => ws.close();
  }, [])
 
  const stopCounter = (cancel?: boolean) => {
    setSecondsLeft(0);
    if (cancel) { // so basically if you press a cancel button
      setIsTimerCounting(false);
    }
    else { // if counting is finished, perform action
      console.log("Performing action ...")
      setIsTimerCounting(false); 
    }
  }

  const turnOnTheLights = (turnOn: boolean) => {
    const message: WsCommand = {
      type: "COMMAND",
      payload: {
        deviceId: "whatever",
        action: "turnOnOff",
        value: turnOn ? 1 : 0
      }
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message)); 
    }
    setIsOn(turnOn);
  }

  const adjustBrightness = async (brightness: number[]) => {
    setBrightness(brightness[0]);
    const now = Date.now();
    if (now - lastSentTime.current < 100) {
      return;
    }
    lastSentTime.current = now;
    const message: WsCommand = {
      type: "COMMAND",
      payload: {
        deviceId: "whatever",
        action: "setBrightness",
        value: brightness[0]
      }
    };
    if (socket && socket.readyState == WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  return (
    <Wrapper>
      <Link href="/">
        <ChevronLeft />
      </Link>
      <PowerIndicator isOn={isOn}/>
      <TurnOnOff isOn={isOn} setIsOn={turnOnTheLights}/>
      <Brightness brightness={brightness} setBrightness={adjustBrightness}/>

      <div className="flex flex-col w-full">
        <div className="flex w-full gap-2">
          <TimerModal timeLeft={timerValue} 
                      setTimeLeft={setTimerValue} 
                      isCounting={isTimerCounting} 
                      startCounter={startCounter}
                      stopCounter={stopCounter}
                      initialCounterValue={timerValue}
                      currentCounterValue={secondsLeft} />
          <ScheduleModal />
        </div>
      </div>
    </Wrapper>
  )
}

