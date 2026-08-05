-- Newsac cloud snapshot — run once in Supabase SQL Editor
-- Stores the full admin CMS JSON so devices can pull/push the same content.

create table if not exists public.app_snapshots (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_snapshots enable row level security;

-- Public read (site visitors see shared content after pull)
drop policy if exists "app_snapshots_read" on public.app_snapshots;
create policy "app_snapshots_read"
  on public.app_snapshots
  for select
  to anon, authenticated
  using (true);

-- Authenticated write (Admin UI only calls this — tighten later with email claim)
drop policy if exists "app_snapshots_write" on public.app_snapshots;
create policy "app_snapshots_write"
  on public.app_snapshots
  for insert
  to authenticated
  with check (true);

drop policy if exists "app_snapshots_update" on public.app_snapshots;
create policy "app_snapshots_update"
  on public.app_snapshots
  for update
  to authenticated
  using (true)
  with check (true);

insert into public.app_snapshots (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;
