#!/usr/bin/env python3
"""Składa pliki biblioteki w jedną paczkę do wczytania w aplikacji (Materiał → „Paczka od Claude”).

Użycie:
    python3 tools/build_pack.py content/library/*.json -o paczka.json
    python3 tools/build_pack.py content/library/matematyka.json content/library/fizyka.json -o paczka-scisle.json
    python3 tools/build_pack.py --subjects content/library/*.json -o paczka-nowa-rodzina.json

Paczka zawsze zawiera pełne rekordy, więc wczytanie niczego nie skasuje. Przed złożeniem uruchamia walidator.
Przedmioty (subjects) są pomijane, bo w rodzinie trzymają też stan „tu jesteś” (pole current);
dodaj --subjects tylko przy zakładaniu nowej rodziny.
"""
import json, sys, subprocess, os

def main(argv):
    if "-o" not in argv:
        print(__doc__); return 2
    with_subjects = "--subjects" in argv
    argv = [a for a in argv if a != "--subjects"]
    i = argv.index("-o"); out = argv[i + 1]; files = argv[:i] + argv[i + 2:]
    here = os.path.dirname(os.path.abspath(__file__))
    if subprocess.call([sys.executable, os.path.join(here, "validate_pack.py"), *files]) != 0:
        print("Popraw błędy przed złożeniem paczki."); return 1
    docs = []
    for f in files:
        docs += [d for d in json.load(open(f, encoding="utf-8"))["docs"] if with_subjects or d["col"] != "subjects"]
    json.dump({"format": "borban-pack-1", "docs": docs}, open(out, "w", encoding="utf-8"), ensure_ascii=False)
    print(f"Zapisano {out}: {len(docs)} rekordów")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
