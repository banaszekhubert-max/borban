# Plan wdrożenia Fazy 1 (do pilotażu, styczeń 2027)

Cel: z prototypu dla jednego ucznia zrobić produkt dla 10–20 rodzin w pilotażu, zbudowany tak, żeby bez przepisywania urósł do 1000 i więcej uczniów.

Etapy idą po kolei. Każdy ma:
- cel,
- zakres,
- warunek „gotowe”,
- drogę wycofania.

Nie zaczynamy etapu, dopóki poprzedni nie spełnia warunku „gotowe”. Wyjątek: etapy oznaczone jako równoległe.

Szacunki to dni pracy jednego programisty z pomocą Claude. Daty są orientacyjne.

| Etap | Nazwa | Dni | Zależy od |
|---|---|---|---|
| E0 | Bezpieczne środowisko | 3–4 | – |
| E1 | Aplikacja w modułach z testami w CI | 5–7 | E0 |
| E2 | Biblioteka per podręcznik i ładowanie tylko zmian | 7–10 | E1 |
| E3 | Rodzina, dzieci i postępy w tabelach (przeniesienie danych Borysa) | 5–7 | E2 |
| E4 | Ocena odpowiedzi i postęp liczone na serwerze, pamięć werdyktów AI | 5–7 | E3 |
| E5 | Klasy: kod klasy, terminarz i zeszyt klasy | 6–8 | E3 (równolegle z E4) |
| E6 | Linia materiału: zdjęcia, Librus, szkic kart, panel opiekuna | 8–10 | E4, E5 |
| E7 | Ustawienia rodziny, kilkoro dzieci, onboarding | 4–5 | E3 |
| E8 | RODO, umowy, testy bezpieczeństwa, start pilotażu | 4–6 | wszystkie |

Razem ok. 50–65 dni pracy.

---

## E0. Bezpieczne środowisko

**Cel:** testy i podglądy nigdy nie dotykają danych dziecka; da się odtworzyć bazę po awarii.

**Zakres:**
- repozytorium prywatne;
- dostęp programisty przez osobne konto GitHub z przeglądem zmian (pull request);
- drugi projekt Supabase, „borban-test”, z tymi samymi migracjami i danymi syntetycznymi z `content/library` oraz udawanych rodzin;
- Vercel: podgląd gałęzi łączy się z bazą testową (zmienne środowiskowe zamiast `config.js` na sztywno), produkcja z produkcyjną;
- plany płatne: Supabase Pro z codzienną kopią zapasową, Vercel Pro (darmowy plan nie jest do użytku komercyjnego);
- cotygodniowy eksport bazy poza Supabase, szyfrowany;
- monitoring błędów w aplikacji i funkcji (np. Sentry) bez danych osobowych w zdarzeniach.

**Gotowe, gdy:**
- podgląd dowolnej gałęzi zapisuje do bazy testowej;
- odtworzenie produkcji z kopii jest przećwiczone na bazie testowej i trwa poniżej godziny;
- błąd JS u ucznia pojawia się w monitoringu w ciągu minuty.

**Wycofanie:** zmienne środowiskowe wracają do obecnej konfiguracji. Dane bez zmian.

## E1. Aplikacja w modułach z testami w CI

**Cel:** dwie osoby mogą pracować nad kodem bez konfliktów, a każda zmiana jest automatycznie testowana.

**Zakres:**
- podział `index.html` na moduły według mapy z `docs/DLA-PROGRAMISTY.md`, sekcja 3: `powtorki`, `sprawdzanie`, `sesja`, `plan`, `render/*`, `rodzic/*`, `store`, `start`;
- krok budowania (Vite);
- czysty JS z JSDoc, bez frameworka, żeby nie przepisywać widoków;
- testy z `tests/` przechodzą na zbudowanej wersji;
- `tests/lib/sprawdzanie.js` importuje moduł zamiast wycinać z HTML;
- CI: walidator materiału, testy odpowiedzi, testy ekranu, budowanie;
- symulacja 50 uczniów raz w tygodniu z raportem;
- wersja aplikacji widoczna w ustawieniach;
- komunikat „Jest nowa wersja – dotknij, żeby odświeżyć” zamiast przypominania o ręcznym zamykaniu.

**Gotowe, gdy:**
- `npm test` przechodzi w CI;
- symulacja daje te same liczby co przed podziałem (porównanie `liczby.json`);
- rozmiar pobieranej aplikacji nie rośnie.

**Wycofanie:** Vercel wraca do ostatniego wdrożenia jednym kliknięciem.

## E2. Biblioteka per podręcznik i ładowanie tylko zmian

**Cel:** materiał istnieje raz. Telefon pobiera tylko to, czego potrzebuje, i tylko zmiany. To pierwszy krok z `docs/OSZCZEDNOSC-DANYCH.md`.

**Zakres:**
- migracje z `docs/schemat-docelowy.sql`, sekcja „Biblioteka”: `textbooks`, `library_units`, `library_cards` (wersje, status `published`);
- import z `content/library/*.json` skryptem (paczka to dalej format wymiany);
- przypisanie podręczników z `BorBan-podreczniki-klasa1` do przedmiotów;
- obrazki SVG pod stałym adresem z odciskiem treści, cache w telefonie;
- endpoint „co się zmieniło od wersji X” dla działów ucznia;
- telefon trzyma bibliotekę lokalnie (IndexedDB) i pobiera tylko działy do „tu jesteś” plus działy ze sprawdzianów.

**Gotowe, gdy:**
- pierwsze otwarcie pobiera tylko bieżące działy (cel: poniżej 300 kB bez obrazków);
- kolejne otwarcie bez zmian w materiale pobiera poniżej 10 kB;
- karty Borysa wyglądają i działają tak samo (test ekranu i symulacja).

**Wycofanie:** aplikacja ma przełącznik źródła materiału: biblioteka albo `borban_docs`. `borban_docs` zostaje tylko do odczytu do końca E3.

## E3. Rodzina, dzieci i postępy w tabelach

**Cel:** dane ucznia w tabelach z indeksami, rodzina z kilkorgiem dzieci, koniec `borban_docs`.

**Zakres:**
- tabele `families`, `family_members`, `children`, `child_textbooks`, `card_progress`, `answers`, `sessions`, `tests`, `grades`, `family_cards` wraz z RLS i testami RLS (rodzina A nie widzi B, dziecko nie zmienia materiału);
- jednorazowy skrypt przeniesienia z `borban_docs` z raportem liczb przed i po;
- dane Borysa przenosimy w uzgodnionym oknie (nie w dniu sprawdzianu);
- `card_key`: `lib:<id>` | `cls:<uuid>` | `fam:<uuid>`;
- historia odpowiedzi w `answers`, zamiast tablicy w sesji.

**Gotowe, gdy:**
- liczby po przeniesieniu się zgadzają: karty z postępem, opanowane, punkty tygodnia, seria, gotowość do sprawdzianów;
- panel rodzica pokazuje to samo co przed zmianą;
- testy RLS przechodzą.

**Wycofanie:** `borban_docs` zostaje nietknięte przez 30 dni. Przełącznik wraca do starego źródła.

## E4. Ocena i postęp na serwerze, pamięć werdyktów AI

**Cel:** postępu nie da się sfałszować (warunek pod rywalizację w klasie). AI kosztuje mniej, im więcej uczniów.

**Zakres:**
- jedna funkcja `submit_answer(card_key, typed, chosen_grade)` w bazie albo funkcji brzegowej, w jednej transakcji:
  - sprawdzenie wpisu: ta sama logika co `checkAnswer`, wspólny moduł;
  - werdykt AI z pamięci `answer_verdicts` albo zapytanie;
  - `gradeCap`, `grade`, zapis `card_progress` i `answers`;
  - zwraca werdykt i nowy stan;
- telefon dalej sprawdza lokalnie dla szybkiej odpowiedzi, ale zapis decyduje serwer;
- dzienny limit zapytań AI na ucznia (`ai_quota`);
- odpowiedzi kart pobierane dopiero po wpisie, żeby nie dało się ich wyczytać z pamięci przed odpowiedzią (opcjonalnie, do decyzji: kosztuje jedno zapytanie na kartę);
- strażnik postępów zostaje jako druga linia obrony.

**Gotowe, gdy:**
- zapis postępu z konsoli przeglądarki jest odrzucany;
- ta sama zła odpowiedź u dwóch uczniów to jedno zapytanie do AI;
- czas od „Pokaż odpowiedź” do werdyktu bez AI poniżej 300 ms, z AI poniżej 3 s;
- symulacja: kombinatorzy bez zysku w kategoriach z `tests/symulacja`.

**Wycofanie:** zapis wraca do telefonu (obecna logika), strażnik zostaje.

## E5. Klasy (równolegle z E4)

**Cel:** dane klasy powstają raz. Drugi uczeń w klasie prawie nic nie dokłada do bazy.

**Zakres:**
- migracje `schools`, `class_groups`, `class_members`, `class_textbooks`, `class_tests`, `class_notes`, `class_cards` (`docs/schemat-docelowy.sql`);
- kod klasy;
- zgoda rodzica na wspólny zeszyt (`share_notes`);
- terminarz klasy: jeden wpis, potwierdzenia pozostałych;
- „tu jesteśmy” dla klasy z możliwością wyjątku u ucznia;
- scalanie notatek z wielu zdjęć jednej lekcji (AI porównuje i dopisuje różnice);
- awans powtarzających się kart klasy do biblioteki.

**Gotowe, gdy:**
- drugi uczeń w klasie nie tworzy nowych kart ani sprawdzianów, tylko potwierdzenia;
- zdjęcia nie są widoczne poza rodziną;
- tekst wspólny jest bez imion.

**Wycofanie:** funkcje klasy za przełącznikiem. Uczeń bez klasy działa jak dziś.

## E6. Linia materiału

**Cel:** materiał dla nowych podręczników i klas powstaje bez ręcznej pracy w czacie, z kontrolą człowieka.

**Zakres:**
- `content_jobs`: zdjęcie → kontrola jakości → OCR → potwierdzenie rodzica → szkic kart w standardzie → walidator → przegląd opiekuna → publikacja;
- panel opiekuna: kolejka, galeria, zatwierdzanie, licznik minut (KPI: dzieci na etat);
- Librus: przycisk „Wgraj zrzut” w panelu rodzica, AI odczytuje oceny i sprawdziany, rodzic potwierdza, a dla klasy wystarczy jeden zrzut;
- wtyczka przeglądarki według `docs/BEZPIECZENSTWO.md`, po decyzji prawnika.

**Gotowe, gdy:**
- nowy dział z podręcznika przechodzi od zdjęcia do publikacji bez czatu;
- czas opiekuna na dział jest mierzony;
- zrzut z Librusa staje się ocenami i sprawdzianami po jednym potwierdzeniu.

**Wycofanie:** paczki z czatu dalej działają jako format wymiany.

## E7. Ustawienia rodziny i onboarding

**Cel:** nic w kodzie nie jest wpisane pod jednego ucznia.

**Zakres:**
- plan tygodnia (dni z blokiem nauki, godziny) i godziny porannej powtórki w ustawieniach rodziny zamiast stałych `PLAN` i `MORNING`;
- kilkoro dzieci w rodzinie (przełącznik w panelu rodzica);
- wybór szkoły, klasy i podręczników przy zakładaniu;
- zaproszenie dziecka.

**Gotowe, gdy:** nowa rodzina zakłada konto, wybiera klasę i podręczniki, a dziecko zaczyna naukę bez udziału Huberta.

## E8. RODO, umowy, bezpieczeństwo, start pilotażu

**Zakres:**
- umowy powierzenia z Supabase (region UE) i Anthropic;
- zgoda rodzica (dane dziecka, AI, wspólny zeszyt);
- regulamin i umowa konsumencka;
- rejestr dostępu opiekunów;
- usuwanie konta na żądanie;
- testy bezpieczeństwa: RLS, funkcje, limity, wstrzyknięcia do AI;
- symulacja 1000 uczniów (skalowana `tests/symulacja`) z pomiarem bajtów i czasu.

**Gotowe, gdy:** prawnik zatwierdził dokumenty, testy bezpieczeństwa przechodzą, a 10–20 rodzin ma konta.

---

## Koszty miesięczne (szacunek, październik 2026)

| | 100 uczniów | 1000 uczniów | 10 000 uczniów |
|---|---|---|---|
| Supabase | Pro ok. 25 $ | Pro + dodatki ok. 60–120 $ | Team / większa instancja ok. 600–1500 $ |
| Vercel | Pro ok. 20 $ | ok. 20–40 $ | ok. 50–150 $ |
| AI: sprawdzanie odpowiedzi (Haiku, ok. 0,0017 $ za zapytanie, ok. 15% odpowiedzi; pamięć werdyktów od E4 obniża koszt) | ok. 70 $ → ok. 40 $ | ok. 760 $ → ok. 300 $ | ok. 7600 $ → ok. 2000 $ |
| AI: zeszyty i Librus (Sonnet) | ok. 30 $ | ok. 200 $ (klasy obniżają) | ok. 1500 $ |
| Monitoring, kopie | ok. 30 $ | ok. 50 $ | ok. 200 $ |

Założenia: 100 odpowiedzi dziennie na ucznia. Ceny według cenników z 2026 (Supabase Pro: 8 GB bazy, 250 GB transferu, 500 połączeń na żywo, 2 mln wywołań funkcji). Przed decyzją sprawdzić aktualne cenniki.

## Mierniki, które śledzimy od E0

- bajty na pierwsze i kolejne otwarcie aplikacji;
- bajty na jedną odpowiedź;
- rozmiar bazy na ucznia;
- odsetek odpowiedzi rozstrzygniętych w telefonie, z pamięci werdyktów i przez AI;
- koszt AI na ucznia miesięcznie;
- czas do werdyktu;
- błędy JS na 1000 sesji;
- minuty opiekuna na dział i na dziecko.
