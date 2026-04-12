"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import QuestionnaireFlow from "@/components/QuestionnaireFlow";
import { checkInQuestions } from "@/lib/questions";
import { DEMO_CLIENT_ID } from "@/lib/demo";

// Demo fallback
const DEMO_SESSION_ID = "c0000001-0000-0000-0000-000000000008";

export default function CheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen canvas-atmosphere flex items-center justify-center">
          <div className="text-text-soft">Loading...</div>
        </div>
      }
    >
      <CheckInInner />
    </Suspense>
  );
}

interface TokenState {
  status: "loading" | "valid" | "invalid" | "demo";
  clientId: string | null;
  sessionId: string | null;
  practitionerName: string | null;
  token: string | null;
  reason: string | null;
}

function CheckInInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<TokenState>({
    status: token ? "loading" : "demo",
    clientId: token ? null : DEMO_CLIENT_ID,
    sessionId: token ? null : DEMO_SESSION_ID,
    practitionerName: token ? null : "Dr. Maya Chen",
    token,
    reason: null,
  });

  useEffect(() => {
    if (!token) return;

    fetch(`/api/token/validate?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.tokenType === "session_checkin") {
          setState({
            status: "valid",
            clientId: data.clientId,
            sessionId: data.sessionId,
            practitionerName: data.practitionerName,
            token,
            reason: null,
          });
        } else if (data.valid && data.tokenType !== "session_checkin") {
          setState({
            status: "invalid",
            clientId: null,
            sessionId: null,
            practitionerName: null,
            token,
            reason: "This link is for a different purpose.",
          });
        } else {
          setState({
            status: "invalid",
            clientId: null,
            sessionId: null,
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
          sessionId: null,
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
          <p className="text-text-mid font-light">{state.reason}</p>
          <p className="text-text-soft text-sm mt-4">
            Please contact your coach for a new link.
          </p>
        </div>
      </div>
    );
  }

  // Valid token or demo mode
  const clientId = state.clientId!;
  const sessionId = state.sessionId!;
  const practitionerName = state.practitionerName;

  async function handleComplete(responses: Record<string, number | string>) {
    await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        sessionId,
        questionnaireType: "session",
        responses,
        questions: checkInQuestions,
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
      questions={checkInQuestions}
      onComplete={handleComplete}
      title="Session Check-In"
      subtitle={displayName}
      completionTitle={`Thank you — ${displayName} will review your responses.`}
      completionSubtext="See you at your next session."
    />
  );
}
