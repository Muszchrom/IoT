'use client';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { pad } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface TimePickerProps {
  selectedTimeInSeconds: number,
  setSelectedTimeInSeconds: (val: number) => void,
  fun?: (secs: number) => void
}

export default function TimePicker({selectedTimeInSeconds, setSelectedTimeInSeconds, fun}: TimePickerProps) {
  const [hoursApi, setHoursApi] = useState<CarouselApi>();
  const [minutesApi, setMinutesApi] = useState<CarouselApi>();

  const [x, y] = ((t) => {
    const tInMins = t/60;
    return [(tInMins - tInMins % 60)/60, tInMins % 60]
  })(selectedTimeInSeconds);

  const [hours, setHours] = useState(x)
  const [minutes, setMinutes] = useState(y)
  const timeRef = useRef<{hours: number, minutes: number}>({hours, minutes});

  // CarouselItem height??????
  const CAROUSEL_ITEM_SIZE = 40;

  useEffect(() => {
    if (fun) {
      fun(hours * 3600 + minutes * 60)
    }
    timeRef.current = {hours, minutes};
  }, [hours, minutes]);

  useEffect(() => {
    return () => setSelectedTimeInSeconds(timeRef.current.hours * 3600 + timeRef.current.minutes * 60);
  }, [setSelectedTimeInSeconds]);

  useEffect(() => {
    if (!hoursApi) return;
    setHours(hoursApi.selectedScrollSnap())
    hoursApi.on("select", () => setHours(hoursApi.selectedScrollSnap()))
    hoursApi.on('pointerUp', (hoursApi) => {
      const { scrollTo, target, location } = hoursApi.internalEngine()
      const diffToTarget = target.get() - location.get()
      const factor = Math.abs(diffToTarget) < CAROUSEL_ITEM_SIZE / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      scrollTo.distance(distance, true)
    })
  }, [hoursApi]);

  useEffect(() => {
    if (!minutesApi) return;
    setMinutes(minutesApi.selectedScrollSnap())
    minutesApi.on("select", () => setMinutes(minutesApi.selectedScrollSnap()))
    minutesApi.on('pointerUp', (minutesApi) => {
      const { scrollTo, target, location } = minutesApi.internalEngine()
      const diffToTarget = target.get() - location.get()
      const factor = Math.abs(diffToTarget) < CAROUSEL_ITEM_SIZE / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      scrollTo.distance(distance, true)
    })
  }, [minutesApi]);

  return (
    <div className="flex flex-col gap-6">
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
        
        <VerticalCarousel initVal={x} api={hoursApi} setApi={setHoursApi} len={24}/>
        <VerticalCarousel initVal={y} api={minutesApi} setApi={setMinutesApi} len={60}/>
      </div>
    </div>
  )
}


interface VerticalCarouselProps {
  initVal: number,
  api: CarouselApi, 
  setApi: (api: CarouselApi) => void, 
  len: number, 
}

function VerticalCarousel({initVal, api, setApi, len}: VerticalCarouselProps) {
  return (
    <Carousel setApi={setApi} opts={{startIndex: initVal, axis: 'y', dragFree: true, containScroll: false, watchSlides: false, align: "center"}} orientation="vertical" className="w-full">
      <CarouselContent className="-mt-[.09rem] h-[200px]">
        {Array.from({length: len}).map((_, index) => (
          <CarouselItem key={index} className="basis-0 p-1">
            <div className="p-0" onClick={() => api?.scrollTo(index)}>
              <div className="p-1 border-none">
                <div className="flex items-center justify-center p-0">
                  <span className={"font-semibold text-primary"}>{pad(index)}</span>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}