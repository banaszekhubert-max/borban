# Jak pracujemy

## Wdrożenie aplikacji
Commit do `main` → Vercel publikuje https://borban.vercel.app w ok. 20 s. `vercel.json` wyłącza cache dla strony, ale otwartą aplikację trzeba odświeżyć (na telefonie: przeciągnij w dół). Przy większych zmianach: gałąź `dev` → link podglądu z Vercel → test → merge.

## Testy przed każdym wdrożeniem
- `cd tests && npm test`: sprawdzanie odpowiedzi i ekran (to samo w CI: `.github/workflows/testy.yml`).
- Zmiana logiki nauki albo oceniania: symulacja 50 uczniów (`tests/README.md`), 3 agentów sprawdzających (`tests/symulacja/AGENCI.md`), porównanie liczb z poprzednią turą.
- Na podglądzie Vercel: test kontem rodzica na prawdziwych danych (rodzic nie zmienia postępów ucznia).
- Po wdrożeniu: uczeń zamyka i otwiera aplikację.

## Każda nowa funkcja
Pięć pytań z `docs/OSZCZEDNOSC-DANYCH.md` (poziom danych, liczba kopii, bajty, ponowne użycie, prywatność). Odpowiedzi idą do opisu zmiany. Decyzja trafia do `docs/DECYZJE.md`.

## Zmiany w bazie
Każda zmiana schematu to nowy plik w `supabase/migrations/` (`RRRRMMDDhhmmss_opis.sql`), uruchamiany w Supabase → SQL Editor. Nigdy nie edytujemy migracji, która już była uruchomiona.

## Nowy materiał
Patrz `docs/STANDARD-KART.md`, sekcja „Proces dla każdej nowej porcji materiału”. Paczki dla konkretnej rodziny (np. z ocenami albo sprawdzianami) nie trafiają do repozytorium.

## Narzędzia
- `tools/validate_pack.py`: kontrola paczek (też automatycznie w GitHub Actions przy zmianie `content/` lub `tools/`).
- `tools/build_gallery.py`: galeria HTML do przeglądu.
- `tools/build_pack.py`: składanie paczki do wczytania.
