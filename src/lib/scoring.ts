export interface ScoreResult {
  instrument: string;
  composite_score: number;
}

export function computeIntakeScores(
  responses: Record<string, number>
): ScoreResult[] {
  const scores: ScoreResult[] = [];

  // ORS total (0-40) — baseline wellbeing across four life domains
  const hasOrs =
    responses.ors_personal !== undefined ||
    responses.ors_relationships !== undefined ||
    responses.ors_social !== undefined ||
    responses.ors_overall !== undefined;
  if (hasOrs) {
    const orsTotal =
      (responses.ors_personal ?? 0) +
      (responses.ors_relationships ?? 0) +
      (responses.ors_social ?? 0) +
      (responses.ors_overall ?? 0);
    scores.push({ instrument: "ORS", composite_score: orsTotal });
  }

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
        severity: "amber",
        rule_key: "who5_critical",
        message:
          "Energy and mood are running very low. Worth checking in about what support they have outside of coaching.",
        suggested_language:
          "I can see things have been really tough lately. I want to make sure you have the support you need — would it be okay to talk about that?",
      });
    } else if (who5 < 50) {
      flags.push({
        flag_type: "threshold",
        instrument: "WHO5",
        severity: "amber",
        rule_key: "who5_concern",
        message:
          "Energy and mood are a bit low coming in. Good to keep an eye on this as coaching progresses.",
        suggested_language:
          "I noticed some of your responses suggest things have been a bit tough lately. That's completely normal, and we'll work through this together at your pace.",
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
        severity: "amber",
        rule_key: "phq4_anxiety_high",
        message:
          "Stress and worry levels are very high. Worth exploring what's driving this and whether they have support outside coaching.",
        suggested_language:
          "Your responses suggest you've been carrying a lot of stress. That's important for us to know — let's make sure we address this together.",
      });
    } else if (anxiety >= 3) {
      flags.push({
        flag_type: "threshold",
        instrument: "PHQ4",
        severity: "info",
        rule_key: "phq4_anxiety",
        message:
          "Stress levels are a bit elevated. Worth keeping an eye on.",
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
        severity: "amber",
        rule_key: "phq4_depression_high",
        message:
          "Mood is running very low. Worth checking in about what support they have and whether coaching alone is enough.",
      });
    } else if (depression >= 3) {
      flags.push({
        flag_type: "threshold",
        instrument: "PHQ4",
        severity: "info",
        rule_key: "phq4_depression",
        message:
          "Mood is a bit low. Worth keeping an eye on how this shifts over time.",
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

  if (previousOrsTotals.length > 0) {
    const prevOrs = previousOrsTotals[previousOrsTotals.length - 1];
    const change = orsTotal - prevOrs;

    // ORS deterioration (drop 5+)
    if (change <= -5) {
      flags.push({
        flag_type: "trend",
        instrument: "ORS",
        severity: "amber",
        rule_key: "ors_deterioration",
        message:
          "Noticeable dip this session. Something may have shifted — worth exploring what happened.",
      });
    }

    // ORS improvement (rise 5+)
    if (change >= 5) {
      flags.push({
        flag_type: "trend",
        instrument: "ORS",
        severity: "green",
        rule_key: "ors_improvement",
        message: "Nice jump this session — something clicked.",
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
          "Wellbeing has stayed low across the last few sessions without much shift. This isn't a clinical judgment — it's a prompt to check in about whether coaching alone is the right fit, or whether something alongside it (a therapist, a doctor) might help.",
        suggested_language:
          "I want to check in about how things are going overall. I notice we've been working on some things and you're still feeling pretty stretched. Sometimes it helps to have support from a few angles at once — how are you feeling about that?",
      });
    }
  }

  return flags;
}
