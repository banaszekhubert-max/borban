# Historia zmian

Od najnowszych. Uzasadnienia decyzji są w `docs/DECYZJE.md`, a szczegóły w historii commitów.

Wizualna mapa systemu, droga karty i wyniki testu 50 uczniów to strona „Mechanika BorBana”: https://claude.ai/artifact/4YYm8ZeaABj5NvxkyYjiCn (prywatna, udostępnia Hubert).

## 25.10.2026 – test 50 uczniów, porządki pod skalę

**Dokumentacja dla programisty**
- `docs/DLA-PROGRAMISTY.md`: jak działa dziś, mapa kodu, kontrakty, niezmienniki, wdrażanie, dług techniczny.
- `docs/PLAN-FAZA-1.md`: etapy E0–E8 z warunkami „gotowe”, wycofaniem, kosztami.
- `tests/`: testy odpowiedzi i ekranu w CI (`.github/workflows/testy.yml`) oraz symulacja uczniów.
- Zasada oszczędności danych (`docs/OSZCZEDNOSC-DANYCH.md`): podręcznik → klasa → uczeń. Schemat docelowy uzupełniony o klasy, zeszyt i terminarz klasy, pamięć werdyktów AI, limit AI.

**Test 50 symulowanych uczniów i 3 niezależnych sprawdzających** (25 uczciwych, 25 kombinatorów, 12 sposobów oszukiwania). Poprawki wdrożone tego samego dnia:
- ocenianie: niepełna odpowiedź (ucięty przedział, działanie bez wyniku, część odpowiedzi, dopisek z nawiasu) nie przechodzi lokalnie; „nwm” = „nie wiem”; przepisane pytanie = źle;
- zła odpowiedź zapisuje się w chwili pokazania, więc odświeżenie ani wyjście jej nie kasuje;
- podpowiedź to pierwsze litery i daje najwyżej „Z trudem”; tytuł działu nie zdradza odpowiedzi przed odkryciem;
- bez AI wpis bez związku z odpowiedzią daje najwyżej „Z trudem”; przed sprawdzianem „Wiem” tylko po wpisie; „Wiem” bez wpisu daje połowę punktów;
- szybka runda zaczyna od kart z dzisiejszym błędem; poprawne liczniki, procenty, gotowość (średni poziom kart);
- opanowanie w co najmniej 2 dni (seria zaczęta dziś dochodzi do 2 z 3);
- nowe karty w limicie dnia także w sesji działu i przed sprawdzianem; słówko w obie strony nie w jednej sesji;
- imię ucznia z ustawień zamiast „Borys” na sztywno; punkty za notatkę po potwierdzeniu rodzica; odpytywanie liczy czas najwyżej 5 min po ostatnim ruchu;
- migracja `20261025000001_straznik_postepow.sql`: baza odrzuca od ucznia nienaturalny postęp.

Wyniki przed i po:
- śmieci i „Wiem” przy wyłączonym AI: 76 → 0;
- lista kilku odpowiedzi naraz: 25 → 0;
- odświeżenie albo wyjście po błędzie: błąd przestał ginąć;
- niepełna odpowiedź jako pełna: 34 → 4;
- dobre wpisy uczciwych uznane: 675 z 678; złe uznane: 0.

**Uczeń i sesja**
- W sesji nie ma kropek ani liczników poziomu, bo stresowały ucznia. Po ocenie jest tylko dobra informacja.
- Zegar nauki w nagłówku i licznik sesji.
- W dniu sprawdzianu poranna powtórka całego zakresu od 6:00.
- Klawiatura do wzorów (tryb wykładnika, przełącznik na systemową).
- Zgłoszenia błędów z powodem; po złej odpowiedzi od razu poprawna odpowiedź, powód i „Jak do tego dojść” (AI, odniesienie do podstawy programowej).
- Ocena według sensu: telefon zalicza pewne przypadki, AI (`read-notebook`, tryb `answer`) rozstrzyga resztę.

**Marka i rynek:** jeden motyw „Szkoła średnia” (grafit i indygo, miękkie zaokrąglenia). Decyzje o kanałach (rodzice jako kanał podstawowy, klasa jako drugi) i kolejności rynków.

## 24.10.2026
- Opanowanie = 3 dobre z rzędu (25.10 uzupełnione o wymóg 2 dni).
- Nowe karty w każdej rundzie.

## 21.10.2026
- Zasada „bez presji”: uczeń widzi jeden mały krok na dziś.
- Panel tempa do sprawdzianów (ile nowych kart dziennie).

## 17.10.2026 – start na Supabase i Vercel
- Aplikacja PWA na Vercel, Supabase (logowanie, RLS, realtime), migracje 0001 i 0002.
- Notatki z lekcji: zdjęcie → kontrola jakości → OCR (funkcja `read-notebook`) → potwierdzenie rodzica → karty.
- Zakładka Zeszyt z porównaniem z podręcznikiem.
- Standard karty (obrazek „Naklejki”, 3 kroki), paczki z pełnymi rekordami, walidator w CI.
- Biblioteka: 13 przedmiotów, 39 działów, 335 kart.
