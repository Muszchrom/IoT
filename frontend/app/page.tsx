"use client";
// import { useState } from "react";
import Wrapper from "@/components/wrapper";
import LightBulbSVG from "@/components/svg/light-bulb-svg";
import Link from "next/link";

export default function Home() {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  // const [messages, setMessages] = useState<string[]>([]);



  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:8080");

  //   ws.onopen = () => {
  //     console.log("Connected to ws server");
  //     setSocket(ws);
  //   }
    
  //   ws.onmessage = async (event) => {
  //     const dataReceived = await event.data.text();
  //     console.log("Received: ", JSON.parse(dataReceived));
  //     setMessages((prev) => [dataReceived, ...prev]);
  //   };

  //   ws.onclose = () => {
  //     console.log("Rozłączono z WebSocket");
  //   };

  //   return () => ws.close();
  // }, []);

  // const handleValueChange = (val: number[]) => {
  //   const value = val[0]; 
  //   if (socket && socket?.readyState === WebSocket.OPEN) {
  //     const data = {brightness: value}
  //     socket.send(JSON.stringify(data));
  //   }   
  // }

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] flex flex-col justify-center">
      {/* <div className="w-4 h-4 bg-red-500">
      </div>
      <div className="flex flex-col gap-8">
        <Slider defaultValue={[33]} max={100} step={1} onValueChange={(i) => handleValueChange(i)}/>
        <div className="flex justify-between gap-4 w-full">
          <OnOffButton type="on" ws={socket}/>
          <OnOffButton type="off" ws={socket}/>
        </div>
      </div> */}
      <Wrapper>
        <Link href="/device" className="bg-card text-card-foreground inline-flex gap-2 rounded-xl border py-6 px-4 shadow-sm">
          <LightBulbSVG isOn={true} size="24px"/> Pasek LED
        </Link>
      </Wrapper>
    </div>
  );
}
