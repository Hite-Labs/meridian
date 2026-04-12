# Story 1: Client Management (Create, Edit, Delete)

**As a practitioner, I want to add, edit, and remove clients so I can manage my coaching engagements.**

## Priority
MVP — required before Lindsay goes live.

## What Exists Today
- `client` table: id, practitioner_id, name, email, phone, modality, status, goal, created_at.
- `client_token` table with token types: `intake`, `session_checkin`, `milestone`.
- `AddClientModal` component with form: first name, last name, email, phone (optional), notes.
- `POST /api/clients` creates client + generates intake token. Uses hardcoded DEMO_PRACTITIONER_ID.
- `GET /api/clients` lists clients with latest ORS, last session date, flag count.
- No edit or delete functionality.

## Data Model Changes

### Client Table Updates
```sql
-- Add notes column (AddClientModal collects notes but schema has no column)
ALTER TABLE client ADD COLUMN IF NOT EXISTS notes text;

-- Add archived_at for soft delete
ALTER TABLE client ADD COLUMN IF NOT EXISTS archived_at timestamptz;

-- Add first_name/last_name to replace single name field
-- (AddClientModal already collects these separately)
ALTER TABLE client ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE client ADD COLUMN IF NOT EXISTS last_name text;
```

**Note:** The `name` field currently stores a combined name. Migration should populate `first_name`/`last_name` from existing `name` values, then code can use `first_name` + `last_name` going forward. Keep `name` as a computed/display field or drop it after migration.

### Client Token Type Update
Add `dashboard` type for Story 9 (client dashboard access):
```sql
ALTER TABLE client_token
  DROP CONSTRAINT client_token_token_type_check,
  ADD CONSTRAINT client_token_token_type_check
    CHECK (token_type IN ('intake', 'session_checkin', 'milestone', 'dashboard'));
```

## What Needs to Be Built

### Create Client (mostly exists)
- `AddClientModal` — already built, needs auth context instead of demo ID
- `POST /api/clients` — already built, needs:
  - Replace `DEMO_PRACTITIONER_ID` with authenticated practitioner (Story 1)
  - Store `notes` field (currently collected but not saved)
  - Store `first_name` and `last_name` separately

### Edit Client (new)
- "Edit Client" button on client page opens `EditClientModal`
- Modal pre-filled with current client data
- Editable fields: first name, last name, email, phone, notes, goal, modality, status
- `PATCH /api/clients/[id]` — update client record
  - Validates practitioner owns this client
  - Returns updated client

### Delete Client — Soft Delete (new)
- "Archive Client" button on client page (in edit modal or overflow menu)
- Confirmation dialog: "Archive [client name]? Their data will be preserved but they'll be hidden from your dashboard."
- `DELETE /api/clients/[id]` — sets `archived_at = now()` (soft delete)
  - Does NOT delete sessions, scores, responses, flags, or tokens
  - Client disappears from `GET /api/clients` list (filter `WHERE archived_at IS NULL`)
  - Can be restored later via direct DB update (no UI for restore in MVP)

### Invitation Delivery
- Creating a client does NOT automatically send the invitation
- Separate "Send Invite" button on the client card so Lindsay can control timing
- "Send Invite" calls `POST /api/email/send-intake` (Story 7) to deliver the intake magic link via email

### Token Expiry (Decision — applies to Stories 3, 4, 7, 9)
- **Intake tokens: 7 days** — clients need time to complete intake at their convenience
- **Check-in tokens: 48 hours** — session check-ins should be completed promptly
- **Dashboard tokens: no expiry** — persistent access for the client (Story 9)

## API Summary

| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/api/clients` | Create client + generate intake token |
| `GET` | `/api/clients` | List practitioner's clients (excludes archived) |
| `GET` | `/api/clients/[id]` | Get single client details |
| `PATCH` | `/api/clients/[id]` | Update client fields |
| `DELETE` | `/api/clients/[id]` | Soft delete (archive) client |

## Dependencies
- **Story 10 (Auth)** — API routes need authenticated practitioner context

## Out of Scope
- Restore archived client (direct DB for now)
- Batch import/export clients
- Client self-service profile editing
- Client merge/dedup

## Acceptance Criteria
- [ ] Practitioner can create clients from the dashboard
- [ ] Practitioner can edit all fields on an existing client via modal
- [ ] Practitioner can archive a client (soft delete with confirmation)
- [ ] Archived clients don't appear in the client list
- [ ] Each client gets a unique magic link for intake
- [ ] Phone field is optional; email is required
- [ ] "Send Invite" button triggers email delivery (Story 7)
- [ ] Notes are stored and displayed on the client page
- [ ] First name / last name stored separately

## Verification & Automated Checks

Run after implementation is complete:

- [ ] `npm run build` — production build passes with no errors
- [ ] `npx playwright test e2e/story-1-*.spec.ts` — E2E tests for client CRUD
- [ ] `/code-review` — code quality review passes
- [ ] `/supabase-migration-assistant` — review migration for schema changes
- [ ] `/supabase-security-audit` — verify RLS on client table
- [ ] Validate zod schemas on all API routes (POST, PATCH, DELETE /api/clients)
- [ ] React best practices skill — verify modal components follow patterns
- [ ] Manual: create, edit, and archive a client from the dashboard UI

## Open Questions
- Do we need a client status of "invited" before they complete intake?
- Should archived clients be visible in a separate "archived" list, or only via DB?
