import { ExampleData } from "@/interfaces/schedule"
import { Separator } from "./ui/separator"
import LightBulbSVG from "./svg/light-bulb-svg"
import { pad } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { WsSchedule } from "@/interfaces/types";

interface ScheduledActionProps {
  data: WsSchedule,
  handleClick: () => void,
  handleActiveChange: (checked: boolean) => void
}

export default function ScheduledAction({data, handleClick, handleActiveChange}: ScheduledActionProps) {
  const [hours, minutes] = ((d) => {
    const m = d;
    const minutes = m % 60;
    const hours = (m - minutes)/60; 
    return [hours, minutes];
  })(data.execTimeInMinutes as number);
  const dayNames = ["niedz", "pon", "wt", "śr", "czw", "pt", "sob"];

  return (
    <>
      <div className="w-full flex items-center ">
        <Button variant="ghost" 
                onClick={handleClick}
                className="rounded-none w-full h-auto px-4 py-6 flex gap-4 shrink items-center justify-start text-left font-normal text-md [&_svg]:shrink [&_svg:not([class*='size-'])]:size-auto">
          <div>
            <LightBulbSVG size={"48px"} isOn={data.commands[0].payload.action === "turnOnOff" && data.commands[0].payload.value === 1} darker={true}/>
          </div>
          <div>
            {`${pad(hours)}:${pad(minutes)}`}
            <div>

            </div>
            <div>
              {dayNames.map((day, idx) => data.repeatAtDays[idx] ? `${day}. ` : null)}
            </div>
          </div>
        </Button>
        <div className="ml-auto p-4">
          <Switch checked={data.active} onCheckedChange={handleActiveChange}/>
        </div>
      </div>
      <Separator className="last:hidden p-[1px]"/>
    </>
  )
}
