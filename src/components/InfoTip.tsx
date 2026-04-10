"use client";

import { useEffect, useRef, useState } from "react";

interface InfoTipProps {
  /** Popover body. Plain string or JSX. */
  children: React.ReactNode;
  /** Accessible label for the trigger. */
  label?: string;
  /** Popover alignment relative to the trigger. */
  align?: "left" | "right";
}

export default function InfoTip({
  children,
  label = "More info",
  align = "right",
}: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`w-4 h-4 rounded-full border text-[10px] font-medium leading-none flex items-center justify-center transition-colors ${
          open
            ? "bg-text-mid text-base border-text-mid"
            : "border-text-soft/50 text-text-soft hover:border-text-mid hover:text-text-mid"
        }`}
      >
        ?
      </button>
      {open && (
        <div
          role="tooltip"
          className={`absolute z-30 top-full mt-2 w-72 card-luxe p-4 text-xs font-light text-text-mid leading-relaxed ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
