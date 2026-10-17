# Architektura BorBana: stan dziś i droga do skali

BorBan zaczął jako prototyp dla jednego ucznia. Ten dokument opisuje, co działa dziś, dokąd zmierzamy (tysiące dzieci, opiekunowie, partnerzy) i w jakiej kolejności to budować, żeby niczego nie przepisywać dwa razy.

## Zasady, które obowiązują od dziś

1. **Trzy światy danych, nigdy nie mieszane.**
   - **Kod** jest w tym repozytorium.
   - **Biblioteka materiału** (przedmioty, działy, karty, obrazki) jest w repozytorium w `content/` i w bazie.
   - **Dane osobowe** (oceny, postępy, sesje, sprawdziany dziecka, zrzuty z Librusa) są wyłącznie w bazie, nigdy w repozytorium ani w plikach przesyłanych dalej.
2. **Paczka jako kontrakt.** Materiał krąży w formacie `borban-pack-1` (`content/pack.schema.json`). Każda paczka zawiera pełne rekordy: wczytanie nie może skasować treści, nawet w starej wersji aplikacji.
3. **Każda zmiana materiału przechodzi tę samą drogę:** automatyczny walidator (`tools/validate_pack.py`, uruchamiany też w CI), przegląd człowieka w galerii (`tools/build_gallery.py`), wczytanie.
4. **Jeden standard karty** (`docs/STANDARD-KART.md`): obrazek w stylu „Naklejki”, a przy pojęciach 3 kroki (skąd to się wzięło, dlaczego tak jest, przykład z życia).
5. **Mierzymy od pierwszej rodziny.** Wynik firmy zależy od liczby dzieci na etat opiekuna, więc czas opiekuna na dziecko, skuteczność (oceny) i aktywność to dane pierwszej kategorii, nie dodatki.
6. **Prosto, dopóki działa.** Vercel i Supabase udźwigną tysiące użytkowników, więc nie budujemy mikroserwisów ani własnych serwerów, zanim liczby tego nie wymuszą.

## Stan dziś (faza 0: prototyp na jednym uczniu)

| Warstwa | Dziś | Ograniczenie przy skali |
|---|---|---|
| Aplikacja | jeden plik `index.html` (PWA, bez kroku budowania), hosting Vercel, wdrożenie po commicie do `main` | trudna do pracy w kilka osób, brak testów |
| Baza | Supabase: `borban_families`, `borban_members`, `borban_docs` (dokumenty JSON z kolekcją `col`), RLS: rodzic pisze wszystko, dziecko tylko postępy/sesje/woop/flags | każda rodzina ma własną kopię kart; postępy w JSON trudno liczyć zbiorczo |
| Materiał | paczki JSON przygotowane z Claude, wczytywane przez rodzica | ręczna praca, brak kolejki i przeglądu w aplikacji |
| Treść | 13 przedmiotów, 39 działów, 335 kart, wszystkie z obrazkiem, 152 z 3 krokami | jedna klasa, jeden zestaw podręczników |
| Bezpieczeństwo | RLS, sanitizacja SVG, blokada wklejania, bezpiecznik paczek | brak kopii zapasowych poza Supabase, repo publiczne |

## Docelowo (faza 2–3): model danych

Projekt schematu jest w `docs/schemat-docelowy.sql` i nie jest jeszcze wdrożony. Najważniejsze zmiany:

- **Biblioteka wspólna dla wszystkich rodzin.** Tabele `library_subjects`, `library_units` i `library_cards` są przypięte do podręcznika (`textbooks`, np. „Matematyka 1 Pazdro”), mają wersje i status (`draft` → `review` → `published`). Karta powstaje raz i obsługuje każde dziecko z tym podręcznikiem. To główna dźwignia na liczbę dzieci na etat.
- **Nakładka rodziny.** Karty z zeszytu konkretnego dziecka (`family_cards`) uzupełniają bibliotekę, nie kopiują jej.
- **Dziecko jako osobny byt.** `children` należy do rodziny, a rodzina może mieć kilkoro dzieci (rabat na rodzeństwo). Dziecko ma subskrypcje podręczników i przedmiotów.
- **Postępy i odpowiedzi w tabelach.** `card_progress` trzyma stan powtórek (jedna linia na dziecko i kartę), a `answers` dziennik odpowiedzi do analiz. Do tego `sessions`, `tests` (sprawdziany z terminarza) i `grades` (oceny).
- **Role.** Oprócz `parent` i `child` dochodzą `tutor` (opiekun prowadzący wiele rodzin, przydział w `tutor_assignments`) oraz `admin`. Do tego partnerzy (`partners`: szkoła, pracodawca, specjalista) z przypisaniem rodziny, czyli źródło pozyskania i koszt kanału.
- **Linia produkcyjna materiału.** `content_jobs` przechodzi przez etapy: zdjęcia od rodzica (Supabase Storage) → AI tworzy szkic kart w standardzie → walidator → opiekun zatwierdza → publikacja. Każde zadanie zapisuje minuty pracy opiekuna, co jest kluczowym KPI.
- **Analityka.** Widoki SQL do „Oceny a nauka” zbiorczo (przed i po starcie, przedmioty ćwiczone i nie), retencja, aktywność, KPI opiekuna.

Migracja z `borban_docs` będzie jednorazowym skryptem. Format paczki zostaje jako format wymiany (import i eksport biblioteki).

## Kolejność prac

**Faza 1: przed pilotażem (do stycznia 2027, 10–20 rodzin)**
1. Repozytorium prywatne, uporządkowane jak tu; CI z walidatorem materiału.
2. Kopie zapasowe: plan Supabase z codziennym backupem i cotygodniowy eksport bazy. Plany Vercel i Supabase na wersje płatne, bo darmowy plan Vercel nie jest przeznaczony do użytku komercyjnego.
3. Schemat docelowy, czyli migracje w `supabase/migrations/`, i jednorazowe przeniesienie danych pierwszej rodziny.
4. Przyjmowanie zdjęć przez rodzica, a z nich szkic kart przez AI (Edge Function z kluczem API po stronie serwera).
5. Panel opiekuna: kolejka zadań, galeria do przeglądu, zatwierdzanie, licznik minut.
6. Aplikacja rozbita na moduły z krokiem budowania (np. Vite), testy E2E (Playwright) w CI, środowisko testowe (podgląd Vercel + osobna baza). Robimy to w chwili, gdy do kodu dołącza druga osoba.
7. Umowy, zgody i RODO dziecka (`docs/BEZPIECZENSTWO.md`).

**Faza 2: rok 2 (ok. 300 dzieci, Warszawa)**
- Biblioteka pokrywa najpopularniejsze podręczniki klas, w których są nasze dzieci.
- Partnerzy (szkoły, pracodawcy) z kodami polecającymi.
- Płatności ratalne i umowy online.
- Raport dla rodzica co 6 tygodni generowany automatycznie.
- Monitoring błędów, alerty i audyt bezpieczeństwa.

**Faza 3: lata 3–5 (900–3000 dzieci, cała Polska)**
- Automatyzacja przeglądu: AI sprawdza fakty i standard przed opiekunem.
- Biblioteka do egzaminu ósmoklasisty i matury, klasy 4–8.
- Przetwarzanie wsadowe i kolejki zadań, jeśli liczby tego wymagają.

## Struktura repozytorium

```
index.html, config.js, manifest.webmanifest, icon-*.png, vercel.json   aplikacja (wdrażana przez Vercel)
content/library/*.json      biblioteka materiału, plik na przedmiot (bez danych osobowych)
content/pack.schema.json    kontrakt formatu paczki
tools/                      walidator, składanie paczki, galeria do przeglądu
supabase/migrations/        zmiany bazy po kolei (nazwa: data_numer_opis.sql)
docs/                       architektura, standard kart, decyzje, bezpieczeństwo, proces pracy
.github/workflows/          automatyczna kontrola materiału przy każdej zmianie
.vercelignore               wszystko poza aplikacją nie trafia na serwer www
```
