# Standard karty BorBana i styl obrazków „Naklejki”

Standard powstał na pierwszym uczniu (1 klasa technikum programistycznego): dziecko, które myśli dosłownie, słabo zapamiętuje nazwy i fakty, a dobrze zapamiętuje obrazy. Te zasady pomagają też innym dzieciom, więc obowiązują dla całej biblioteki.

Profil ucznia (zainteresowania do przykładów, np. gry, programowanie, sport) przekazujemy osobno przy przygotowaniu materiału dla konkretnego dziecka; nie zapisujemy go w repozytorium.

## Styl obrazków (WYBRANY: C „Naklejki”)
- Tło: prostokąt na całą powierzchnię z rx="16", pastelowy kolor (np. #fff4d6, #e8f1ff, #e6f8ee, #f3e8ff, #ffe4e6, #fef3c7).
- Każdy główny obiekt jak naklejka: najpierw ta sama ścieżka białym obrysem (stroke="#fff", stroke-width o 6–8 większy), na niej obiekt z konturem #1d2433 (stroke-width 2.5–3), mocne płaskie kolory.
- Opcjonalny cień: kopia kształtu przesunięta transform="translate(3 4)", fill #1d2433, opacity .15, pod spodem.
- Paleta: kontur #1d2433; czerwony #ef4444; niebieski #3b82f6 / #60a5fa; żółty #fde047; zielony #34d399; szary #9ca3af / #cbd5e1; fiolet #a78bfa; pomarańcz #fb923c; róż #f472b6; brąz #b45309.
- Proste, czytelne kształty, duże elementy (ma być czytelne na telefonie ~340 px szerokości). Wolno dodać sympatyczne miny przedmiotom (jak chmurka w przykładzie), ale z umiarem.
- Bez znaków towarowych i logo (np. nie rysuj logo Gita czy GitHuba, flagi państw wolno), bez postaci z filmów/gier, bez kopiowania ilustracji z podręczników. Ludzie i postacie historyczne/mityczne: uproszczone, symboliczne (sylwetka, atrybut), bez twarzy realistycznych.
- Przykłady w tym stylu (wzoruj się na nich):

<svg viewBox="0 0 200 130" role="img" aria-label="Naklejka z fabryką i chmurą dymu">
<rect width="200" height="130" rx="16" fill="#fff4d6"/>
<g transform="translate(3 4)" fill="#1d2433" opacity=".15"><path d="M44 112 V76 L68 62 V76 L92 62 V76 L116 62 V76 H156 V112 Z"/><circle cx="100" cy="30" r="22"/><circle cx="128" cy="34" r="18"/></g>
<g stroke="#fff" stroke-width="10" stroke-linejoin="round" fill="#fff"><path d="M44 112 V76 L68 62 V76 L92 62 V76 L116 62 V76 H156 V112 Z"/><path d="M128 76 V44 H142 V76"/><circle cx="100" cy="30" r="22"/><circle cx="128" cy="34" r="18"/><circle cx="80" cy="36" r="14"/></g>
<g stroke="#1d2433" stroke-width="3" stroke-linejoin="round"><path d="M128 76 V44 H142 V76" fill="#ef4444"/><path d="M44 112 V76 L68 62 V76 L92 62 V76 L116 62 V76 H156 V112 Z" fill="#60a5fa"/><path d="M80 36 a14 14 0 0 1 4 -27 a22 22 0 0 1 40 6 a18 18 0 1 1 4 37 H86 a14 14 0 0 1 -6 -16 z" fill="#9ca3af"/></g>
<g fill="#fde047" stroke="#1d2433" stroke-width="2.5"><rect x="58" y="88" width="14" height="12" rx="2"/><rect x="82" y="88" width="14" height="12" rx="2"/><rect x="106" y="88" width="14" height="12" rx="2"/></g>
<path d="M92 28 q4 -4 8 0 M110 30 q4 -4 8 0" stroke="#1d2433" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M100 40 q4 -4 8 0" stroke="#1d2433" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>

<svg viewBox="0 0 200 130" role="img" aria-label="Naklejka z atomem">
<rect width="200" height="130" rx="16" fill="#e8f1ff"/>
<g fill="none" stroke="#fff" stroke-width="11"><ellipse cx="100" cy="65" rx="68" ry="22"/><ellipse cx="100" cy="65" rx="68" ry="22" transform="rotate(60 100 65)"/><ellipse cx="100" cy="65" rx="68" ry="22" transform="rotate(-60 100 65)"/></g>
<g fill="none" stroke="#1d2433" stroke-width="3"><ellipse cx="100" cy="65" rx="68" ry="22"/><ellipse cx="100" cy="65" rx="68" ry="22" transform="rotate(60 100 65)"/><ellipse cx="100" cy="65" rx="68" ry="22" transform="rotate(-60 100 65)"/></g>
<circle cx="100" cy="65" r="20" fill="#fff"/>
<g stroke="#1d2433" stroke-width="2.5"><circle cx="93" cy="59" r="7" fill="#ef4444"/><circle cx="107" cy="59" r="7" fill="#cbd5e1"/><circle cx="100" cy="71" r="7" fill="#ef4444"/></g>
<g stroke="#1d2433" stroke-width="2.5" fill="#3b82f6"><circle cx="168" cy="65" r="7"/><circle cx="66" cy="36" r="7"/><circle cx="134" cy="94" r="7"/></g>
<path d="M95 57 l2 2 M109 57 l2 2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
</svg>

<svg viewBox="0 0 200 130" role="img" aria-label="Naklejka z labiryntem i kłębkiem czerwonej nici">
<rect width="200" height="130" rx="16" fill="#e6f8ee"/>
<g fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="#fff" stroke-width="16"><path d="M40 20 H160 V110 H40 V45"/><path d="M65 45 H135 V85 H65 V65 H110"/></g><g stroke="#1d2433" stroke-width="10"><path d="M40 20 H160 V110 H40 V45"/><path d="M65 45 H135 V85 H65 V65 H110"/></g><g stroke="#34d399" stroke-width="5"><path d="M40 20 H160 V110 H40 V45"/><path d="M65 45 H135 V85 H65 V65 H110"/></g></g>
<path d="M26 32 H52 V97 H148 V56 H122 V75" fill="none" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="20" cy="32" r="12" fill="#ef4444" stroke="#1d2433" stroke-width="3"/><path d="M12 28 q8 8 16 0 M12 36 q8 -8 16 0" stroke="#fff" stroke-width="2" fill="none"/>
<path d="M122 66 l2.6 5.3 5.8 .8 -4.2 4.1 1 5.8 -5.2 -2.7 -5.2 2.7 1 -5.8 -4.2 -4.1 5.8 -.8 z" fill="#fde047" stroke="#1d2433" stroke-width="2"/>
</svg>

## Wymagania techniczne SVG (sprawdza je tools/validate_pack.py)
- Element główny: <svg xmlns="http://www.w3.org/2000/svg" viewBox="..."> bez width/height.
  - Karta: viewBox="0 0 200 130", najwyżej 3500 znaków.
  - Dział: viewBox="0 0 320 200", najwyżej 7000 znaków.
- Dozwolone: g, path, rect, circle, ellipse, line, polyline, polygon, text, tspan, defs, linearGradient, radialGradient, stop, clipPath, filter z feGaussianBlur/feOffset/feMerge.
- Zakazane: script, style, image, use, a, foreignObject, animate, set; atrybuty on*, href; url(...) tylko do #id wewnątrz tego samego SVG.
- Każde id w SVG zaczynaj od id dokumentu, np. id="k_a1_06a-g1", żeby się nie gryzły na stronie.
- TEKST: aplikacja ma CSS, który nadpisuje atrybuty fill/font-size w <text>. Kolor, rozmiar i grubość tekstu podawaj WYŁĄCZNIE w style, np. style="font:700 13px system-ui,sans-serif;fill:#1d2433". Wyśrodkowanie: text-anchor="middle" (atrybut działa).
- Obrazek KARTY jest widoczny przed odpowiedzią, więc NIE MOŻE zdradzać odpowiedzi: żadnego tekstu z odpowiedzią (ani jej tłumaczenia, pinyin, liczby-wyniku). Najlepiej karty bez słów; dozwolone neutralne symbole (np. CO₂, +, ?, strzałki), jeśli nie są odpowiedzią. Obrazek ma kojarzyć się z pytaniem i pomagać zapamiętać odpowiedź.
- Obrazek DZIAŁU jest pokazywany po odpowiedzi: to schemat całego działu, może mieć krótkie polskie podpisy (max ok. 8 podpisów, czcionka ≥ 11px).

## Standard treści karty (pola dodatkowe)
- svg: obrazek (patrz wyżej). Karty słówek (type vocab) mają pary …a/…b: oba id dostają TEN SAM obrazek. Dla małych symboli dodaj "svgSize":"sm".
- Pojęcia, definicje, „co znaczy”, „na czym polega”, „dlaczego”, „jak obliczyć”: dodaj 3 kroki:
  - lit (≤ 300 znaków): „Skąd to się wzięło”: konkretnie, dosłownie, co się dzieje/działo (mit, zjawisko, mechanizm).
  - why (≤ 200): „Dlaczego tak jest”: jedno zdanie, które wprost łączy krok 1 z odpowiedzią. Bez czytania między wierszami.
  - ex (≤ 240): „Przykład z życia” z jego świata (programowanie, gry, telefon, szkoła, dom), najlepiej w formie zdania, które mógłby napisać na sprawdzianie; przy obliczeniach: krótki rozwiązany przykład.
  - tpl (opcjonalnie): wzór zdania na sprawdzian, np. "[sytuacja] to [związek], bo [znaczenie]".
  - who (opcjonalnie, ≤ 70): jedna linijka „kim był X”, gdy pytanie zawiera imię, które może być niezrozumiałe.
- Czyste fakty (imiona, daty, liczby, słówka, tłumaczenia): tylko svg, bez kroków.
- Wszystko po polsku, poziom 1 klasy liceum/technikum, zgodnie z polską podstawą programową. FAKTY MUSZĄ BYĆ POPRAWNE: jeśli nie masz pewności, uprość, zamiast zgadywać. Nie zmieniaj pytania ani odpowiedzi karty.
- Jeśli karta ma już lit/why/ex (frazeologizmy), zostaw je bez zmian, tylko narysuj nowy obrazek.

## Proces dla każdej nowej porcji materiału
1. Szkic kart (AI albo ręcznie) w formacie `borban-pack-1`, jeden plik na przedmiot w `content/library/` albo osobna paczka dla rodziny.
2. `python3 tools/validate_pack.py <pliki>`: zero błędów.
3. `python3 tools/build_gallery.py <pliki> -o galeria.html`: przegląd przez człowieka (fakty, czytelność obrazków, czy obrazek nie zdradza odpowiedzi).
4. `python3 tools/build_pack.py <pliki> -o paczka.json` → w aplikacji: Materiał → „Paczka od Claude”.
