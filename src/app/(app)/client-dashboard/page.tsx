"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const clientId = searchParams.get("clientId") ?? "";

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

  // Include intake ORS (if any) as a leading "session 0" data point.
  const intakeOrsScore = data.scores.find(
    (s) => s.instrument === "ORS" && s.questionnaire_type === "intake"
  );
  if (intakeOrsScore) {
    orsScores.unshift({
      sessionNumber: 0,
      sessionDate: "",
      score: Number(intakeOrsScore.composite_score),
      sessionId: null,
    });
  }

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

  // Include intake ORS subscores (if any) as leading "session 0" breakdown row.
  const intakeOrsResponses = data.responses.filter(
    (r) => r.instrument === "ORS" && r.questionnaire_type === "intake"
  );
  if (intakeOrsResponses.length > 0) {
    const getIntake = (key: string) =>
      Number(intakeOrsResponses.find((r) => r.question_key === key)?.value ?? 0);
    orsSubscores.unshift({
      sessionNumber: 0,
      sessionDate: "",
      personal: getIntake("ors_personal"),
      relationships: getIntake("ors_relationships"),
      social: getIntake("ors_social"),
      overall: getIntake("ors_overall"),
    });
  }

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

  const firstName = data.client.name.split(".")[0].split(" ")[0];

  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8 sm:py-10">
        {/* Greeting */}
        <div className="rise rise-1 mb-6">
          <div className="eyebrow mb-2">Your Journey</div>
          <h1 className="font-display italic text-text-dark text-4xl sm:text-5xl leading-[0.95] tracking-tight">
            Hello, {firstName}.
          </h1>
        </div>

        <div className="rise rise-2 gold-seam mb-6" />

        <div className="space-y-6">
          {/* ── YOUR GOAL (client self-reports their North Star) ── */}
          <GoalCard
            clientId={data.client.id}
            initialGoal={data.client.goal}
            onSaved={(goal) =>
              setData((prev) => (prev ? { ...prev, client: { ...prev.client, goal } } : prev))
            }
          />

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
            <div className="card-luxe">
              <div className="px-6 py-4 border-b border-base-mid/60">
                <div className="eyebrow mb-1">From Your Coach</div>
                <p className="font-display italic text-text-dark text-lg leading-tight">
                  Session {latestSession.session_number}
                </p>
                <p className="text-xs font-light text-text-soft mt-0.5">
                  {new Date(latestSession.session_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {latestSession.notes && (
                <div className="px-6 py-5 border-b border-base-mid/60">
                  <div className="eyebrow mb-2">Session Highlights</div>
                  <p className="text-sm text-text-mid leading-relaxed">{latestSession.notes}</p>
                </div>
              )}

              {latestSession.next_steps && (
                <div className="px-6 py-5">
                  <div className="eyebrow mb-3">Next Steps</div>
                  <ul className="space-y-2.5">
                    {latestSession.next_steps.split("\n").filter(Boolean).map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text-mid">
                        <span className="mt-0.5 w-5 h-5 rounded-md border border-accent/40 bg-accent-light/30 shrink-0 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        </span>
                        <span className="leading-relaxed">{step}</span>
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
            <div className="card-luxe p-10 text-center">
              <div className="eyebrow mb-3">Welcome</div>
              <p className="font-display italic text-text-dark text-2xl mb-2">
                Your journey begins here.
              </p>
              <p className="text-sm text-text-mid font-light">
                Your progress will appear here after your first session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Goal card (client self-reports their coaching goal) ---

function GoalCard({
  clientId,
  initialGoal,
  onSaved,
}: {
  clientId: string;
  initialGoal: string | null;
  onSaved: (goal: string | null) => void;
}) {
  const [value, setValue] = useState(initialGoal ?? "");
  const [savedValue, setSavedValue] = useState(initialGoal ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = value.trim() !== savedValue.trim();
  const canSave = dirty && !saving;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/client", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, goal: value }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save");
      }
      const body = await res.json();
      const nextGoal: string | null = body.goal ?? null;
      setSavedValue(nextGoal ?? "");
      setValue(nextGoal ?? "");
      onSaved(nextGoal);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card-luxe p-6 sm:p-7">
      <div className="eyebrow mb-2">Your North Star</div>
      <label
        htmlFor="goal-textarea"
        className="block font-display italic text-text-dark text-xl sm:text-2xl leading-snug mb-4"
      >
        What is your goal for your coaching with Dr. Maya Chen?
      </label>
      <textarea
        id="goal-textarea"
        className="w-full h-28 p-4 bg-[#FAF6F8] border border-base-mid rounded-xl text-text-dark placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/40 resize-none shadow-[0_1px_2px_rgba(60,24,104,0.04)] text-sm leading-relaxed"
        placeholder="Write it in your own words — you can change it any time."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs font-light text-text-soft">
          {savedValue
            ? "You can update this whenever it evolves."
            : "This is just for you — it helps shape your sessions."}
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
            canSave
              ? "bg-primary-deep text-accent-light hover:bg-primary active:scale-[0.98] shadow-[0_8px_20px_-14px_rgba(60,24,104,0.7)]"
              : "bg-base-mid text-text-soft cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : dirty ? "Save" : "Saved"}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-danger">{error}</p>
      )}
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
    <div className="card-luxe overflow-hidden">
      {/* Headline — tappable to expand */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-7 text-center"
      >
        <div className="eyebrow mb-3">Your Wellbeing</div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-display italic text-6xl text-text-dark tabular-nums leading-none">
            {compositeTotal}
          </span>
          <span className="text-text-soft text-xl font-light">/40</span>
          {trend && (
            <span className={`ml-1 text-xl font-medium ${trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-text-soft"}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </span>
          )}
        </div>
        {sessionDate && (
          <p className="text-xs font-light text-text-soft mt-3">
            From your last session on{" "}
            {new Date(sessionDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-text-soft hover:text-text-mid transition-colors">
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
        <div className="px-6 pb-5 pt-4 border-t border-base-mid/60 space-y-3">
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
