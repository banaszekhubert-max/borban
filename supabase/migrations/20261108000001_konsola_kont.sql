-- Konsola kont: ostatnia aktywność każdego konta (ostatni zapis w borban_docs).
-- Wywołuje ją tylko funkcja Edge "konta" kluczem service_role; zwykli użytkownicy nie mają do niej dostępu.
create or replace function public.borban_last_activity()
returns table (user_id uuid, last_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select updated_by, max(updated_at)
  from public.borban_docs
  where updated_by is not null
  group by updated_by
$$;

revoke all on function public.borban_last_activity() from public, anon, authenticated;
grant execute on function public.borban_last_activity() to service_role;
