// Uruchamia index.html w Chromium (Playwright) z udawanym Supabase: bez sieci, bez prawdziwej bazy, bez danych osobowych.
// Materiał bierze z content/library. window.__UPS = wszystkie zapisy do „bazy”, window.__AI = zapytania do AI,
// window.__VERDICT = werdykt udawanego AI ('yes' | 'partial' | 'no'), window.__ROLE = 'child' | 'parent'.
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..", "..") + path.sep;

function library(filter){
  const docs = fs.readdirSync(ROOT + "content/library").filter(f => f.endsWith(".json"))
    .flatMap(f => JSON.parse(fs.readFileSync(ROOT + "content/library/" + f, "utf8")).docs);
  return filter ? docs.filter(filter) : docs;
}

function fakeSupabase(docs, name = "Uczeń"){
  return `
window.__DOCS=${JSON.stringify(docs)}; window.__UPS=[]; window.__AI=[];
function qb(table){ const st={table,filters:{}}; const p={
  select(){return p}, eq(k,v){st.filters[k]=v;return p}, in(){return p}, gt(){return p}, order(){return p}, limit(){return p}, range(){return p}, match(){return p},
  upsert(r){ (Array.isArray(r)?r:[r]).forEach(x=>{ window.__UPS.push(x); const i=window.__DOCS.findIndex(d=>d.col===x.col&&d.id===x.id); const d={col:x.col,id:x.id,data:x.data}; if(i>=0) window.__DOCS[i]=d; else window.__DOCS.push(d); }); st.write=true; return p},
  delete(){st.write=true;return p},
  then(res,rej){ let out; if(st.write) out={error:null}; else if(table==='borban_members') out={data:[{family_id:'f1',role:window.__ROLE||'child',display_name:${JSON.stringify(name)},borban_families:{name:'Rodzina'}}],error:null};
    else out={data:window.__DOCS.map(d=>({col:d.col,id:d.id,data:d.data})),error:null}; return Promise.resolve(out).then(res,rej);} }; return p; }
window.supabase={createClient(){return {
  auth:{getSession:async()=>({data:{session:{user:{id:'u1',email:'uczen@test.local'}}}}),onAuthStateChange(){},signOut:async()=>({})},
  from:qb, rpc:async()=>({data:null,error:null}),
  functions:{invoke:async(n,o)=>{ window.__AI.push(o.body); await new Promise(r=>setTimeout(r,50)); return {data:{ok:true,result:{verdict:window.__VERDICT||'yes',why:'test',how:'krok 1, krok 2'}},error:null}}},
  storage:{from:()=>({remove:async()=>({error:null}),upload:async()=>({error:null}),createSignedUrls:async()=>({data:[]})})},
  channel(){const c={on(){return c},subscribe(){return c}};return c}
}}};`;
}

async function startApp(browser, { docs, width = 390, role = "child", name = "Uczeń" } = {}){
  const page = await browser.newPage({ viewport: { width, height: 800 }, hasTouch: true, isMobile: width < 700 });
  const errs = []; page.on("pageerror", e => errs.push(e.message)); page.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text()); });
  if (role !== "child") await page.addInitScript(r => { window.__ROLE = r; }, role);
  await page.route("**/*", async rt => { const u = rt.request().url();
    if (u.includes("supabase-js")) return rt.fulfill({ body: fakeSupabase(docs || library(), name), contentType: "application/javascript" });
    if (u.endsWith("/config.js")) return rt.fulfill({ body: 'window.BORBAN={url:"https://x.supabase.co",anonKey:"x"}', contentType: "application/javascript" });
    if (u.startsWith("http://borban.test/")){ const f = u.replace("http://borban.test/", "").split("?")[0] || "index.html";
      if (fs.existsSync(ROOT + f)) return rt.fulfill({ body: fs.readFileSync(ROOT + f), contentType: f.endsWith(".html") ? "text/html" : undefined }); return rt.fulfill({ status: 404, body: "" }); }
    return rt.fulfill({ status: 204, body: "" }); });
  await page.goto("http://borban.test/index.html"); await page.waitForTimeout(900);
  return { page, errs };
}

module.exports = { ROOT, library, fakeSupabase, startApp };
