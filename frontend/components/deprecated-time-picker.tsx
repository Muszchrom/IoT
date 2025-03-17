'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CountdownCircleTimer from "./countdown-circle-timer";

const pad = (num: number | string) => {
  num = num.toString();
  return num.length < 2 ? "0" + num : num; 
}

export default function TimePicker() {
  const [api, setApi] = useState<CarouselApi>();
  const [api2, setApi2] = useState<CarouselApi>();
  const [turnOnDevice, setTurnOnDevice] = useState(false);
  const [counting, setCounting] = useState(false);

  const [current, setCurrent] = useState(0)
  const [current2, setCurrent2] = useState(0)


  // CarouselItem height??????
  const CAROUSEL_ITEM_SIZE = 40;
  useEffect(() => {console.log(current, current2)}, [current, current2])

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
    api.on('pointerUp', (api) => {
      const { scrollTo, target, location } = api.internalEngine()
      const diffToTarget = target.get() - location.get()
      const factor = Math.abs(diffToTarget) < CAROUSEL_ITEM_SIZE / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      scrollTo.distance(distance, true)
    })
  }, [api]);

  useEffect(() => {
    if (!api2) return;
    setCurrent2(api2.selectedScrollSnap() + 1)
    api2.on("select", () => setCurrent2(api2.selectedScrollSnap() + 1))
    api2.on('pointerUp', (api2) => {
      const { scrollTo, target, location } = api2.internalEngine()
      const diffToTarget = target.get() - location.get()
      const factor = Math.abs(diffToTarget) < CAROUSEL_ITEM_SIZE / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      scrollTo.distance(distance, true)
    })
  }, [api2]);

  const startCounter = () => {
    setCounting(!counting);
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Minutnik</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {counting ? (
          <>
            <CountdownCircleTimer initialTimeInSeconds={current*60*60 + current2*60} stopCounter={startCounter} />
          </>
        ) : (
          <>
            <div className="flex gap-6 flex-row relative select-none">
              <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none z-10 flex flex-col overflow-hidden rounded-xl">
                <div className="grow bg-gradient-to-t from-transparent to-background">
                  <div className="w-full h-full bg-gradient-to-t from-transparent to-30% to-background opacity-50"></div>
                </div>

                <div className="h-[34px] border-b-2 flex gap-6">
                  <div className="w-full flex items-center justify-center">
                    <div className="h-4 w-4 relative">
                      <div className="absolute top-1/2 transform -translate-y-1/2 left-[24px]">
                        <span className="">godz</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <div className="h-4 w-4 relative">
                      <div className="absolute top-1/2 transform -translate-y-1/2 left-[24px]">
                        <span className="">min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grow bg-gradient-to-b from-transparent to-background">
                  <div className="w-full h-full bg-gradient-to-t from-transparent to-30% to-background opacity-50"></div>
                </div>
              </div>
              
              <VerticalCarousel api={api} setApi={setApi} len={24} startAtZero/>
              <VerticalCarousel api={api2} setApi={setApi2} len={59}/>
            </div>

            <div className="flex flex-col w-full">
              <Button type="button" variant="outline" className="p-6 border-b-0 rounded-b-none justify-between" onClick={() => setTurnOnDevice(true)}>
                Włącz urządzenie
                <div className={cn(!turnOnDevice && "hidden")}><Check /></div>
              </Button>
              <Button type="button" variant="outline" className="p-6 rounded-t-none justify-between" onClick={() => setTurnOnDevice(false)}>
                Wyłącz urządzenie
                <div className={cn(turnOnDevice && "hidden")}><Check /></div>
              </Button>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="justify-between">
        <div>
          {counting && (turnOnDevice ? "Włączy urządzenie" : "Wyłączy urządzenie")}
        </div>
        <Button variant={counting ? "destructive" : "default"} className="ml-auto font-bold px-8" onClick={startCounter}>{counting ? "stop" : "Start"}</Button>
      </CardFooter>
    </Card>
  )
}


function VerticalCarousel({api, setApi, len, startAtZero}: {api: CarouselApi, setApi: (api: CarouselApi) => void, len: number, startAtZero?: boolean}) {
  return (
    <Carousel setApi={setApi} opts={{axis: 'y', dragFree: true, containScroll: false, watchSlides: false, align: "center"}} orientation="vertical" className="w-full">
      <CarouselContent className="-mt-[.09rem] h-[200px]">
        {Array.from({length: len}).map((_, index) => (
          <CarouselItem key={index} className="basis-0 p-1">
            <div className="p-0" onClick={() => api?.scrollTo(index)}>
              <Card className="p-1 border-none">
                <CardContent className="flex items-center justify-center p-0">
                  <span className={"font-semibold text-primary"}>{pad(index + (startAtZero ? 0 : 1))}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}