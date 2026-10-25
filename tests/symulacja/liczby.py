#!/usr/bin/env python3
"""Liczby do schematu: uczciwi (1-25) vs kombinatorzy (51-75) na etapach drogi karty."""
import json, glob, os, collections, statistics
LOGS = os.environ.get("LOGS", "logs"); VOUT = os.environ.get("VOUT", "liczby.json")
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "wyniki")
H = dict(students=0, answers=0, typed=0, okTyped=0, okAccepted=0, okRejected=0, badTyped=0, badAccepted=0,
         dotUp=0, dotReset=0, hold=0, mastered=0, clickErr=0, jsErr=0, overflow=0, saveMismatch=0, partialOk=0)
ptsH, ptsC = [], collections.defaultdict(list)
C = collections.defaultdict(lambda: dict(students=0, tries=0, passed=0, note=""))
streaks = collections.defaultdict(list)
for f in sorted(glob.glob(f"{D}/{LOGS}/uczen-*.json")):
    log = json.load(open(f)); p = log[0]; cheat = p.get("cheat")
    if cheat: C[cheat]["students"] += 1
    else: H["students"] += 1
    for x in log[1:]:
        t = x["t"]
        if t == "karta":
            ys = " ".join(x["yours"]); acc = x["local"] in ("exact", "close") or "Innymi słowami, ale o to chodzi" in ys
            b, a = (x["before"] or {}).get("run", 0), (x["after"] or {}).get("run", 0)
            if not cheat:
                H["answers"] += 1
                if x["typed"]:
                    H["typed"] += 1
                    if x["intent"] == "ok":
                        H["okTyped"] += 1; H["okAccepted" if acc else "okRejected"] += 1
                    if x["intent"] in ("wrong", "dk"):
                        H["badTyped"] += 1; H["badAccepted"] += int(acc)
                if a > b: H["dotUp"] += 1
                if a == 0 and b > 0: H["dotReset"] += 1
                if a >= 3 > b: H["mastered"] += 1
                if x["overflow"] and x["overflow"] > 0: H["overflow"] += 1
            else:
                if cheat in ("smieci-i-wiem", "pytanie-jako-odpowiedz", "lista-wszystkiego", "wstrzykniecie-do-AI", "podpowiedz-jako-odpowiedz", "zawsze-wiem-bez-wpisu", "podglad-strony", "farma-punktow"):
                    C[cheat]["tries"] += 1
                    if cheat in ("zawsze-wiem-bez-wpisu", "farma-punktow", "podglad-strony"): C[cheat]["passed"] += int(a > b)
                    else: C[cheat]["passed"] += int(acc or (x["clicked"] == 2 and a > b))
        elif t == "BLAD-KLIKNIECIA" and not cheat: H["clickErr"] += 1
        elif t == "OSZUSTWO-przeladowanie-po-bledzie":
            C[cheat]["tries"] += 1; b = x["before"] or {}; r = x["afterReload"] or {}
            C[cheat]["passed"] += int((r.get("run", 0) == b.get("run", 0)) and b.get("run", 0) > 0 or (not b and not r))
        elif t == "OSZUSTWO-wyjscie-przed-ocena":
            C[cheat]["tries"] += 1; C[cheat]["passed"] += int((x["after"] or {}).get("run", 0) == (x["before"] or {}).get("run", 0))
        elif t == "OSZUSTWO-konsola":
            C[cheat]["tries"] += 1; C[cheat]["passed"] += int(bool(x.get("ok")))
        elif t == "OSZUSTWO-odpowiedz-widoczna-przed-odkryciem":
            C["podglad-strony"]["leakScreen"] = C["podglad-strony"].get("leakScreen", 0) + 1
        elif t == "koniec-dnia":
            if cheat: ptsC[cheat].append(x.get("points") or 0)
            else:
                ptsH.append(x.get("points") or 0); H["jsErr"] += len(x["errs"]); H["saveMismatch"] += len(x["mismatch"])
            if cheat == "cofanie-daty": streaks[p["id"]].append((x["day"], x.get("streak"), x.get("points")))
H["ptsMedian"] = statistics.median(ptsH) if ptsH else 0
for k, v in ptsC.items(): C[k]["ptsMedian"] = statistics.median(v) if v else 0
C["cofanie-daty"]["streaks"] = dict(streaks)
out = dict(honest=H, cheats=dict(C))
json.dump(out, open(f"{D}/{VOUT}", "w"), ensure_ascii=False, indent=1); print(json.dumps(out, ensure_ascii=False, indent=1))
