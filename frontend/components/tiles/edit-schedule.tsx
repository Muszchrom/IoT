import { Button } from "@/components/ui/button";
import { ExampleData } from "@/interfaces/schedule";
import RepeatAtSelectedDays from "./repeat-at-selected-days";
import DeviceStateAfterTimeIsReached from "./device-state-after-time-is-reached";
import DeviceActionTimeSettings from "./device-action-time-settings";

export default function EditSchedule({scheduleData, setScheduleData}: {scheduleData: ExampleData, setScheduleData: (val: ExampleData) => void}) {
  
  const setTimeAfter = (val: number) => {
    scheduleData.time = val
    setScheduleData({...scheduleData})
  }

  const updateAction = (val: ExampleData["action"]) => {
    scheduleData.action = val
    setScheduleData({...scheduleData})
  }

  const updateActAtTheseDays = (arr: ExampleData["repeats"]) => {
    scheduleData.repeats = arr
    setScheduleData({...scheduleData})
  }

  return (
    <>
      <DeviceActionTimeSettings timeAfter={scheduleData.time} setTimeAfter={setTimeAfter}/>
      <DeviceStateAfterTimeIsReached deviceStateAfter={scheduleData.action} setDeviceStateAfter={updateAction}/>
      <RepeatAtSelectedDays actAtTheseDays={scheduleData.repeats} setActAtTheseDays={updateActAtTheseDays}/>

      <Button variant="destructive" className="mt-auto">Usuń</Button>
    </>
  )
}





