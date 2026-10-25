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
| `supabase/` | migracje bazy i funkcja serwerowa `read-notebook` |
| `tests/` | testy sprawdzania odpowiedzi i ekranu (CI) oraz symulacja 50 uczniów |
| `docs/` | dla programisty, plan Fazy 1, architektura, oszczędność danych, standard kart, decyzje, bezpieczeństwo, proces pracy |

**Programista zaczyna od `docs/DLA-PROGRAMISTY.md`**, potem `docs/PLAN-FAZA-1.md`. Historia zmian: `CHANGELOG.md`.

```bash
python3 -m http.server 8080                 # aplikacja lokalnie (uwaga: łączy się z produkcyjną bazą do etapu E0)
cd tests && npm install && npx playwright install chromium && npm test
```

## Zasada nadrzędna
Dane osobowe dzieci (oceny, postępy, sprawdziany, zrzuty z Librusa) są wyłącznie w bazie, nigdy w repozytorium.
