-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Items Table
create table items (
  id text primary key,
  "labId" text,
  name text not null,
  category text,
  quantity integer default 0,
  unit text,
  location text,
  status text,
  description text,
  supplier text,
  "acquisitionDate" text,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Loans Table
create table loans (
  id text primary key,
  "itemId" text references items(id),
  "itemName" text,
  borrower text,
  "borrowerId" text,
  "idCardImage" text,
  "borrowDate" text,
  "dueDate" text,
  "returnDate" text,
  status text,
  "quantityBorrowed" integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Logs Table
create table logs (
  id text primary key,
  action text,
  "user" text,
  timestamp text,
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Labs Table
create table labs (
  id text primary key,
  name text,
  location text,
  description text,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Notifications Table
create table notifications (
  id text primary key,
  title text,
  message text,
  date text,
  read boolean default false,
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) - Optional: Allow public access for simplicity for now
alter table items enable row level security;
alter table loans enable row level security;
alter table logs enable row level security;
alter table labs enable row level security;
alter table notifications enable row level security;

-- Create policies to allow public read/write (WARNING: For demo only, not secure for production)
create policy "Public Access Items" on items for all using (true) with check (true);
create policy "Public Access Loans" on loans for all using (true) with check (true);
create policy "Public Access Logs" on logs for all using (true) with check (true);
create policy "Public Access Labs" on labs for all using (true) with check (true);
create policy "Public Access Notifications" on notifications for all using (true) with check (true);
