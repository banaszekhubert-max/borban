# Testy BorBana

Wszystkie testy działają bez sieci i bez prawdziwej bazy. Używają udawanego Supabase (`lib/aplikacja.js`) oraz materiału z `content/library`. Nie ma w nich danych osobowych dziecka.

```bash
cd tests
npm install && npx playwright install chromium
npm test            # odpowiedzi + ekran (to samo uruchamia CI: .github/workflows/testy.yml)
npm run symulacja   # 50 uczniów, ok. 30–40 min na 2 rdzeniach
```

## 1. Sprawdzanie odpowiedzi: `odpowiedzi/run.js` (bez przeglądarki, ok. 1 s)

`lib/sprawdzanie.js` wycina z `index.html` blok od `const clozeAnswer =` do `// Ocena sensu przez AI` i uruchamia go w Node, więc testy zawsze sprawdzają aktualny kod aplikacji.

| Plik | Co sprawdza |
|---|---|
| `przypadki-podstawowe.js` | zapis wzorów, daty, wieki, listy, słówka; oczekiwane `ok`, `no`, `ai` albo `notok` |
| `przypadki-193.js` | 193 przypadki z recenzji: zero fałszywych zaliczeń, zero twardych odrzuceń poprawnych |
| `przypadki-recenzja-b.js` | przypadki z testu 50 uczniów: ucięte przedziały, działanie bez wyniku, część odpowiedzi, nazwy przepisane z pytania; do tego `offlineCap` (ocena bez AI) |
| wzory z biblioteki | każda karta działu wzorów zalicza samą siebie, a pojedynczy czynnik nie zalicza całości |

Przy zmianie `checkAnswer` dopisz przypadek, który tę zmianę uzasadnia.

## 2. Ekran i zachowanie: `ekran/run.js` (Playwright, ok. 30 s)

Każdy test to reguła z `docs/DECYZJE.md`. Na ekranach 360 i 390 px nic nie przewija się w bok, zegar jest w nagłówku, a klawiatura wzorów pojawia się przy wzorach. Pozostałe reguły:
- dobra odpowiedź pokazuje „Zgadza się”, a po ocenie jest komunikat bez liczników;
- zła odpowiedź zapisuje się od razu, zostaje tylko „Nie wiem” i pojawia się „Jak do tego dojść”;
- podpowiedź to tylko pierwsze litery i daje najwyżej „Z trudem”;
- przed sprawdzianem „Wiem” jest dopiero po wpisaniu, a poranek w dniu sprawdzianu obejmuje cały zakres;
- poziom karty: jednego dnia najwyżej 2 z 3, błąd zeruje;
- bez AI wpis bez związku z odpowiedzią daje najwyżej „Z trudem”;
- panel rodzica: wszystkie zakładki działają bez błędów.

## 3. Symulacja uczniów: `symulacja/`

- `sim.js <od> <do>`: uczniowie 1–25 to uczciwi, z różną wiedzą, stylem pisania, wykładnikami, uczciwością samooceny i szerokością telefonu. Każdy uczy się 2–5 dni różnymi rodzajami sesji. Uczniowie 51–75 to kombinatorzy: 12 sposobów oszukiwania, np. „Wiem” bez wpisu, śmieci, lista odpowiedzi, namawianie AI, odświeżenie po błędzie, konsola, cofanie daty. Uczniowie **nie zgłaszają błędów**. Wszystko, co widzą i klikają, idzie do `wyniki/logs/uczen-XX.json`.
- `analiza.py`: reguły automatyczne, wynik w `wyniki/raport/automat.md` plus skrót każdego ucznia w `wyniki/digest/`.
- `liczby.py`: liczby do porównania tur, wynik w `wyniki/liczby.json`.
- Logi przegląda 3 niezależnych agentów (A: logika nauki i zapisu, B: ocenianie odpowiedzi, C: ekran i przebieg). Każdy przechodzi każdego ucznia osobno. Zakres i format pracy agentów: `symulacja/AGENCI.md`.
- Ograniczenia: AI jest udawane (odpowiada według zamiaru symulowanego ucznia), a odporność prawdziwego AI na namawianie sprawdza się osobno na żywej funkcji. Strażnik postępów działa tylko w prawdziwej bazie.

Folder `wyniki/` jest w `.gitignore`.
