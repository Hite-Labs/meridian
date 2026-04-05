"use client";

interface PatternBannerProps {
  flag: {
    rule_key: string;
    severity: string;
    message: string;
    session_id: string | null;
  };
  sessions: Array<{
    id: string;
    session_number: number;
  }>;
  responses: Array<{
    session_id: string | null;
    question_key: string;
    value: number;
  }>;
}

export default function PatternBanner({
  flag,
  sessions,
  responses,
}: PatternBannerProps) {
  const firedSession = sessions.find((s) => s.id === flag.session_id);

  // Check if resolved: body safety >= 5 in later sessions
  const lastSession = sessions[sessions.length - 1];
  const lastBodySafety = responses.find(
    (r) =>
      r.session_id === lastSession?.id &&
      r.question_key === "scaling_body_safety"
  );
  const isResolved = lastBodySafety && Number(lastBodySafety.value) >= 5;

  const severityBorder: Record<string, string> = {
    amber: "border-amber-400 bg-amber-50",
    red: "border-red-400 bg-red-50",
    green: "border-green-400 bg-green-50",
    info: "border-blue-400 bg-blue-50",
  };

  return (
    <div
      className={`mt-4 rounded-xl border-l-4 p-5 ${severityBorder[flag.severity] ?? severityBorder.info}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide bg-white/60 px-2 py-0.5 rounded">
          Pattern
        </span>
        {isResolved && (
          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
            Resolved
          </span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">
        Cognitive-somatic gap
      </h3>
      <p className="text-sm text-gray-700 leading-relaxed">
        Sarah&apos;s confidence in her goal is high, but her body safety score
        is low. This gap often means the mind is ready before the nervous system
        is. Somatic work may be the key to moving forward.
      </p>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
        <span>
          Instruments: Goal Confidence, Body Safety
        </span>
        {firedSession && (
          <span>First detected: Session {firedSession.session_number}</span>
        )}
        {isResolved && lastSession && (
          <span>Resolved: Session {lastSession.session_number}</span>
        )}
      </div>
    </div>
  );
}
