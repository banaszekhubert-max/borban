# BorBan: ekran startowy, kolory i motywacja. Przegląd badań i rekomendacje

Stan na 25.10.2026 (przeniesione z projektu claude.ai 08.11.2026). Uwaga: od 25.10 obowiązuje jeden motyw „Szkoła średnia” (grafit i indygo); palety A–C poniżej są tłem tej decyzji (`../DECYZJE.md`).

Oznaczenia siły dowodów:
- **[MOCNE]**: metaanalizy lub replikowane eksperymenty
- **[UMIARKOWANE]**: pojedyncze eksperymenty albo duże A/B testy firm
- **[SŁABE/SPORNE]**: efekty, które się nie replikują
- **[PRAKTYKA]**: wytyczne i standardy branżowe, nie badania nad uczeniem się

## 1. Kolor a uczenie się i motywacja

**Efekt czerwieni jest słabszy, niż się powszechnie uważa [SŁABE/SPORNE].** Elliot, Maier i wsp. (2007) w czterech eksperymentach pokazali, że krótki kontakt z czerwienią przed testem (np. IQ) pogarszał wynik. Autorzy tłumaczyli to skojarzeniem czerwieni z błędem i motywacją unikania [1]. Metaanaliza Gnambsa (2020) temu przeczy. Ogólny efekt wyniósł Δ = −0,13. Dla testów wiedzy było to d = −0,04, czyli brak efektu. Dla testów rozumowania wyszło −0,34, ale po korekcie na stronniczość publikacji efekt spadł prawie do zera. Pierwsze badania pokazywały efekty kilka razy większe niż późniejsze [2]. Słynnego wyniku Mehty i Zhu (2009, *Science*: czerwień pomaga w zadaniach na szczegóły, niebieski w kreatywnych) nie powtórzono na próbie prawie 4 razy większej (263 vs 69 osób) [3]. **Wniosek:** nie ma rzetelnych dowodów, że czerwony motyw obniży Borysowi wyniki. Nie ma też dowodów, że niebieski lub zielony „poprawia skupienie”.

**Czerwień jako kolor oceniania to jednak realny problem [UMIARKOWANE].** W badaniu Rutchicka i wsp. (*European Journal of Social Psychology*, 2010) osoby oceniające czerwonym długopisem znajdowały o 27% więcej błędów i wystawiały niższe oceny (76 vs 80) za ten sam tekst [4]. Czerwień jest kulturowo przypisana do błędu, a uczeń myślący dosłownie odczyta „czerwone = źle” jednoznacznie. Wniosek: czerwień może być kolorem marki i przycisku głównego, ale **nigdy kolorem błędu**.

**Kontrast i czytelność [PRAKTYKA, standard].** WCAG 2.2 (1.4.3) wymaga kontrastu 4,5:1 dla zwykłego tekstu i 3:1 dla dużego [5]. Kryterium 1.4.1 zakazuje przekazywania znaczenia wyłącznie kolorem [6]. W BorBanie każde „dobrze” i „do powtórki” musi więc mieć też ikonę i słowo. Ważne odkrycie: **biały tekst na czerwieni Arsenalu #EF0107 ma kontrast 4,49:1, czyli minimalnie nie spełnia 4,5:1** (obliczenia własne wg wzoru WCAG). Na przyciskach z tekstem trzeba użyć ciemniejszego odcienia.

**Tryb ciemny [UMIARKOWANE].** Przegląd NN/g opisuje m.in. badania Piepenbrock i wsp. (2013). Przy normalnym wzroku ciemny tekst na jasnym tle daje lepszą ostrość i korektę tekstu, a przewaga rośnie przy małej czcionce. Użytkownicy tej różnicy nie zauważają. Zalecenie: jasny motyw domyślnie, ciemny jako opcja zgodna z ustawieniem systemu [7].

## 2. Ekran startowy, nawyk i motywacja

**Jedna główna akcja [UMIARKOWANE].** Headspace (eksperyment Irrational Labs) zamiast katalogu kursów dał jedną rekomendację po krótkim quizie. Rozpoczęcia kursu wzrosły z ok. 31% do ok. 63%. Ten sam kurs bez quizu działał słabiej, więc liczyło się poczucie „to jest dla mnie”. Uwaga: liczba dni medytacji nie wzrosła, bo użytkownicy nie umieli potem odnaleźć kursu [8]. Odświeżony ekran „Today” w Headspace (czerwiec 2026) ma na górze krótką listę „Essentials” na dziś, a resztę niżej [9].

**Obciążenie poznawcze [MOCNE].** Metaanaliza Reya (2012) wykazała mały do średniego negatywny wpływ „uwodzicielskich detali” na uczenie się, czyli ciekawych, ale nieistotnych dodatków [10]. Na ekranie nauki ozdobniki konkurują z treścią. Obrazki kart w BorBanie są związane z treścią, ale dekoracje na ekranie startowym i w trakcie rundy trzeba ograniczyć.

**Mikrosesje i powtórki [MOCNE].** Metaanaliza Cepedy i wsp. (2006: 317 eksperymentów) potwierdza efekt rozłożenia nauki w czasie. Optymalny odstęp między powtórkami rośnie wraz z czasem do sprawdzianu [11]. Metaanaliza Adesope i wsp. (2017) pokazuje, że testowanie się daje więcej niż powtórne czytanie [12]. Krótka runda codziennie ma więc solidne podstawy.

**Serie (streak): działają, ale bolą przy utracie [UMIARKOWANE].** Duolingo: osoby z 7-dniową serią 2,4× częściej wracają następnego dnia. Oddzielenie serii od celu dziennego dało +3,3% retencji w 14. dniu i +10,5% osób z aktywną serią [13]. „Weekend Amulet” (prototyp streak freeze) dał +4% powrotów po tygodniu i −5% utraconych serii. Autorzy zauważyli też, że osoby uczące się zrywami częściej porzucają aplikację niż te w równym tempie [14]. Druga strona medalu: badania Silverman i Barasch (*Journal of Consumer Research*, 2023) pokazują, że zerwana seria szczególnie demotywuje. Ludzie przywiązują się do samej serii bardziej niż do celu. Autorki radzą nie eksponować zerwanej serii [15]. Lally i wsp. (2010) z kolei ustalili, że budowanie nawyku trwa średnio 66 dni (od 18 do 254), a **jeden opuszczony dzień nie szkodzi tworzeniu nawyku** [16]. Codzienna seria karze więc za coś, co dla nawyku nie ma znaczenia.

**Gamifikacja i teoria autodeterminacji [MOCNE, z zastrzeżeniami].** Metaanaliza Sailera i Homnera (2020) znalazła małe pozytywne efekty: poznawcze g = 0,49, motywacyjne g = 0,36, behawioralne g = 0,25. Tylko efekt poznawczy utrzymał się w najrzetelniejszych badaniach [17]. Sailer i wsp. (2017) ustalili, że odznaki, tabele wyników i wykresy postępu wzmacniają poczucie kompetencji, a fabuła i awatary poczucie więzi. Na autonomię nie wpłynął żaden element [18]. Hanus i Fox (2015) pokazali, że obowiązkowe odznaki z rankingiem w kursie obniżyły motywację wewnętrzną, satysfakcję i wynik egzaminu [19]. Metaanaliza Deciego, Koestnera i Ryana (1999): oczekiwane nagrody rzeczowe obniżają motywację wewnętrzną (d = −0,34, a przy nagrodzie „za samo zajęcie się” d = −0,40), a słowna informacja zwrotna ją podnosi (d = +0,33, choć u dzieci efekt był nieistotny) [20]. **Wniosek:** dla Borysa lepszy jest pokazywany postęp i kompetencja („opanowałeś 42 karty z chemii”) niż punkty za samo wejście. Bez rankingów z innymi.

**Powiadomienia [UMIARKOWANE].** Algorytm Duolingo dobierający treść przypomnień dał skromne +0,5% dziennych użytkowników i +2,2% retencji nowych osób w 1. dniu. Kluczowe było to, że **ten sam komunikat powtarzany codziennie się „zużywa”**, a nowość działa lepiej [21]. Jedno przypomnienie dziennie o stałej porze, z rotowaną treścią.

**Strefa kciuka i cele dotykowe [PRAKTYKA].** Hoober obserwował 1333 sytuacje: 49% trzymało telefon jedną ręką, 36% w dłoni z obsługą kciukiem drugiej ręki, 15% oburącz. Autor sam później zastrzegł, że jego rysunki zasięgu kciuka były niedokładne [22]. Ważne akcje warto więc dawać w dolnej połowie ekranu, ale nie zakładać jednej ręki. WCAG 2.2 (2.5.8, AA) wymaga celów co najmniej 24×24 px i zaleca dążenie do ostrzejszego 2.5.5 (44×44 px) dla ważnych przycisków [23].

**Czcionka [PRAKTYKA].** Atkinson Hyperlegible (Braille Institute) wyraźnie rozróżnia mylone znaki (I/l/1, O/0). Wersja „Next” obsługuje 150 języków i 7 grubości [24]. Nie znalazłem recenzowanego badania z wynikami. Braille Institute zapowiadał badanie ilościowe na konferencji CSUN 2024, ale bez opublikowanych danych [25]. To rozsądny wybór, nie udowodniony. Polskie znaki trzeba sprawdzić przed wdrożeniem.

## 3. Czego uczyć się od innych aplikacji

- **Duolingo:** jedna ścieżka, krótkie lekcje, seria z zamrożeniem, rotowane powiadomienia (dane wyżej [13][14][21]). Model powtórek opisali Settles i Meeder (ACL 2016) [26]. **[UMIARKOWANE]**
- **Anki (FSRS):** algorytm FSRS według dokumentacji Anki daje tę samą zapamiętywalność przy mniejszej liczbie powtórek niż SM-2. Użytkownik ustawia docelowy poziom zapamiętania, np. 90% [27]. To dobry kierunek dla silnika BorBana. **[PRAKTYKA/benchmark]**
- **Khan Academy:** w randomizowanym badaniu w Tennessee (ok. 6900 uczniów) efekt wyniósł 0,06–0,08 SD rocznie, a „uczniowie rzadko korzystali z tutora AI” (Khanmigo). Nauka do opanowania (mastery) dała 0,12–0,22 SD. Źródło to blog firmy, więc ton jest promocyjny [28]. Lekcja: postęp liczony w opanowanych umiejętnościach, a AI jako pomoc w tle, nie główna funkcja. **[UMIARKOWANE]**
- **Quizlet, Brainly:** nie znalazłem rzetelnych publicznych badań skuteczności ani case study z liczbami. Brainly (gotowe odpowiedzi) nie jest wzorcem dla nauki.

## 4. Rekomendacje dla BorBana

### Palety (kontrast obliczony wzorem WCAG)

**A. „Arsenal poprawnie” (jasny, domyślny)**
| Rola | Hex | Kontrast |
|---|---|---|
| Tło | #F7F7F5 | – |
| Tekst główny (granat Arsenalu) | #063672 | 11,0:1 na tle |
| Marka i przycisk główny (biały tekst) | #DB0007 | 5,2:1 (oryginał #EF0107: 4,49, za mało) |
| Złoto: tylko ikony i ozdoby | #9C824A | 3,7:1 (nie na tekst) |
| Złoto: tekst | #7A6434 | 5,7:1 |
| „Umiem” (+ ikona ✓) | #0F766E | 5,5:1 |
| „Do powtórki” (+ ikona ↻) | #B45309 | 5,0:1 |
| Tekst drugorzędny | #64748B | 4,8:1 |

Czerwień oznacza tu „Arsenal i start”, a nigdy „błąd”. Błędna odpowiedź to bursztynowe „Jeszcze raz ↻”, bez czerwieni i bez ✗.

**B. „Spokojny” (neutralny, bez czerwieni)**: tło #F8FAFC, tekst #1E293B (14,0:1), przycisk #1D4ED8 z białym tekstem (6,7:1), „umiem” #15803D (5,0:1), „do powtórki” #C2410C (5,2:1), akcent nagród #6D28D9 (7,1:1). Przypomnienie: tezy, że niebieski „poprawia skupienie”, nie potwierdzono.

**C. „Arsenal nocny” (tryb ciemny)**: tło #0B1220, tekst #F1F5F9 (17,1:1), marka #FF4D5A (5,8:1; na przycisku ciemny tekst #0B1220), złoto #F2C14E (11,2:1), „umiem” #5EEAD4 (12,7:1), „do powtórki” #FDBA74 (11,1:1), drugorzędny #94A3B8 (7,3:1).

Najlepiej dać Borysowi wybór motywu (A/C, opcjonalnie B), bo wybór wzmacnia poczucie autonomii, której gamifikacja zwykle nie daje [18].

### Hierarchia ekranu „Dziś” (od góry)
1. **Krótkie powitanie i łagodny wskaźnik tygodnia**, np. „3 z 5 dni w tym tygodniu” zamiast codziennej serii.
2. **Jedna duża karta-przycisk: „Szybka runda · 5 kart”** w dolnej połowie ekranu, przycisk co najmniej 48–56 px wysokości. Napis „2 minuty” warto zamienić na „krótka runda”, żeby nie łamać zasady „minuty widzi tylko rodzic”. Jeśli zostaje, to wyłącznie jako szacunek, nigdy jako licznik.
3. **Jedna linijka kontekstu:** „Sprawdzian z matmy w poniedziałek: ta runda pomaga”. Uczeń myślący dosłownie dostaje jasne „po co”.
4. **Po skończeniu rundy** (progresywne ujawnianie): „Gotowe ✓. Chcesz jeszcze jedną?” i dopiero wtedy reszta.

### Co usunąć lub schować
- Kafelki „do zrobienia” włączyć w główną kartę, bo dziś konkurują z nią o uwagę [8][10].
- Plan tygodnia przenieść tylko do zakładki „Plan”.
- Notatkę z lekcji (zdjęcie zeszytu) zamienić na mały przycisk „+ Dodaj notatkę” albo pozycję w „Plan”, bo to akcja okazjonalna.
- Żadnych komunikatów „Straciłeś serię”, rankingów ani minut u ucznia [15][19].

### Co dodać
- **Automatyczne zamrożenie serii** (1–2 dni w tygodniu bez kary) i seria tygodniowa zamiast dziennej [14][16].
- **Postęp jako kompetencja:** w „Mapie” karty „opanowane”, „w drodze” i „nowe”, kolorami z ikonami [18][20].
- **Konkretna pochwała słowna** po rundzie („3 nowe wzory opanowane”) zamiast punktów za wejście [20].
- **Jedno powiadomienie dziennie**, z rotowaną treścią w stylu gier, o porze ustawionej przez rodzica [21].
- **Atkinson Hyperlegible Next** jako czcionka (po sprawdzeniu polskich znaków), tekst kart co najmniej 18 px [7][24].
- **Silnik powtórek z docelowym poziomem zapamiętania** (np. FSRS), żeby runda zawsze miała sensowne 5 kart [27].

## Źródła
1. Research On The Color Red Shows Definite Impact On Achievement (ScienceDaily, Elliot i wsp. 2007): https://sciencedaily.com/releases/2007/02/070228170240.htm
2. Gnambs (2020), Limited evidence for the effect of red color on cognitive performance: A meta-analysis: https://link.springer.com/article/10.3758/s13423-020-01772-1
3. Failure to Replicate the Mehta and Zhu (2009) Color Effect (APS): https://www.psychologicalscience.org/video/failure-to-replicate-the-mehta-and-zhu-2009-color-effect.html
4. Tufts Journal o Rutchick, Slepian i wsp. (2010), red pen: https://tuftsjournal.tufts.edu/2010/06_1/features/04/
5. WCAG 2.2 Understanding 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
6. WCAG 2.2 Understanding 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
7. NN/g, Dark Mode vs. Light Mode: https://www.nngroup.com/articles/dark-mode/
8. Irrational Labs, How We Doubled Headspace Course Starts: https://irrationallabs.com/case-studies/headspace-doubled-course-starts/
9. Headspace, Refreshed Today Tab Experience (June 2026): https://help.headspace.com/hc/en-us/articles/51443842967195-Refreshed-Today-Tab-Experience-June-2026
10. Maloy i wsp. (2019), Seductive Details in the Flipped Classroom (cytuje metaanalizę Rey 2012): https://pmc.ncbi.nlm.nih.gov/articles/PMC6755318
11. Cepeda i wsp. (2006), Distributed practice in verbal recall tasks: https://pubmed.ncbi.nlm.nih.gov/16719566/
12. Adesope, Trevisan, Sundararajan (2017), Rethinking the Use of Tests: https://journals.sagepub.com/doi/10.3102/0034654316689306
13. Duolingo Blog, Improving the streak: https://blog.duolingo.com/improving-the-streak
14. Duolingo Blog, How streaks keep Duolingo learners committed: https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/
15. University of Delaware, Lerner Professor Researches How Streaks Motivate Us (Silverman i Barasch): https://lerner.udel.edu/seeing-opportunity/lerner-professor-researches-how-streaks-motivate-us/
16. How Long To Form A Habit? (PsyBlog o Lally i wsp.): https://www.spring.org.uk/?p=107834
17. Sailer i Homner (2020), The gamification of learning: a meta-analysis: https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/index/index/docId/109056
18. Sailer i wsp. (2017), How gamification motivates: https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/index/index/docId/109059
19. Hanus i Fox (2015), Assessing the effects of gamification in the classroom (omówienie UCLA): https://www.smhp.psych.ucla.edu/pdfdocs/gamil.pdf
20. Deci, Koestner, Ryan (1999), meta-analysis of extrinsic rewards: https://leeds-faculty.colorado.edu/dahe7472/deci%201999.pdf
21. Yancey i Settles (2020), A Sleeping, Recovering Bandit Algorithm for Optimizing Recurring Notifications: https://research.duolingo.com/papers/yancey.kdd20.pdf
22. Hoober (2013), How Do Users Really Hold Mobile Devices?: https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php
23. WCAG 2.2 Understanding 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
24. Adobe Fonts, Atkinson Hyperlegible Next: https://fonts.adobe.com/fonts/atkinson-hyperlegible-next
25. CSUN 2024, sesja Braille Institute o Atkinson Hyperlegible: https://www.csun.edu/cod/conference/sessions/2024/index.php/public/presentations/view/3108.html
26. Duolingo Research (Settles i Meeder 2016 i inne): https://research.duolingo.com/
27. Anki Manual, What spaced repetition algorithm does Anki use?: https://docs.ankiweb.net/faqs/what-spaced-repetition-algorithm.md
28. Khan Academy Blog, Multiple Studies Show Khan Academy Drives Learning Gains: https://blog.khanacademy.org/multiple-studies-show-khan-academy-drives-learning-gains-evidence-for-our-platforms-effectiveness
29. Kody kolorów Arsenalu (#EF0107, #063672, #9C824A): https://teamcolorcodes.com/arsenal-color-codes/

## Dopisek 25.10: zaangażowanie w Duolingo i podobnych aplikacjach – wnioski dla BorBana

Co pokazują dane (szczegóły i źródła w osobnym raporcie z badania Duolingo i Quizletu):
- Duolingo jako główny wskaźnik traktuje retencję obecnych użytkowników (kto wczoraj się uczył, czy dziś wraca): +21% w 4 lata, DAU ×4,5; wpływ na DAU ok. 5× większy niż inne wskaźniki (Lenny's Newsletter, J. Mazal).
- Seria: 1 lekcja dziennie wystarcza (oddzielona od celu dziennego) – +40% osób z serią 7+ dni, +3,3% retencji D14 (blog Duolingo). Wolny weekend bez utraty serii: +4% powrotów po tygodniu (blog Duolingo).
- Ligi: +17% czasu nauki, ×3 bardzo zaangażowanych – ale niezależne badanie (arXiv 2203.16175) pokazuje grę pod punkty, oszukiwanie, lęk i porzucanie po stracie serii.
- Powiadomienia: ten sam komunikat traci siłę; rotacja treści (KDD 2020, +0,5% DAU, +2% retencji nowych).
- Zaangażowanie ≠ nauka: Duolingo wprowadziło „czas dobrze spędzony na nauce”; krótsze lekcje szkodziły.
- Anki (studenci medycyny): 88% widzi korzyść, 82% czuje się przytłoczonych zaległościami.

Wnioski dla BorBana:
1. Mierzyć powroty (odsetek dni z nauką, powrót dzień po dniu), nie minuty – wskaźnik dla rodzica.
2. Próg dnia = 1 runda (5 kart); wolne dni bez kary; seria tygodniowa zamiast dziennej.
3. Bez rankingów z innymi uczniami (ewentualnie tylko opcjonalnie).
4. Nagradzać trudność i opanowanie (wpisana poprawna odpowiedź, opanowane karty), nie samą ilość.
5. Najwyżej 1 powiadomienie dziennie, z rotowaną treścią, o porze ustalonej z Borysem.
6. Nie przytłaczać kolejką: limit nowych kart, krótkie rundy, zaległości rozkładane.
