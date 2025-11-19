"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

export type AnswerShape = "triangle" | "diamond" | "circle" | "square";

export type AnswerTileColor = { base: string; hover: string };

export function AnswerTile({
  index,
  label,
  shape,
  color,
  selected,
  correct,
  disabled,
  teams,
  onClick,
}: {
  index: number;
  label: string;
  shape: AnswerShape;
  color: AnswerTileColor;
  selected?: boolean;
  correct?: boolean;
  disabled?: boolean;
  teams?: string[];
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "focus-visible:ring-ring rounded-2xl p-4 text-left transition focus:outline-none focus-visible:ring-2",
        "flex min-h-40 items-stretch gap-4 sm:min-h-48 sm:gap-5 md:min-h-56 lg:min-h-64",
        color.base,
        color.hover,
        disabled ? "opacity-80" : "",
        selected ? "ring-2 ring-black/30" : "",
        correct ? "ring-4 ring-emerald-400" : "",
        "text-white",
      ].join(" ")}
      aria-pressed={disabled ? undefined : selected}
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-white/20 sm:h-14 sm:w-14 md:h-16 md:w-16">
        <ShapeIcon shape={shape} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div className="flex items-start justify-between gap-4">
          <span className="truncate text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
            {label}
          </span>
          <span className="text-base font-bold text-white/80 md:text-lg lg:text-xl">
            {index + 1}
          </span>
        </div>
        {teams && teams.length > 0 && (
          <div className="mt-2 flex flex-wrap content-end gap-1.5">
            {teams.map((team) => (
              <Badge
                key={team}
                variant="secondary"
                className="border-none bg-black/20 whitespace-nowrap text-white hover:bg-black/30"
              >
                {team}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

function ShapeIcon({ shape }: { shape: AnswerShape }) {
  switch (shape) {
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current md:h-8 md:w-8" aria-hidden>
          <polygon points="12,4 22,20 2,20" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current md:h-8 md:w-8" aria-hidden>
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current md:h-8 md:w-8" aria-hidden>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "square":
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current md:h-8 md:w-8" aria-hidden>
          <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>
      );
  }
}
