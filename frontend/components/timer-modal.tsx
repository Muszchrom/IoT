'use client';
import TimePicker from "@/components/time-picker";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Check, Timer } from "lucide-react";
import { useState } from "react";
import CountdownCircleTimer from "./countdown-circle-timer";

interface TimerModalProps {
  timeLeft: number,
  setTimeLeft: ((val: number) => void),
  isCounting: boolean,
  startCounter: () => void,
  stopCounter: (cancel?: boolean) => void,
  initialCounterValue: number,
  currentCounterValue: number,
}

export default function TimerModal({timeLeft, setTimeLeft, isCounting, startCounter, stopCounter, initialCounterValue, currentCounterValue}: TimerModalProps) {
  const [turnOnDevice, setTurnOnDevice] = useState(false);
  const handleStartStop = () => {
    if (isCounting) {
      stopCounter(true);
    } else {
      startCounter();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full shrink p-6 h-auto flex-col [&_svg]:shrink [&_svg:not([class*='size-'])]:size-auto">
          <Timer size={32} />
          <span className="text-muted-foreground">Minutnik</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-screen h-full border-none rounded-none max-w-none sm:max-w-none flex flex-col gap-6 duration-0">
        <DialogHeader className="mb-6">
          <DialogTitle>Minutnik</DialogTitle>
        </DialogHeader>

        {isCounting ? (
          <CountdownCircleTimer initValue={initialCounterValue} currentValue={currentCounterValue} />
        ) : (
          <>
          <Card>
            <CardHeader>
              <TimePicker timeLeft={timeLeft} setTimeLeft={setTimeLeft}/>
            </CardHeader>
          </Card>

          <div className="flex flex-col w-full">
            <span className="text-muted-foreground mb-2 ml-1">Po upywie czasu minutnika</span>
            <Button type="button" variant="outline" className="p-6 border-b-0 rounded-b-none justify-between" onClick={() => setTurnOnDevice(true)}>
              Włącz urządzenie
              <div className={cn(!turnOnDevice && "hidden")}><Check /></div>
            </Button>
            <Button type="button" variant="outline" className="p-6 rounded-t-none justify-between" onClick={() => setTurnOnDevice(false)}>
              Wyłącz urządzenie
              <div className={cn(turnOnDevice && "hidden")}><Check /></div>
            </Button>
          </div>
          </>
        )}

        <DialogFooter className="mt-auto flex-row items-center">
          <div>
            {isCounting && (turnOnDevice ? "Włączy urządzenie" : "Wyłączy urządzenie")}
          </div>
          <Button variant={isCounting ? "destructive" : "default"} className="ml-auto font-bold px-8" onClick={handleStartStop}>
            {isCounting ? "stop" : "Start"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
