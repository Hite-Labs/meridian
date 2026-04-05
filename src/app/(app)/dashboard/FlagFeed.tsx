"use client";

import { useState } from "react";
import { instrumentLabel, label as getLabel } from "@/lib/labels";

interface FlagFeedProps {
  flags: Array<{
    id: string;
    session_id: string | null;
    severity: string;
    rule_key: string;
    instrument: string | null;
    message: string;
    suggested_language: string | null;
    acknowledged: boolean;
    acknowledged_at: string | null;
    acknowledged_by: string | null;
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

const severityStyles: Record<string, string> = {
  red: "border-l-red-500",
  amber: "border-l-amber-500",
  green: "border-l-green-500",
  info: "border-l-blue-500",
};

export default function FlagFeed({ flags, sessions }: FlagFeedProps) {
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

  const acknowledgedFlags = flags.filter((f) => f.acknowledged);

  // Check for graduation signal
  const graduationFlag = activeFlags.find(
    (f) => f.rule_key === "graduation_signal"
  );

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-50">
        <h2 className="text-base font-semibold tracking-tight text-gray-900">Flags</h2>
      </div>

      {/* Graduation signal — special treatment */}
      {graduationFlag && (
        <div className="mx-4 mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-green-800">
              Graduation Milestone
            </span>
          </div>
          <p className="text-sm text-green-800">
            Sarah has reached a graduation milestone. Her wellbeing scores have
            been consistently strong for two months. Consider celebrating her
            progress and discussing what&apos;s next.
          </p>
        </div>
      )}

      {/* Active flags */}
      <div className="divide-y divide-gray-100">
        {activeFlags
          .filter((f) => f.rule_key !== "graduation_signal")
          .map((flag) => (
            <div
              key={flag.id}
              className={`px-5 py-3 border-l-4 ${severityStyles[flag.severity] ?? "border-l-gray-300"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  {getLabel(flag.instrument ?? "Cross-instrument", instrumentLabel)}
                </span>
                <span className="text-xs text-gray-400">
                  {getSessionLabel(flag.session_id)}
                </span>
              </div>
              <p className="text-sm text-gray-800">{flag.message}</p>
              {flag.suggested_language && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => toggleLanguage(flag.id)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    {expandedLanguage.has(flag.id)
                      ? "Hide suggested language"
                      : "Show suggested language"}
                  </button>
                  {expandedLanguage.has(flag.id) && (
                    <p className="mt-1 text-sm text-gray-600 italic bg-blue-50 rounded p-2">
                      &ldquo;{flag.suggested_language}&rdquo;
                    </p>
                  )}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {new Date(flag.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
      </div>

      {activeFlags.length === 0 && (
        <div className="px-5 py-6 text-center text-sm text-gray-400">
          No active flags
        </div>
      )}

      {/* History */}
      {acknowledgedFlags.length > 0 && (
        <div className="border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="w-full px-5 py-3 text-sm text-gray-500 hover:bg-gray-50 flex items-center justify-between"
          >
            <span>History ({acknowledgedFlags.length})</span>
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
            <div className="divide-y divide-gray-50">
              {acknowledgedFlags.map((flag) => (
                <div
                  key={flag.id}
                  className={`px-5 py-3 opacity-60 border-l-4 ${severityStyles[flag.severity] ?? "border-l-gray-300"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {flag.instrument ?? "Cross-instrument"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{flag.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Acknowledged by {flag.acknowledged_by} on{" "}
                    {flag.acknowledged_at
                      ? new Date(flag.acknowledged_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )
                      : "unknown"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
