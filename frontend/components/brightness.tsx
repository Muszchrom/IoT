import { SliderFat } from "./slider-fat";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function Brightness() {
  // onValueChange={(i) => handleValueChange(i)}
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jasność</CardTitle>
      </CardHeader>
      <CardContent>
        <SliderFat defaultValue={[33]} max={100} step={1}></SliderFat>
      </CardContent>
    </Card>
  )
}