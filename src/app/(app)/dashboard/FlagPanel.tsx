"use client";

import { useState } from "react";
import { instrumentLabel, label as getLabel } from "@/lib/labels";

interface FlagPanelProps {
  flags: Array<{
    id: string;
    session_id: string | null;
    severity: string;
    rule_key: string;
    instrument: string | null;
    message: string;
    suggested_language: string | null;
    acknowledged: boolean;
    created_at: string;
  }>;
  sessions: Array<{
    id: string;
    session_number: number;
  }>;
}

const severityOrder: Record<string, number> = {
  red: 0,
  amber: 1,
  green: 2,
  info: 3,
};

const bannerDotStyles: Record<string, string> = {
  red: "bg-danger",
  amber: "bg-accent",
};

export default function FlagPanel({ flags, sessions }: FlagPanelProps) {
  const [expandedLanguage, setExpandedLanguage] = useState<Set<string>>(
    new Set()
  );
  const [showHistory, setShowHistory] = useState(false);

  const activeFlags = flags
    .filter((f) => !f.acknowledged)
    .sort(
      (a, b) =>
        (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4) ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  // Concerns = red/amber active flags (shown prominently)
  const concerns = activeFlags.filter(
    (f) => f.severity === "red" || f.severity === "amber"
  );

  // History = green flags + acknowledged + info (collapsible)
  const historyFlags = [
    ...activeFlags.filter(
      (f) => f.severity === "green" || f.severity === "info"
    ),
    ...flags.filter((f) => f.acknowledged),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Graduation signal gets special treatment
  const graduationFlag = activeFlags.find(
    (f) => f.rule_key === "graduation_signal"
  );

  // Nothing to show at all
  if (concerns.length === 0 && historyFlags.length === 0 && !graduationFlag) {
    return null;
  }

  function getSessionLabel(sessionId: string | null): string {
    if (!sessionId) return "Intake";
    const session = sessions.find((s) => s.id === sessionId);
    return session ? `Session ${session.session_number}` : "";
  }

  function toggleLanguage(flagId: string) {
    setExpandedLanguage((prev) => {
      const next = new Set(prev);
      if (next.has(flagId)) {
        next.delete(flagId);
      } else {
        next.add(flagId);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {/* Graduation milestone */}
      {graduationFlag && (
        <div className="p-4 bg-success/10 rounded-2xl border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-success"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-success">
              Graduation Milestone
            </span>
          </div>
          <p className="text-sm text-success">{graduationFlag.message}</p>
        </div>
      )}

      {/* Active concerns — clean banner style */}
      {concerns
        .filter((f) => f.rule_key !== "graduation_signal")
        .map((flag) => (
          <div
            key={flag.id}
            className={`p-4 rounded-2xl border shadow-sm ${
              flag.severity === "amber"
                ? "bg-accent-light/50 border-accent-light"
                : flag.severity === "red"
                  ? ""
                  : "bg-base border-base-mid"
            }`}
            style={
              flag.severity === "red"
                ? { backgroundColor: "#F8E0E8", borderColor: "#E8C0C8" }
                : undefined
            }
          >
            <div className="flex items-start gap-3">
              <span
                className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${bannerDotStyles[flag.severity] ?? "bg-text-soft"}`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-light text-text-soft uppercase tracking-wide">
                    {getLabel(flag.instrument ?? "Cross-instrument", instrumentLabel)}
                  </span>
                  <span className="text-xs font-light text-text-soft">
                    {getSessionLabel(flag.session_id)}
                  </span>
                </div>
                <p className={`text-sm font-medium ${flag.severity === "red" ? "text-danger" : flag.severity === "amber" ? "text-accent-deep" : "text-text-mid"}`}>
                  {flag.message}
                </p>
                {flag.suggested_language && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => toggleLanguage(flag.id)}
                      className="text-xs text-primary hover:text-primary-deep"
                    >
                      {expandedLanguage.has(flag.id)
                        ? "Hide suggested language"
                        : "Show suggested language"}
                    </button>
                    {expandedLanguage.has(flag.id) && (
                      <p className="mt-1 text-sm text-text-mid italic bg-base-mid rounded p-2">
                        &ldquo;{flag.suggested_language}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

      {/* Flag history — collapsed by default */}
      {historyFlags.length > 0 && (
        <div className="bg-base rounded-2xl border border-base-mid shadow-sm">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="w-full px-5 py-3 text-sm text-text-soft hover:bg-base-mid rounded-2xl flex items-center justify-between"
          >
            <span>Flag History ({historyFlags.length})</span>
            <svg
              className={`w-4 h-4 transition-transform ${showHistory ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showHistory && (
            <div className="divide-y divide-base-mid border-t border-base-mid">
              {historyFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="px-5 py-3 text-sm"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-light text-text-soft uppercase tracking-wide">
                      {getLabel(flag.instrument ?? "Cross-instrument", instrumentLabel)}
                    </span>
                    <span className="text-xs font-light text-text-soft">
                      {getSessionLabel(flag.session_id)}
                    </span>
                  </div>
                  <p className="text-text-mid">{flag.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
