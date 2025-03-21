import { ExampleData } from "@/interfaces/schedule"
import { Separator } from "./ui/separator"
import LightBulbSVG from "./svg/light-bulb-svg"
import { pad } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

interface ScheduledActionProps {
  data: ExampleData,
  handleClick: () => void
}

export default function ScheduledAction({data, handleClick}: ScheduledActionProps) {
  const [hours, minutes] = ((d) => {
    const m = d.time/60;
    const minutes = m % 60;
    const hours = (m - minutes)/60; 
    return [hours, minutes];
  })(data);
  const dayNames = ["niedz", "pon", "wt", "śr", "czw", "pt", "sob"];
  
  return (
    <>
      <div className="w-full flex items-center ">
        <Button variant="ghost" 
                onClick={handleClick}
                className="w-full h-auto p-4 flex gap-4 shrink items-center justify-start text-left font-normal text-md [&_svg]:shrink [&_svg:not([class*='size-'])]:size-auto">
          <div>
            <LightBulbSVG size={"48px"} isOn={data.action === "turn-on"} darker={true}/>
          </div>
          <div>
            {`${pad(hours)}:${pad(minutes)}`}
            <div>

            </div>
            <div>
              {dayNames.map((day, idx) => {
                return data.repeats[idx] ? `${day}. ` : null  
              })}
            </div>
          </div>
        </Button>
        <div className="ml-auto p-4">
          <Switch />
        </div>
      </div>
      <Separator className="last:hidden p-[1px]"/>
    </>
  )
}
