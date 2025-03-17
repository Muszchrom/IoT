import { useEffect, useRef } from "react";

interface CountdownCircleTimerProps {
  initValue: number,
  currentValue: number
}

export default function CountdownCircleTimer({ initValue, currentValue }: CountdownCircleTimerProps) {
  const circleRef = useRef<SVGCircleElement | null>(null);
  useEffect(() => {
    if (circleRef.current) {
      const circumference = 2 * Math.PI * 50; // Radius of the circle is 50
      const offset = circumference - (currentValue / initValue) * circumference;
      circleRef.current.style.strokeDashoffset = "" + offset;
    }
  }, [currentValue, initValue]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="aspect-square relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-3/4 max-w-xs" viewBox="0 0 110 110">
          <circle className="stroke-stone-700" strokeWidth="2" fill="transparent" r="50" cx="50%" cy="50%"/>
          <circle
            className="stroke-yellow-300"
            ref={circleRef}
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
            r="50"
            cx="50%"
            cy="50%"
            style={{ strokeDasharray: 2 * Math.PI * 50 }}
          />
        </svg>
        <div className="timer-text text-3xl font-semibold absolute top-1/2 left-1/2 transform -translate-1/2">
          {formatTime(currentValue)}
        </div>
      </div>
    </div>
  );
}