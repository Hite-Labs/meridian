---
name: Demo Decisions
description: Key demo-specific decisions — date anchoring, WHO-5 framing, plateau rule, SRS 2-item, clinical anchors
type: project
---

- **Session dates:** Anchor relative to today. Session 8 = ~1 week ago, count backwards. Makes dashboard feel live.
- **WHO-5 intake framing:** Use "over the past week" instead of standard "last two weeks." Monthly check-in uses standard 2-week framing.
- **ORS plateau rule:** Fires when consecutive change < 3pts per session AND total < 25 on ALL three sessions (not just most recent). Should NOT fire if ORS is rising through distress range — the "all sessions < 25" check handles this.
- **SRS:** 2-item version (srs_heard + srs_relevant), range 0–20. Intentional for demo.
- **VOC anchors:** "Completely false (1) — Completely true (7)". SUDS: "No disturbance (0) — Worst possible (10)".
- **PHQ-4 anchors:** Standard clinical — "Not at all" to "Nearly every day" (0–3).
- **WHO-5 anchors:** Standard — "At no time" to "All of the time" (0–5).

**How to apply:** These are locked demo decisions. Don't second-guess them during implementation.
