-- Meridian Schema
-- Run this in Supabase SQL Editor to create all tables

-- Practitioners
create table if not exists practitioner (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  modality text check (modality in ('conscious', 'subconscious', 'both')) not null,
  tier text check (tier in ('foundation', 'pro')) default 'foundation',
  created_at timestamptz default now()
);

-- Clients
create table if not exists client (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid references practitioner(id),
  name text not null,
  email text not null,
  phone text,
  modality text check (modality in ('conscious', 'subconscious', 'both')) not null,
  status text check (status in ('active', 'graduated', 'paused')) default 'active',
  goal text,
  created_at timestamptz default now()
);

-- Magic link tokens for intake, check-in, milestones
create table if not exists client_token (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references client(id) not null,
  token uuid default gen_random_uuid() not null unique,
  token_type text not null check (token_type in ('intake', 'session_checkin', 'milestone')),
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_client_token_token on client_token(token);
create index if not exists idx_client_token_client_id on client_token(client_id);

-- Sessions
create table if not exists session (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references client(id),
  practitioner_id uuid references practitioner(id),
  session_number integer not null,
  session_date date not null,
  notes text,
  next_steps text,
  created_at timestamptz default now()
);

-- Responses (individual question answers)
create table if not exists response (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references client(id),
  session_id uuid references session(id),
  questionnaire_type text check (questionnaire_type in ('intake', 'session', 'monthly')) not null,
  instrument text check (instrument in ('WHO5', 'PHQ4', 'ORS', 'SRS', 'SUDS', 'VOC', 'scaling')) not null,
  question_key text not null,
  question_text text not null,
  value numeric not null,
  responded_at timestamptz default now()
);

-- Composite scores
create table if not exists score (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references client(id),
  session_id uuid references session(id),
  questionnaire_type text not null,
  instrument text not null,
  composite_score numeric not null,
  scored_at timestamptz default now()
);

-- Flags
create table if not exists flag (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references client(id),
  session_id uuid references session(id),
  flag_type text check (flag_type in ('threshold', 'cross_instrument', 'trend')) not null,
  instrument text,
  severity text check (severity in ('green', 'amber', 'red', 'info')) not null,
  rule_key text not null,
  message text not null,
  suggested_language text,
  acknowledged boolean default false,
  acknowledged_at timestamptz,
  acknowledged_by text,
  created_at timestamptz default now()
);
