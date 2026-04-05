import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  computeIntakeScores,
  computeSessionScores,
  evaluateIntakeFlags,
  evaluateSessionFlags,
} from "@/lib/scoring";
import type { Question } from "@/lib/questions";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    clientId,
    sessionId,
    questionnaireType,
    responses,
    questions,
  }: {
    clientId: string;
    sessionId: string | null;
    questionnaireType: "intake" | "session" | "monthly";
    responses: Record<string, number | string>;
    questions: Question[];
  } = body;

  // 1. Write responses
  const responseRows = questions
    .filter((q) => responses[q.key] !== undefined && q.type === "rating")
    .map((q) => ({
      client_id: clientId,
      session_id: sessionId,
      questionnaire_type: questionnaireType,
      instrument: q.instrument,
      question_key: q.key,
      question_text: q.text,
      value: responses[q.key] as number,
    }));

  if (responseRows.length > 0) {
    const { error: respError } = await supabase
      .from("response")
      .insert(responseRows);
    if (respError) {
      return NextResponse.json(
        { error: respError.message },
        { status: 500 }
      );
    }
  }

  // 2. Compute and write scores
  const numericResponses = Object.fromEntries(
    Object.entries(responses).filter(
      ([, v]) => typeof v === "number"
    )
  ) as Record<string, number>;

  let scores;
  if (questionnaireType === "intake") {
    scores = computeIntakeScores(numericResponses);
  } else {
    scores = computeSessionScores(numericResponses);
  }

  if (scores.length > 0) {
    const scoreRows = scores.map((s) => ({
      client_id: clientId,
      session_id: sessionId,
      questionnaire_type: questionnaireType,
      instrument: s.instrument,
      composite_score: s.composite_score,
    }));

    const { error: scoreError } = await supabase
      .from("score")
      .insert(scoreRows);
    if (scoreError) {
      return NextResponse.json(
        { error: scoreError.message },
        { status: 500 }
      );
    }
  }

  // 3. Evaluate and write flags
  let flags: import("@/lib/scoring").FlagResult[] = [];
  if (questionnaireType === "intake") {
    flags = evaluateIntakeFlags(scores);
  } else {
    const orsScore = scores.find((s) => s.instrument === "ORS");
    if (orsScore) {
      // Fetch previous ORS scores for trend analysis
      const { data: prevScores } = await supabase
        .from("score")
        .select("composite_score, session_id")
        .eq("client_id", clientId)
        .eq("instrument", "ORS")
        .eq("questionnaire_type", "session")
        .neq("session_id", sessionId)
        .order("scored_at", { ascending: true });

      const previousOrsTotals = (prevScores ?? []).map(
        (s) => Number(s.composite_score)
      );
      flags = evaluateSessionFlags(
        orsScore.composite_score,
        previousOrsTotals
      );
    } else {
      flags = [];
    }
  }

  if (flags.length > 0) {
    const flagRows = flags.map((f) => ({
      client_id: clientId,
      session_id: sessionId,
      flag_type: f.flag_type,
      instrument: f.instrument,
      severity: f.severity,
      rule_key: f.rule_key,
      message: f.message,
      suggested_language: f.suggested_language ?? null,
    }));

    const { error: flagError } = await supabase
      .from("flag")
      .insert(flagRows);
    if (flagError) {
      return NextResponse.json(
        { error: flagError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true, scores, flags });
}
