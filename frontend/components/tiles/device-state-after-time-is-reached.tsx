import { ExampleData } from "@/interfaces/schedule";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeviceStateAfterTimeIsReached({deviceStateAfter, setDeviceStateAfter}: {deviceStateAfter: ExampleData["action"], setDeviceStateAfter: (val: ExampleData["action"]) => void}) {
  // const [deviceState, setDeviceState] = useState<ExampleData["action"]>(deviceStateAfter)
  const deviceStates: ["turn-on", "turn-off"] = ["turn-on", "turn-off"]; // optional implementation "Pojawienie się", "Zanikanie"
  
  const translate = (val: ExampleData["action"]) => {
    if (val === "turn-off") return "Wyłączone";
    else if (val === "turn-on") return "Włączone";
    else throw Error("Invalid arg org");
  }
  
  return (
    <Card className="pb-0">
      <CardHeader>  
        <CardTitle>
          Urządzenie będzie
        </CardTitle>
        <CardDescription>
          {translate(deviceStateAfter)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col px-0">
        {deviceStates.map((item) => {
          return (
            <div  key={item} className="flex flex-col w-full">
              {/* <Button variant="outline" className={cn(item === "Zanikanie" ? "rounded-b-xl rounded-t-none" : "rounded-none", "border-none h-auto py-4 px-6 justify-start")}> */}
              <Button variant="outline"
                      onClick={() => setDeviceStateAfter(item)} 
                      className={cn(item === deviceStates[deviceStates.length - 1] ? "rounded-b-xl rounded-t-none" : "rounded-none", "p-6 border-b-0 justify-between border-none")}>
                {translate(item)}
                <div className={cn(deviceStateAfter !== item && "hidden")}><Check /></div>
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