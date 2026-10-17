// BorBan: odczyt zdjęć zeszytu przez AI (Claude).
// Wejście (POST, z tokenem zalogowanego użytkownika): { paths: ["<family_id>/<note_id>/1.jpg", ...], subject: "Chemia", units: [{id, title}] }
// Wyjście: { ok: true, model, result: { lessons, text, issues, cards, unitGuess, confidence, unreadable } }
// Sekrety (Supabase → Edge Functions → Secrets): ANTHROPIC_API_KEY (wymagany), ANTHROPIC_MODEL (opcjonalny).
import { createClient } from "jsr:@supabase/supabase-js@2";
import { encodeBase64 } from "jsr:@std/encoding@1/base64";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const PROMPT = `Jesteś asystentem aplikacji BorBan. Dostajesz zdjęcia stron zeszytu ucznia polskiej szkoły (pismo ręczne, często wzory, tabele, strzałki, skreślenia; zdarza się zdjęcie obrócone o 90°).
Zadanie:
1. Przepisz WIERNIE treść zeszytu jako uporządkowaną notatkę (Markdown): nagłówki lekcji, listy, tabele Markdown, wzory chemiczne/matematyczne z indeksami Unicode (H₂O, CO₂, Mg(OH)₂, x², →, ⇄, ↑, ↓). Pomijaj treść przekreśloną. Zachowaj podwójne nazwy PL/EN, jeśli są. NIE dopisuj treści, której nie ma w zeszycie. Fragment nieczytelny zapisz jako [nieczytelne].
2. Rozpoznaj lekcje: numer (np. „L16”), datę jeśli jest, temat (po „T:”, „Temat:”, „Topic:”).
3. Wskaż błędy merytoryczne w zeszycie (np. źle uzgodnione równanie, zły wzór, błędna nazwa): co jest napisane, jak powinno być, krótko dlaczego. Tylko pewne błędy; drobne błędy ortograficzne pomiń.
4. Zaproponuj 3–12 kart do nauki z tej notatki (pytanie → krótka odpowiedź), ZAWSZE w poprawnej wersji (z poprawionymi błędami), poziom ucznia, po polsku.
5. Wybierz z podanej listy działów ten, którego dotyczy notatka (id) albo null.
Odpowiedz WYŁĄCZNIE jednym obiektem JSON, bez komentarzy:
{"lessons":[{"number":"L16"|null,"date":"RRRR-MM-DD"|null,"topic":"..."}],"text":"Markdown","issues":[{"wrote":"...","correct":"...","why":"..."}],"cards":[{"front":"...","back":"..."}],"unitGuess":"id"|null,"confidence":0.0-1.0,"unreadable":["krótki opis nieczytelnych miejsc"]}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    const auth = req.headers.get("Authorization") || "";
    const url = Deno.env.get("SUPABASE_URL")!, anon = (Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY"))!;
    const db = createClient(url, anon, { global: { headers: { Authorization: auth } } });
    const { data: u } = await db.auth.getUser();
    if (!u?.user) return json({ error: "unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const paths: string[] = Array.isArray(body.paths) ? body.paths : [];
    if (!paths.length || paths.length > 6) return json({ error: "bad_paths" }, 400);
    const fam = String(paths[0]).split("/")[0];
    if (!paths.every((p) => typeof p === "string" && p.startsWith(fam + "/") && !p.includes(".."))) return json({ error: "bad_paths" }, 400);
    const { data: role } = await db.rpc("borban_role", { fam });
    if (!role) return json({ error: "forbidden" }, 403);

    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) return json({ error: "no_key" }, 503);
    const model = Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-4-5";

    const content: unknown[] = [];
    for (const p of paths) {
      const { data, error } = await db.storage.from("notes").download(p);
      if (error || !data) return json({ error: "download", detail: error?.message }, 400);
      content.push({ type: "image", source: { type: "base64", media_type: data.type || "image/jpeg", data: encodeBase64(new Uint8Array(await data.arrayBuffer())) } });
    }
    const units = Array.isArray(body.units) ? body.units.slice(0, 60).map((x: { id: string; title: string }) => `${x.id}: ${x.title}`).join("\n") : "";
    content.push({ type: "text", text: `Przedmiot: ${String(body.subject || "").slice(0, 80)}\nDziały:\n${units}\nZdjęć: ${paths.length}.` });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 6000, system: PROMPT, messages: [{ role: "user", content }] }),
    });
    const out = await r.json();
    if (!r.ok) return json({ error: "ai", detail: out?.error?.message || r.status }, 502);
    const txt = (out.content || []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("");
    const a = txt.indexOf("{"), b = txt.lastIndexOf("}");
    let result;
    try { result = JSON.parse(txt.slice(a, b + 1)); } catch { return json({ error: "parse", raw: txt.slice(0, 500) }, 502); }
    return json({ ok: true, model, usage: out.usage, result });
  } catch (e) {
    return json({ error: "server", detail: String(e) }, 500);
  }
});
