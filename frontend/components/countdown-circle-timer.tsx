import { useEffect, useState } from "react";

export default function CountdownCircleTimer({ 
  initDelayInSeconds, 
  initTimestamp,
  emergencyStopFunction
}: {
  initDelayInSeconds: number,
  initTimestamp: number,
  emergencyStopFunction: () => void
}) {
  const [elapsed, setElapsed] = useState(60);
  const circumference = 2 * Math.PI * 50; // Radius of the circle is 50
  
  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.floor(initDelayInSeconds - ((now - initTimestamp) * 0.001));
      if (diff < 0) return emergencyStopFunction(); // if backend didnt send update that would turn off this window, prevent negative values and stick to 0.
      setElapsed(diff);
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [initTimestamp]);

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
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
            r="50" // Radius
            cx="50%"
            cy="50%"
            style={{ strokeDasharray: 2 * Math.PI * 50, strokeDashoffset: circumference - elapsed/initDelayInSeconds*circumference}}
          />
        </svg>
        <div className="timer-text text-3xl font-semibold absolute top-1/2 left-1/2 transform -translate-1/2">
          {formatTime(elapsed)}
        </div>
      </div>
    </div>
  );
}