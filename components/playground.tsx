"use client";

import { useEffect, useMemo } from "react";
import {
  useConnectionState,
  useLocalParticipant,
  useTracks,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";

import { Button, LoadingSVG } from "@/components/ui/button";
import { MicrophoneButton } from "@/components/microphone-button";
import { useMultibandTrackVolume } from "@/hooks/use-track-volume";
import { cn } from "@/lib/utils";
import { Typewriter } from "./typewriter";

export interface PlaygroundProps {
  onConnect: (connect: boolean) => void;
}

export function Playground({ onConnect }: PlaygroundProps) {
  const { localParticipant } = useLocalParticipant();

  const roomState = useConnectionState();
  const tracks = useTracks();

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, roomState]);

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );

  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );

  const localMultibandVolume = useMultibandTrackVolume(
    localMicTrack?.publication.track,
    9
  );

  const statusConfig = useMemo(() => {
    switch (roomState) {
      case ConnectionState.Connected:
        return {
          label: "Connected",
          description:
            "You are streaming audio to the Groq agent. Start speaking and watch the transcript build in real-time.",
          indicator: "bg-emerald-400",
          highlight: "text-emerald-200",
        } as const;
      case ConnectionState.Connecting:
        return {
          label: "Connecting",
          description:
            "We are provisioning your LiveKit room and enabling noise reduction. This usually takes just a moment.",
          indicator: "bg-amber-300",
          highlight: "text-amber-100",
        } as const;
      default:
        return {
          label: "Disconnected",
          description:
            "Get started by launching a session. We'll automatically enable your microphone when you're connected.",
          indicator: "bg-white/40",
          highlight: "text-white/60",
        } as const;
    }
  }, [roomState]);

  const audioTileContent = useMemo(() => {
    const isLoading = roomState === ConnectionState.Connecting;
    const isActive = !isLoading && roomState !== ConnectionState.Disconnected;

    const conversationToolbar = (
      <div className="w-full absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
        <motion.div
          className="flex justify-between gap-3 px-2"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <MicrophoneButton
            localMultibandVolume={localMultibandVolume}
            isSpaceBarEnabled={true}
          />
          <Button
            className="aspect-square h-10 w-10"
            size="small"
            state="secondary"
            onClick={() =>
              onConnect(roomState === ConnectionState.Disconnected)
            }
            aria-label={
              roomState === ConnectionState.Disconnected
                ? "Connect to session"
                : "Disconnect from session"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3.33325 3.3335L12.6666 12.6668M12.6666 3.3335L3.33325 12.6668"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </Button>
        </motion.div>
      </div>
    );

    const startConversationButton = (
      <div className="absolute top-1/2 -translate-y-1/2">
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <Button
            state="primary"
            size="large"
            className="relative w-full overflow-hidden"
            disabled={isLoading}
            onClick={() =>
              onConnect(roomState === ConnectionState.Disconnected)
            }
          >
            <span
              className={cn(
                "transition-opacity duration-200",
                isLoading ? "opacity-0" : "opacity-100",
              )}
            >
              Start live transcription
            </span>
            {isLoading ? (
              <span className="absolute inset-0 flex items-center justify-center">
                <LoadingSVG diameter={16} strokeWidth={3} />
              </span>
            ) : null}
          </Button>
        </motion.div>
      </div>
    );

    const visualizerContent = (
      <div className="flex h-full w-full flex-col justify-between">
        <div className="min-h-12 h-12 w-full relative">
          <AnimatePresence>
            {!isActive ? startConversationButton : null}
          </AnimatePresence>
          <AnimatePresence>
            {isActive ? conversationToolbar : null}
          </AnimatePresence>
        </div>
      </div>
    );

    return visualizerContent;
  }, [localMultibandVolume, roomState, onConnect]);

  return (
    <>
      <div className="relative flex h-full w-full flex-col gap-6">
        <motion.section
          key={statusConfig.label}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm shadow-[0_18px_80px_-40px_rgba(15,15,15,0.6)] backdrop-blur-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.45)]",
                statusConfig.indicator,
              )}
            />
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">
              {statusConfig.label}
            </p>
          </div>
          <p className={cn("mt-3 leading-relaxed text-white/80", statusConfig.highlight)}>
            {statusConfig.description}
          </p>
        </motion.section>
        <Typewriter typingSpeed={25} className="flex-1" />
        <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-black/25 px-3 pb-4 pt-3 backdrop-blur-2xl">
          {audioTileContent}
        </div>
      </div>
    </>
  );
}
