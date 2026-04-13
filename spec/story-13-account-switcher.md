# Story 13: Account Switcher

**As Russell (admin), I want to switch between practitioner accounts so I can view the platform from any practitioner's perspective for support and testing.**

## Priority
MVP

## What Exists Today
- Single hardcoded `DEMO_PRACTITIONER_ID` used across all routes
- No concept of "current account" in the UI
- No way to switch between practitioners

## What Needs to Be Built

### Account Switcher UI
- Dropdown in the sidebar header (below the Meridian brand)
- Shows current practitioner name + role badge (admin/practitioner)
- Click to expand: list of all practitioners (admin only) or just the current user
- Select a practitioner → switches the dashboard context to that practitioner's clients
- Visual indicator of which account is active

### How It Works (Pre-Auth)
- Store the active practitioner ID in localStorage or a cookie
- All API routes read from a helper `getActivePractitionerId()` that checks:
  1. Cookie/localStorage override (if admin is impersonating)
  2. Falls back to `DEMO_PRACTITIONER_ID`
- Admin can switch; regular practitioners see only their own account

### How It Works (Post-Auth, Story 10)
- Replace localStorage with session-based practitioner context
- Admin impersonation stored in session with clear "viewing as [name]" banner
- Exit impersonation returns to admin's own account

### API Changes
- Create `src/lib/practitioner.ts` — `getActivePractitionerId(request?)` helper
- Replace all `DEMO_PRACTITIONER_ID` imports with this helper
- `GET /api/admin/practitioners` — list all practitioners (for the switcher dropdown)

### UI Components
- **AccountSwitcher** in AppSidebar — shows current practitioner, dropdown to switch
- **Impersonation banner** — subtle bar at top when viewing as another practitioner: "[name]'s account — Exit"

### Files to Update
All API routes that use `DEMO_PRACTITIONER_ID`:
- `src/app/api/clients/route.ts`
- `src/app/api/clients/[id]/route.ts`
- `src/app/api/send-checkin/route.ts`
- `src/app/api/send-intake/route.ts`

## Dependencies
- **Story 12 (Admin Panel)** — admin role must exist
- **Story 10 (Auth)** — for production-ready impersonation

## Out of Scope
- Audit logging of impersonation sessions
- Restricting which practitioners admin can view
- Multi-tenant data isolation (handled by RLS in Story 10)

## Acceptance Criteria
- [ ] Admin sees all practitioners in the switcher dropdown
- [ ] Selecting a practitioner loads their clients and dashboard
- [ ] Clear visual indicator of which account is active
- [ ] Impersonation banner shown when viewing another practitioner's account
- [ ] "Exit" returns to admin's own account
- [ ] Non-admin users don't see the switcher (just their own name)

## Verification & Automated Checks
- [ ] `npm run build` — production build passes
- [ ] `npx playwright test e2e/story-13-*.spec.ts` — E2E tests
- [ ] `/security-review` — verify admin-only access to switcher
- [ ] `/code-review` — code quality review
- [ ] Manual: switch between practitioners and verify data isolation
