// Hardcoded demo IDs — must match seed.sql
export const DEMO_PRACTITIONER_ID = "a1b2c3d4-0000-0000-0000-000000000001";
export const DEMO_CLIENT_ID = "b2c3d4e5-0000-0000-0000-000000000001";

export interface DemoScenario {
  id: string;
  clientId: string;
  name: string;
  subtitle: string;
  color: string;
  description: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "full-arc",
    clientId: "b2c3d4e5-0000-0000-0000-000000000001",
    name: "Sarah K.",
    subtitle: "Full Arc",
    color: "blue",
    description:
      "8 sessions showing a complete coaching journey — distress to breakthrough to consolidation.",
  },
  {
    id: "fresh-intake",
    clientId: "b2c3d4e5-0000-0000-0000-000000000002",
    name: "Alex R.",
    subtitle: "Fresh Intake",
    color: "red",
    description:
      "Just completed intake with critical wellbeing and elevated anxiety. No sessions yet.",
  },
  {
    id: "stalled",
    clientId: "b2c3d4e5-0000-0000-0000-000000000003",
    name: "Jordan M.",
    subtitle: "Stalled / Plateau",
    color: "amber",
    description:
      "5 sessions with flat scores below threshold. High motivation but somatic indicators stuck.",
  },
  {
    id: "ready-to-graduate",
    clientId: "b2c3d4e5-0000-0000-0000-000000000004",
    name: "Priya L.",
    subtitle: "Ready to Graduate",
    color: "green",
    description:
      "10 sessions with steady improvement. All indicators resolved — time to discuss transition.",
  },
];
