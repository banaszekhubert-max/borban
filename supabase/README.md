# Baza danych (Supabase)

- `migrations/`: wszystkie zmiany schematu po kolei. Pierwsza (`20261017000001_borban_v2.sql`) została uruchomiona 17.10.2026.
- Projekt schematu docelowego (biblioteka wspólna, dzieci, opiekunowie, linia produkcyjna materiału): `docs/schemat-docelowy.sql`.
- Klucze: w aplikacji tylko publishable. Klucz `service_role` i hasło do bazy nie trafiają do repozytorium.
