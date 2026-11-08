"""Generuje 6 plansz onboardingowych BorBan Beta (SVG -> PNG 1080x1350)."""
import subprocess, pathlib

OUT = pathlib.Path(__file__).parent   # PNG i SVG powstają obok skryptu
INK, MUTED, LINE, BG, PRI, SOFT, YEL, CORAL, GREEN = "#18213A", "#58617C", "#D8DDEA", "#F3F5FA", "#2448D8", "#DCE3FF", "#FFC531", "#FF7A59", "#22A06B"
N = 6

def esc(s): return s.replace("&", "&amp;").replace("<", "&lt;")

def t(x, y, s, size=22, w=600, fill=INK, anchor="start"):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{w}" fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>'

def btn(x, y, w, h, label, fill=PRI, color="#fff", stroke=None, size=22):
    st = f' stroke="{stroke}" stroke-width="4"' if stroke else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2 if h<60 else 14}" fill="{fill}"{st}/>' + t(x + w/2, y + h/2 + size*0.36, label, size, 800, color, "middle")

def field(x, y, w, label, value=""):
    return t(x, y, label, 19, 600, MUTED) + f'<rect x="{x}" y="{y+12}" width="{w}" height="48" rx="10" fill="{BG}" stroke="{LINE}" stroke-width="2"/>' + (t(x+14, y+44, value, 19, 600, INK) if value else "")

def highlight(x, y, w, h):
    return f'<rect x="{x-8}" y="{y-8}" width="{w+16}" height="{h+16}" rx="18" fill="none" stroke="{YEL}" stroke-width="6" stroke-dasharray="2 0"/>'

# ---------- ekrany telefonu (współrzędne wewnątrz ekranu: x 86..454, y 436..1204) ----------
def scr_login():
    return (t(116, 560, "BORBAN", 20, 700, PRI) + t(116, 610, "Zaloguj się", 40, 800) +
        f'<rect x="110" y="650" width="320" height="300" rx="20" fill="#fff" stroke="{LINE}" stroke-width="2"/>' +
        field(134, 695, 272, "E-mail") + field(134, 795, 272, "Hasło") + btn(134, 878, 272, 56, "Zaloguj") +
        btn(110, 975, 320, 64, "Nie mam konta – załóż", YEL, INK, INK))

def tabs(active):
    names = ["Dziś", "Mapa", "Postępy", "Rodzic"]
    s = f'<rect x="86" y="1130" width="368" height="74" fill="#fff"/><line x1="86" y1="1130" x2="454" y2="1130" stroke="{LINE}" stroke-width="2"/>'
    for i, n in enumerate(names):
        cx = 132 + i * 92
        c = PRI if n == active else MUTED
        s += f'<circle cx="{cx}" cy="1156" r="9" fill="{c}" opacity="{1 if n==active else .45}"/>' + t(cx, 1188, n, 16, 700 if n == active else 600, c, "middle")
    return s

def scr_family():
    return (t(116, 545, "PANEL RODZICA", 18, 700, PRI) + t(116, 590, "Konta w rodzinie", 32, 800) +
        f'<rect x="110" y="620" width="320" height="96" rx="16" fill="#fff" stroke="{LINE}" stroke-width="2"/>' +
        t(132, 660, "Ty", 22, 800) + t(132, 692, "rodzic", 18, 600, MUTED) +
        f'<rect x="110" y="740" width="320" height="370" rx="16" fill="#fff" stroke="{LINE}" stroke-width="2"/>' +
        field(132, 780, 276, "E-mail konta dziecka", "ty+ola@gmail.com") + field(132, 870, 276, "Imię", "Ola") +
        field(132, 960, 276, "Rola", "uczeń") + btn(132, 1040, 276, 52, "Dodaj do rodziny", size=20) +
        highlight(132, 1040, 276, 52) + tabs("Rodzic"))

def scr_home():
    s = f'<rect x="86" y="436" width="368" height="768" rx="44" fill="#3A4F9A"/>'
    s += '<rect x="86" y="436" width="368" height="768" rx="44" fill="url(#wall)"/>'
    icons = [(130, 560), (215, 560), (300, 560), (385, 560), (130, 680), (215, 680)]
    cols = ["#6C8BFF", "#FF9F6B", "#7FD1AE", "#C9A7FF", "#FFD36B", "#8FD3FF"]
    for (x, y), c in zip(icons, cols):
        s += f'<rect x="{x-32}" y="{y-32}" width="64" height="64" rx="16" fill="{c}" opacity=".55"/>'
    s += (f'<rect x="268" y="648" width="64" height="64" rx="16" fill="{PRI}" stroke="#fff" stroke-width="4"/>' +
          t(300, 693, "B", 36, 800, "#fff", "middle") + t(300, 770, "BorBan", 18, 700, "#fff", "middle") +
          f'<circle cx="300" cy="680" r="48" fill="none" stroke="{YEL}" stroke-width="6"/>')
    s += f'<rect x="120" y="1080" width="300" height="80" rx="24" fill="#fff" opacity=".35"/>'
    return s

def scr_study():
    return (t(116, 540, "5 KART · 2 MIN", 18, 700, PRI) +
        f'<rect x="110" y="565" width="320" height="300" rx="22" fill="#fff" stroke="{LINE}" stroke-width="2"/>' +
        f'<g transform="translate(222 590)"><rect width="96" height="96" rx="20" fill="#fff"/><rect x="5" y="5" width="86" height="86" rx="16" fill="{CORAL}" stroke="{INK}" stroke-width="5"/>'
        f'<circle cx="48" cy="48" r="18" fill="#fff" stroke="{INK}" stroke-width="5"/></g>' +
        t(270, 730, "Ile to jest 7 × 8?", 26, 800, INK, "middle") +
        f'<rect x="134" y="760" width="272" height="56" rx="12" fill="{BG}" stroke="{PRI}" stroke-width="3"/>' + t(150, 797, "56", 24, 700) +
        btn(110, 890, 320, 60, "Pokaż odpowiedź") + highlight(110, 890, 320, 60) +
        t(270, 990, "potem dziecko ocenia siebie:", 18, 600, MUTED, "middle") +
        btn(110, 1010, 100, 52, "Nie wiem", "#fff", INK, LINE, 16) + btn(220, 1010, 100, 52, "Z trudem", "#fff", INK, LINE, 16) +
        btn(330, 1010, 100, 52, "Wiem", GREEN, "#fff", None, 18))

def scr_notes():
    s = (t(116, 545, "ZESZYT", 18, 700, PRI) + t(116, 590, "Notatka z lekcji", 32, 800) +
         f'<rect x="110" y="615" width="320" height="250" rx="18" fill="#FFFDF5" stroke="{LINE}" stroke-width="2"/>')
    for i in range(7):
        y = 660 + i * 30
        s += f'<line x1="130" y1="{y}" x2="410" y2="{y}" stroke="#BFD0F5" stroke-width="2"/>'
        s += f'<path d="M140 {y-6} q30 -10 60 0 t60 0 t{40+i*8} 0" stroke="#5B6B9B" stroke-width="3" fill="none" stroke-linecap="round"/>'
    s += (f'<circle cx="390" cy="840" r="34" fill="{YEL}" stroke="{INK}" stroke-width="5"/>'
          f'<path d="M374 832h8l4-6h10l4 6h8v18h-34z" fill="#fff" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/><circle cx="391" cy="840" r="5" fill="{INK}"/>')
    s += (btn(132, 885, 276, 50, "Sprawdź i potwierdź", size=19) + highlight(132, 885, 276, 50) +
          f'<rect x="110" y="965" width="320" height="140" rx="18" fill="#fff" stroke="{LINE}" stroke-width="2"/>' +
          t(132, 1003, "SPRAWDZIAN", 16, 700, PRI) + t(132, 1040, "Tabliczka mnożenia", 22, 800) +
          t(132, 1074, "piątek, 20 listopada", 19, 600, MUTED) + tabs("Dziś"))
    return s

def scr_parent():
    s = t(116, 540, "PANEL RODZICA", 18, 700, PRI) + t(116, 584, "Ola: wszystko tu", 32, 800)
    s += (f'<rect x="110" y="610" width="152" height="110" rx="16" fill="#fff" stroke="{LINE}" stroke-width="2"/>' + t(130, 650, "w tygodniu", 17, 600, MUTED) + t(130, 696, "48 min", 32, 800) +
          f'<rect x="278" y="610" width="152" height="110" rx="16" fill="#fff" stroke="{LINE}" stroke-width="2"/>' + t(298, 650, "dni z rzędu", 17, 600, MUTED) + t(298, 696, "5", 32, 800))
    s += f'<rect x="110" y="740" width="320" height="200" rx="16" fill="#fff" stroke="{LINE}" stroke-width="2"/>' + t(130, 776, "Minuty nauki, 14 dni", 18, 700)
    hs = [20, 34, 10, 40, 28, 0, 16, 36, 44, 22, 30, 48, 38, 52]
    for i, h in enumerate(hs):
        x = 134 + i * 20.5
        s += f'<rect x="{x}" y="{920-h*2}" width="13" height="{max(h*2,3)}" rx="4" fill="{PRI if i==13 else SOFT}"/>'
    s += (f'<rect x="110" y="960" width="320" height="150" rx="16" fill="#fff" stroke="{LINE}" stroke-width="2"/>' + t(130, 996, "Sprawdziany", 18, 700) +
          t(130, 1032, "Tabliczka mnożenia", 19, 700) + t(410, 1032, "72%", 19, 800, GREEN, "end") +
          f'<rect x="130" y="1048" width="280" height="12" rx="6" fill="{SOFT}"/><rect x="130" y="1048" width="202" height="12" rx="6" fill="{GREEN}"/>' +
          t(130, 1090, "gotowość do sprawdzianu", 16, 600, MUTED) + tabs("Rodzic"))
    return s

BOARDS = [
    ("Załóż konto", "2 minuty, tylko e-mail i hasło", scr_login, [
        ("Wejdź na", "borban.vercel.app", True),
        ("Kliknij „Nie mam", "konta – załóż”", False),
        ("Potwierdź e-mail", "i napisz do nas, otworzymy Ci rodzinę", None)]),
    ("Dodaj dziecko", "Dziecko nie musi mieć własnej skrzynki", scr_family, [
        ("Załóż mu konto, np.", "ty+ola@gmail.com", True),
        ("Wróć na swoje", "konto → zakładka Rodzic", False),
        ("Wpisz e-mail i imię,", "rola „uczeń”", None)]),
    ("Ikona na telefonie", "BorBan działa jak zwykła aplikacja", scr_home, [
        ("Zaloguj dziecko", "na jego telefonie", None),
        ("iPhone (Safari):", "Udostępnij → Do ekranu", None),
        ("Android (Chrome):", "⋮ → Dodaj do ekranu", None)]),
    ("5 minut dziennie", "Krótko, ale codziennie", scr_study, [
        ("Dziś → Start", "5 kart na rozgrzewkę", False),
        ("Wpisz odpowiedź", "→ Pokaż odpowiedź", False),
        ("Błąd? Spokojnie.", "Karta wróci, aż wejdzie do głowy", None)]),
    ("Zeszyt i sprawdziany", "Uczymy dokładnie tego, co jest w szkole", scr_notes, [
        ("Zdjęcie notatek", "2× w tygodniu", False),
        ("Sprawdź i potwierdź", "z notatki powstaną karty", False),
        ("Materiał → Dodaj", "sprawdzian i jego datę", False)]),
    ("Ty widzisz postępy", "Dziecko widzi tylko pochwały", scr_parent, [
        ("Zakładka Rodzic:", "minuty, seria, gotowość", False),
        ("Chwal za minuty,", "nie wytykaj błędów", None),
        ("Zła karta?", "„Zgłoś błąd w karcie”", None)]),
]

def board(i, title, sub, screen, steps):
    s = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" font-family="Inter, DejaVu Sans, sans-serif">
<defs><linearGradient id="hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{PRI}"/><stop offset="1" stop-color="{INK}"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5A73E0"/><stop offset="1" stop-color="#1E2A5A"/></linearGradient>
<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="{INK}" flood-opacity="0.28"/></filter></defs>
<rect width="1080" height="1350" fill="{BG}"/>
<path d="M0 0H1080V330C820 400 300 270 0 350Z" fill="url(#hero)"/>
{t(70, 100, f"KROK {i} Z {N}", 26, 700, SOFT)}
{t(70, 190, title, 76 if len(title) < 18 else 66, 800, "#fff")}
{t(70, 250, sub, 34, 500, SOFT)}
<g transform="translate(940 70)"><circle cx="0" cy="40" r="56" fill="#fff"/><circle cx="0" cy="40" r="50" fill="{YEL}" stroke="{INK}" stroke-width="6"/>{t(0, 64, str(i), 64, 800, INK, "middle")}</g>
<g filter="url(#sh)"><rect x="70" y="420" width="400" height="800" rx="56" fill="{INK}"/></g>
<rect x="86" y="436" width="368" height="768" rx="44" fill="{BG}"/>
<clipPath id="scr"><rect x="86" y="436" width="368" height="768" rx="44"/></clipPath>
<g clip-path="url(#scr)">{screen()}</g>
<rect x="215" y="452" width="110" height="26" rx="13" fill="{INK}"/>
'''
    for k, (a, b, blue) in enumerate(steps):
        y = 470 + k * 200
        s += f'<g transform="translate(530 {y})"><circle cx="30" cy="30" r="30" fill="{PRI}"/>{t(30, 41, str(k+1), 30, 800, "#fff", "middle")}'
        s += t(80, 28, a, 31, 700)
        if blue is True: s += t(80, 68, b, 31, 800, PRI)
        elif blue is False: s += t(80, 68, b, 31, 700)
        else:
            # dłuższy opis szarym, łamany na 2 linie po ok. 22 znaki
            words, lines, cur = b.split(), [], ""
            for w in words:
                if len(cur) + len(w) + 1 > 26 and cur: lines.append(cur); cur = w
                else: cur = (cur + " " + w).strip()
            lines.append(cur)
            for j, ln in enumerate(lines): s += t(80, 66 + j * 36, ln, 27, 500, MUTED)
        s += '</g>'
    # kropki postępu
    s += f'<rect x="70" y="1250" width="940" height="64" rx="32" fill="#fff" stroke="{LINE}" stroke-width="2"/>'
    s += t(110, 1292, "BorBan · wersja Beta", 24, 700, INK)
    for d in range(N):
        cx = 980 - (N - 1 - d) * 34
        s += f'<circle cx="{cx}" cy="1282" r="{10 if d+1==i else 7}" fill="{PRI if d+1<=i else LINE}"/>'
    return s + "</svg>"

for i, (title, sub, scr, steps) in enumerate(BOARDS, 1):
    p = OUT / f"borban-plansza-{i}.svg"
    p.write_text(board(i, title, sub, scr, steps), encoding="utf-8")
    subprocess.run(["rsvg-convert", "-w", "1080", str(p), "-o", str(p.with_suffix(".png"))], check=True)
# PDF do wysłania w całości: convert borban-plansza-{1..6}.png BorBan-instrukcja-Beta.pdf
print("ok")
