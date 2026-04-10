"use client";

import QuestionnaireFlow from "@/components/QuestionnaireFlow";
import {
  intakeQuestions,
  intakeOpenQuestion,
} from "@/lib/questions";
import { DEMO_SCENARIOS } from "@/lib/demo";

const allQuestions = [...intakeQuestions, intakeOpenQuestion];

// Intake demo flow targets the "Fresh Intake" scenario (Alex R.) so that
// completing the questionnaire lands the user on a clean client dashboard.
const FRESH_INTAKE_CLIENT_ID =
  DEMO_SCENARIOS.find((s) => s.id === "fresh-intake")?.clientId ??
  DEMO_SCENARIOS[0].clientId;

export default function IntakePage() {
  async function handleComplete(responses: Record<string, number | string>) {
    await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: FRESH_INTAKE_CLIENT_ID,
        sessionId: null,
        questionnaireType: "intake",
        responses,
        questions: intakeQuestions, // only rating questions for scoring
      }),
    });
  }

  return (
    <QuestionnaireFlow
      questions={allQuestions}
      onComplete={handleComplete}
      title="Intake Questionnaire"
      subtitle="Dr. Maya Chen"
      completionTitle="You're all set. Your practitioner has everything they need to support you."
      completionSubtext="See you at your first session."
      completionHref={`/client-dashboard?clientId=${FRESH_INTAKE_CLIENT_ID}`}
      completionCtaLabel="Continue to your dashboard"
    />
  );
}
