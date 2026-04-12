# Story 2: Client Auth via Magic Link + Intake Questionnaire

**As a client, I want to receive a link, tap it, and complete my intake questionnaire without creating an account.**

## Priority
MVP — required before Lindsay goes live.

## What Exists Today
- `/intake` page exists with full questionnaire flow (ORS, WHO-5, PHQ-4, open text)
- `QuestionnaireFlow` component handles one-question-per-screen with sliders
- `src/lib/questions.ts` defines all instruments with rating scales
- `POST /api/score` ingests responses, computes scores, evaluates flags
- No token validation — intake is open to anyone
- No `client_tokens` table yet

## What Needs to Change

### Token Validation
- `/intake` route accepts `?token=xxx` query param
- On load: validate token against `client_tokens` table
  - Token exists, type = 'intake', not expired, not used → proceed
  - Otherwise → show error page ("This link has expired or already been used")
- On successful submission: mark token as used (`used_at = now()`)

### Questionnaire — Intake Keeps Current Instruments
- Intake stays as: ORS (baseline), WHO-5 (wellbeing snapshot), PHQ-4 (screening), open text
- SUDS/VOC/body safety are NOT added to intake — they measure session-specific change
- SUDS/VOC/body safety remain check-in only (Story 4)
- Question wording may need coaching tone review (not clinical)

### Data Flow
- Token carries `client_id` — responses are linked to the correct client
- No session record for intake (session_id is null for intake responses)
- Intake creates initial scores and any threshold flags

### Client Experience
- Mobile-first, one question per screen (already built)
- Sliders only for rated questions (already built)
- Progress bar at top (already built)
- Practitioner name shown at top ("Lindsay has invited you...")
- Simple confirmation screen on submit ("Thank you! Lindsay will review your responses.")

## Out of Scope
- Client returning to edit intake after submission
- Client dashboard / progress view
- Client account creation

## Acceptance Criteria
- [ ] Token validates correctly and expires after use
- [ ] Invalid/expired tokens show a clear error
- [ ] All intake responses are stored with correct instrument labels
- [ ] PHQ-4 data is stored but marked practitioner-only
- [ ] Lindsay sees intake responses on the client page immediately after submission
- [ ] Practitioner name appears in the client-facing UI

## Dependencies
- **Story 1 (Create Client)** — tokens and client records
- **Story 6 (Email/Resend)** — intake invite delivery

## Decisions
- Intake token expiry: **7 days** (per Story 1 decision)
- Check-in token expiry: **48 hours** (per Story 1 decision)

## Verification & Automated Checks

Run after implementation is complete:

- [ ] `npm run build` — production build passes with no errors
- [ ] `npx playwright test e2e/story-2-*.spec.ts` — E2E tests for intake flow
- [ ] `/security-review` — verify token validation, no auth bypass
- [ ] `/code-review` — code quality review passes
- [ ] `/supabase-security-audit` — verify client_token RLS policies
- [ ] Validate zod schemas on token validation endpoint
- [ ] Manual: complete full intake flow on mobile viewport (Chrome DevTools)
- [ ] Manual: verify expired/used token shows error page
- [ ] Manual: verify PHQ-4 data not visible in any client-facing view

## Open Questions
- Should intake include body safety / SUDS / VOC questions, or only check-ins?
- Does Lindsay want to customize the open-ended question text per client?
- What should the confirmation screen say? Any next-steps messaging?
