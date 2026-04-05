"use client";

import { useState } from "react";

interface RatingInputProps {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  value: number | null;
  onChange: (value: number) => void;
}

export default function RatingInput({
  min,
  max,
  minLabel,
  maxLabel,
  value,
  onChange,
}: RatingInputProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between mb-3 text-sm text-gray-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      <div
        className="flex justify-between gap-1"
        role="radiogroup"
        aria-label="Rating scale"
      >
        {values.map((v) => {
          const isSelected = value === v;
          const isHovered = hoveredValue === v;

          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${v} out of ${max}`}
              className={`
                flex items-center justify-center rounded-full transition-all duration-150
                min-w-[44px] min-h-[44px] text-base font-medium
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${
                  isSelected
                    ? "bg-blue-600 text-white scale-110 shadow-md"
                    : isHovered
                      ? "bg-blue-100 text-blue-700 scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
              onClick={() => onChange(v)}
              onMouseEnter={() => setHoveredValue(v)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}
