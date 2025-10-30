"use client";

import Image from "next/image";

import { RoomComponent } from "@/components/room";
import { ConnectionProvider } from "@/hooks/use-connection";

export default function Home() {
  return (
    <ConnectionProvider>
      <div className="relative grid min-h-dvh w-full place-items-center overflow-hidden bg-gradient-to-br from-[#080808] via-[#151515] to-[#050505] px-4 py-6">
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-[-10%] h-96 w-96 rounded-full bg-purple-500/10 blur-[140px]" />
        <div className="relative mx-auto grid h-full min-h-dvh w-full max-w-5xl grid-rows-[76px_1fr_8px] rounded-3xl border border-white/10 bg-black/40 px-6 shadow-[0_32px_120px_-60px_rgba(0,0,0,0.85)] backdrop-blur-2xl lg:min-h-[640px] lg:max-h-[680px]">
          <header className="border-b border-white/10">
            <div className="flex items-center justify-between gap-4 py-5">
              <a href="https://groq.com" target="_blank">
                <Image
                  width={122.667}
                  height={64}
                  src="/images/groq-logomark.svg"
                  alt="Groq logo"
                  className="h-8 w-auto"
                />
              </a>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                  Voice Playground
                </p>
                <p className="text-sm text-white/70">
                  Built with{" "}
                  <a
                    href="https://docs.livekit.io/agents"
                    className="border-b border-transparent pb-[1px] text-white/80 transition hover:border-white/60"
                    target="_blank"
                  >
                    LiveKit Agents
                  </a>
                  {" "}and Groq’s blazing-fast inference.
                </p>
              </div>
            </div>
          </header>
          <RoomComponent />
        </div>
      </div>
    </ConnectionProvider>
  );
}
