# Meridian — User Story Specs

Each file in this folder is a self-contained spec for one user story.
All stories are MVP. Story 10 (Auth + Security) is deliberately deferred to the end — no live data at risk during dev, and auth adds friction to testing other features.

| # | Story | Status | Priority |
|---|-------|--------|----------|
| 1 | [Create a Client](./story-1-create-client.md) | done | MVP |
| 2 | [Client Magic Link + Intake](./story-2-client-intake.md) | done | MVP |
| 3 | [Post-Session Check-In via SMS](./story-3-session-checkin-sms.md) | done | MVP |
| 4 | [Multiple Clients Dashboard](./story-4-multi-client-dashboard.md) | done | MVP |
| 5 | [Chart Export](./story-5-chart-export.md) | done | MVP |
| 6 | [Transactional Email (Resend)](./story-6-email-resend.md) | not started | MVP |
| 7 | [Calendly Integration](./story-7-calendly-integration.md) | not started | MVP |
| 8 | [Client Dashboard](./story-8-client-dashboard.md) | partially built | MVP |
| 9 | [Twilio SMS End-to-End Testing](./story-9-twilio-sms-testing.md) | not started | MVP |
| 10 | [Practitioner Auth + Security Hardening](./story-10-practitioner-auth.md) | not started | MVP |
| 11 | [Practitioner Profile & Account Management](./story-11-practitioner-profile.md) | not started | MVP |
| 12 | [Admin Panel](./story-12-admin-panel.md) | not started | MVP |
| 13 | [Account Switcher](./story-13-account-switcher.md) | not started | MVP |

## Dependency Order

```
Story 1 (Create Client)
  ├── Story 6 (Email/Resend) → intake invites
  ├── Story 2 (Intake Magic Link) → needs tokens + email
  ├── Story 3 (Check-In SMS) → needs Twilio + tokens
  └── Story 8 (Client Dashboard) → token-based access
Story 4 (Multi-Client Dashboard)
Story 5 (Chart Export) — independent
Story 7 (Calendly) → includes settings page
Story 10 (Auth + Security) — final pass: auth, RLS, security headers, rate limiting
```

## Migration Sequence

| # | Migration | Story |
|---|-----------|-------|
| 001 | `add_client_phone_and_tokens` | Story 1 |
| 002 | `auth_id_and_rls` | Story 10 |
| 003 | `calendly` | Story 7 |

## Environment
- **Branch:** `dev` (all new work)
- **Stack:** Next.js, Supabase, Resend, Twilio
- **Practitioner:** Lindsay Hite (subconscious coaching modality)

## Delivery Channels
- **Resend (email):** Transactional emails — intake invites, welcome emails, account setup
- **Twilio (SMS):** Practitioner→client communication — session check-in links
