-- BorBan v2: wspólna baza rodziny (materiał, sprawdziany, oceny, postępy).
-- Istniejące tabele (profiles, cards, reviews) zostają nietknięte.

create table if not exists public.borban_families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.borban_members (
  family_id uuid not null references public.borban_families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('parent','child')),
  display_name text,
  email text,
  created_at timestamptz not null default now(),
  primary key (family_id, user_id)
);

create table if not exists public.borban_docs (
  family_id uuid not null references public.borban_families(id) on delete cascade,
  col text not null,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid(),
  primary key (family_id, col, id)
);

-- rola zalogowanego użytkownika w danej rodzinie (null = brak dostępu)
create or replace function public.borban_role(fam uuid)
returns text language sql stable security definer set search_path = public as $$
  select role from public.borban_members where family_id = fam and user_id = auth.uid()
$$;

alter table public.borban_families enable row level security;
alter table public.borban_members enable row level security;
alter table public.borban_docs enable row level security;

drop policy if exists "fam_select" on public.borban_families;
create policy "fam_select" on public.borban_families for select to authenticated
  using (public.borban_role(id) is not null);

drop policy if exists "mem_select" on public.borban_members;
create policy "mem_select" on public.borban_members for select to authenticated
  using (public.borban_role(family_id) is not null);

drop policy if exists "docs_select" on public.borban_docs;
create policy "docs_select" on public.borban_docs for select to authenticated
  using (public.borban_role(family_id) is not null);

-- rodzic zapisuje wszystko; uczeń tylko swoje postępy, sesje, cele tygodnia i zgłoszenia błędnych kart
drop policy if exists "docs_insert" on public.borban_docs;
create policy "docs_insert" on public.borban_docs for insert to authenticated
  with check (public.borban_role(family_id) = 'parent'
    or (public.borban_role(family_id) = 'child' and col in ('progress','sessions','woop','flags')));

drop policy if exists "docs_update" on public.borban_docs;
create policy "docs_update" on public.borban_docs for update to authenticated
  using (public.borban_role(family_id) = 'parent'
    or (public.borban_role(family_id) = 'child' and col in ('progress','sessions','woop','flags')))
  with check (public.borban_role(family_id) = 'parent'
    or (public.borban_role(family_id) = 'child' and col in ('progress','sessions','woop','flags')));

drop policy if exists "docs_delete" on public.borban_docs;
create policy "docs_delete" on public.borban_docs for delete to authenticated
  using (public.borban_role(family_id) = 'parent');

-- dodawanie osoby do rodziny po e-mailu (tylko rodzic tej rodziny)
create or replace function public.borban_add_member(fam uuid, member_email text, member_role text, member_name text default null)
returns text language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if public.borban_role(fam) is distinct from 'parent' then return 'forbidden'; end if;
  if member_role not in ('parent','child') then return 'bad_role'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(member_email)) limit 1;
  if uid is null then return 'no_user'; end if;
  insert into public.borban_members (family_id, user_id, role, display_name, email)
    values (fam, uid, member_role, member_name, lower(trim(member_email)))
    on conflict (family_id, user_id) do update set role = excluded.role,
      display_name = coalesce(excluded.display_name, public.borban_members.display_name), email = excluded.email;
  return 'ok';
end $$;

revoke all on function public.borban_add_member(uuid, text, text, text) from public, anon;
grant execute on function public.borban_add_member(uuid, text, text, text) to authenticated;
grant execute on function public.borban_role(uuid) to authenticated;
grant select, insert, update, delete on public.borban_docs to authenticated;
grant select on public.borban_members, public.borban_families to authenticated;

-- zmiany na żywo (telefon dziecka ↔ panel rodzica)
do $$ begin
  alter publication supabase_realtime add table public.borban_docs;
exception when duplicate_object then null; end $$;

-- Rodzina i pierwszy rodzic były dodane jednorazowo przy wdrożeniu (z e-mailem rodzica wpisanym ręcznie w SQL Editor).
-- Kolejne osoby dodaje rodzic w aplikacji (funkcja borban_add_member). Danych osobowych nie trzymamy w migracjach.
