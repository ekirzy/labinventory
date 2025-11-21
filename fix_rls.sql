-- Reset RLS for all tables to ensure public access
-- Items
alter table items enable row level security;
drop policy if exists "Public Access Items" on items;
create policy "Public Access Items" on items for all using (true) with check (true);

-- Loans
alter table loans enable row level security;
drop policy if exists "Public Access Loans" on loans;
create policy "Public Access Loans" on loans for all using (true) with check (true);

-- Logs
alter table logs enable row level security;
drop policy if exists "Public Access Logs" on logs;
create policy "Public Access Logs" on logs for all using (true) with check (true);

-- Labs
alter table labs enable row level security;
drop policy if exists "Public Access Labs" on labs;
create policy "Public Access Labs" on labs for all using (true) with check (true);

-- Notifications
alter table notifications enable row level security;
drop policy if exists "Public Access Notifications" on notifications;
create policy "Public Access Notifications" on notifications for all using (true) with check (true);
