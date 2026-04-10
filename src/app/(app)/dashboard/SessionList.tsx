"use client";

import { useState } from "react";
import { orsItemLabel, label } from "@/lib/labels";

const subscoreDescriptions: Record<string, string> = {
  personal: "Inner sense of wellbeing, energy, and life satisfaction",
  relationships: "Close relationships and interpersonal connections",
  social: "Work, school, and broader social world",
  overall: "General sense of how life is going across all areas",
};

interface SessionListProps {
  sessions: Array<{
    id: string;
    session_number: number;
    session_date: string;
    notes: string | null;
    next_steps: string | null;
  }>;
  scores: Array<{
    session_id: string | null;
    instrument: string;
    composite_score: number;
    questionnaire_type: string;
  }>;
  responses: Array<{
    session_id: string | null;
    question_key: string;
    value: number;
    instrument: string;
    questionnaire_type: string;
  }>;
  flags: Array<{
    session_id: string | null;
    severity: string;
    message: string;
    rule_key: string;
  }>;
}

export default function SessionList({
  sessions,
  scores,
  responses,
  flags,
}: SessionListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const severityColor: Record<string, string> = {
    red: "bg-danger",
    amber: "bg-accent",
    green: "bg-success",
    info: "bg-primary-light",
  };

  return (
    <div className="card-luxe overflow-hidden">
      <div className="px-6 py-4 border-b border-base-mid/60">
        <div className="eyebrow mb-1">History</div>
        <h2 className="font-display italic text-xl tracking-tight text-text-dark leading-tight">Sessions</h2>
      </div>
      <div className="divide-y divide-base-mid/60 py-1">
        {[...sessions].reverse().map((session) => {
          const orsScore = scores.find(
            (s) =>
              s.session_id === session.id &&
              s.instrument === "ORS" &&
              s.questionnaire_type === "session"
          );
          const sessionFlags = flags.filter(
            (f) => f.session_id === session.id
          );
          const isExpanded = expandedId === session.id;

          // Detail responses for this session
          const orsResponses = responses.filter(
            (r) =>
              r.session_id === session.id &&
              r.instrument === "ORS" &&
              r.questionnaire_type === "session"
          );
          const bodySafety = responses.find(
            (r) =>
              r.session_id === session.id &&
              r.question_key === "scaling_body_safety"
          );
          const suds = responses.find(
            (r) =>
              r.session_id === session.id &&
              r.question_key === "suds"
          );
          const voc = responses.find(
            (r) =>
              r.session_id === session.id &&
              r.question_key === "voc"
          );

          return (
            <div key={session.id}>
              <button
                type="button"
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-base-mid transition-colors text-left"
                onClick={() =>
                  setExpandedId(isExpanded ? null : session.id)
                }
              >
                <span className="font-display italic text-sm text-text-soft w-8">
                  #{session.session_number}
                </span>
                <span className="text-sm text-text-soft font-light flex-1">
                  {new Date(session.session_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {orsScore && (
                  <span className="font-display italic text-sm text-text-dark">
                    Wellbeing {Number(orsScore.composite_score)}
                  </span>
                )}
                {sessionFlags.length > 0 && (
                  <div className="flex gap-0.5">
                    {sessionFlags.map((f) => (
                      <span
                        key={f.rule_key}
                        className={`w-2 h-2 rounded-full ${severityColor[f.severity] ?? "bg-text-soft"}`}
                      />
                    ))}
                  </div>
                )}
                <svg
                  className={`w-4 h-4 text-text-soft transition-transform ${isExpanded ? "rotate-180" : ""}`}
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

              {isExpanded && (
                <div className="px-5 pt-3 pb-4 bg-base-mid/60 text-sm space-y-3">
                  {/* ORS breakdown */}
                  {orsResponses.length > 0 && (
                    <div>
                      <div className="text-xs font-light text-text-soft uppercase tracking-wide mb-1">
                        Wellbeing Breakdown
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {orsResponses.map((r) => {
                          const key = r.question_key.replace("ors_", "");
                          return (
                            <div key={r.question_key}>
                              <div className="flex justify-between">
                                <span className="text-text-mid">
                                  {label(key, orsItemLabel)}
                                </span>
                                <span className="font-display italic text-text-dark">
                                  {Number(r.value)}/10
                                </span>
                              </div>
                              {subscoreDescriptions[key] && (
                                <p className="text-xs font-light text-text-soft mt-0.5">
                                  {subscoreDescriptions[key]}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Subconscious metrics */}
                  {(bodySafety || suds || voc) && (
                    <div>
                      <div className="text-xs font-light text-text-soft uppercase tracking-wide mb-1">
                        Body & Somatic
                      </div>
                      <div className="flex gap-4">
                        {bodySafety && (
                          <span className="text-text-mid">
                            Body Safety:{" "}
                            <span className="font-display italic text-text-dark">
                              {Number(bodySafety.value)}
                            </span>
                          </span>
                        )}
                        {suds && (
                          <span className="text-text-mid">
                            Emotional Charge:{" "}
                            <span className="font-display italic text-text-dark">
                              {Number(suds.value)}
                            </span>
                          </span>
                        )}
                        {voc && (
                          <span className="text-text-mid">
                            Body Belief:{" "}
                            <span className="font-display italic text-text-dark">
                              {Number(voc.value)}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {session.notes && (
                    <div>
                      <div className="text-xs font-light text-text-soft uppercase tracking-wide mb-1">
                        Session Highlights
                      </div>
                      <p className="text-text-mid">{session.notes}</p>
                    </div>
                  )}

                  {session.next_steps && (
                    <div>
                      <div className="text-xs font-light text-text-soft uppercase tracking-wide mb-1">
                        Next Steps
                      </div>
                      <ul className="space-y-1">
                        {session.next_steps.split("\n").filter(Boolean).map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-text-mid">
                            <span className="mt-0.5 w-3.5 h-3.5 rounded border border-base-mid shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Session flags */}
                  {sessionFlags.length > 0 && (
                    <div>
                      <div className="text-xs font-light text-text-soft uppercase tracking-wide mb-1">
                        Flags
                      </div>
                      {sessionFlags.map((f) => (
                        <div
                          key={f.rule_key}
                          className="flex items-start gap-2 mt-1"
                        >
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${severityColor[f.severity] ?? "bg-text-soft"}`}
                          />
                          <span className="text-text-mid">{f.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
