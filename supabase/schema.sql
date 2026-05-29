-- Initial Supabase PostgreSQL schema for Discipline Dashboard.
-- This file only defines tables, constraints, defaults, and relationships.
-- Row Level Security, triggers, API routes, and Supabase connection setup are intentionally not included yet.

-- Stores one profile per user. The id should later match the Supabase Auth user id.
create table public.profiles (
  id uuid primary key,
  email text,
  display_name text,
  total_xp integer not null default 0 check (total_xp >= 0),
  current_level integer not null default 1 check (current_level >= 1),
  discipline_start_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'User profile and cached dashboard progress totals. The id is intended to match Supabase Auth users.id.';

-- Stores one discipline check-in per user per calendar date.
-- This table powers the 180-Day Discipline Grid.
create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checkin_date date not null,
  campaign_day integer not null check (campaign_day between 1 and 180),
  completed boolean not null default false,
  notes text,
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_checkins_user_date_unique unique (user_id, checkin_date)
);

comment on table public.daily_checkins is
  'Daily completion records for each user, used to render the 180-day discipline grid.';

-- Stores an append-only history of XP changes.
-- XP events can come from daily check-ins, strategic tasks, or manual adjustments.
create table public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_type text not null check (
    source_type in ('daily_checkin', 'strategic_task', 'manual_adjustment')
  ),
  source_id uuid,
  xp_amount integer not null,
  description text,
  created_at timestamptz not null default now()
);

comment on table public.xp_events is
  'Auditable XP event history used to calculate or verify total XP and level progress.';

-- Stores career, skill, and project tasks for the Strategic Tasks Manager.
create table public.strategic_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text,
  priority text not null check (priority in ('High', 'Medium', 'Low')),
  status text not null default 'active' check (
    status in ('active', 'completed', 'paused', 'archived')
  ),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.strategic_tasks is
  'Strategic career and project tasks displayed in the dashboard mission board.';
