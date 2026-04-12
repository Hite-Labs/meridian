# Story 4: Multiple Clients — Practitioner Dashboard Client List

**As a practitioner, I want to see all my clients in one place so I can manage multiple engagements.**

## Priority
Post-MVP — scoped but not launch-blocking.

## What Exists Today
- Practitioner dashboard exists but shows a single client selected via query param
- Client data fetched via `GET /api/flags?clientId=xxx`
- No client list / picker UI
- Schema supports multiple clients per practitioner already

## What Needs to Be Built

### Dashboard Redesign
- Default view: client list showing all clients for the authenticated practitioner
- Each row: client name, status (active/inactive/completed), last session date, current ORS score, active flag count
- Active flags bubble up visually (red/amber badge)
- Click client name → navigate to their full client page (existing dashboard view)
- "Add Client" button accessible from the list (links to Story 2 flow)

### API
- `GET /api/clients` — list all clients for the authenticated practitioner
- Include latest ORS score, last session date, active flag count in response

### Navigation
- Sidebar already exists with client navigation
- Update to dynamically list practitioner's real clients instead of demo scenarios

## Out of Scope
- Search/filter across clients
- Sorting options
- Client archiving UI

## Acceptance Criteria
- [ ] Dashboard shows all clients, not just the most recent
- [ ] Active flags bubble up visually in the list
- [ ] Clicking a client name navigates to their page correctly
- [ ] "Add Client" is accessible from the list view
- [ ] Empty state when no clients exist yet

## Verification & Automated Checks

Run after implementation is complete:

- [ ] `npm run build` — production build passes with no errors
- [ ] `npx playwright test e2e/story-4-*.spec.ts` — E2E tests for client list
- [ ] `/code-review` — code quality review passes
- [ ] `/supabase-performance-optimizer` — verify client list query performance
- [ ] React best practices skill — verify list rendering, memoization
- [ ] Manual: verify client list shows correct ORS scores, flag counts, last session dates
- [ ] Manual: verify empty state renders correctly with no clients
- [ ] Manual: verify clicking a client navigates to their detail page

## Open Questions
- How many clients will Lindsay have at launch? (affects whether we need pagination)
- Should the list show a mini sparkline of ORS trend, or just the current score?
