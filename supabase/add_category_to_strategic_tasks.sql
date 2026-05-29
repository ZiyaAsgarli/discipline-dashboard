-- Adds an optional category field for Strategic Tasks Manager grouping.
alter table public.strategic_tasks
add column if not exists category text;
