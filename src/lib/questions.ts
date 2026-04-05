export interface Question {
  key: string;
  text: string;
  instrument: "WHO5" | "PHQ4" | "ORS" | "SRS" | "SUDS" | "VOC" | "scaling";
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  type: "rating" | "text";
  optional?: boolean;
}

export const intakeQuestions: Question[] = [
  // WHO-5 (0-5)
  { key: "who5_q1", text: "Over the past week, I have felt cheerful and in good spirits.", instrument: "WHO5", min: 0, max: 5, minLabel: "At no time", maxLabel: "All of the time", type: "rating" },
  { key: "who5_q2", text: "Over the past week, I have felt calm and relaxed.", instrument: "WHO5", min: 0, max: 5, minLabel: "At no time", maxLabel: "All of the time", type: "rating" },
  { key: "who5_q3", text: "Over the past week, I have felt active and vigorous.", instrument: "WHO5", min: 0, max: 5, minLabel: "At no time", maxLabel: "All of the time", type: "rating" },
  { key: "who5_q4", text: "Over the past week, I woke up feeling fresh and rested.", instrument: "WHO5", min: 0, max: 5, minLabel: "At no time", maxLabel: "All of the time", type: "rating" },
  { key: "who5_q5", text: "Over the past week, my daily life has been filled with things that interest me.", instrument: "WHO5", min: 0, max: 5, minLabel: "At no time", maxLabel: "All of the time", type: "rating" },
  // PHQ-4 (0-3)
  { key: "phq4_q1", text: "Over the past two weeks, how often have you been bothered by feeling nervous, anxious, or on edge?", instrument: "PHQ4", min: 0, max: 3, minLabel: "Not at all", maxLabel: "Nearly every day", type: "rating" },
  { key: "phq4_q2", text: "Over the past two weeks, how often have you been bothered by not being able to stop or control worrying?", instrument: "PHQ4", min: 0, max: 3, minLabel: "Not at all", maxLabel: "Nearly every day", type: "rating" },
  { key: "phq4_q3", text: "Over the past two weeks, how often have you been bothered by feeling down, depressed, or hopeless?", instrument: "PHQ4", min: 0, max: 3, minLabel: "Not at all", maxLabel: "Nearly every day", type: "rating" },
  { key: "phq4_q4", text: "Over the past two weeks, how often have you been bothered by little interest or pleasure in doing things?", instrument: "PHQ4", min: 0, max: 3, minLabel: "Not at all", maxLabel: "Nearly every day", type: "rating" },
  // Scaling (0-10)
  { key: "scaling_clarity", text: "How clear is the goal you're bringing to coaching right now?", instrument: "scaling", min: 0, max: 10, minLabel: "Not at all clear", maxLabel: "Completely clear", type: "rating" },
  { key: "scaling_motivation", text: "How motivated are you to work on this goal?", instrument: "scaling", min: 0, max: 10, minLabel: "Not at all", maxLabel: "Completely", type: "rating" },
  { key: "scaling_readiness", text: "How ready are you to make real changes in this area of your life?", instrument: "scaling", min: 0, max: 10, minLabel: "Not at all", maxLabel: "Completely", type: "rating" },
  // Subconscious add-ons
  { key: "scaling_body_safety", text: "How safe does your body feel right now?", instrument: "scaling", min: 0, max: 10, minLabel: "Not at all safe", maxLabel: "Completely safe", type: "rating" },
  { key: "scaling_body_connection", text: "How connected do you feel to your body right now?", instrument: "scaling", min: 0, max: 10, minLabel: "Not at all", maxLabel: "Deeply connected", type: "rating" },
];

export const intakeOpenQuestion: Question = {
  key: "intake_open",
  text: "What brings you to coaching right now?",
  instrument: "scaling",
  min: 0,
  max: 0,
  minLabel: "",
  maxLabel: "",
  type: "text",
  optional: true,
};

export const checkInQuestions: Question[] = [
  // ORS (0-10)
  { key: "ors_personal", text: "Personally — your inner sense of wellbeing right now.", instrument: "ORS", min: 0, max: 10, minLabel: "Very low", maxLabel: "Very high", type: "rating" },
  { key: "ors_relationships", text: "In your close relationships — family, partner, friends.", instrument: "ORS", min: 0, max: 10, minLabel: "Very low", maxLabel: "Very high", type: "rating" },
  { key: "ors_social", text: "At work, school, or in your social world.", instrument: "ORS", min: 0, max: 10, minLabel: "Very low", maxLabel: "Very high", type: "rating" },
  { key: "ors_overall", text: "Overall — your general sense of how life is going.", instrument: "ORS", min: 0, max: 10, minLabel: "Very low", maxLabel: "Very high", type: "rating" },
  // SRS (0-10)
  { key: "srs_heard", text: "I felt heard and understood in today's session.", instrument: "SRS", min: 0, max: 10, minLabel: "Not at all", maxLabel: "Completely", type: "rating" },
  { key: "srs_relevant", text: "We worked on what actually mattered to me today.", instrument: "SRS", min: 0, max: 10, minLabel: "Not at all", maxLabel: "Completely", type: "rating" },
  // Subconscious add-ons
  { key: "suds", text: "What is the level of emotional charge you still feel around the issue we worked on today?", instrument: "SUDS", min: 0, max: 10, minLabel: "No disturbance", maxLabel: "Worst possible", type: "rating" },
  { key: "voc", text: "How true does it feel in your body right now that you are safe and capable?", instrument: "VOC", min: 1, max: 7, minLabel: "Completely false", maxLabel: "Completely true", type: "rating" },
];
