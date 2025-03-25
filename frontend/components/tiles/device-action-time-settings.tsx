import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import TimePicker from "../time-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { pad } from "@/lib/utils";

interface DeviceActionTimeSettingsProps {
  timeAfter: number,
  setTimeAfter: (val: number) => void
}

export default function DeviceActionTimeSettings({timeAfter, setTimeAfter}: DeviceActionTimeSettingsProps) {
  const opts: ["user", "sunrise", "sunset"] = ["user", "sunrise", "sunset"];
  const [currentTimePickerOption, setCurrentTimePickerOption] = useState<typeof opts[number]>("user");
  const [beforeSelected, setBeforeSelected] = useState(true);
  const [timeLeft, setTimeLeft] = useState(timeAfter);

  const [timeSettingsHeader, setTimeSettingsHeader] = useState("Wykonanie akcji o godzinie 00:00") 
  const [fastChangingTime, setFastChangingTime] = useState(timeAfter); // changing timeLeft => time-picker animations going baaad

  const fun = (secs: number) => {
    setFastChangingTime(secs);
    setTimeAfter(secs);
  }

  const titleSwitchCase = (val: typeof opts[number]) => {
    switch (val) {
      case "user":
        return "Własne ustawienia czasu"
      case "sunrise":
        return "Wschód słońca"
      case "sunset":
        return "Zachód słońca"
      default:
        return "Invalid option"
    }
  }
  const handleClick = (val: typeof opts[number]) => {
    setCurrentTimePickerOption(val)
  }

  useEffect(() => {
    const hours = Math.floor(fastChangingTime / 3600);
    const minutes = Math.floor((fastChangingTime % 3600) / 60);
    const t = `${pad(hours)}:${pad(minutes)}`

    const headerText = (() => {
      switch (currentTimePickerOption) {
        case "user":
          return `Wykonanie akcji o godzinie ${t}`
        case "sunrise":
          return beforeSelected 
                  ? `Wykonanie akcji ${t} przed wschodem słońca` 
                  : `Wykonanie akcji ${t} po wschodzie słońca` 
        case "sunset":
          return beforeSelected 
                  ? `Wykonanie akcji ${t} przed zachodem słońca` 
                  : `Wykonanie akcji ${t} po zachodzie słońca` 
        default:
          return "Invalid option"
      }
    })();
    setTimeSettingsHeader(headerText);
  }, [fastChangingTime, currentTimePickerOption, beforeSelected])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {titleSwitchCase(currentTimePickerOption)}
        </CardTitle>
        <CardDescription>
          {timeSettingsHeader}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-2">
          {opts.map((item) => {
            return <Button onClick={() => handleClick(item)} 
                           key={item}
                           variant={item === currentTimePickerOption ? "secondary" : "outline"} 
                           className="whitespace-pre-wrap h-auto shrink w-full font-thin py-0 px-1 min-h-9">
                             {titleSwitchCase(item).split(" ").length > 2 
                                ? titleSwitchCase(item).split(" ").slice(0, 2).join(" ") + " ..." 
                                : titleSwitchCase(item)}
                    </Button>
          })}
        </div>
        <div className="">
          <TimePicker timeLeft={timeLeft} setTimeLeft={setTimeLeft} fun={fun}/>
          { currentTimePickerOption !== "user" && (
            <div className="flex flex-row gap-6 px-6">
              <Button variant={beforeSelected ? "secondary" : "outline"} onClick={() => setBeforeSelected(true)} className="shrink w-full font-thin py-0 px-1 min-h-9">Przed</Button>
              <Button variant={beforeSelected ? "outline" : "secondary"} onClick={() => setBeforeSelected(false)} className="shrink w-full font-thin py-0 px-1 min-h-9">Po</Button>
            </div>
          )
          }
        </div>
      </CardContent>
    </Card>
  )
}