# Oszczędność danych i przepustowości: zasada na każdym kroku

Decyzja Huberta z 25.10.2026. Każdy element BorBana projektujemy tak, żeby dane powstawały **raz** i obsługiwały jak najwięcej dzieci. Baza i transfer mają rosnąć wolniej niż liczba uczniów.

## Skąd to się wzięło (liczby z pilotażu)

Baza Borysa po 9 dniach nauki to 1,86 MB:
- karty i działy (materiał): 1,7 MB, czyli 92%;
- postępy, sesje, notatki, oceny: 0,16 MB.

Dziś każda rodzina dostaje własną kopię materiału, a aplikacja przy każdym otwarciu pobiera całość. Przy 1000 rodzin i pełnym roku szkolnym (ok. 3000 kart) wychodzi:
- **baza:** ok. 10 GB, prawie same powtórzone karty;
- **transfer:** ok. 600 GB miesięcznie.

Ten sam materiał w jednej wspólnej kopii zajmuje kilkadziesiąt MB.

## Trzy poziomy danych: podręcznik → klasa → uczeń

| Poziom | Co tu jest | Kto korzysta | Ile kopii |
|---|---|---|---|
| **Podręcznik** (biblioteka) | działy, karty, obrazki, 3 kroki, wzory | każdy uczeń z tym podręcznikiem (szacunek: ok. 3/4 uczniów korzysta z kilku najpopularniejszych podręczników) | 1 na podręcznik i wersję |
| **Klasa** | zeszyt klasy (notatki z lekcji), terminarz sprawdzianów, karty z lekcji nauczyciela, „tu jesteśmy” w podręczniku | wszyscy uczniowie tej klasy (szkoła + rocznik + oddział) | 1 na klasę |
| **Uczeń** | postępy kart, odpowiedzi, sesje, oceny, prywatne notatki i karty, ustawienia | jedno dziecko i jego rodzic | 1 na ucznia |

Reguła: **dana idzie na najwyższy poziom, na którym jest taka sama dla wszystkich.** Na poziom ucznia trafia tylko to, co jest naprawdę osobiste.

## Zeszyt klasy

- **Pierwsze zdjęcie notatki z danej lekcji tworzy notatkę klasy.** Zdjęcie od kolejnego ucznia tylko ją uzupełnia: AI porównuje i dopisuje różnice. Nie powstaje druga kopia.
- **Zdjęcia nigdy nie są wspólne.** Każde zostaje u rodziny, która je wgrała, i jest usuwane po 30 dniach. Klasa dostaje tylko tekst, po potwierdzeniu przez rodzica, bez imion i charakteru pisma.
- **Karty z notatki klasy powstają raz dla całej klasy.** Gdy kilka klas ma takie same, przechodzą do biblioteki podręcznika.
- **Terminarz sprawdzianów jest wspólny dla klasy.** Wystarczy, że jeden rodzic wgra zrzut z Librusa. Pozostali potwierdzają jednym kliknięciem.
- **Każdy uczeń zbiera własne punkty za zdjęcie.** Zdjęcie od drugiego ucznia nie dubluje danych, ale potwierdza notatkę i łapie braki.

Warunki: członkostwo w klasie potwierdza rodzic (kod klasy od pierwszego rodzica albo od szkoły-partnera). Rodzice zgadzają się na dzielenie tekstu notatek w klasie (RODO).

## Reguły przepustowości (telefon ↔ serwer)

1. **Materiał z pamięci telefonu.** Telefon trzyma bibliotekę lokalnie i pobiera tylko działy, które zmieniły wersję od ostatniej synchronizacji. Nigdy całość przy każdym otwarciu.
2. **Tylko potrzebne działy.** Pobieramy podręczniki ucznia i działy do „tu jesteśmy” plus te ze sprawdzianów. Reszta dopiero na żądanie.
3. **Obrazki raz i na zawsze.** Każdy SVG ma stały adres z odciskiem treści, więc przeglądarka pobiera go raz, a obrazek używany w wielu miejscach istnieje raz.
4. **Zapis tylko zmiany.** Jedna odpowiedź to jeden mały rekord postępu i jeden wpis w dzienniku odpowiedzi, a nie przepisanie całej sesji.
5. **Zdjęcia zmniejszane w telefonie** przed wysłaniem (dłuższy bok do ok. 1600 px, kompresja). Usuwane po 30 dniach.
6. **Aktualizacje na żywo tylko tam, gdzie ktoś patrzy.** Panel rodzica subskrybuje zmiany, gdy jest otwarty. Telefon ucznia nie trzyma stałego połączenia.
7. **AI najpierw z pamięci.** Werdykt dla pary „karta + znormalizowana odpowiedź” jest wspólny dla wszystkich uczniów, bo nie zawiera danych osobowych. Ta sama zła odpowiedź u 200 uczniów to jedno zapytanie do AI. Do tego dzienny limit zapytań na ucznia.
8. **Sprawdzanie w telefonie przed AI.** Wszystko, co pewne (zapis, kolejność, literówki), rozstrzyga telefon bez sieci i bez kosztu.

## Jak sprawdzamy każdą nową funkcję

Przed wdrożeniem odpowiadamy na pięć pytań:
1. Na którym poziomie (podręcznik, klasa, uczeń) ta dana powinna żyć?
2. Ile kopii powstanie przy 1000 i przy 10 000 uczniów?
3. Ile bajtów idzie przez sieć przy jednym otwarciu aplikacji i przy jednej odpowiedzi?
4. Czy da się użyć tego, co już policzone (pamięć werdyktów, wspólna notatka)?
5. Czy dzielenie danych nie ujawnia niczego osobistego?

Odpowiedzi dopisujemy w opisie zmiany. Symulacja uczniów (`sim/`) liczy przy okazji bajty na odpowiedź i na otwarcie.
