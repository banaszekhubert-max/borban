#!/usr/bin/env python3
"""Automatyczne reguły na logach symulowanych uczniów -> raport/automat.md + digest per uczeń (digest/uczen-XX.txt)."""
import json, glob, os, collections
LOGS = os.environ.get("LOGS", "logs"); DIG = os.environ.get("DIG", "digest"); AOUT = os.environ.get("AOUT", "automat.md"); VOUT = os.environ.get("VOUT", "liczby.json")
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "wyniki")
os.makedirs(f"{D}/{DIG}", exist_ok=True); os.makedirs(f"{D}/raport", exist_ok=True)
G = collections.Counter(); ex = collections.defaultdict(list)
def add(k, n, x):
    G[k] += 1
    if len(ex[k]) < 12: ex[k].append(f"u{n:02d}: {x}")
for f in sorted(glob.glob(f"{D}/{LOGS}/uczen-*.json")):
    n = int(f[-7:-5]); log = json.load(open(f)); p = log[0]
    lines = [f"PERSONA {json.dumps(p, ensure_ascii=False)}"]
    for x in log[1:]:
        t = x["t"]
        if t == "karta":
            ok = x["local"] in ("exact", "close"); ys = " ".join(x["yours"])[:220]
            aiyes = "Innymi słowami, ale o to chodzi" in ys
            b, a = (x["before"] or {}).get("run", 0), (x["after"] or {}).get("run", 0)
            miss = "To nie ta odpowiedź" in ys or "Nic się nie stało" in ys or "Prawie." in ys
            lines.append(f"d{x['day']} {x['kind']:7} {x['cid']:12} n{x['n']} [{x['bar']}] intent={x['intent']:7} typed={x['typed']!r:40.40} local={x['local'] or '-':5} aiYes={int(aiyes)} miss={int(miss)} btn={[g['g'] for g in x['grades'] if not g['off']]} klik={x['clicked']} run {b}->{a} | ans={x['answer'][:60]!r}")
            if x["typed"]:
                if x["intent"] == "ok" and not ok and not aiyes: add("odrzucona-dobra (intent ok, nie uznana)", n, f"{x['typed']!r} vs {x['answer']!r} local={x['local']} msg={ys[:120]}")
                if x["intent"] in ("wrong", "dk") and (ok or aiyes): add("uznana-zla (intent wrong/dk, uznana)", n, f"{x['typed']!r} vs {x['answer']!r} local={x['local']}")
                if x["intent"] == "partial" and x["local"] == "exact" and x["typed"].strip() != x["answer"].strip(): add("czesciowa-uznana-jako-pelna", n, f"{x['typed']!r} vs {x['answer']!r}")
            g = x["clicked"]
            exp = 0 if g == 0 else (b if miss else b + 1)
            if a != exp and not (b >= 3 and a >= 3) and not (g > 0 and not miss and b == 2 and a == 2): add("kropki-niezgodne-z-regula", n, f"{x['cid']} klik={g} miss={miss} run {b}->{a} oczek. {exp}")
            if x["overflow"] and x["overflow"] > 0: add("poziomy-scroll-na-karcie", n, f"{x['overflow']}px szer={p['width']}")
            if x["n"] > 6: add("karta->4-razy-w-sesji", n, f"{x['cid']} n={x['n']} {x['kind']}")
            if not x["grades"]: add("brak-przyciskow-oceny", n, x["cid"])
        elif t == "BLAD-KLIKNIECIA": add("blad-klikniecia", n, f"{x['what']} {x['err'][:160]}"); lines.append("!! " + json.dumps(x, ensure_ascii=False)[:300])
        elif t == "koniec-dnia":
            if x["mismatch"]: add("zapis!=pamiec", n, str(x["mismatch"][:5]))
            if x["errs"]: add("bledy-JS", n, str(x["errs"][:3]))
            if x["outbox"] not in (None, "{}", "[]"): add("niewyslane-w-skrzynce", n, x["outbox"][:100])
            lines.append(f"== koniec dnia {x['day']}: kart z postępem {x['nProg']}, opanowane {x['mastered']}, błędy {x['errs'][:2]}, nagłówek: {x['hdr']}")
        elif t == "dzien":
            if x.get("overflow", 0) > 0: add("poziomy-scroll-na-ekranie-glownym", n, f"{x['overflow']}px szer={p['width']}")
            lines.append(f"== DZIEŃ {x['day']} {x['today']} | {x['hdr']} | {x['hero'][:200]!r}")
        elif t == "start": lines.append(f"-- start {x['kind']} {x.get('id')} kolejka={x.get('q')} ok={x.get('ok')} {x.get('err','')}")
        elif t == "koniec-sesji": lines.append(f"-- koniec {x['kind']}: {(x.get('done') or '')[:220]!r}")
        else: lines.append(f"-- {t} {json.dumps(x, ensure_ascii=False)[:200]}")
    open(f"{D}/{DIG}/uczen-{n:02d}.txt", "w").write("\n".join(lines))
for f in glob.glob(f"{D}/{LOGS}/*.AWARIA.txt"): add("AWARIA-symulacji", int(os.path.basename(f)[6:8]), open(f).read()[:300])
out = ["# Reguły automatyczne (50 uczniów)\n"] + [f"## {k}: {v}\n" + "\n".join("- " + e for e in ex[k]) + "\n" for k, v in G.most_common()]
open(f"{D}/raport/{AOUT}", "w").write("\n".join(out)); print("\n".join(out)[:6000])
