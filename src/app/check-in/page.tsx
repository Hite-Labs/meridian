"use client";

import QuestionnaireFlow from "@/components/QuestionnaireFlow";
import { checkInQuestions } from "@/lib/questions";
import { DEMO_CLIENT_ID } from "@/lib/demo";

// Demo: hardcoded to session 8
const DEMO_SESSION_ID = "c0000001-0000-0000-0000-000000000008";

export default function CheckInPage() {
  async function handleComplete(responses: Record<string, number | string>) {
    await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: DEMO_CLIENT_ID,
        sessionId: DEMO_SESSION_ID,
        questionnaireType: "session",
        responses,
        questions: checkInQuestions,
      }),
    });
  }

  return (
    <QuestionnaireFlow
      questions={checkInQuestions}
      onComplete={handleComplete}
      completionTitle="Thank you — your responses have been recorded."
      completionSubtext="Your practitioner will review these before your next session."
    />
  );
}
