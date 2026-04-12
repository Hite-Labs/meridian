@AGENTS.md

# Bluejay
Coaching progress tracking SaaS. Stack: Next.js 15 (App Router), Supabase, 
ShipFast (auth + Stripe), Tailwind CSS, Twilio SMS, Claude API. Deployed on Vercel Pro.

## Commands
npm run dev               # Dev server (port 3000)
npm run build             # Production build
npm run test              # Vitest unit tests
npm run test:e2e          # Playwright E2E tests
npx supabase db push      # Deploy pending migrations to remote
npx supabase db reset     # Reset local DB and apply all migrations + seed
npx supabase gen types    # Regenerate TypeScript types — run after ANY schema change

## Branch Strategy
- main = demo branch (stable, always deployable)
- dev = active development
- Never push directly to main

## Architecture
app/(auth)/               # Practitioner-gated routes
app/(public)/             # Public-facing pages
app/api/webhooks/         # Stripe + Twilio webhooks
lib/supabase/server.ts    # Server-side Supabase client (uses @supabase/ssr)
lib/supabase/admin.ts     # Service-role client — SERVER ONLY, never import in client code
supabase/migrations/      # Auto-generated SQL migrations — NEVER edit directly
supabase/schemas/         # Source-of-truth schema files — edit these, then diff

## Non-Negotiable Rules
- NEVER expose the service_role key in client-side code
- NEVER edit supabase/migrations/ directly — always use: supabase db diff -f <migration_name>
- ALL new tables must have RLS enabled immediately after creation
- Validate all inputs with zod in every API route and Server Action
- Stripe and Twilio webhook handlers MUST verify signatures before processing
- Run npx supabase gen types after ANY schema change, no exceptions
- PHQ-4 scores are practitioner-only — never expose to client-facing views or APIs
- The client dashboard must never surface clinical thresholds, declining trends, or raw scores

## Testing Rules
- Write failing tests BEFORE writing implementation (RED then GREEN then REFACTOR)
- Use AAA pattern in all tests: Arrange, Act, Assert
- RLS policies must have pgTAP tests — a table without tested RLS is not done
- Auth flows use magic link + InBucket for testing, never real OAuth in test environments

## Reference Docs
@docs/database-schema.md        # Read before any schema or migration change
@docs/auth-flow.md              # Read before touching authentication
@docs/measurement-framework.md  # Read before touching questionnaire or scoring logic
@docs/flag-rules.md             # Read before touching flag detection or thresholds
