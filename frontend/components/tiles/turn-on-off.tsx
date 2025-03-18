import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import PowerSVG from "@/components/svg/power-svg";

export default function TurnOnOff({isOn, setIsOn}: {isOn: boolean, setIsOn: (val: boolean) => void}) {
  return (
    <Card className="px-6 flex flex-row justify-between">
      <h2>Zasilanie</h2>
      <div className="h-6 aspect-square relative">
        <button className={cn(
                  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer",
                  "w-12 h-12 rounded-full ",
                  "flex items-center justify-center",
                  isOn ? "bg-yellow-300" : "bg-stone-900"
                )}
                onClick={() => setIsOn(!isOn)}
        >
          <div className="w-6 h-6 -mt-[2px]">
            <PowerSVG isOn={isOn}/>
          </div>
        </button>
      </div>
    </Card>
  )
}