import LightBulbSVG from "@/components/svg/light-bulb-svg";
import { Card } from "@/components/ui/card";

export default function PowerIndicator({isOn}: {isOn: boolean}) {
  return (
    <Card className="flex flex-row justify-between px-6 items-end border-none shadow-none">
      <div><LightBulbSVG isOn={isOn}/></div>
      <h1 className="font-bold text-right text-2xl">Pasek LED</h1>
    </Card>
  ) 
}