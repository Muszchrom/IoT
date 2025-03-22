import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Check } from "lucide-react";
import Wrapper from "@/components/wrapper";
import { ExampleData, FixedLengthArray } from "@/interfaces/schedule";
import ScheduledAction from "../scheduled-action";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import TimePicker from "../time-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

export default function EditSchedule({scheduleData, setScheduleData}: {scheduleData?: ExampleData, setScheduleData: (val: ExampleData) => void}) {
  const ifScheduleDataNotPresent: ExampleData = {
    time: 0,
    auto: false,
    action: "turn-on",
    repeats: [false, false, false, false, false, false, false]
  }
  const [scheduleDataState, setScheduleDataState] = useState<ExampleData>(scheduleData || ifScheduleDataNotPresent)

  const updateActAtTheseDays = (arr: ExampleData["repeats"]) => {
    scheduleDataState.repeats = arr
    setScheduleDataState({...scheduleDataState})
  }

  const updateAction = (val: ExampleData["action"]) => {
    scheduleDataState.action = val
    setScheduleDataState({...scheduleDataState})
  }

  useEffect(() => {
    console.log(scheduleDataState)
    return () => setScheduleData(scheduleDataState)
  }, [scheduleDataState])

  return (
    <>
      <DeviceActionTimeSettings />
      <DeviceStateAfterTimeIsReached deviceStateAfter={scheduleDataState.action} setDeviceStateAfter={updateAction}/>
      <RepeatAtSelectedDays actAtTheseDays={scheduleDataState.repeats} setActAtTheseDays={updateActAtTheseDays}/>

      <Button variant="destructive" className="mt-auto">Usuń</Button>
    </>
  )
}

function DeviceActionTimeSettings() {
  const opts: ["user", "sunrise", "sunset"] = ["user", "sunrise", "sunset"];
  const [currentTimePickerOption, setCurrentTimePickerOption] = useState<typeof opts[number]>("user");
  const [beforeSelected, setBeforeSelected] = useState(true);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {titleSwitchCase(currentTimePickerOption)}
        </CardTitle>
        <CardDescription>
          Well, well, well opóźnienie wynosi:
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
          <TimePicker timeLeft={0} setTimeLeft={() => {}}/>
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

function DeviceStateAfterTimeIsReached({deviceStateAfter, setDeviceStateAfter}: {deviceStateAfter: ExampleData["action"], setDeviceStateAfter: (val: ExampleData["action"]) => void}) {
  const [deviceState, setDeviceState] = useState<ExampleData["action"]>(deviceStateAfter)
  const deviceStates: ["turn-on", "turn-off"] = ["turn-on", "turn-off"]; // optional implementation "Pojawienie się", "Zanikanie"
  
  const translate = (val: ExampleData["action"]) => {
    if (val === "turn-off") return "Wyłączone";
    else if (val === "turn-on") return "Włączone";
    else throw Error("Invalid arg org");
  }

  useEffect(() => {
    setDeviceStateAfter(deviceState)
  }, [deviceState])
  
  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>
          Urządzenie będzie
        </CardTitle>
        <CardDescription>
          {translate(deviceState)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col px-0">
        {deviceStates.map((item) => {
          return (
            <div  key={item} className="flex flex-col w-full">
              {/* <Button variant="outline" className={cn(item === "Zanikanie" ? "rounded-b-xl rounded-t-none" : "rounded-none", "border-none h-auto py-4 px-6 justify-start")}> */}
              <Button variant="outline"
                      onClick={() => {console.log(item); setDeviceState(item)}} 
                      className={cn(item === deviceStates[deviceStates.length - 1] ? "rounded-b-xl rounded-t-none" : "rounded-none", "p-6 border-b-0 justify-between border-none")}>
                {translate(item)}
                <div className={cn(deviceState !== item && "hidden")}><Check /></div>
              </Button>
              <Separator className={cn(item === deviceStates[deviceStates.length - 1] && "hidden")}></Separator>
            </div>
          )
        })
        }
      </CardContent>
    </Card>
  )
}

function RepeatAtSelectedDays({actAtTheseDays, setActAtTheseDays}: {actAtTheseDays: ExampleData["repeats"], setActAtTheseDays: (arr: ExampleData["repeats"]) => void}) {
  const [isSetAtTheseDays, setIsSetAtTheseDays] = useState(actAtTheseDays);
  const days = ["N", "P", "W", "Ś", "C", "P", "S"]
  const days2 = ["nd", "pon", "wt", "śr", "czw", "pt", "sob"];

  const handleClick = (idx: number) => {
    const a = isSetAtTheseDays;
    a[idx] = !isSetAtTheseDays[idx];
    setIsSetAtTheseDays([...a] as FixedLengthArray);
  }

  useEffect(() => {
    setActAtTheseDays(isSetAtTheseDays)
  }, [isSetAtTheseDays])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Powtórz
        </CardTitle>
        <CardDescription>
          {"Każdy " + days2.filter((day, idx) => {
            if (isSetAtTheseDays[idx]) return day
          }).join(", ") + "."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="w-full flex justify-between">
          {days.map((day, idx) => {
            return <Button variant="outline" 
                           className={cn(isSetAtTheseDays[idx] && "bg-yellow-300 text-background hover:bg-yellow-200 hover:text-background", "rounded-full aspect-square h-12 w-auto")} 
                           key={idx}
                           onClick={() => handleClick(idx)}>
                             {day}
                    </Button>
          })}
        </div>
      </CardContent>
    </Card>
  )
}