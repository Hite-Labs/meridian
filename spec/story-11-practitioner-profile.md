# Story 11: Practitioner Profile & Account Management

**As a practitioner, I want to manage my profile, contact details, and account settings so clients see accurate information and I can control my account.**

## Priority
MVP

## What Exists Today
- `practitioner` table: id, name, email, modality, tier, created_at
- No profile editing UI
- No settings page
- Practitioner name is seeded directly in the database
- No account deletion or deactivation

## What Needs to Be Built

### Profile Page
- **`/settings/profile`** — practitioner can view and edit their details
- Editable fields: name, email, phone (new column), business name (new column), bio (new column)
- Modality selector: conscious, subconscious, both
- Profile photo upload (stretch — defer if complex)

### Contact Details
- Phone number — used as SMS sender context and for client-facing display
- Email — used for account login (Story 10) and transactional email (Story 6)
- Business name — displayed on client-facing pages instead of personal name if set

### Account Management
- **Change plan/tier** — foundation vs pro (placeholder until Stripe, Story 10+)
- **Deactivate account** — soft deactivate, preserves data, stops access
- **Delete account** — hard delete with confirmation, removes all practitioner data + clients + sessions + scores + flags
  - Must confirm by typing practitioner name
  - Irreversible warning
  - Cascading delete or archive

### Database Migration
```sql
ALTER TABLE practitioner ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE practitioner ADD COLUMN IF NOT EXISTS business_name text;
ALTER TABLE practitioner ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE practitioner ADD COLUMN IF NOT EXISTS deactivated_at timestamptz;
```

### API Routes
| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/practitioner/me` | Get current practitioner profile |
| `PATCH` | `/api/practitioner/me` | Update profile fields |
| `DELETE` | `/api/practitioner/me` | Deactivate or delete account |

### UI
- Settings page accessible from sidebar (add "Settings" nav item)
- Profile form with save/cancel
- Danger zone section for deactivation/deletion

## Dependencies
- **Story 10 (Auth)** — "me" routes need authenticated practitioner context (use DEMO_PRACTITIONER_ID until then)

## Out of Scope
- Profile photo upload (defer to future)
- Stripe billing management (future)
- Multi-practitioner team management

## Acceptance Criteria
- [ ] Practitioner can view and edit their name, email, phone, business name, bio
- [ ] Practitioner can change their coaching modality
- [ ] Changes are reflected immediately across all client-facing pages
- [ ] Practitioner can deactivate their account
- [ ] Practitioner can delete their account with confirmation
- [ ] Settings page is accessible from sidebar navigation

## Verification & Automated Checks
- [ ] `npm run build` — production build passes
- [ ] `npx playwright test e2e/story-11-*.spec.ts` — E2E tests
- [ ] `/code-review` — code quality review
- [ ] `/supabase-migration-assistant` — review migration
- [ ] Manual: edit profile and verify changes appear on client-facing pages
