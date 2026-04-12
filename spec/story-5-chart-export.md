# Story 5: Chart Export (PDF or Image)

**As a practitioner, I want to export a client's progress chart so I can show it to a prospective client as proof that the approach works.**

## Priority
Post-MVP — scoped but not launch-blocking.

## What Exists Today
- `TrendChart` component renders ORS scores over sessions using Recharts
- Chart shows session-by-session trend with data points
- No export functionality

## What Needs to Be Built

### Export UI
- Export button on the practitioner's client trend chart
- Dropdown: "Download as PNG" / "Download as PDF"
- Optional caption field before export ("8-session engagement, focus: anxiety and self-confidence")

### Export Content
Include:
- Client initials or anonymized label (e.g. "Client A")
- Date range of sessions
- ORS trend line
- WHO-5 trend line
- Meaningful change markers (if applicable)

Exclude:
- PHQ-4 data (clinical, not for sharing)
- SRS data (therapeutic alliance, not for sharing)
- Flags
- Client full name

### Implementation
- `html2canvas` or Recharts built-in SVG export for PNG
- `jsPDF` to wrap PNG into PDF
- Export should be clean and presentable, not a raw data dump

## Out of Scope
- Batch export across multiple clients
- Custom branding / logo on exports
- Sharing via link (download only)

## Acceptance Criteria
- [ ] Practitioner can export a chart from any client page
- [ ] Export contains no clinical data or raw PHQ-4 scores
- [ ] File downloads to practitioner's device
- [ ] Chart is legible and presentable at standard screen resolution
- [ ] Optional caption appears on the exported chart

## Verification & Automated Checks

Run after implementation is complete:

- [ ] `npm run build` — production build passes with no errors
- [ ] `npx playwright test e2e/story-5-*.spec.ts` — E2E tests for chart export
- [ ] `/security-review` — verify no PHQ-4 or clinical data in exports
- [ ] `/code-review` — code quality review passes
- [ ] React best practices skill — verify chart component patterns
- [ ] Manual: export PNG and verify it's legible at standard resolution
- [ ] Manual: export PDF and verify layout is clean
- [ ] Manual: verify exported chart excludes PHQ-4, SRS, flags, and full client name

## Open Questions
- Should the export include a Meridian watermark or branding?
- Does Lindsay want to choose which instruments appear in the export?
- Should we include session numbers or actual dates on the x-axis?
