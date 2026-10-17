-- BorBan 0002: notatki z lekcji (zdjęcia zeszytu) + dziennik potwierdzeń rodzica.
-- Uruchom raz w Supabase → SQL Editor. Skrypt można bezpiecznie uruchomić ponownie.

-- 1) Dziecko może zapisywać notatki (kolekcja "notes"). Potwierdzenia ("confirmations"),
--    karty i działy nadal zapisuje tylko rodzic.
drop policy if exists "docs_insert" on public.borban_docs;
create policy "docs_insert" on public.borban_docs for insert to authenticated
  with check (public.borban_role(family_id) = 'parent'
    or (public.borban_role(family_id) = 'child' and col in ('progress','sessions','woop','flags','notes')));

drop policy if exists "docs_update" on public.borban_docs;
create policy "docs_update" on public.borban_docs for update to authenticated
  using (public.borban_role(family_id) = 'parent'
    or (public.borban_role(family_id) = 'child' and col in ('progress','sessions','woop','flags','notes')))
  with check (public.borban_role(family_id) = 'parent'
    or (public.borban_role(family_id) = 'child' and col in ('progress','sessions','woop','flags','notes')));

-- 2) Prywatny schowek na zdjęcia: notes/<family_id>/<id_notatki>/<n>.jpg, do 5 MB, tylko obrazy.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('notes', 'notes', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- pomocnicza: rola użytkownika w rodzinie z pierwszego członu ścieżki pliku (null przy złej ścieżce)
create or replace function public.borban_role_path(path text)
returns text language plpgsql stable security definer set search_path = public as $$
declare fam uuid;
begin
  begin fam := split_part(path, '/', 1)::uuid; exception when others then return null; end;
  return public.borban_role(fam);
end $$;
grant execute on function public.borban_role_path(text) to authenticated;

drop policy if exists "notes_read" on storage.objects;
create policy "notes_read" on storage.objects for select to authenticated
  using (bucket_id = 'notes' and public.borban_role_path(name) is not null);

drop policy if exists "notes_insert" on storage.objects;
create policy "notes_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'notes' and public.borban_role_path(name) is not null);

drop policy if exists "notes_delete" on storage.objects;
create policy "notes_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'notes' and public.borban_role_path(name) = 'parent');

-- sprawdzenie
select id, public, file_size_limit from storage.buckets where id = 'notes';
