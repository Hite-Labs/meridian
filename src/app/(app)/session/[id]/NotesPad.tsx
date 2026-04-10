"use client";

import { useEffect, useRef, useState } from "react";

interface NotesPadProps {
  sessionId: string;
  onChange: (value: string) => void;
  initialValue?: string;
}

const DRAFT_KEY = (id: string) => `meridian:session-draft:${id}`;

export default function NotesPad({
  sessionId,
  onChange,
  initialValue = "",
}: NotesPadProps) {
  const [value, setValue] = useState(initialValue);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load draft on mount
  useEffect(() => {
    const stored = typeof window !== "undefined"
      ? window.localStorage.getItem(DRAFT_KEY(sessionId))
      : null;
    if (stored) {
      setValue(stored);
      onChange(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Auto-grow
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.max(ta.scrollHeight, 480)}px`;
  }, [value]);

  // Debounced persist
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(DRAFT_KEY(sessionId), value);
        setSavedAt(Date.now());
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, sessionId]);

  const saveLabel = savedAt
    ? "Draft saved"
    : value.length > 0
      ? "Saving…"
      : "";

  return (
    <div className="card-luxe p-5 sm:p-7">
      <div className="flex items-center justify-between mb-3">
        <div className="eyebrow">Session Notes</div>
        <div className="text-[11px] font-light text-text-soft tabular-nums min-h-[14px]">
          {saveLabel}
        </div>
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={"Start typing… one idea per line.\n\nThe client sees nothing until you publish."}
        className="w-full min-h-[480px] resize-none bg-transparent text-text-dark font-sans text-base leading-relaxed placeholder-text-soft/60 focus:outline-none"
      />
    </div>
  );
}
