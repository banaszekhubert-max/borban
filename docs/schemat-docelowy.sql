-- BorBan: PROJEKT schematu docelowego (faza 1–3). NIE URUCHAMIAĆ jako migracji w tej postaci.
-- Po akceptacji trafia do supabase/migrations/ w częściach, razem ze skryptem przeniesienia danych z borban_docs.
-- Zasady: biblioteka wspólna (raz zrobiona karta obsługuje każde dziecko z tym podręcznikiem),
-- dane osobowe dziecka oddzielone, każda tabela z danymi rodziny chroniona RLS po family_id.

-- ===== Organizacja i ludzie =====
create table partners (                 -- szkoła, pracodawca, specjalista: źródło pozyskania
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('school','employer','specialist','other')),
  name text not null,
  referral_code text unique,
  created_at timestamptz not null default now()
);

create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  partner_id uuid references partners(id),       -- skąd przyszła rodzina (koszt kanału)
  plan text check (plan in ('start','rozszerzony','pelny','pilot')),
  contract_start date, contract_end date,
  created_at timestamptz not null default now()
);

create table family_members (            -- konta logowania (auth.users) w rodzinie
  family_id uuid not null references families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('parent','child')),
  child_id uuid,                            -- dla roli child: które dziecko to konto
  display_name text,
  primary key (family_id, user_id)
);

create table children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  first_name text not null,
  school_class text,                        -- np. '1 technikum'
  created_at timestamptz not null default now()
);

create table staff (                      -- opiekunowie i administratorzy firmy
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('tutor','admin')),
  display_name text
);

create table tutor_assignments (
  tutor_id uuid not null references staff(user_id),
  family_id uuid not null references families(id) on delete cascade,
  since date not null default current_date,
  primary key (tutor_id, family_id)
);

-- ===== Biblioteka (wspólna, bez danych osobowych) =====
create table textbooks (
  id text primary key,                      -- np. 'mat-pazdro-1-roz'
  subject_key text not null,                -- np. 'mat'
  title text not null, publisher text, level text
);

create table library_units (
  id text primary key,
  textbook_id text not null references textbooks(id),
  title text not null,
  ord int not null default 0,
  svg text,
  status text not null default 'draft' check (status in ('draft','review','published','retired')),
  version int not null default 1,
  updated_at timestamptz not null default now()
);

create table library_cards (
  id text primary key,
  unit_id text not null references library_units(id),
  type text not null check (type in ('qa','cloze','vocab')),
  front text not null, back text,
  svg text, svg_size text,
  who text, lit text, why text, ex text, tpl text, mnemo text,
  status text not null default 'draft' check (status in ('draft','review','published','retired')),
  version int not null default 1,
  reviewed_by uuid references staff(user_id), reviewed_at timestamptz,
  updated_at timestamptz not null default now()
);

-- ===== Dziecko: co realizuje i czego się uczy =====
create table child_textbooks (            -- subskrypcje: z jakich podręczników korzysta dziecko
  child_id uuid not null references children(id) on delete cascade,
  textbook_id text not null references textbooks(id),
  current_unit_id text references library_units(id),   -- „tu jesteś”
  primary key (child_id, textbook_id)
);

create table family_cards (               -- nakładka: karty z zeszytu konkretnego dziecka
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid references children(id) on delete cascade,
  unit_id text references library_units(id),
  type text not null check (type in ('qa','cloze','vocab')),
  front text not null, back text, svg text, lit text, why text, ex text,
  created_at timestamptz not null default now()
);

create table card_progress (              -- stan powtórek: jedna linia na dziecko i kartę
  child_id uuid not null references children(id) on delete cascade,
  card_key text not null,                   -- 'lib:<id>' albo 'fam:<uuid>'
  run int not null default 0, ease real not null default 2.5, interval_days int not null default 0,
  due date, lapses int not null default 0, introduced date, last_answer_at timestamptz,
  primary key (child_id, card_key)
);

create table answers (                    -- dziennik odpowiedzi (analizy, „Rewanż”, raporty)
  id bigint generated always as identity primary key,
  child_id uuid not null references children(id) on delete cascade,
  card_key text not null, session_id uuid,
  typed text, grade smallint not null check (grade between 0 and 2),
  answered_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key,
  child_id uuid not null references children(id) on delete cascade,
  kind text, started_at timestamptz, ended_at timestamptz, active_ms int, n int, ok int, wrong int, points int
);

create table tests (                      -- sprawdziany z terminarza
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  subject_key text not null, date date not null, title text, unit_ids text[]
);

create table grades (                     -- oceny (np. z Librusa) — dane osobowe
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  subject_key text not null, value text not null, weight numeric, category text, date date
);

-- ===== Linia produkcyjna materiału =====
create table content_jobs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid references children(id),
  status text not null default 'uploaded'
    check (status in ('uploaded','ai_draft','validated','in_review','published','rejected')),
  photos text[],                            -- ścieżki w Supabase Storage (kasowane po przetworzeniu)
  tutor_id uuid references staff(user_id),
  tutor_minutes numeric,                    -- KPI: minuty opiekuna na zadanie
  created_at timestamptz not null default now(), done_at timestamptz
);

-- ===== Bezpieczeństwo (szkic) =====
-- RLS włączone na wszystkich tabelach z family_id / child_id:
--   rodzic: odczyt i zapis w swojej rodzinie; dziecko: odczyt swojego materiału, zapis card_progress/answers/sessions;
--   opiekun: dostęp do rodzin z tutor_assignments; admin: całość.
-- Biblioteka: odczyt published dla zalogowanych, zapis tylko staff.
-- Indeksy: card_progress(child_id, due), answers(child_id, answered_at), library_cards(unit_id) itd.

-- ===== Analityka (szkic widoków) =====
-- v_grades_vs_learning: dla każdego dziecka i przedmiotu średnia ocen przed i po starcie oraz minuty nauki w 7 dniach przed oceną.
-- v_tutor_load: dzieci na opiekuna, minuty na dziecko tygodniowo (KPI z biznesplanu: 50 → 90 dzieci na etat).
-- v_retention: aktywne dni w tygodniu, serie, odsetek rodzin z cotygodniowymi zdjęciami.
