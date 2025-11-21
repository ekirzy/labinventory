-- 1. Create table if not exists
create table if not exists profiles (
  id text primary key,
  name text,
  role text,
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable RLS
alter table profiles enable row level security;

-- 3. Reset Policy (Drop first to avoid error if exists)
drop policy if exists "Public Access Profiles" on profiles;
create policy "Public Access Profiles" on profiles for all using (true) with check (true);

-- 4. Upsert Default User (Insert or Update if exists)
INSERT INTO profiles (id, name, role, avatar)
VALUES ('USER-001', 'Dr. Arini', 'Kepala Laboratorium', '')
ON CONFLICT (id) DO NOTHING;
