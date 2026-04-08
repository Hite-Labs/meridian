"use client";

import QuestionnaireFlow from "@/components/QuestionnaireFlow";
import {
  intakeQuestions,
  intakeOpenQuestion,
} from "@/lib/questions";
import { DEMO_CLIENT_ID } from "@/lib/demo";

const allQuestions = [...intakeQuestions, intakeOpenQuestion];

export default function IntakePage() {
  async function handleComplete(responses: Record<string, number | string>) {
    await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: DEMO_CLIENT_ID,
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
    />
  );
}
