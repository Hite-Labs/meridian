# Database Schema

PostgreSQL on Supabase. 7 tables tracking practitioners, clients, sessions, questionnaire responses, composite scores, and flags.

## Entity Relationships

```
practitioner (1) --> (many) client
practitioner (1) --> (many) session
client (1) --> (many) client_token
client (1) --> (many) session
client (1) --> (many) response
client (1) --> (many) score
client (1) --> (many) flag
session (1) --> (many) response
session (1) --> (many) score
session (1) --> (many) flag
```

## Tables

### practitioner

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| name | text | NOT NULL |
| email | text | NOT NULL |
| modality | text | NOT NULL, CHECK ('conscious', 'subconscious', 'both') |
| tier | text | DEFAULT 'foundation', CHECK ('foundation', 'pro') |
| created_at | timestamptz | DEFAULT now() |

### client

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| practitioner_id | uuid | FK -> practitioner(id) |
| name | text | NOT NULL |
| email | text | NOT NULL |
| phone | text | nullable |
| modality | text | NOT NULL, CHECK ('conscious', 'subconscious', 'both') |
| status | text | DEFAULT 'active', CHECK ('active', 'graduated', 'paused') |
| goal | text | nullable |
| created_at | timestamptz | DEFAULT now() |

### client_token

Magic link tokens for intake, session check-ins, and milestone forms.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| client_id | uuid | FK -> client(id), NOT NULL |
| token | uuid | DEFAULT gen_random_uuid(), NOT NULL, UNIQUE |
| token_type | text | NOT NULL, CHECK ('intake', 'session_checkin', 'milestone') |
| expires_at | timestamptz | NOT NULL |
| used_at | timestamptz | nullable (set when consumed) |
| created_at | timestamptz | DEFAULT now() |

Indexes: `idx_client_token_token` (token), `idx_client_token_client_id` (client_id)

### session

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| client_id | uuid | FK -> client(id) |
| practitioner_id | uuid | FK -> practitioner(id) |
| session_number | integer | NOT NULL |
| session_date | date | NOT NULL |
| notes | text | nullable |
| next_steps | text | nullable |
| created_at | timestamptz | DEFAULT now() |

### response

Individual question-level responses from any questionnaire.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| client_id | uuid | FK -> client(id) |
| session_id | uuid | FK -> session(id), nullable (NULL for intake) |
| questionnaire_type | text | NOT NULL, CHECK ('intake', 'session', 'monthly') |
| instrument | text | NOT NULL, CHECK ('WHO5', 'PHQ4', 'ORS', 'SRS', 'SUDS', 'VOC', 'scaling') |
| question_key | text | NOT NULL |
| question_text | text | NOT NULL |
| value | numeric | NOT NULL |
| responded_at | timestamptz | DEFAULT now() |

### score

Composite scores calculated from responses.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| client_id | uuid | FK -> client(id) |
| session_id | uuid | FK -> session(id), nullable (NULL for intake) |
| questionnaire_type | text | NOT NULL |
| instrument | text | NOT NULL |
| composite_score | numeric | NOT NULL |
| scored_at | timestamptz | DEFAULT now() |

### flag

Practitioner-facing alerts generated from scoring rules.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| client_id | uuid | FK -> client(id) |
| session_id | uuid | FK -> session(id), nullable |
| flag_type | text | NOT NULL, CHECK ('threshold', 'cross_instrument', 'trend') |
| instrument | text | nullable |
| severity | text | NOT NULL, CHECK ('green', 'amber', 'red', 'info') |
| rule_key | text | NOT NULL |
| message | text | NOT NULL |
| suggested_language | text | nullable |
| acknowledged | boolean | DEFAULT false |
| acknowledged_at | timestamptz | nullable |
| acknowledged_by | text | nullable |
| created_at | timestamptz | DEFAULT now() |

## Enum Values Reference

| Domain | Values |
|--------|--------|
| modality | conscious, subconscious, both |
| tier | foundation, pro |
| client status | active, graduated, paused |
| token_type | intake, session_checkin, milestone |
| questionnaire_type | intake, session, monthly |
| instrument | WHO5, PHQ4, ORS, SRS, SUDS, VOC, scaling |
| flag_type | threshold, cross_instrument, trend |
| severity | green, amber, red, info |

## Key Files

- Schema definition: `supabase/schema.sql`
- Migrations: `supabase/migrations/`
- Seed data: `supabase/seed.sql`
- Scoring logic: `src/lib/scoring.ts`
- Question definitions: `src/lib/questions.ts`
