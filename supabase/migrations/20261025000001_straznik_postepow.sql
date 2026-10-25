-- Strażnik postępów (25.10.2026, po teście 50 uczniów):
-- uczeń mógł z konsoli przeglądarki zapisać dowolny postęp (np. 25 kart „opanowanych” z powtórką w 2099).
-- Do czasu, aż serwer będzie sam liczył postęp z zapisanych odpowiedzi (Faza 1), baza odrzuca od ucznia
-- zapisy postępu, które nie mogą wynikać z normalnej nauki. Rodzic (konto parent) może zapisać wszystko.

create or replace function public.borban_guard_progress()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_run int;
  old_run int := 0;
  due_d date;
begin
  if new.col <> 'progress' then return new; end if;
  if public.borban_role(new.family_id) is distinct from 'child' then return new; end if;

  new_run := coalesce((new.data->>'run')::int, 0);
  if tg_op = 'UPDATE' then
    old_run := coalesce((old.data->>'run')::int, 0);
  end if;

  -- najwyżej 2 poziomy dziennie w aplikacji; zapas na odpowiedzi zebrane bez internetu
  if new_run > old_run + 3 then
    raise exception 'borban: postęp skoczył o % poziomów naraz', new_run - old_run using errcode = 'P0001';
  end if;

  -- najdłuższy odstęp powtórki w aplikacji to 90 dni
  if new.data ? 'due' then
    begin
      due_d := (new.data->>'due')::date;
    exception when others then
      raise exception 'borban: zły termin powtórki' using errcode = 'P0001';
    end;
    if due_d > current_date + 95 then
      raise exception 'borban: termin powtórki za daleko' using errcode = 'P0001';
    end if;
  end if;

  -- historia odpowiedzi ma najwyżej 12 wpisów
  if jsonb_typeof(new.data->'hist') = 'array' and jsonb_array_length(new.data->'hist') > 12 then
    raise exception 'borban: za długa historia' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists borban_guard_progress on public.borban_docs;
create trigger borban_guard_progress
  before insert or update on public.borban_docs
  for each row execute function public.borban_guard_progress();
