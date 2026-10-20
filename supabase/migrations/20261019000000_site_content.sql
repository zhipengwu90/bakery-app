-- Editable website content (menu, hours, site text) for the /manager dashboard.
-- One row per key; `data` holds the JSON shapes defined in src/lib/content/types.ts.
-- Until a row exists the site falls back to src/lib/content/defaults.ts.

create table if not exists public.site_content (
  key text primary key check (key in ('menu', 'hours', 'settings')),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users (id) on delete set null
);

alter table public.site_content enable row level security;

create policy "site_content: anyone can read"
  on public.site_content for select
  using (true);

create policy "site_content: staff can insert"
  on public.site_content for insert to authenticated
  with check (true);

create policy "site_content: staff can update"
  on public.site_content for update to authenticated
  using (true) with check (true);

-- Lock down the website photo buckets: today anyone with the public anon key
-- can upload to or delete from them. Reads stay public; writes need a login.
drop policy if exists "all 6ieyf0_1" on storage.objects;
drop policy if exists "all 6ieyf0_2" on storage.objects;
drop policy if exists "all 6ieyf0_3" on storage.objects;
drop policy if exists "all_user 1gfj1bo_1" on storage.objects;
drop policy if exists "all_user 1gfj1bo_2" on storage.objects;
drop policy if exists "all_user 1gfj1bo_3" on storage.objects;

create policy "website photos: staff can upload"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('brazen_page', 'foodPhoto'));

create policy "website photos: staff can update"
  on storage.objects for update to authenticated
  using (bucket_id in ('brazen_page', 'foodPhoto'));

create policy "website photos: staff can delete"
  on storage.objects for delete to authenticated
  using (bucket_id in ('brazen_page', 'foodPhoto'));
