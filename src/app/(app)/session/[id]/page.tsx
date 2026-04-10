"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DEMO_SCENARIOS } from "@/lib/demo";
import NotesPad from "./NotesPad";
import PublishModal from "./PublishModal";
import BreakdownPanel from "../../dashboard/BreakdownPanel";

interface SessionRouteParams {
  id: string;
}

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
    acknowledged: boolean;
  }>;
  scores: Array<{
    session_id: string | null;
    questionnaire_type: string;
    instrument: string;
    composite_score: number;
  }>;
  responses: Array<{
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

const DRAFT_KEY = (id: string) => `meridian:session-draft:${id}`;

export default function SessionPage({
  params,
}: {
  params: Promise<SessionRouteParams>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="text-text-soft">Loading…</div>
        </div>
      }
    >
      <SessionInner params={params} />
    </Suspense>
  );
}

function SessionInner({ params }: { params: Promise<SessionRouteParams> }) {
  const { id: sessionId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClientId = searchParams.get("clientId");
  const clientId = queryClientId ?? DEMO_SCENARIOS[0].clientId;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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
        <div className="text-text-soft">Loading…</div>
      </div>
    );
  }

  // Derive "upcoming session number" from the count of existing sessions
  const upcomingNumber = data.sessions.length + 1;

  // Build the same derived data the dashboard feeds into BreakdownPanel.
  const orsScores = data.scores
    .filter(
      (s) => s.instrument === "ORS" && s.questionnaire_type === "session",
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

  const orsSubscores = data.sessions.map((session) => {
    const sessionOrs = data.responses.filter(
      (r) =>
        r.session_id === session.id &&
        r.instrument === "ORS" &&
        r.questionnaire_type === "session",
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

  const latestSub =
    orsSubscores.length > 0 ? orsSubscores[orsSubscores.length - 1] : null;
  const prevSub =
    orsSubscores.length >= 2 ? orsSubscores[orsSubscores.length - 2] : null;
  const latestOrs =
    orsScores.length > 0 ? orsScores[orsScores.length - 1] : null;
  const prevOrs =
    orsScores.length >= 2 ? orsScores[orsScores.length - 2] : null;

  const latestSession =
    data.sessions.length > 0
      ? [...data.sessions].sort(
          (a, b) => b.session_number - a.session_number,
        )[0]
      : null;

  const latestNotes = latestSession?.notes ?? null;
  const latestNextSteps = latestSession?.next_steps ?? null;

  const bodyMetrics = latestSession
    ? {
        bodySafety:
          Number(
            data.responses.find(
              (r) =>
                r.session_id === latestSession.id &&
                r.question_key === "scaling_body_safety",
            )?.value ?? null,
          ) || null,
        suds:
          Number(
            data.responses.find(
              (r) =>
                r.session_id === latestSession.id &&
                r.question_key === "suds",
            )?.value ?? null,
          ) || null,
        voc:
          Number(
            data.responses.find(
              (r) =>
                r.session_id === latestSession.id &&
                r.question_key === "voc",
            )?.value ?? null,
          ) || null,
      }
    : null;

  const firstName = data.client.name.split(".")[0].split(" ")[0];

  const upcomingDate = new Date();
  // Demo: same logic as dashboard — next Tuesday at 14:00
  const day = upcomingDate.getDay();
  const daysUntilTue = ((2 - day + 7) % 7) || 7;
  upcomingDate.setDate(upcomingDate.getDate() + daysUntilTue);
  upcomingDate.setHours(14, 0, 0, 0);

  function handlePublish(payload: {
    allLinesPrivate: string[];
    sharedLines: string[];
    nextStepLines: string[];
  }) {
    // Stub for now — schema + API integration is a follow-up
    console.log("[publish] session", sessionId, payload);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRAFT_KEY(sessionId));
    }
    setPublishOpen(false);
    setToast(`Published to ${firstName}'s dashboard.`);
    setTimeout(() => {
      router.push(`/dashboard?clientId=${clientId}`);
    }, 900);
  }

  return (
    <div className="relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 sm:py-10">
        {/* Back */}
        <div className="rise rise-1 mb-5">
          <Link
            href={`/dashboard?clientId=${clientId}`}
            className="inline-flex items-center gap-1.5 eyebrow hover:text-text-mid transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to dashboard
          </Link>
        </div>

        {/* Header */}
        <header className="rise rise-2 mb-6">
          <div className="eyebrow mb-2">
            Session {upcomingNumber} &middot;{" "}
            {upcomingDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <h1 className="font-display italic tracking-tight text-text-dark text-3xl sm:text-4xl lg:text-5xl leading-[0.95]">
            {data.client.name}
          </h1>
          {data.client.goal && (
            <p className="mt-3 max-w-2xl font-display text-text-mid text-base sm:text-lg leading-snug">
              <span className="eyebrow mr-2 align-middle">North Star</span>
              {data.client.goal}
            </p>
          )}
        </header>

        <div className="rise rise-3 gold-seam mb-6" />

        {/* Two-column: recap on left, notes pad on right */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* Last session — full breakdown, same component as dashboard */}
          <div className="rise rise-3 lg:col-span-1">
            <BreakdownPanel
              latestSubscores={latestSub}
              previousSubscores={prevSub}
              latestComposite={latestOrs}
              previousComposite={prevOrs}
              latestNotes={latestNotes}
              latestNextSteps={latestNextSteps}
              bodyMetrics={bodyMetrics}
              intakeData={null}
            />
          </div>

          {/* Notes pad */}
          <div className="rise rise-4 lg:col-span-2">
            <NotesPad sessionId={sessionId} onChange={setNotes} />
          </div>
        </div>

        {/* Bottom action */}
        <div className="rise rise-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setPublishOpen(true)}
            disabled={notes.trim().length === 0}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-deep text-accent-light font-medium text-sm shadow-[0_10px_24px_-14px_rgba(60,24,104,0.7)] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish…
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Publish modal */}
      <PublishModal
        open={publishOpen}
        notes={notes}
        clientFirstName={firstName}
        onCancel={() => setPublishOpen(false)}
        onPublish={handlePublish}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl card-luxe text-sm text-text-dark rise rise-1">
          {toast}
        </div>
      )}
    </div>
  );
}
