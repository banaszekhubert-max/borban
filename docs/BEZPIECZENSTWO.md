# Bezpieczeństwo i dane dziecka

## Zasady stałe
- **Sekrety:** klucz `service_role` i hasło do bazy nigdy nie trafiają do kodu, repozytorium, czatu ani plików przesyłanych dalej. W aplikacji jest tylko klucz publishable (`config.js`), a dostęp chroni RLS.
- **Dane osobowe** (oceny, postępy, sesje, sprawdziany, zrzuty z Librusa, e-maile) są wyłącznie w bazie. Walidator odrzuca je w bibliotece materiału.
- **Zrzuty i zdjęcia od rodziców** kasujemy po przetworzeniu na karty.
- **Obrazki SVG** z paczek przechodzą sanitizację w aplikacji (bez skryptów, zdarzeń i linków zewnętrznych) i walidację przed wczytaniem.
- **Uprawnienia (RLS):** rodzic zapisuje materiał swojej rodziny, dziecko tylko swoje postępy, sesje, cele i zgłoszenia.
- **Hasła do BorBana:** każde konto może zmienić swoje hasło (menu konta) i odzyskać je linkiem e-mailem („Nie pamiętam hasła”). Rodzic może ustawić nowe hasło tylko kontu ucznia ze swojej rodziny; robi to funkcja `konta` na serwerze, która sprawdza rodzinę i rolę. Minimum 8 znaków. Claude nigdy nie wpisuje ani nie zmienia haseł za użytkownika i nie dostaje ich na czat.
- **Konsola kont:** lista wszystkich kont (e-mail, rola, rodzina, daty założenia, logowania i ostatniego zapisu) widzi tylko administrator z sekretu `BORBAN_ADMINS`. Pobrany plik CSV zawiera e-maile, więc trzymamy go poza repozytorium i nie wysyłamy dalej.
- **E-maile z Supabase:** wbudowana poczta Supabase ma niski limit i może nie dostarczać na adresy spoza zespołu projektu. Przed pilotażem trzeba podpiąć własny serwer poczty (SMTP); do tego czasu uczniom hasło ustawia rodzic.

## Źródła danych
- Do Librusa nie logujemy się i nie przechowujemy haseł. Oświadczenie rodzica o udostępnieniu konta nie zmienia regulaminu szkoły ani obowiązków firmy z RODO, więc tego modelu nie stosujemy.
- Wtyczka w przeglądarce rodzica pobiera tylko oceny i terminarz jego dziecka (minimalizacja). Wiadomości, uwagi i dane innych osób nie są odczytywane.
- Potwierdzenia rodzica (odczyt notatki, dział, import ocen) są zapisywane w dzienniku z wersją treści i czasem.

## Do zrobienia przed pilotażem
- Prawnik: model wtyczki do Librusa, treść zgody rodzica, zakres usługi przy nieczytelnych zdjęciach („nie odtwarzamy, oznaczamy”), dziennik potwierdzeń.
- Repozytorium prywatne.
- Kopie zapasowe: codzienny backup bazy (płatny plan Supabase) + cotygodniowy eksport poza Supabase.
- Testy zasad RLS (czy dziecko na pewno nie zmieni materiału, czy rodzina A nie widzi rodziny B).
- Umowa konsumencka, zgody (w tym marketingowe), informacja RODO o danych dziecka; wzory do sprawdzenia przez prawnika.
- Rejestr, kto z firmy ma dostęp do danych której rodziny (opiekunowie).
- Plany Vercel i Supabase na wersje płatne przy pierwszym płacącym kliencie.
