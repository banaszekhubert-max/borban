# BorBan: spis wszystkich notatek

To jest jedno miejsce na całą wiedzę o aplikacji. Kopie w projekcie claude.ai i strony z linkami poniżej to tylko odsyłacze: przy sprzeczności obowiązuje to, co jest tutaj.

## Od czego zacząć
| Kto | Czyta po kolei |
|---|---|
| Nowa sesja Claude | ten plik → `../CHANGELOG.md` (co ostatnio się zmieniło) → `DECYZJE.md` → plik tematu, nad którym pracuje |
| Programista | `DLA-PROGRAMISTY.md` → `PLAN-FAZA-1.md` → `ARCHITEKTURA.md` → `OSZCZEDNOSC-DANYCH.md` |
| Materiał (karty) | `STANDARD-KART.md` → `../content/` → `../tools/` |
| Rodzic testujący Betę | `INSTRUKCJA-RODZICA.md` albo plansze z `../marketing/plansze/` |

## Pliki w repozytorium
| Plik | O czym |
|---|---|
| `../CHANGELOG.md` | historia zmian, od najnowszych |
| `DECYZJE.md` | dlaczego jest tak, a nie inaczej (nowe na górze) |
| `ARCHITEKTURA.md` | zasady, fazy, kierunek pod skalę |
| `DLA-PROGRAMISTY.md` | jak działa dziś, mapa kodu, niezmienniki, dług techniczny |
| `PLAN-FAZA-1.md` | etapy E0–E8 przed pilotażem (styczeń 2027) |
| `OSZCZEDNOSC-DANYCH.md` | podręcznik → klasa → uczeń; 5 pytań przy każdej funkcji |
| `STANDARD-KART.md` | jak wygląda dobra karta i proces nowego materiału |
| `BEZPIECZENSTWO.md` | dane dzieci, klucze, uprawnienia |
| `PROCES-PRACY.md` | wdrażanie, testy, migracje, zasada notatek |
| `schemat-docelowy.sql` | projekt bazy docelowej (niewdrożony) |
| `INSTRUKCJA-RODZICA.md` | krótka instrukcja dla rodziców w wersji Beta |
| `marketing/UWAGI.md` | kanały, kolejność rynków, konkurencja, czego nie obiecywać |
| `marketing/BADANIA-KOLORY-I-EKRAN.md` | badania: kolory, ekran startowy, motywacja, źródła |
| `../marketing/plansze/` | 6 plansz onboardingowych (PNG) i generator `plansze.py` |

## Strony poza repozytorium (prywatne, udostępnia Hubert)
| Strona | Link |
|---|---|
| Biznesplan na 5 lat | https://claude.ai/artifact/1PMC8mvrbCqB2KerUNj4Q8 |
| Mechanika BorBana (mapa systemu, test 50 uczniów) | https://claude.ai/artifact/4YYm8ZeaABj5NvxkyYjiCn |
| Instrukcja dla rodziców (Beta), wersja do edycji | https://claude.ai/artifact/HG2CPqVvw857UbTHLYv6Db |
| Duolingo i Quizlet: co buduje zaangażowanie | https://claude.ai/artifact/51mFFpr6YGkA7UyeGrAd2C |
| Projekty ekranów | https://claude.ai/artifact/QDSMLsQgk4aFBowko1E67V |

## Czego tu nie ma (celowo)
Dane konkretnego dziecka: oceny, postępy, sprawdziany, zrzuty z Librusa, zeszyty, lista jego podręczników. Są tylko w bazie albo w projekcie claude.ai (np. `borban-start.json`, `BorBan-podreczniki-klasa1`).

## Zasada na koniec każdej sesji
1. Wpis do `../CHANGELOG.md` (co się zmieniło) i do `DECYZJE.md` (jeśli zapadła decyzja).
2. Nowa notatka trafia tutaj i do tabeli wyżej, nie do osobnego pliku w czacie.
3. Kopie w projekcie claude.ai aktualizujemy po repozytorium, nigdy odwrotnie.
