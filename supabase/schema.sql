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

-- Public media bucket for news/story image uploads
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media_auth_upload" on storage.objects;
create policy "media_auth_upload"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media_auth_update" on storage.objects;
create policy "media_auth_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "media_auth_delete" on storage.objects;
create policy "media_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media');

