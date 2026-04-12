# Story 10: Practitioner Auth + Security Hardening

**As a practitioner, I want to sign in with Google so I have a secure account without managing a password.**

## Priority
MVP — required before Lindsay goes live.

## What Exists Today
- No auth of any kind. App is fully open demo mode.
- Supabase client configured with anon key, no RLS.
- `practitioner` table exists: id, name, email, modality, tier, created_at.
- Demo seed has "Dr. Maya Chen" as the practitioner.
- All API routes use hardcoded `DEMO_PRACTITIONER_ID`.

## Practitioner Management (MVP)
Practitioners are **manually seeded** — no self-service signup or onboarding UI for now. Two practitioners to seed:
- **Lindsay Hite** — modality: subconscious, tier: pro
- **Russell Hite** — modality: TBD, tier: pro

After each practitioner signs in with Google for the first time, manually run a SQL update to link their Supabase Auth UID to their practitioner record (see seed script below). Practitioner onboarding/self-service creation is deferred to a future iteration.

## What Needs to Be Built

### Auth Flow
- Enable Google OAuth provider in Supabase Auth settings (Dashboard → Authentication → Providers → Google)
- Add sign-in page / button (Google only, no email/password)
- On sign-in, look up `practitioner` record by `auth_id`; if not found, show "Account not found — contact admin"
- After auth, redirect to practitioner dashboard

### Route Protection
- Add Next.js middleware to protect `/(app)/*` routes
- Unauthenticated users redirected to sign-in
- Public routes: `/`, `/intake`, `/check-in`, `/checkin`, `/client-dashboard` (token-based flows)

### Database Migration (002_auth_id_and_rls.sql)
```sql
-- Add auth_id to link Supabase Auth UID to practitioner record
ALTER TABLE practitioner ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;

-- RLS policies
ALTER TABLE practitioner ENABLE ROW LEVEL SECURITY;
ALTER TABLE client ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;
ALTER TABLE score ENABLE ROW LEVEL SECURITY;
ALTER TABLE flag ENABLE ROW LEVEL SECURITY;
ALTER TABLE response ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_token ENABLE ROW LEVEL SECURITY;

-- Practitioner sees only their own data
CREATE POLICY practitioner_own ON practitioner FOR ALL
  USING (auth_id = auth.uid());
CREATE POLICY client_by_practitioner ON client FOR ALL
  USING (practitioner_id IN (SELECT id FROM practitioner WHERE auth_id = auth.uid()));
-- Similar policies for session, score, flag, response, client_token
```

### Seed Script
Run after first Google sign-in to link auth UIDs:
```sql
-- Lindsay
INSERT INTO practitioner (name, email, modality, tier, auth_id)
VALUES ('Lindsay Hite', 'lindsay@...', 'subconscious', 'pro', '<her-supabase-auth-uid>');

-- Russell
INSERT INTO practitioner (name, email, modality, tier, auth_id)
VALUES ('Russell Hite', 'russell@...', 'both', 'pro', '<his-supabase-auth-uid>');
```

### Replace Hardcoded Demo IDs
All API routes currently use `DEMO_PRACTITIONER_ID` from `src/lib/demo.ts`. After auth is built:
- `POST /api/clients` → get practitioner from auth session
- `GET /api/clients` → get practitioner from auth session
- `GET /api/flags` → get practitioner from auth session
- `PATCH /api/client` → get practitioner from auth session

## Out of Scope
- Practitioner self-service signup / onboarding wizard
- Email/password auth
- Practitioner profile editing UI
- Multi-tenant practitioner management

## Acceptance Criteria
- [ ] Lindsay can sign in with Google
- [ ] Russell can sign in with Google
- [ ] Both land on their own practitioner dashboard with only their clients
- [ ] Unauthenticated users cannot access dashboard routes
- [ ] Public intake/check-in/client-dashboard routes remain accessible without auth
- [ ] RLS enforced — each practitioner only sees their own data
- [ ] Unknown Google accounts see "Account not found" (no auto-registration)

## Verification & Automated Checks

Run after implementation is complete:

- [ ] `npm run build` — production build passes with no errors
- [ ] `npx playwright test` — ALL E2E tests pass (full regression)
- [ ] `/security-review` — comprehensive security review, no critical/high issues
- [ ] `/supabase-security-audit` — full RLS audit on all 7+ tables
- [ ] `/supabase-migration-assistant` — review 002_auth_id_and_rls migration
- [ ] `/code-review` — full codebase quality review
- [ ] Validate all API routes use authenticated Supabase client (no anon key on server)
- [ ] Verify middleware.ts protects all /(app)/* routes
- [ ] Verify public routes (/intake, /check-in, /client-dashboard) remain accessible
- [ ] Manual: sign in as Lindsay via Google OAuth
- [ ] Manual: sign in as Russell via Google OAuth
- [ ] Manual: verify each practitioner sees only their own clients
- [ ] Manual: verify unknown Google account sees "Account not found"
- [ ] Manual: verify unauthenticated access to /dashboard redirects to sign-in

## Open Questions
- What Google accounts will Lindsay and Russell use? (needed for seed script)
- Should we show the landing page to authenticated users, or redirect straight to dashboard?
