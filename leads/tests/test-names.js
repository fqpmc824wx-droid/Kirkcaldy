// Function/variable names across the five files of the one Apps Script project (one global scope: last definition wins).
"use strict";
const { test, run, assert, sources, vm, REPO, mkEnv } = require("./harness");
const { execSync } = require("child_process");

const SHARED = ["alertTeam", "callWindow", "inCallHours", "leadText", "niceFirstName", "leadsSheet", "LEADS_TAB"];

// Top-level names a file declares, with their source text (each file evaluated on its own in a sandbox).
function declared(code) {
  const ctx = vm.createContext({});
  const before = new Set(Object.getOwnPropertyNames(ctx));
  vm.runInContext(code, ctx);
  const out = {};
  Object.getOwnPropertyNames(ctx).filter(n => !before.has(n)).forEach(n => { out[n] = typeof ctx[n] === "function" ? ctx[n].toString() : JSON.stringify(ctx[n]); });
  return out;
}
const files = sources(), decl = {};
files.forEach(([name, code]) => { decl[name] = declared(code); });

test("no name is defined in two files, except the shared lead-alert functions", () => {
  const where = {};
  Object.keys(decl).forEach(f => Object.keys(decl[f]).forEach(n => { (where[n] = where[n] || []).push(f); }));
  const dup = Object.keys(where).filter(n => where[n].length > 1 && SHARED.indexOf(n) === -1).map(n => n + " in " + where[n].join(" + "));
  assert.deepStrictEqual(dup, [], "duplicate names:\n" + dup.join("\n"));
  SHARED.forEach(n => assert.deepStrictEqual(where[n].sort(), ["leads/meta-leads.gs", "leaflet/apps-script.gs"], n + " should be in exactly meta-leads.gs and apps-script.gs"));
});

test("shared functions are byte-identical in meta-leads.gs and apps-script.gs", () => {
  SHARED.filter(n => n !== "LEADS_TAB").forEach(n => assert.strictEqual(decl["leads/meta-leads.gs"][n], decl["leaflet/apps-script.gs"][n], n + " differs"));
  const stmt = code => (code.match(/^var LEADS_TAB = [^;]*;/m) || [])[0];
  assert.strictEqual(stmt(files[2][1]), stmt(files[0][1]), "var LEADS_TAB differs");
  assert.ok(stmt(files[2][1]), "var LEADS_TAB missing");
});

test("shared functions are unchanged from the committed meta-leads.gs (HEAD)", () => {
  const head = declared(execSync(`git -C "${REPO}" show HEAD:leads/meta-leads.gs`, { encoding: "utf8" }));
  SHARED.filter(n => n !== "LEADS_TAB").forEach(n => assert.strictEqual(decl["leads/meta-leads.gs"][n], head[n], n + " was changed"));
});

test("health.gs: every name starts with health/HEALTH; no onEdit/onOpen/doGet/doPost in our files", () => {
  const bad = Object.keys(decl["leads/health.gs"]).filter(n => !/^(health|HEALTH_)/.test(n));
  assert.deepStrictEqual(bad, []);
  ["leads/meta-leads.gs", "leads/meta-ads.gs", "leads/health.gs"].forEach(f => ["onEdit", "onOpen", "doGet", "doPost", "onInstall"].forEach(n =>
    assert.ok(!decl[f][n], f + " defines " + n)));
  assert.ok(decl["leads/meta-leads.gs"].healthNotifyOnce && !decl["leads/health.gs"].healthNotifyOnce, "healthNotifyOnce must live only in meta-leads.gs");
  assert.ok(/^"\d{4}-\d{2}-\d{2}-/.test(decl["leads/health.gs"].HEALTH_VERSION), "HEALTH_VERSION constant <date>-<commit>");
});

test("all five files load together in one scope", () => {
  const env = mkEnv();
  ["healthAlert", "healthInstallTriggers", "healthTestAlert", "pollMetaLeads", "adsStatusCheck", "doPost", "trkOnSheetEdit"].forEach(n => assert.strictEqual(typeof env.get(n), "function", n));
});

test("no forbidden wording in our files (NHS 'accepting/taking on', 'first come first served', budget cut as the first fix)", () => {
  files.slice(2).forEach(([f, code]) => {
    assert.ok(!/accepting (new )?NHS patients|taking on (new )?NHS patients|first come,? first served/i.test(code), f + " has forbidden wording");
    assert.ok(!/cut the (ad )?budget/i.test(code), f + " tells the owner to cut the budget");
  });
});

if (require.main === module) run();
