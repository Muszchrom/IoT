import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import Wrapper from "@/components/wrapper";
import { ExampleData } from "@/interfaces/schedule";
import ScheduledAction from "../scheduled-action";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import TimePicker from "../time-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import EditSchedule from "./edit-schedule";

interface ScheduleModalProps {

}

export default function ScheduleModal({}: ScheduleModalProps) {
  const exampleData: ExampleData[] = [
    {
      time: 21600, 
      auto: true, 
      action: "turn-on",
      repeats: [false, true, true, true, true, true, false] 
    },
    {
      time: 82800, 
      auto: false, 
      action: "turn-off",
      repeats: [false, true, true, true, true, true, false] 
    },
    {
      time: 82800, 
      auto: false, 
      action: "turn-off",
      repeats: [false, true, true, true, true, true, false] 
    }
  ];

  const [scheduleDataArray, setScheduleDataArray] = useState(exampleData);
  const [editPageDataIndex, setEditPageDataIndex] = useState<null | number>(null); // which schedule to edit, like which tile or something. Set as -1 to add new. Null means its not set


  const updateScheduleDataArray = (val: ExampleData, idx: number) => {
    if (idx !== null && idx >= 0) {
      scheduleDataArray[idx] = val;
      setScheduleDataArray([...scheduleDataArray])
    }
  }

  const handleShowEditPage = (idx: number) => {
    setEditPageDataIndex(idx);
  }

  const handleReturnFromEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (editPageDataIndex !== null) {
      e.preventDefault();
      setEditPageDataIndex(null);
    }
  }

  useEffect(() => {
    console.log(editPageDataIndex)
  }, [editPageDataIndex])

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

          {editPageDataIndex === null ? (
            <>
              {scheduleDataArray.length && (
                <Card className="py-0 gap-0">
                  {scheduleDataArray.map((scheduleData, idx) => {
                    return <ScheduledAction data={scheduleData} key={idx} handleClick={() => handleShowEditPage(idx)}/>
                  })}
                </Card>
              )}

              <Button variant="outline" className="mt-auto font-bold">
                Dodaj nowy
              </Button>
            </>
          ) : (
            <>
              <EditSchedule scheduleData={scheduleDataArray[editPageDataIndex]} setScheduleData={(val: ExampleData) => updateScheduleDataArray(val, editPageDataIndex)}/>
            </>
          )}

        </Wrapper>
      </DialogContent>
    </Dialog>
  )
}


