"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/play/Countdown";
<<<<<<< HEAD
=======
import { Maximize, Minimize, SkipForward } from "lucide-react";
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f

export function PlayHeader({
  countdownKey,
  seconds,
  questionIndicator,
  isFullscreen,
  onToggleFullscreen,
  reveal,
  onToggleReveal,
  onNext,
<<<<<<< HEAD
=======
  onSkip,
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
  disableNext,
  fullscreenLabel,
  exitFullscreenLabel,
  revealLabel,
  hideLabel,
  nextLabel,
<<<<<<< HEAD
=======
  skipLabel = "Skip",
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
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
<<<<<<< HEAD
=======
  onSkip?: () => void;
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
  disableNext?: boolean;
  fullscreenLabel: string;
  exitFullscreenLabel: string;
  revealLabel: string;
  hideLabel: string;
  nextLabel: string;
<<<<<<< HEAD
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
=======
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
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
      </div>
    </div>
  );
}
