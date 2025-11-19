"use client";

import React, { useEffect, useState } from "react";

export function Countdown({ seconds, onEnd }: { seconds: number; onEnd?: () => void }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    setLeft(seconds);
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          onEnd?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [seconds, onEnd]);

  const total = Number.isFinite(seconds) && seconds > 0 ? seconds : 1; // guard
  const pct = Math.max(0, Math.min(100, (left / total) * 100));
  const center = 32;
  const radius = 24;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 64 64" className="h-14 w-14 md:h-16 md:w-16" aria-hidden>
        <circle cx={center} cy={center} r={radius} stroke="#e5e7eb" strokeWidth={6} fill="none" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#10b981"
          strokeWidth={6}
          fill="none"
          strokeDasharray={`${dash} ${circ - dash}`}
          transform={`rotate(-90 ${center} ${center})`}
          strokeLinecap="round"
        />
        <text
          x={center}
          y={center + 4}
          textAnchor="middle"
          className="fill-current text-base md:text-lg"
        >
          {left}
        </text>
      </svg>
    </div>
  );
}
