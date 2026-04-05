"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEMO_SCENARIOS } from "@/lib/demo";
import ClientHeader from "./ClientHeader";
import PatternBanner from "./PatternBanner";
import TrendChart from "./TrendChart";
import SessionList from "./SessionList";
import FlagFeed from "./FlagFeed";

interface ClientInfo {
  id: string;
  name: string;
  status: string;
  modality: string;
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
    created_at: string;
  }>;
}

export default function DashboardPage() {
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

  // Find the cognitive-somatic gap pattern
  const cogSomaticGap = data.flags.find(
    (f) => f.rule_key === "cognitive_somatic_gap"
  );

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <ClientHeader
          name={data.client.name}
          status={data.client.status}
          modality={data.client.modality}
          sessionCount={data.sessions.length}
          startDate={data.sessions[0]?.session_date ?? ""}
        />

        {cogSomaticGap && (
          <PatternBanner
            flag={cogSomaticGap}
            sessions={data.sessions}
            responses={data.responses}
          />
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <TrendChart
              orsScores={orsScores}
              orsSubscores={orsSubscores}
              who5Scores={who5Scores}
              flags={data.flags}
              sessions={data.sessions}
            />
            <div className="lg:hidden">
              <SessionList
                sessions={data.sessions}
                scores={data.scores}
                responses={data.responses}
                flags={data.flags}
              />
            </div>
          </div>
          <div className="hidden lg:block space-y-6">
            <SessionList
              sessions={data.sessions}
              scores={data.scores}
              responses={data.responses}
              flags={data.flags}
            />
            <FlagFeed flags={data.flags} sessions={data.sessions} />
          </div>
        </div>

        <div className="lg:hidden mt-6">
          <FlagFeed flags={data.flags} sessions={data.sessions} />
        </div>
      </div>
    </div>
  );
}
