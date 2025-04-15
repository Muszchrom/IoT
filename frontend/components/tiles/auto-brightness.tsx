import { SliderFat } from "@/components/slider-fat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import PowerSVG from "../svg/power-svg";

const brightnessLevels = [
  {
    value: "300",
    label: "Pokój dzienny, dziecięcy, salon",
  },
  {
    value: "150",
    label: "Sypialnia",
  },
  {
    value: "200",
    label: "Jadalnia",
  },
  {
    value: "500",
    label: "Miejsca robocze, blaty, biurka",
  },
  {
    value: "100",
    label: "Korytarz, schody, łazienka",
  },
  {
    value: "50",
    label: "Piwnica, magazyn",
  },
  {
    value: "75",
    label: "Garaż",
  }
];

export default function AutoBrightness({
  brightness, 
  setBrightness
}: {brightness: number, setBrightness: (val: number[]) => void}) {
  const [isOn, setIsOn] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("300");
  // onValueChange={(i) => handleValueChange(i)}
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automatyczne utrzymywanie jasności</CardTitle>
      </CardHeader>
      <CardContent>

      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <div className="flex flex-row gap-2 items-center">
          <PopoverTrigger asChild className="shrink whitespace-normal h-fit">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? brightnessLevels.find((brightness) => "" + brightness.value === value)?.label
                : "Wybierz jasność..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <button className={cn("cursor-pointer w-12 h-12 rounded-full aspect-square flex items-center justify-center -mr-[12px]",
                                isOn ? "bg-yellow-300" : "bg-stone-900")}
                  onClick={() => setIsOn(!isOn)}
          >
            <div className="w-6 h-6 -mt-[2px]">
              <PowerSVG isOn={isOn}/>
            </div>
          </button>
        </div> 
        {/* top-0 right-[calc(var(--radix-popover-trigger-width)/2)] left-[calc(var(--radix-popover-trigger-width)/2)] */}
        <PopoverContent className="absolute -right-[calc(var(--radix-popover-trigger-width)/2)] -left-[calc(var(--radix-popover-trigger-width)/2)] p-0">
          <Command>
            <CommandInput placeholder="Szukaj pomieszczenia..." />
            <CommandList >
              <CommandEmpty>Nie znaleziono pomieszczenia...</CommandEmpty>
              <CommandGroup>
                {brightnessLevels.map((brightness) => (
                  <CommandItem
                    key={brightness.value}
                    value={"" + brightness.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "300" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === "" + brightness.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex justify-between w-full">
                      <span>{brightness.label}</span>
                      <span className="text-muted-foreground whitespace-nowrap">{brightness.value} lux</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
        {/* <SliderFat defaultValue={[33]} max={100} step={1} value={[brightness]} onValueChange={setBrightness}></SliderFat> */}
      </CardContent>
    </Card>
  )
}