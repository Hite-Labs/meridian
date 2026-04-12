# Story 7: Calendly Integration

**As a practitioner, I want to connect Calendly so clients can book sessions from within Meridian, and my calendar events include a link back to the client's Meridian page alongside the Zoom link.**

## Priority
High — key workflow improvement for Lindsay's coaching practice.

## What Exists Today
- "Schedule via Calendly" button in `NextSessionCard.tsx` (line 118-137) — currently non-functional (no onClick handler).
- `session` table tracks coaching sessions with `scheduled_at` field.
- NextSessionCard displays upcoming session date/time when `scheduledAt` is provided.
- Lindsay has a Calendly account but no API key set up yet.
- No settings/integrations page exists.

## What Needs to Be Built

### Calendly OAuth Connection
Practitioners connect their Calendly account via OAuth2 (not API key — more user-friendly, auto-refreshes).

- **`src/app/api/calendly/connect/route.ts`** — Initiates OAuth flow. Redirects practitioner to Calendly's authorization URL with scopes for reading event types and managing webhooks.
- **`src/app/api/calendly/callback/route.ts`** — Handles OAuth callback. Exchanges authorization code for access/refresh tokens, stores them encrypted in the practitioner's DB row.
- **`src/lib/calendly.ts`** — OAuth token management (store, refresh on expiry), API helpers for fetching event types and user info.

### Settings Page
- **`src/app/(app)/settings/integrations/page.tsx`** — Manage Calendly connection:
  - "Connect Calendly" button (initiates OAuth)
  - Once connected: show connected status, selected event type, "Disconnect" button
  - Event type picker: list practitioner's Calendly event types, select which one is used for coaching sessions

### In-App Booking (Embed Widget)
**Approach**: Use Calendly's inline embed widget, not the API. Calendly's scheduling API is read-only — you cannot create events via API. The embed widget handles availability, timezone conversion, Zoom link generation, and confirmation emails natively.

- **`src/components/CalendlyEmbed.tsx`** — Wrapper component for Calendly's inline scheduling widget. Accepts props for:
  - `schedulingUrl` — the practitioner's Calendly event type URL
  - `prefill` — client name and email
  - `customAnswers` — the Meridian deep link (see below)
- Uses `react-calendly` npm package or a simple iframe with URL parameters.

### Meridian Deep Link in Calendar Events
When a client books a session, the calendar event should contain both a Zoom link (native to Calendly) and a link back to the client's Meridian page.

**How this works**:
1. In Calendly's event type settings, create a **custom question**: "Meridian Client Link" configured as a **hidden field**.
2. When generating the embed URL, pass the Meridian deep link as the `a1` parameter: `?a1=https://app.meridian.coach/dashboard?clientId=<uuid>`
3. Calendly includes custom question answers in the calendar event description — so the practitioner sees both the Zoom link and the Meridian link when viewing the event in Google Calendar.

### Webhook-Driven Booking Sync
Calendly fires webhooks when bookings are created or canceled. Meridian listens to these to keep its session data in sync.

- **`src/app/api/calendly/webhook/route.ts`** — Handles webhook events:
  - `invitee.created`: Extract client ID from the custom field (`a1` parameter), create a `booking` record in the DB. The NextSessionCard now shows the upcoming session.
  - `invitee.canceled`: Mark the booking as canceled in the DB.
  - Verify webhook signature using `CALENDLY_WEBHOOK_SIGNING_KEY`.

- **`src/app/api/calendly/event-types/route.ts`** — Authenticated. Lists the practitioner's Calendly event types so they can choose which one to use for coaching sessions.

### NextSessionCard Update
Replace the non-functional "Schedule via Calendly" button (`NextSessionCard.tsx` line 118-137):
- **Calendly connected**: Opens a modal with the CalendlyEmbed component, pre-filled with client name/email and the Meridian deep link.
- **Not connected**: Shows "Connect Calendly" link to `/settings/integrations`.

### Database Migration
**`supabase/migrations/003_calendly.sql`**:

```sql
-- Calendly OAuth tokens for practitioner
ALTER TABLE practitioner
  ADD COLUMN IF NOT EXISTS calendly_access_token text,
  ADD COLUMN IF NOT EXISTS calendly_refresh_token text,
  ADD COLUMN IF NOT EXISTS calendly_token_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS calendly_user_uri text,
  ADD COLUMN IF NOT EXISTS calendly_event_type_uri text;

-- Bookings (synced from Calendly webhooks)
CREATE TABLE IF NOT EXISTS booking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES client(id) NOT NULL,
  practitioner_id uuid REFERENCES practitioner(id) NOT NULL,
  calendly_event_uri text UNIQUE,
  calendly_invitee_uri text,
  scheduled_at timestamptz NOT NULL,
  zoom_link text,
  status text CHECK (status IN ('scheduled', 'canceled', 'completed')) DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_booking_client ON booking(client_id);
CREATE INDEX idx_booking_practitioner ON booking(practitioner_id);
CREATE INDEX idx_booking_scheduled ON booking(scheduled_at);

-- RLS
ALTER TABLE booking ENABLE ROW LEVEL SECURITY;
CREATE POLICY booking_by_practitioner ON booking
  FOR ALL USING (practitioner_id IN (
    SELECT id FROM practitioner WHERE auth_id = auth.uid()
  ));
```

### Env Vars
- `CALENDLY_CLIENT_ID` — from Calendly developer portal
- `CALENDLY_CLIENT_SECRET` — from Calendly developer portal
- `CALENDLY_WEBHOOK_SIGNING_KEY` — for verifying webhook signatures

### New Dependencies
- `react-calendly` — embed widget (or use plain iframe if simpler)

### Manual Calendly Setup Steps (outside code)
1. Create a Calendly OAuth app at developer.calendly.com
2. Set redirect URI to `{APP_URL}/api/calendly/callback`
3. On the coaching event type, add a custom question: "Meridian Client Link" — set as hidden field, maps to `a1` URL parameter
4. Subscribe to webhook events: `invitee.created`, `invitee.canceled`

## Dependencies
- **Story 10 (Auth)** must be complete — Calendly routes need authenticated practitioner context, OAuth tokens are stored per-practitioner.

## Out of Scope
- Tier gating (all practitioners get Calendly for now — gating comes with Stripe later)
- Automated session reminder emails triggered by Calendly bookings (manual for now, see Story 6)
- Two-way sync (editing sessions in Meridian does not update Calendly)
- Multiple event types per practitioner

## Acceptance Criteria
- [ ] Practitioner can connect their Calendly account from settings
- [ ] "Schedule via Calendly" button opens an embedded scheduling widget pre-filled with client info
- [ ] After a client books, the booking appears in the NextSessionCard with date/time
- [ ] The practitioner's Google Calendar event contains both a Zoom link and a Meridian client link
- [ ] Canceled bookings are reflected in Meridian
- [ ] Disconnecting Calendly removes the integration cleanly

## Decisions
- Embed widget over API-based scheduling — Calendly's scheduling API is read-only.
- OAuth2 over API key — more user-friendly, auto-refreshes, standard pattern.
- Deep link via custom question parameter — the simplest way to get a Meridian link into the calendar event description.
- No tier gating for now — Lindsay is `pro` by default, Stripe comes later.

## Verification & Automated Checks

Run after implementation is complete:

- [ ] `npm run build` — production build passes with no errors
- [ ] `npx playwright test e2e/story-7-*.spec.ts` — E2E tests for Calendly integration
- [ ] `/security-review` — verify OAuth token storage, webhook signature validation
- [ ] `/code-review` — code quality review passes
- [ ] `/supabase-migration-assistant` — review 003_calendly migration
- [ ] `/supabase-security-audit` — verify RLS on booking table
- [ ] Validate zod schemas on all Calendly API routes
- [ ] Manual: connect Calendly account via OAuth flow
- [ ] Manual: book a session and verify it appears in NextSessionCard
- [ ] Manual: cancel a booking in Calendly and verify status updates in Meridian

## Open Questions
- Should bookings create a `session` record automatically, or should the practitioner confirm/create the session manually after the booking?
- What happens if a client books but isn't in Meridian yet? (Edge case: Calendly link shared outside the app.)
- Should we show a Calendly booking history in Meridian, or just the next upcoming booking?
