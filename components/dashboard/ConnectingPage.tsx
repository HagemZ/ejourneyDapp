import React from "react";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import ConnectButtonCustom from "@/components/ConnectButtonCustom";
 
export function ConnectingPage() {
  return (

        <div className="relative flex flex-col items-center justify-center h-screen">
      <section className="text-center z-20 relative space-y-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-[10px] p-8 shadow-lg">
        <div className="space-y-2">
          <h1 className="text-balance text-7xl font-semibold leading-none tracking-tighter text-muted-foreground">
            Connect your{" "}account          
          </h1>
          <h2 className="text-xl text-muted-foreground">
            eJourney is available on <strong>Lisk Network</strong>           
          </h2>
        </div>
        <ConnectButtonCustom />
      </section>
      <FlickeringGrid className="absolute inset-0 z-0" />
    </div>
  );
}