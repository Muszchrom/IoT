import { Button } from "@/components/ui/button";
import RepeatAtSelectedDays from "./repeat-at-selected-days";
import DeviceStateAfterTimeIsReached from "./device-state-after-time-is-reached";
import DeviceActionTimeSettings from "./device-action-time-settings";
import { WsSchedule } from "@/interfaces/types";
import { useEffect } from "react";

export default function EditSchedule({
  scheduleData, 
  setScheduleData, 
  saveChanges,
  deleteSchedule
}: {
  scheduleData: WsSchedule, 
  setScheduleData: (val: WsSchedule) => void
  saveChanges: () => void,
  deleteSchedule: (val: WsSchedule) => void
}) {
  useEffect(() => {
    console.log(scheduleData);
  }, [scheduleData]) 

  const setTimeAfter = (val: number) => {
    console.log("Hello?")
    scheduleData.execTimeInMinutes = val/60 // seconds to minutes
    setScheduleData({...scheduleData});
  }

  const setAction = (val: number) => {
    scheduleData.commands[0].payload.value = val
    setScheduleData({...scheduleData});
  }

  const setActAtTheseDays = (arr: number[]) => {
    scheduleData.repeatAtDays = arr
    setScheduleData({...scheduleData});
  }

  const setExecReferenceTime = (val: "absolute" | "sunrise" | "sunset") => {
    scheduleData.execReferenceTime = val;
    setScheduleData({...scheduleData});
  }

  const setBeforeSetAfter = (after: boolean) => {
    scheduleData.execTimeInMinutes = (after ? 1 : -1) * scheduleData.execTimeInMinutes
    setScheduleData({...scheduleData});
  }

  return (
    <>
      <DeviceActionTimeSettings timeAfter={scheduleData.execTimeInMinutes*60} 
                                setTimeAfter={setTimeAfter} 
                                setExecReferenceTime={setExecReferenceTime}
                                setBeforeSetAfter={setBeforeSetAfter} />
      <DeviceStateAfterTimeIsReached deviceStateAfter={scheduleData.commands[0].payload.value} 
                                     setDeviceStateAfter={setAction}/>
      <RepeatAtSelectedDays actAtTheseDays={scheduleData.repeatAtDays} 
                            setActAtTheseDays={setActAtTheseDays}/>

      <div className="mt-auto w-full flex gap-8">
        {scheduleData.jobId && 
          <Button variant="destructive" 
                  className="grow" 
                  onClick={() => deleteSchedule(scheduleData)}>
                    Usuń
          </Button>
        }
        <Button variant="outline" className="grow" onClick={saveChanges}>Zatwierdź</Button>
      </div>
    </>
  )
}





