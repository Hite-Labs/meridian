"use client";

import { useEffect, useMemo, useState } from "react";

interface PublishModalProps {
  open: boolean;
  notes: string;
  clientFirstName: string;
  onCancel: () => void;
  onPublish: (payload: {
    allLinesPrivate: string[];
    sharedLines: string[];
    nextStepLines: string[];
  }) => void;
}

interface Row {
  index: number;
  text: string;
  shared: boolean;
  isNextStep: boolean;
}

export default function PublishModal({
  open,
  notes,
  clientFirstName,
  onCancel,
  onPublish,
}: PublishModalProps) {
  const initialRows = useMemo<Row[]>(() => {
    return notes
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text, index) => ({
        index,
        text,
        shared: false,
        isNextStep: false,
      }));
  }, [notes]);

  const [rows, setRows] = useState<Row[]>(initialRows);

  // Reset when reopened with different notes
  useEffect(() => {
    if (open) setRows(initialRows);
  }, [open, initialRows]);

  // Esc to cancel
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  function toggleShared(i: number) {
    setRows((prev) =>
      prev.map((r) =>
        r.index === i
          ? {
              ...r,
              shared: !r.shared,
              // If turning off share, also clear next-step
              isNextStep: !r.shared ? r.isNextStep : false,
            }
          : r,
      ),
    );
  }

  function toggleNextStep(i: number) {
    setRows((prev) =>
      prev.map((r) =>
        r.index === i
          ? {
              ...r,
              isNextStep: !r.isNextStep,
              // Next step implies share
              shared: !r.isNextStep ? true : r.shared,
            }
          : r,
      ),
    );
  }

  function handlePublish() {
    onPublish({
      allLinesPrivate: rows.map((r) => r.text),
      sharedLines: rows.filter((r) => r.shared && !r.isNextStep).map((r) => r.text),
      nextStepLines: rows.filter((r) => r.isNextStep).map((r) => r.text),
    });
  }

  const sharedPreview = rows.filter((r) => r.shared && !r.isNextStep);
  const nextStepsPreview = rows.filter((r) => r.isNextStep);

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-4 py-6 sm:py-10 overflow-y-auto">
      {/* Backdrop — warm dim, not purple */}
      <div
        className="fixed inset-0 bg-text-dark/35 backdrop-blur-[3px]"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-3xl card-luxe p-6 sm:p-8 rise rise-1">
        {/* Header */}
        <div className="mb-5">
          <div className="eyebrow mb-1.5">Publish</div>
          <h2 className="font-display italic text-2xl sm:text-3xl text-text-dark leading-tight">
            Choose what {clientFirstName} sees.
          </h2>
          <p className="text-sm text-text-mid font-light mt-1.5">
            Everything stays private by default. Tick to share, or mark as a next step.
          </p>
        </div>

        {/* Rows */}
        {rows.length === 0 ? (
          <div className="text-sm text-text-soft font-light italic py-6 text-center">
            Nothing to publish yet — write some notes first.
          </div>
        ) : (
          <div className="space-y-1.5">
            {rows.map((r) => (
              <div
                key={r.index}
                className={`group flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                  r.shared
                    ? "bg-accent-light/30 border-accent/30"
                    : "bg-transparent border-transparent hover:bg-base-mid/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleShared(r.index)}
                  aria-label={r.shared ? "Unshare" : "Share with client"}
                  className={`mt-0.5 w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-colors ${
                    r.shared
                      ? "bg-accent border-accent"
                      : "bg-transparent border-text-soft/40 hover:border-text-soft"
                  }`}
                >
                  {r.shared && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22142A"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleNextStep(r.index)}
                  aria-label={r.isNextStep ? "Remove next step" : "Mark as next step"}
                  title={r.isNextStep ? "Next step" : "Mark as next step"}
                  className={`mt-0.5 w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-colors ${
                    r.isNextStep
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-transparent border-text-soft/30 text-text-soft/60 hover:border-text-soft/60"
                  }`}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>

                <span
                  className={`flex-1 text-sm leading-relaxed ${
                    r.shared ? "text-text-dark" : "text-text-mid"
                  }`}
                >
                  {r.text}
                </span>

                {r.isNextStep && (
                  <span className="eyebrow !text-[9px] !tracking-[0.14em] text-primary shrink-0 mt-1">
                    Next step
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Preview */}
        {(sharedPreview.length > 0 || nextStepsPreview.length > 0) && (
          <div className="mt-6">
            <div className="gold-seam mb-5" />
            <div className="eyebrow mb-2">
              What {clientFirstName} will see
            </div>
            <div className="card-luxe p-5 bg-[#FAF6F8]">
              {sharedPreview.length > 0 && (
                <div className={nextStepsPreview.length > 0 ? "mb-4" : ""}>
                  <div className="text-[11px] font-light text-text-soft uppercase tracking-wide mb-1.5">
                    Session Highlights
                  </div>
                  <div className="space-y-1.5 text-sm text-text-mid leading-relaxed">
                    {sharedPreview.map((r) => (
                      <p key={r.index}>{r.text}</p>
                    ))}
                  </div>
                </div>
              )}
              {nextStepsPreview.length > 0 && (
                <div>
                  <div className="text-[11px] font-light text-text-soft uppercase tracking-wide mb-2">
                    Next Steps
                  </div>
                  <ul className="space-y-2">
                    {nextStepsPreview.map((r) => (
                      <li
                        key={r.index}
                        className="flex items-start gap-3 text-sm text-text-mid"
                      >
                        <span className="mt-0.5 w-5 h-5 rounded-md border border-accent/40 bg-accent-light/30 shrink-0 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        </span>
                        <span className="leading-relaxed">{r.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-text-mid font-medium text-sm hover:bg-base-mid/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={rows.length === 0}
            className="px-5 py-2.5 rounded-xl bg-primary-deep text-accent-light font-medium text-sm shadow-[0_10px_24px_-14px_rgba(60,24,104,0.7)] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
