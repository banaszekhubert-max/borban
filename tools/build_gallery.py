#!/usr/bin/env python3
"""Galeria do przeglądu materiału przez człowieka (obrazki + 3 kroki), jeden plik HTML.

Użycie:
    python3 tools/build_gallery.py content/library/*.json -o galeria.html
"""
import json, sys, re, html

CSS = """.pic{--ink:#1d2433;--mute:#6b7385;--line:#d9dde8;--soft:#eef1f8;--card:#fff;--chem:#e0573a;--fiz:#2f7de1;--mat:#7a4fd6;--inf:#159a72;--p:#e0573a;--n:#8a93a6;--e:#2f7de1;--hl:#ffd54a;--pol:#c2410c;--his:#a16207;--gold:#f2b705;--sea:#2f7de1;--red:#d64545;--grn:#159a72;--vio:#7a4fd6;--dark:#3b3f4a;--acc:#c2410c;--bad:#d64545;--ok:#159a72;--fig:#7a4fd6;--lit:#2f7de1;
  background:var(--soft); border:1px solid var(--line); border-radius:14px; padding:6px; color:var(--ink)}
.pic svg{width:100%; height:auto; max-height:260px; display:block}
.pic text{fill:var(--ink); font:12px system-ui,sans-serif} .pic .m{fill:var(--mute)} .pic .b{font-weight:700} .pic .c{text-anchor:middle} .pic .s{font-size:10px}
.pic .line{stroke:var(--ink); stroke-width:2; fill:none} .pic .thin{stroke:var(--mute); stroke-width:1.2; fill:none}
.pic.sm{max-width:180px; align-self:center}
.pic .spin{transform-origin:160px 95px; animation:pspin 8s linear infinite} .pic .spin2{transform-origin:160px 95px; animation:pspin 14s linear infinite reverse}
.pic .car{animation:pdrive 4s linear infinite} .pic .dot{animation:pdot 4s linear infinite}
@keyframes pspin{to{transform:rotate(360deg)}} @keyframes pdrive{from{transform:translateX(0)}to{transform:translateX(200px)}} @keyframes pdot{from{transform:translate(0,0)}to{transform:translate(120px,-80px)}}
@media (prefers-reduced-motion:reduce){.pic .spin,.pic .spin2,.pic .car,.pic .dot{animation:none}}"""

def main(argv):
    if "-o" not in argv:
        print(__doc__); return 2
    i = argv.index("-o"); out = argv[i + 1]; files = argv[:i] + argv[i + 2:]
    subj, units, cards = {}, {}, []
    for f in files:
        for d in json.load(open(f, encoding="utf-8"))["docs"]:
            if d["col"] == "subjects": subj[d["id"]] = d["data"]
            elif d["col"] == "units": units[d["id"]] = d["data"]
            elif d["col"] == "cards": cards.append((d["id"], d["data"]))
    e = html.escape
    secs = []
    for uid in sorted(units, key=lambda u: (subj.get(units[u]["subjectId"], {}).get("name", ""), units[u].get("order", 0))):
        u = units[uid]; sname = subj.get(u["subjectId"], {}).get("name", u["subjectId"])
        tiles = [f'<div class="t u"><div class="q">Obrazek działu</div><div class="pic">{u.get("svg", "")}</div></div>']
        for cid, c in cards:
            if c["unitId"] != uid or (c["type"] == "vocab" and cid.endswith("b")): continue
            q = re.sub(r"\{\{(.+?)\}\}", "___", c["front"])
            a = c.get("back") or ", ".join(re.findall(r"\{\{(.+?)\}\}", c["front"]))
            steps = "".join(f'<div class="st"><b>{n}</b> {e(c[k])}</div>' for k, n in (("lit", "Skąd to się wzięło"), ("why", "Dlaczego tak jest"), ("ex", "Przykład")) if c.get(k))
            tiles.append(f'<div class="t"><div class="q">{e(q)}</div><div class="a">{e(a)}</div><div class="pic {"sm" if c.get("svgSize") == "sm" else ""}">{c.get("svg", "")}</div>{"<details><summary>3 kroki</summary>" + steps + "</details>" if steps else ""}</div>')
        secs.append(f'<h2>{e(sname)} · {e(u["title"])}</h2><div class="g">{"".join(tiles)}</div>')
    page = f"""<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BorBan: galeria materiału</title>
<style>body{{margin:0;background:#f6f7fb;color:#1d2433;font:14px/1.45 system-ui,sans-serif}}.w{{max-width:1200px;margin:auto;padding:16px}}h2{{font-size:17px;margin:22px 0 10px}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}}.t{{background:#fff;border:1px solid #d9dde8;border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:6px}}.t.u{{grid-column:span 2}}
.q{{font-weight:700}}.a{{color:#6b7385}}.st{{font-size:12.5px;margin-top:6px}}{CSS}</style></head><body><div class="w"><h1>Galeria materiału</h1>{"".join(secs)}</div></body></html>"""
    open(out, "w", encoding="utf-8").write(page)
    print(f"Zapisano {out}: {len(units)} działów, {len(cards)} kart")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
