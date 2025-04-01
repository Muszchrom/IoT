"use client";
// import { useState } from "react";
import Wrapper from "@/components/wrapper";
import LightBulbSVG from "@/components/svg/light-bulb-svg";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen font-[family-name:var(--font-geist-sans)] flex flex-col">
      <Wrapper>
        <h1 className="text-2xl font-bold tracking-wide">OpenLights</h1>
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground">Podłączone urządzenia</span>
          <Link href="/device" className="bg-card text-card-foreground inline-flex gap-2 rounded-xl border py-6 px-4 shadow-sm">
            <LightBulbSVG isOn={true} size="24px"/> Pasek LED
          </Link>
          <div className="flex justify-center bg-card text-card-foreground gap-2 rounded-xl border py-4 px-4 shadow-sm">
            <div className="flex flex-col items-center">
              <Plus />
              <span className="text-muted-foreground text-sm -mt-[4px]">
                Dodaj urządzenie
              </span>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
