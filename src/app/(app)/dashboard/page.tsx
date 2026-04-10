"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEMO_SCENARIOS } from "@/lib/demo";
import ClientHeader from "./ClientHeader";
import NextSessionCard from "./NextSessionCard";
import TrendChart from "./TrendChart";
import BreakdownPanel from "./BreakdownPanel";
import FlagPanel from "./FlagPanel";
import SessionList from "./SessionList";

// Demo: hardcoded next scheduled session. Replaced by calendar integration later.
const DEMO_NEXT_SESSION_ID = "c0000001-0000-0000-0000-000000000009";
function demoNextSessionAt(): string {
  // Tuesday of next week at 14:00 local
  const d = new Date();
  const day = d.getDay(); // 0=Sun, 2=Tue
  const daysUntilTue = ((2 - day + 7) % 7) || 7;
  d.setDate(d.getDate() + daysUntilTue);
  d.setHours(14, 0, 0, 0);
  return d.toISOString();
}

interface ClientInfo {
  id: string;
  name: string;
  status: string;
  modality: string;
  goal: string | null;
}

interface DashboardData {
  client: ClientInfo;
  flags: Array<{
    id: string;
    client_id: string;
    session_id: string | null;
    flag_type: string;
    instrument: string | null;
    severity: string;
    rule_key: string;
    message: string;
    suggested_language: string | null;
    acknowledged: boolean;
    acknowledged_at: string | null;
    acknowledged_by: string | null;
    created_at: string;
  }>;
  scores: Array<{
    id: string;
    client_id: string;
    session_id: string | null;
    questionnaire_type: string;
    instrument: string;
    composite_score: number;
    scored_at: string;
  }>;
  responses: Array<{
    id: string;
    client_id: string;
    session_id: string | null;
    questionnaire_type: string;
    instrument: string;
    question_key: string;
    question_text: string;
    value: number;
    responded_at: string;
  }>;
  sessions: Array<{
    id: string;
    client_id: string;
    practitioner_id: string;
    session_number: number;
    session_date: string;
    notes: string | null;
    next_steps: string | null;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="text-gray-400">Loading dashboard...</div>
        </div>
      }
    >
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
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
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  const orsScores = data.scores
    .filter(
      (s) => s.instrument === "ORS" && s.questionnaire_type === "session"
    )
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

  // ORS subscores per session (for breakdown view)
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

  // --- Trend data: latest vs previous session ---
  const latestSub = orsSubscores.length > 0 ? orsSubscores[orsSubscores.length - 1] : null;
  const prevSub = orsSubscores.length >= 2 ? orsSubscores[orsSubscores.length - 2] : null;
  const latestOrs = orsScores.length > 0 ? orsScores[orsScores.length - 1] : null;
  const prevOrs = orsScores.length >= 2 ? orsScores[orsScores.length - 2] : null;

  // Latest session for notes + body metrics
  const latestSession = data.sessions.length > 0
    ? [...data.sessions].sort((a, b) => b.session_number - a.session_number)[0]
    : null;

  const latestNotes = latestSession?.notes ?? null;
  const latestNextSteps = latestSession?.next_steps ?? null;

  // Body & somatic metrics for latest session
  const bodyMetrics = latestSession ? {
    bodySafety: Number(data.responses.find(
      (r) => r.session_id === latestSession.id && r.question_key === "scaling_body_safety"
    )?.value ?? null) || null,
    suds: Number(data.responses.find(
      (r) => r.session_id === latestSession.id && r.question_key === "suds"
    )?.value ?? null) || null,
    voc: Number(data.responses.find(
      (r) => r.session_id === latestSession.id && r.question_key === "voc"
    )?.value ?? null) || null,
  } : null;

  // Intake scores (for clients with no sessions yet)
  const intakeWho5 = data.scores.find(
    (s) => s.instrument === "WHO5" && s.questionnaire_type === "intake"
  );
  const intakePhq4Anxiety = data.scores.find(
    (s) => s.instrument === "PHQ4_anxiety" && s.questionnaire_type === "intake"
  );
  const intakePhq4Depression = data.scores.find(
    (s) => s.instrument === "PHQ4_depression" && s.questionnaire_type === "intake"
  );
  const hasIntakeData = !!(intakeWho5 || intakePhq4Anxiety || intakePhq4Depression);
  const hasSessions = data.sessions.length > 0;

  // Show flag panel if there are any flags at all (concerns or history)
  const hasFlagContent = data.flags.length > 0;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <ClientHeader
          name={data.client.name}
          status={data.client.status}
          modality={data.client.modality}
          goal={data.client.goal}
          sessionCount={data.sessions.length}
          startDate={data.sessions[0]?.session_date ?? ""}
        />

        <div className="space-y-6 mt-6">
          {/* Full-width chart */}
          <TrendChart
            orsScores={orsScores}
            orsSubscores={orsSubscores}
            who5Scores={who5Scores}
            flags={data.flags}
            sessions={data.sessions}
          />

          {/* Breakdown + (Flags stacked over Next Session) side by side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <BreakdownPanel
              latestSubscores={latestSub}
              previousSubscores={prevSub}
              latestComposite={latestOrs}
              previousComposite={prevOrs}
              latestNotes={latestNotes}
              latestNextSteps={latestNextSteps}
              bodyMetrics={bodyMetrics}
              intakeData={!hasSessions && hasIntakeData ? {
                who5: intakeWho5 ? Number(intakeWho5.composite_score) : null,
                anxiety: intakePhq4Anxiety ? Number(intakePhq4Anxiety.composite_score) : null,
                depression: intakePhq4Depression ? Number(intakePhq4Depression.composite_score) : null,
              } : null}
            />
            <div className="space-y-6">
              {hasFlagContent && (
                <FlagPanel flags={data.flags} sessions={data.sessions} />
              )}
              <NextSessionCard
                clientId={data.client.id}
                scheduledAt={hasSessions ? demoNextSessionAt() : null}
                nextSessionId={hasSessions ? DEMO_NEXT_SESSION_ID : null}
              />
            </div>
          </div>

          {/* Session history */}
          <SessionList
            sessions={data.sessions}
            scores={data.scores}
            responses={data.responses}
            flags={data.flags}
          />
        </div>
      </div>
    </div>
  );
}
