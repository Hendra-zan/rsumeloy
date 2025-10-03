-- Create error_logs table
create table if not exists error_logs (
  id uuid default uuid_generate_v4() primary key,
  timestamp timestamptz not null default now(),
  level text not null check (level in ('info', 'warn', 'error', 'debug')),
  message text not null,
  context jsonb,
  error_details jsonb,
  url text,
  user_id uuid references auth.users(id),
  component text,
  
  -- Metadata fields
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- Create index for querying
create index if not exists error_logs_timestamp_idx on error_logs(timestamp);
create index if not exists error_logs_level_idx on error_logs(level);
create index if not exists error_logs_user_id_idx on error_logs(user_id);

-- Add RLS policies
alter table error_logs enable row level security;

-- Allow insert from authenticated and anonymous users
create policy "Allow insert from any user"
  on error_logs
  for insert
  to public
  with check (true);

-- Allow select only for admin users
create policy "Allow select for admin users"
  on error_logs
  for select
  to authenticated
  using (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Create updated_at trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_error_logs_updated_at
  before update on error_logs
  for each row
  execute function set_updated_at();