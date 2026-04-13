# Story 12: Admin Panel

**As an admin (Russell), I want to manage practitioners — create accounts, view usage, and handle support issues — so I can operate the platform.**

## Priority
MVP

## What Exists Today
- No admin role or admin UI
- Practitioners are manually seeded via SQL
- No way to view all practitioners or their clients
- No usage metrics or monitoring

## What Needs to Be Built

### Admin Role
- Add `role` column to practitioner table: `practitioner` (default) or `admin`
- Admin check on all admin routes
- Russell's account flagged as admin in seed data

### Admin Dashboard
- **`/admin`** — protected route, admin-only
- Practitioner list: name, email, tier, client count, last active, created date
- Click practitioner → detail view with their clients and usage

### Practitioner Management
- **Create practitioner** — admin creates accounts for new coaches
  - Fields: name, email, modality, tier
  - Generates a welcome/setup flow (ties into Story 10 auth)
- **Edit practitioner** — admin can update any practitioner's details
- **Deactivate practitioner** — soft deactivate, preserves data
- **Delete practitioner** — hard delete with cascading cleanup (clients, sessions, scores, flags, tokens)

### Usage Overview
- Total practitioners, total clients, total sessions
- Per-practitioner: client count, session count, last session date, active flag count
- Simple table view — no charts needed for MVP

### Database Migration
```sql
ALTER TABLE practitioner ADD COLUMN IF NOT EXISTS role text
  CHECK (role IN ('practitioner', 'admin')) DEFAULT 'practitioner';

-- Seed Russell as admin (run after auth is set up)
-- UPDATE practitioner SET role = 'admin' WHERE email = 'russell@...';
```

### API Routes
| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/admin/practitioners` | List all practitioners with usage stats |
| `GET` | `/api/admin/practitioners/[id]` | Get practitioner details + their clients |
| `POST` | `/api/admin/practitioners` | Create new practitioner |
| `PATCH` | `/api/admin/practitioners/[id]` | Update practitioner |
| `DELETE` | `/api/admin/practitioners/[id]` | Deactivate/delete practitioner |
| `GET` | `/api/admin/stats` | Platform usage overview |

### Navigation
- Admin link in sidebar (only visible to admin role)
- Or separate `/admin` route with its own layout

## Dependencies
- **Story 10 (Auth)** — admin routes need authenticated user with role check
- **Story 11 (Practitioner Profile)** — shares practitioner table schema changes

## Out of Scope
- Revenue/billing dashboard (future, post-Stripe)
- Practitioner impersonation ("login as")
- Audit logging
- Email notifications to practitioners

## Acceptance Criteria
- [ ] Admin can view list of all practitioners with usage stats
- [ ] Admin can create a new practitioner account
- [ ] Admin can edit any practitioner's details
- [ ] Admin can deactivate/delete a practitioner
- [ ] Non-admin users cannot access admin routes
- [ ] Platform usage overview shows total counts

## Verification & Automated Checks
- [ ] `npm run build` — production build passes
- [ ] `npx playwright test e2e/story-12-*.spec.ts` — E2E tests
- [ ] `/security-review` — verify admin role enforcement on all admin routes
- [ ] `/code-review` — code quality review
- [ ] Manual: create, edit, deactivate a practitioner from admin panel
