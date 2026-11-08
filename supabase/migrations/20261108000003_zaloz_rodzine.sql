-- Samodzielne założenie rodziny przez nowego rodzica (Beta: bez udziału administratora).
-- Konto, które nie należy jeszcze do żadnej rodziny, może założyć jedną rodzinę i zostaje w niej rodzicem.
-- Konto, które już jest w jakiejś rodzinie, nie założy drugiej (ochrona przed pomyłką ucznia i przed spamem).
create or replace function public.borban_create_family(fam_name text, parent_name text default null)
returns text language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); mail text; fid uuid; nm text;
begin
  if uid is null then return 'no_auth'; end if;
  if exists (select 1 from public.borban_members where user_id = uid) then return 'already'; end if;
  select lower(email) into mail from auth.users where id = uid;
  nm := left(coalesce(nullif(trim(fam_name), ''), 'Moja rodzina'), 60);
  insert into public.borban_families (name) values (nm) returning id into fid;
  insert into public.borban_members (family_id, user_id, role, display_name, email)
    values (fid, uid, 'parent', left(nullif(trim(parent_name), ''), 40), mail);
  return 'ok';
end $$;

revoke all on function public.borban_create_family(text, text) from public, anon;
grant execute on function public.borban_create_family(text, text) to authenticated;
