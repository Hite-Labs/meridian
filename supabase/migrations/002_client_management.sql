-- 002_client_management.sql
-- Story 1: Client Management — add first/last name, notes, soft delete, dashboard token type

-- 1. Add new columns to client table
ALTER TABLE client ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE client ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE client ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE client ADD COLUMN IF NOT EXISTS archived_at timestamptz;

-- 2. Backfill first_name / last_name from existing name column
UPDATE client
SET
  first_name = split_part(name, ' ', 1),
  last_name  = CASE
    WHEN position(' ' in name) > 0
      THEN substring(name from position(' ' in name) + 1)
    ELSE ''
  END
WHERE first_name IS NULL;

-- 3. Make first_name and last_name NOT NULL after backfill
ALTER TABLE client ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE client ALTER COLUMN last_name SET NOT NULL;

-- 4. Add dashboard token type to client_token constraint
ALTER TABLE client_token DROP CONSTRAINT IF EXISTS client_token_token_type_check;
ALTER TABLE client_token ADD CONSTRAINT client_token_token_type_check
  CHECK (token_type IN ('intake', 'session_checkin', 'milestone', 'dashboard'));

-- 5. Index for efficient archived filtering
CREATE INDEX IF NOT EXISTS idx_client_archived_at ON client(archived_at);
