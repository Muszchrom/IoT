import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import Wrapper from "@/components/wrapper";
import { ExampleData } from "@/interfaces/schedule";
import ScheduledAction from "../scheduled-action";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";

interface ScheduleModalProps {

}

export default function ScheduleModal({}: ScheduleModalProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPageDataIndex, setEditPageDataIndex] = useState<null | number>(null);

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
    }
  ];

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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full shrink p-6 h-auto flex-col [&_svg]:shrink [&_svg:not([class*='size-'])]:size-auto">
          <CalendarPlus size={32} />
          <span className="text-muted-foreground">Harmonogram</span>
        </Button>
      </DialogTrigger>

      <DialogContent retrunButtonFunction={handleReturnFromEdit} className="w-screen h-full border-none rounded-none max-w-none sm:max-w-none flex flex-col gap-6 duration-0 min-w-sm">
        <Wrapper className="min-h-full">
          <DialogHeader className="mb-6">
            <DialogTitle>Harmonogram</DialogTitle>
          </DialogHeader>

          {editPageDataIndex === null ? (
            <>
              {exampleData.length && (
                <div className="bg-neutral-900 rounded-md flex flex-col ">
                  {exampleData.map((action, idx) => {
                    return <ScheduledAction data={action} key={idx} handleClick={() => handleShowEditPage(idx)}/>
                  })}
                </div>
              )}

              <Button variant="outline" className="mt-auto font-bold">
                Dodaj nowy
              </Button>
            </>
          ) : (
            <>
              Edit
            </>
          )}

        </Wrapper>
      </DialogContent>
    </Dialog>
  )
}