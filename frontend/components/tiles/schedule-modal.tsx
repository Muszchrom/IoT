import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import Wrapper from "@/components/wrapper";
import ScheduledAction from "../scheduled-action";
import { useState } from "react";
import { Card } from "../ui/card";
import EditSchedule from "./edit-schedule";
import { WsSchedule } from "@/interfaces/types";

const exampleData: WsSchedule[] = [
  {
    type: "schedule",
    action: "set",
    active: false, 
    execReferenceTime: "absolute",
    execTimeInMinutes: 7*60,
    repeatAtDays: [0, 1, 1, 1, 1, 0, 0], 
    jobId: 1,
    commands: [
      {
        type: "command",
        payload: {
          deviceId: "device",
          action: "turnOnOff",
          value: 1
        }
      }
    ]
  },
  {
    type: "schedule",
    action: "set",
    active: true, 
    execReferenceTime: "absolute",
    execTimeInMinutes: 7*60,
    repeatAtDays: [1, 0, 0, 0, 0, 0, 1], 
    jobId: 2,
    commands: [
      {
        type: "command",
        payload: {
          deviceId: "device",
          action: "turnOnOff",
          value: 1
        }
      }
    ]
  },
  {
    type: "schedule",
    action: "set",
    active: true, 
    execReferenceTime: "absolute",
    execTimeInMinutes: 7*60,
    repeatAtDays: [1, 1, 1, 1, 1, 1, 1], 
    jobId: 3,
    commands: [
      {
        type: "command",
        payload: {
          deviceId: "device",
          action: "turnOnOff",
          value: 1
        }
      }
    ]
  }
];


export default function ScheduleModal({
  sendMessage, 
  scheduleDataArray,
  setScheduleDataArray
}: {
  sendMessage: (data: WsSchedule) => void
  scheduleDataArray: WsSchedule[],
  setScheduleDataArray: (data: WsSchedule[]) => void
}) {
  const initDataForNewSchedule: WsSchedule = {
    type: "schedule",
    action: "set",
    active: true, 
    execReferenceTime: "absolute",
    execTimeInMinutes: 7*60, // Its in minutes
    repeatAtDays: [0, 0, 0, 0, 0, 0, 0], 
    jobId: undefined,
    commands: [
      {
        type: "command",
        payload: {
          deviceId: "device",
          action: "turnOnOff",
          value: 1
        }
      }
    ]
  }

  const [scheduleCurrentlyEdited, setScheduleCurrentlyEdited] = useState<WsSchedule | null>(null);

  const handleShowEditPage = (scheduleData: WsSchedule) => {
    setScheduleCurrentlyEdited(scheduleData);
  }

  const handleReturnFromEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (scheduleCurrentlyEdited) {
      e.preventDefault();
      setScheduleCurrentlyEdited(null);
    }
  }

  const handleNewSchedule = () => {
    setScheduleCurrentlyEdited(initDataForNewSchedule);
  }

  const saveChanges = () => {
    if (scheduleCurrentlyEdited === null) throw new Error("Somehow null showed up");
    if (scheduleCurrentlyEdited.jobId) {
      scheduleCurrentlyEdited.action = "edit"
    } else {
      scheduleCurrentlyEdited.action = "set"
    }
    sendMessage(scheduleCurrentlyEdited);
    setScheduleCurrentlyEdited(null);
  }

  const handleActiveChange = (checked: boolean, idx: number) => {
    scheduleDataArray[idx].active = checked;
    const x = scheduleDataArray[idx];
    x.action = "edit";
    sendMessage(x);
    setScheduleDataArray(scheduleDataArray.slice());
  }

  const deleteSchedule = (data: WsSchedule) => {
    data.action = "del";
    sendMessage(data);
    setScheduleCurrentlyEdited(null);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full shrink p-6 h-auto flex-col [&_svg]:shrink [&_svg:not([class*='size-'])]:size-auto">
          <CalendarPlus size={32} />
          <span className="text-muted-foreground">Harmonogram</span>
        </Button>
      </DialogTrigger>

      <DialogContent retrunButtonFunction={handleReturnFromEdit} className="overflow-auto w-screen h-full border-none rounded-none max-w-none sm:max-w-none flex flex-col gap-6 duration-0 min-w-sm">
        <Wrapper className="min-h-full px-0">
          <DialogHeader className="mb-6">
            <DialogTitle>Harmonogram</DialogTitle>
          </DialogHeader>
          {scheduleCurrentlyEdited === null ? (
            <>
              {scheduleDataArray.length ? (
                <Card className="py-0 gap-0 overflow-hidden">
                  {scheduleDataArray.map((scheduleData, idx) => {
                    return <ScheduledAction data={scheduleData} 
                                            key={idx} 
                                            handleClick={() => handleShowEditPage(scheduleData)} 
                                            handleActiveChange={(checked) => handleActiveChange(checked, idx)}/>
                  })}
                </Card>
              ) : (
                <div className="w-full text-center py-6">
                  <span className="text-5xl mb-2">🫠</span>
                  <span>Nic tu jeszcze nie ma</span>
                </div>
              )}

              <Button variant="outline" className="mt-auto font-bold" onClick={handleNewSchedule}>
                Dodaj nowy
              </Button>
            </>
          ) : (
            <>
              <EditSchedule scheduleData={scheduleCurrentlyEdited} 
                            setScheduleData={setScheduleCurrentlyEdited} 
                            saveChanges={saveChanges}
                            deleteSchedule={deleteSchedule}/>
            </>
          )}

        </Wrapper>
      </DialogContent>
    </Dialog>
  )
}


