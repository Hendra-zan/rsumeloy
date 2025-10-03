-- Tabel untuk menyimpan data web vitals
create table if not exists web_vitals (
  id uuid default uuid_generate_v4() primary key,
  name varchar not null,
  value double precision not null,
  metric_id varchar not null,
  label varchar not null,
  page_url text not null,
  user_agent text,
  timestamp timestamptz not null default now(),
  
  -- Index untuk mempercepat query analisis
  created_at timestamptz not null default now(),
  
  -- Menambahkan constraint
  constraint web_vitals_name_check check (
    name in ('CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB')
  )
);

-- Menambahkan index untuk query yang sering digunakan
create index if not exists web_vitals_name_timestamp_idx on web_vitals(name, timestamp);
create index if not exists web_vitals_page_url_idx on web_vitals(page_url);

-- RLS Policy
alter table web_vitals enable row level security;

-- Policy untuk insert dari client
create policy "Allow anonymous insert"
  on web_vitals
  for insert
  to anon
  with check (true);

-- Policy untuk select hanya untuk admin
create policy "Allow admin select"
  on web_vitals
  for select
  to authenticated
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.user_metadata->>'role' = 'admin'
    )
  );