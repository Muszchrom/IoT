import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
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

interface AutoBrightnessProps {
  bBrightness: boolean,
  bBLevel: number,
  setBBrightness: (val: number) => void
}

export default function AutoBrightness({
  bBrightness,
  bBLevel,
  setBBrightness
}: AutoBrightnessProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(`${bBLevel}`);

  const handleClick = () => {
    setBBrightness(bBrightness ? -1 : parseInt(value));
  }
  useEffect(() => {
    setValue(`${bBLevel}`)
  }, [bBLevel])

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
                                bBrightness ? "bg-yellow-300" : "bg-stone-900")}
                  onClick={handleClick}
          >
            <div className="w-6 h-6 -mt-[2px]">
              <PowerSVG isOn={bBrightness}/>
            </div>
          </button>
        </div> 
        <PopoverContent className="absolute -right-[calc(var(--radix-popover-trigger-width)/2)] -left-[calc(var(--radix-popover-trigger-width)/2)] p-0">
          <Command>
            <CommandInput placeholder="Szukaj pomieszczenia..." />
            <CommandList >
              <CommandEmpty>Nie znaleziono pomieszczenia...</CommandEmpty>
              <CommandGroup>
                {brightnessLevels.map((brightness) => (
                  <CommandItem
                    key={brightness.value}
                    keywords={[brightness.label]}
                    value={"" + brightness.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      bBrightness && (currentValue === value 
                        ? setBBrightness(-1) 
                        : setBBrightness(parseInt(currentValue)))
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
      </CardContent>
    </Card>
  )
}