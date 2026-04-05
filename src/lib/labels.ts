// Central dictionary: instrument codes → human-readable labels
// Data layer keeps codes (ORS, WHO5, etc). UI layer imports from here.

export const instrumentLabel: Record<string, string> = {
  ORS: "Session Wellbeing",
  WHO5: "Monthly Wellbeing",
  SRS: "Session Alliance",
  PHQ4: "Mood Screening",
  PHQ4_anxiety: "Anxiety Screening",
  PHQ4_depression: "Depression Screening",
  PHQ4_total: "Mood Screening (Total)",
  SUDS: "Emotional Charge",
  VOC: "Body Belief",
  scaling: "Self-Assessment",
  "Cross-instrument": "Cross-measure",
};

export const orsItemLabel: Record<string, string> = {
  personal: "Personal wellbeing",
  relationships: "Relationship wellbeing",
  social: "Social wellbeing",
  overall: "Overall wellbeing",
};

export const modalityLabel: Record<string, string> = {
  subconscious: "Somatic & Subconscious",
  conscious: "Conscious Coaching",
  both: "Integrated",
};

export function label(code: string, map: Record<string, string>): string {
  return map[code] ?? code;
}
