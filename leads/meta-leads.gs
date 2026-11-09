/**
 * Kirkcaldy Dental – our own Facebook/Instagram lead handler (no Zapier / Make needed).
 *
 * Every minute it checks Meta for new Instant Form leads, then for each one:
 *   1. adds a row to the Waiting List sheet (Source = "facebook")
 *   2. texts the lead straight away ("thanks, we'll be in touch")
 *   3. 8am–9pm: texts the caller(s) "NEW LEAD – call now".
 *      9pm–8am: no calls – the lead is texted "our team will call you from 8am", the row is marked "Call 8am",
 *      and the team gets an 8am summary. (Script Property CALL_HOURS, default "8-21"; "24h" = round the clock.)
 *   4. emails the lead a confirmation
 *
 * INSTALL – in the SAME Apps Script project as apps-script.gs (Waiting List sheet → Extensions → Apps Script):
 *   + Add file "meta-leads" → paste this file → Save.
 *   Project Settings → Script Properties, add:
 *     META_PAGE_TOKEN = a long-lived Page access token with leads_retrieval (see leads/README.md)
 *     META_FORM_IDS   = the Instant Form ID(s), comma-separated
 *     CLICKSEND_USER / CLICKSEND_KEY (already used by apps-script.gs)
 *     ONCALL_MOBILE   = one or more mobiles, comma-separated – all get the team alerts
 *     CALL_HOURS      = "8-21" (default, no calls after 9pm) or "24h"
 *   Then run installLeadTriggers() once and allow the permissions.
 * Uses sendSms() and ukMobile() from apps-script.gs.
 * With leads/health.gs in the project: the header row is checked before every run, Meta errors are kept in META_LAST_ERR,
 * failed leads are retried twice and then go to the "Failed leads" tab with a critical alert, and every run reports to
 * healthMark() (the outside heartbeat only pings after a clean run). Optional Script Property META_LEAD_FIELDS.
 */

// Meta Graph API version. Script Property META_API_VERSION overrides it (e.g. "v28.0" when Meta retires v27).
// A Meta app created after 4 Nov 2026 can only call v27.0 or newer.
function metaGraph() {
  var v = String(PropertiesService.getScriptProperties().getProperty("META_API_VERSION") || "v27.0").trim();
  return "https://graph.facebook.com/" + v + "/";
}
var LEADS_TAB = "Waiting list";               // NEVER the first tab – that is the Dashboard

function leadsSheet() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEADS_TAB);
  if (!sh) throw new Error("Tab \"" + LEADS_TAB + "\" not found");
  return sh;
}

// Team alerts.
//   ONCALL_MOBILE = the callers' mobiles, comma-separated.
//   ALERT_MODE    = "all" (default: every caller gets every lead) or
//                   "rotate" (each lead goes to the NEXT caller in turn – no two people ring the same lead).
//   OWNER_MOBILE  = optional mobile(s) that get a TEXT copy of every alert whatever the mode.
//   OWNER_EMAIL   = optional email(s) that get an EMAIL copy of every alert instead (free; e.g. info@kirkcaldydental.co.uk).
// Returns the caller(s) the lead was sent to (written into the sheet's "Assigned to" column if it exists).
function alertTeam(msg, rotate) {
  var props = PropertiesService.getScriptProperties();
  var split = function (v) { return String(v || "").split(",").map(function (n) { return n.trim(); }).filter(String); };
  var callers = split(props.getProperty("ONCALL_MOBILE")), owners = split(props.getProperty("OWNER_MOBILE"));
  var mode = String(props.getProperty("ALERT_MODE") || "all").toLowerCase();
  var to = callers;
  if (rotate !== false && mode === "rotate" && callers.length) {
    var i = Number(props.getProperty("ALERT_NEXT") || 0) % callers.length;
    to = [callers[i]];
    props.setProperty("ALERT_NEXT", String(i + 1));
  }
  to.concat(owners.filter(function (o) { return to.indexOf(o) === -1; })).forEach(function (n) { sendSms(n, msg); });
  split(props.getProperty("OWNER_EMAIL")).forEach(function (e) {
    try { MailApp.sendEmail(e, msg.slice(0, 120), msg + "\n\nWaiting List sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()); }
    catch (err) { console.error("Owner email failed: " + err); }
  });
  return to.join(", ");
}

// Lead thank-you text: kept within ONE text message (160 plain characters, no emoji/curly quotes)
// so each costs a single SMS. Long first names fall back to a slightly shorter version.
function niceFirstName(name) {
  var f = String(name || "").trim().split(/\s+/)[0] || "";
  f = f.normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // "Zoë" -> "Zoe" (accents would make it a pricier Unicode SMS)
       .replace(/[\u2018\u2019]/g, "'").replace(/[^A-Za-z\-']/g, "");
  if (!f) return "there";
  if (f === f.toLowerCase() || f === f.toUpperCase() || /^[a-z]/.test(f))   // "sarah"/"SARAH"/"sARAH" -> "Sarah"; "McKenzie" kept
    f = f.toLowerCase().replace(/(^|[-'])([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); });
  return f;
}
function leadText(first, inHours) {
  // No time promise ("very soon") – if the list gets busy, calls can take longer. Out of hours it says when calling starts.
  var f = callWindow().from, start = f === 0 || f === 12 ? (f ? "12pm" : "8am") : f < 12 ? f + "am" : (f - 12) + "pm";
  var when = inHours ? "" : " from " + start;
  var options = [
    "Hi " + first + ", thank you for joining the Kirkcaldy Dental waiting list! A friendly member of our team will call you" + when + " to confirm your details. We can't wait to welcome you!",
    "Hi " + first + ", thank you for joining the Kirkcaldy Dental waiting list! Our team will call you" + when + " to confirm your details. We can't wait to welcome you!",
    "Hi " + first + ", thanks for joining the Kirkcaldy Dental waiting list! We'll call you" + when + " to confirm your details."
  ];
  for (var i = 0; i < options.length; i++) if (options[i].length <= 160) return options[i];
  return options[options.length - 1].slice(0, 160);
}

// One scan of the sheet for a new Facebook lead:
//   blocked = an earlier row with the same phone/email has Status "DO NOT CONTACT" -> never texted or called
//   repeat  = the same phone/email is already on the list -> no new call alert (Status "Duplicate")
//   recent  = that earlier sign-up was in the last 24 hours -> no text either
//   handled = an earlier row is already Called / Booked / Not interested -> no new call alert
//   firstId = Lead ID (or "row N") of the earliest matching row, for the "Duplicate of" column
function metaLookup(phone, email) {
  var digits = function (v) { var d = String(v || "").replace(/\D/g, ""); return d.length >= 10 ? d.slice(-10) : d; };
  var target = digits(phone), mail = String(email || "").trim().toLowerCase();
  var out = { blocked: false, repeat: false, recent: false, handled: false, firstId: "" };
  if (!target && !mail) return out;
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String);
  var pc = h.indexOf("Phone"), sc = h.indexOf("Status"), ec = h.indexOf("Email"), tc = h.indexOf("Signup Time"), ic = h.indexOf("Lead ID");
  for (var i = 1; i < data.length; i++) {
    var same = (target.length >= 10 && pc !== -1 && digits(data[i][pc]) === target) ||
               (mail && ec !== -1 && String(data[i][ec]).trim().toLowerCase() === mail);
    if (!same) continue;
    if (!out.repeat) out.firstId = (ic !== -1 && String(data[i][ic])) || "row " + (i + 1);
    out.repeat = true;
    var st = sc === -1 ? "" : String(data[i][sc]).trim().toUpperCase();
    if (st === "DO NOT CONTACT") out.blocked = true;
    if (st === "CALLED" || st === "BOOKED" || st === "NOT INTERESTED") out.handled = true;
    var t = tc === -1 ? null : data[i][tc];
    if (t instanceof Date && Date.now() - t.getTime() < 864e5) out.recent = true;
  }
  return out;
}
function metaRepeatText(first) {
  return "Hi " + first + ", good news - you're already on the Kirkcaldy Dental waiting list, so there's nothing more to do. We'll be in touch.";
}

// Anyone whose row has Status "DO NOT CONTACT" (same exact text in apps-script.gs) is never texted again.
function metaDoNotContact(phone, email) {
  var digits = function (v) { var d = String(v || "").replace(/\D/g, ""); return d.length >= 10 ? d.slice(-10) : d; };
  var target = digits(phone), mail = String(email || "").trim().toLowerCase();
  if (!target && !mail) return false;
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String);
  var pc = h.indexOf("Phone"), sc = h.indexOf("Status"), ec = h.indexOf("Email");
  if (sc === -1) return false;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][sc]).trim().toUpperCase() !== "DO NOT CONTACT") continue;
    if (target && pc !== -1 && digits(data[i][pc]) === target) return true;
    if (mail && ec !== -1 && String(data[i][ec]).trim().toLowerCase() === mail) return true;
  }
  return false;
}

function installLeadTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (["pollMetaLeads", "morningSummary", "backlogCheck", "eveningReport"].indexOf(t.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("pollMetaLeads").timeBased().everyMinutes(1).create();
  ScriptApp.newTrigger("morningSummary").timeBased().atHour(callWindow().from === 0 ? 8 : callWindow().from).nearMinute(0).everyDays(1)
    .inTimezone("Europe/London").create();
  ScriptApp.newTrigger("backlogCheck").timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger("eveningReport").timeBased().atHour(21).nearMinute(0).everyDays(1).inTimezone("Europe/London").create();
  pollMetaLeads();
}

function pollMetaLeads() {
  var props = PropertiesService.getScriptProperties(), t0 = Date.now(), clean = true, why = "";
  // health.gs heartbeat: H1 pings healthchecks.io only after a CLEAN run (every form answered, no lead failed, header row OK)
  var mark = function () { if (typeof healthMark === "function") healthMark("pollMetaLeads", clean, Date.now() - t0, why); };
  var scrub = metaScrub;                       // error texts can contain the request URL: never store or email the token
  var token = props.getProperty("META_PAGE_TOKEN"), forms = props.getProperty("META_FORM_IDS");
  if (!token || !forms) {           // was a silent return: a blank setting would stop every Facebook lead unnoticed
    clean = false; why = "config: META_PAGE_TOKEN or META_FORM_IDS is blank";
    if (typeof healthConfigCheck === "function") { try { healthConfigCheck(); } catch (e) { console.error("Config alert failed: " + e); } }
    else healthNotifyOnce("META_CONFIG_LAST", "Facebook leads are NOT being read: META_PAGE_TOKEN or META_FORM_IDS is blank",
      "Script Property META_PAGE_TOKEN or META_FORM_IDS is empty, so the lead script reads nothing. New Facebook/Instagram leads are not added or texted.\n\n" +
      "Fix: Apps Script > Project Settings > Script Properties (runbook Step 5).");
    mark();
    return;
  }
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;            // previous run still going
  try {
    // Header row check BEFORE any lead is read: if a column was renamed/deleted, stop so nothing is misfiled or marked seen
    try { if (typeof healthAssertSheet === "function") healthAssertSheet(); }
    catch (err) { clean = false; why = "sheet: " + scrub(err && err.message || err).slice(0, 150); console.error(why); return; }
    var dflt = Number(props.getProperty("META_SINCE") || Math.floor(Date.now() / 1000) - 3600);
    var sinceBy = JSON.parse(props.getProperty("META_SINCE_BY_FORM") || "{}");   // progress per form
    var seen = JSON.parse(props.getProperty("META_SEEN") || "[]");
    var retry = JSON.parse(props.getProperty("META_RETRY") || "{}");             // leads that failed: retried on the next 2 runs
    var fields = metaLeadFields(), leads = [], failedForms = [], newStart = false;
    forms.split(",").map(function (s) { return s.trim(); }).filter(String).forEach(function (formId) {
      var since = sinceBy[formId], found = 0, got = [], ok = true;
      if (!since) { found = metaFormStart(formId, token); since = found || dflt; }   // a NEW form starts from its created_time
      // 15-minute overlap catches leads Meta makes available late; META_SEEN stops repeats
      var url = metaGraph() + formId + "/leads?limit=100&fields=" + fields + "&filtering=" +
        encodeURIComponent(JSON.stringify([{ field: "time_created", operator: "GREATER_THAN", value: since - 900 }])) +
        "&access_token=" + encodeURIComponent(token);
      while (url) {
        var res;
        try { res = UrlFetchApp.fetch(url, { muteHttpExceptions: true }); }
        catch (e) { throw new Error(scrub(e && e.message || e)); }             // network errors quote the URL (with the token)
        if (res.getResponseCode() !== 200) { ok = false; metaApiError(formId, res); break; }
        var body = JSON.parse(res.getContentText());
        (body.data || []).forEach(function (l) { if (seen.indexOf(l.id) === -1 && !retry[l.id]) { l._form = formId; got.push(l); } });
        url = body.paging && body.paging.next;
      }
      if (ok) {                                  // a form with a failed page is skipped this run; its progress doesn't move
        leads = leads.concat(got);
        if (!sinceBy[formId]) { sinceBy[formId] = since; if (found) newStart = true; }
      } else failedForms.push(formId);
    });
    // a new form's start is saved at once, even before its first lead (otherwise Meta is asked for it every minute)
    if (newStart) props.setProperty("META_SINCE_BY_FORM", JSON.stringify(sinceBy));
    if (failedForms.length) { clean = false; why = "meta: Meta API error on form " + failedForms.join(", "); }
    else props.deleteProperty("META_LAST_ERR");                                 // every form answered: H2 sees the error has cleared
    // Leads the hourly check (H8) already put in "Failed leads" were given to the owner to add by hand and call: never twice.
    if (leads.length && typeof healthFailedIds === "function") {
      var reported = {};
      try { healthFailedIds().forEach(function (id) { reported[id] = true; }); } catch (e) { console.error("Failed leads tab: " + e); }
      leads = leads.filter(function (l) {
        if (!reported[String(l.id)]) return true;
        console.warn("Lead " + l.id + " is already in the Failed leads tab (added by hand): skipped");
        seen.push(l.id);
        return false;
      });
      props.setProperty("META_SEEN", JSON.stringify(seen.slice(-300)));
    }
    leads.sort(function (a, b) { return new Date(a.created_time) - new Date(b.created_time); });
    // Retries first (texts already sent are never sent again), then new leads oldest first.
    // Progress is saved after EACH lead; stop after 4 minutes (Apps Script kills runs at 6).
    var queue = Object.keys(retry).map(function (id) { return { lead: retry[id].lead, again: retry[id] }; })
      .concat(leads.map(function (l) { return { lead: l }; }));
    var failedNow = 0;
    for (var k = 0; k < queue.length && Date.now() - t0 < 4 * 60 * 1000; k++) {
      var q = queue[k], l = q.lead;
      try {
        if (q.again && q.again.values) metaWriteRow(metaUnpack(q.again.values));   // texted before: only the row is retried
        else handleLead(l);
        delete retry[l.id];
      } catch (err) {
        clean = false; why = "lead: " + scrub(err).slice(0, 150);
        console.error("Lead " + l.id + " failed: " + scrub(err));
        var ent = retry[l.id] || { n: 0, lead: metaSlim(l) };
        ent.n++; ent.err = scrub(err).slice(0, 200);
        if (err && err.metaValues) ent.values = metaPack(err.metaValues);   // texted/alerted already: the retry only writes the row
        if (err && err.metaContacted) ent.contacted = true;
        retry[l.id] = ent;
        if (ent.n >= 3 || JSON.stringify(retry).length > 8000) {   // first try + 2 retries (or no room left to keep it)
          delete retry[l.id];
          metaLeadFailed(l, ent);
          failedNow++;
        }
      } finally {
        if (!q.again) {
          seen.push(l.id);
          var c = Math.floor(new Date(l.created_time).getTime() / 1000) || 0;
          sinceBy[l._form] = Math.max(sinceBy[l._form] || dflt, c);
        }
        props.setProperties({ META_SEEN: JSON.stringify(seen.slice(-300)), META_SINCE_BY_FORM: JSON.stringify(sinceBy), META_RETRY: JSON.stringify(retry) });
      }
    }
    if (failedNow && typeof healthAlertFailedRows === "function") healthAlertFailedRows();   // one P1 per run, never throttled
  } catch (err) {
    clean = false; why = "other: " + scrub(err).slice(0, 150);
    throw err;
  } finally {
    lock.releaseLock();
    mark();
  }
}
// Error texts without secrets: Apps Script network errors quote the request URL, which carries ?access_token=.
function metaScrub(s) {
  return String(s === undefined || s === null ? "" : s).replace(/(access_token=)[^&\s"']+/gi, "$1***");
}

// Lead fields asked from Meta. Script Property META_LEAD_FIELDS replaces the list (e.g. without the ad/campaign fields if a
// token that can't see the ad account makes Meta refuse the whole call). id, created_time and field_data are always included.
function metaLeadFields() {
  var f = String(PropertiesService.getScriptProperties().getProperty("META_LEAD_FIELDS") || "").replace(/\s+/g, "");
  if (!f) return "id,created_time,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,field_data,platform,is_organic,custom_disclaimer_responses";
  ["field_data", "created_time", "id"].forEach(function (k) { if (("," + f + ",").indexOf("," + k + ",") === -1) f = k + "," + f; });
  return f;
}
// A form ID seen for the first time is read from its created_time (max 7 days back), so leads made before it was
// added to META_FORM_IDS aren't lost. A hand-set META_SINCE wins. Returns 0 if Meta didn't answer (asked again next run).
function metaFormStart(formId, token) {
  var hand = Number(PropertiesService.getScriptProperties().getProperty("META_SINCE") || 0);
  if (hand) return hand;
  try {
    var res = UrlFetchApp.fetch(metaGraph() + formId + "?fields=created_time&access_token=" + encodeURIComponent(token), { muteHttpExceptions: true });
    if (res.getResponseCode() === 200) {
      var c = Math.floor(new Date(JSON.parse(res.getContentText()).created_time).getTime() / 1000);
      if (c) return Math.max(c, Math.floor(Date.now() / 1000) - 7 * 86400);
    }
  } catch (e) { console.warn("Form " + formId + " start time: " + metaScrub(e)); }
  return 0;
}
// Any non-200 from Meta: log it, and keep META_LAST_ERR {code, http, msg, form, first, last} for health.gs (H2).
function metaApiError(formId, res) {
  var props = PropertiesService.getScriptProperties(), txt = String(res.getContentText() || ""), er = {};
  try { er = JSON.parse(txt).error || {}; } catch (e) {}
  console.error("Meta API " + res.getResponseCode() + " (form " + formId + "): " + txt);
  var code = Number(er.code) || 0, old = {};
  try { old = JSON.parse(props.getProperty("META_LAST_ERR") || "{}"); } catch (e) {}
  var now = Date.now(), first = old.first && old.code === code && old.http === res.getResponseCode() ? old.first : now;
  props.setProperty("META_LAST_ERR", JSON.stringify({ code: code, sub: er.error_subcode || 0, http: res.getResponseCode(),
    msg: String(er.message || txt).slice(0, 300), form: formId, first: first, last: now }));
  if (typeof healthMetaApiErrors !== "function")          // without health.gs: the old email (with health.gs, H2 decides P1/P2)
    healthNotifyOnce("META_ERR_LAST", "Facebook leads are NOT arriving - Meta API " + res.getResponseCode(),
      "The lead script could not read form " + formId + ". New Facebook/Instagram leads will not be texted or added to the sheet until this is fixed.\n\n" +
      "Error 190 = the token is wrong/expired (make a new one: runbook Step 5.2). Codes 4/17/32/613 = rate limit (usually clears by itself). " +
      "Error 2635 / 'version deprecated' = set Script Property META_API_VERSION to Meta's newest version (e.g. v28.0).\n\n" + txt.slice(0, 1000));
}
// Failed 3 times: "Failed leads" tab + one critical alert per run (health.gs). Without health.gs: one email per lead.
function metaLeadFailed(l, ent) {
  var why = "Failed " + ent.n + " times: " + ent.err;
  if (typeof healthFailedLead === "function") {
    try { healthFailedLead(l, why, !!ent.contacted); return; } catch (e) { console.error("Failed leads tab: " + e); }
  }
  healthNotifyOnce("LEAD_ERR_" + l.id, "A Facebook lead could not be processed",
    "Please add this person to the Waiting list by hand and call them" + (ent.contacted ? " (they were already texted)" : "") + ":\n\n" +
    JSON.stringify(l.field_data) + "\n\nError: " + why);
}
// Retry store (Script Property, 9 KB max): a slim copy of the lead, and the prepared row with dates kept as {$d: ms}.
function metaSlim(l) {
  var o = {};
  ["id", "created_time", "ad_id", "ad_name", "adset_id", "campaign_id", "form_id", "_form", "field_data", "platform", "is_organic", "custom_disclaimer_responses"]
    .forEach(function (k) { if (l[k] !== undefined) o[k] = l[k]; });
  return o;
}
function metaPack(values) {
  var o = {};
  Object.keys(values).forEach(function (k) { var v = values[k]; o[k] = v instanceof Date ? { $d: v.getTime() } : v; });
  return o;
}
function metaUnpack(o) {
  var v = {};
  Object.keys(o || {}).forEach(function (k) { var x = o[k]; v[k] = x && typeof x === "object" && x.$d !== undefined ? new Date(x.$d) : x; });
  return v;
}

// Emails a problem at most once every 3 hours per problem (key): to HEALTH_EMAIL (the owner's personal address) and OWNER_EMAIL.
// Sends FIRST and records after, so one failed send can't silence the alert for 3 hours.
// With health.gs it goes through healthAlert (P2): same 3-hour rule, same keys, and it's logged in the "Health log" tab.
// A failed website sign-up (doPost, key WEB_SIGNUP_FAIL) goes straight to H15's per-row critical alert instead.
function healthNotifyOnce(key, subject, body) {
  if (typeof healthAlert === "function") {
    if (key === "WEB_SIGNUP_FAIL" && typeof healthAlertFailedRows === "function") {
      try { if (healthAlertFailedRows() > 0) return; } catch (e) { console.error("Failed sign-up alert failed: " + e); }
    }
    var level = /^\W*P1:/.test(String(subject)) ? "P1" : "P2";                  // "P1: ..." from the leaflet = critical
    var s = String(subject || "").replace(/^\W*P[12]:\s*/, "");                  // the level goes in the [KD-P1] tag, not the text
    try { return healthAlert(level, key, s.charAt(0).toUpperCase() + s.slice(1), body, { event: true, alsoOwner: true }); }
    catch (e) { console.error("healthAlert failed, emailing directly: " + e); }
  }
  var p = PropertiesService.getScriptProperties(), last = Number(p.getProperty(key) || 0);
  if (Date.now() - last < 3 * 3600 * 1000) return;
  var to = [];
  ["HEALTH_EMAIL", "OWNER_EMAIL"].forEach(function (k) {
    String(p.getProperty(k) || "").split(",").map(function (e) { return e.trim(); }).filter(String).forEach(function (e) { if (to.indexOf(e) === -1) to.push(e); });
  });
  var sent = 0;
  to.forEach(function (e) {
    try { MailApp.sendEmail(e, subject, body + "\n\nWaiting List sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()); sent++; }
    catch (x) { console.error("Owner alert failed: " + x); }
  });
  if (sent) p.setProperty(key, String(Date.now()));
}

function field(l, keys) {
  var fd = l.field_data || [];
  for (var i = 0; i < fd.length; i++) {
    var n = String(fd[i].name).toLowerCase();
    for (var k = 0; k < keys.length; k++) if (n.indexOf(keys[k]) !== -1) return (fd[i].values || [])[0] || "";
  }
  return "";
}

// Calling hours come from Script Property CALL_HOURS:
//   "8-21" (default – owner: no calls after 9pm) or "24h" for round-the-clock calling.
function callWindow() {
  var v = String(PropertiesService.getScriptProperties().getProperty("CALL_HOURS") || "8-21").trim().toLowerCase();
  var m = v.match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
  return m ? { from: Number(m[1]), to: Number(m[2]) } : { from: 0, to: 24 };
}
function inCallHours(d) {
  var w = callWindow();
  var h = Number(Utilities.formatDate(d, "Europe/London", "H"));
  return h >= w.from && h < w.to;
}

// One Facebook/Instagram lead. Everything is SENT first (caller alert, thank-you text, email) and then ONE row is
// written with all of it, including SMS ID / SMS status / Email status. No getLastRow(): a website sign-up saved at the
// same moment (doPost can save without the lock) can never receive this lead's statuses.
// If anything fails once a text or alert has gone out (a send, the email, the row write), the error carries the row
// prepared so far (err.metaValues, err.metaContacted) and pollMetaLeads retries the ROW only: nobody is contacted twice.
function handleLead(l) {
  var st = { values: null, contacted: false };
  try {
    metaContactLead(l, st);
    metaWriteRow(st.values);
  } catch (err) {
    if (st.values && (st.contacted || st.done)) {
      if (!(err instanceof Error)) err = new Error(String(err));
      try { err.metaValues = st.values; err.metaContacted = st.contacted; } catch (x) {}
    }
    throw err;
  }
}
function metaWriteRow(values) {
  var sh = leadsSheet();
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);   // matched to the sheet's own column headers
  sh.appendRow(headers.map(function (h) { return values.hasOwnProperty(h) ? values[h] : ""; }));
}
function metaContactLead(l, st) {
  st = st || {};
  var created = new Date(l.created_time);
  var name = field(l, ["full_name", "name"]) || (field(l, ["first_name"]) + " " + field(l, ["last_name"])).trim();
  var phone = field(l, ["phone"]), email = field(l, ["email"]);
  var first = niceFirstName(name);
  var inHours = inCallHours(new Date());
  var clean = function (v) { v = String(v || "").slice(0, 200); return /^[=+\-@]/.test(v) ? "'" + v : v; };
  var seen = metaLookup(phone, email), blocked = seen.blocked, repeat = seen.repeat && !blocked;
  // Repeat sign-ups: signed up again within 24h, or already spoken to -> no new call ("Duplicate").
  // Older and never reached -> the callers get a "REPEAT" alert so they try again.
  var quiet = repeat && (seen.recent || seen.handled);
  var nice = function (v) { return clean(String(v || "").replace(/_plus$/i, "+").replace(/_/g, " ")); };   // "4_plus" -> "4+"
  var consent = (l.custom_disclaimer_responses || []).some(function (r) { return String(r.is_checked) === "1" || r.is_checked === true; }) ? "Yes" : "No";
  var values = {
    "Signup Time": created,
    "Name": clean(name),
    "Phone": "'" + String(phone).slice(0, 20),
    "Email": clean(email),
    "Postcode": clean(field(l, ["post", "zip"])),
    "No. of People": nice(field(l, ["how_many", "people"])),
    "Currently Registered?": nice(field(l, ["registered", "current"])),      // form v2 asks "Where is your current dentist?"
    "Adult/Child/Family": nice(field(l, ["who", "adult", "family"])),
    "Source": l.platform === "ig" ? "instagram" : "facebook",
    "Status": blocked ? "DO NOT CONTACT" : quiet ? "Duplicate" : (inHours ? "" : "Call 8am"),
    "Marketing consent": consent,
    "Lead ID": "'" + String(l.id || ""),
    "Logged at": new Date(),
    "Ad name": clean(l.ad_name),
    "Ad ID": "'" + String(l.ad_id || ""),
    "Form ID": "'" + String(l.form_id || l._form || ""),
    "Organic?": l.is_organic ? "Yes" : "No",
    "Duplicate of": seen.repeat ? "'" + seen.firstId : ""
  };
  if (repeat) values["Notes"] = "Already on the list (same phone/email) - see " + seen.firstId + (seen.recent ? "; no text sent" : "");
  st.values = values;                     // from here on, handleLead keeps the row if anything fails (st.contacted = someone was texted)

  // 1. alert the team (calling hours only). Plain ASCII = one SMS. "Assigned to" lists only callers whose text ClickSend accepted.
  if (inHours && !blocked && !quiet) {
    var a = metaAlertCallers((repeat ? "REPEAT - " : "") + "NEW LEAD (" + values.Source + ") - call now: " + metaAsciiName(name) + " " +
      String(phone).replace(/[^\d+ ]/g, "").slice(0, 20), st);
    if (a.assigned) values["Assigned to"] = "'" + a.assigned;
    if (a.skipped && typeof healthConfigCheck === "function") { try { healthConfigCheck(); } catch (e) { console.error("Config alert failed: " + e); } }
  }
  // 2. instant text to the lead (one SMS, 160 characters max). Repeats get one "already on the list" text a day at most.
  var r = null;
  if (!blocked && !repeat) { r = sendSms(phone, leadText(first, inHours)); st.contacted = true; }
  if (repeat && !seen.recent) { r = sendSms(phone, metaRepeatText(first)); st.contacted = true; }
  if (r && typeof r === "object") { values["SMS ID"] = "'" + String(r.id || ""); values["SMS status"] = r.status === "SUCCESS" ? "Sent" : "Failed: " + r.status; }
  // 3. confirmation email (an error here must not undo the texts above)
  if (email && !blocked && !repeat) {
    try { values["Email status"] = metaConfirmEmail(email, first); }
    catch (err) { console.error("Confirmation email failed: " + err); values["Email status"] = "Failed: " + String(err).slice(0, 80); }
  }
  st.done = true;
  return values;
}

// Same routing as alertTeam() (ONCALL_MOBILE, ALERT_MODE rotate, OWNER_MOBILE text copy, OWNER_EMAIL email copy), but it
// keeps each send's result. Returns {assigned: callers whose text was accepted, failed: [...], skipped: a number was skipped}.
function metaAlertCallers(msg, st) {
  var props = PropertiesService.getScriptProperties();
  st = st || {};
  var split = function (v) { return String(v || "").split(",").map(function (n) { return n.trim(); }).filter(String); };
  var callers = split(props.getProperty("ONCALL_MOBILE")), owners = split(props.getProperty("OWNER_MOBILE"));
  var mode = String(props.getProperty("ALERT_MODE") || "all").toLowerCase();
  var to = callers, ok = [], failed = [], skipped = !callers.length;
  if (mode === "rotate" && callers.length) {
    var i = Number(props.getProperty("ALERT_NEXT") || 0) % callers.length;
    to = [callers[i]];
    props.setProperty("ALERT_NEXT", String(i + 1));
  }
  to.forEach(function (n) {
    var r = sendSms(n, msg);
    st.contacted = true;                                   // a caller may have been texted: never alert again for this lead
    if (r && r.status === "SUCCESS") ok.push(n);
    else { failed.push(r && r.status ? r.status : "not sent"); if (!r) skipped = true; }   // nothing returned = skipped (bad number / no ClickSend keys)
  });
  owners.filter(function (o) { return to.indexOf(o) === -1; }).forEach(function (n) { sendSms(n, msg); });
  split(props.getProperty("OWNER_EMAIL")).forEach(function (e) {
    try { MailApp.sendEmail(e, msg.slice(0, 120), msg + "\n\nWaiting List sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()); }
    catch (err) { console.error("Owner email failed: " + err); }
  });
  return { assigned: ok.join(", "), failed: failed, skipped: skipped };
}
// Lead's name for the caller's text: plain letters only (no accents, digits or links), so it stays one SMS and can't carry instructions.
function metaAsciiName(name) {
  var s = String(name || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/https?:\/\/\S+|www\.\S+/gi, " ")
    .replace(/[^A-Za-z '\-.]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40);
  return s || "(no name)";
}
// Confirmation email. Returns the "Email status" value.
function metaConfirmEmail(email, first) {
  if (MailApp.getRemainingDailyQuota() < 25) {      // keep the last emails for owner alerts
    healthNotifyOnce("MAIL_QUOTA_LAST", "⚠️ Daily email limit nearly used up",
      "Google's daily email allowance is almost used, so lead confirmation emails are paused until tomorrow. Texts still go out.");
    return "Not sent: daily limit";
  }
  try {
    MailApp.sendEmail({
      to: email, name: "Kirkcaldy Dental & Implant Clinic", replyTo: "info@kirkcaldydental.co.uk",
      subject: "You're on our waiting list – Kirkcaldy Dental & Implant Clinic",
      body: "Hi " + first + ",\n\nThank you for joining the waiting list for Kirkcaldy Dental & Implant Clinic, " +
        "a new NHS dental practice opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.\n\n" +
        "A member of our team will call you to confirm your details, and we'll keep you updated with opening dates. " +
        "Joining the waiting list doesn't register you with the practice yet - we'll contact you before we open. " +
        "You only need to sign up once.\n\n" +
        "Any questions? Email info@kirkcaldydental.co.uk.\n\nKirkcaldy Dental & Implant Clinic\nkirkcaldydental.co.uk"
    });
    return "Sent";
  } catch (err) { console.error("Email failed: " + err); return "Failed: " + String(err).slice(0, 80); }
}

// 8am: tell the on-call mobile how many overnight leads are waiting (plain ASCII = one SMS)
function morningSummary() {
  var t0 = Date.now(), sh = leadsSheet();
  var data = sh.getDataRange().getValues(), col = data[0].map(String).indexOf("Status");
  if (col !== -1) {
    var n = data.slice(1).filter(function (r) { return r[col] === "Call 8am"; }).length;
    if (n) alertTeam("Good morning - " + n + " overnight lead" + (n > 1 ? "s" : "") +
      " to call. Filter the Waiting List sheet by Status = \"Call 8am\".", false);
  }
  if (typeof healthMark === "function") healthMark("morningSummary", col !== -1, Date.now() - t0, col === -1 ? "no Status column" : "");
}

// ---------- Overload guard + evening report (Facebook script only) ----------
// Every 15 min: with health.gs, H5 (leads waiting) and H6 (no calls logged) run here, inside the caller's shift.
// Without it: if leads not called after 60 min reach BACKLOG_ALERT (default 15) the owner is emailed (OWNER_EMAIL)
// at most once every 2 hours. Owner decision: the fix is to add a caller (a lower budget only if nobody can call).
function metaBacklog() {
  var sh = leadsSheet(), data = sh.getDataRange().getValues(), h = data[0].map(String);
  var tc = h.indexOf("Signup Time"), sc = h.indexOf("Status");
  if (tc === -1 || sc === -1) return { waiting: 0, oldestMins: 0 };
  var now = new Date().getTime(), waiting = 0, oldest = 0;
  var from = callWindow().from;                       // overnight "Call 8am" leads count from opening time
  var dayStart = new Date(Utilities.formatDate(new Date(), "Europe/London", "yyyy-MM-dd'T'") +
    ("0" + from).slice(-2) + ":00:00" + Utilities.formatDate(new Date(), "Europe/London", "XXX")).getTime();
  for (var i = 1; i < data.length; i++) {
    var st = String(data[i][sc]).trim(), t = data[i][tc];
    if (!(t instanceof Date) || (st !== "" && st !== "Call 8am")) continue;
    var start = st === "Call 8am" ? Math.max(t.getTime(), dayStart) : t.getTime();
    var mins = (now - start) / 60000;
    if (mins >= 60) { waiting++; oldest = Math.max(oldest, mins); }
  }
  return { waiting: waiting, oldestMins: Math.round(oldest) };
}

function backlogCheck() {
  var t0 = Date.now(), mark = function (ok, d) { if (typeof healthMark === "function") healthMark("backlogCheck", ok, Date.now() - t0, d); };
  if (typeof healthBacklogCheck === "function") {      // health.gs: H5 + H6 (P2/P1 to the owner, a text to the caller)
    try { var ctx = healthCtx(); healthBacklogCheck(ctx); healthCallerActive(ctx); mark(true); }
    catch (err) { mark(false, String(err)); throw err; }
    return;
  }
  if (!inCallHours(new Date())) { mark(true); return; }
  var props = PropertiesService.getScriptProperties();
  var limit = Number(props.getProperty("BACKLOG_ALERT") || 15);
  var b = metaBacklog();
  mark(true);
  if (b.waiting < limit) return;
  var last = Number(props.getProperty("BACKLOG_LAST") || 0);
  if (new Date().getTime() - last < 2 * 60 * 60 * 1000) return;
  var to = String(props.getProperty("OWNER_EMAIL") || "").split(",").map(function (e) { return e.trim(); }).filter(String), sent = 0;
  to.forEach(function (e) {
    try {
      MailApp.sendEmail(e, "⚠️ " + b.waiting + " leads waiting over an hour – Kirkcaldy Dental",
        b.waiting + " waiting-list leads have not been called yet (oldest " + b.oldestMins + " minutes).\n\n" +
        "To catch up, add a caller: Script Property ONCALL_MOBILE = all callers' mobiles, comma-separated, and set ALERT_MODE to rotate. " +
        "Only if nobody else can call: lower the campaign budget by about 20% (Ads Manager → campaign → budget).\n\n" +
        "Remember to fill in Status (Called / No answer / Booked) after each call, otherwise leads count as waiting.\n\n" +
        "Waiting List sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl());
      sent++;
    } catch (err) { console.error("Backlog email failed: " + err); }
  });
  if (sent) props.setProperty("BACKLOG_LAST", String(new Date().getTime()));   // recorded after sending
}

// 9pm: one email to the owner with today's numbers.
function eveningReport() {
  var t0 = Date.now(), props = PropertiesService.getScriptProperties();
  var to = String(props.getProperty("OWNER_EMAIL") || "").split(",").map(function (e) { return e.trim(); }).filter(String);
  if (!to.length) { if (typeof healthMark === "function") healthMark("eveningReport", true, Date.now() - t0, "no OWNER_EMAIL"); return; }
  var sh = leadsSheet(), data = sh.getDataRange().getValues(), h = data[0].map(String);
  var tc = h.indexOf("Signup Time"), sc = h.indexOf("Status"), src = h.indexOf("Source");
  var sinceT = Number(props.getProperty("REPORT_LAST") || (Date.now() - 864e5));   // everything since the last report
  var n = 0, bySrc = {}, by = { "called": 0, "booked": 0, "no answer": 0, "unreachable": 0, "not interested": 0, "wrong number": 0, "withdrew": 0, "duplicate": 0 };
  for (var i = 1; i < data.length; i++) {
    var t = data[i][tc];
    if (!(t instanceof Date) || t.getTime() <= sinceT) continue;
    n++;
    var st = String(data[i][sc]).trim().toLowerCase();
    if (by.hasOwnProperty(st)) by[st]++;
    var so = String(src === -1 ? "" : data[i][src]) || "unknown"; bySrc[so] = (bySrc[so] || 0) + 1;
  }
  var b = metaBacklog();
  var lines = Object.keys(bySrc).map(function (k) { return "  " + k + ": " + bySrc[k]; }).join("\n");
  var health = "";
  try {
    if (typeof healthOpenAlerts === "function") {
      var open = healthOpenAlerts(), fl = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Failed leads"), failed = 0;
      if (fl && fl.getLastRow() > 1) fl.getDataRange().getValues().slice(1).forEach(function (r) { if (r[0] instanceof Date && r[0].getTime() > sinceT) failed++; });
      health = "\n\nFailed leads (not saved, added by hand): " + failed + "\nOpen alerts: " +
        (open.length ? open.map(function (a) { return "[" + a.level + "] " + a.subject; }).join("; ") : "none");
    }
    if (typeof HEALTH_VERSION !== "undefined") health += "\nScript version: " + HEALTH_VERSION;
  } catch (e) { console.error("Evening report health lines: " + e); }
  to.forEach(function (e) {
    try {
      MailApp.sendEmail(e, "Today: " + n + " new waiting-list sign-ups – Kirkcaldy Dental",
        "New sign-ups since the last report: " + n + "\n" + lines +
        "\n\nCalled: " + by["called"] + "   Booked: " + by["booked"] + "   No answer: " + by["no answer"] + "   Unreachable: " + by["unreachable"] +
        "\nNot interested: " + by["not interested"] + "   Wrong number: " + by["wrong number"] + "   Withdrew: " + by["withdrew"] +
        "   Already on the list (duplicates): " + by["duplicate"] +
        "\nStill waiting over an hour: " + b.waiting + (typeof adsEveningLines === "function" ? adsEveningLines() : "") + health +
        "\n\nWaiting List sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl());
    } catch (err) { console.error("Evening report failed: " + err); }
  });
  props.setProperty("REPORT_LAST", String(Date.now()));
  if (typeof healthMark === "function") healthMark("eveningReport", true, Date.now() - t0);
}
