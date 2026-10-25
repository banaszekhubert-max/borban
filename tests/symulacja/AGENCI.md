# Agenci sprawdzający logi symulacji

Po `npm run symulacja` logi przegląda 3 niezależnych agentów. Każdy dostaje tylko kod i logi, bez naszych wniosków, żeby nie potwierdzał z góry założonej tezy. Każdy przechodzi **każdego ucznia osobno** i oddaje:
1. tabelę: uczeń → jedna linia uwag;
2. listę problemów od najpoważniejszego: dowód (uczeń, dzień, karta, linia logu), przyczyna w kodzie, wpływ, konkretna poprawka. Rozdział na: błąd / dziura do nadużyć / decyzja do rozważenia.

Wspólne wejście:
- `tests/symulacja/wyniki/digest/uczen-XX.txt`,
- `wyniki/logs/uczen-XX.json`,
- `wyniki/raport/automat.md`,
- `sim.js` (jak działa symulacja),
- `index.html`.

Uczniowie 01–25 są uczciwi, 51–75 to kombinatorzy (pole `persona.cheat`).

## A. Logika nauki i zapisu
Do sprawdzenia:
- poziomy kart: 3 dobre z rzędu w co najmniej 2 dni, błąd zeruje, „częściowo” nie zmienia poziomu;
- powroty kart w sesji i ich limity;
- terminy powtórek;
- rodzaje sesji, liczniki na pasku, koniec sesji;
- punkty i seria;
- czy to, co w pamięci telefonu, zgadza się z tym, co zapisane; przeładowanie strony;
- oszustwa dotyczące tych mechanizmów.

Funkcje: `grade`, `runOf`, `gradeCard`, `gradeCap`, `missNow`, `willReturn`, `buildQueue`, `todayPlan`, `persistSession`, `streak`, `pointsInWeek`.

## B. Ocenianie wpisanych odpowiedzi
Do sprawdzenia:
- fałszywe zaliczenia: niepełna albo zła odpowiedź uznana lokalnie;
- fałszywe odrzucenia dobrej odpowiedzi w innym zapisie;
- dziury przy wyłączonym AI;
- niejasne komunikaty.

Agent ustala, która gałąź `checkAnswer` dała wynik. Każdą klasę błędu opisuje przypadkami testowymi do dopisania w `tests/odpowiedzi/`.

## C. Ekran i przebieg
Do sprawdzenia, oczami 15-latka, który myśli dosłownie:
- ekran główny, nagłówek, pasek sesji, komunikaty, etykiety przycisków, koniec sesji;
- spójność liczb między ekranami;
- przyciski zasłonięte, przewijanie w bok, błędy JS;
- czy aplikacja zniechęca kombinatora, czy go nagradza.

## Znane artefakty symulacji (to nie są błędy aplikacji)
- Styl „po swojemu” czasem odwraca słowa (bełkot).
- Przy kartach z luką kombinator „przepisanie pytania” dostaje treść z odpowiedzią.
- „Częściowa” jednowyrazowa odpowiedź bywa całą odpowiedzią.
- AI jest udawane (odpowiada według zamiaru symulowanego ucznia).
- Strażnik postępów działa tylko w prawdziwej bazie.
