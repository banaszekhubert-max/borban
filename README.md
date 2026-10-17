# BorBan

Aplikacja do systematycznej nauki na materiale z prawdziwej szkoły dziecka: fiszki z powtórkami, obrazki i wyjaśnienia krok po kroku, plan pod sprawdziany, panel rodzica z postępami i ocenami.

- Aplikacja: https://borban.vercel.app (PWA, działa na telefonie i komputerze)
- Stos: statyczna aplikacja na Vercel + Supabase (logowanie, Postgres z RLS, realtime)

## Gdzie co jest
| Folder | Zawartość |
|---|---|
| `/` | aplikacja: `index.html`, `config.js` (tylko klucz publishable), manifest, ikony, `vercel.json` |
| `content/` | biblioteka materiału (plik na przedmiot) i kontrakt formatu paczki |
| `tools/` | walidator paczek, składanie paczki, galeria do przeglądu |
| `supabase/` | migracje bazy |
| `docs/` | architektura i droga do skali, standard kart, decyzje, bezpieczeństwo, proces pracy |

Zacznij od `docs/ARCHITEKTURA.md`.

## Zasada nadrzędna
Dane osobowe dzieci (oceny, postępy, sprawdziany, zrzuty z Librusa) są wyłącznie w bazie, nigdy w repozytorium.
