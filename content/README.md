# Biblioteka materiału

Jeden plik na przedmiot w `library/`, format `borban-pack-1` (`pack.schema.json`), tylko pełne rekordy: przedmioty, działy, karty. Bez danych osobowych (sprawdziany, oceny i postępy są wyłącznie w bazie).

Obecna zawartość to materiał 1 klasy technikum (wrzesień–listopad 2026): 13 przedmiotów, 40 działów, 360 kart, wszystkie z obrazkiem w stylu „Naklejki”, 174 z 3 krokami wyjaśnienia. Standard: `docs/STANDARD-KART.md`.

Paczka do wczytania w aplikacji: `python3 tools/build_pack.py content/library/*.json -o paczka.json`.
