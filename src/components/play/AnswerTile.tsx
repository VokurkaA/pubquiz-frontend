"use client";

import React from "react";

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
  onClick,
}: {
  index: number;
  label: string;
  shape: AnswerShape;
  color: AnswerTileColor;
  selected?: boolean;
  correct?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-2xl p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "flex items-center gap-5 sm:gap-6 min-h-40 sm:min-h-48 md:min-h-56 lg:min-h-64",
        color.base,
        color.hover,
        disabled ? "opacity-80" : "",
        selected ? "ring-2 ring-black/30" : "",
        correct ? "ring-4 ring-emerald-400" : "",
        "text-white",
      ].join(" ")}
      aria-pressed={disabled ? undefined : selected}
    >
      <div className="bg-white/20 grid h-12 w-12 place-items-center rounded-md sm:h-14 sm:w-14 md:h-16 md:w-16">
        <ShapeIcon shape={shape} />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <span className="truncate text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
          {label}
        </span>
        <span className="text-white/80 text-base font-bold md:text-lg lg:text-xl">
          {index + 1}
        </span>
      </div>
    </button>
  );
}

function ShapeIcon({ shape }: { shape: AnswerShape }) {
  switch (shape) {
    case "triangle":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 md:h-8 md:w-8 fill-current"
          aria-hidden
        >
          <polygon points="12,4 22,20 2,20" />
        </svg>
      );
    case "diamond":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 md:h-8 md:w-8 fill-current"
          aria-hidden
        >
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      );
    case "circle":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 md:h-8 md:w-8 fill-current"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "square":
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 md:h-8 md:w-8 fill-current"
          aria-hidden
        >
          <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>
      );
  }
}
