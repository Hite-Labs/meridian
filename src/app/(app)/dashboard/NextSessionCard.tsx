"use client";

import Link from "next/link";

interface NextSessionCardProps {
  clientId: string;
  /** ISO date string — if null, unscheduled state */
  scheduledAt: string | null;
  /** id to route the notes view to when scheduled */
  nextSessionId: string | null;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    .toLowerCase();
}

function relativeFromNow(iso: string): string {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays > 1 && diffDays < 14) return `in ${diffDays} days`;
  if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;
  return "";
}

export default function NextSessionCard({
  scheduledAt,
  nextSessionId,
}: NextSessionCardProps) {
  const isScheduled = scheduledAt !== null && nextSessionId !== null;

  return (
    <div className="relative card-luxe overflow-hidden">
      <span
        aria-hidden
        className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-accent/80"
      />

      <div className="pl-5 pr-5 py-5 sm:py-6 flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="hidden sm:flex w-11 h-11 rounded-full bg-accent-light/60 border border-accent/30 items-center justify-center shrink-0 shadow-[0_6px_16px_-10px_rgba(196,154,40,0.6)]">
            <CalendarIcon />
          </div>
          <div className="flex-1 min-w-0">
            <div className="eyebrow mb-1">Next Session</div>
            {isScheduled && scheduledAt ? (
              <>
                <div className="font-display italic text-text-dark text-xl sm:text-2xl leading-tight truncate">
                  {formatDate(scheduledAt)} &middot; {formatTime(scheduledAt)}
                </div>
                <div className="text-xs font-light text-text-soft mt-0.5">
                  {relativeFromNow(scheduledAt)}
                </div>
              </>
            ) : (
              <>
                <div className="font-display italic text-text-mid text-xl sm:text-2xl leading-tight">
                  Nothing scheduled.
                </div>
                <div className="text-xs font-light text-text-soft mt-0.5">
                  Send a Calendly link to book their first session.
                </div>
              </>
            )}
          </div>
        </div>

        {isScheduled && nextSessionId ? (
          <Link
            href={`/session/${nextSessionId}`}
            className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-primary-deep text-accent-light font-medium text-sm shadow-[0_10px_24px_-14px_rgba(60,24,104,0.7)] hover:bg-primary transition-colors"
          >
            Open session notes
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-primary-deep text-accent-light font-medium text-sm shadow-[0_10px_24px_-14px_rgba(60,24,104,0.7)] hover:bg-primary transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Schedule via Calendly
          </button>
        )}
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7B5B12"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
