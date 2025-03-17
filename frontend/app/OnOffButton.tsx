"use client";

import { Button } from "@/components/ui/button";

export default function OnOffButton({type, ws}: {type: "on" | "off", ws: WebSocket | null}) {
  const handleClick = () => {
    if (ws && ws?.readyState === WebSocket.OPEN) {
      const data = {brightness: (type === "on" ? 100 : 0)}
      ws.send(JSON.stringify(data));
    }    
  }

  return (
    <div>
      <Button variant={type === "on" ? "outline" : "destructive"} onClick={handleClick}>
        {type === "on" ? "Włącz" : "Wyłącz"}
      </Button>
    </div>
  );
}