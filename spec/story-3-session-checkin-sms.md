# Story 3: Post-Session Check-In via Twilio SMS

**As a practitioner, I want my client to automatically receive a text after each session so they can complete their check-in without me having to chase them.**

## Priority
MVP — required before Lindsay goes live.

## What Exists Today
- `/check-in` page exists with full questionnaire flow (ORS, SRS, SUDS, VOC, body safety)
- Scoring engine handles session scores and flag evaluation
- `session` table tracks session_number, notes, next_steps
- `flag` table with severity levels and suggested language
- Flag logic: ORS < 25 yellow, ORS drop 5+ red, SRS < 14 yellow
- No SMS/Twilio integration
- No magic link token validation on check-in
- No "Send Check-in" button in practitioner UI

## Delivery Channel
This story handles **SMS delivery via Twilio** for practitioner→client check-in links. Email-based transactional delivery (intake invites, welcome) is handled by Story 6 (Resend). Both channels coexist.

## What Needs to Be Built

### Twilio Setup
- Env vars: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `POST /api/send-checkin` — server-side API route (not client-side)
  - Creates a new session record (increments session_number)
  - Generates magic link token (type: `session_checkin`, expires in 48 hours)
  - Sends SMS via Twilio: "Hi [first name] — [Lindsay] has sent your session check-in. Tap here to complete it (takes under 60 seconds): [link]"
  - If no phone on file → fall back to email via Resend (Story 6)

### Practitioner UI
- "Send Check-in" button on the client's page in Lindsay's dashboard
- Confirmation before sending ("Send check-in SMS to [client name]?")
- Status indicator: check-in sent, awaiting response, completed

### Check-In Flow Updates
- `/checkin?token=xxx` (or update existing `/check-in` route)
- Token validation same as intake (Story 2)
- On submit: responses saved, scores computed, flag logic runs server-side
- Lindsay's dashboard updates with new session data

### Flag Logic (already partially built)
Verify these thresholds match what's in `scoring.ts`:
- ORS total < 25 → yellow flag
- ORS drops 5+ pts from previous session → red flag
- SRS total < 14 → yellow flag (practitioner only)
- All flags logged with timestamp and acknowledgment status

## Dependencies
- **Story 10 (Auth)** — API routes need authenticated practitioner context
- **Story 1 (Create Client)** — clients must exist with phone numbers
- **Story 6 (Email/Resend)** — fallback delivery when no phone on file

## Out of Scope
- Automated scheduling (manual trigger only for now)
- Reminder SMS if client hasn't responded
- Client seeing their own results after submission (see Story 8)

## Acceptance Criteria
- [ ] Lindsay taps "Send Check-in" and client receives SMS within 30 seconds
- [ ] Client completes check-in on mobile in under 60 seconds
- [ ] Lindsay's client page shows updated scores immediately
- [ ] Flags fire correctly and appear in the flag feed
- [ ] Token expires after use (48-hour expiry per Story 1 decision)
- [ ] Graceful fallback to email if no phone number

## Verification & Automated Checks

Run after implementation is complete:

- [ ] `npm run build` — production build passes with no errors
- [ ] `npx playwright test e2e/story-3-*.spec.ts` — E2E tests for check-in flow
- [ ] `/security-review` — verify Twilio webhook signature validation
- [ ] `/code-review` — code quality review passes
- [ ] `/supabase-security-audit` — verify session and score RLS
- [ ] Validate zod schemas on /api/send-checkin and check-in submission
- [ ] Manual: send check-in SMS and complete flow on mobile
- [ ] Manual: verify flag logic fires correctly for ORS drop >= 5
- [ ] Manual: verify token expires after use (48-hour expiry)

## Open Questions
- Should the session record be created when check-in is sent, or when the client submits?
- Does Lindsay want to add session notes before or after sending the check-in?
- What Twilio number / account to use? (Lindsay's or a shared Meridian number?)
- Should we show a "last check-in sent" timestamp on the client card?
