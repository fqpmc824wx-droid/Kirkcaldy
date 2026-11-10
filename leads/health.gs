/**
 * Kirkcaldy Dental – automatic health checks and the alert router (ads chat).
 * Same Apps Script project as apps-script.gs, tracking.gs, meta-leads.gs and meta-ads.gs. Every name here starts with "health".
 * Plan: research/premortem-final.md section 3 (3.1 shape, 3.2 alert router, 3.3 checks H1–H24, 3.6 fire drill).
 *
 * What it does
 *   healthAlert()   ONE router for every alert. P1 (critical): email HEALTH_EMAIL at once, then a text to HEALTH_SMS
 *                   (not 22:00–07:00; at most 1 text an hour per problem and 3 a day). P2 (warning): email only, at most
 *                   every 3 hours per problem. Every alert goes in the "Health log" tab, and a RESOLVED email follows
 *                   once the check passes again; a problem that comes back after that is emailed at once.
 *                   Emails say: what happened / what it affects / what to do / sheet link. Texts go straight to ClickSend
 *                   (plain ASCII, one SMS, no lead names or numbers), so the lead-text limits can't block them.
 *   4 triggers      healthEvery5Min  H1 H2 H3 H4 H14a H15 H20 (+ H5 H6 every 15 min in calling hours)
 *                   healthHourly     H8 H14b H16 H19; 07–23 H12; 08–22 H9 H10; 09–21 H11; 08/12/16/20 H13; 10/12 H7; 21 H22
 *                   healthDaily      07:30 H17 H18 H24 (H23 on the 1st)          healthNightly  23:30 H21 backup
 *                   The hourly, daily and nightly runs check row 1 first (H4): while it's wrong, the checks that read
 *                   the Waiting list by column name wait (the backup is still taken).
 *
 * INSTALL (setup night, after meta-leads.gs, meta-ads.gs and tracking.gs are pasted)
 *   0. FIRST, row 1 of the Waiting list must have all 22 headers below exactly once. As soon as this file is in the project,
 *      the Facebook lead checker and the website form check row 1 and STOP if one is missing (website sign-ups then go to
 *      "Failed sign-ups"). The original sheet has only 11 columns, so: paste this file, then straight away run
 *      healthCheckHeaders() (lists what's missing, changes nothing) and healthAddMissingHeaders() (adds the missing headers
 *      at the right-hand end of row 1, moves nothing). It refuses if a header is there twice or almost right ("Lead ID ").
 *        Signup Time, Name, Phone, Email, Postcode, No. of People, Adult/Child/Family, Source, Status, Assigned to,
 *        Marketing consent, Notes, Lead ID, Logged at, Ad ID, Form ID, Duplicate of, SMS ID, SMS status, Email status,
 *        Call outcome, Status changed at
 *   1. + Add file "health" → paste this file → set HEALTH_VERSION just below → Save. Then step 0 at once.
 *   2. Script Properties (Project Settings → Script Properties) – the list below. HEALTH_EMAIL is required. HEALTH_SMS is
 *      needed for critical texts (owner decision pending: "critical problem alerts by text?"; blank = email only).
 *   3. Run healthInstallTriggers() once (adds 4 triggers; refuses if row 1 isn't ready or the project would go over 18).
 *   4. Fire drill: run healthTestAlert() – the owner should get a text, an email and a healthchecks.io "down" (plan 3.6).
 *
 * Script Properties (new)
 *   HEALTH_EMAIL         REQUIRED. Owner's personal email first, then info@kirkcaldydental.co.uk (comma-separated)
 *   HEALTH_SMS           owner's mobile – critical alerts only (OWNER_MOBILE stays empty). Blank = no alert texts.
 *   HEALTH_QUIET         22-7 (default): no owner texts 22:00–07:00; one text after 07:00 lists anything still open
 *   HEALTH_PING_POLLER / HEALTH_PING_DAILY / HEALTH_PING_BACKUP   healthchecks.io ping URLs (skipped if blank)
 *   META_PAGE_ID         the clinic Page ID (H10)
 *   HEALTH_SITE          https://kirkcaldydental.co.uk once the site is live (H16, H17 A record; skipped if blank)
 *   HEALTH_EXEC_ID       the web-app deployment ID (between /s/ and /exec)
 *   CALLER_SHIFT / CALLER_DAYS   e.g. 9-17 / Mon-Sat: when the caller really works (default CALL_HOURS, every day)
 *   HEALTH_BACKLOG       5 (warning level for leads waiting over an hour; 10 is always critical)
 *   HEALTH_BALANCE_WARN / HEALTH_BALANCE_CRIT   ClickSend £: 8 / 4 with auto top-up, 15 / 5 without (default 15 / 5)
 *   HEALTH_SMS_MAX / HEALTH_CALLER_MAX   daily limits on alert texts: owner 15, caller reminders 30 (defaults)
 *   ADS_EXPECTED_ON, ADS_PAUSED_UNTIL, ADS_ALLOWED_CAMPAIGNS, ADS_EXPECTED_BUDGET, FESTIVE_MAX   ad watchdog (meta-ads.gs)
 *   NHS_FIFE_LETTER_ID, CALL_CARD_APPROVED, PRIORITY_RULE_SIGNED, OPENING_TARGET, LAST_LIST_UPDATE, FESTIVE_COVER   gates (H24)
 *   HEALTH_BACKUP_FOLDER Drive folder ID for the nightly backups (made automatically if blank, and shared (view) with the
 *                        first HEALTH_EMAIL address outside kirkcaldydental.co.uk)
 *   HEALTH_EDITORS       emails allowed to edit the sheet (H18)       HEALTH_EXPECTED_USER  default info@kirkcaldydental.co.uk
 *   HEALTH_IGNORE_FORMS  form IDs H10 should ignore                    <NAME>_UNTIL  end (yyyy-mm-dd hh:mm) of a temporary change
 * Set automatically (don't edit): HA_*, HM_*, HEALTH_ROW1, HEALTH_BASELINE*, HEALTH_SMS_COUNT, HEALTH_CALLER_COUNT,
 *   HEALTH_SITE_FAILS, HEALTH_H9_STREAK, HEALTH_WEB_VERSION, HEALTH_CS_BALANCE, HEALTH_BACKUP_LAST, HEALTH_BACKUP_SHARED,
 *   HEALTH_QUIET_SUMMARY, HEALTH_SPAM_PAUSED, HEALTH_SPAM_OVERRIDE, HEALTH_URGENT_N, HEALTH_H8_LAST, META_LAST_ERR,
 *   ADS_ACTIVE_SINCE (meta-ads.gs).
 *
 * Manual helpers: healthCheckHeaders, healthAddMissingHeaders (step 0), healthTestAlert (fire drill), healthSetBaseline (after
 * deleting test rows on purpose), healthResendFailedTexts (runbook R4 step 5), healthInstallTriggers.
 *
 * Uses: leadsSheet, callWindow, inCallHours, leadText, niceFirstName, field, metaGraph, metaDoNotContact (meta-leads.gs);
 * ukMobile, sendSms (lead texts only: healthResendFailedTexts), SMS_FROM (apps-script.gs); trkLogSms, TRK_* tabs (tracking.gs);
 * adsAccount, adsToken, adsGraphGet, adsAction, adsStatusCheck (meta-ads.gs). Optional files are checked with typeof.
 */

var HEALTH_VERSION = "2026-11-08-ads";   // set at paste time to "<yyyy-mm-dd>-<commit>", e.g. "2026-11-09-3f2a1bc" (H16 and H18 show it)

var HEALTH_LOG_TAB = "Health log", HEALTH_FAILED_TAB = "Failed leads", HEALTH_FAILED_WEB_TAB = "Failed sign-ups";
var HEALTH_LOG_HEADERS = ["Time", "Level", "Key", "Subject", "State", "Emailed", "Texted", "Version"];
var HEALTH_FAILED_HEADERS = ["Failed at", "Lead ID", "Form ID", "Lead created", "Name", "Phone", "Email", "Postcode",
  "All answers", "Why", "Already texted?", "Alerted at", "Added + called (initials)"];
// Every Waiting list header the scripts rely on (H4): each must be in row 1 exactly once.
var HEALTH_SHEET_HEADERS = ["Signup Time", "Name", "Phone", "Email", "Postcode", "No. of People", "Adult/Child/Family", "Source",
  "Status", "Assigned to", "Marketing consent", "Notes", "Lead ID", "Logged at", "Ad ID", "Form ID", "Duplicate of", "SMS ID",
  "SMS status", "Email status", "Call outcome", "Status changed at"];
var HEALTH_STATUSES = ["", "Call 8am", "Called", "No answer", "Booked", "Not interested", "Duplicate", "DO NOT CONTACT",
  "Unreachable", "Wrong number", "Withdrew"];
// The 17 triggers the project should have: 4 lead + 3 ads + 6 tracking + these 4.
var HEALTH_TRIGGERS = ["pollMetaLeads", "morningSummary", "backlogCheck", "eveningReport", "adsPullInsights", "adsWeeklyPull",
  "adsStatusCheck", "trkOnSheetEdit", "trkRetryCheck", "trkPullSmsHistory", "trkScanBounces", "trkDailySnapshot", "trkWeeklyEmail",
  "healthEvery5Min", "healthHourly", "healthDaily", "healthNightly"];
var HEALTH_OWN_TRIGGERS = ["healthEvery5Min", "healthHourly", "healthDaily", "healthNightly"];
var HEALTH_ADS_TRIGGERS = ["adsPullInsights", "adsWeeklyPull", "adsStatusCheck"];   // added on launch day (adsInstallTriggers)
// The 12 tracking columns the original 11-column sheet didn't have (setup night: healthAddMissingHeaders adds them).
var HEALTH_SETUP_HEADERS = ["Assigned to", "Marketing consent", "Lead ID", "Logged at", "Ad ID", "Form ID", "Duplicate of", "SMS ID",
  "SMS status", "Email status", "Call outcome", "Status changed at"];
var HEALTH_MAX_TRIGGERS = 18;
var HEALTH_DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var HEALTH_BUSY = {};          // alert keys being sent right now (this run): an alert can never set itself off again
var HEALTH_MSG_DONE = {};      // message-only alerts (from the leaflet's sendSms) already handled in this run
var HEALTH_DAYMEMO = {};       // London day boundaries, for healthShiftMins

// ======================================================================================================
// Small helpers
// ======================================================================================================
function healthProps() { return PropertiesService.getScriptProperties(); }
function healthGet(name, dflt) {
  var v = healthProps().getProperty(name);
  v = v === null || v === undefined ? "" : String(v).trim();
  return v === "" ? (dflt === undefined ? "" : String(dflt)) : v;
}
function healthNum(name, dflt) { var v = healthGet(name), n = Number(v); return v !== "" && isFinite(n) ? n : dflt; }
function healthList(v) { return String(v || "").split(",").map(function (x) { return x.trim(); }).filter(String); }
function healthJson(name, dflt) {
  try { var v = healthProps().getProperty(name); return v ? JSON.parse(v) : dflt; } catch (e) { return dflt; }
}
function healthSetJson(name, v) { healthProps().setProperty(name, JSON.stringify(v)); }
function healthUrl() { try { return SpreadsheetApp.getActiveSpreadsheet().getUrl(); } catch (e) { return "(sheet link unavailable)"; } }
function healthTab(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name, ss.getSheets().length); sh.appendRow(headers); sh.setFrozenRows(1); }   // added at the end: Dashboard stays first
  return sh;
}
function healthCols(sh, last) {   // make sure the tab has at least `last` columns before writing past its right-hand edge
  try { if (sh.getMaxColumns && sh.getMaxColumns() < last) sh.insertColumnsAfter(sh.getMaxColumns(), last - sh.getMaxColumns()); }
  catch (e) { console.warn("Couldn't add columns: " + e); }
}
function healthPlural(n, word, many) { return n + " " + (n === 1 ? word : (many || word + "s")); }
function healthId(v) { return String(v === undefined || v === null ? "" : v).trim().replace(/^'/, "").replace(/^l:/i, "").trim(); }
function healthDigits(v) { var d = String(v || "").replace(/\D/g, ""); return d.length >= 10 ? d.slice(-10) : d; }
function healthMask(n) { var d = String(n || "").replace(/\D/g, ""); return d ? "mobile ending " + d.slice(-3) : "(blank)"; }
function healthEmailOk(e) { return /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(String(e)); }
function healthMobile(n) {   // 07…, +44 7…, +44 (0)7…, 0044 7… -> +447…  (ukMobile from apps-script.gs when it's there)
  if (typeof ukMobile === "function") return ukMobile(n);
  n = String(n || "").replace(/\(0\)/g, "").replace(/[^\d+]/g, "").replace(/^00/, "+");
  return /^07\d{9}$/.test(n) ? "+44" + n.slice(1) : /^447\d{9}$/.test(n) ? "+" + n : n;
}
function healthMobileOk(n) { return /^\+447\d{9}$/.test(healthMobile(n)); }
// Error texts without secrets: Apps Script network errors quote the request URL, and Graph URLs carry ?access_token=.
function healthScrub(s) {
  return String(s === undefined || s === null ? "" : s).replace(/(access_token=)[^&\s"']+/gi, "$1***")
    .replace(/((?:Basic|Bearer)\s+)[A-Za-z0-9+\/=._\-]{12,}/g, "$1***");
}

// ---------- London time ----------
function healthFmt(d, f) { return Utilities.formatDate(d instanceof Date ? d : new Date(d), "Europe/London", f); }
function healthHour(d) { return Number(healthFmt(d || new Date(), "H")); }
function healthMins(d) { return healthHour(d) * 60 + Number(healthFmt(d, "m")); }
function healthDay(d) { return healthFmt(d || new Date(), "yyyy-MM-dd"); }
function healthHM(d) {
  if (!d) return "never";
  d = d instanceof Date ? d : new Date(d);
  return healthDay(d) === healthDay(new Date()) ? healthFmt(d, "HH:mm") : healthFmt(d, "dd/MM HH:mm");
}
function healthDow(d) { return HEALTH_DOW.indexOf(healthFmt(d, "EEE")); }
// London wall-clock time `mins` after midnight, on the day `addDays` after d
function healthAt(d, addDays, mins) {
  addDays = (addDays || 0) + Math.floor(mins / 1440); mins = ((mins % 1440) + 1440) % 1440;
  var noon = new Date(d.getTime() + addDays * 864e5 + 12 * 36e5 - healthMins(d) * 6e4);
  return new Date(healthFmt(noon, "yyyy-MM-dd'T'") + ("0" + Math.floor(mins / 60)).slice(-2) + ":" + ("0" + (mins % 60)).slice(-2) +
    ":00" + healthFmt(noon, "XXX"));
}
// Reads "2026-11-09 18:00", "2026-11-09T18:00", "2026-11-09" (= end of that day), "09/11/2026 18:00" (London), or epoch.
function healthParseTime(v) {
  v = String(v || "").trim();
  if (!v) return null;
  if (/^\d{12,13}$/.test(v)) return new Date(Number(v));
  if (/^\d{9,10}$/.test(v)) return new Date(Number(v) * 1000);
  var m = v.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?$/) || null, ymd;
  if (m) ymd = [m[1], m[2], m[3], m[4], m[5]];
  else { m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/); if (m) ymd = [m[3], ("0" + m[2]).slice(-2), ("0" + m[1]).slice(-2), m[4], m[5]]; }
  if (ymd) {
    var base = new Date(ymd[0] + "-" + ymd[1] + "-" + ymd[2] + "T12:00:00Z");
    if (isNaN(base.getTime())) return null;
    return healthAt(base, 0, ymd[3] === undefined ? 23 * 60 + 59 : Number(ymd[3]) * 60 + Number(ymd[4]));
  }
  var t = Date.parse(v);
  return isNaN(t) ? null : new Date(t);
}
function healthDur(mins) {
  var m = Math.max(0, Math.round(mins)), h = Math.floor(m / 60);
  return h ? h + "h" + (m % 60 ? ("0" + (m % 60)).slice(-2) + "m" : "") : m + "m";
}

// ---------- calling hours, caller shift, quiet hours ----------
function healthClockStart(t) {   // when the "call within the hour" clock starts: at once in calling hours, else at opening time
  var w = callWindow(), m = healthMins(t);
  if (m >= w.to * 60) return healthAt(t, 1, w.from * 60);
  if (m < w.from * 60) return healthAt(t, 0, w.from * 60);
  return t;
}
function healthShift() {
  var w = callWindow(), m = healthGet("CALLER_SHIFT").match(/^(\d{1,2})(?::(\d{2}))?\s*-\s*(\d{1,2})(?::(\d{2}))?$/);
  return {
    from: m ? Number(m[1]) * 60 + Number(m[2] || 0) : w.from * 60,
    to: m ? Number(m[3]) * 60 + Number(m[4] || 0) : w.to * 60,
    days: healthDays(healthGet("CALLER_DAYS", "Mon-Sun"))
  };
}
function healthDays(v) {   // "Mon-Sat", "Mon,Wed,Fri", "Fri-Mon" -> {0..6: true}
  var on = {}, idx = function (s) { return HEALTH_DOW.map(function (x) { return x.toLowerCase(); }).indexOf(String(s).slice(0, 3).toLowerCase()); };
  healthList(String(v).replace(/\s+/g, "")).forEach(function (part) {
    var r = part.split("-"), a = idx(r[0]), b = r.length > 1 ? idx(r[1]) : a;
    if (a === -1 || b === -1) return;
    for (var i = a, n = 0; n < 7; i = (i + 1) % 7, n++) { on[i] = true; if (i === b) break; }
  });
  if (!Object.keys(on).length) for (var k = 0; k < 7; k++) on[k] = true;
  return on;
}
function healthInShift(d, s) { s = s || healthShift(); var m = healthMins(d); return !!s.days[healthDow(d)] && m >= s.from && m < s.to; }
// Minutes inside the caller's shift between two times. Steps London calendar days (noon to noon), so the clock changes
// never skip or repeat a day. Counts at most 32 days.
function healthShiftMins(from, to, s) {
  s = s || healthShift();
  var a = from instanceof Date ? from.getTime() : Number(from), b = to instanceof Date ? to.getTime() : Number(to), total = 0;
  if (!(b > a)) return 0;
  var noon = healthAt(new Date(a), 0, 12 * 60).getTime();   // +24 h from a London noon stays within an hour of the next noon
  for (var k = 0; k < 32; k++, noon += 864e5) {
    var d = healthShiftDay(healthDay(new Date(noon)), s);
    if (d.mid > b) break;
    if (s.days[d.dow]) total += Math.max(0, Math.min(b, d.en) - Math.max(a, d.st));
  }
  return total / 6e4;
}
function healthShiftDay(ymd, s) {   // {mid: midnight, st: shift start, en: shift end, dow} of one London date (kept for the run)
  var k = ymd + "|" + s.from + "|" + s.to;
  if (!HEALTH_DAYMEMO[k]) {
    var base = new Date(ymd + "T12:00:00Z");
    HEALTH_DAYMEMO[k] = { mid: healthAt(base, 0, 0).getTime(), st: healthAt(base, 0, s.from).getTime(), en: healthAt(base, 0, s.to).getTime(), dow: healthDow(base) };
  }
  return HEALTH_DAYMEMO[k];
}
function healthQuiet(d) {
  var m = healthGet("HEALTH_QUIET", "22-7").match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
  if (!m) return false;                                   // "off" = no quiet hours
  var a = Number(m[1]), b = Number(m[2]), h = healthHour(d || new Date());
  return a === b ? false : a > b ? (h >= a || h < b) : (h >= a && h < b);
}

// ---------- run context: each run reads the Waiting list once and shares it ----------
function healthCtx() { return { started: Date.now() }; }
function healthWl(ctx) {
  ctx = ctx || {};
  if (ctx.wl) return ctx.wl;
  var sh = leadsSheet(), data = sh.getDataRange().getValues(), h = (data[0] || []).map(String), C = {};
  h.forEach(function (n, i) { if (C[n] === undefined) C[n] = i; });
  ctx.wl = { sh: sh, data: data, h: h, C: C };
  return ctx.wl;
}
function healthV(W, row, name) { var c = W.C[name]; return c === undefined ? "" : row[c]; }
function healthIsMeta(W, row) { var id = healthId(healthV(W, row, "Lead ID")); return !!id && !/^W-/i.test(id); }   // real Meta lead, not a website "W-" row

// ======================================================================================================
// Alert router (plan 3.2)
// ======================================================================================================
function healthEmails(alsoOwner) {
  var to = healthList(healthGet("HEALTH_EMAIL")).filter(healthEmailOk);
  if (alsoOwner || !to.length) healthList(healthGet("OWNER_EMAIL")).filter(healthEmailOk).forEach(function (e) { if (to.indexOf(e) === -1) to.push(e); });
  return to;
}
function healthSmsTo() { return healthList(healthGet("HEALTH_SMS")).filter(healthMobileOk); }

// Alert texts: plain ASCII, one SMS (160 characters), never a phone number.
function healthSmsText(s) {
  s = String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\u00A3/g, "GBP")
    .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, "\"").replace(/[\u2013\u2014]/g, "-").replace(/\u2026/g, "...")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/(\+44|0044|\b0)\s?7\d{3}\s?\d{3}\s?\d{3}\b/g, "[number]")
    .replace(/\s+/g, " ").trim();
  return s.length > 160 ? s.slice(0, 157).trim() + "..." : s;
}
function healthSubject(s) {
  return String(s || "").replace(/[\u2013\u2014]/g, "-").replace(/[\uD800-\uDFFF]|[\u2600-\u27BF]|\uFE0F|\u200D/g, "")
    .replace(/^\s*\[KD[^\]]*\]\s*/, "").replace(/\s+/g, " ").trim();
}
function healthSendEmail(to, subject, body) {
  var sent = 0;
  to.forEach(function (e) {
    try { MailApp.sendEmail({ to: e, subject: subject, body: body, name: "Kirkcaldy Dental alerts" }); sent++; }
    catch (err) { console.error("Alert email to " + e + " failed: " + err); }
  });
  return sent;
}
// Alert texts go straight to ClickSend, not through sendSms(): the leaflet's lead-text caps (SMS_HOURLY_MAX / SMS_DAILY_MAX)
// can't swallow a critical text, and a failing alert text can't set off another alert. Logged in the SMS log (trkLogSms).
// Daily caps, counting only texts ClickSend accepted: HEALTH_SMS_MAX (default 15) for the owner, HEALTH_CALLER_MAX
// (default 30) for the caller reminders (kind "caller"), so caller reminders can never use up the owner's critical texts.
function healthSendSms(numbers, text, kind) {
  var user = healthGet("CLICKSEND_USER"), key = healthGet("CLICKSEND_KEY");
  if (!user || !key || !numbers || !numbers.length) return 0;          // blank keys: H3 reports it (and pings healthchecks /fail)
  text = healthSmsText(text);
  var caller = kind === "caller", prop = caller ? "HEALTH_CALLER_COUNT" : "HEALTH_SMS_COUNT";
  var c = healthGet(prop).split("|"), today = healthDay(), n = c[0] === today ? Number(c[1]) || 0 : 0;
  var max = caller ? healthNum("HEALTH_CALLER_MAX", 30) : healthNum("HEALTH_SMS_MAX", 15), ok = 0;
  numbers.forEach(function (to) {
    if (n >= max) { console.warn("Health text limit for today reached (" + prop + " " + max + ")"); return; }
    if (healthClickSend(to, text, user, key).status === "SUCCESS") { ok++; n++; }
  });
  if (ok) healthProps().setProperty(prop, today + "|" + n);
  return ok;
}
function healthClickSend(to, text, user, key) {
  var num = healthMobile(to), result;
  if (!/^\+447\d{9}$/.test(num)) { console.warn("Alert text skipped: not a UK mobile (" + healthMask(to) + ")"); return { id: "", status: "NOT_A_UK_MOBILE", price: "" }; }
  try {
    var res = UrlFetchApp.fetch("https://rest.clicksend.com/v3/sms/send", {
      method: "post", contentType: "application/json", muteHttpExceptions: true,
      headers: { Authorization: "Basic " + Utilities.base64Encode(user + ":" + key) },
      payload: JSON.stringify({ messages: [{ source: "apps-script", from: typeof SMS_FROM !== "undefined" ? SMS_FROM : "KirkDental", to: num, body: text }] })
    });
    var code = res.getResponseCode(), m0 = {};
    try { m0 = ((JSON.parse(res.getContentText()).data || {}).messages || [])[0] || {}; } catch (e) {}
    result = { id: m0.message_id || "", status: m0.status || (code === 200 ? "UNKNOWN" : "HTTP " + code), price: m0.message_price || "" };
  } catch (e) { console.error("Alert text failed: " + healthScrub(e)); result = { id: "", status: "ERROR", price: "" }; }
  if (result.status !== "SUCCESS") console.error("Alert text not accepted by ClickSend: " + result.status);
  if (typeof trkLogSms === "function") trkLogSms("health", num, result);
  return result;
}
// healthchecks.io: ping the URL in a Script Property (suffix "/fail" = report a failure). Skipped silently if not set.
function healthPing(prop, suffix) {
  var u = healthGet(prop);
  if (!u) return false;
  try { return UrlFetchApp.fetch(u.replace(/\/+$/, "") + (suffix || ""), { muteHttpExceptions: true }).getResponseCode() < 300; }
  catch (e) { console.warn("Ping " + prop + " failed: " + e); return false; }
}
function healthLog(level, key, subject, state, emailed, texted) {
  try {
    healthTab(HEALTH_LOG_TAB, HEALTH_LOG_HEADERS).appendRow([new Date(), level, key, String(subject).slice(0, 300), state,
      emailed ? "Yes" : "No", texted ? "Yes" : "No", HEALTH_VERSION]);
  } catch (e) { console.error("Health log failed: " + e); }
}
function healthState(key) { var s = healthJson("HA_" + key, {}); return s && typeof s === "object" ? s : {}; }
function healthBody(level, key, subject, body, opts) {
  var str = typeof body === "string" || body === undefined || body === null;   // plain-text bodies carry their own instructions
  var b = str ? { what: String(body || subject), affects: "See above.", todo: "See WHAT HAPPENED above. If you're not sure what to do, forward this email to the ads chat." } : body;
  var out = "WHAT HAPPENED\n" + b.what +
    "\n\nWHAT IT AFFECTS\n" + (b.affects || "See above.") +
    "\n\nWHAT TO DO\n" + (b.todo || "Open the Waiting List sheet and the Health log tab. If you're not sure, forward this email to the ads chat.") +
    (b.plan ? "\n(Step-by-step fix: runbook " + b.plan + " in the launch risk plan, section 5.)" : "") +
    "\n\nWaiting List sheet: " + healthUrl() +
    "\n\n-- \n" + (level === "P1" ? "Critical (P1)" : "Warning (P2)") + " alert " + key + ", " + healthFmt(new Date(), "dd/MM/yyyy HH:mm") +
    ", version " + HEALTH_VERSION + "." + (opts.event ? "" : " You'll get a RESOLVED email when the check passes again.") +
    (level === "P1" && !opts.noSms ? " Critical alerts are also texted to HEALTH_SMS (not 22:00-07:00)." : "");
  return out;
}

/**
 * healthAlert(level, key, subject, body, opts)
 *   level  "P1" (email now + text) or "P2" (email only, at most every 3 h per key)
 *   key    one per problem; the same key is used to resolve it (healthResolve)
 *   body   string, or {what, affects, todo, plan}
 *   opts   sms      text for HEALTH_SMS (default "KD P1: " + subject)   noSms   ClickSend itself is the failure: healthchecks /fail instead
 *          caller   text for the caller(s) (ONCALL_MOBILE), calling hours only, at most every 60 min (callerEvery)
 *          every    ms between emails (P2 default 3 h; P1 reminder default 3 h)   sig  "what's wrong" – a new sig means new information
 *          event    a one-off (not kept open, no RESOLVED email)   noState  don't store anything (one-off keys)   short  name for texts
 *          noEmail  text/log only   ignoreQuiet  text even in quiet hours (manual tests)   smsAlways  skip the per-key text limits
 *          alsoOwner  also email OWNER_EMAIL (used by healthNotifyOnce)
 * Also accepts healthAlert(level, message) – the form the leaflet's sendSms uses (see healthAlertMessage).
 * A problem that comes back after its RESOLVED email is emailed (and texted) at once. Sends first, records after.
 * Throws if there is nobody to email (so Google's trigger-failure email fires).
 */
function healthAlert(level, key, subject, body, opts) {
  if (subject === undefined || subject === null || String(subject).trim() === "") return healthAlertMessage(level, key, body, opts);
  opts = opts || {};
  level = String(level).toUpperCase() === "P1" || level === 1 ? "P1" : "P2";
  if (HEALTH_BUSY[key]) { console.warn("Alert " + key + " is already being sent in this run"); return { emailed: false, texted: false }; }
  HEALTH_BUSY[key] = true;
  try {
    var now = Date.now(), today = healthDay(new Date(now)), st = opts.noState ? {} : healthState(key);
    var clean = healthSubject(subject), sig = String(opts.sig === undefined ? "" : opts.sig);
    var every = opts.every !== undefined ? opts.every : 3 * 36e5, since = now - (st.lastEmail || 0);
    var openBefore = !!st.open, escalated = openBefore && level === "P1" && st.level !== "P1";
    var fresh = !openBefore || st.sig !== sig;
    var reopened = !opts.event && !openBefore && !!st.okEmailAt && st.okEmailAt >= (st.lastEmail || 0);   // the owner's last word was RESOLVED
    var email;
    if (opts.event) email = since >= (opts.every !== undefined ? opts.every : (level === "P1" ? 0 : 3 * 36e5));
    else if (level === "P1") email = reopened || (escalated && now - (st.lastP1Email || 0) >= every) || (fresh && since >= 10 * 6e4) || since >= every;
    else email = reopened || since >= every;
    if (opts.noEmail) email = false;

    // 1. email
    var to = opts.noEmail ? [] : healthEmails(opts.alsoOwner), emailed = false;
    if (email && to.length) emailed = healthSendEmail(to, "[KD-" + level + "] " + clean, healthBody(level, key, clean, body, opts)) > 0;
    // 2. text (P1 only): at most 1 an hour and 3 a day per problem; a text that didn't go is tried again after 10 min
    var texted = false;
    if (level === "P1" && !opts.noSms) {
      var smsCount = st.smsDay === today ? st.smsCount || 0 : 0, lastOk = st.lastSms || 0, lastTry = Math.max(st.lastSmsTry || 0, lastOk);
      var due = opts.smsAlways || (smsCount < 3 && (lastTry > lastOk ? now - lastTry >= 10 * 6e4 : reopened || now - lastOk >= 60 * 6e4));
      if (due && !opts.ignoreQuiet && healthQuiet(new Date(now))) { st.smsPending = true; due = false; }
      if (due) {
        texted = healthSendSms(healthSmsTo(), opts.sms || "KD P1: " + clean) > 0;
        st.lastSmsTry = now;
        if (texted) { st.lastSms = now; st.smsPending = false; st.smsDay = today; st.smsCount = smsCount + 1; }
      }
    }
    if (level === "P1" && opts.noSms && now - (st.lastFailPing || 0) >= 60 * 6e4) {   // ClickSend is the problem: tell healthchecks.io instead
      if (healthPing(healthGet("HEALTH_PING_DAILY") ? "HEALTH_PING_DAILY" : "HEALTH_PING_POLLER", "/fail")) st.lastFailPing = now;
    }
    // 3. caller text (work the caller can act on) – its own daily cap
    if (opts.caller && inCallHours(new Date(now)) && now - (st.lastCaller || 0) >= (opts.callerEvery || 60 * 6e4)) {
      if (healthSendSms(healthList(healthGet("ONCALL_MOBILE")), opts.caller, "caller")) st.lastCaller = now;
    }
    // 4. record (after sending)
    if (emailed) { st.lastEmail = now; if (level === "P1") st.lastP1Email = now; }
    if (!opts.noState) {
      if (!(opts.event && openBefore)) { st.level = level; st.subject = clean; st.sig = sig; if (opts.short) st.short = opts.short; }
      st.lastSeen = now;
      if (!opts.event) {
        if (!openBefore) { st.first = now; st.emailedEpisode = false; }
        st.open = true; st.passSince = 0;                         // failing again: a pending "passing for an hour" starts over
        if (emailed) st.emailedEpisode = true;
      }
      healthSetJson("HA_" + key, st);
    }
    if (emailed || texted || (!opts.event && (fresh || escalated)))
      healthLog(level, key, clean, opts.event ? "event" : !openBefore ? (reopened ? "reopened" : "open") : escalated ? "escalated" : fresh ? "changed" : "repeat", emailed, texted);
    if (!opts.noEmail && !to.length) {
      var err = new Error("No alert email address: set Script Property HEALTH_EMAIL (the owner's personal email). Alert not emailed: " + clean);
      err.healthNoRecipients = true;
      throw err;
    }
    return { emailed: emailed, texted: texted };
  } finally { delete HEALTH_BUSY[key]; }
}

// healthAlert(level, message) with no key or subject – the leaflet's sendSms calls it like this for "ClickSend keys missing"
// and "A caller alert number is not a UK mobile". Settings problems go to H3 (one alert with the details and its own
// throttle); anything else gets a key made from the message (emailed at most every 3 h). Never throws (it's called from
// inside sendSms).
function healthAlertMessage(level, msg, body, opts) {
  msg = healthSubject(msg) || "Unknown problem";
  if (HEALTH_MSG_DONE[msg]) return HEALTH_MSG_DONE[msg];          // once per run (sendSms may call it for every caller)
  var res = HEALTH_MSG_DONE[msg] = { emailed: false, texted: false };
  try {
    if (/ClickSend keys|CLICKSEND_|UK mobile|ONCALL_MOBILE|OWNER_MOBILE/i.test(msg) && healthConfigCheck().length) return res;
    var sms = /ClickSend|text|SMS|mobile|ONCALL|OWNER_MOBILE/i.test(msg);
    var r = healthAlert(level, "MSG_" + msg.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40), msg,
      body && typeof body === "object" ? body : {
        what: msg + "." + (body ? "\n" + body : ""),
        affects: sms ? "Some texts (thank-you texts to leads, new-lead alerts to the caller, or alerts to you) may not be going out." : "See above.",
        todo: sms ? "Apps Script > Project Settings > Script Properties: check CLICKSEND_USER, CLICKSEND_KEY, ONCALL_MOBILE and OWNER_MOBILE (mobiles as 07... or +447...; OWNER_MOBILE normally empty). If you're not sure, forward this email to the ads chat."
          : "Forward this email to the ads chat.",
        plan: sms ? "R4/R5" : ""
      }, Object.assign({ short: msg.slice(0, 30), noSms: /ClickSend keys/i.test(msg), event: true, every: 3 * 36e5 }, opts || {}));   // nothing resolves it: a one-off, at most every 3 h
    res.emailed = r.emailed; res.texted = r.texted;
  } catch (e) { console.error("Alert failed: " + msg + ": " + e); }
  return res;
}

// The check passes again: one RESOLVED email (only if an alert email went out for this problem). A problem that has
// come and gone twice in 6 hours is only resolved after it has passed for a whole hour: until then the owner's last email
// still (rightly) says it's broken, and there's no alert/RESOLVED ping-pong.
function healthResolve(key, note) {
  var st = healthState(key);
  if (!st.open) return false;
  var now = Date.now(), emailed = false, ok = (st.okTimes || []).filter(function (t) { return now - t < 6 * 36e5; });
  if (st.emailedEpisode && ok.length >= 2) {
    if (!st.passSince) {
      st.passSince = now; healthSetJson("HA_" + key, st);
      healthLog(st.level || "", key, st.subject || key, "passing (it keeps coming back: RESOLVED after an hour of passing)", false, false);
      return false;
    }
    if (now - st.passSince < 60 * 6e4) return false;
  }
  if (st.emailedEpisode) {
    var to = healthEmails();
    if (to.length) emailed = healthSendEmail(to, "[KD-OK] RESOLVED: " + st.subject,
      "WHAT HAPPENED\nThe check passed again at " + healthHM(new Date()) + " (problem first seen " + healthHM(st.first) + ").\n" + (note ? note + "\n" : "") +
      "\nWHAT IT AFFECTS\nNothing now.\n\nWHAT TO DO\nNothing, unless you changed a setting temporarily to fix it - then put it back." +
      "\n\nWaiting List sheet: " + healthUrl()) > 0;
    if (emailed) { ok.push(now); st.okEmailAt = now; }
  }
  st.okTimes = ok;
  st.open = false; st.smsPending = false; st.resolvedAt = now; st.passSince = 0;
  healthSetJson("HA_" + key, st);
  healthLog(st.level || "", key, st.subject || key, "resolved", emailed, false);
  return true;
}

// Problems still open (a check that stopped re-raising its alert for 26 h is treated as gone).
function healthOpenAlerts() {
  var all = healthProps().getProperties(), out = [], now = Date.now();
  Object.keys(all).forEach(function (k) {
    if (k.indexOf("HA_") !== 0) return;
    var st; try { st = JSON.parse(all[k]); } catch (e) { return; }
    if (!st || !st.open) return;
    if (now - (st.lastSeen || 0) > 26 * 36e5) { st.open = false; st.expired = now; healthProps().setProperty(k, JSON.stringify(st)); return; }
    out.push({ key: k.slice(3), level: st.level, subject: st.subject, first: st.first, short: st.short });
  });
  return out.sort(function (a, b) { return (a.level === "P1" ? 0 : 1) - (b.level === "P1" ? 0 : 1) || (a.first || 0) - (b.first || 0); });
}

// After quiet hours: ONE text listing the critical problems that weren't texted overnight.
function healthQuietSummary() {
  var now = new Date(), m = healthGet("HEALTH_QUIET", "22-7").match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
  if (!m || healthQuiet(now) || healthHour(now) < Number(m[2]) || healthGet("HEALTH_QUIET_SUMMARY") === healthDay(now)) return;
  healthProps().setProperty("HEALTH_QUIET_SUMMARY", healthDay(now));
  var all = healthProps().getProperties(), pend = [];
  Object.keys(all).forEach(function (k) {
    if (k.indexOf("HA_") !== 0) return;
    try { var st = JSON.parse(all[k]); } catch (e) { return; }
    if (st && st.smsPending && st.level === "P1" && (st.open || Date.now() - (st.lastSeen || 0) < 12 * 36e5)) pend.push({ key: k.slice(3), st: st });
  });
  if (!pend.length) return;
  var sent = healthSendSms(healthSmsTo(), "KD P1: " + healthPlural(pend.length, "problem") + " from overnight: " +
    pend.map(function (p) { return p.st.short || p.st.subject; }).join("; ") + ". Details in email.") > 0;
  pend.forEach(function (p) {          // not sent: each problem's own next alert texts it (smsPending stays)
    p.st.lastSmsTry = Date.now();
    if (sent) { p.st.smsPending = false; p.st.lastSms = Date.now(); }
    healthSetJson("HA_" + p.key, p.st);
  });
}

// ======================================================================================================
// Job heartbeats: every entry point calls healthMark(job, ok, ms) at the end (H1, H15)
// ======================================================================================================
function healthMark(job, ok, ms, detail) {
  try {
    var k = "HM_" + job, st = healthJson(k, {}) || {}, now = Date.now();
    st.last = now; st.ok = ok !== false; st.ms = Math.round(ms || 0);
    if (st.ok) { st.lastOk = now; st.firstFail = 0; st.err = ""; }
    else { if (!st.firstFail) st.firstFail = now; st.err = healthScrub(detail).slice(0, 200); }
    healthSetJson(k, st);
  } catch (e) { console.error("healthMark " + job + " failed: " + e); }
}
function healthJob(job) { return healthJson("HM_" + job, null); }

function healthRun(ctx, errs, list) {
  ctx.ran = ctx.ran || [];
  list.forEach(function (c) {
    ctx.ran.push(c[0]);
    try { c[1](ctx); }
    catch (e) { console.error("Health check " + c[0] + " failed: " + healthScrub(e && e.stack || e)); errs.push({ name: c[0], err: e }); }
  });
}
// End of a run: heartbeat, and the "a health check crashed" warning. A crash is resolved only once that same check has run
// again without crashing (H22 runs at 21:00 only, H13 four times a day, H23 monthly...).
function healthFinish(job, t0, errs, ctx) {
  var msg = function (e) { return healthScrub(e.err); };
  healthMark(job, !errs.length, Date.now() - t0, errs.map(function (e) { return e.name + ": " + msg(e); }).join("; "));
  var fatal = errs.filter(function (e) { return e.err && e.err.healthNoRecipients; })[0];
  if (fatal) throw fatal.err;                                  // nobody to email: let Google's trigger-failure email fire
  var key = "HEALTH_CRASH_" + job, st = healthState(key), ran = (ctx && ctx.ran) || [], failing = errs.map(function (e) { return e.name; });
  var carried = st.open ? String(st.sig || "").split(",").filter(function (n) { return n && ran.indexOf(n) === -1 && failing.indexOf(n) === -1; }) : [];
  if (failing.length) {
    var all = failing.concat(carried);
    healthAlert("P2", key, "A health check crashed: " + all.join(", "), {
      what: errs.map(function (e) { return e.name + ": " + msg(e).slice(0, 300); }).join("\n") +
        (carried.length ? "\nAlso still not re-checked since it crashed: " + carried.join(", ") : ""),
      affects: "That check is not watching for its problem until this is fixed. The other checks still run.",
      todo: "Forward this email to the ads chat."
    }, { sig: all.join(",") });
  } else if (!carried.length) healthResolve(key);
}
// The header guard (H4) at the start of the hourly, daily and nightly runs: checks that read the Waiting list by column
// name are skipped while row 1 is wrong (a typo in "Lead ID" would otherwise report every lead as missing).
function healthSheetGuard(ctx) {
  try { healthAssertSheet(); }
  catch (e) { ctx.sheetBad = String(e && e.message || e); if (!e || !e.healthProblems) throw e; }
}

// ======================================================================================================
// Triggers (4) – the dispatchers
// ======================================================================================================
function healthEvery5Min() {
  var t0 = Date.now(), ctx = healthCtx(), errs = [];
  healthRun(ctx, errs, [["quiet-hours summary", healthQuietSummary], ["H4", healthSheetCheck], ["H3", healthConfigCheck],
    ["H1", healthPollerAlive], ["H2", healthMetaApiErrors], ["H15", healthJobsCheck]]);
  if (!ctx.sheetBad) {
    healthRun(ctx, errs, [["H14a", healthSmsCheck], ["H20", healthSpamCheck]]);
    var b = healthJob("healthBacklogCheck");     // backlogCheck (meta-leads.gs, every 15 min) normally runs H5/H6; this is the backstop
    if (inCallHours(new Date()) && (!b || Date.now() - b.last >= 14 * 6e4)) healthRun(ctx, errs, [["H5", healthBacklogCheck], ["H6", healthCallerActive]]);
  }
  healthFinish("healthEvery5Min", t0, errs, ctx);
}
function healthHourly() {
  var t0 = Date.now(), ctx = healthCtx(), errs = [], h = healthHour(new Date());
  healthRun(ctx, errs, [["H4", healthSheetGuard]]);
  var ok = !ctx.sheetBad, list = [["H19", healthMailQuota], ["H16", healthSiteCheck], ["H14b", healthSmsHistoryCheck]];
  if (ok) list.push(["H8", healthMetaReconcile]);
  if (h >= 7) list.push(["H12", healthAdsCheck]);
  if (h >= 8 && h <= 22) { list.push(["H10", healthFormsCheck]); if (ok) list.push(["H9", healthMetaCount]); }
  if ([8, 12, 16, 20].indexOf(h) !== -1) list.push(["H13", healthClickSendBalance]);
  if (ok && h >= 9 && h <= 21) list.push(["H11", healthNoMetaLeads]);
  if (ok && (h === 10 || h === 12)) list.push(["H7", healthOvernightQueue]);
  if (ok && h === 21) list.push(["H22", healthContentScan]);
  healthRun(ctx, errs, list);
  healthFinish("healthHourly", t0, errs, ctx);
}
function healthDaily() {
  var t0 = Date.now(), ctx = healthCtx(), errs = [], list = [["H4", healthSheetGuard], ["H24", healthGates], ["H17", healthDnsCheck]];
  if (healthFmt(new Date(), "dd") === "01") list.push(["H23", healthMonthly]);
  list.push(["H18", healthSelfTest]);          // last: its email lists what the others found
  healthRun(ctx, errs, list);
  healthFinish("healthDaily", t0, errs, ctx);
}
function healthNightly() {
  var t0 = Date.now(), ctx = healthCtx(), errs = [];
  healthRun(ctx, errs, [["H4", healthSheetGuard], ["H21", healthBackup]]);   // the backup is always taken; the rows check needs row 1 OK
  healthFinish("healthNightly", t0, errs, ctx);
}

function healthInstallTriggers() {
  var hr = healthHeaderReport();      // setup step 0: with row 1 incomplete the lead scripts would stop at once (H4)
  if (!hr.ok) throw new Error("Not installed: row 1 of the Waiting list isn't ready. " + hr.text +
    " Run healthAddMissingHeaders() first (or fix row 1 by hand), then run healthInstallTriggers() again.");
  var all = ScriptApp.getProjectTriggers(), mine = [], others = [];
  all.forEach(function (t) { (HEALTH_OWN_TRIGGERS.indexOf(t.getHandlerFunction()) !== -1 ? mine : others).push(t); });
  if (others.length + HEALTH_OWN_TRIGGERS.length > HEALTH_MAX_TRIGGERS)
    throw new Error("Not installed: the project already has " + others.length + " other triggers, so the 4 health triggers would make " +
      (others.length + 4) + " (limit " + HEALTH_MAX_TRIGGERS + "). Remove spare ones in Apps Script > Triggers first: " +
      others.map(function (t) { return t.getHandlerFunction(); }).join(", "));
  mine.forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger("healthEvery5Min").timeBased().everyMinutes(5).create();
  ScriptApp.newTrigger("healthHourly").timeBased().everyHours(1).create();
  ScriptApp.newTrigger("healthDaily").timeBased().atHour(7).nearMinute(30).everyDays(1).inTimezone("Europe/London").create();
  ScriptApp.newTrigger("healthNightly").timeBased().atHour(23).nearMinute(30).everyDays(1).inTimezone("Europe/London").create();
  if (!healthEmails().length) console.warn("Set Script Property HEALTH_EMAIL now – without it alerts can't be emailed.");
  console.log("Health checks installed: 4 triggers, " + (others.length + 4) + " in the project. Version " + HEALTH_VERSION +
    ". Next: run healthTestAlert() (fire drill step 1).");
  return others.length + 4;
}

// ======================================================================================================
// H1–H4: is the lead pipeline running and set up right?  (every 5 min)
// ======================================================================================================
// H1: pollMetaLeads finished a clean run in the last 10 min -> ping healthchecks.io (it alerts by itself after 15 min of silence).
function healthPollerAlive(ctx) {
  if (!healthGet("META_PAGE_TOKEN") || !healthGet("META_FORM_IDS")) return;          // H3 reports blank settings
  var j = healthJob("pollMetaLeads"), now = Date.now();
  if (j && j.lastOk && now - j.lastOk <= 10 * 6e4) { healthPing("HEALTH_PING_POLLER"); healthResolve("H1_POLLER"); return; }
  if (j && j.last && now - j.last <= 10 * 6e4) { healthResolve("H1_POLLER"); return; }  // it runs but fails: H2/H3/H4/H15 say why
  var last = j && j.last ? healthHM(j.last) : "", good = j && j.lastOk ? healthHM(j.lastOk) : "never";
  healthAlert("P1", "H1_POLLER", "Facebook lead checker stopped (last good run " + good + ")", {
    what: "The script that collects Facebook/Instagram leads every minute (pollMetaLeads) " + (last ? "has not run since " + last : "has never run") + ".",
    affects: "New Facebook and Instagram leads are not added to the Waiting list, are not texted, and the caller is not alerted.",
    todo: "Open Apps Script > Executions and look at pollMetaLeads. Then Triggers (clock icon): pollMetaLeads must be there, every minute. " +
      "If it's missing, run installLeadTriggers() once. If Google asks you to authorise again, do it with every box ticked. " +
      "Until it works, check Meta Business Suite > Leads Center every 2 hours and add new people by hand.",
    plan: "R3"
  }, { short: "FB lead checker stopped", sms: "KD P1: Facebook lead checker " + (last ? "stopped at " + last : "is not running") + ". New FB/IG leads are not added or texted. Apps Script > Executions. Plan R3" });
}

// H2: META_LAST_ERR (written by pollMetaLeads on any non-200 reply from Meta).
function healthMetaApiErrors(ctx) {
  var e = healthJson("META_LAST_ERR", null), j = healthJob("pollMetaLeads"), now = Date.now();
  if (!e || !e.last || (j && j.lastOk && j.lastOk > e.last)) { healthResolve("H2_META"); return; }
  var code = Number(e.code) || 0, msg = String(e.msg || ""), age = now - (e.first || e.last), since = healthHM(e.first || e.last);
  var rate = [4, 17, 32, 613, 80001, 80005].indexOf(code) !== -1, level = null, kind;
  if (code === 190 || code === 102) { kind = "token"; level = "P1"; }
  else if (rate) { kind = "rate"; level = age >= 2 * 36e5 ? "P1" : age >= 30 * 6e4 ? "P2" : null; }
  else if (code === 12 || code === 2635 || /deprecat|version/i.test(msg)) { kind = "version"; level = "P1"; }
  else if (code === 10 || code === 100 || code === 2500 || (code >= 200 && code < 300) || /permission|unsupported|unknown path/i.test(msg)) { kind = "access"; level = "P1"; }
  else { kind = "other"; level = age >= 15 * 6e4 ? "P1" : null; }
  if (!level) return;
  var what = "Since " + since + " Meta has answered the lead checker with " + (code ? "error " + code : "HTTP " + e.http) +
    (e.form ? " (form " + e.form + ")" : "") + ": " + msg.slice(0, 300);
  var affects = "New Facebook and Instagram leads are not reaching the Waiting list or being texted until this clears.";
  var t = {
    token: ["Meta lead token rejected (error " + code + ") since " + since, "Make a new System User token (runbook Step 5.2) and paste it into Script Property META_PAGE_TOKEN. Don't touch anything else. Meanwhile download new leads from Meta Business Suite > Leads Center every 2 hours.",
      "KD P1: Meta lead token rejected (error " + code + ") since " + since + ". FB/IG leads stopped. Make a new System User token. Plan R3"],
    version: ["Meta says the API version is too old (error " + code + ") since " + since, "Set Script Property META_API_VERSION to Meta's newest version (e.g. v28.0), or blank it to use the script's built-in version. Then watch Executions for a clean pollMetaLeads run.",
      "KD P1: Meta rejected the lead checker (error " + code + ", API version) since " + since + ". FB/IG leads stopped. Fix META_API_VERSION. Plan R3"],
    access: ["Meta refused the lead checker (error " + code + ") since " + since, "In Meta Business settings check: the app and the System User still have Leads access to the Page, and the token has leads_retrieval. A wrong ID in META_FORM_IDS also gives error 100.",
      "KD P1: Meta refused the lead checker (error " + code + ", access) since " + since + ". FB/IG leads stopped. Check app/Leads access. Plan R3"],
    rate: [level === "P1" ? "Meta has rate-limited the lead checker for " + healthDur(age / 6e4) + " (code " + code + ")" : "Meta is rate-limiting the lead checker (code " + code + ", " + healthDur(age / 6e4) + "). It retries by itself.",
      level === "P1" ? "This normally clears within minutes, so 2 hours means something is wrong. Check Leads Center by hand every 2 hours and forward this email to the ads chat." : "Nothing yet - it retries every minute. If it lasts 2 hours you'll get a critical alert.",
      "KD P1: Meta has blocked the lead checker for " + healthDur(age / 6e4) + " (rate limit " + code + "). FB/IG leads delayed. Check Leads Center by hand. Plan R3"],
    other: ["Meta lead API failing (" + (code ? "error " + code : "HTTP " + e.http) + ") since " + since, "Usually a Meta outage (check metastatus.com). Check Leads Center by hand every 2 hours until it clears; forward this email to the ads chat if it lasts.",
      "KD P1: Meta lead API failing (" + (code ? "error " + code : "HTTP " + e.http) + ") since " + since + ". FB/IG leads stopped. Check Leads Center by hand. Plan R3"]
  }[kind];
  healthAlert(level, "H2_META", t[0], { what: what, affects: affects, todo: t[1], plan: "R3" }, { sig: kind + code, sms: t[2], short: "Meta error " + (code || e.http) });
}

// H3: the settings that silently stop texts or alerts. P1 in calling hours, P2 otherwise.
function healthConfigCheck(ctx) {
  var p = healthProps().getProperties(), now = new Date(), issues = [];
  var get = function (k) { return String(p[k] === undefined || p[k] === null ? "" : p[k]).trim(); };
  var untilOk = function (k) { var u = healthParseTime(get(k + "_UNTIL")); return !!u && u.getTime() > now.getTime(); };
  var add = function (name, text, sms) { issues.push({ name: name, text: text, sms: sms }); };
  ["META_PAGE_TOKEN", "META_FORM_IDS", "CLICKSEND_USER", "CLICKSEND_KEY", "ONCALL_MOBILE"].forEach(function (k) {
    if (!get(k)) add(k, k + " is blank.", "setting wrong - " + k + " is blank" + (k === "ONCALL_MOBILE" ? ", so the caller gets no lead alerts" :
      /^META/.test(k) ? ", so Facebook leads are not read" : ", so no texts go out") + ". Fix in Script Properties. Plan R5");
  });
  var callers = healthList(get("ONCALL_MOBILE")), bad = callers.filter(function (n) { return !healthMobileOk(n); });
  if (bad.length) add("ONCALL_MOBILE", "ONCALL_MOBILE has " + healthPlural(bad.length, "entry", "entries") + " that isn't a UK mobile (07... or +447...): " +
    bad.map(healthMask).join(", ") + ". Texts to it are skipped.", "setting wrong - ONCALL_MOBILE is blank/invalid, so the caller gets no lead alerts. Fix in Script Properties. Plan R5");
  var om = healthList(get("OWNER_MOBILE")).filter(function (n) { return !healthMobileOk(n); });
  if (om.length) add("OWNER_MOBILE", "OWNER_MOBILE has " + healthPlural(om.length, "entry", "entries") + " that isn't a UK mobile: " + om.map(healthMask).join(", ") +
    ". It should normally be empty (the owner gets email copies, not texts).", "setting wrong - OWNER_MOBILE is not a UK mobile. Empty it in Script Properties. Plan R5");
  var owner = healthList(get("HEALTH_SMS")).map(healthDigits).filter(String);
  if (callers.some(function (n) { return owner.indexOf(healthDigits(n)) !== -1; }) && !untilOk("ONCALL_MOBILE"))
    add("ONCALL_MOBILE_OWNER", "ONCALL_MOBILE contains the owner's mobile (HEALTH_SMS) and there's no ONCALL_MOBILE_UNTIL, so lead alerts go to the owner instead of the caller.",
      "test setting left on - ONCALL_MOBILE is the owner's number, so the caller gets no lead alerts. Put the caller's number back now.");
  var ch = get("CALL_HOURS").replace(/\s+/g, "");
  if (ch && ch !== "8-21" && !untilOk("CALL_HOURS"))
    add("CALL_HOURS", "CALL_HOURS is \"" + ch + "\" instead of 8-21 (no CALL_HOURS_UNTIL).", "test setting left on - CALL_HOURS is " + ch +
      (/^24/.test(ch) ? ", so night leads alert the caller" : ", not 8-21") + ". Set it back to 8-21 now.");
  var ba = get("BACKLOG_ALERT");
  if (ba && Number(ba) > 10 && !untilOk("BACKLOG_ALERT"))
    add("BACKLOG_ALERT", "BACKLOG_ALERT is " + ba + "; it should be 10 or less.", "setting wrong - BACKLOG_ALERT is " + ba + ", should be 10. Fix in Script Properties. Plan R6");
  if (/^(1|yes|true|on)$/i.test(get("WEB_SMS_PAUSED"))) {
    var wu = healthParseTime(get("WEB_SMS_PAUSED_UNTIL"));
    if (!wu || now - wu > 10 * 6e4) add("WEB_SMS_PAUSED", "WEB_SMS_PAUSED is still on" + (wu ? " (it was meant to end at " + healthHM(wu) + ")" : " with no WEB_SMS_PAUSED_UNTIL") +
      ": website sign-ups get no thank-you text.", "test setting left on - WEB_SMS_PAUSED, so website sign-ups get no text. Delete WEB_SMS_PAUSED now.");
  }
  Object.keys(p).sort().forEach(function (k) {
    if (!/_UNTIL$/.test(k) || k === "ADS_PAUSED_UNTIL" || k === "WEB_SMS_PAUSED_UNTIL" || !get(k)) return;
    var base = k.replace(/_UNTIL$/, ""), u = healthParseTime(get(k));
    if (!u) add(k, k + " (\"" + get(k) + "\") isn't a date the script can read. Use yyyy-mm-dd hh:mm.", "setting wrong - " + k + " is not a date (use yyyy-mm-dd hh:mm). Fix in Script Properties.");
    else if (u.getTime() <= now.getTime()) add(k, "The temporary setting " + base + " ended at " + healthHM(u) + ": put " + base + " back to its normal value, then delete " + k + ".",
      "test setting left on - " + base + " ended " + healthHM(u) + ". Put it back and delete " + k + " now.");
  });
  var he = healthList(get("HEALTH_EMAIL"));
  if (!he.length) add("HEALTH_EMAIL", "HEALTH_EMAIL is blank, so alerts only go to OWNER_EMAIL (info@), which isn't watched closely.", "setting wrong - HEALTH_EMAIL is blank, so alert emails don't reach you. Fix in Script Properties.");
  else if (he.some(function (e) { return !healthEmailOk(e); })) add("HEALTH_EMAIL", "HEALTH_EMAIL has an address that isn't valid: " + he.filter(function (e) { return !healthEmailOk(e); }).join(", ") + ".",
    "setting wrong - HEALTH_EMAIL has an invalid address. Fix in Script Properties.");
  // a blank HEALTH_SMS is a choice (owner decision pending: critical alerts by text?) - the daily email lists it as not set up
  if (healthList(get("HEALTH_SMS")).some(function (n) { return !healthMobileOk(n); })) add("HEALTH_SMS", "HEALTH_SMS isn't a UK mobile, so critical alerts can't be texted to you.", "setting wrong - HEALTH_SMS is not a UK mobile.");

  if (!issues.length) { healthResolve("H3_CONFIG"); return issues; }
  var names = issues.map(function (i) { return i.name; });
  healthAlert(inCallHours(now) ? "P1" : "P2", "H3_CONFIG", issues.length === 1 ? "Setting wrong: " + names[0] : healthPlural(issues.length, "setting") + " wrong: " + names.join(", "), {
    what: issues.map(function (i) { return "- " + i.text; }).join("\n"),
    affects: "Wrong or blank settings stop lead texts, caller alerts or alerts to you without any other warning.",
    todo: "Apps Script > Project Settings > Script Properties: fix the values above. Normal values: CALL_HOURS 8-21, BACKLOG_ALERT 10, " +
      "ONCALL_MOBILE = the caller's mobile, HEALTH_EMAIL = your personal email, HEALTH_SMS = your mobile. For any temporary change add " +
      "<NAME>_UNTIL with its end time (yyyy-mm-dd hh:mm), so this check knows it's meant.",
    plan: "R5"
  }, { sig: names.slice().sort().join(","), short: "settings wrong", noSms: !get("CLICKSEND_USER") || !get("CLICKSEND_KEY"), sms: "KD P1: " + (issues.length === 1 ? issues[0].sms :
    healthPlural(issues.length, "setting") + " wrong (" + names.join(", ") + "). Fix in Script Properties. Plan R5") });
  return issues;
}

// Row 1 of the Waiting list against the headers the scripts need (HEALTH_SHEET_HEADERS, plan H4). No alert, no change.
function healthHeaderReport(sh) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  sh = sh || ss.getSheetByName(LEADS_TAB);
  var out = { ok: false, sh: sh, h: [], missing: [], twice: [], near: [], a1: true, problems: [], text: "" };
  if (!sh) { out.problems.push("tab \"" + LEADS_TAB + "\" missing"); out.text = "The tab \"" + LEADS_TAB + "\" is missing."; return out; }
  var h = out.h = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0].map(String);
  var norm = function (x) { return String(x).toLowerCase().replace(/\s+/g, " ").trim(); };
  if (h[0] !== "Signup Time") { out.a1 = false; out.problems.push("A1 is \"" + h[0] + "\" not \"Signup Time\""); }
  HEALTH_SHEET_HEADERS.forEach(function (n) {
    var c = h.filter(function (x) { return x === n; }).length;
    if (c > 1) { out.twice.push(n); out.problems.push(n + " twice"); return; }
    if (c) return;
    out.missing.push(n); out.problems.push(n + " missing");
    var close = h.filter(function (x) { return x !== n && norm(x) === norm(n); })[0];      // "Lead ID " / "Lead id" for "Lead ID"
    if (close !== undefined) out.near.push("\"" + close + "\" should be \"" + n + "\"");
  });
  out.ok = !out.problems.length;
  out.text = out.ok ? "Row 1 is ready: all " + HEALTH_SHEET_HEADERS.length + " headers the scripts need are there." :
    [out.missing.length ? "Missing: " + out.missing.join(", ") + "." : "", out.near.length ? "Retype exactly: " + out.near.join("; ") + "." : "",
      out.twice.length ? "Twice (delete or rename one): " + out.twice.join(", ") + "." : "", out.a1 ? "" : "A1 must be \"Signup Time\" (it is \"" + h[0] + "\")."]
      .filter(String).join(" ");
  return out;
}
// Setup night, step 0 (run by hand): lists what row 1 still needs. Changes nothing, alerts nobody.
function healthCheckHeaders() { var r = healthHeaderReport(); console.log(r.text); return r.ok; }
// Setup night, step 0 (run by hand): adds the missing headers at the right-hand end of row 1. Nothing is moved or renamed;
// it refuses if a header is there twice or almost right (e.g. "Lead ID " with a space), because that must be fixed by hand.
function healthAddMissingHeaders() {
  var r = healthHeaderReport();
  if (r.ok) { console.log(r.text); return 0; }
  if (!r.sh || !r.a1 || r.twice.length || r.near.length) throw new Error("Row 1 not changed. " + r.text + " Fix these by hand, then run this again.");
  var col = r.sh.getLastColumn() + 1;
  healthCols(r.sh, col + r.missing.length - 1);
  r.sh.getRange(1, col, 1, r.missing.length).setValues([r.missing]);
  console.log("Added " + r.missing.length + " headers at the end of row 1: " + r.missing.join(", ") + ". Nothing else changed.");
  return r.missing.length;
}

// H4 (also called at the start of pollMetaLeads and doPost): the Waiting list's header row. Throws (after alerting) if a
// script would misfile, so the caller stops BEFORE reading any lead.
function healthAssertSheet(sh) {
  var r = healthHeaderReport(sh), problems = r.problems;
  if (r.ok) return r.h;
  var err = new Error("Waiting list header problem: " + problems.join("; "));
  err.healthProblems = problems;
  // setup night: the tracking columns were never added (nothing was renamed) -> say so, and how to add them
  var setup = r.sh && r.a1 && !r.twice.length && !r.near.length && !healthGet("HEALTH_ROW1") &&
    r.missing.every(function (n) { return HEALTH_SETUP_HEADERS.indexOf(n) !== -1; });
  try {
    if (setup) healthAlert("P1", "H4_SHEET", "Waiting list is missing " + healthPlural(r.missing.length, "column") + " the scripts need (" +
      r.missing.slice(0, 3).join(", ") + (r.missing.length > 3 ? ", ..." : "") + "): lead scripts stopped", {
      what: "Row 1 of the Waiting list doesn't have these headers yet: " + r.missing.join(", ") + ".",
      affects: "To avoid putting people's details in the wrong columns, the Facebook lead checker has stopped (it reads no leads, so none are lost - they're collected once row 1 is complete). Website sign-ups are saved in the \"Failed sign-ups\" tab instead.",
      todo: "Apps Script: run healthAddMissingHeaders() once - it adds the missing headers at the right-hand end of row 1 and changes nothing else. Within a minute the lead checker carries on by itself. Then add anyone in \"Failed sign-ups\" by hand.",
      plan: "register row 23"
    }, { sig: problems.join(","), short: "sheet columns missing", sms: "KD P1: Waiting list is missing " + healthPlural(r.missing.length, "column") + " the scripts need. Lead scripts stopped. Run healthAddMissingHeaders (register row 23)." });
    else healthAlert("P1", "H4_SHEET", "Waiting list header row changed (" + problems.slice(0, 3).join(", ") + "): lead scripts stopped", {
      what: "The Waiting list's header row (row 1) no longer matches what the scripts expect: " + problems.join("; ") + "." +
        (r.near.length ? "\nLooks like a typo: " + r.near.join("; ") + "." : ""),
      affects: "To avoid putting people's details in the wrong columns, the Facebook lead checker has stopped (it reads no leads, so none are lost - they're collected once row 1 is fixed). Website sign-ups may also fail.",
      todo: "Restore row 1: File > Version history, or retype the header exactly (e.g. \"Status\", not \"Status x\"). Never sort the whole sheet. Within a minute of the fix the lead checker carries on by itself.",
      plan: "register row 23"
    }, { sig: problems.join(","), short: "sheet header broken", sms: "KD P1: Waiting list header row changed (" + problems[0].slice(0, 30) + "). Lead scripts stopped to avoid misfiling. Restore row 1 (register row 23)." });
  } catch (x) { console.error("Header alert failed: " + x); }
  throw err;
}

function healthSheetCheck(ctx) {
  ctx = ctx || healthCtx();
  var h;
  try { h = healthAssertSheet(); } catch (e) { ctx.sheetBad = String(e.message || e); if (!e.healthProblems) throw e; return; }
  healthResolve("H4_SHEET");
  var ss = SpreadsheetApp.getActiveSpreadsheet(), first = ss.getSheets()[0].getName();
  if (first !== "Dashboard") healthAlert("P2", "H4_DASHBOARD", "Dashboard is no longer the first tab (first tab: " + first + ")", {
    what: "The first tab of the Waiting List sheet is now \"" + first + "\" instead of the Dashboard.",
    affects: "Callers opening the sheet land on the wrong tab and may type in the wrong place.",
    todo: "Drag the Dashboard tab back to the far left."
  }, { sig: first });
  else healthResolve("H4_DASHBOARD");
  // row 1 as text, without the empty cells at its end (a note typed to the right of the table isn't a header change)
  var trim = function (a) { a = (a || []).map(String); while (a.length && a[a.length - 1].trim() === "") a.pop(); return a; };
  h = trim(h);
  var row1 = JSON.stringify(h), old = healthGet("HEALTH_ROW1");
  if (old && old !== row1) {
    var was = []; try { was = trim(JSON.parse(old)); } catch (e) {}
    var added = h.filter(function (x) { return x && was.indexOf(x) === -1; }), gone = was.filter(function (x) { return x && h.indexOf(x) === -1; });
    var moved = h.filter(function (x, i) { return x && was.indexOf(x) !== -1 && was.indexOf(x) !== i; }).length;
    if (added.length || gone.length || moved)
      healthAlert("P2", "H4_ROW1", "Waiting list header row changed (" + [added.length ? "added " + added.join(", ") : "", gone.length ? "removed " + gone.join(", ") : "", moved ? healthPlural(moved, "column") + " moved" : ""].filter(String).join("; ").slice(0, 120) + ")", {
        what: "Row 1 of the Waiting list changed since the last check.\nAdded: " + (added.join(", ") || "none") + "\nRemoved or renamed: " + (gone.join(", ") || "none") + "\nColumns that moved: " + moved,
        affects: "The scripts find columns by name, so a moved column is fine. A renamed or deleted column stops whatever the scripts wrote there.",
        todo: "If nobody meant to change it, undo it (File > Version history). If it was deliberate, nothing to do."
      }, { event: true, every: 0 });
  }
  if (old !== row1) healthProps().setProperty("HEALTH_ROW1", row1);
}

// ======================================================================================================
// H5–H7: is the caller keeping up?  (owner decision: callers aren't the limit – the fix is "add a caller")
// ======================================================================================================
// Waiting = blank or "Call 8am" an hour after the clock starts, plus "No answer" call-backs over an hour late - an hour of
// the caller's SHIFT (CALLER_SHIFT), so leads from before the shift aren't "waiting" the minute it starts.
function healthBacklog(ctx, now) {
  var W = healthWl(ctx), s = healthShift(), out = { waiting: 0, oldest: 0, call8am: 0, queue: 0 }, earliest = 0;
  now = now || new Date();
  var tc = W.C["Signup Time"], sc = W.C["Status"], nc = W.C["Next call due"];
  if (tc === undefined || sc === undefined) return out;
  for (var i = 1; i < W.data.length; i++) {
    var r = W.data[i], st = String(r[sc]).trim(), t = r[tc], start = null;
    if (!(t instanceof Date)) continue;
    if (st === "Call 8am") out.call8am++;
    if (st === "" || st === "Call 8am") { out.queue++; start = healthClockStart(t); }
    else if (st === "No answer" && nc !== undefined && r[nc] instanceof Date && r[nc].getTime() <= now.getTime()) { out.queue++; start = r[nc]; }
    if (!start || now - start < 36e5 || healthShiftMins(start, now, s) < 60) continue;
    out.waiting++;
    if (!earliest || start.getTime() < earliest) earliest = start.getTime();
  }
  if (earliest) out.oldest = healthShiftMins(earliest, now, s);   // shift minutes grow with age: only the oldest needs counting
  ctx.backlog = out;
  return out;
}
// H5 (every 15 min inside CALLER_SHIFT; replaces backlogCheck's email)
function healthBacklogCheck(ctx) {
  ctx = ctx || healthCtx();
  var now = new Date(), t0 = Date.now();
  if (!healthInShift(now)) return null;
  var b = healthBacklog(ctx, now), p2 = healthNum("HEALTH_BACKLOG", 5);
  healthMark("healthBacklogCheck", true, Date.now() - t0);
  var head = healthPlural(b.waiting, "lead") + " waiting over 1h, oldest " + healthDur(b.oldest);
  var body = {
    what: healthPlural(b.waiting, "lead") + " have waited more than an hour for their first call (or for a call-back that's over an hour late). The oldest has waited " +
      healthDur(b.oldest) + " of the caller's shift.",
    affects: "People who wait long are harder to reach and may give up on the waiting list.",
    todo: "Add a caller now: put the backup caller's mobile in Script Property ONCALL_MOBILE (comma-separated with the main caller) and set ALERT_MODE to rotate. " +
      "Ask the callers to ring the oldest first (filter view \"To call\") and to pick a Call outcome after every call, or the rows keep counting as waiting. " +
      "Only if nobody at all is available to call: lower the campaign budget by about 20% (Ads Manager > campaign > budget) until the list is caught up.",
    plan: "R6"
  };
  if (b.waiting >= 10 || (b.waiting && b.oldest >= 120))
    healthAlert("P1", "H5_BACKLOG", head, body, { short: b.waiting + " leads waiting", sms: "KD P1: " + head + ". Add a caller now (backup caller). Plan R6",
      caller: "KD: " + healthPlural(b.waiting, "lead") + " waiting, oldest " + healthDur(b.oldest) + ". Please ring oldest first (filter view To call)." });
  else if (b.waiting >= p2) healthAlert("P2", "H5_BACKLOG", head, body, { every: 2 * 36e5 });
  else healthResolve("H5_BACKLOG");
  return b;
}
// H6: no call activity for 2 shift hours while leads wait, or none at all an hour into the shift.
function healthCallerActive(ctx) {
  ctx = ctx || healthCtx();
  var now = new Date(), s = healthShift();
  if (!healthInShift(now, s)) return;
  var shiftStart = healthAt(now, 0, s.from);
  if (now - shiftStart < 36e5) return;
  var W = healthWl(ctx), last = 0, any = false;
  ["Status changed at", "Last attempt at"].forEach(function (n) {
    var c = W.C[n]; if (c === undefined) return;
    for (var i = 1; i < W.data.length; i++) { var v = W.data[i][c]; if (v instanceof Date) { any = true; last = Math.max(last, v.getTime()); } }
  });
  var log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(typeof TRK_LOG_TAB !== "undefined" ? TRK_LOG_TAB : "Call log");
  if (log && log.getLastRow() > 1) { var lv = log.getRange(log.getLastRow(), 1).getValue(); if (lv instanceof Date) { any = true; last = Math.max(last, lv.getTime()); } }
  if (!any) return;                                       // call tracking not in use yet: nothing to compare with
  var b = ctx.backlog || healthBacklog(ctx, now), idle = healthShiftMins(new Date(last), now, s), none = last < shiftStart.getTime();
  var n = Math.max(b.waiting, b.queue), are = n === 1 ? " is" : " are";
  if (b.waiting >= 1 && (idle >= 120 || none)) {          // someone has waited over an hour (a lead that just came in proves nothing)
    var since = none ? "no calls logged yet today (shift started " + healthFmt(shiftStart, "HH:mm") + ")" : "no calls logged since " + healthHM(last);
    healthAlert("P1", "H6_CALLER", since.charAt(0).toUpperCase() + since.slice(1) + " and " + healthPlural(n, "lead") + " waiting", {
      what: "The sheet shows " + since + " (Call log, Status changed at, Last attempt at), and " + healthPlural(n, "lead") + are + " waiting to be called.",
      affects: "If the caller is off or stuck, nobody is ringing new leads.",
      todo: "Phone the caller. If they're off today: put the backup caller's mobile in ONCALL_MOBILE (add ONCALL_MOBILE_UNTIL with today's end time if it's temporary) and ask the backup to start with the oldest rows.",
      plan: "R5"
    }, { short: "no calls logged", sms: "KD P1: " + since.replace(/ \(shift.*\)/, "") + " and " + healthPlural(n, "lead") + are + " waiting. Is the caller OK? If off, move alerts to the backup. Plan R5" });
  } else healthResolve("H6_CALLER");
}
// H7: overnight ("Call 8am") leads still not called at 10:00 / 12:00 on caller days.
function healthOvernightQueue(ctx) {
  ctx = ctx || healthCtx();
  var now = new Date(), h = healthHour(now), s = healthShift();
  if (!s.days[healthDow(now)] || (h !== 10 && h !== 12)) return;
  var n = healthBacklog(ctx, now).call8am, at = h === 10 ? "10am" : "12pm";
  if (!n) { healthResolve("H7_OVERNIGHT"); return; }
  var p1 = h >= 12 || n >= 5;
  healthAlert(p1 ? "P1" : "P2", "H7_OVERNIGHT", healthPlural(n, "overnight lead") + " still not called at " + at, {
    what: healthPlural(n, "row") + " still have Status \"Call 8am\" at " + at + ".",
    affects: "These people signed up last night and were told the team would call from 8am.",
    todo: "Ask the caller to filter Status = Call 8am and ring them now (and to pick a Call outcome after each call). If the caller is off, move alerts to the backup caller (ONCALL_MOBILE).",
    plan: "R5/R6"
  }, { sig: at, short: n + " overnight leads", callerEvery: 90 * 6e4,
    sms: "KD P1: " + healthPlural(n, "overnight lead") + " still not called at " + at + ". Check the caller is working. Plan R5/R6",
    caller: "KD: " + healthPlural(n, "overnight lead") + " not yet called at " + at + ". Filter Status = Call 8am and ring them now." });
}

// ======================================================================================================
// H8–H11: does every Meta lead reach the sheet?
// ======================================================================================================
function healthGraph(path, params, token) {
  var q = Object.keys(params || {}).map(function (k) { return k + "=" + encodeURIComponent(String(params[k])); });
  q.push("access_token=" + encodeURIComponent(token));
  var url = metaGraph() + path + "?" + q.join("&"), out = [], pages = 0, headers = {};
  while (url && pages++ < 20) {
    var res;
    try { res = UrlFetchApp.fetch(url, { muteHttpExceptions: true }); }
    catch (e) { return { ok: false, http: 0, code: 0, msg: healthScrub(e).slice(0, 200), data: out, headers: {} }; }
    var txt = res.getContentText(), body = {};
    try { body = JSON.parse(txt); } catch (e) {}
    if (res.getResponseCode() !== 200) {
      var er = (body && body.error) || {};
      return { ok: false, http: res.getResponseCode(), code: Number(er.code) || 0, msg: healthScrub(er.message || txt).slice(0, 300), data: out, headers: {} };
    }
    try { headers = (res.getAllHeaders ? res.getAllHeaders() : res.getHeaders()) || {}; } catch (e) {}
    if (body && Object.prototype.toString.call(body.data) === "[object Array]") { out = out.concat(body.data); url = body.paging && body.paging.next; }
    else { out.push(body); url = null; }
  }
  return { ok: true, http: 200, data: out, headers: headers };
}

// "Failed leads" tab: a lead that didn't make it into the Waiting list, with every answer, so it can be added by hand.
function healthFailedLead(l, why, contacted) {
  var sh = healthTab(HEALTH_FAILED_TAB, HEALTH_FAILED_HEADERS);
  var f = function (keys) { return typeof field === "function" ? field(l, keys) : ""; };
  var safe = function (v) { v = String(v || "").slice(0, 300); return /^[=+\-@]/.test(v) ? "'" + v : v; };
  var name = f(["full_name", "name"]) || (f(["first_name"]) + " " + f(["last_name"])).trim();
  var answers = (l.field_data || []).map(function (x) { return x.name + ": " + (x.values || []).join(", "); }).join(" | ");
  sh.appendRow([new Date(), "'" + String(l.id || ""), "'" + String(l.form_id || l._form || ""), l.created_time ? new Date(l.created_time) : "",
    safe(name), "'" + String(f(["phone"])).slice(0, 20), safe(f(["email"])), safe(f(["post", "zip"])), safe(answers.slice(0, 1000)),
    String(why || "").slice(0, 300), typeof contacted === "string" ? contacted :
      contacted ? "Yes - already texted (and the caller alerted in calling hours), but the row didn't save" : "No - not texted yet", "", ""]);
}
function healthFailedIds() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HEALTH_FAILED_TAB), out = [];
  if (!sh || sh.getLastRow() < 2) return out;
  var data = sh.getDataRange().getValues(), c = data[0].map(String).indexOf("Lead ID");
  for (var i = 1; i < data.length; i++) if (c !== -1 && data[i][c] !== "") out.push(healthId(data[i][c]));
  return out;
}
// One P1 per run for every new row in "Failed leads" / "Failed sign-ups" (never throttled). A row counts as new until its
// "Alerted at" cell is filled, which happens only once the email or the text actually went out. The leaflet's "Failed sign-ups"
// tab has no "Alerted at" column, so one is added after its last column (row numbers can't be used: rows get deleted).
function healthAlertFailedRows() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), total = 0;
  [[HEALTH_FAILED_TAB, "FB", "Facebook lead"], [HEALTH_FAILED_WEB_TAB, "WEB", "website sign-up"]].forEach(function (t) {
    var sh = ss.getSheetByName(t[0]);
    if (!sh || sh.getLastRow() < 2) return;
    var data = sh.getDataRange().getValues(), h = data[0].map(String), ac = h.indexOf("Alerted at"), rows = [];
    if (ac === -1) {
      ac = sh.getLastColumn();
      healthCols(sh, ac + 1);
      sh.getRange(1, ac + 1).setValue("Alerted at");
      var seen = Number(healthGet("HEALTH_SEEN_" + t[1], 0)) || 0;      // an earlier version counted rows: those were alerted already
      for (var j = 1; j < Math.min(seen, data.length); j++) sh.getRange(j + 1, ac + 1).setValue("(earlier)");
      healthProps().deleteProperty("HEALTH_SEEN_" + t[1]);
      h[ac] = "Alerted at";
      data.forEach(function (r, i) { r[ac] = i && i < seen ? "(earlier)" : ""; });
    }
    for (var i = 1; i < data.length; i++) {
      if (!data[i].some(function (v, c) { return c !== ac && v !== "" && v !== null && v !== undefined; })) continue;
      if (data[i][ac] === "" || data[i][ac] === null || data[i][ac] === undefined) rows.push(i);
    }
    if (!rows.length) return;
    var n = rows.length, web = t[1] === "WEB";
    var lines = rows.map(function (i) {
      return "Row " + (i + 1) + ":\n" + h.map(function (name, c) {
        var v = data[i][c]; if (!name || name === "Alerted at" || v === "" || v === null || v === undefined) return "";
        return "  " + name + ": " + (v instanceof Date ? healthFmt(v, "dd/MM/yyyy HH:mm") : String(v).replace(/^'/, ""));
      }).filter(String).join("\n");
    }).join("\n\n");
    var when = data[rows[0]][0] instanceof Date ? healthHM(data[rows[0]][0]) : healthHM(new Date());
    var res = healthAlert("P1", "FAILED_ROWS_" + t[1], web ? (n === 1 ? "A website sign-up failed to save at " + when : n + " website sign-ups failed to save") :
      (n === 1 ? "A Facebook lead is not in the Waiting list" : n + " Facebook leads are not in the Waiting list"), {
      what: lines,
      affects: (n === 1 ? "This person isn't" : "These people aren't") + " in the Waiting list, so nobody will call them unless they're added by hand.",
      todo: "Add each person to the Waiting list by hand (same columns), then call them first. Write your initials in the last column of the " + t[0] + " tab when done." +
        (web ? "" : " The lead checker won't add these people again."),
      plan: web ? "R7" : "R3"
    }, { event: true, every: 0, short: n + " " + (web ? "sign-ups" : "FB leads") + " not saved",
      sms: web ? (n === 1 ? "KD P1: a website sign-up failed to save at " + when + ". Details in Failed sign-ups tab. Add and call them." :
        "KD P1: " + n + " website sign-ups failed to save. Details in Failed sign-ups tab. Add and call them.") :
        "KD P1: " + healthPlural(n, "Facebook lead") + " not in the sheet. Names in your email and the Failed leads tab. Call them first. Plan R3" });
    if (!res.emailed && !res.texted) return;                       // nothing reached anyone: try again on the next run
    rows.forEach(function (i) { sh.getRange(i + 1, ac + 1).setValue(new Date()); });
    total += n;
  });
  return total;
}

// H8 (hourly): every Meta lead of the last 26 h must be in the sheet (by exact Lead ID). Leads the lead checker hasn't
// reached yet (it's stopped or failing, and they're inside its 15-minute overlap window and not marked seen) are left to
// it: it adds them once it runs again, and H1/H2/H4/H15 are already telling the owner it's stopped.
function healthMetaReconcile(ctx) {
  ctx = ctx || healthCtx();
  var token = healthGet("META_PAGE_TOKEN"), forms = healthList(healthGet("META_FORM_IDS"));
  if (!token || !forms.length || ctx.sheetBad) return;
  var W = healthWl(ctx), have = {}, skip = {}, ic = W.C["Lead ID"];
  if (ic === undefined) return;                                     // no Lead ID column: H4 says so; nothing can be compared
  for (var i = 1; i < W.data.length; i++) have[healthId(W.data[i][ic])] = true;
  Object.keys(healthJson("META_RETRY", {}) || {}).forEach(function (id) { skip[id] = true; });   // still being retried by the poller
  healthFailedIds().forEach(function (id) { skip[id] = true; });                                     // already reported
  var j = healthJob("pollMetaLeads"), pollerOk = !!(j && j.ok && j.lastOk && Date.now() - j.lastOk <= 10 * 6e4);
  var sinceBy = healthJson("META_SINCE_BY_FORM", {}) || {}, seen = {};
  (healthJson("META_SEEN", []) || []).forEach(function (id) { seen[String(id)] = true; });
  var since = Math.floor(Date.now() / 1000) - 26 * 3600, cutoff = Date.now() - 15 * 6e4, missing = [];
  var base = healthNum("HEALTH_BASELINE_MANUAL", 0);                // healthSetBaseline(): test leads deleted on purpose before this
  forms.forEach(function (f) {
    var r = healthGraph(f + "/leads", { limit: "100", fields: "id,created_time,field_data,platform,is_organic,form_id",
      filtering: JSON.stringify([{ field: "time_created", operator: "GREATER_THAN", value: since }]) }, token);
    if (!r.ok) return;                                                                                // Meta errors: H2
    r.data.forEach(function (l) {
      var id = String(l.id), t = new Date(l.created_time).getTime();
      if (!(t < cutoff && t >= base && !have[id] && !skip[id])) return;
      if (!pollerOk && !seen[id] && (!sinceBy[f] || t / 1000 > Number(sinceBy[f]) - 900)) return;   // the lead checker will still read it
      l._form = f; missing.push(l); skip[id] = true;
    });
  });
  ctx.reconcileMissing = missing.length;
  if (!missing.length) return 0;
  missing.forEach(function (l) {
    healthFailedLead(l, "Not in the Waiting list (found by the hourly Meta check, " + healthHM(new Date()) + ")",
      seen[String(l.id)] ? "Probably - the script handled this lead, but its row isn't in the Waiting list now (deleted or moved?)" : false);
  });
  healthAlertFailedRows();
  healthProps().setProperty("HEALTH_H8_LAST", String(Date.now()));
  return missing.length;
}

// Page forms, with a Page token from /me/accounts if META_PAGE_TOKEN is a System User token.
function healthPageForms() {
  var pid = healthGet("META_PAGE_ID"), token = healthGet("META_PAGE_TOKEN");
  if (!pid || !token) return null;
  var params = { fields: "id,name,status,created_time,leads_count", limit: "100" }, r = healthGraph(pid + "/leadgen_forms", params, token);
  if (!r.ok) {
    var acc = healthGraph("me/accounts", { fields: "id,access_token", limit: "100" }, token);
    var pg = acc.ok ? acc.data.filter(function (x) { return String(x.id) === pid; })[0] : null;
    if (pg && pg.access_token) r = healthGraph(pid + "/leadgen_forms", params, pg.access_token);
  }
  return r.ok ? r.data : null;
}
// H10 (hourly 08–22): a live form that the poller doesn't read.
function healthFormsCheck(ctx) {
  ctx = ctx || healthCtx();
  if (!healthGet("META_PAGE_ID")) return;
  var forms = healthPageForms();
  ctx.pageForms = forms;
  if (!forms) return;                                               // Meta error: H2 / H18
  var listed = healthList(healthGet("META_FORM_IDS")), ignore = healthList(healthGet("HEALTH_IGNORE_FORMS"));
  var status = function (f) { return String(f.status || "").toUpperCase(); };
  var unread = forms.filter(function (f) { return status(f) === "ACTIVE" && listed.indexOf(String(f.id)) === -1 && ignore.indexOf(String(f.id)) === -1; });
  if (unread.length) {
    var f0 = unread[0], nm = String(f0.name || "").slice(0, 30);
    healthAlert("P1", "H10_FORMS", "New Facebook form '" + nm + "' is live but not read" + (unread.length > 1 ? " (+" + (unread.length - 1) + " more)" : ""), {
      what: unread.map(function (f) { return "- '" + f.name + "' (ID " + f.id + "), created " + healthHM(new Date(f.created_time)); }).join("\n") +
        "\nis active on the Page but not in Script Property META_FORM_IDS.",
      affects: "Leads from that form are not added to the Waiting list or texted.",
      todo: "Add the ID to META_FORM_IDS (comma-separated) now - its earlier leads are then collected from the form's start. If the form isn't used, archive it in Meta (or add its ID to HEALTH_IGNORE_FORMS).",
      plan: "R3"
    }, { sig: unread.map(function (f) { return f.id; }).sort().join(","), short: "FB form not read",
      sms: "KD P1: new Facebook form '" + nm.slice(0, 25) + "' (ID " + f0.id + ") is live but not read. Add its ID to META_FORM_IDS now. Plan R3" });
  } else healthResolve("H10_FORMS");
  var mine = forms.filter(function (f) { return listed.indexOf(String(f.id)) !== -1; });
  var archived = mine.filter(function (f) { return status(f) === "ARCHIVED"; });
  if (archived.length && !mine.some(function (f) { return status(f) === "ACTIVE"; }))
    healthAlert("P2", "H10_ARCHIVED", "The Facebook form the script reads is archived", {
      what: "Every form in META_FORM_IDS is archived: " + archived.map(function (f) { return "'" + f.name + "' (" + f.id + ")"; }).join(", ") + ".",
      affects: "If the ads now use another form, its leads are only read once its ID is in META_FORM_IDS.",
      todo: "Check which form the live ad uses (Ads Manager > ad > Instant form) and make sure its ID is in META_FORM_IDS."
    }, { sig: archived.map(function (f) { return f.id; }).join(",") });
  else healthResolve("H10_ARCHIVED");
}

function healthSetBaseline() {
  var token = healthGet("META_PAGE_TOKEN"), counts = {};
  healthList(healthGet("META_FORM_IDS")).forEach(function (f) {
    var r = healthGraph(f, { fields: "id,leads_count" }, token);
    if (r.ok && r.data[0]) counts[f] = Number(r.data[0].leads_count) || 0;
  });
  var now = Date.now();
  healthSetJson("HEALTH_BASELINE", { at: now, forms: counts });
  healthProps().setProperties({ HEALTH_BASELINE_AT: String(now), HEALTH_BASELINE_MANUAL: String(now) });
  healthProps().deleteProperty("HEALTH_H9_STREAK");
  console.log("Baseline set " + healthHM(now) + ": " + JSON.stringify(counts) + ". The next backup won't alarm about deleted rows.");
  return counts;
}
// H9 (hourly 08–22): Meta's own counts against the sheet. The only check that sees leads Meta has but won't show our app.
function healthMetaCount(ctx) {
  ctx = ctx || healthCtx();
  var W = healthWl(ctx), today = healthDay(), gaps = [], token = healthGet("META_PAGE_TOKEN"), forms = healthList(healthGet("META_FORM_IDS"));
  // (a) ad account Insights: today's paid leads, against the sheet's paid Meta rows today
  if (typeof adsAccount === "function" && adsAccount() && adsToken()) {
    var t = adsGraphGet(adsAccount() + "/insights", { level: "account", date_preset: "today", action_report_time: "conversion", fields: "actions" });
    if (t) {
      var m = adsAction((t[0] || {}).actions, ["onsite_conversion.lead_grouped", "lead", "leadgen_grouped"]), s = 0;
      for (var i = 1; i < W.data.length; i++) {
        var r = W.data[i], st = healthV(W, r, "Signup Time");
        if (st instanceof Date && healthDay(st) === today && healthIsMeta(W, r) && String(healthV(W, r, "Organic?")) !== "Yes") s++;
      }
      gaps.push({ meta: m, sheet: s, what: "today" });
    }
  }
  // (b) each form's leads_count since healthSetBaseline()
  if (token && forms.length) {
    var counts = {}, base = healthJson("HEALTH_BASELINE", null);
    forms.forEach(function (f) { var r = healthGraph(f, { fields: "id,leads_count" }, token); if (r.ok && r.data[0]) counts[f] = Number(r.data[0].leads_count) || 0; });
    if (!base || !base.forms) healthSetJson("HEALTH_BASELINE", { at: Date.now(), forms: counts });
    else {
      var meta = 0, sheet = 0, known = Object.keys(counts).filter(function (f) { return base.forms[f] !== undefined; });
      known.forEach(function (f) { meta += Math.max(0, counts[f] - base.forms[f]); });
      for (var k = 1; k < W.data.length; k++) {
        var row = W.data[k], su = healthV(W, row, "Signup Time");
        if (su instanceof Date && su.getTime() >= base.at && healthIsMeta(W, row) && known.indexOf(healthId(healthV(W, row, "Form ID"))) !== -1) sheet++;
      }
      // a form added since the baseline gets its own baseline
      Object.keys(counts).forEach(function (f) { if (base.forms[f] === undefined) base.forms[f] = counts[f]; });
      healthSetJson("HEALTH_BASELINE", base);
      if (known.length) gaps.push({ meta: meta, sheet: sheet, what: "since " + healthHM(base.at) });
    }
  }
  var worst = gaps.filter(function (g) { return g.meta - g.sheet >= 3 && (g.meta - g.sheet) >= 0.2 * g.meta; })
    .sort(function (a, b) { return (b.meta - b.sheet) - (a.meta - a.sheet); })[0];
  var streak = worst ? Number(healthGet("HEALTH_H9_STREAK", 0)) + 1 : 0;
  healthProps().setProperty("HEALTH_H9_STREAK", String(streak));
  ctx.h9gap = !!worst;
  if (!worst) { healthResolve("H9_COUNT"); return gaps; }
  if (streak < 2) return gaps;                                       // two runs in a row: Meta's counts lag a little
  healthAlert("P1", "H9_COUNT", "Meta counts " + worst.meta + " leads " + worst.what + ", the sheet has " + worst.sheet, {
    what: "Meta's own count of Facebook/Instagram leads (" + worst.what + ") is " + worst.meta + ", but the Waiting list has " + worst.sheet + " of them. This was the same an hour ago.",
    affects: "Real people filled in the form but aren't in the Waiting list. Most likely the app can't see real leads (app review, Leads access or permissions), so only test leads get through.",
    todo: "Download the leads from Meta Business Suite > Leads Center > the form > Download, add the missing people by hand and call them. Then forward this email to the ads chat (check App Review / Leads access, runbook R3).",
    plan: "R3"
  }, { sig: worst.what.split(" ")[0], short: "Meta leads missing",
    sms: "KD P1: Meta counts " + worst.meta + " leads " + worst.what + ", the sheet has " + worst.sheet + ". Real leads may be hidden from the script (app/permissions). Plan R3" });
  return gaps;
}

// H11 (hourly 09–21): no Facebook lead for N hours while the ads spend. N from the budget: about 1 window in 100 is empty by chance.
function healthNoMetaLeads(ctx) {
  ctx = ctx || healthCtx();
  var p = healthProps(), now = Date.now(), act = healthJson("ADS_ACTIVE_CAMPAIGNS", null);
  var ts = healthGet("ADS_TODAY_SPEND").split("|"), spend = ts[0] === healthDay() ? Number(ts[1]) || 0 : 0;
  if (!act || now - act.t > 3 * 36e5 || !(act.n >= 1) || spend < 5) { healthResolve("H11_NOLEADS"); return; }
  var budget = healthNum("ADS_DAILY_BUDGET", 0), perHour = budget / 1.5 / 14;
  var N = Math.min(6, Math.max(2, perHour > 0 ? 4.6 / perHour : 6));
  var W = healthWl(ctx), last = 0;
  for (var i = 1; i < W.data.length; i++) {
    var t = healthV(W, W.data[i], "Signup Time");
    if (t instanceof Date && healthIsMeta(W, W.data[i])) last = Math.max(last, t.getTime());
  }
  // the window starts at the last Meta row (or midnight), but never before launch, before the campaigns came back on, or
  // before healthSetBaseline() (test rows deleted)
  var launch = healthParseTime(healthGet("LAUNCH_DATE")), from = last || healthAt(new Date(), 0, 0).getTime();
  [launch ? healthAt(launch, 0, 0).getTime() : 0, healthNum("ADS_ACTIVE_SINCE", 0), healthNum("HEALTH_BASELINE_MANUAL", 0)]
    .forEach(function (t) { if (t > from) from = t; });
  var hrs = (now - from) / 36e5;
  if (hrs < N) { healthResolve("H11_NOLEADS"); return; }
  var openKey = function (k) { return !!healthState(k).open; };
  var other = ctx.h9gap || ctx.reconcileMissing || openKey("H9_COUNT") || openKey("H1_POLLER") || openKey("H2_META") ||
    now - Number(healthGet("HEALTH_H8_LAST", 0)) < 2 * 36e5;
  var head = "No Facebook leads for " + healthDur(hrs * 60) + " while the ads spent \u00A3" + spend.toFixed(2) + " today";
  if (other) healthAlert("P1", "H11_NOLEADS", head + " (and other lead checks are failing)", {
    what: head + ". Other checks also show a problem (missing leads, Meta errors or the lead checker stopped).",
    affects: "Real leads are probably being lost or hidden from the script.",
    todo: "Read the other alert emails first. Download leads from Meta Business Suite > Leads Center and add any missing people by hand.",
    plan: "R3"
  }, { short: "no FB leads", sms: "KD P1: no Facebook leads for " + healthDur(hrs * 60) + " while ads spend, and other lead checks fail. Real leads may be hidden from the script. Plan R3" });
  else healthAlert("P2", "H11_NOLEADS", head, {
    what: head + " (budget \u00A3" + budget + "/day: at this budget a gap of " + healthDur(N * 60) + " or more happens by chance about 1 time in 100).",
    affects: "Usually chance. Sometimes the ad has stopped converting or leads are hidden from the script.",
    todo: "Check Ads Manager's lead count for today. If Meta shows leads that aren't in the Waiting list, download them from Leads Center and add them by hand."
  });
}

// ======================================================================================================
// H12–H14: ads, ClickSend credit, texts
// ======================================================================================================
// H12 (hourly 07–23): adsStatusCheck (meta-ads.gs) keeps writing the "Ad status" tab; its alerts go through healthAlert.
function healthAdsCheck(ctx) { if (typeof adsStatusCheck === "function") adsStatusCheck(true); }

function healthSmsLog(ctx) {
  ctx = ctx || {};
  if (ctx.sms) return ctx.sms;
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(typeof TRK_SMS_TAB !== "undefined" ? TRK_SMS_TAB : "SMS log"), out = [];
  if (sh && sh.getLastRow() > 1) {
    var n = Math.min(sh.getLastRow() - 1, 600);
    sh.getRange(sh.getLastRow() - n + 1, 1, n, 6).getValues().forEach(function (r) {
      if (r[0] instanceof Date) out.push({ t: r[0].getTime(), type: String(r[1]), id: String(r[3]).replace(/^'/, ""), status: String(r[4]), price: Number(r[5]) || 0 });
    });
  }
  ctx.sms = out; ctx.smsTab = !!sh;
  return out;
}
function healthClickSendHistory(ctx, hours) {
  ctx = ctx || {};
  if (ctx.csHist) return ctx.csHist;
  var user = healthGet("CLICKSEND_USER"), key = healthGet("CLICKSEND_KEY");
  if (!user || !key) return (ctx.csHist = { ok: false, code: 0, msgs: [] });
  var auth = { Authorization: "Basic " + Utilities.base64Encode(user + ":" + key) }, to = Math.floor(Date.now() / 1000);
  var from = to - (hours || 26) * 3600, page = 1, last = 1, msgs = [];
  do {
    var res;
    try { res = UrlFetchApp.fetch("https://rest.clicksend.com/v3/sms/history?date_from=" + from + "&date_to=" + to + "&page=" + page + "&limit=100", { headers: auth, muteHttpExceptions: true }); }
    catch (e) { return (ctx.csHist = { ok: false, code: 0, msgs: [] }); }
    if (res.getResponseCode() !== 200) return (ctx.csHist = { ok: false, code: res.getResponseCode(), msgs: [] });
    var d = {}; try { d = JSON.parse(res.getContentText()).data || {}; } catch (e) {}
    (d.data || []).forEach(function (m) { msgs.push(m); });
    last = Number(d.last_page || 1); page++;
  } while (page <= last && page <= 20);
  return (ctx.csHist = { ok: true, code: 200, msgs: msgs });
}
function healthCsTime(m) { return Number(m.date || m.date_added || 0) * 1000; }
function healthCsDelivered(m) { return /^(DELIVERED|RECEIVED)$/i.test(String(m.status || "").trim()); }   // not "Undelivered"
function healthClickSendDown(status) { return /CREDIT|HTTP|ERROR|AUTH|ACCOUNT|UNKNOWN|unreadable/i.test(String(status)); }

// H13 (08/12/16/20): ClickSend credit. Uses the same key ("SMS_BALANCE") as tracking.gs's 06:15 alarm, so they never double up.
function healthClickSendBalance(ctx) {
  ctx = ctx || healthCtx();
  var user = healthGet("CLICKSEND_USER"), key = healthGet("CLICKSEND_KEY");
  if (!user || !key) return;                                       // H3 reports blank keys
  var res = null;
  try { res = UrlFetchApp.fetch("https://rest.clicksend.com/v3/account", { headers: { Authorization: "Basic " + Utilities.base64Encode(user + ":" + key) }, muteHttpExceptions: true }); }
  catch (e) { console.warn("ClickSend account: " + e); return; }
  var code = res.getResponseCode();
  if (code === 401 || code === 403) {
    healthAlert("P1", "H13_LOGIN", "ClickSend login failed (" + code + ")", {
      what: "ClickSend refused the username/API key in Script Properties CLICKSEND_USER / CLICKSEND_KEY (HTTP " + code + ").",
      affects: "No texts go out at all: no thank-you texts to leads, no new-lead alerts to the caller, no critical alerts to you.",
      todo: "Log in to ClickSend, check the account isn't suspended, and copy the API key again into CLICKSEND_KEY (Developers > API credentials). Meanwhile the caller works from the sheet (filter view To call).",
      plan: "R4"
    }, { noSms: true, short: "ClickSend login failed" });
    return;
  }
  healthResolve("H13_LOGIN");
  if (code !== 200) return;
  var bal = NaN; try { bal = Number((JSON.parse(res.getContentText()).data || {}).balance); } catch (e) {}
  if (isNaN(bal)) return;
  healthProps().setProperty("HEALTH_CS_BALANCE", String(bal));
  var warn = healthNum("HEALTH_BALANCE_WARN", 15), crit = healthNum("HEALTH_BALANCE_CRIT", 5), now = Date.now(), spend7 = 0;
  healthSmsLog(ctx).forEach(function (m) { if (now - m.t <= 7 * 864e5) spend7 += m.price; });
  var three = 3 * spend7 / 7, b = "\u00A3" + bal.toFixed(2);
  var body = {
    what: "ClickSend credit is " + b + " (warning level \u00A3" + warn + ", critical \u00A3" + crit + "; 3 days of texts at last week's rate is about \u00A3" + three.toFixed(2) + ").",
    affects: "When the credit runs out, leads get no thank-you text and the caller gets no new-lead alerts.",
    todo: "Top up ClickSend now (Billing > Top up). If auto top-up is on, it should have fired at \u00A310 - check the card. Then check auto top-up is still switched on.",
    plan: "R4"
  };
  if (bal < crit) healthAlert("P1", "SMS_BALANCE", "ClickSend credit " + b + " - texts stop soon", body, { short: "ClickSend credit " + b,
    sms: "KD P1: ClickSend credit " + b + ". Lead and caller texts stop soon. Top up now - auto top-up may have failed. Plan R4" });
  else if (bal < warn || bal < three) healthAlert("P2", "SMS_BALANCE", "ClickSend credit is low (" + b + ")", body);
  else healthResolve("SMS_BALANCE");
}

// A later text went through after a failed one: of the same type, or of any type when the whole account was the problem.
function healthSmsRecovered(log, bad, type) {
  var anyType = healthClickSendDown(bad.status);
  return log.some(function (m) { return m.t > bad.t && m.status === "SUCCESS" && (anyType || m.type === type); });
}
// H14a (every 5 min, from the SMS log + the Waiting list). Both text alerts stay open until a later text proves ClickSend
// works again - a quiet spell with no new leads proves nothing. While open (and no new failure) they're re-raised in
// calling hours only, so the normal 3-hourly reminder runs and nothing is said overnight.
function healthSmsCheck(ctx) {
  ctx = ctx || healthCtx();
  var log = healthSmsLog(ctx), now = Date.now(), hours = inCallHours(new Date(now)), day = 24 * 36e5;
  if (ctx.smsTab) {
    var badC = null;
    log.forEach(function (m) { if (m.type === "caller alert" && m.status !== "SUCCESS" && (!badC || m.t >= badC.t)) badC = m; });
    var cs = healthState("H14_CALLER_SEND");
    var cRec = !!badC && healthSmsRecovered(log, badC, "caller alert");
    var cOpen = badC && now - badC.t <= day && !cRec && (now - badC.t <= 15 * 6e4 || cs.open);
    if (cOpen && (now - badC.t <= 15 * 6e4 || hours)) {
      var hm = healthHM(badC.t);
      healthAlert("P1", "H14_CALLER_SEND", "Caller alert not sent (" + hm + ", " + badC.status + ")", {
        what: "The new-lead text to the caller at " + hm + " was not accepted by ClickSend (" + badC.status + "), and no caller alert has gone through since.",
        affects: "The caller may not know about new leads.",
        todo: "Open the Waiting list: call the newest rows with a blank Status now. Then check ClickSend (credit, sender ID) and that ONCALL_MOBILE is right.",
        plan: "R4/R5"
      }, { noSms: healthClickSendDown(badC.status), sig: badC.status, short: "caller alert failed",
        sms: "KD P1: caller alert not sent (" + hm + ", " + badC.status + "). The caller may not know about new leads. Plan R4/R5" });
    } else if (!cOpen) healthResolve("H14_CALLER_SEND", cRec ? "A later text went through, so ClickSend is sending again." : "");
    var lead = log.filter(function (m) { return m.type === "lead text" && now - m.t <= 36e5; });
    var bad = lead.filter(function (m) { return m.status !== "SUCCESS"; }), lastBad = null;
    log.forEach(function (m) { if (m.type === "lead text" && m.status !== "SUCCESS" && (!lastBad || m.t >= lastBad.t)) lastBad = m; });
    var lf = healthState("H14_LEAD_FAIL"), lRec = !!lastBad && healthSmsRecovered(log, lastBad, "lead text");
    if (bad.length >= 3 || (lead.length >= 5 && bad.length / lead.length >= 0.2)) {
      var why = {}; bad.forEach(function (m) { why[m.status] = (why[m.status] || 0) + 1; });
      var top = Object.keys(why).sort(function (a, b) { return why[b] - why[a]; })[0];
      healthAlert("P1", "H14_LEAD_FAIL", bad.length + " of " + lead.length + " lead texts failed in the last hour (" + top + ")", {
        what: bad.length + " of the " + lead.length + " thank-you texts to new leads in the last hour failed (" + Object.keys(why).map(function (k) { return k + " x" + why[k]; }).join(", ") + ").",
        affects: "New leads aren't getting their thank-you text. The caller can still call them from the sheet.",
        todo: "INSUFFICIENT_CREDIT: top up ClickSend. Other codes: check the ClickSend account (sender ID, key). Once fixed, run healthResendFailedTexts() in calling hours.",
        plan: "R4"
      }, { noSms: healthClickSendDown(top), sig: top, short: "lead texts failing", sms: "KD P1: " + bad.length + " lead texts failed in the last hour (" + top + "). Plan R4" });
    } else if (lf.open && lastBad && now - lastBad.t <= day && !lRec) {
      if (hours) healthAlert("P1", "H14_LEAD_FAIL", lf.subject || "Lead texts failing", {
        what: "Thank-you texts to new leads are still failing: the last one at " + healthHM(lastBad.t) + " (" + lastBad.status + "), and none has gone through since.",
        affects: "New leads aren't getting their thank-you text. The caller can still call them from the sheet.",
        todo: "INSUFFICIENT_CREDIT: top up ClickSend. Other codes: check the ClickSend account (sender ID, key). Once fixed, run healthResendFailedTexts() in calling hours.",
        plan: "R4"
      }, { noSms: healthClickSendDown(lastBad.status), sig: lf.sig, short: "lead texts failing", sms: "KD P1: lead texts still failing (" + lastBad.status + "). Plan R4" });
    } else healthResolve("H14_LEAD_FAIL", lRec ? "A later text went through, so ClickSend is sending again." : "");
  }
  if (ctx.sheetBad) return;
  var W = healthWl(ctx), rows = [];
  for (var i = 1; i < W.data.length; i++) {
    var r = W.data[i];
    if (!healthIsMeta(W, r)) continue;
    var t = healthV(W, r, "Logged at"); if (!(t instanceof Date)) t = healthV(W, r, "Signup Time");
    if (!(t instanceof Date) || now - t < 10 * 6e4 || now - t > 864e5) continue;
    var st = String(healthV(W, r, "Status")).trim().toUpperCase();
    if (st === "DO NOT CONTACT" || st === "DUPLICATE") continue;
    if (String(healthV(W, r, "SMS status")).trim() === "") rows.push(i + 1);
  }
  if (rows.length) healthAlert("P2", "H14_NO_TEXT", healthPlural(rows.length, "Facebook lead") + " got no thank-you text", {
    what: "Waiting list row" + (rows.length > 1 ? "s " : " ") + rows.join(", ") + ": a Facebook lead from the last 24 hours with a blank SMS status.",
    affects: "Usually the phone number is in a format the script skips, so the person got no text (the caller can still ring them).",
    todo: "Check the phone number in those rows (a UK mobile, 07... or +447...). Text them by hand if needed, and tell the leaflet chat which format was skipped."
  }, { sig: rows.join(",") });
  else healthResolve("H14_NO_TEXT");
}
// H14b (hourly, from ClickSend's own history)
function healthSmsHistoryCheck(ctx) {
  ctx = ctx || healthCtx();
  var hist = healthClickSendHistory(ctx, 26);
  if (!hist.ok) return;                                             // login problems: H13
  var now = Date.now(), today = healthDay(), msgs = hist.msgs;
  var caller = msgs.filter(function (m) { var a = now - healthCsTime(m); return /NEW LEAD/.test(String(m.body)) && a >= 15 * 6e4 && a <= 2 * 36e5 && !healthCsDelivered(m); });
  if (caller.length) {
    var c0 = caller[caller.length - 1], hm = healthHM(healthCsTime(c0));
    healthAlert("P1", "H14_CALLER_DLR", "Caller alert not delivered (" + hm + ", " + (c0.status || "no report") + ")", {
      what: "A new-lead text to the caller sent at " + hm + " has not been delivered after 15 minutes (ClickSend: " + (c0.status || "no report") + ").",
      affects: "The caller may not know about a new lead.",
      todo: "Ring the caller. Check their phone isn't off or blocking the sender. Call the newest rows with a blank Status from the sheet.",
      plan: "R4/R5"
    }, { sig: String(c0.message_id || hm), short: "caller alert undelivered",
      sms: "KD P1: caller alert not delivered (" + hm + ", " + String(c0.status || "no report").toUpperCase() + "). The caller may not know about new leads. Plan R4/R5" });
  } else healthResolve("H14_CALLER_DLR");
  var leads = msgs.filter(function (m) { var a = now - healthCsTime(m); return /^Hi /.test(String(m.body)) && a <= 864e5 && a >= 30 * 6e4; });
  var dl = leads.filter(healthCsDelivered).length;
  if (leads.length >= 10 && dl / leads.length < 0.9) healthAlert("P2", "H14_DLR_RATE", "Only " + Math.round(100 * dl / leads.length) + "% of lead texts delivered (24 h)", {
    what: dl + " of " + leads.length + " thank-you texts in the last 24 hours were delivered.",
    affects: "Some leads don't get their text (wrong numbers, phones off, or the sender name is being filtered).",
    todo: "Look at the SMS log tab (Delivery detail). Many 'invalid' = junk leads; many 'failed' = ask ClickSend support about the sender ID."
  });
  else healthResolve("H14_DLR_RATE");
  var todayN = msgs.filter(function (m) { return healthDay(new Date(healthCsTime(m))) === today; }).length;
  var echoes = msgs.some(function (m) { return String(m.source || "") === "apps-script"; });   // only trust "source" if ClickSend echoes ours
  var foreign = echoes ? msgs.filter(function (m) { return m.source !== undefined && m.source !== null && String(m.source) !== "" && String(m.source) !== "apps-script"; }) : [];
  var normal = 0; healthSmsLog(ctx).forEach(function (m) { if (now - m.t <= 7 * 864e5) normal++; }); normal = Math.round(normal / 7);
  if (todayN > 200 || foreign.length) healthAlert("P1", "H14_VOLUME", todayN > 200 ? todayN + " texts today (normal " + normal + ")" : healthPlural(foreign.length, "text") + " sent outside our scripts", {
    what: "ClickSend shows " + todayN + " texts today (normal about " + normal + " a day)" + (foreign.length ? ", including " + healthPlural(foreign.length, "text") + " not sent by our scripts (source: " + foreign[0].source + ")" : "") + ".",
    affects: "Either spam sign-ups, a script running twice (a copied sheet with its own triggers), or someone sending from the ClickSend dashboard. It costs money and can break consent rules.",
    todo: "Check ClickSend > Messages > history now. If texts went to many people at once, stop it there. Check for copies of the script (script.google.com > My projects).",
    plan: "R8"
  }, { sig: foreign.length ? "foreign" : "volume", short: "too many texts", sms: "KD P1: " + todayN + " texts today (normal " + normal + "), or texts sent outside our scripts. Check ClickSend now. Plan R8" });
  else healthResolve("H14_VOLUME");
  var byTo = {}, doubles = 0;
  msgs.filter(function (m) { return /^Hi /.test(String(m.body)); }).sort(function (a, b) { return healthCsTime(a) - healthCsTime(b); }).forEach(function (m) {
    var k = healthDigits(m.to), t = healthCsTime(m);
    if (byTo[k] && t - byTo[k] <= 5 * 6e4) doubles++;
    byTo[k] = t;
  });
  if (doubles) healthAlert("P2", "H14_DOUBLE", healthPlural(doubles, "person", "people") + " got the lead text twice within 5 minutes", {
    what: "ClickSend shows the same number getting the thank-you text twice within 5 minutes (" + doubles + " times in the last 26 hours).",
    affects: "Usually a copy of the script (e.g. a restored backup with its own triggers) is running as well. Everyone gets texted twice.",
    todo: "script.google.com > My projects: delete the triggers and deployments of any copy of this project. Forward this email to the ads chat.",
    plan: "register row 90"
  }, { sig: String(doubles) });
  else healthResolve("H14_DOUBLE");
}

// ======================================================================================================
// H15: did every job run, and did any lead or sign-up fail to save?  (every 5 min)
// ======================================================================================================
function healthJobsCheck(ctx) {
  ctx = ctx || healthCtx();
  var now = new Date(), ms = now.getTime(), hm = healthMins(now), dayStart = healthAt(now, 0, 0).getTime(), w = callWindow(), late = [], slow = [];
  var pj = healthJob("pollMetaLeads");
  // failing (not stopped – that's H1) for 10+ min; blank settings, Meta errors and header problems have their own alerts (H3, H2, H4)
  if (pj && !pj.ok && pj.firstFail && ms - pj.firstFail >= 10 * 6e4 && ms - pj.last <= 10 * 6e4 && !/^(config|meta|sheet):/.test(pj.err || "")) {
    healthAlert("P1", "H15_POLLER", "pollMetaLeads failing since " + healthHM(pj.firstFail) + " (" + String(pj.err).replace(/^\w+:\s*/, "").slice(0, 60) + ")", {
      what: "The Facebook lead checker runs but ends with an error every time since " + healthHM(pj.firstFail) + ": " + pj.err,
      affects: "New Facebook/Instagram leads may not be added or texted.",
      todo: "Apps Script > Executions > pollMetaLeads shows the full error. Forward it to the ads chat. Meanwhile check Meta Business Suite > Leads Center every 2 hours.",
      plan: "R3"
    }, { short: "lead checker failing", sms: "KD P1: pollMetaLeads failing since " + healthHM(pj.firstFail) + " (" + String(pj.err).replace(/^\w+:\s*/, "").slice(0, 40) + "). Plan R3" });
  } else healthResolve("H15_POLLER");
  var j;
  if (inCallHours(now) && hm >= w.from * 60 + 30) ["backlogCheck", "trkRetryCheck"].forEach(function (n) {
    j = healthJob(n); if (j && ms - j.last > 30 * 6e4) late.push(n + " (every 15 min) last ran " + healthHM(j.last));
  });
  [["morningSummary", w.from * 60 + 30], ["eveningReport", 21 * 60 + 30], ["adsPullInsights", 7 * 60], ["trkPullSmsHistory", 7 * 60],
    ["trkDailySnapshot", 21 * 60 + 40], ["healthDaily", 8 * 60]].forEach(function (x) {
    j = healthJob(x[0]); if (j && hm >= x[1] && j.last < dayStart) late.push(x[0] + " hasn't run today (due by " + ("0" + Math.floor(x[1] / 60)).slice(-2) + ":" + ("0" + x[1] % 60).slice(-2) + ")");
  });
  j = healthJob("healthHourly"); if (j && ms - j.last > 80 * 6e4) late.push("healthHourly last ran " + healthHM(j.last));
  if (late.length) healthAlert("P2", "H15_JOBS", healthPlural(late.length, "scheduled job") + " didn't run: " + late.map(function (x) { return x.split(" ")[0]; }).join(", "), {
    what: late.join("\n"),
    affects: "Whatever that job does (reminders, reports, delivery checks) isn't happening.",
    todo: "Apps Script > Executions: look for errors. Apps Script > Triggers: the job must be listed once. If it's missing, run its installer again (installLeadTriggers, adsInstallTriggers, trkInstallTriggers or healthInstallTriggers)."
  }, { sig: late.map(function (x) { return x.split(" ")[0]; }).join(",") });
  else healthResolve("H15_JOBS");
  HEALTH_TRIGGERS.concat(["doPost", "healthBacklogCheck"]).forEach(function (n) { var x = healthJob(n); if (x && ms - x.last <= 60 * 6e4 && x.ms > 60000) slow.push(n + " took " + Math.round(x.ms / 1000) + " s"); });
  if (slow.length) healthAlert("P2", "H15_SLOW", "A script run took over 60 seconds: " + slow.join(", "), {
    what: slow.join("\n") + ".", affects: "Slow runs use up Google's daily script time and can be cut off at 6 minutes.",
    todo: "Usually a very long sheet or a slow Google day. If it repeats, forward this email to the ads chat."
  }, { sig: slow.map(function (x) { return x.split(" ")[0]; }).join(",") });
  else healthResolve("H15_SLOW");
  healthAlertFailedRows();
}

// ======================================================================================================
// H16, H17: website and DNS
// ======================================================================================================
function healthFetch(u, noFollow) {
  try {
    var r = UrlFetchApp.fetch(u, { muteHttpExceptions: true, followRedirects: !noFollow, validateHttpsCertificates: true });
    var hd = {}; try { hd = (r.getAllHeaders ? r.getAllHeaders() : r.getHeaders()) || {}; } catch (e) {}
    return { code: r.getResponseCode(), text: String(r.getContentText() || ""), loc: String(hd.Location || hd.location || "") };
  } catch (e) { return { code: 0, text: "", loc: "", err: String(e).slice(0, 100) }; }
}
// H16 (hourly; UptimeRobot checks every 5 min from outside). Alerts after 2 failures in a row: P1 08:00–22:00, P2 overnight.
function healthSiteCheck(ctx) {
  var base = healthGet("HEALTH_SITE").replace(/\/+$/, "");
  if (!base) return;
  var exec = healthGet("HEALTH_EXEC_ID"), broken = [], warn = [], why = function (r) { return r.code ? "HTTP " + r.code : (r.err || "no answer"); };
  var reg = healthFetch(base + "/register/");
  if (reg.code !== 200) broken.push("/register " + why(reg));
  else {
    if (reg.text.indexOf("script.google.com/macros/s/") === -1) broken.push("/register has no sign-up link to the script");
    if (reg.text.indexOf("PASTE_APPS_SCRIPT_URL_HERE") !== -1) broken.push("/register still has the placeholder sign-up address");
    if (exec && reg.text.indexOf(exec) === -1) broken.push("/register points at a different script deployment than HEALTH_EXEC_ID");
    if (reg.text.indexOf("name=\"marketing\"") === -1) warn.push("/register has no optional marketing box (name=\"marketing\")");
  }
  var pr = healthFetch(base + "/privacy.html");
  if (pr.code !== 200) broken.push("/privacy.html " + why(pr));
  else {
    ["ClickSend", "Hostinger", "Meta"].forEach(function (x) { if (pr.text.indexOf(x) === -1) warn.push("the privacy page doesn't mention " + x); });
    ["Zapier", "kirkcaldydentist"].forEach(function (x) { if (pr.text.indexOf(x) !== -1) warn.push("the privacy page still mentions " + x); });
  }
  [["/l/", "register/?src=leaflet"], ["/b/", "register/?src=banner"]].forEach(function (x) {
    var r = healthFetch(base + x[0], true);
    var ok = (r.code === 200 && r.text.indexOf(x[1]) !== -1) || (r.code >= 300 && r.code < 400 && r.loc.indexOf(x[1]) !== -1);
    if (!ok) broken.push(x[0] + (r.code === 200 || (r.code >= 300 && r.code < 400) ? " doesn't lead to " + x[1] : " " + why(r)));
  });
  var host = base.replace(/^https?:\/\//, "");
  if (!/^www\./.test(host)) { var ww = healthFetch("https://www." + host + "/"); if (ww.code !== 200) broken.push("www." + host + " " + why(ww)); }
  if (exec) {
    var pg = healthFetch("https://script.google.com/macros/s/" + exec + "/exec?action=ping"), m = pg.text.match(/pong\s+(\S+)/);
    if (pg.code !== 200 || !m) broken.push("the sign-up script doesn't answer its ping (" + why(pg) + ")");
    else {
      healthProps().setProperty("HEALTH_WEB_VERSION", m[1]);
      if (m[1] !== HEALTH_VERSION) warn.push("the web app runs version " + m[1] + ", not " + HEALTH_VERSION + " (it needs a New version deployment)");
    }
  }
  var p = healthProps(), fails = broken.length ? Number(healthGet("HEALTH_SITE_FAILS", 0)) + 1 : 0, prevAt = healthGet("HEALTH_SITE_FAIL_AT");
  p.setProperty("HEALTH_SITE_FAILS", String(fails));
  if (broken.length) p.setProperty("HEALTH_SITE_FAIL_AT", String(Date.now()));
  if (!broken.length) healthResolve("H16_SITE");
  else if (fails >= 2) {
    var h = healthHour(new Date()), first = broken[0].slice(0, 45);
    healthAlert(h >= 8 && h < 22 ? "P1" : "P2", "H16_SITE", "Website broken: " + first, {
      what: "Two checks in a row (" + healthHM(Number(prevAt) || Date.now()) + " and " + healthHM(new Date()) + ") found:\n- " + broken.join("\n- "),
      affects: "Leaflet, banner and website sign-ups may fail, or people see a broken page.",
      todo: "Open " + base + "/register/ on your phone. If it's down, check Hostinger (renewal, SSL). If only the sign-up fails, the web app deployment may have changed - forward this email to the website chat.",
      plan: "R7"
    }, { sig: broken.map(function (x) { return x.split(" ")[0]; }).join(","), short: "website broken",
      sms: "KD P1: website broken (" + first.slice(0, 40) + ") at " + healthHM(Number(prevAt) || Date.now()) + " and " + healthHM(new Date()) + ". Leaflet and banner sign-ups fail. Plan R7" });
  }
  if (warn.length) healthAlert("P2", "H16_CONTENT", "Website content to fix: " + warn[0].slice(0, 60), {
    what: "- " + warn.join("\n- "), affects: "Legal wording or consent on the website is wrong or out of date.",
    todo: "Forward this email to the website chat."
  }, { sig: warn.join("|").slice(0, 200) });
  else healthResolve("H16_CONTENT");
}
function healthDns(name, type) {
  try {
    var r = UrlFetchApp.fetch("https://dns.google/resolve?name=" + encodeURIComponent(name) + "&type=" + type, { muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) return null;
    var want = { A: 1, MX: 15, TXT: 16 }[type];
    return (JSON.parse(r.getContentText()).Answer || []).filter(function (a) { return !want || a.type === want; })
      .map(function (a) { return String(a.data).replace(/" "/g, "").replace(/^"|"$/g, ""); });
  } catch (e) { return null; }
}
// H17 (daily): the domain's mail and web records.
function healthDnsCheck(ctx) {
  var d = healthGet("HEALTH_DOMAIN", "kirkcaldydental.co.uk"), p2 = [];
  var mx = healthDns(d, "MX");
  if (mx === null) return;                                         // dns.google unreachable: try again tomorrow
  if (!mx.some(function (x) { return /smtp\.google\.com|aspmx\.l\.google\.com/i.test(x); }))
    healthAlert("P1", "H17_MX", "Google mail record (MX) missing for " + d, {
      what: "The domain's mail record (MX) doesn't point at Google any more: " + (mx.join(", ") || "none") + ".",
      affects: "Emails from outside to info@ bounce (patients, Meta, ClickSend, NHS Fife).",
      todo: "In the domain's DNS settings restore the MX record: smtp.google.com, priority 1. Don't change the nameservers.",
      plan: "register row 73"
    }, { short: "MX missing", sms: "KD P1: Google mail record (MX) missing. Outside emails to info@ bounce. Restore Google MX (register row 73)." });
  else healthResolve("H17_MX");
  var txt = healthDns(d, "TXT") || [], spf = txt.filter(function (x) { return /^v=spf1/i.test(x); });
  if (spf.length !== 1) p2.push(spf.length ? "there are " + spf.length + " SPF records (must be exactly one)" : "no SPF record");
  if (!(healthDns("google._domainkey." + d, "TXT") || []).length) p2.push("no DKIM record (google._domainkey)");
  if (!(healthDns("_dmarc." + d, "TXT") || []).some(function (x) { return /^v=DMARC1/i.test(x); })) p2.push("no DMARC record (_dmarc)");
  if (healthGet("HEALTH_SITE")) {
    var a = healthDns(d, "A") || [];
    if (a.some(function (ip) { return /^(198\.185\.159\.14[45]|198\.49\.23\.14[45])$/.test(ip); })) p2.push("the website address still points at Squarespace");
  }
  if (p2.length) healthAlert("P2", "H17_DNS", "Domain settings to fix: " + p2[0], {
    what: "- " + p2.join("\n- "), affects: "Confirmation emails may land in Junk, or the website isn't the new one.",
    todo: "Forward this email to browser Claude (DNS settings), or fix it in the domain's DNS panel.", plan: "register rows 71-73"
  }, { sig: p2.join("|") });
  else healthResolve("H17_DNS");
}

// ======================================================================================================
// H18: daily self-test + "all OK" email (07:30). Its absence is itself a signal (healthchecks.io "daily").
// ======================================================================================================
function healthSelfTest(ctx) {
  ctx = ctx || healthCtx();
  var now = new Date(), f = [], ss = SpreadsheetApp.getActiveSpreadsheet();
  var add = function (level, text, fix) { f.push({ level: level, text: text, fix: fix || "" }); };
  var perm = function (what, fn) {
    try { return fn(); }
    catch (e) {
      var p = /permission|authori[sz]/i.test(String(e));
      add(p ? "P1" : "P2", what + " failed: " + healthScrub(e).slice(0, 120), p ? "Re-authorise: run healthSelfTest once by hand and allow every permission (tick \"Select all\")." : "Forward this email to the ads chat.");
      return null;
    }
  };
  var want = healthGet("HEALTH_EXPECTED_USER", "info@kirkcaldydental.co.uk");
  var user = perm("Reading the script's account", function () { return Session.getEffectiveUser().getEmail(); });
  if (user !== null && String(user).toLowerCase() !== want.toLowerCase()) add("P2", "The scripts run as " + (user || "an unknown account") + ", not " + want + ".", "Re-run the trigger installers while signed in as " + want + " only.");
  var tr = perm("Reading the triggers", function () { return ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction(); }); }) || [];
  var count = {}; tr.forEach(function (n) { count[n] = (count[n] || 0) + 1; });
  // the 3 ad triggers are added on launch day (adsInstallTriggers): until the ads are set up, 14 is the full set
  var adsOn = !!(healthGet("META_AD_ACCOUNT_ID") || healthGet("LAUNCH_DATE") || healthGet("ADS_EXPECTED_ON")) || HEALTH_ADS_TRIGGERS.some(function (n) { return count[n]; });
  var expect = HEALTH_TRIGGERS.filter(function (n) { return adsOn || HEALTH_ADS_TRIGGERS.indexOf(n) === -1; });
  var missing = expect.filter(function (n) { return !count[n]; }), dup = HEALTH_TRIGGERS.filter(function (n) { return count[n] > 1; });
  var extra = Object.keys(count).filter(function (n) { return HEALTH_TRIGGERS.indexOf(n) === -1; }), haveT = expect.length - missing.length;
  if (missing.length) add(missing.some(function (n) { return n === "pollMetaLeads" || n.indexOf("health") === 0; }) ? "P1" : "P2",
    "triggers " + haveT + " of " + expect.length + " (missing " + missing.join(", ") + ")",
    "Run the installer for the missing ones: installLeadTriggers (lead), adsInstallTriggers (ads*), trkInstallTriggers (trk*), healthInstallTriggers (health*).");
  if (dup.length) add("P2", "triggers set up twice: " + dup.join(", "), "Apps Script > Triggers: delete the extra copy.");
  if (extra.length) add("P2", "unexpected triggers: " + extra.join(", ") + " (" + tr.length + " in total; limit 20)", "Delete them unless someone added them on purpose.");
  var tz = perm("Reading the time zones", function () { return [Session.getScriptTimeZone(), ss.getSpreadsheetTimeZone()]; });
  if (tz && (tz[0] !== "Europe/London" || tz[1] !== "Europe/London")) add("P2", "time zone: script " + tz[0] + ", sheet " + tz[1] + " (both must be Europe/London)",
    "Apps Script > Project Settings > Time zone, and the sheet's File > Settings > Time zone: Europe/London. Then re-run the trigger installers.");
  var token = healthGet("META_PAGE_TOKEN");
  if (token) {
    var me = healthGraph("me", { fields: "id,name" }, token);
    if (!me.ok && !me.http) add("P1", "Meta check failed: " + me.msg, /permission|authori[sz]/i.test(me.msg) ? "Re-authorise the script with every box ticked." : "Forward this email to the ads chat.");
    else if (!me.ok) add("P1", "Meta lead token refused (" + (me.code || me.http) + ")", "See the Meta token alert; runbook R3.");
    else {
      var asked = (metaGraph().match(/\/(v\d+\.\d+)\//) || [])[1], got = "";
      Object.keys(me.headers || {}).forEach(function (k) { if (k.toLowerCase() === "facebook-api-version") got = String(me.headers[k]); });
      if (asked && got && got !== asked) add("P2", "Meta answered with API " + got + " instead of " + asked, "Meta is retiring " + asked + ": set Script Property META_API_VERSION to " + got + " (ask the ads chat first).");
    }
    healthList(healthGet("META_FORM_IDS")).forEach(function (id) {
      var r = healthGraph(id, { fields: "id,name,status" }, token);
      if (!r.ok) add("P1", "form " + id + " can't be read (" + (r.code || r.http) + ")", "Check the ID in META_FORM_IDS and that the app still has Leads access.");
    });
  }
  var q = perm("Reading the email allowance", function () { return MailApp.getRemainingDailyQuota(); });
  if (q !== null && q < 50) add("P1", "email allowance " + q + " left today", "See the email-allowance alert (plan R8)."); else if (q !== null && q < 300) add("P2", "email allowance " + q + " left today", "Check for spam sign-ups (Waiting list, last hour).");
  var access = perm("Drive", function () { return String(DriveApp.getFileById(ss.getId()).getSharingAccess()); });
  if (access !== null && access !== String(DriveApp.Access.PRIVATE)) add("P2", "the Waiting List sheet is shared by link (" + access + ")", "Share > General access > Restricted; share with named people only.");
  var editors = perm("Reading the sheet editors", function () { return ss.getEditors().map(function (u) { return String(u.getEmail()).toLowerCase(); }); }) || [];
  if (healthGet("HEALTH_EDITORS")) {
    var ok = healthList(healthGet("HEALTH_EDITORS").toLowerCase()).concat([want.toLowerCase(), String(user || "").toLowerCase()]);
    var odd = editors.filter(function (e) { return ok.indexOf(e) === -1; });
    if (odd.length) add("P2", "sheet editors not on HEALTH_EDITORS: " + odd.join(", "), "Remove them (Share), or add them to HEALTH_EDITORS if they should edit.");
  }
  perm("Gmail", function () { return GmailApp.getInboxUnreadCount(); });
  var bAt = Number(healthGet("HEALTH_BACKUP_LAST", 0));
  if (!bAt || now - bAt > 30 * 36e5) add("P2", "last backup " + (bAt ? healthHM(bAt) : "never") + " (should be under 30 hours old)", "Apps Script > Executions > healthNightly; check HEALTH_BACKUP_FOLDER.");
  if (healthGet("HEALTH_EXEC_ID") && healthGet("HEALTH_WEB_VERSION") !== HEALTH_VERSION)
    add("P2", "the website script answers version " + (healthGet("HEALTH_WEB_VERSION") || "nothing") + ", the code is " + HEALTH_VERSION,
      "Deploy > Manage deployments > edit > Version: New version > Deploy (keeps the same /exec address).");
  ["Christabella", "Zoe"].forEach(function (n) {
    [leadText(n, true), leadText(n, false)].forEach(function (s) { if (s.length > 160 || /[^\x20-\x7E]/.test(s)) add("P2", "a lead text is " + s.length + " characters or not plain text", "Forward this email to the ads chat (texts must be one plain SMS)."); });
  });
  if (!ctx.sheetBad) {
    try {
      var W = healthWl(ctx), dayAgo = now - 864e5, weekAgo = now - 7 * 864e5, blankPc = [], textDates = [], lIds = 0, pPhones = 0, pcs = 0, outside = 0;
      for (var i = 1; i < W.data.length; i++) {
        var r = W.data[i], t = healthV(W, r, "Signup Time");
        if (/^l:/i.test(String(healthV(W, r, "Lead ID")).replace(/^'/, ""))) lIds++;
        if (/^p:/i.test(String(healthV(W, r, "Phone")).replace(/^'/, ""))) pPhones++;
        if (!(t instanceof Date)) { if (String(healthV(W, r, "Name")).trim()) textDates.push(i + 1); continue; }
        var pc = String(healthV(W, r, "Postcode")).toUpperCase().replace(/\s+/g, "");
        if (t.getTime() >= dayAgo && healthIsMeta(W, r) && !pc) blankPc.push(i + 1);
        if (t.getTime() >= weekAgo && pc) { pcs++; if (!/^KY[1-5](?!\d)/.test(pc)) outside++; }
      }
      if (blankPc.length) add("P2", "Facebook rows with a blank Postcode in the last 24 h: rows " + blankPc.slice(0, 20).join(", "), "The form's question wording may have changed; forward this email to the ads chat.");
      if (textDates.length) add("P2", "rows whose Signup Time isn't a real date (typed or pasted by hand): rows " + textDates.slice(0, 20).join(", "), "Add people through the form or retype the date; never paste Meta's CSV into the Waiting list.");
      if (lIds || pPhones) add("P2", lIds + " Lead IDs starting \"l:\" and " + pPhones + " phones starting \"p:\" (pasted from Meta's CSV)", "Remove the \"l:\" / \"p:\" prefixes in those cells.");
      if (pcs >= 10 && outside / pcs > 0.1) add("P2", Math.round(100 * outside / pcs) + "% of this week's postcodes are outside KY1-KY5 (" + outside + " of " + pcs + ")", "Check the ad's location setting (KY1-KY5, people living in the area).");
    } catch (e) { add("P2", "data checks failed: " + String(e).slice(0, 100), "Forward this email to the ads chat."); }
    try {
      var dl = ss.getSheetByName(typeof TRK_DAILY_TAB !== "undefined" ? TRK_DAILY_TAB : "Daily log");
      if (dl && dl.getLastRow() > 3) {
        var dh = dl.getRange(1, 1, 1, dl.getLastColumn()).getValues()[0].map(String), ai = dh.indexOf("Attempts today"), ni = dh.indexOf("No answer today");
        var last3 = dl.getRange(dl.getLastRow() - 2, 1, 3, dh.length).getValues();
        if (ai !== -1 && ni !== -1 && last3.every(function (v) { return Number(v[ai]) >= 5 && Number(v[ni]) / Number(v[ai]) > 0.4; }))
          add("P2", "\"No answer\" was over 40% of calls for 3 days", "People may not pick up the calling number: check it isn't withheld and isn't flagged as spam (Truecaller/Hiya).");
      }
    } catch (e) {}
  }
  // the email
  var open = healthOpenAlerts(), p1 = f.filter(function (x) { return x.level === "P1"; });
  var bal = healthGet("HEALTH_CS_BALANCE"), balTxt = bal ? "ClickSend \u00A3" + Number(bal).toFixed(2) : "ClickSend not checked yet";
  var setUp = ["HEALTH_SMS", "HEALTH_PING_POLLER", "HEALTH_PING_DAILY", "HEALTH_PING_BACKUP", "META_PAGE_ID", "HEALTH_SITE", "HEALTH_EXEC_ID", "CALLER_SHIFT"].filter(function (k) { return !healthGet(k); });
  if (!adsOn) setUp.push("the 3 ad triggers (run adsInstallTriggers on launch day: 17 triggers in total)");
  if (healthGet("HEALTH_BACKUP_FOLDER") && !healthGet("HEALTH_BACKUP_SHARED")) setUp.push("the KD backups folder isn't shared with your personal Google account yet (Drive > KD backups > Share > Viewer)");
  var silent = ["backlogCheck", "morningSummary", "eveningReport", "adsPullInsights", "trkRetryCheck", "trkPullSmsHistory", "trkDailySnapshot"].filter(function (n) { return !healthJob(n); });
  var subject = "[KD] Daily check " + healthFmt(now, "HH:mm") + ": " + (f.length ? healthPlural(f.length, "problem") + " (" + f.slice(0, 3).map(function (x) { return x.text.split(" (")[0].slice(0, 40); }).join("; ") + ")" : "all OK") +
    " (" + haveT + " triggers, version " + HEALTH_VERSION + ", " + balTxt + ", " + healthPlural(open.length, "open alert") + ")";
  var body = (f.length ? "PROBLEMS FOUND\n" + f.map(function (x) { return "- [" + x.level + "] " + x.text + "\n  What to do: " + x.fix; }).join("\n") : "Everything checked is OK.") +
    "\n\nOPEN ALERTS\n" + (open.length ? open.map(function (a) { return "- [" + a.level + "] " + a.subject + " (since " + healthHM(a.first) + ")"; }).join("\n") : "none") +
    (setUp.length ? "\n\nNOT SET UP YET\n" + setUp.join(", ") : "") +
    (silent.length ? "\n\nNOT REPORTING TO THE HEALTH CHECKS YET\n" + silent.join(", ") + " (the leaflet chat adds healthMark to the trk* jobs)" : "") +
    "\n\nChecked: account, " + tr.length + " triggers, time zones, Meta token and forms, email allowance, sharing, backup age, text templates, today's rows." +
    "\n\nWaiting List sheet: " + healthUrl();
  var to = healthEmails();
  if (!to.length) { var e = new Error("No alert email address: set Script Property HEALTH_EMAIL."); e.healthNoRecipients = true; throw e; }
  var sent = perm("Sending email", function () { return healthSendEmail(to, subject, body); });
  healthLog(p1.length ? "P1" : f.length ? "P2" : "OK", "H18_DAILY", subject, "daily", !!sent, false);
  if (sent) healthPing("HEALTH_PING_DAILY");
  if (p1.length || !sent) healthAlert("P1", "H18_SELFTEST", "Daily check found " + healthPlural(p1.length || 1, "critical problem"), body,
    { noEmail: !!sent, sig: p1.map(function (x) { return x.text.slice(0, 30); }).join("|"), short: "daily check problems",
      sms: "KD P1: daily check found " + healthPlural(p1.length || 1, "problem") + " (" + (p1.length ? p1.map(function (x) { return x.text.split(" (")[0].slice(0, 30); }).join("; ") : "email not sent") + "). Details in email." });
  else healthResolve("H18_SELFTEST");
  ctx.selfTest = f;
  return f;
}

// H19 (hourly): Google's daily email allowance.
function healthMailQuota(ctx) {
  var q = MailApp.getRemainingDailyQuota();
  if (q >= 300) { healthResolve("H19_MAIL"); return q; }
  healthAlert(q < 50 ? "P1" : "P2", "H19_MAIL", "Google email allowance low (" + q + " left today)", {
    what: "Only " + q + " emails are left in today's Google allowance for the script.",
    affects: "Under 25, confirmation emails to new leads pause until tomorrow (texts still go). Alert emails need the rest.",
    todo: "Look at the Waiting list for a burst of sign-ups in the last hour (spam?). If so, see the spam alert / runbook R8. Otherwise it resets tomorrow.",
    plan: "R8"
  }, { short: "email allowance low", sms: "KD P1: Google email allowance nearly used (" + q + " left today). Confirmations pause. Spam? Plan R8" });
  return q;
}

// H20 (every 5 min): spam burst of website sign-ups or texts -> pause website texts for 2 h (doPost honours WEB_SMS_PAUSED).
// If the owner switches them back on (deletes WEB_SMS_PAUSED), that decision holds for 6 hours: only a new burst twice the
// normal limit, counted from sign-ups after that moment, pauses them again.
function healthSpamCheck(ctx) {
  ctx = ctx || healthCtx();
  var p = healthProps(), now = Date.now();
  var paused = /^(1|yes|true|on)$/i.test(healthGet("WEB_SMS_PAUSED")), mine = healthGet("HEALTH_SPAM_PAUSED") === "1";
  var over = healthNum("HEALTH_SPAM_OVERRIDE", 0);
  if (mine && !paused) {                                            // the owner switched website texts back on by hand
    over = now; p.setProperty("HEALTH_SPAM_OVERRIDE", String(now));
    ["HEALTH_SPAM_PAUSED", "WEB_SMS_PAUSED_UNTIL"].forEach(function (k) { p.deleteProperty(k); });
    mine = false;
    healthResolve("H20_SPAM", "Website texts were switched back on by hand. The script won't pause them again for 6 hours unless a much bigger burst arrives.");
  }
  if (over && now - over > 6 * 36e5) { p.deleteProperty("HEALTH_SPAM_OVERRIDE"); over = 0; }
  var W = healthWl(ctx), c = 0, past = 0;
  for (var i = 1; i < W.data.length; i++) {
    var t = healthV(W, W.data[i], "Signup Time");
    if (!(t instanceof Date) || !/^W-/i.test(healthId(healthV(W, W.data[i], "Lead ID")))) continue;
    var age = now - t.getTime();
    if (age <= 36e5) { if (t.getTime() > over) c++; }
    else for (var k = 1; k <= 7; k++) if (age > k * 864e5 - 36e5 && age <= k * 864e5) past++;   // the same hour on each of the last 7 days
  }
  var x = over ? 2 : 1, avg = past / 7, limit = x * Math.max(15, 3 * avg);
  var texts = healthSmsLog(ctx).filter(function (m) { return now - m.t <= 36e5 && m.t > over; }).length;
  if (c > limit || texts > 40 * x) {
    p.setProperties({ WEB_SMS_PAUSED: "1", WEB_SMS_PAUSED_UNTIL: healthFmt(new Date(now + 2 * 36e5), "yyyy-MM-dd HH:mm"), HEALTH_SPAM_PAUSED: "1" });
    p.deleteProperty("HEALTH_SPAM_OVERRIDE");
    var head = c > limit ? c + " website sign-ups in the last hour (normal " + Math.round(avg) + ")" : texts + " texts in the last hour";
    healthAlert("P1", "H20_SPAM", head + ": website texts paused for 2h", {
      what: head + ". The script has paused texts to website sign-ups for 2 hours (WEB_SMS_PAUSED). Rows are still saved; their Notes say \"paused - check\".",
      affects: "Real website sign-ups in the next 2 hours get no thank-you text. Spam can't run up the ClickSend bill or email allowance.",
      todo: "Look at the newest Waiting list rows: junk names/numbers = spam (delete them; ask the website chat to tighten the form). If they're real (e.g. a leaflet drop), " +
        "delete Script Property WEB_SMS_PAUSED to switch texts back on: the script then leaves them on for 6 hours unless a much bigger burst arrives.",
      plan: "R8"
    }, { short: "spam - web texts paused", sms: "KD P1: " + head + ". Website texts paused for 2h automatically. Check for spam. Plan R8" });
    return;
  }
  if (paused && mine) {
    var u = healthParseTime(healthGet("WEB_SMS_PAUSED_UNTIL"));
    if (!u || u.getTime() <= now) {
      ["WEB_SMS_PAUSED", "WEB_SMS_PAUSED_UNTIL", "HEALTH_SPAM_PAUSED"].forEach(function (k) { p.deleteProperty(k); });
      healthResolve("H20_SPAM", "Website texts are switched back on.");
    }
  } else if (!paused) { if (mine) p.deleteProperty("HEALTH_SPAM_PAUSED"); healthResolve("H20_SPAM"); }
}

// ======================================================================================================
// H21: nightly backup (values only, 30 kept) with a rows-missing alarm
// ======================================================================================================
function healthBackup(ctx) {
  ctx = ctx || {};
  var ss = SpreadsheetApp.getActiveSpreadsheet(), p = healthProps(), folder, fid = healthGet("HEALTH_BACKUP_FOLDER");
  if (fid) folder = DriveApp.getFolderById(fid);
  else { folder = DriveApp.createFolder("KD backups (values only - never restore over the live sheet)"); p.setProperty("HEALTH_BACKUP_FOLDER", folder.getId()); }
  healthShareBackups(folder);
  var name = "KD backup " + healthDay(), files = [], it = folder.getFiles();
  while (it.hasNext()) { var fl = it.next(); if (String(fl.getName()).indexOf("KD backup ") === 0) files.push(fl); }
  files.sort(function (a, b) { return String(b.getName()) < String(a.getName()) ? -1 : 1; });   // newest first
  var prev = files.filter(function (x) { return x.getName() !== name; })[0];
  // live rows and Lead IDs
  var live = leadsSheet().getDataRange().getValues(), lh = live[0].map(String), lic = lh.indexOf("Lead ID"), ltc = lh.indexOf("Signup Time");
  var liveIds = {}, liveRows = 0;
  for (var i = 1; i < live.length; i++) { if (live[i].some(function (v) { return v !== ""; })) liveRows++; if (lic !== -1 && live[i][lic] !== "") liveIds[healthId(live[i][lic])] = true; }
  // the copy (values only: formulas, scripts and triggers are not copied)
  var bk = SpreadsheetApp.create(name), bkFile = DriveApp.getFileById(bk.getId());
  bkFile.moveTo(folder);
  var tabs = [LEADS_TAB, typeof TRK_LOG_TAB !== "undefined" ? TRK_LOG_TAB : "Call log", typeof TRK_SMS_TAB !== "undefined" ? TRK_SMS_TAB : "SMS log", HEALTH_LOG_TAB];
  tabs.forEach(function (t) {
    var src = ss.getSheetByName(t); if (!src) return;
    var v = t === LEADS_TAB ? live : src.getDataRange().getValues();
    var dst = bk.insertSheet(t);
    // text goes in as text: without the "'" Sheets turns "07700900123" into 7700900123 and a 16-digit Lead ID into a rounded number
    if (v.length && v[0].length) dst.getRange(1, 1, v.length, v[0].length).setValues(v.map(function (r) {
      return r.map(function (x) { return typeof x === "string" && x !== "" ? "'" + x : x; });
    }));
  });
  var first = bk.getSheets()[0]; if (bk.getSheets().length > 1 && tabs.indexOf(first.getName()) === -1) bk.deleteSheet(first);
  files.filter(function (x) { return x.getName() !== name; }).slice(29).forEach(function (x) { x.setTrashed(true); });   // keep 30
  // compare with last night's copy
  var missing = 0, prevRows = 0, baseAt = Number(healthGet("HEALTH_BASELINE_AT", 0)), prevAt = 0;
  if (prev && !ctx.sheetBad) {                                     // row 1 wrong (H4): the copy is kept, the comparison waits
    prevAt = prev.getDateCreated ? new Date(prev.getDateCreated()).getTime() : 0;
    var pv = SpreadsheetApp.openById(prev.getId()).getSheetByName(LEADS_TAB);
    if (pv) {
      var pd = pv.getDataRange().getValues(), pic = pd[0].map(String).indexOf("Lead ID");
      for (var k = 1; k < pd.length; k++) {
        if (pd[k].some(function (v) { return v !== ""; })) prevRows++;
        if (lic !== -1 && pic !== -1 && pd[k][pic] !== "" && !liveIds[healthId(pd[k][pic])]) missing++;
      }
    }
  }
  p.setProperty("HEALTH_BACKUP_LAST", String(Date.now()));
  healthPing("HEALTH_PING_BACKUP");
  var deliberate = baseAt && baseAt > prevAt;                         // healthSetBaseline() after deleting test rows on purpose
  if (deliberate) p.deleteProperty("HEALTH_BASELINE_AT");
  if (prev && !ctx.sheetBad && !deliberate && (missing > 0 || liveRows < prevRows)) {
    var n = Math.max(missing, prevRows - liveRows);
    healthAlert("P1", "H21_ROWS", healthPlural(n, "Waiting list row") + " vanished since last night's backup", {
      what: "Last night's backup (" + prev.getName() + ") had " + prevRows + " rows; the live Waiting list has " + liveRows + ". " + missing + " Lead IDs from the backup are no longer in the sheet.",
      affects: "People may have been deleted by mistake (a sort, a cut-and-paste, a bad filter), and won't be called.",
      todo: "Don't restore over the live sheet. Open the backup (Drive > KD backups), find the missing rows by Lead ID and copy them back to the bottom of the Waiting list. If rows were deleted on purpose, run healthSetBaseline() so tonight's check knows.",
      plan: "register row 24"
    }, { event: true, every: 0, short: n + " rows vanished", sms: "KD P1: " + healthPlural(n, "Waiting list row") + " vanished since last night's backup. Don't restore over the live sheet. Register row 24" });
  }
  return { name: name, rows: liveRows, prevRows: prevRows, missing: missing };
}

// The backup folder is shared (view) with the owner's personal Google account: the first HEALTH_EMAIL address outside
// the clinic's domain, so the backups can still be opened if info@ is locked out. Once; a refusal is listed in the daily email.
function healthShareBackups(folder) {
  var who = healthList(healthGet("HEALTH_EMAIL")).filter(function (e) { return healthEmailOk(e) && !/@kirkcaldydental\.co\.uk$/i.test(e); })[0];
  if (!who || healthGet("HEALTH_BACKUP_SHARED").toLowerCase() === who.toLowerCase()) return;
  try { folder.addViewer(who); healthProps().setProperty("HEALTH_BACKUP_SHARED", who.toLowerCase()); }
  catch (e) { console.warn("Couldn't share the backup folder with " + who + ": " + e); }
}

// ======================================================================================================
// H22: 21:00 content scan (do-not-contact breaches, health/money words in Notes, odd values)
// ======================================================================================================
function healthContentScan(ctx) {
  ctx = ctx || healthCtx();
  var W = healthWl(ctx), stopRows = [], outcomeRows = [], healthRows = [], moneyRows = [], oddRows = [], urgent = 0, dnc = {};
  var today = healthDay();
  for (var i = 1; i < W.data.length; i++) {
    var r = W.data[i], st = String(healthV(W, r, "Status")).trim(), notes = String(healthV(W, r, "Notes")), oc = String(healthV(W, r, "Call outcome")).trim();
    if (!r.some(function (v) { return v !== ""; })) continue;
    var isDnc = st.toUpperCase() === "DO NOT CONTACT";
    if (/\b(stop|remove|unsubscribe|opt[- ]?out|don'?t (call|contact|text)|do not (call|contact|text))\b/i.test(notes) && !isDnc) stopRows.push(i + 1);
    if ((oc.toUpperCase() === "DO NOT CONTACT" && !isDnc) || (oc === "Withdrew" && st !== "Withdrew")) outcomeRows.push(i + 1);
    if (/pain|abscess|swell|bleed|antibiotic|pregnan/i.test(notes)) healthRows.push(i + 1);
    if (/deposit|\u00A3|implant|whiten|private/i.test(notes)) moneyRows.push(i + 1);
    if (HEALTH_STATUSES.indexOf(st) === -1) oddRows.push(i + 1);
    if (/urgent\s*[\u2013\-]\s*signposted/i.test(notes)) urgent++;
    var sc = healthV(W, r, "Status changed at"), d = healthDigits(healthV(W, r, "Phone"));
    if (isDnc && d.length === 10 && sc instanceof Date) dnc[d] = Math.min(dnc[d] || Infinity, sc.getTime());
  }
  // texts sent to a DNC number after it was marked DNC (ClickSend history, last 26 h)
  var breaches = [], hist = Object.keys(dnc).length ? healthClickSendHistory(ctx, 26) : { ok: false, msgs: [] };
  if (hist.ok) hist.msgs.forEach(function (m) { var d = healthDigits(m.to), t = healthCsTime(m); if (dnc[d] && t > dnc[d] + 6e4) breaches.push(t); });
  if (breaches.length) {
    var at = healthHM(Math.max.apply(null, breaches));
    healthAlert("P1", "H22_DNC_TEXT", "A text went to a DO NOT CONTACT number at " + at, {
      what: healthPlural(breaches.length, "text") + " went to a number marked DO NOT CONTACT, after it was marked (latest " + at + ").",
      affects: "Contacting someone who said stop breaks the rules (PECR/GDPR) and their trust.",
      todo: "Check ClickSend > Messages for what was sent. Log it in the Complaints tab, apologise if appropriate, and forward this email to the ads chat so the cause is fixed.",
      plan: "R9"
    }, { event: true, every: 0, short: "text to DNC number", sms: "KD P1: a text went to a DO NOT CONTACT number at " + at + ". Check ClickSend, then log and apologise. Plan R9" });
  }
  if (stopRows.length || outcomeRows.length) {
    var rows = stopRows.concat(outcomeRows).filter(function (x, k, a) { return a.indexOf(x) === k; }).sort(function (a, b) { return a - b; });
    healthAlert("P1", "H22_STOP", "Row" + (rows.length > 1 ? "s " : " ") + rows.slice(0, 8).join(", ") + " say stop but aren't DO NOT CONTACT", {
      what: (stopRows.length ? "Notes on row" + (stopRows.length > 1 ? "s " : " ") + stopRows.join(", ") + " say stop/remove/unsubscribe/don't call, but Status isn't DO NOT CONTACT.\n" : "") +
        (outcomeRows.length ? "Call outcome on row" + (outcomeRows.length > 1 ? "s " : " ") + outcomeRows.join(", ") + " is DO NOT CONTACT or Withdrew, but Status doesn't match." : ""),
      affects: "These people could be called or texted again after asking not to be.",
      todo: "Today: set Call outcome (or Status) to DO NOT CONTACT on those rows, or correct the note if it means something else.",
      plan: "R9"
    }, { sig: rows.join(","), short: "stop not marked DNC", sms: "KD P1: row" + (rows.length > 1 ? "s " : " ") + rows.slice(0, 5).join(", ") + " say" + (rows.length > 1 ? "" : "s") + " stop/remove but not DO NOT CONTACT. Set DNC today. Plan R9" });
  } else healthResolve("H22_STOP");
  var early = [];
  var log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(typeof TRK_LOG_TAB !== "undefined" ? TRK_LOG_TAB : "Call log");
  if (log && log.getLastRow() > 1) log.getRange(2, 1, log.getLastRow() - 1, 3).getValues().forEach(function (v) {
    if (v[0] instanceof Date && healthDay(v[0]) === today) { var h = healthHour(v[0]); if (h < 8 || h >= 21) early.push(v[2]); }
  });
  var p2 = [];
  if (healthRows.length) p2.push("Notes mention health details on rows " + healthRows.join(", ") + " - remove them (Notes say only \"Urgent - signposted\").");
  if (moneyRows.length) p2.push("Notes mention money or private treatment on rows " + moneyRows.join(", ") + " - check nothing was offered or taken.");
  if (oddRows.length) p2.push("Status values outside the dropdown list on rows " + oddRows.slice(0, 30).join(", ") + ".");
  if (early.length) p2.push(healthPlural(early.length, "call") + " logged before 08:00 or after 21:00 today (sheet rows " + early.join(", ") + ").");
  var lastUrgent = Number(healthGet("HEALTH_URGENT_N", 0));
  if (urgent > lastUrgent) p2.push(healthPlural(urgent - lastUrgent, "new \"Urgent - signposted\" row") + " (" + urgent + " in total): a dentist should review each one today.");
  healthProps().setProperty("HEALTH_URGENT_N", String(urgent));
  if (p2.length) healthAlert("P2", "H22_CONTENT", "Evening scan: " + healthPlural(p2.length, "thing") + " to check in the Waiting list", {
    what: "- " + p2.join("\n- "),
    affects: "Health or money details in the sheet, calls at the wrong time, or values the scripts don't understand.",
    todo: "Fix the rows listed (row numbers only - open the sheet to see them). Follow the call card.",
    plan: "R9"
  }, { event: true, every: 0 });
  return { stop: stopRows, outcome: outcomeRows, health: healthRows, money: moneyRows, odd: oddRows, early: early, breaches: breaches.length };
}

// ======================================================================================================
// H23 (1st of the month), H24 (daily): access review, test alert, owner gates
// ======================================================================================================
function healthMonthly(ctx) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), list = function (fn) { try { return fn().map(function (u) { return u.getEmail(); }).join(", ") || "none"; } catch (e) { return "(couldn't read)"; } };
  healthAlert("P1", "H23_TEST", "Monthly alert test + who has access (please confirm)", {
    what: "This is the monthly test of the alert system. Please check the list below is right.\n\n" +
      "Sheet editors: " + list(function () { return ss.getEditors(); }) + "\nSheet viewers: " + list(function () { return ss.getViewers(); }) +
      "\nCaller alerts (ONCALL_MOBILE): " + (healthList(healthGet("ONCALL_MOBILE")).map(healthMask).join(", ") || "none") +
      "\nAlert emails (HEALTH_EMAIL): " + (healthGet("HEALTH_EMAIL") || "none") + "\nAlert texts (HEALTH_SMS): " + (healthList(healthGet("HEALTH_SMS")).map(healthMask).join(", ") || "none") +
      "\nOwner copies: OWNER_EMAIL " + (healthGet("OWNER_EMAIL") || "none") + ", OWNER_MOBILE " + (healthList(healthGet("OWNER_MOBILE")).map(healthMask).join(", ") || "none"),
    affects: "Nothing - it's a test.",
    todo: "1) Check you also got the test text. 2) Remove anyone who has left (Share, and ONCALL_MOBILE). 3) Write \"monthly test OK\" in the Change log tab."
  }, { event: true, every: 0, ignoreQuiet: true, smsAlways: true, sms: "KD TEST: monthly alert test. If you got this text and the email, alerts work. Nothing to do." });
}
function healthGates(ctx) {
  var now = new Date(), md = healthFmt(now, "MM-dd"), act = healthJson("ADS_ACTIVE_CAMPAIGNS", null);
  var live = !!(act && act.n >= 1 && Date.now() - act.t < 26 * 36e5);
  var missing = ["NHS_FIFE_LETTER_ID", "CALL_CARD_APPROVED"].filter(function (k) { return !healthGet(k); });
  if (live && missing.length) healthAlert("P1", "H24_GATES", "Facebook ads are live but " + missing.join(" and ") + (missing.length > 1 ? " are" : " is") + " not recorded", {
    what: "A Facebook campaign is running, but Script Propert" + (missing.length > 1 ? "ies " : "y ") + missing.join(", ") + (missing.length > 1 ? " are" : " is") + " empty.",
    affects: missing.indexOf("NHS_FIFE_LETTER_ID") !== -1 ? "The ads say this is a new NHS practice; without NHS Fife's letter on file that claim isn't backed up." : "Callers are ringing people without an approved call card (wording, urgent route).",
    todo: "Record it (the Drive file ID of the letter / the date you approved the call card) in Script Properties, or pause the ads in Ads Manager until it's done."
  }, { sig: missing.join(","), short: "ads live without " + missing[0], sms: "KD P1: Facebook ads are live but " + (missing[0] === "NHS_FIFE_LETTER_ID" ? "the NHS Fife letter is not recorded (NHS_FIFE_LETTER_ID)" : "the call card is not approved (CALL_CARD_APPROVED)") + ". Record it or pause the ads." });
  else healthResolve("H24_GATES");
  var week = 6.5 * 864e5, day = 20 * 36e5;
  var remind = function (key, on, subject, what, todo, every) {
    if (on) healthAlert("P2", key, subject, { what: what, affects: "A launch decision is still open.", todo: todo }, { every: every });
    else healthResolve(key);
  };
  remind("H24_PRIORITY", !healthGet("PRIORITY_RULE_SIGNED"), "Reminder: the priority rule isn't signed (PRIORITY_RULE_SIGNED)",
    "Nothing records that you've signed the rule for who gets places first.", "Sign it (or have \"Be first in line\" removed everywhere), then set PRIORITY_RULE_SIGNED to the date.", week);
  remind("H24_FESTIVE", (md >= "11-24" || md <= "01-04") && !healthGet("FESTIVE_COVER"), "Christmas cover not set (FESTIVE_COVER)",
    "From 24 Nov a named caller is needed for each festive day, or the ads drop to \u00A35-10/day or pause from 23 Dec to 4 Jan. FESTIVE_COVER is empty.",
    "Decide by 1 December, then write the plan in FESTIVE_COVER (e.g. \"Anna 27-30 Dec; pause 24-26 Dec\").", day);
  var lu = healthParseTime(healthGet("LAST_LIST_UPDATE")), luDays = lu ? (now - lu) / 864e5 : null;
  remind("H24_LISTUPDATE", luDays !== null && luDays > 21, luDays > 28 ? "The waiting list hasn't had an update for " + Math.floor(luDays) + " days" : "A waiting-list update is due in " + Math.ceil(28 - luDays) + " days",
    "The last service update to the list (LAST_LIST_UPDATE) was " + Math.floor(luDays || 0) + " days ago; the plan is every 3-4 weeks.", "Send the next update (playbook templates), then set LAST_LIST_UPDATE to the date.", day);
  var ot = healthParseTime(healthGet("OPENING_TARGET")), toOpen = ot ? (ot - now) / 864e5 : null, budget = healthNum("ADS_DAILY_BUDGET", 0);
  remind("H24_BUDGET", toOpen !== null && toOpen > 42 && budget > 20, "Ad budget \u00A3" + budget + "/day with " + Math.round(toOpen || 0) + " days to opening",
    "The plan keeps the budget at \u00A315-20/day while opening is more than 6 weeks away (OPENING_TARGET " + healthGet("OPENING_TARGET") + ").", "Lower the campaign budget in Ads Manager, or update OPENING_TARGET if the date changed.", week);
}

// ======================================================================================================
// Manual helpers (run from the editor)
// ======================================================================================================
// Fire drill step 1: the owner gets an email, a text, and healthchecks.io "down" (it recovers at the next 5-minute ping).
function healthTestAlert() {
  var r = healthAlert("P1", "TEST", "TEST: fire drill alert (" + healthFmt(new Date(), "dd/MM HH:mm") + ")", {
    what: "This is a test alert started by hand (healthTestAlert).",
    affects: "Nothing.",
    todo: "Check you got: this email at your personal address, a text on your phone, and a healthchecks.io 'down' then 'up' message within 10 minutes. Log the result in the Change log tab."
  }, { event: true, every: 0, ignoreQuiet: true, smsAlways: true, short: "test",
    sms: "KD TEST: fire drill. If you got this text and the email, alerts work. Nothing to do." });
  var pinged = healthPing("HEALTH_PING_POLLER", "/fail");
  console.log("Test alert: email " + (r.emailed ? "sent" : "NOT sent") + ", text " + (r.texted ? "sent" : "NOT sent") + ", healthchecks " + (pinged ? "told 'fail'" : "not set up / failed"));
  return { emailed: r.emailed, texted: r.texted, pinged: pinged };
}
// Runbook R4 step 5: re-send failed thank-you texts (last 7 days). Calling hours only. Only people nobody has reached yet
// (Status blank or "Call 8am"): anyone already Called, Booked, No answer, DNC, Duplicate... is skipped and counted.
function healthResendFailedTexts() {
  if (!inCallHours(new Date())) throw new Error("Only in calling hours (CALL_HOURS) - run it again after 8am.");
  var sh = leadsSheet(), data = sh.getDataRange().getValues(), h = data[0].map(String), C = {};
  h.forEach(function (n, i) { if (C[n] === undefined) C[n] = i; });
  if (C["SMS status"] === undefined || C["Phone"] === undefined) throw new Error("The Waiting list has no SMS status / Phone column.");
  var done = 0, skipped = 0, cutoff = Date.now() - 7 * 864e5;
  for (var i = 1; i < data.length && done < 50; i++) {
    var r = data[i], st = String(r[C["Status"]] || "").trim().toUpperCase(), t = r[C["Signup Time"]];
    if (!/^Failed/i.test(String(r[C["SMS status"]]))) continue;
    if (st !== "" && st !== "CALL 8AM") { skipped++; continue; }    // already rung, booked, DNC, duplicate...: "we'll call you" would be wrong
    if (!(t instanceof Date) || t.getTime() < cutoff) continue;
    if (typeof metaDoNotContact === "function" && metaDoNotContact(r[C["Phone"]], r[C["Email"]])) { skipped++; continue; }
    var res = sendSms(r[C["Phone"]], leadText(niceFirstName(r[C["Name"]]), true));
    if (!res || typeof res !== "object") { skipped++; continue; }
    if (C["Lead ID"] !== undefined && String(sh.getRange(i + 1, C["Lead ID"] + 1).getValue()) !== String(r[C["Lead ID"]])) continue;   // row moved: don't write
    if (C["SMS ID"] !== undefined) sh.getRange(i + 1, C["SMS ID"] + 1).setValue("'" + String(res.id || ""));
    sh.getRange(i + 1, C["SMS status"] + 1).setValue(res.status === "SUCCESS" ? "Sent (resent)" : "Failed: " + res.status);
    if (res.status === "SUCCESS") done++;
  }
  console.log("Re-sent " + done + " texts, skipped " + skipped + ".");
  return { resent: done, skipped: skipped };
}
