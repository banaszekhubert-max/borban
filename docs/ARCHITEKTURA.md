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
7. **Dane raz, dla jak największej liczby dzieci.** Trzy poziomy: podręcznik → klasa → uczeń. Dana trafia na najwyższy poziom, na którym jest taka sama dla wszystkich (biblioteka per podręcznik, zeszyt i terminarz per klasa, tylko postępy i oceny per uczeń). Telefon pobiera tylko zmiany i tylko potrzebne działy, AI najpierw sprawdza wspólną pamięć werdyktów. Szczegóły i pięć pytań kontrolnych dla każdej funkcji: `docs/OSZCZEDNOSC-DANYCH.md`.

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

## Źródła danych i potwierdzenia rodzica

Zasada: każdy krok, w którym dane wchodzą do BorBana albo coś jest odczytywane z niepewnego źródła, kończy się **potwierdzeniem rodzica, zapisanym w dzienniku** (kto, kiedy, którą wersję). Za nasz własny wkład, czyli karty i wyjaśnienia, odpowiadamy sami, więc ten etap przegląda opiekun.

**Oceny i terminarz (Librus).** Firma nie zna haseł i nie loguje się do Librusa.
- Pilotaż: wtyczka BorBana w przeglądarce rodzica (Chrome/Edge). Rodzic sam się loguje, a wtyczka raz dziennie wysyła tylko oceny i terminarz jego dziecka.
- Rodzice bez komputera wysyłają zrzuty ekranu, które kasujemy po przetworzeniu.
- Docelowo: szkoły partnerskie (szkoła jako administrator danych, za zgodą rodzica) i rozmowa z Librusem o współpracy.
- Prywatnie u założyciela działa dziś zaplanowane zadanie w jego przeglądarce (pn–pt 19:56).

**Notatki z lekcji (zdjęcia zeszytu).**
1. Zdjęcie (dziecko lub rodzic), od razu automatyczna kontrola jakości: ostrość, jasność, kadr. Słabe zdjęcie: prośba o powtórkę.
2. OCR: odczytany tekst obok zdjęcia, niepewne słowa podświetlone.
3. **Potwierdzenie 1 (rodzic):** „odczyt zgadza się z zeszytem” albo poprawka. Fragmenty nieczytelne zostają oznaczone, nie zgadujemy ich treści.
4. Jeśli temat nie jest oczywisty, proponujemy dział i stronę podręcznika. **Potwierdzenie 2 (rodzic):** wybór działu.
5. AI tworzy uporządkowaną notatkę z lekcji i karty w standardzie, a przy okazji oznacza możliwe błędy w zeszycie (np. źle przepisany wzór).
6. Przegląd opiekuna (fakty, standard), potem publikacja. Zdjęcia są kasowane.

Potwierdzenia mają być krótkie, bo biznesplan zakłada ok. 30 minut pracy rodzica tygodniowo. Pokazujemy tylko to, co niepewne, a nie cały tekst do czytania. Mierzymy czas potwierdzeń i odsetek rodziców, którzy klikają bez poprawek. Jeśli zatwierdzają wszystko w kilka sekund, potwierdzenie przestaje cokolwiek chronić i trzeba je przeprojektować.

## Wspólny zeszyt klasy (kierunek, faza 2–3)

Uczniowie zapraszają kolegów z klasy. Notatki tej samej lekcji (ta sama szkoła, klasa, przedmiot, dział, data) są scalane w jeden „zeszyt klasy”, a każdy uczeń dostaje wersję połączoną. Każdy nowy uczeń poprawia materiał dla wszystkich, więc wzrost i jakość napędzają się same.

- **Scalanie:** dopasowanie lekcji po dziale i dacie; AI łączy treści, a to, co zgadza się u kilku osób i z podręcznikiem, ma wyższą wagę. Punkty sprzeczne idą do sprawdzenia (podręcznik rozstrzyga, potem większość).
- **Jakość:** to samo porównanie z podręcznikiem co w „Zeszycie” (jest / brakuje / inaczej). Wersja klasy pokazuje, skąd pochodzi każdy punkt (liczba źródeł, zgodność z podręcznikiem).
- **Prywatność:** udostępniamy tylko scalony tekst, bez zdjęć pisma, bez imion i bez ocen. Udział w zeszycie klasy wymaga zgody rodzica (uczeń niepełnoletni). Prywatne notatki zostają prywatne.
- **Motywacja:** punkty i odznaki za notatki, które weszły do wersji klasy.
- **Ryzyka do sprawdzenia z prawnikiem:** materiały nauczyciela (prawa autorskie, regulamin szkoły), moderacja treści, wiek użytkowników przy AI, RODO przy danych wielu rodzin.
- **Dane:** w schemacie docelowym tabele `classes`, `class_members`, `lesson_notes` (już zaprojektowana) + `class_notebook` (wersja scalona z wagami źródeł).

## Kolejność prac

**Faza 1: przed pilotażem (do stycznia 2027, 10–20 rodzin).** Szczegółowy plan z etapami E0–E8, warunkami „gotowe” i kosztami: `docs/PLAN-FAZA-1.md`. Poniżej skrót.
1. Repozytorium prywatne, uporządkowane jak tu; CI z walidatorem materiału.
2. Kopie zapasowe: plan Supabase z codziennym backupem i cotygodniowy eksport bazy. Plany Vercel i Supabase na wersje płatne, bo darmowy plan Vercel nie jest przeznaczony do użytku komercyjnego.
3. Schemat docelowy, czyli migracje w `supabase/migrations/`, i jednorazowe przeniesienie danych pierwszej rodziny.
4. Notatki z lekcji: zdjęcia z kontrolą jakości → OCR → potwierdzenia rodzica → szkic notatki i kart przez AI (Edge Function z kluczem API po stronie serwera) → przegląd opiekuna. Wtyczka do Librusa w przeglądarce rodzica.
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
docs/                       dla programisty, plan Fazy 1, architektura, oszczędność danych, standard kart, decyzje, bezpieczeństwo
tests/                      testy odpowiedzi i ekranu (CI), symulacja uczniów
.github/workflows/          automatyczna kontrola materiału przy każdej zmianie
.vercelignore               wszystko poza aplikacją nie trafia na serwer www
```
