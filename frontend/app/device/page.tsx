'use client';
import PowerIndicator from "@/components/tiles/power-indicator";
import Brightness from "@/components/tiles/brightness";
import TimerModal from "@/components/tiles/timer-modal";
import TurnOnOff from "@/components/tiles/turn-on-off";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarPlus } from "lucide-react";
import { useEffect, useState } from "react";
import Wrapper from "@/components/wrapper";

export default function LightBulb() {
  const [isOn, setIsOn] = useState(false);
  /**  
   * original time set by timer, dont use it in COUNTING CIRCLE TIMER, 
   *  its used as a variable which holds time set by user for timer in seconds 
   */
  const [timerValue, setTimerValue] = useState(60); 
  const [isTimerCounting, setIsTimerCounting] = useState(false);

  // this is running timer stuff
  const [secondsLeft, setSecondsLeft] = useState(0);
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

  return (
    <Wrapper>
      <PowerIndicator isOn={isOn}/>
      <TurnOnOff isOn={isOn} setIsOn={setIsOn}/>
      <Brightness />

      <div className="flex flex-col w-full">
        <div className="flex w-full gap-2">
          <TimerModal timeLeft={timerValue} 
                      setTimeLeft={setTimerValue} 
                      isCounting={isTimerCounting} 
                      startCounter={startCounter}
                      stopCounter={stopCounter}
                      initialCounterValue={timerValue}
                      currentCounterValue={secondsLeft} />
          <Button variant="outline" className="w-full shrink p-6 h-auto flex-col [&_svg]:shrink [&_svg:not([class*='size-'])]:size-auto">
            <CalendarPlus size={32} />
            <span className="text-muted-foreground">Harmonogram</span>
          </Button>
        </div>
      </div>

      <Card><CardContent>Auto turn on/off based on yearly sunrise/sunset equation</CardContent></Card>
      <Card><CardContent>Harmonogram jak w tapo</CardContent></Card>
    </Wrapper>
  )
}

