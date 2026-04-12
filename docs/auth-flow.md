# Authentication Flow

## Current State: Demo Mode

No authentication is implemented. All pages are publicly accessible.

- **Supabase client**: Single shared client using `NEXT_PUBLIC_SUPABASE_ANON_KEY` for both browser and server (`src/lib/supabase.ts`)
- **Demo IDs**: Hardcoded in `src/lib/demo.ts`
  - `DEMO_PRACTITIONER_ID` = "a1b2c3d4-0000-0000-0000-000000000001"
  - `DEMO_CLIENT_ID` = "b2c3d4e5-0000-0000-0000-000000000001"
- **No middleware.ts**: No route protection exists
- **API routes**: Accept `clientId` from query params/body with no ownership verification

## Magic Link Infrastructure (Built, Not Connected)

The `client_token` table and token generation exist but are not consumed in the UI.

### Token Generation

When a client is created via `POST /api/clients` (`src/app/api/clients/route.ts`):
1. Client record inserted into `client` table
2. Magic link token auto-generated with:
   - `token_type`: 'intake'
   - `expires_at`: 48 hours from creation
3. Token UUID returned as `intakeToken` in the response

### Intended Token Validation Flow (Not Yet Implemented)

1. Client receives magic link with token in URL (via email or SMS)
2. Intake/check-in page reads token from query parameter
3. Server validates token against `client_token` table:
   - Token exists
   - `expires_at` > now
   - `used_at` IS NULL
4. Extract `client_id` from token record
5. Mark token as used (`used_at = now()`)
6. Allow questionnaire submission scoped to that client

### Pages Requiring Token Validation

| Page | Current Behavior | Target Behavior |
|------|-----------------|-----------------|
| `/intake` | Hardcoded to `FRESH_INTAKE_CLIENT_ID` | Validate intake token, extract client_id |
| `/check-in` | Hardcoded to `DEMO_SESSION_ID` | Validate session_checkin token |

## Target Architecture (ShipFast + Supabase Auth)

### Practitioner Auth
- ShipFast handles practitioner login (magic link or OAuth)
- Supabase Auth issues JWT with practitioner UUID as `auth.uid()`
- `middleware.ts` validates session on all `/(auth)/` routes
- API routes use `createServerClient` from `@supabase/ssr` to get authenticated user

### Client Auth
- No login required -- magic link tokens grant scoped access
- Token validated server-side, no persistent session needed

### Supabase Client Split

| Client | Location | Key | Purpose |
|--------|----------|-----|---------|
| Browser | `lib/supabase/client.ts` | anon key | Client components, RLS-scoped queries |
| Server | `lib/supabase/server.ts` | anon key + cookies | API routes, server components |
| Admin | `lib/supabase/admin.ts` | service_role key | Bypasses RLS, server-only |

### RLS Policy Pattern

Every table needs policies scoped to the authenticated practitioner:
```sql
ALTER TABLE client ENABLE ROW LEVEL SECURITY;
CREATE POLICY "practitioners_own_clients" ON client
  FOR ALL USING (practitioner_id = auth.uid());
```

## Key Files

- Current Supabase client: `src/lib/supabase.ts`
- Demo constants: `src/lib/demo.ts`
- Client creation + token gen: `src/app/api/clients/route.ts`
- Token schema: `supabase/schema.sql` (client_token table)
