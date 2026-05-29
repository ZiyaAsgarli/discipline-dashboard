-- Row Level Security policies for Discipline Dashboard.
-- This script is reusable: each policy is dropped before being created.
-- Authentication is not connected in the app yet; these policies are for the Supabase database.

-- Enable Row Level Security on all app tables.
alter table public.profiles enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.xp_events enable row level security;
alter table public.strategic_tasks enable row level security;

-- profiles policies
-- Users can read, create, and update only their own profile row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- daily_checkins policies
-- Users can fully manage only their own daily check-in rows.
drop policy if exists "daily_checkins_select_own" on public.daily_checkins;
create policy "daily_checkins_select_own"
on public.daily_checkins
for select
using (auth.uid() = user_id);

drop policy if exists "daily_checkins_insert_own" on public.daily_checkins;
create policy "daily_checkins_insert_own"
on public.daily_checkins
for insert
with check (auth.uid() = user_id);

drop policy if exists "daily_checkins_update_own" on public.daily_checkins;
create policy "daily_checkins_update_own"
on public.daily_checkins
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "daily_checkins_delete_own" on public.daily_checkins;
create policy "daily_checkins_delete_own"
on public.daily_checkins
for delete
using (auth.uid() = user_id);

-- xp_events policies
-- Users can read and append only their own XP events.
-- Update and delete policies are intentionally omitted so XP history remains append-only.
drop policy if exists "xp_events_select_own" on public.xp_events;
create policy "xp_events_select_own"
on public.xp_events
for select
using (auth.uid() = user_id);

drop policy if exists "xp_events_insert_own" on public.xp_events;
create policy "xp_events_insert_own"
on public.xp_events
for insert
with check (auth.uid() = user_id);

-- strategic_tasks policies
-- Users can fully manage only their own strategic task rows.
drop policy if exists "strategic_tasks_select_own" on public.strategic_tasks;
create policy "strategic_tasks_select_own"
on public.strategic_tasks
for select
using (auth.uid() = user_id);

drop policy if exists "strategic_tasks_insert_own" on public.strategic_tasks;
create policy "strategic_tasks_insert_own"
on public.strategic_tasks
for insert
with check (auth.uid() = user_id);

drop policy if exists "strategic_tasks_update_own" on public.strategic_tasks;
create policy "strategic_tasks_update_own"
on public.strategic_tasks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "strategic_tasks_delete_own" on public.strategic_tasks;
create policy "strategic_tasks_delete_own"
on public.strategic_tasks
for delete
using (auth.uid() = user_id);
