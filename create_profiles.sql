-- Create Profiles Table
create table profiles (
  id text primary key,
  name text,
  role text,
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table profiles enable row level security;
create policy "Public Access Profiles" on profiles for all using (true) with check (true);

-- Insert Default User (Dr. Arini)
-- We use a fixed ID 'USER-001' so we can easily fetch it
INSERT INTO profiles (id, name, role, avatar) VALUES
('USER-001', 'Dr. Arini', 'Kepala Laboratorium', '');
