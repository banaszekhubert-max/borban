-- Administratorzy konsoli kont. Wpisy dodaje się ręcznie w SQL Editor (danych osobowych nie trzymamy w migracjach):
--   insert into public.borban_admins(email) values ('adres@przyklad.pl');
-- Czyta ją tylko funkcja Edge "konta" kluczem service_role.
create table if not exists public.borban_admins (
  email text primary key check (email = lower(email)),
  added_at timestamptz not null default now()
);
alter table public.borban_admins enable row level security;
revoke all on public.borban_admins from anon, authenticated;
