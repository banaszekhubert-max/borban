# BorBan dla programisty: start w jeden dzień

Ten dokument jest dla osoby, która przejmuje kod. Czytaj w tej kolejności:
1. ten plik (jak działa dziś),
2. `docs/PLAN-FAZA-1.md` (co budujemy i w jakiej kolejności),
3. `docs/ARCHITEKTURA.md` (zasady i kierunek),
4. `docs/OSZCZEDNOSC-DANYCH.md` (zasada obowiązująca przy każdej funkcji),
5. `docs/DECYZJE.md` (dlaczego jest tak, a nie inaczej; nowe decyzje na górze),
6. `CHANGELOG.md` (chronologia zmian).

Stan opisany na 25.10.2026, wersja produkcyjna na https://borban.vercel.app.

---

## 1. Czym jest produkt

BorBan to aplikacja do codziennej nauki na materiale z prawdziwej szkoły dziecka:
- fiszki z powtórkami rozłożonymi w czasie,
- obrazki i wyjaśnienia krok po kroku,
- plan pod nadchodzące sprawdziany,
- panel rodzica z postępami i ocenami.

Pilot to jeden uczeń: Borys, 1 klasa technikum programistycznego. Docelowo usługa dla rodziców, tysiące dzieci (biznesplan w opisie projektu).

Dwie role:
- **uczeń**: uczy się, zapisuje postępy, sesje, zgłoszenia i zdjęcia notatek;
- **rodzic**: wczytuje materiał, widzi postępy i oceny, potwierdza notatki, ustawia limity.

---

## 2. Architektura dziś (faza 0)

```
 Szkoła (Librus, zeszyty, podręczniki)
        │ zrzuty, zdjęcia, zakres
        ▼
 Hubert + Claude w czacie ──► paczka JSON (borban-pack-1) ──► panel rodzica „Paczka od Claude”
        │ kod                                                         │
        ▼                                                             ▼
 GitHub (main) ──► Vercel ──► index.html na telefonie ucznia i rodzica ◄──► Supabase
                                                                       ├─ Auth (logowanie)
                                                                       ├─ Postgres: borban_families, borban_members, borban_docs (RLS)
                                                                       ├─ trigger borban_guard_progress (strażnik postępów)
                                                                       ├─ Realtime (zmiany na żywo)
                                                                       ├─ Storage: bucket „notes” (zdjęcia zeszytu, 30 dni)
                                                                       └─ Edge Function read-notebook ──► Claude API
```

Mapa wizualna z numerowanymi przepływami jest na stronie „Mechanika BorBana” (link w `CHANGELOG.md`).

| Element | Gdzie | Uwagi |
|---|---|---|
| Aplikacja | `index.html` (ok. 2400 linii: HTML + CSS + JS w jednym pliku, bez kroku budowania) | PWA, `manifest.webmanifest`, ikony; `config.js` zawiera tylko URL i klucz publishable Supabase |
| Hosting | Vercel, projekt `borban`, wdrożenie po każdym commicie do `main`; gałęzie mają podgląd `borban-git-<gałąź>-bor-ban.vercel.app` | `vercel.json` wyłącza cache strony; `.vercelignore` nie wysyła nic poza aplikacją |
| Baza | Supabase, projekt `nuggtfvowonuohedoxgw` | migracje w `supabase/migrations/`, uruchamiane ręcznie w SQL Editor |
| Funkcja serwerowa | `supabase/functions/read-notebook/index.ts` (Deno) | sekrety: `ANTHROPIC_API_KEY`, opcjonalnie `ANTHROPIC_MODEL`, `ANTHROPIC_MODEL_FAST` |
| Materiał | `content/library/*.json` (plik na przedmiot, format paczki) | bez danych osobowych; walidowany w CI |
| Narzędzia | `tools/validate_pack.py`, `build_pack.py`, `build_gallery.py` | Python 3.12, bez zależności |
| Testy | `tests/` (sprawdzanie odpowiedzi, ekran, symulacja 50 uczniów) | opis w `tests/README.md` |

### Uruchomienie lokalne

```bash
git clone https://github.com/banaszekhubert-max/borban && cd borban
python3 -m http.server 8080          # aplikacja: http://localhost:8080 (łączy się z prawdziwym Supabase z config.js!)
cd tests && npm install && npx playwright install chromium
npm test                              # testy odpowiedzi + ekranu na udawanej bazie (bez sieci, bez danych dziecka)
```

Uwaga: lokalnie i na podglądzie Vercel aplikacja łączy się z **produkcyjną bazą**. Do czasu etapu E0 z planu nie loguj się kontem ucznia na wersji testowej. Konto rodzica jest bezpieczne: jego odpowiedzi nie zapisują się w postępach ucznia.

---

## 3. Mapa kodu `index.html`

Sekcje są oznaczone komentarzami `/* ---------- nazwa ---------- */`. Numery linii są przybliżone.

| Linie | Sekcja | Najważniejsze funkcje |
|---|---|---|
| 1–330 | CSS (motyw „Szkoła średnia”, tokeny `--r`, `--primary`…), HTML szkieletu (nagłówek, `#view`, `#sheet`, `#tabs`) | |
| 340 | helpers | `$`, `esc`, `dkey`, `TODAY`, `addDays`, `daysBetween`, `toast`, `STUDENT()` (imię ucznia) |
| 377 | stałe metody | `MASTERY_RUN = 3`, `SESSION_MAX = 30`, `QUICK_N = 5`, `UNIT_DONE` |
| 392 | stan | `S` (kolekcje), `fam`, `role`, `caps`, `tab`, `SES` (bieżąca sesja) |
| 402 | **algorytm powtórek** | `grade(prev, g, today, hold)`, `runOf`, `isMastered` |
| 436 | wyliczenia | `streak`, `pointsInWeek`, `readiness` (gotowość = średni poziom kart z zakresu), `testCards` |
| 476 | tempo do sprawdzianów | `newLimit`, `newToday`, `paceNewNeed`, `todayPlan`, `pairReady`, `pairKey`, `onePerPair` |
| 596 | zadania na dziś | `todayTasks` (kafelki liczone z zapisanych sesji) |
| 627 | motywacja | `morningIds` (poranna powtórka; w dniu sprawdzianu cały zakres), `isMorning`, `rematchIds`, odznaki |
| 703 | render | `render` i widoki zakładek: Dziś, Mapa, Postępy, Plan, Zeszyt |
| 917 | panel rodzica | oceny z Librusa, „Oceny a nauka”, sprawdziany, sesje |
| 1041 | notatki z lekcji | aparat → kontrola jakości → upload → `read-notebook` (OCR) → potwierdzenie rodzica |
| 1230 | Zeszyt | przedmiot → lekcje, porównanie z materiałem (`read-notebook` tryb `check`) |
| 1356 | konto, rodzina, paczki | `loadPack` (wczytuje tylko cards/units/subjects/tests/meta.grades, pełne rekordy) |
| 1408 | panel rodzica: materiał | dodawanie sprawdzianów, ustawienia (imię, limit nowych kart) |
| 1508 | **sesja nauki** | `buildQueue(kind)`, `startSession`, `startTick` (zegar), `persistSession`, `renderStudy`, `checkAnswer` i pomocnicze, `offlineCap`, `askMeaning`, `answerVerdict`, `gradeCap`, `missNow`, `gradeCard`, `finishSession`, `mathKeypad` |
| 2003 | import przez AI w aplikacji | `runTT` (terminarz). Działa tylko tam, gdzie jest `caps.sample`; na Vercel jest wyłączony |
| 2078 | zdarzenia | jeden `click` handler z `data-act`, formularze `data-form` |
| 2232 | start | logowanie, `makeSbStore` (zapis z kolejką offline), realtime, sprzątanie zdjęć |

### Przebieg jednej odpowiedzi (najważniejsza ścieżka)

1. `buildQueue(kind)` ustala kolejkę. Rodzaje sesji: `quick`, `daily`, `test`, `step`, `unit`, `extra`, `rematch`, `morning`, `recall`.
2. `renderStudy` pokazuje kartę. Tytuł działu jest ukryty do odkrycia, jeśli zawiera odpowiedź.
3. Uczeń wpisuje (klawiatura wzorów: `mathKeypad`, tryb wykładnika `SES.sup`) i klika „Pokaż odpowiedź”.
4. `checkAnswer(typed, answer, type, front)` w telefonie zwraca:
   - `exact` albo `close`: zalicza;
   - `no`: inna liczba, przepisane pytanie;
   - `dk`: „nie wiem”, „nwm”;
   - `""`: nie wiadomo.
5. Przy wyniku `""` albo `no` idzie `askMeaning`, czyli funkcja `read-notebook` w trybie `answer`. Wraca `{verdict: yes|partial|no|na, why, how}`, limit 9 s.
6. Zła lub częściowa odpowiedź jest od razu zapisywana jako postęp (`SES.pre`), więc zamknięcie albo odświeżenie jej nie kasuje.
7. `gradeCap` ustala najwyższą dostępną ocenę:
   - lokalnie „no”/„dk” albo AI „no”: tylko 0 (Nie wiem);
   - AI „partial”: najwyżej 1 (Z trudem);
   - po podpowiedzi: najwyżej 1;
   - bez wpisu w sesji `test`, `step` i w porannej powtórce w dniu sprawdzianu: najwyżej 1;
   - AI niedostępne: `offlineCap`.
8. `gradeCard(g)` wywołuje `grade(prev, g, today, hold)`:
   - 0: poziom 0, karta wraca dziś;
   - częściowo: poziom bez zmian, karta wraca;
   - dobrze: +1, ale seria zaczęta dziś dochodzi dziś najwyżej do 2 z 3 (`runStart`);
   - opanowana: powtórki po 1, 2, 4 dniach i dalej razy „łatwość” (najwyżej 90 dni).
9. `store.put("progress", …)` zapisuje do bazy (kolejka offline w `localStorage`: `borban_outbox_<family>`). `requeue` wstawia kartę z powrotem do sesji (limity w `willReturn`). Uczeń dostaje komunikat bez liczników.
10. Punkty: Nie wiem 1, Z trudem 6, Wiem 8, +2 za zgodny wpis. Bez wpisu połowa (1/3/4). +20 za sesję od 10 odpowiedzi. Notatka daje +10 dopiero po potwierdzeniu przez rodzica.

### Dane dziś: tabela `borban_docs`

Jeden wiersz to `(family_id, col, id, data jsonb, updated_at)`. RLS: rodzina widzi tylko swoje wiersze. Uczeń zapisuje tylko `progress`, `sessions`, `woop`, `flags` i `notes`, a strażnik pilnuje `progress`.

| `col` | Kształt `data` (najważniejsze pola) |
|---|---|
| `subjects` | `name`, `current` (dział „tu jesteś”) |
| `units` | `subjectId`, `title`, `svg`, `ord` |
| `cards` | `type` (`qa`/`cloze`/`vocab`), `front`, `back`, `unitId`, `subjectId`, `svg`, `svgSize`, `who`, `lit`, `why`, `ex`, `tpl`, `mnemo` (standard: `docs/STANDARD-KART.md`) |
| `progress` | `v:2`, `run` (dobre z rzędu), `runStart`, `ease`, `interval`, `reps`, `due`, `lapses`, `seen`, `lastOk`, `hist` [[data, ocena]] (do 12), `introduced`, `unitId`, `subjectId`, `at` |
| `sessions` | `date`, `start`, `end`, `activeMs`, `kind`, `ref`, `n`, `ok`, `hard`, `partial`, `wrong`, `newN`, `points`, `answers` [{`c` karta, `y` wpis, `g` ocena, `m` zgodny wpis, `ai` werdykt, `t` czas}] |
| `tests` | `title`, `date`, `subjectId`, `unitIds` |
| `meta` | `config` (`student`, `newPerDay`…), `grades` (`items`, `updated`): oceny z Librusa |
| `notes`, `confirmations` | notatki z lekcji i dziennik potwierdzeń rodzica |
| `flags` | zgłoszenia błędów w kartach (`cardId`, `note`, `typed`, `resolved`) |

### Funkcja `read-notebook`: kontrakt

Wszystkie tryby wymagają zalogowanego użytkownika i członkostwa w rodzinie `fam`.

| Tryb | Wejście | Wyjście | Model |
|---|---|---|---|
| zdjęcia (domyślny) | `fam`, `paths[]` (do 6, w `notes/<fam>/…`), `subject`, `units[]` | `{lessons, text, issues, cards, unitGuess, confidence, unreadable}` | Sonnet |
| `check` | `fam`, `subject`, `unit`, `points[{id,q,a}]`, `notes[]` | `{covered, partial, missing, conflicts, extra, summary}` | Sonnet |
| `answer` | `fam`, `cardId`, `typed`, `ctx` | `{verdict: yes\|partial\|no, why, how}` (treść karty serwer bierze z bazy, nie od telefonu) | Haiku |

Przy nieznanej nazwie modelu funkcja sama wybiera najnowszy dostępny model z listy konta.

---

## 4. Niezmienniki: tego nie wolno zepsuć

1. Dane osobowe dziecka (oceny, postępy, sesje, sprawdziany, zrzuty, e-maile) **tylko w bazie**. Nigdy w repozytorium, logach CI ani paczkach z biblioteki. Walidator to sprawdza.
2. Klucz `service_role`, hasło do bazy i `ANTHROPIC_API_KEY` nigdy w kodzie ani na czacie. W aplikacji jest tylko klucz publishable.
3. Zmiany bazy tylko nową migracją. Nigdy nie edytujemy migracji, która już była uruchomiona.
4. Paczka zawsze z pełnymi rekordami: wczytanie niczego nie kasuje.
5. Obrazek karty nie zdradza odpowiedzi. Tytuł działu zdradzający odpowiedź jest ukryty do odkrycia (walidator ostrzega).
6. W sesji uczeń nie widzi liczników poziomu („kropek”), bo stresowały. Po ocenie dostaje tylko dobrą informację.
7. Po złej odpowiedzi nie ma „Wiem”. Błąd zapisuje się w chwili pokazania.
8. Każda ważna decyzja trafia do `docs/DECYZJE.md`. Każda nowa funkcja przechodzi 5 pytań z `docs/OSZCZEDNOSC-DANYCH.md`.

---

## 5. Jak wdrażać

1. Zmiana w gałęzi (np. `dev-<opis>`) dostaje automatyczny podgląd Vercel.
2. Lokalnie: `cd tests && npm test`. W CI działa to samo (`.github/workflows/testy.yml`) oraz walidator materiału (`content-check.yml`).
3. Przy zmianach logiki nauki albo oceniania uruchom symulację 50 uczniów (`tests/README.md`) i porównaj z poprzednią turą.
4. Test na podglądzie: logowanie kontem rodzica, sprawdzenie na prawdziwych danych (rodzic nie zmienia postępów ucznia).
5. Merge do `main` = produkcja w ok. 20 s.
6. Po wdrożeniu: przypomnieć, że uczeń musi zamknąć i otworzyć aplikację, bo PWA trzyma starą wersję.
7. Migracje: plik w `supabase/migrations/RRRRMMDDhhmmss_opis.sql`, uruchamiany w Supabase → SQL Editor. Aplikacja musi działać zarówno przed, jak i po uruchomieniu migracji.
8. Funkcja: `supabase functions deploy read-notebook`, albo w panelu Supabase → Edge Functions → wklejenie kodu.

---

## 6. Znany dług techniczny (z testu 50 uczniów i 3 przeglądów, 25.10)

| Temat | Stan | Gdzie w planie |
|---|---|---|
| Materiał kopiowany do każdej rodziny (92% bazy), ładowany w całości przy otwarciu | do zmiany | E2 |
| Postęp liczony w telefonie; strażnik w bazie blokuje tylko rażące oszustwa | częściowo | E4 |
| Odpowiedzi są w pamięci telefonu, więc da się je wyczytać z narzędzi przeglądarki | z założenia | E4 (wpisy oceniane na serwerze) |
| Podgląd i lokalne uruchomienie korzystają z produkcyjnej bazy | do zmiany | E0 |
| Jeden plik 2400 linii bez modułów | do zmiany | E1 |
| Plan tygodnia, godziny porannej powtórki (`PLAN`, `MORNING`) wpisane pod jednego ucznia | do zmiany | E7 |
| Brak limitu zapytań AI i pamięci werdyktów | do zmiany | E4 |
| Librus tylko przez zrzuty wysyłane do czatu | do zmiany | E6 |
| Brak monitoringu błędów i kopii zapasowych poza Supabase | do zmiany | E0 |
| Drobne: „rano /” przechodzi przy odpowiedzi „rano / wieczorem”; dopisek w nawiasie jest opcjonalny | do decyzji | E4 |

---

## 7. Słownik

- **Karta**: pytanie i odpowiedź. Typ `qa`; `cloze` (luka `{{…}}` w zdaniu); `vocab` (para kart `…a`/`…b` w obie strony).
- **Dział (unit)**: część podręcznika. „Tu jesteś” to dział, do którego włącznie pojawiają się nowe karty.
- **Poziom / run**: dobre odpowiedzi z rzędu. **Opanowana**: 3 z rzędu, w co najmniej 2 dni.
- **Werdykt**: wynik sprawdzenia wpisu (`exact`/`close`/`no`/`dk`/`""` w telefonie; `yes`/`partial`/`no`/`na` z AI).
- **Sesja**: jedna runda nauki. Rodzaje w sekcji 3.
- **Gotowość**: średni poziom kart z zakresu sprawdzianu (100% = wszystkie opanowane).
- **Paczka**: plik `borban-pack-1` z pełnymi rekordami materiału (`content/pack.schema.json`).
- **Strażnik postępów**: trigger w bazie odrzucający nienaturalne zapisy postępu od ucznia.
- **Symulacja**: 25 uczciwych i 25 nieuczciwych uczniów w Playwright na udawanej bazie, plus 3 agentów sprawdzających logi.
