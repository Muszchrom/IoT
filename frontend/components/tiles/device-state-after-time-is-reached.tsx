import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeviceStateAfterTimeIsReached({deviceStateAfter, setDeviceStateAfter}: {deviceStateAfter: number, setDeviceStateAfter: (val: number) => void}) {
  return (
    <Card className="pb-0">
      <CardHeader>  
        <CardTitle>
          Urządzenie będzie
        </CardTitle>
        <CardDescription>
          {deviceStateAfter ? "Włączone" : "Wyłączone"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col px-0">
        <div className="flex flex-col w-full">
          <Button variant="outline"
                  onClick={() => setDeviceStateAfter(1)} 
                  className={"rounded-none p-6 border-b-0 justify-between border-none"}>
            Włączone
            <div className={deviceStateAfter === 0 ? "hidden" : ""}><Check /></div>
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col w-full">
          <Button variant="outline"
                  onClick={() => setDeviceStateAfter(0)} 
                  className={"rounded-b-xl rounded-t-none p-6 border-b-0 justify-between border-none"}>
            Wyłączone
            <div className={deviceStateAfter === 1 ? "hidden" : ""}><Check /></div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}