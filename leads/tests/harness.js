// Mock Apps Script runtime for the Kirkcaldy Dental scripts.
// Loads the REAL .gs files the way Apps Script does (one global scope): leaflet/apps-script.gs + leaflet/tracking.gs
// (from the leaflet branch, or LEAFLET_DIR) + leads/meta-leads.gs + leads/meta-ads.gs + leads/health.gs.
// Run everything: node leads/tests/run-all.js
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), assert = require("assert"), { execSync } = require("child_process");

const LEADS = path.resolve(__dirname, ".."), REPO = path.resolve(LEADS, "..");
const LEAFLET_REF = process.env.LEAFLET_REF || "origin/claude/brave-allen-i14xnx";
const cache = {};
function leafletFile(file) {
  if (cache[file]) return cache[file];
  if (process.env.LEAFLET_DIR) return (cache[file] = fs.readFileSync(path.join(process.env.LEAFLET_DIR, file), "utf8"));
  try { return (cache[file] = execSync(`git -C "${REPO}" show ${LEAFLET_REF}:leaflet/${file}`, { encoding: "utf8", maxBuffer: 1e8 })); }
  catch (e) { throw new Error(`Can't read leaflet/${file} from ${LEAFLET_REF}. Run: git -C ${REPO} fetch origin claude/brave-allen-i14xnx (or set LEAFLET_DIR)`); }
}
function leadsFile(file) { return fs.readFileSync(path.join(LEADS, file), "utf8"); }
function sources(opts) {
  opts = opts || {};
  const all = [["leaflet/apps-script.gs", leafletFile("apps-script.gs")], ["leaflet/tracking.gs", leafletFile("tracking.gs")],
    ["leads/meta-leads.gs", leadsFile("meta-leads.gs")], ["leads/meta-ads.gs", leadsFile("meta-ads.gs")], ["leads/health.gs", leadsFile("health.gs")]];
  return opts.only ? all.filter(f => opts.only.indexOf(f[0]) !== -1) : all;
}

// ---------- London time ----------
function parts(d, tz) {
  const o = {};
  new Intl.DateTimeFormat("en-GB", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    second: "2-digit", weekday: "short", hourCycle: "h23" }).formatToParts(d).forEach(p => { o[p.type] = p.value; });
  return o;
}
function offsetMin(d, tz) {
  const p = parts(d, tz), t = Math.floor(d.getTime() / 1000) * 1000;
  return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - t) / 60000);
}
function formatDate(d, tz, f) {
  if (!(d instanceof Date) || isNaN(d.getTime())) throw new Error("formatDate: not a date: " + d);
  const p = parts(d, tz);
  return String(f).replace(/'([^']*)'|yyyy|yy|MM|dd|HH|H|mm|m|ss|EEE|XXX|d/g, (tok, lit) => {
    if (lit !== undefined) return lit;
    switch (tok) {
      case "yyyy": return p.year; case "yy": return p.year.slice(2); case "MM": return p.month; case "dd": return p.day; case "d": return String(+p.day);
      case "HH": return p.hour; case "H": return String(+p.hour); case "mm": return p.minute; case "m": return String(+p.minute); case "ss": return p.second;
      case "EEE": return p.weekday;
      case "XXX": { const o = offsetMin(d, tz); if (!o) return "Z"; const a = Math.abs(o); return (o > 0 ? "+" : "-") + String(Math.floor(a / 60)).padStart(2, "0") + ":" + String(a % 60).padStart(2, "0"); }
    }
    return tok;
  });
}
function londonDate(s, D) {   // "2026-11-10 14:30" London -> Date
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?$/);
  if (!m) throw new Error("bad london date " + s);
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
  return new D(guess - offsetMin(new Date(guess), "Europe/London") * 60000);
}

// ---------- sheets ----------
const WL_HEADERS = ["Signup Time", "Name", "Phone", "Email", "Postcode", "No. of People", "Currently Registered?", "Adult/Child/Family", "Source",
  "Status", "Assigned to", "Marketing consent", "Notes", "Lead ID", "Logged at", "Ad name", "Ad ID", "Form ID", "Organic?", "Duplicate of", "How heard",
  "SMS ID", "SMS status", "Email status", "Call outcome", "Call attempts", "First call at", "Last attempt at", "Next call due", "Status changed at",
  "First reached at", "Booked at", "Called by", "Call history", "Visit ID"];
const SMS_HEADERS = ["Sent at", "Type", "To (last 4)", "Message ID", "Send status", "Price", "Delivery status", "Delivery detail", "Checked at"];
const CALL_HEADERS = ["Timestamp", "Lead ID", "Sheet row", "Attempt #", "Outcome", "Status set", "Caller", "Mins since clock start", "Hour", "Band", "Weekday", "Called from"];

function store(v) { return typeof v === "string" && v.charAt(0) === "'" ? v.slice(1) : v; }   // Sheets drops the leading apostrophe
class Range {
  constructor(sh, r, c, nr, nc) { Object.assign(this, { sh, r, c, nr: nr || 1, nc: nc || 1 }); }
  getValues() {
    const out = [];
    for (let i = 0; i < this.nr; i++) { const row = this.sh.rows[this.r - 1 + i] || []; const o = []; for (let j = 0; j < this.nc; j++) { const v = row[this.c - 1 + j]; o.push(v === undefined || v === null ? "" : v); } out.push(o); }
    return out;
  }
  getValue() { return this.getValues()[0][0]; }
  setValue(v) { this.sh.env.events.push(["setValue", this.sh.name, this.r, this.c]); this.sh.put(this.r, this.c, v); return this; }
  setValues(vals) { vals.forEach((row, i) => row.forEach((v, j) => this.sh.put(this.r + i, this.c + j, v))); return this; }
  clearContent() { for (let i = 0; i < this.nr; i++) for (let j = 0; j < this.nc; j++) this.sh.put(this.r + i, this.c + j, ""); return this; }
  setFontWeight() { return this; }
}
class Sheet {
  constructor(env, name, rows) { this.env = env; this.name = name; this.rows = (rows || []).map(r => r.map(store)); }
  getName() { return this.name; }
  getLastRow() { let n = this.rows.length; while (n > 0 && !(this.rows[n - 1] || []).some(v => v !== "" && v !== undefined && v !== null)) n--; return n; }
  getLastColumn() { return this.rows.reduce((m, r) => Math.max(m, (r || []).length), 0); }
  put(r, c, v) { while (this.rows.length < r) this.rows.push([]); const row = this.rows[r - 1]; while (row.length < c) row.push(""); row[c - 1] = store(v); }
  appendRow(arr) {
    if (this.onAppend) this.onAppend(arr, this);
    this.env.events.push(["appendRow", this.name, arr.slice()]);
    this.rows.length = this.getLastRow();
    this.rows.push(arr.map(store));
    return this;
  }
  getDataRange() {
    if (this.onRead) this.onRead(this);
    const nr = Math.max(1, this.getLastRow()), nc = Math.max(1, this.getLastColumn());
    return new Range(this, 1, 1, nr, nc);
  }
  getRange(r, c, nr, nc) { if (typeof r !== "number") throw new Error("A1 ranges not mocked"); return new Range(this, r, c, nr, nc); }
  setFrozenRows() { return this; }
}
class Spreadsheet {
  constructor(env, id, name) { this.env = env; this.id = id; this.name = name; this.sheets = []; }
  getId() { return this.id; } getName() { return this.name; }
  getUrl() { return "https://docs.google.com/spreadsheets/d/" + this.id; }
  getSheetByName(n) { return this.sheets.find(s => s.name === n) || null; }
  getSheets() { return this.sheets.slice(); }
  insertSheet(name, idx) {
    if (this.getSheetByName(name)) throw new Error("A sheet with the name \"" + name + "\" already exists");
    const s = new Sheet(this.env, name);
    if (typeof idx === "number") this.sheets.splice(idx, 0, s); else this.sheets.push(s);
    return s;
  }
  deleteSheet(s) { this.sheets = this.sheets.filter(x => x !== s); }
  getSpreadsheetTimeZone() { return this.env.sheetTz; }
  getEditors() { return this.env.editors.map(e => ({ getEmail: () => e })); }
  getViewers() { return this.env.viewers.map(e => ({ getEmail: () => e })); }
  getRangeByName() { return null; }
  addTab(name, rows) { const s = new Sheet(this.env, name, rows); this.sheets.push(s); return s; }
}

// ---------- environment ----------
const BASE_PROPS = {
  META_PAGE_TOKEN: "tok", META_FORM_IDS: "F1", CLICKSEND_USER: "u", CLICKSEND_KEY: "k", ONCALL_MOBILE: "07700900001",
  HEALTH_EMAIL: "owner@personal.test,info@kirkcaldydental.co.uk", HEALTH_SMS: "07700900999", OWNER_EMAIL: "info@kirkcaldydental.co.uk",
  META_SINCE_BY_FORM: JSON.stringify({ F1: 1 })   // form already known (so no created_time lookup) unless a test removes it
};
const OWNER_SMS = "+447700900999", CALLER_SMS = "+447700900001";

function mkEnv(opts) {
  opts = opts || {};
  const clock = { now: Date.parse(opts.now || "2026-11-10T11:00:00Z") };
  class D extends Date {
    constructor(...a) { if (a.length === 0) super(clock.now); else super(...a); }
    static now() { return clock.now; }
  }
  const env = {
    clock, D, events: [], mails: [], sms: [], fetches: [], pings: [], logs: [], triggers: [], sheetTz: "Europe/London", scriptTz: "Europe/London",
    user: "info@kirkcaldydental.co.uk", editors: ["info@kirkcaldydental.co.uk"], viewers: [], quota: 1400, sharing: "PRIVATE",
    props: Object.assign({}, opts.noBaseProps ? {} : BASE_PROPS, opts.props || {}),
    smsResult: null,           // fn(to, body) -> status string; default SUCCESS
    meta: { forms: { F1: { id: "F1", name: "Waitlist v1", status: "ACTIVE", created_time: "2026-11-01T10:00:00+0000", leads: [], leads_count: 0 } },
      pageForms: null, error: null, version: "v27.0", insightsLeads: null },
    ads: null, balance: 40, csAccountCode: 200, csHistory: [], dns: null, site: null, drive: { files: {}, folders: {} }, nextId: 1
  };
  env.at = s => londonDate(s, D);
  env.setNow = s => { clock.now = /Z$|[+-]\d\d:\d\d$/.test(s) ? Date.parse(s) : londonDate(s, D).getTime(); };
  env.advance = mins => { clock.now += mins * 60000; };
  env.minsAgo = m => new D(clock.now - m * 60000);

  // spreadsheet
  const ss = env.ss = new Spreadsheet(env, "SS1", "Kirkcaldy Dental - Waiting List");
  env.drive.files.SS1 = { id: "SS1", name: ss.name, created: clock.now, parent: null, ss };
  ss.addTab("Dashboard", [["Dashboard"]]);
  const headers = opts.headers || WL_HEADERS;
  env.wl = ss.addTab("Waiting list", [headers.slice()]);
  if (!opts.noSmsLog) env.smsLog = ss.addTab("SMS log", [SMS_HEADERS.slice()]);
  if (!opts.noCallLog) env.callLog = ss.addTab("Call log", [CALL_HEADERS.slice()]);
  env.H = n => env.wl.rows[0].indexOf(n);
  env.row = obj => {   // add a Waiting list row from {header: value}
    const h = env.wl.rows[0], r = h.map(n => (obj[n] === undefined ? "" : obj[n]));
    env.wl.rows.push(r.map(store));
    return env.wl.rows.length;
  };
  env.rowObj = i => { const h = env.wl.rows[0], o = {}; h.forEach((n, j) => { o[n] = (env.wl.rows[i - 1] || [])[j]; }); return o; };
  env.dataRows = () => env.wl.rows.slice(1).filter(r => r.some(v => v !== ""));

  // properties
  const P = {
    getProperty: k => (Object.prototype.hasOwnProperty.call(env.props, k) ? env.props[k] : null),
    setProperty: (k, v) => { env.props[k] = String(v); return P; },
    setProperties: o => { Object.keys(o).forEach(k => { env.props[k] = String(o[k]); }); return P; },
    deleteProperty: k => { delete env.props[k]; return P; },
    getProperties: () => Object.assign({}, env.props),
    getKeys: () => Object.keys(env.props)
  };

  // HTTP
  let msgId = 1000;
  function json(code, body, headers) { return { code, body: typeof body === "string" ? body : JSON.stringify(body), headers: headers || {} }; }
  function q(url) { const o = {}; const s = url.split("?")[1] || ""; s.split("&").forEach(kv => { const i = kv.indexOf("="); if (i > 0) o[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1)); }); return o; }
  env.q = q;
  function graph(url) {
    const m = url.match(/graph\.facebook\.com\/(v[\d.]+)\/([^?]*)/), ver = m[1], p = m[2], params = q(url);
    if (env.meta.error) { const e = typeof env.meta.error === "function" ? env.meta.error(url) : env.meta.error; if (e) return json(e.http || 400, { error: { code: e.code, message: e.message || "err" } }); }
    const H = { "facebook-api-version": env.meta.answerVersion || ver };
    if (p === "me") return json(200, { id: "1", name: "System user" }, H);
    if (p === "me/accounts") return json(200, { data: [{ id: env.props.META_PAGE_ID || "PAGE", access_token: "pagetok" }] }, H);
    if (/\/leadgen_forms$/.test(p)) return json(200, { data: env.meta.pageForms || Object.values(env.meta.forms).map(f => ({ id: f.id, name: f.name, status: f.status, created_time: f.created_time, leads_count: f.leads_count })) }, H);
    let mm = p.match(/^([^/]+)\/leads$/);
    if (mm) {
      const f = env.meta.forms[mm[1]];
      if (!f) return json(400, { error: { code: 100, message: "Unsupported get request" } });
      let after = -Infinity;
      try { after = JSON.parse(params.filtering)[0].value; } catch (e) {}
      env.lastLeadsFilter = after; env.lastLeadsFields = params.fields;
      return json(200, { data: f.leads.filter(l => Date.parse(l.created_time) / 1000 > after) }, H);
    }
    if (/^act_/.test(p) && env.ads) return json(200, env.adsGraph(p, params), H);
    if (env.meta.forms[p]) { const f = env.meta.forms[p]; return json(200, { id: f.id, name: f.name, status: f.status, created_time: f.created_time, leads_count: f.leads_count }, H); }
    return json(200, { data: [] }, H);
  }
  env.adsGraph = (p, params) => {
    const a = env.ads;
    if (/\/insights$/.test(p)) {
      if (params.date_preset === "today") return { data: [{ spend: String(a.todaySpend || 0), impressions: String(a.todayImps === undefined ? 1000 : a.todayImps), actions: [{ action_type: "onsite_conversion.lead_grouped", value: String(a.todayLeads || 0) }] }] };
      return { data: [] };
    }
    if (/\/campaigns$/.test(p)) return { data: a.campaigns || [] };
    if (/\/adsets$/.test(p)) return { data: a.adsets || [] };
    if (/\/ads$/.test(p)) return { data: a.adList || [] };
    if (/\/activities$/.test(p)) return { data: a.activities || [] };
    if (/^act_\d+$/.test(p)) return Object.assign({ name: "KDIC", account_status: 1, amount_spent: "1000", spend_cap: "0", currency: "GBP", timezone_name: "Europe/London" }, a.account || {});
    return { data: [] };
  };
  function route(url, o) {
    if (/graph\.facebook\.com/.test(url)) return graph(url);
    if (/rest\.clicksend\.com\/v3\/sms\/send/.test(url)) {
      const m = JSON.parse(o.payload).messages[0];
      const status = env.smsResult ? env.smsResult(m.to, m.body) : "SUCCESS";
      if (status === "THROW") throw new Error("Address unavailable: rest.clicksend.com");
      const id = "M" + (msgId++);
      env.sms.push({ to: m.to, body: m.body, status, id, t: clock.now });
      env.events.push(["sms", m.to, m.body]);
      return json(status === "HTTP401" ? 401 : 200, { data: { messages: [{ message_id: id, status: status === "HTTP401" ? "" : status, message_price: "0.0770" }] } });
    }
    if (/rest\.clicksend\.com\/v3\/account/.test(url)) return env.csAccountCode === 200 ? json(200, { data: { balance: env.balance } }) : json(env.csAccountCode, { response_code: "UNAUTHORIZED" });
    if (/rest\.clicksend\.com\/v3\/sms\/history/.test(url)) return env.csAccountCode === 200 ? json(200, { data: { data: env.csHistory, last_page: 1 } }) : json(env.csAccountCode, {});
    if (/hc-ping\.com/.test(url)) { env.pings.push(url); return json(200, "OK"); }
    if (/dns\.google\/resolve/.test(url)) {
      const p = q(url), key = p.name + "|" + p.type, d = env.dns || {};
      const types = { A: 1, MX: 15, TXT: 16 };
      return json(200, { Status: 0, Answer: (d[key] || []).map(x => ({ name: p.name, type: types[p.type], data: x })) });
    }
    if (env.site) { const r = env.site(url, o); if (r) return r; }
    return json(404, "Not found");
  }
  const UrlFetchApp = {
    fetch: (url, o) => {
      o = o || {};
      env.fetches.push(url);
      const r = route(url, o);
      return { getResponseCode: () => r.code, getContentText: () => r.body, getHeaders: () => r.headers || {}, getAllHeaders: () => r.headers || {} };
    }
  };

  // mail
  const MailApp = {
    getRemainingDailyQuota: () => env.quota,
    sendEmail: (a, b, c) => {
      const m = typeof a === "string" ? { to: a, subject: b, body: c } : { to: a.to, subject: a.subject, body: a.body || a.htmlBody };
      if (env.mailFail && env.mailFail(m)) throw new Error("Service invoked too many times for one day: email.");
      env.mails.push(m); env.events.push(["mail", m.to, m.subject]); env.quota--;
    }
  };
  // triggers
  let trigId = 1;
  const builder = name => {
    const t = { name, kind: "", timeBased: () => t, everyMinutes: n => { t.kind = "every " + n + "m"; return t; }, everyHours: n => { t.kind = "every " + n + "h"; return t; },
      atHour: h => { t.hour = h; return t; }, nearMinute: m => { t.minute = m; return t; }, everyDays: () => t, inTimezone: () => t, onWeekDay: () => t,
      forSpreadsheet: () => t, onEdit: () => t,
      create: () => { const tr = { id: trigId++, getHandlerFunction: () => name, getUniqueId: () => String(tr.id), kind: t.kind, hour: t.hour }; env.triggers.push(tr); return tr; } };
    return t;
  };
  const ScriptApp = { getProjectTriggers: () => env.triggers.slice(), deleteTrigger: t => { env.triggers = env.triggers.filter(x => x !== t); }, newTrigger: builder, WeekDay: { MONDAY: "MONDAY" } };
  env.addTriggers = names => names.forEach(n => builder(n).create());

  // Drive
  const fileObj = id => {
    const f = env.drive.files[id];
    if (!f) throw new Error("No file " + id);
    return { getId: () => f.id, getName: () => f.name, getDateCreated: () => new D(f.created), setTrashed: v => { f.trashed = !!v; }, isTrashed: () => !!f.trashed,
      moveTo: folder => { f.parent = folder.getId(); }, getSharingAccess: () => env.sharing };
  };
  const folderObj = id => ({
    getId: () => id, getName: () => env.drive.folders[id].name,
    addViewer: e => { const f = env.drive.folders[id]; if (env.shareFail) throw new Error("Sharing outside the domain is not allowed"); f.viewers = (f.viewers || []).concat([e]); },
    getFiles: () => { const list = Object.values(env.drive.files).filter(f => f.parent === id && !f.trashed).map(f => fileObj(f.id)); let i = 0; return { hasNext: () => i < list.length, next: () => list[i++] }; }
  });
  const DriveApp = {
    getFileById: fileObj, Access: { PRIVATE: "PRIVATE", ANYONE_WITH_LINK: "ANYONE_WITH_LINK" },
    getFolderById: id => { if (!env.drive.folders[id]) throw new Error("No folder " + id); return folderObj(id); },
    createFolder: name => { const id = "FOLDER" + (env.nextId++); env.drive.folders[id] = { name }; return folderObj(id); }
  };
  const SpreadsheetApp = {
    getActiveSpreadsheet: () => ss, getActive: () => ss, flush: () => {},
    create: name => { const id = "BK" + (env.nextId++), s = new Spreadsheet(env, id, name); s.addTab("Sheet1", []); env.drive.files[id] = { id, name, created: clock.now, parent: null, ss: s }; return s; },
    openById: id => { const f = env.drive.files[id]; if (!f || !f.ss) throw new Error("No spreadsheet " + id); return f.ss; }
  };
  const Utilities = {
    formatDate, sleep: () => {},
    parseDate: (s, tz, f) => londonDate(String(s).trim(), D),
    base64Encode: s => Buffer.from(String(s)).toString("base64")
  };
  const lockObj = () => ({ tryLock: () => env.lockFree !== false, waitLock: () => {}, releaseLock: () => {}, hasLock: () => true });
  const cacheStore = {};
  env.globals = {
    Date: D, PropertiesService: { getScriptProperties: () => P }, SpreadsheetApp, UrlFetchApp, MailApp, Utilities, DriveApp, ScriptApp,
    LockService: { getScriptLock: lockObj, getDocumentLock: lockObj },
    CacheService: { getScriptCache: () => ({ get: k => cacheStore[k] || null, put: (k, v) => { cacheStore[k] = v; } }) },
    GmailApp: { search: () => [], getInboxUnreadCount: () => 0 },
    Session: { getEffectiveUser: () => ({ getEmail: () => env.user }), getScriptTimeZone: () => env.scriptTz },
    ContentService: { createTextOutput: s => ({ getContent: () => s, setMimeType() { return this; } }) },
    MimeType: { GOOGLE_SHEETS: "application/vnd.google-apps.spreadsheet" },
    console: { log: (...a) => env.logs.push(["log", a.join(" ")]), warn: (...a) => env.logs.push(["warn", a.join(" ")]), error: (...a) => env.logs.push(["error", a.join(" ")]), info: () => {} }
  };
  const code = sources(opts).map(f => f[1]).join("\n;\n") + "\n;return function (n) { try { return eval(n); } catch (e) { if (e instanceof ReferenceError) return undefined; throw e; } };";
  const names = Object.keys(env.globals);
  const get = new Function(...names, code)(...names.map(n => env.globals[n]));
  env.get = get;
  env.fn = new Proxy({}, { get: (_, n) => get(n) });

  // helpers for assertions
  env.mailsTo = to => env.mails.filter(m => m.to === to);
  env.alertMails = () => env.mails.filter(m => /^\[KD-(P1|P2|OK)\]|^\[KD\]/.test(m.subject));
  env.ownerSms = () => env.sms.filter(s => s.to === OWNER_SMS);
  env.callerSms = () => env.sms.filter(s => s.to === CALLER_SMS);
  env.tab = n => ss.getSheetByName(n);
  env.state = k => { try { return JSON.parse(env.props["HA_" + k] || "null"); } catch (e) { return null; } };
  env.healthLog = () => { const t = ss.getSheetByName("Health log"); return t ? t.rows.slice(1) : []; };
  env.lead = (id, minsAgo, fields, extra) => Object.assign({
    id: String(id), created_time: new Date(clock.now - minsAgo * 60000).toISOString(), ad_id: "AD1", ad_name: "Ad A", form_id: "F1", platform: "fb", is_organic: false,
    field_data: Object.keys(fields || {}).map(k => ({ name: k, values: [fields[k]] }))
  }, extra || {});
  env.smsLogRow = (minsAgo, type, status, price) => env.smsLog.rows.push([new D(clock.now - minsAgo * 60000), type, "0001", "M" + (msgId++), status || "SUCCESS", price === undefined ? 0.077 : price, "", "", ""]);
  env.leadNames = [];        // names used in a test: must never appear in a health text to the owner
  env.checkOwnerSms = () => env.ownerSms().forEach(s => {
    assert.ok(s.body.length <= 160, "owner SMS over 160 chars: " + s.body);
    assert.ok(/^[\x20-\x7E]*$/.test(s.body), "owner SMS not plain ASCII: " + s.body);
    assert.ok(!/(\+44|0044|\b0)7\d{9}/.test(s.body.replace(/\s/g, "")), "owner SMS contains a phone number: " + s.body);
    env.leadNames.forEach(n => assert.ok(s.body.indexOf(n) === -1, "owner SMS contains a lead name (" + n + "): " + s.body));
  });
  return env;
}

// ---------- tiny test runner ----------
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }
function run() {
  let pass = 0, fail = 0;
  tests.forEach(t => {
    try { t.fn(); pass++; console.log("  ok    " + t.name); }
    catch (e) { fail++; console.log("  FAIL  " + t.name + "\n        " + String(e && e.stack || e).split("\n").slice(0, 6).join("\n        ")); }
  });
  console.log("\n" + pass + " passed, " + fail + " failed (" + tests.length + " tests)");
  if (fail) process.exitCode = 1;
  return { pass, fail };
}

module.exports = { mkEnv, test, run, assert, sources, leafletFile, leadsFile, WL_HEADERS, SMS_HEADERS, OWNER_SMS, CALLER_SMS, REPO, vm, formatDate, londonDate };
