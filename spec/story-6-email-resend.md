# Story 6: Transactional Email (Resend)

**As a practitioner, I want to send intake invitations and welcome emails so clients receive professional, branded communications.**

## Priority
MVP — required before Lindsay goes live.

## Delivery Channel
This story handles **transactional email via Resend** — intake invitations, welcome emails, and account setup. Practitioner→client session check-in delivery is handled by Story 3 (Twilio SMS). Both channels coexist.

## What Exists Today
- "Send Intake Invite" button in `NextSessionCard.tsx` (line 139-151) — currently non-functional, shows a TODO for Twilio (line 177).
- `AddClientModal.tsx` creates clients via `POST /api/clients` — returns an `intakeToken` but doesn't send anything.
- `client_token` table exists with token types: `intake`, `session_checkin`, `milestone`.
- Magic link flows already work: `/intake?token=...` and `/check-in?token=...`.
- No email sending infrastructure of any kind.

## What Needs to Be Built

### Infrastructure
- Install `resend` npm package.
- Create `src/lib/resend.ts` — Resend client initialization using `RESEND_API_KEY`.
- Set up a verified sending domain in Resend dashboard (e.g., `meridian.coach` or a subdomain).

### Email Templates
React email templates in `src/lib/emails/`:

- **`intake-invite.tsx`** — "Hi [first name], [Lindsay] has invited you to begin your coaching journey. Tap here to get started: [magic link]". Branded with Meridian's editorial design (Libre Baskerville, gold accents).
- **`welcome.tsx`** — Welcome email sent to a new practitioner after first sign-up (Phase 1 auth).

### API Routes
- `POST /api/email/send-intake` — Authenticated. Accepts `{ clientId }`. Looks up client, creates a `client_token` (type: `intake`, 7-day expiry per Story 1 decision) if one doesn't exist, sends the intake invite email via Resend. Returns success/failure.

### UI Wiring
- `NextSessionCard.tsx` — Replace the Twilio TODO: "Send Intake Invite" button calls `POST /api/email/send-intake` with the client's ID. Show success/error state.
- `AddClientModal.tsx` — After creating a client, show an option to immediately send the intake invite email.

### Env Vars
- `RESEND_API_KEY` — from Resend dashboard
- `RESEND_FROM_EMAIL` — e.g., `Lindsay <hello@meridian.coach>` or `noreply@meridian.coach`

## Dependencies
- **Story 10 (Auth)** must be complete — email routes need authenticated practitioner context.

## Out of Scope
- SMS delivery (handled by Story 3)
- Session reminder emails (future — currently manual via Story 4 SMS)
- Automated/scheduled email sending (manual trigger only for now)
- Email open/click tracking
- Unsubscribe management

## Acceptance Criteria
- [ ] Practitioner can send an intake invite email from the dashboard
- [ ] Client receives a branded email with a working magic link
- [ ] Clicking the magic link opens the intake questionnaire
- [ ] "Send Intake Invite" button shows success confirmation after sending
- [ ] Email sending fails gracefully if Resend is misconfigured (no crash, shows error to practitioner)
- [ ] Intake token uses 7-day expiry (per Story 2 decision)

## Decisions
- Resend handles transactional email; Twilio handles SMS (Story 3). Both are MVP.
- Using Resend over SendGrid/Mailgun — React email templates, simpler API.
- Manual send only for MVP — Lindsay controls when emails go out (consistent with Story 1 decision).

## Verification & Automated Checks

Run after implementation is complete:

- [ ] `npm run build` — production build passes with no errors
- [ ] `npx playwright test e2e/story-6-*.spec.ts` — E2E tests for email sending flow
- [ ] `/security-review` — verify no secrets exposed, API key handling secure
- [ ] `/code-review` — code quality review passes
- [ ] Validate zod schemas on /api/email/send-intake
- [ ] Manual: send intake invite and verify email arrives with correct magic link
- [ ] Manual: click magic link in email and verify intake questionnaire loads
- [ ] Manual: verify graceful error when Resend is misconfigured

## Open Questions
- What email address / domain will Lindsay send from? Needs DNS verification in Resend.
- Do we want a "resend invite" button if the token expires?
