#!/usr/bin/env python3
"""Walidator paczek BorBana (format borban-pack-1).

Użycie:
    python3 tools/validate_pack.py content/library/*.json
    python3 tools/validate_pack.py --personal paczka-z-ocenami.json   # paczka spoza biblioteki

Sprawdza:
  - format paczki i dozwolone kolekcje (biblioteka nie może zawierać danych osobowych),
  - pełne rekordy (karta ma front/type/unitId/subjectId, dział ma title/subjectId) — zasada z 17.10.2026,
  - spójność odwołań (karta → dział → przedmiot) w obrębie podanych plików,
  - obrazki SVG: poprawny XML, viewBox, limity rozmiaru, zakazane elementy i atrybuty,
    kolor tekstu tylko przez style, brak odpowiedzi w obrazku karty,
  - długość kroków lit/why/ex.
Kod wyjścia 1, gdy są błędy (używane w CI).
"""
import re
import json, re, sys
import xml.dom.minidom as M

LIBRARY_COLS = {"subjects", "units", "cards"}
PERSONAL_COLS = {"tests", "meta", "progress", "sessions", "woop", "flags"}
CARD_TYPES = {"qa", "cloze", "vocab"}
FORBID = {"script", "style", "image", "use", "a", "foreignObject", "animate", "set", "iframe"}
LIMITS = {"cards": 3500, "units": 7000}
STEP_LIMITS = {"lit": 300, "why": 200, "ex": 240, "who": 70}


def norm(s):
    return re.sub(r"\s+", " ", str(s or "").lower()).strip()


def answer_of(card):
    if card.get("type") == "cloze":
        return " ".join(re.findall(r"\{\{(.+?)\}\}", card.get("front", "")))
    return card.get("back", "")


def check_svg(doc_id, col, data, err):
    s = data.get("svg")
    if not s:
        return
    if len(s) > LIMITS.get(col, 7000):
        err(doc_id, f"svg za długie ({len(s)} > {LIMITS.get(col)})")
    if re.search(r"<\?|<!--|<!\[CDATA\[|<!DOCTYPE|<!ENTITY", s, re.I):
        err(doc_id, "svg: bez komentarzy, CDATA, DOCTYPE i instrukcji <?...?>")
    try:
        root = M.parseString(s).documentElement
    except Exception as e:
        err(doc_id, f"svg: błąd XML: {e}")
        return
    if root.tagName != "svg" or not root.getAttribute("viewBox"):
        err(doc_id, "svg: brak <svg viewBox>")
    if root.getAttribute("width") or root.getAttribute("height"):
        err(doc_id, "svg: usuń width/height")
    for el in root.getElementsByTagName("*"):
        if el.tagName in FORBID:
            err(doc_id, f"svg: zakazany element <{el.tagName}>")
        for k, v in el.attributes.items():
            if k.startswith("on") or k in ("href", "xlink:href"):
                err(doc_id, f"svg: zakazany atrybut {k}")
            if re.search(r"url\((?!#)", v) or "javascript:" in v.lower():
                err(doc_id, "svg: odwołanie zewnętrzne")
        if el.tagName == "text" and el.getAttribute("fill") and "fill" not in el.getAttribute("style"):
            err(doc_id, "svg: kolor tekstu tylko przez style=\"fill:...\"")
    if col == "cards":
        txt = norm(" ".join(t.firstChild.data for t in root.getElementsByTagName("text") + root.getElementsByTagName("tspan")
                            if t.firstChild and t.firstChild.nodeType == 3))
        for part in re.split(r"[,;/]| lub ", answer_of(data)):
            p = norm(re.sub(r"\(.*?\)", "", part))
            if len(p) >= 3 and p in txt:
                err(doc_id, f"obrazek karty zdradza odpowiedź: „{p}”")


def main(argv):
    personal = "--personal" in argv
    files = [a for a in argv if not a.startswith("--")]
    if not files:
        print(__doc__)
        return 2
    errors = []
    err = lambda i, m: errors.append(f"{cur}: {i}: {m}")
    all_docs = {}
    for cur in files:
        try:
            pk = json.load(open(cur, encoding="utf-8"))
        except Exception as e:
            errors.append(f"{cur}: nie da się wczytać JSON: {e}")
            continue
        if pk.get("format") != "borban-pack-1":
            err("-", "format musi być borban-pack-1")
        for d in pk.get("docs", []):
            col, i, data = d.get("col"), d.get("id"), d.get("data")
            if not i or not isinstance(data, dict):
                err(i, "brak id albo data")
                continue
            if not re.fullmatch(r"[A-Za-z0-9_.:-]{1,120}", str(i)):
                err(i, "id tylko z liter, cyfr i znaków _ . : - (aplikacja pominie inne)")
                continue
            if col in PERSONAL_COLS and not personal:
                err(i, f"kolekcja „{col}” to dane osobowe: nie należy do biblioteki")
                continue
            if col not in LIBRARY_COLS | PERSONAL_COLS:
                err(i, f"nieznana kolekcja „{col}”")
                continue
            if d.get("merge"):
                err(i, "biblioteka zawiera tylko pełne rekordy (bez merge)")
            if (col, i) in all_docs:
                err(i, "zdublowane id")
            all_docs[(col, i)] = (cur, data)
            if col == "subjects" and not data.get("name"):
                err(i, "przedmiot bez name")
            if col == "units":
                for k in ("title", "subjectId"):
                    if not data.get(k):
                        err(i, f"dział bez {k}")
            if col == "cards":
                for k in ("front", "type", "unitId", "subjectId"):
                    if not data.get(k):
                        err(i, f"karta bez {k}")
                if data.get("type") not in CARD_TYPES:
                    err(i, f"nieznany typ karty {data.get('type')}")
                if data.get("type") in ("qa", "vocab") and not data.get("back"):
                    err(i, "karta bez odpowiedzi (back)")
                if data.get("type") == "cloze" and "{{" not in data.get("front", ""):
                    err(i, "karta cloze bez {{luki}}")
                ans = norm(answer_of(data))
                if data.get("type") == "qa" and len(ans) >= 4 and ans in norm(data.get("front", "")):
                    err(i, f"pytanie zdradza odpowiedź „{answer_of(data)}”")
                for k, lim in STEP_LIMITS.items():
                    if len(data.get(k, "")) > lim:
                        err(i, f"{k} za długie ({len(data[k])} > {lim})")
            if col in ("cards", "units"):
                check_svg(i, col, data, err)
    for (col, i), (cur, data) in all_docs.items():
        if col == "cards":
            u = all_docs.get(("units", data.get("unitId")))
            ans = norm(answer_of(data))
            if u and len(ans) >= 4 and ans in norm(u[1].get("title", "")):
                print(f"uwaga: {i}: tytuł działu zawiera odpowiedź „{answer_of(data)}” (aplikacja ukrywa tytuł do odkrycia)")
        if col == "cards" and ("units", data.get("unitId")) not in all_docs:
            errors.append(f"{cur}: {i}: dział {data.get('unitId')} nie istnieje w podanych plikach")
        if col in ("cards", "units") and ("subjects", data.get("subjectId")) not in all_docs:
            errors.append(f"{cur}: {i}: przedmiot {data.get('subjectId')} nie istnieje w podanych plikach")
    n = collections_count(all_docs)
    print(f"Sprawdzono {len(files)} plików: {n}")
    if errors:
        print(f"BŁĘDY ({len(errors)}):")
        for e in errors:
            print("  " + e)
        return 1
    print("OK: brak błędów")
    return 0


def collections_count(all_docs):
    c = {}
    for col, _ in all_docs:
        c[col] = c.get(col, 0) + 1
    return ", ".join(f"{k}: {v}" for k, v in sorted(c.items()))


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
