"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/play/Countdown";

export function PlayHeader({
  countdownKey,
  seconds,
  questionIndicator,
  isFullscreen,
  onToggleFullscreen,
  reveal,
  onToggleReveal,
  onNext,
  disableNext,
  fullscreenLabel,
  exitFullscreenLabel,
  revealLabel,
  hideLabel,
  nextLabel,
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
  disableNext?: boolean;
  fullscreenLabel: string;
  exitFullscreenLabel: string;
  revealLabel: string;
  hideLabel: string;
  nextLabel: string;
  onTimerEnd: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Countdown key={countdownKey} seconds={seconds} onEnd={onTimerEnd} />
        <div className="text-muted-foreground text-base md:text-lg">{questionIndicator}</div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onToggleFullscreen}
          className="text-base md:text-lg"
          aria-label={isFullscreen ? exitFullscreenLabel : fullscreenLabel}
        >
          {isFullscreen ? exitFullscreenLabel : fullscreenLabel}
        </Button>
        <Button variant="secondary" onClick={onToggleReveal}>
          {reveal ? hideLabel : revealLabel}
        </Button>
        <Button onClick={onNext} disabled={Boolean(disableNext)} className="text-base md:text-lg">
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
