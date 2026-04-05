export interface ScoreResult {
  instrument: string;
  composite_score: number;
}

export function computeIntakeScores(
  responses: Record<string, number>
): ScoreResult[] {
  const scores: ScoreResult[] = [];

  // WHO-5: sum × 4
  const who5Sum =
    (responses.who5_q1 ?? 0) +
    (responses.who5_q2 ?? 0) +
    (responses.who5_q3 ?? 0) +
    (responses.who5_q4 ?? 0) +
    (responses.who5_q5 ?? 0);
  scores.push({ instrument: "WHO5", composite_score: who5Sum * 4 });

  // PHQ-4
  const anxietyScore = (responses.phq4_q1 ?? 0) + (responses.phq4_q2 ?? 0);
  const depressionScore = (responses.phq4_q3 ?? 0) + (responses.phq4_q4 ?? 0);
  scores.push({ instrument: "PHQ4_anxiety", composite_score: anxietyScore });
  scores.push({
    instrument: "PHQ4_depression",
    composite_score: depressionScore,
  });
  scores.push({
    instrument: "PHQ4_total",
    composite_score: anxietyScore + depressionScore,
  });

  return scores;
}

export function computeSessionScores(
  responses: Record<string, number>
): ScoreResult[] {
  const scores: ScoreResult[] = [];

  // ORS total
  const orsTotal =
    (responses.ors_personal ?? 0) +
    (responses.ors_relationships ?? 0) +
    (responses.ors_social ?? 0) +
    (responses.ors_overall ?? 0);
  scores.push({ instrument: "ORS", composite_score: orsTotal });

  // SRS total
  const srsTotal =
    (responses.srs_heard ?? 0) + (responses.srs_relevant ?? 0);
  scores.push({ instrument: "SRS", composite_score: srsTotal });

  return scores;
}

export interface FlagResult {
  flag_type: "threshold" | "cross_instrument" | "trend";
  instrument: string | null;
  severity: "green" | "amber" | "red" | "info";
  rule_key: string;
  message: string;
  suggested_language?: string;
}

export function evaluateIntakeFlags(
  scores: ScoreResult[]
): FlagResult[] {
  const flags: FlagResult[] = [];
  const scoreMap = Object.fromEntries(
    scores.map((s) => [s.instrument, s.composite_score])
  );

  // WHO-5 flags
  const who5 = scoreMap.WHO5;
  if (who5 !== undefined) {
    if (who5 < 28) {
      flags.push({
        flag_type: "threshold",
        instrument: "WHO5",
        severity: "red",
        rule_key: "who5_critical",
        message:
          "Client's score indicates possible depression. Consider exploring whether a mental health referral is appropriate.",
      });
    } else if (who5 < 50) {
      flags.push({
        flag_type: "threshold",
        instrument: "WHO5",
        severity: "amber",
        rule_key: "who5_concern",
        message:
          "Client's wellbeing score suggests possible emotional difficulties. Consider checking in about their support systems.",
        suggested_language:
          "I noticed some of your responses suggest things have been a bit tough lately. I want you to know that's completely normal, and we'll work through this together at your pace.",
      });
    }
  }

  // PHQ-4 flags
  const anxiety = scoreMap.PHQ4_anxiety;
  if (anxiety !== undefined) {
    if (anxiety >= 6) {
      flags.push({
        flag_type: "threshold",
        instrument: "PHQ4",
        severity: "red",
        rule_key: "phq4_anxiety_high",
        message:
          "Strong anxiety flag. Consider referral to mental health support.",
      });
    } else if (anxiety >= 3) {
      flags.push({
        flag_type: "threshold",
        instrument: "PHQ4",
        severity: "amber",
        rule_key: "phq4_anxiety",
        message:
          "Client's responses suggest elevated anxiety. Consider opening a conversation about stress and worry.",
        suggested_language:
          "I'd love to spend a little time today exploring what's been weighing on you. There's no pressure — we'll go at whatever pace feels right.",
      });
    }
  }

  const depression = scoreMap.PHQ4_depression;
  if (depression !== undefined) {
    if (depression >= 6) {
      flags.push({
        flag_type: "threshold",
        instrument: "PHQ4",
        severity: "red",
        rule_key: "phq4_depression_high",
        message:
          "Strong depression flag. Consider referral to mental health support.",
      });
    } else if (depression >= 3) {
      flags.push({
        flag_type: "threshold",
        instrument: "PHQ4",
        severity: "amber",
        rule_key: "phq4_depression",
        message:
          "Client's responses suggest low mood. Consider checking in about how they've been feeling day to day.",
      });
    }
  }

  return flags;
}

export function evaluateSessionFlags(
  orsTotal: number,
  previousOrsTotals: number[]
): FlagResult[] {
  const flags: FlagResult[] = [];

  // ORS distress
  if (orsTotal < 25) {
    flags.push({
      flag_type: "threshold",
      instrument: "ORS",
      severity: "amber",
      rule_key: "ors_distress",
      message:
        "Client is in the distress range. Worth checking in at the start of next session.",
    });
  }

  if (previousOrsTotals.length > 0) {
    const prevOrs = previousOrsTotals[previousOrsTotals.length - 1];
    const change = orsTotal - prevOrs;

    // ORS deterioration (drop 5+)
    if (change <= -5) {
      flags.push({
        flag_type: "trend",
        instrument: "ORS",
        severity: "red",
        rule_key: "ors_deterioration",
        message:
          "Reliable deterioration detected — change exceeds measurement error.",
      });
    }

    // ORS improvement (rise 5+)
    if (change >= 5) {
      flags.push({
        flag_type: "trend",
        instrument: "ORS",
        severity: "green",
        rule_key: "ors_improvement",
        message: "Reliable improvement this session.",
      });
    }
  }

  // ORS plateau: < 3pt change for 3+ consecutive sessions AND all < 25
  if (previousOrsTotals.length >= 2) {
    const recentThree = [...previousOrsTotals.slice(-2), orsTotal];
    const allBelowThreshold = recentThree.every((s) => s < 25);
    const allSmallChanges =
      Math.abs(recentThree[1] - recentThree[0]) < 3 &&
      Math.abs(recentThree[2] - recentThree[1]) < 3;

    if (allBelowThreshold && allSmallChanges) {
      flags.push({
        flag_type: "trend",
        instrument: "ORS",
        severity: "amber",
        rule_key: "ors_plateau",
        message:
          "Progress appears to have stalled below the wellbeing threshold. Consider reviewing the coaching approach.",
        suggested_language:
          "I want to check in about how you feel things are going. Sometimes it helps to try a different angle — would you be open to exploring that?",
      });
    }
  }

  return flags;
}
