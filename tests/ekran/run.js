// Testy ekranu i zachowania aplikacji w przeglądarce (Playwright, udawany Supabase). Uruchom: node tests/ekran/run.js
// Każdy test to reguła, którą ustaliliśmy z Hubertem (docs/DECYZJE.md). Kod końca 0 = wszystko zgodne.
const { chromium } = require("playwright");
const { library, startApp } = require("../lib/aplikacja.js");
const results = []; const check = (name, cond, info = "") => results.push([!!cond, name, info]);

// materiał: dział wzorów skróconego mnożenia jako bieżący
const WZORY = library(d => d.col !== "cards" || d.id.startsWith("k_m25")).map(d => d.col === "subjects" && d.id.includes("mat") ? { ...d, data: { ...d.data, current: "un_m25" } } : d);
const reveal = p => p.click('form[data-form="reveal"] button[type="submit"]');
const buttons = p => p.evaluate(() => [...document.querySelectorAll("#sheet .grade")].map(b => b.dataset.g + (b.disabled ? "-" : "+")).join(","));

(async () => {
  const browser = await chromium.launch();
  try {
    // 1. ekran główny na wąskich telefonach: bez przewijania w bok, zegar w nagłówku
    for (const w of [360, 390]){
      const { page, errs } = await startApp(browser, { docs: WZORY, width: w });
      check(`ekran główny ${w}px bez przewijania w bok`, await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0);
      check(`zegar nauki w nagłówku (${w}px)`, await page.$("#hdrTime"));
      check(`brak błędów JS (${w}px)`, !errs.length, errs.join(" | "));
      await page.close();
    }
    const { page, errs } = await startApp(browser, { docs: WZORY });

    // 2. dobra odpowiedź: „Zgadza się”, „Wiem” aktywne, komunikat bez liczników
    await page.evaluate(() => startSession("quick"));
    check("klawiatura wzorów przy karcie z wzorem", await page.$(".mathpad"));
    check("pole odpowiedzi bez systemowej klawiatury (inputmode none)", await page.getAttribute("#typed", "inputmode") === "none");
    await page.fill("#typed", await page.evaluate(() => { const c = S.cards[SES.queue[SES.i]]; return c.type === "cloze" ? clozeAnswer(c) : c.back; })); await reveal(page); await page.waitForTimeout(150);
    check("dobra odpowiedź: „Zgadza się”", /Zgadza się/.test(await page.textContent("#sheet")));
    check("dobra odpowiedź: Wiem aktywne", (await buttons(page)).includes("2+"));
    check("w sesji brak kropek poziomu przy pytaniu", !(await page.$("#sheet .meta .lvl")));
    await page.click('#sheet .grade[data-g="2"]'); await page.waitForTimeout(100);
    check("po ocenie komunikat bez liczników", /^Dobrze/.test(await page.textContent("#toast")));

    // 3. zła odpowiedź: zapis błędu od razu (zanim uczeń kliknie), tylko „Nie wiem”
    await page.evaluate(() => { window.__VERDICT = "no"; });
    const cid = await page.evaluate(() => SES.queue[SES.i]);
    await page.fill("#typed", "zupełnie nie to"); await reveal(page); await page.waitForTimeout(400);
    const saved = await page.evaluate(c => { const u = window.__UPS.filter(x => x.col === "progress" && x.id === c).pop(); return u ? u.data.hist.map(h => h[1]).pop() : null; }, cid);
    check("zła odpowiedź zapisana od razu (ucieczka jej nie skasuje)", saved === 0, "ostatnia ocena w zapisie: " + saved);
    check("po złej odpowiedzi tylko „Nie wiem”", (await buttons(page)) === "0+");
    check("po złej odpowiedzi poprawna odpowiedź i „Jak do tego dojść”", /Poprawnie:/.test(await page.textContent("#sheet")) && /Jak do tego dojść/.test(await page.textContent("#sheet")));
    await page.click('#sheet .grade[data-g="0"]'); await page.waitForTimeout(100);
    check("ocena po zapisie od razu nie dubluje błędu", await page.evaluate(c => S.progress[c].hist.length, cid) === 1);
    await page.evaluate(() => { window.__VERDICT = "yes"; });

    // 4. podpowiedź = pierwsze litery i najwyżej „Z trudem”
    const h = await page.$('[data-act="hint"]');
    if (h){ await h.click(); await page.waitForTimeout(80);
      const ans = await page.evaluate(() => { const c = S.cards[SES.queue[SES.i]]; return c.type === "cloze" ? clozeAnswer(c) : c.back; }), hint = await page.evaluate(() => document.querySelector("#sheet .yours b")?.innerText || "");
      check("podpowiedź nie pokazuje całej odpowiedzi", hint && hint !== ans, hint);
      await page.fill("#typed", ans); await reveal(page); await page.waitForTimeout(150);
      check("po podpowiedzi „Wiem” wyłączone", (await buttons(page)).includes("2-"));
    } else check("przycisk podpowiedzi dostępny", false);
    await page.evaluate(() => closeSheet());

    // 5. sesja przed sprawdzianem: bez wpisu „Wiem” wyłączone
    await page.evaluate(() => { S.tests = { t1: { title: "Wzory", date: TODAY(), unitIds: ["un_m25"] } }; startSession("test", "t1"); });
    await reveal(page); await page.waitForTimeout(100);
    check("przed sprawdzianem „Wiem” dopiero po wpisaniu", (await buttons(page)).includes("2-"));
    await page.evaluate(() => closeSheet());
    check("poranek w dniu sprawdzianu = cały zakres", await page.evaluate(() => morningIds().length) >= 10);

    // 6. reguły poziomu: 3 dobre z rzędu, w co najmniej 2 dni; błąd zeruje
    const lv = await page.evaluate(() => { const t = TODAY(), j = addDays(t, 1); const seq = s => { let p = null; return s.map(([d, g]) => { p = grade(p, g, d); return runOf(p); }).join(""); };
      return { dzis: seq([[t,2],[t,2],[t,2]]), dwaDni: seq([[t,2],[t,2],[j,2]]), blad: seq([[t,2],[t,0],[t,2]]) }; });
    check("jednego dnia najwyżej 2 z 3", lv.dzis === "122", lv.dzis);
    check("trzecia dobra następnego dnia = opanowana", lv.dwaDni === "123", lv.dwaDni);
    check("błąd zeruje, potem można znowu zdobywać", lv.blad === "101", lv.blad);

    // 7. bez AI: wpis bez związku z odpowiedzią najwyżej „Z trudem”
    check("bez AI: „asdf” najwyżej Z trudem", await page.evaluate(() => offlineCap("asdf", "Zeus", "qa")) === 1);
    check("brak błędów JS (uczeń)", !errs.length, errs.join(" | "));
    await page.close();

    // 8. rodzic: wszystkie zakładki bez błędów, bez imienia na sztywno
    const r = await startApp(browser, { role: "parent" });
    const tabs = await r.page.evaluate(() => ["dzis","postepy","plan","material","rodzic","zeszyt","mapa"].map(t => { try { tab = t; render(); const x = document.querySelector("#view").innerText; return t + (x.includes("${") ? ":LITERAL" : ""); } catch (e) { return t + ":ERR " + e.message; } }));
    check("panel rodzica: wszystkie zakładki się renderują", tabs.every(t => !t.includes(":")), tabs.join(", "));
    check("brak błędów JS (rodzic)", !r.errs.length, r.errs.join(" | "));
    await r.page.close();
  } finally { await browser.close(); }
  const bad = results.filter(r => !r[0]);
  results.forEach(([ok, n, i]) => console.log(`${ok ? "✓" : "✗"} ${n}${!ok && i ? "  (" + i + ")" : ""}`));
  console.log(bad.length ? `\nBŁĘDY: ${bad.length} z ${results.length}` : `\nWszystkie ${results.length} testy ekranu zgodne.`);
  process.exit(bad.length ? 1 : 0);
})();
