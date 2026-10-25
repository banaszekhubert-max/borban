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

-- ===== Szkoła i klasa (wspólne dla klasy, od 25.10.2026 – zob. docs/OSZCZEDNOSC-DANYCH.md) =====
-- Zasada: dana trafia na najwyższy poziom, na którym jest taka sama dla wszystkich: podręcznik → klasa → uczeń.
create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null, city text, partner_id uuid references partners(id)
);

create table class_groups (               -- oddział w danym roku szkolnym, np. „1 TP, 2026/27”
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id),
  school_year text not null,              -- '2026/27'
  label text not null,                    -- '1 TP'
  join_code text unique,                  -- kod klasy od pierwszego rodzica albo szkoły
  created_at timestamptz not null default now()
);

create table class_members (              -- członkostwo potwierdza rodzic
  class_id uuid not null references class_groups(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  confirmed_by uuid references auth.users(id), share_notes boolean not null default false,   -- zgoda na wspólny zeszyt
  primary key (class_id, child_id)
);

create table class_textbooks (            -- podręczniki klasy; uczeń dziedziczy (child_textbooks tylko wyjątki)
  class_id uuid not null references class_groups(id) on delete cascade,
  textbook_id text not null references textbooks(id),
  current_unit_id text references library_units(id),   -- „tu jesteśmy” dla całej klasy
  primary key (class_id, textbook_id)
);

create table class_tests (                -- terminarz klasy: jeden wpis dla wszystkich uczniów
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references class_groups(id) on delete cascade,
  subject_key text not null, date date not null, title text, unit_ids text[],
  source text,                            -- 'librus_zrzut', 'reczny', 'szkola'
  added_by uuid references auth.users(id), confirmations int not null default 1
);

create table class_notes (                -- zeszyt klasy: jedna notatka na lekcję, scalana z wielu zdjęć
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references class_groups(id) on delete cascade,
  subject_key text not null, lesson_date date not null, unit_id text references library_units(id),
  text text not null,                      -- tylko tekst potwierdzony przez rodzica, bez imion i pisma
  version int not null default 1, contributors int not null default 1,
  unique (class_id, subject_key, lesson_date)
);

create table class_cards (                -- karty z lekcji klasy; gdy powtarzają się w wielu klasach → library_cards
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references class_groups(id) on delete cascade,
  note_id uuid references class_notes(id) on delete set null,
  unit_id text references library_units(id),
  type text not null check (type in ('qa','cloze','vocab')),
  front text not null, back text, svg text, lit text, why text, ex text,
  promoted_to text references library_cards(id),
  created_at timestamptz not null default now()
);

-- Zdjęcia zostają przy rodzinie (lesson_photos w Storage, 30 dni); do klasy idzie tylko tekst.
-- card_progress.card_key: 'lib:<id>' | 'cls:<uuid>' | 'fam:<uuid>'.

-- ===== Pamięć werdyktów AI (wspólna, bez danych osobowych) =====
create table answer_verdicts (            -- ta sama odpowiedź na tę samą kartę = jedno zapytanie do AI dla wszystkich
  card_key text not null,
  typed_norm text not null,               -- znormalizowany wpis (małe litery, bez polskich znaków, max 200 znaków)
  card_version int not null,
  verdict text not null check (verdict in ('yes','partial','no')),
  why text, how text, model text,
  hits int not null default 1, created_at timestamptz not null default now(),
  primary key (card_key, card_version, typed_norm)
);

create table ai_quota (                   -- dzienny limit zapytań do AI na ucznia
  child_id uuid not null references children(id) on delete cascade,
  day date not null, calls int not null default 0,
  primary key (child_id, day)
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
    check (status in ('uploaded','quality_failed','ocr_draft','parent_confirmed','topic_confirmed','ai_draft','validated','in_review','published','rejected')),
  unit_id text references library_units(id),          -- dział potwierdzony przez rodzica
  ocr_text text, ocr_unreadable jsonb,                 -- odczyt i oznaczone nieczytelne fragmenty
  photos text[],                            -- ścieżki w Supabase Storage (kasowane po przetworzeniu)
  tutor_id uuid references staff(user_id),
  tutor_minutes numeric,                    -- KPI: minuty opiekuna na zadanie
  created_at timestamptz not null default now(), done_at timestamptz
);

create table confirmations (             -- dziennik potwierdzeń rodzica (ochrona firmy i przejrzystość)
  id bigint generated always as identity primary key,
  job_id uuid references content_jobs(id) on delete cascade,
  family_id uuid not null references families(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  step text not null check (step in ('ocr_text','topic','librus_import','consent')),
  decision text not null check (decision in ('confirmed','corrected','rejected')),
  content_hash text not null,               -- skrót potwierdzonej wersji
  seconds_spent int,                        -- KPI: czy potwierdzenie jest realne, czy „klikane”
  confirmed_at timestamptz not null default now()
);

create table lesson_notes (               -- uporządkowane notatki z lekcji (z zeszytu dziecka)
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  unit_id text references library_units(id),
  job_id uuid references content_jobs(id),
  lesson_date date, title text, body_md text, svg text,
  flagged_issues jsonb,                     -- możliwe błędy w zeszycie wskazane przez AI
  created_at timestamptz not null default now()
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
