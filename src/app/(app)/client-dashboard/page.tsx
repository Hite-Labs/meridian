"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEMO_SCENARIOS } from "@/lib/demo";
import { orsItemLabel } from "@/lib/labels";
import TrendChart from "../dashboard/TrendChart";

const subscoreKeys = ["personal", "relationships", "social", "overall"] as const;

interface DashboardData {
  client: {
    id: string;
    name: string;
    status: string;
    modality: string;
    goal: string | null;
  };
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
  scores: Array<{
    id: string;
    session_id: string | null;
    questionnaire_type: string;
    instrument: string;
    composite_score: number;
  }>;
  responses: Array<{
    id: string;
    session_id: string | null;
    questionnaire_type: string;
    instrument: string;
    question_key: string;
    value: number;
  }>;
  sessions: Array<{
    id: string;
    session_number: number;
    session_date: string;
    notes: string | null;
    next_steps: string | null;
  }>;
}

export default function ClientDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="text-text-soft">Loading...</div>
        </div>
      }
    >
      <ClientDashboardInner />
    </Suspense>
  );
}

function ClientDashboardInner() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") ?? DEMO_SCENARIOS[0].clientId;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/flags?clientId=${clientId}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [clientId]);

  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-text-soft">Loading...</div>
      </div>
    );
  }

  const latestSession = data.sessions.length > 0
    ? [...data.sessions].sort((a, b) => b.session_number - a.session_number)[0]
    : null;

  const orsScores = data.scores
    .filter((s) => s.instrument === "ORS" && s.questionnaire_type === "session")
    .map((s) => {
      const session = data.sessions.find((sess) => sess.id === s.session_id);
      return {
        sessionNumber: session?.session_number ?? 0,
        sessionDate: session?.session_date ?? "",
        score: Number(s.composite_score),
        sessionId: s.session_id,
      };
    })
    .sort((a, b) => a.sessionNumber - b.sessionNumber);

  const orsSubscores = data.sessions.map((session) => {
    const sessionOrs = data.responses.filter(
      (r) =>
        r.session_id === session.id &&
        r.instrument === "ORS" &&
        r.questionnaire_type === "session"
    );
    const get = (key: string) =>
      Number(sessionOrs.find((r) => r.question_key === key)?.value ?? 0);
    return {
      sessionNumber: session.session_number,
      sessionDate: session.session_date,
      personal: get("ors_personal"),
      relationships: get("ors_relationships"),
      social: get("ors_social"),
      overall: get("ors_overall"),
    };
  });

  const who5Scores = data.scores
    .filter((s) => s.instrument === "WHO5")
    .map((s) => ({
      sessionId: s.session_id,
      questionnaire_type: s.questionnaire_type,
      score: Number(s.composite_score),
    }));

  const latestSub = orsSubscores.length > 0 ? orsSubscores[orsSubscores.length - 1] : null;
  const prevSub = orsSubscores.length >= 2 ? orsSubscores[orsSubscores.length - 2] : null;
  const prevOrs = orsScores.length >= 2 ? orsScores[orsScores.length - 2] : null;

  const compositeTotal = latestSub
    ? latestSub.personal + latestSub.relationships + latestSub.social + latestSub.overall
    : null;

  const prevTotal = prevOrs ? prevOrs.score : null;
  const trend = compositeTotal !== null && prevTotal !== null
    ? compositeTotal - prevTotal >= 3 ? "up" : compositeTotal - prevTotal <= -3 ? "down" : "stable"
    : null;

  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-display italic text-2xl text-text-dark">
            Hi, {data.client.name.split(".")[0].split(" ")[0]}
          </h1>
          {data.client.goal && (
            <p className="text-text-mid mt-1">{data.client.goal}</p>
          )}
        </div>

        <div className="space-y-6">
          {/* ── YOUR SCORES (what you reported) ── */}
          {compositeTotal !== null && latestSub && (
            <ScoreCard
              compositeTotal={compositeTotal}
              trend={trend}
              latestSub={latestSub}
              prevSub={prevSub}
              sessionDate={latestSession?.session_date ?? ""}
            />
          )}

          {/* ── FROM YOUR COACH (highlights + next steps) ── */}
          {latestSession && (latestSession.notes || latestSession.next_steps) && (
            <div className="bg-base rounded-2xl border border-base-mid shadow-sm">
              <div className="px-6 py-4 border-b border-base-mid">
                <h2 className="font-display text-base text-text-dark">From Your Coach</h2>
                <p className="text-xs font-light text-text-soft mt-0.5">
                  Session {latestSession.session_number} &middot;{" "}
                  {new Date(latestSession.session_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {latestSession.notes && (
                <div className="px-6 py-4 border-b border-base-mid">
                  <div className="text-xs font-light text-text-soft uppercase tracking-wide mb-1">
                    Session Highlights
                  </div>
                  <p className="text-sm text-text-mid leading-relaxed">{latestSession.notes}</p>
                </div>
              )}

              {latestSession.next_steps && (
                <div className="px-6 py-4">
                  <div className="text-xs font-light text-text-soft uppercase tracking-wide mb-2">
                    Next Steps
                  </div>
                  <ul className="space-y-2">
                    {latestSession.next_steps.split("\n").filter(Boolean).map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text-mid">
                        <span className="mt-0.5 w-5 h-5 rounded border border-base-mid shrink-0 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-sm bg-base-mid" />
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ── PROGRESS CHART ── */}
          {orsScores.length > 0 && (
            <TrendChart
              orsScores={orsScores}
              orsSubscores={orsSubscores}
              who5Scores={who5Scores}
              flags={[]}
              sessions={data.sessions}
            />
          )}

          {/* No data state */}
          {!latestSession && (
            <div className="bg-base rounded-2xl border border-base-mid shadow-sm p-8 text-center">
              <p className="font-display text-text-dark mb-2">Welcome to Meridian</p>
              <p className="text-sm text-text-mid">
                Your progress will appear here after your first session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Score card with expandable breakdown ---

function ScoreCard({
  compositeTotal,
  trend,
  latestSub,
  prevSub,
  sessionDate,
}: {
  compositeTotal: number;
  trend: string | null;
  latestSub: { personal: number; relationships: number; social: number; overall: number };
  prevSub: { personal: number; relationships: number; social: number; overall: number } | null;
  sessionDate: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-base rounded-2xl border border-base-mid shadow-sm">
      {/* Headline — tappable to expand */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-center"
      >
        <p className="text-xs font-light text-text-soft uppercase tracking-wide mb-2">
          Your Wellbeing Score
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="font-display italic text-4xl text-text-dark tabular-nums">
            {compositeTotal}
          </span>
          <span className="text-text-soft text-lg">/40</span>
          {trend && (
            <span className={`text-lg font-medium ${trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-text-soft"}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </span>
          )}
        </div>
        {sessionDate && (
          <p className="text-xs font-light text-text-soft mt-2">
            From your last session on{" "}
            {new Date(sessionDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
        <div className="flex items-center justify-center gap-1 mt-3 text-xs text-text-soft">
          <span>{expanded ? "Hide" : "See"} breakdown</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable breakdown */}
      {expanded && (
        <div className="px-6 pb-5 pt-1 border-t border-base-mid space-y-3">
          {subscoreKeys.map((key) => {
            const current = latestSub[key];
            const previous = prevSub ? prevSub[key] : null;
            const diff = previous !== null ? current - previous : null;
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-text-mid">{orsItemLabel[key]}</span>
                <div className="flex items-center gap-2">
                  {diff !== null && diff !== 0 && (
                    <span className={`text-xs font-medium ${diff > 0 ? "text-success" : "text-danger"}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  )}
                  <span className="font-display italic text-sm text-text-dark tabular-nums">
                    {current}/10
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
