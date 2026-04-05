"use client";

import { useState } from "react";

interface SessionListProps {
  sessions: Array<{
    id: string;
    session_number: number;
    session_date: string;
    notes: string | null;
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
    red: "bg-red-500",
    amber: "bg-amber-500",
    green: "bg-green-500",
    info: "bg-blue-500",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {[...sessions].reverse().map((session) => {
          const orsScore = scores.find(
            (s) =>
              s.session_id === session.id &&
              s.instrument === "ORS" &&
              s.questionnaire_type === "session"
          );
          const srsScore = scores.find(
            (s) =>
              s.session_id === session.id &&
              s.instrument === "SRS" &&
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
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                onClick={() =>
                  setExpandedId(isExpanded ? null : session.id)
                }
              >
                <span className="text-sm font-medium text-gray-500 w-8">
                  #{session.session_number}
                </span>
                <span className="text-sm text-gray-600 flex-1">
                  {new Date(session.session_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {orsScore && (
                  <span className="text-sm font-semibold text-gray-900">
                    ORS {Number(orsScore.composite_score)}
                  </span>
                )}
                {sessionFlags.length > 0 && (
                  <div className="flex gap-0.5">
                    {sessionFlags.map((f) => (
                      <span
                        key={f.rule_key}
                        className={`w-2 h-2 rounded-full ${severityColor[f.severity] ?? "bg-gray-400"}`}
                      />
                    ))}
                  </div>
                )}
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
                <div className="px-5 pb-4 bg-gray-50 text-sm space-y-3">
                  {/* ORS breakdown */}
                  {orsResponses.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        ORS Breakdown
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {orsResponses.map((r) => (
                          <div
                            key={r.question_key}
                            className="flex justify-between"
                          >
                            <span className="text-gray-600 capitalize">
                              {r.question_key.replace("ors_", "")}
                            </span>
                            <span className="font-medium text-gray-900">
                              {Number(r.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SRS */}
                  {srsScore && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Alliance (SRS)
                      </div>
                      <span className="font-medium text-gray-900">
                        {Number(srsScore.composite_score)}/20
                      </span>
                    </div>
                  )}

                  {/* Subconscious metrics */}
                  {(bodySafety || suds || voc) && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Somatic
                      </div>
                      <div className="flex gap-4">
                        {bodySafety && (
                          <span className="text-gray-600">
                            Body Safety:{" "}
                            <span className="font-medium text-gray-900">
                              {Number(bodySafety.value)}
                            </span>
                          </span>
                        )}
                        {suds && (
                          <span className="text-gray-600">
                            SUDS:{" "}
                            <span className="font-medium text-gray-900">
                              {Number(suds.value)}
                            </span>
                          </span>
                        )}
                        {voc && (
                          <span className="text-gray-600">
                            VOC:{" "}
                            <span className="font-medium text-gray-900">
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
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Notes
                      </div>
                      <p className="text-gray-700 italic">{session.notes}</p>
                    </div>
                  )}

                  {/* Session flags */}
                  {sessionFlags.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Flags
                      </div>
                      {sessionFlags.map((f) => (
                        <div
                          key={f.rule_key}
                          className="flex items-start gap-2 mt-1"
                        >
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${severityColor[f.severity] ?? "bg-gray-400"}`}
                          />
                          <span className="text-gray-700">{f.message}</span>
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
