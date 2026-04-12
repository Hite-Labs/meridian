"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import QuestionnaireFlow from "@/components/QuestionnaireFlow";
import {
  intakeQuestions,
  intakeOpenQuestion,
} from "@/lib/questions";
import { DEMO_SCENARIOS } from "@/lib/demo";

const allQuestions = [...intakeQuestions, intakeOpenQuestion];

// Demo fallback when no token is provided
const FRESH_INTAKE_CLIENT_ID =
  DEMO_SCENARIOS.find((s) => s.id === "fresh-intake")?.clientId ??
  DEMO_SCENARIOS[0].clientId;

export default function IntakePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen canvas-atmosphere flex items-center justify-center">
          <div className="text-text-soft">Loading...</div>
        </div>
      }
    >
      <IntakeInner />
    </Suspense>
  );
}

interface TokenState {
  status: "loading" | "valid" | "invalid" | "demo";
  clientId: string | null;
  practitionerName: string | null;
  token: string | null;
  reason: string | null;
}

function IntakeInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<TokenState>({
    status: token ? "loading" : "demo",
    clientId: token ? null : FRESH_INTAKE_CLIENT_ID,
    practitionerName: token ? null : "Dr. Maya Chen",
    token,
    reason: null,
  });

  useEffect(() => {
    if (!token) return;

    fetch(`/api/token/validate?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setState({
            status: "valid",
            clientId: data.clientId,
            practitionerName: data.practitionerName,
            token,
            reason: null,
          });
        } else {
          setState({
            status: "invalid",
            clientId: null,
            practitionerName: null,
            token,
            reason: data.reason ?? "This link is no longer valid.",
          });
        }
      })
      .catch(() => {
        setState({
          status: "invalid",
          clientId: null,
          practitionerName: null,
          token,
          reason: "Something went wrong. Please try again.",
        });
      });
  }, [token]);

  // Loading state
  if (state.status === "loading") {
    return (
      <div className="min-h-screen canvas-atmosphere flex items-center justify-center">
        <div className="text-center rise rise-1">
          <div className="w-10 h-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin mx-auto mb-4" />
          <p className="text-text-soft text-sm">Verifying your link...</p>
        </div>
      </div>
    );
  }

  // Invalid/expired token
  if (state.status === "invalid") {
    return (
      <div className="min-h-screen canvas-atmosphere flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md rise rise-1">
          <div className="w-14 h-14 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#B91C1C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display italic text-text-dark mb-3 leading-snug">
            Link unavailable
          </h1>
          <p className="text-text-mid font-light">
            {state.reason}
          </p>
          <p className="text-text-soft text-sm mt-4">
            Please contact your coach for a new link.
          </p>
        </div>
      </div>
    );
  }

  // Valid token or demo mode — show questionnaire
  const clientId = state.clientId!;
  const practitionerName = state.practitionerName;

  async function handleComplete(responses: Record<string, number | string>) {
    await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        sessionId: null,
        questionnaireType: "intake",
        responses,
        questions: intakeQuestions,
      }),
    });

    // Mark token as used (only for real tokens, not demo)
    if (state.token && state.status === "valid") {
      await fetch("/api/token/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: state.token }),
      });
    }
  }

  const displayName = practitionerName ?? "Your coach";

  return (
    <QuestionnaireFlow
      questions={allQuestions}
      onComplete={handleComplete}
      title="Intake Questionnaire"
      subtitle={displayName}
      completionTitle={`You're all set. ${displayName} has everything they need to support you.`}
      completionSubtext="See you at your first session."
      completionHref={state.status === "demo" ? `/client-dashboard?clientId=${clientId}` : undefined}
      completionCtaLabel={state.status === "demo" ? "Continue to your dashboard" : undefined}
    />
  );
}
