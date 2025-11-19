"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/play/Countdown";
import { Maximize, Minimize, SkipForward } from "lucide-react";

export function PlayHeader({
  countdownKey,
  seconds,
  questionIndicator,
  isFullscreen,
  onToggleFullscreen,
  reveal,
  onToggleReveal,
  onNext,
  onSkip,
  disableNext,
  fullscreenLabel,
  exitFullscreenLabel,
  revealLabel,
  hideLabel,
  nextLabel,
  skipLabel = "Skip",
  onTimerEnd,
}: {
  countdownKey: number;
  seconds: number;
  questionIndicator: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  reveal: boolean;
  onToggleReveal: () => void;
  onNext: () => void;
  onSkip?: () => void;
  disableNext?: boolean;
  fullscreenLabel: string;
  exitFullscreenLabel: string;
  revealLabel: string;
  hideLabel: string;
  nextLabel: string;
  skipLabel?: string;
  onTimerEnd: () => void;
}) {
  return (
    <div className="bg-background/80 flex items-center justify-between gap-4 rounded-xl border p-2 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-4 pl-2">
        <Countdown key={countdownKey} seconds={seconds} onEnd={onTimerEnd} />
        <div className="text-muted-foreground font-mono text-lg font-medium tracking-tight">
          {questionIndicator}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onSkip && (
          <Button variant="ghost" onClick={onSkip} disabled={disableNext} title={skipLabel}>
            <SkipForward className="mr-2 size-4" />
            {skipLabel}
          </Button>
        )}
        <Button variant="secondary" onClick={onToggleReveal} className="min-w-[100px]">
          {reveal ? hideLabel : revealLabel}
        </Button>
        <Button
          onClick={onNext}
          disabled={Boolean(disableNext)}
          className="min-w-[100px] font-semibold"
        >
          {nextLabel}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFullscreen}
          className="ml-2"
          aria-label={isFullscreen ? exitFullscreenLabel : fullscreenLabel}
        >
          {isFullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
        </Button>
      </div>
    </div>
  );
}
