// Testy sprawdzania wpisanych odpowiedzi (bez przeglądarki). Uruchom: node tests/odpowiedzi/run.js
// Kod końca: 0 = wszystko zgodne, 1 = są błędy.
const fs = require("fs"), path = require("path");
const L = require("../lib/sprawdzanie.js");
const ok = r => r === "exact" || r === "close";
let fails = 0; const out = [];
const fail = (grupa, msg) => { fails++; out.push(`  ✗ [${grupa}] ${msg}`); };

// 1. Podstawowe (zapis wzorów, daty, listy, słówka)
for (const [t, a, ty, e] of require("./przypadki-podstawowe.js")){
  const r = L.checkAnswer(t, a, ty);
  const good = e === "ok" ? ok(r) : e === "no" ? r === "no" : e === "ai" ? r === "" : !ok(r);
  if (!good) fail("podstawowe", `${JSON.stringify(t)} vs ${JSON.stringify(a)} → ${JSON.stringify(r)}, oczekiwane ${e}`);
}
// 2. 193 przypadki recenzji: zero fałszywych zaliczeń, zero twardych odrzuceń poprawnych
for (const [t, a, exp, d] of require("./przypadki-193.js")){
  const r = L.checkAnswer(t, a, "qa");
  if (ok(r) && !exp) fail("recenzja-193", `fałszywe zaliczenie: ${t} | ${a} | ${d}`);
  if (r === "no" && exp) fail("recenzja-193", `twarde odrzucenie poprawnej: ${t} | ${a} | ${d}`);
}
// 3. Przypadki sprawdzającego B (niepełne odpowiedzi, przedziały, obliczenia, nazwy z pytania…)
const B = require("./przypadki-recenzja-b.js");
for (const [t, a, ty, fr, exp, cl] of B.T){
  const r = L.checkAnswer(t, a, ty, fr);
  const good = exp === "ok" ? ok(r) : exp === "-" ? !ok(r) : r === exp;
  if (!good) fail("recenzja-B " + cl, `${JSON.stringify(t)} vs ${JSON.stringify(a)} → ${JSON.stringify(r)}, oczekiwane ${exp}`);
}
for (const [t, a, ty, e] of B.O){ const v = L.offlineCap(t, a, ty); if (v !== e) fail("bez AI", `${JSON.stringify(t)} → ${v}, oczekiwane ${e}`); }
// 4. Wzory skróconego mnożenia z biblioteki: odpowiedź zalicza samą siebie, pojedynczy czynnik nie zalicza całości
const mat = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "content", "library", "matematyka.json"), "utf8")).docs.filter(d => d.col === "cards" && d.id.startsWith("k_m25"));
for (const d of mat){ const c = d.data; const a = c.type === "cloze" ? L.clozeAnswer(c) : c.back;
  if (L.checkAnswer(a, a, c.type, c.front) !== "exact") fail("wzory", `${d.id}: odpowiedź nie zalicza samej siebie`);
  for (const f of (a.match(/\([^()]*\)\d*[²³]?/g) || []).concat(["2", "a+b", "x-5", "a-b"])){
    if (L.mathKey(f) === L.mathKey(a)) continue; const r = L.checkAnswer(f, a, c.type, c.front);
    if (ok(r) && !(a.includes("=") && a.split("=").some(x => L.mathKey(x) === L.mathKey(f)))) fail("wzory", `${d.id}: ${JSON.stringify(f)} zaliczone jako ${JSON.stringify(a)}`); } }

console.log(fails ? `BŁĘDY: ${fails}\n` + out.join("\n") : "Sprawdzanie odpowiedzi: wszystkie przypadki zgodne.");
process.exit(fails ? 1 : 0);
