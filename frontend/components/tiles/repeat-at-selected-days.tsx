import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RepeatAtSelectedDays({actAtTheseDays, setActAtTheseDays}: {actAtTheseDays: number[], setActAtTheseDays: (arr: number[]) => void}) {
  const days = ["N", "P", "W", "Ś", "C", "P", "S"]
  const days2 = ["nd", "pon", "wt", "śr", "czw", "pt", "sob"];

  const handleClick = (idx: number) => {
    const a = actAtTheseDays;
    a[idx] = actAtTheseDays[idx] === 0 ? 1 : 0;
    setActAtTheseDays(a);
  }

  return (
    <Card>  
      <CardHeader>
        <CardTitle>
          Powtórz
        </CardTitle>
        <CardDescription>
          {"Każdy " + days2.filter((day, idx) => {
            if (actAtTheseDays[idx]) return day
          }).join(", ") + "."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="w-full flex justify-between overflow-auto gap-2">
          {days.map((day, idx) => {
            return <Button variant="outline" 
                           className={cn(actAtTheseDays[idx] && "bg-yellow-300 text-background hover:bg-yellow-200 hover:text-background", "rounded-full aspect-square h-12 w-auto")} 
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