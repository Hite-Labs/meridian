-- Add phone number to client table
ALTER TABLE client ADD COLUMN IF NOT EXISTS phone text;

-- Magic link tokens for intake, session check-in, milestones
CREATE TABLE IF NOT EXISTS client_token (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES client(id) NOT NULL,
  token uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  token_type text NOT NULL CHECK (token_type IN ('intake', 'session_checkin', 'milestone')),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_token_token ON client_token(token);
CREATE INDEX IF NOT EXISTS idx_client_token_client_id ON client_token(client_id);
