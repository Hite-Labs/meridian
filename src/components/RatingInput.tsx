"use client";

import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";

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
  const range = max - min + 1;

  // For small scales (up to 6 values), use buttons — they fit fine on mobile
  if (range <= 6) {
    return (
      <ButtonRating
        min={min}
        max={max}
        minLabel={minLabel}
        maxLabel={maxLabel}
        value={value}
        onChange={onChange}
      />
    );
  }

  // For larger scales (7+), use a slider — buttons won't fit on mobile
  return (
    <SliderRating
      min={min}
      max={max}
      minLabel={minLabel}
      maxLabel={maxLabel}
      value={value}
      onChange={onChange}
    />
  );
}

function ButtonRating({
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
    <div className="w-full max-w-sm mx-auto">
      <div className="flex justify-between mb-3 text-sm font-light text-text-soft">
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
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                ${
                  isSelected
                    ? "bg-primary text-white scale-110 shadow-md"
                    : isHovered
                      ? "bg-primary-light/40 text-primary-deep scale-105"
                      : "bg-base-mid text-text-mid hover:bg-primary-light/30"
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

function SliderRating({
  min,
  max,
  minLabel,
  maxLabel,
  value,
  onChange,
}: RatingInputProps) {
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Current value display */}
      <div className="text-center mb-6">
        {value !== null ? (
          <span className="text-5xl font-display italic text-primary tabular-nums">{value}</span>
        ) : (
          <span className="text-5xl font-display text-text-soft">—</span>
        )}
      </div>

      {/* Slider */}
      <Slider.Root
        className="relative flex items-center select-none touch-none h-12"
        min={min}
        max={max}
        step={1}
        value={value !== null ? [value] : [Math.round((min + max) / 2)]}
        onValueChange={([v]) => onChange(v)}
      >
        <Slider.Track className="relative grow rounded-full h-2 bg-base-mid">
          <Slider.Range className="absolute h-full rounded-full bg-primary" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-8 h-8 bg-base border-2 border-primary rounded-full shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-shadow"
          aria-label="Rating value"
        />
      </Slider.Root>

      {/* Tick marks */}
      <div className="flex justify-between mt-1 px-[14px]">
        {ticks.map((t) => (
          <span
            key={t}
            className={`text-xs tabular-nums ${
              value === t ? "text-primary font-medium" : "text-text-soft"
            }`}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-sm font-light text-text-soft">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
