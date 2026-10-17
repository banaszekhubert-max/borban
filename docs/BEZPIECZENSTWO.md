# Bezpieczeństwo i dane dziecka

## Zasady stałe
- **Sekrety:** klucz `service_role` i hasło do bazy nigdy nie trafiają do kodu, repozytorium, czatu ani plików przesyłanych dalej. W aplikacji jest tylko klucz publishable (`config.js`), a dostęp chroni RLS.
- **Dane osobowe** (oceny, postępy, sesje, sprawdziany, zrzuty z Librusa, e-maile) są wyłącznie w bazie. Walidator odrzuca je w bibliotece materiału.
- **Zrzuty i zdjęcia od rodziców** kasujemy po przetworzeniu na karty.
- **Obrazki SVG** z paczek przechodzą sanitizację w aplikacji (bez skryptów, zdarzeń i linków zewnętrznych) i walidację przed wczytaniem.
- **Uprawnienia (RLS):** rodzic zapisuje materiał swojej rodziny, dziecko tylko swoje postępy, sesje, cele i zgłoszenia.

## Do zrobienia przed pilotażem
- Repozytorium prywatne.
- Kopie zapasowe: codzienny backup bazy (płatny plan Supabase) + cotygodniowy eksport poza Supabase.
- Testy zasad RLS (czy dziecko na pewno nie zmieni materiału, czy rodzina A nie widzi rodziny B).
- Umowa konsumencka, zgody (w tym marketingowe), informacja RODO o danych dziecka; wzory do sprawdzenia przez prawnika.
- Rejestr, kto z firmy ma dostęp do danych której rodziny (opiekunowie).
- Plany Vercel i Supabase na wersje płatne przy pierwszym płacącym kliencie.
