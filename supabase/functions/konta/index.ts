// BorBan: konta użytkowników (hasła i konsola kont).
// Wejście (POST, z tokenem zalogowanego użytkownika):
//   { action: "whoami" }                              → { ok, admin: bool }
//   { action: "set_password", userId, password }      → rodzic ustawia nowe hasło kontu UCZNIA ze swojej rodziny
//   { action: "list" }                                → tylko administrator: lista wszystkich kont do konsoli
// Administratorzy: tabela borban_admins (e-maile małymi literami; dostęp tylko service_role)
//   albo sekret BORBAN_ADMINS (adresy oddzielone przecinkami; Supabase → Edge Functions → Secrets).
// Klucz service_role funkcja bierze ze zmiennej środowiskowej Supabase (nigdy z kodu ani z aplikacji).
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const DAY = 864e5;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = (Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY"))!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!service) return json({ error: "no_service" }, 503);
    const userDb = createClient(url, anon, { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } });
    const { data: u } = await userDb.auth.getUser();
    const me = u?.user;
    if (!me) return json({ error: "unauthorized" }, 401);
    const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const admins = (Deno.env.get("BORBAN_ADMINS") || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
    let isAdmin = !!me.email && admins.includes(me.email.toLowerCase());
    if (!isAdmin && me.email) {
      const { data: a } = await admin.from("borban_admins").select("email").eq("email", me.email.toLowerCase()).limit(1);
      isAdmin = !!a?.length;
    }

    const body = await req.json().catch(() => ({}));

    if (body.action === "whoami") return json({ ok: true, admin: isAdmin });

    if (body.action === "set_password") {
      const userId = String(body.userId || ""), password = String(body.password || "");
      if (password.length < 8 || password.length > 72) return json({ error: "weak_password" }, 400);
      if (userId === me.id) return json({ error: "use_own_change" }, 400);
      // rodzic może zmienić hasło tylko uczniowi z tej samej rodziny
      const { data: mine } = await admin.from("borban_members").select("family_id").eq("user_id", me.id).eq("role", "parent");
      const fams = (mine || []).map((r) => r.family_id);
      if (!fams.length) return json({ error: "forbidden" }, 403);
      const { data: target } = await admin.from("borban_members").select("family_id,role").eq("user_id", userId).in("family_id", fams).eq("role", "child").limit(1);
      if (!target?.length) return json({ error: "forbidden" }, 403);
      const { error } = await admin.auth.admin.updateUserById(userId, { password });
      if (error) return json({ error: "update_failed" }, 500);
      return json({ ok: true });
    }

    if (body.action === "list") {
      if (!isAdmin) return json({ error: "forbidden" }, 403);
      const users: any[] = [];
      for (let page = 1; page <= 50; page++) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) return json({ error: "list_failed" }, 500);
        users.push(...data.users);
        if (data.users.length < 1000) break;
      }
      const { data: mem } = await admin.from("borban_members").select("user_id,family_id,role,display_name,borban_families(name)");
      // ostatnia aktywność = ostatni zapis w bazie zrobiony przez to konto (nauka, notatki, materiał)
      const { data: act } = await admin.rpc("borban_last_activity");
      const lastAct = new Map((act || []).map((r: any) => [r.user_id, r.last_at]));
      const now = Date.now();
      const rows = users.map((x) => {
        const m = (mem || []).find((r: any) => r.user_id === x.id) as any;
        const last = [x.last_sign_in_at, lastAct.get(x.id)].filter(Boolean).map((d) => Date.parse(d as string)).sort((a, b) => b - a)[0] || 0;
        const created = Date.parse(x.created_at);
        const status = now - created < 7 * DAY ? "nowe" : last && now - last < 7 * DAY ? "aktywne" : "nieaktywne";
        return {
          email: x.email || "",
          created_at: x.created_at,
          last_sign_in_at: x.last_sign_in_at || null,
          last_activity_at: lastAct.get(x.id) || null,
          role: m?.role || null,
          family: m?.borban_families?.name || null,
          name: m?.display_name || null,
          confirmed: !!x.email_confirmed_at,
          status,
        };
      }).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
      return json({ ok: true, generated_at: new Date().toISOString(), rows });
    }

    return json({ error: "bad_action" }, 400);
  } catch (_e) {
    return json({ error: "server" }, 500);
  }
});
