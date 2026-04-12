# Story 8: Client Dashboard

**As a client, I want to see my progress after completing sessions so I can track my coaching journey without needing to create an account.**

## Priority
MVP — required before Lindsay goes live.

## What Exists Today
- `/client-dashboard` page exists with basic ORS trend chart and flag display
- `TrendChart` component renders ORS scores over sessions using Recharts
- Page currently requires `?clientId` query param — no token-based access
- No access control — anyone with the URL can view any client's data
- Shows some clinical data (flags) that should be practitioner-only

## What Needs to Change

### Token-Based Access
- Client dashboard accessed via magic link: `/client-dashboard?token=xxx`
- New token type: `dashboard` in `client_token` table (or reuse `milestone` type)
- Token does not expire (persistent access for the client)
- On load: validate token → resolve `client_id` → fetch client data
- Invalid token → show error page

### What the Client Sees
Per project decisions, the client dashboard is a coaching-focused view:
- **ORS trend chart** — visual progress over sessions
- **Highlights** — coach-written session notes (positive framing)
- **Next steps** — checklist items from the coach for the client to work on
- **Session count** — how many sessions completed

### What's Hidden (Practitioner-Only)
- Flags (red/amber/green) — practitioner-only, not shown to clients
- PHQ-4 scores — clinical screening, not for client view
- SRS scores — therapeutic alliance feedback, practitioner-only
- SUDS/VOC raw scores — session-specific clinical measures
- WHO-5 raw scores (trend is OK, raw numbers may confuse)

### How Clients Get the Link
- Practitioner can share the dashboard link manually (copy link button)
- Optionally: include dashboard link in post-session check-in confirmation screen
- No automatic delivery — Lindsay controls when clients see their progress

### UI Design
- Mobile-first (clients will access on phone)
- Coaching tone — warm, encouraging, not clinical
- Practitioner name shown: "Your sessions with Lindsay"
- Clean, simple layout — chart + highlights + next steps

## Dependencies
- **Story 1 (Create Client)** — clients must exist
- **Story 2 (Intake)** — initial data from intake
- **Story 3 (Check-In)** — session data populates the dashboard

## Out of Scope
- Client account creation / login
- Client editing their own data
- Client messaging the practitioner
- Notification when new session data is available

## Acceptance Criteria
- [ ] Client can access their dashboard via magic link token
- [ ] Dashboard shows ORS trend chart
- [ ] Dashboard shows highlights (session notes) and next steps
- [ ] No flags, PHQ-4, SRS, or clinical data visible to client
- [ ] Invalid/missing token shows error page
- [ ] Mobile-friendly layout
- [ ] Practitioner name ("Your sessions with Lindsay") appears in UI

## Verification & Automated Checks

Run after implementation is complete:

- [ ] `npm run build` — production build passes with no errors
- [ ] `npx playwright test e2e/story-8-*.spec.ts` — E2E tests for client dashboard
- [ ] `/security-review` — verify no PHQ-4, flags, or clinical data exposed to client view
- [ ] `/code-review` — code quality review passes
- [ ] `/supabase-security-audit` — verify dashboard token access is properly scoped
- [ ] React best practices skill — verify mobile-first component patterns
- [ ] Manual: access client dashboard via magic link token on mobile viewport
- [ ] Manual: verify ORS trend chart renders with correct data
- [ ] Manual: verify highlights and next steps display correctly
- [ ] Manual: verify invalid/expired token shows error page
- [ ] Manual: verify NO flags, PHQ-4, SRS, SUDS, VOC, or WHO-5 raw scores visible

## Open Questions
- Should the dashboard token be included in the check-in confirmation screen?
- Does Lindsay want a "share dashboard" button on the practitioner's client page?
- Should the client see WHO-5 trend alongside ORS, or just ORS?
