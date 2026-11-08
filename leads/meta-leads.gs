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
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty("META_PAGE_TOKEN"), forms = props.getProperty("META_FORM_IDS");
  if (!token || !forms) return;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;            // previous run still going
  var t0 = Date.now();
  try {
    var dflt = Number(props.getProperty("META_SINCE") || Math.floor(Date.now() / 1000) - 3600);
    var sinceBy = JSON.parse(props.getProperty("META_SINCE_BY_FORM") || "{}");   // progress per form
    var seen = JSON.parse(props.getProperty("META_SEEN") || "[]");
    var leads = [];
    forms.split(",").map(function (s) { return s.trim(); }).filter(String).forEach(function (formId) {
      var since = sinceBy[formId] || dflt, got = [], ok = true;
      // 15-minute overlap catches leads Meta makes available late; META_SEEN stops repeats
      var url = metaGraph() + formId + "/leads?limit=100&fields=id,created_time,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,field_data,platform,is_organic,custom_disclaimer_responses&filtering=" +
        encodeURIComponent(JSON.stringify([{ field: "time_created", operator: "GREATER_THAN", value: since - 900 }])) +
        "&access_token=" + encodeURIComponent(token);
      while (url) {
        var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
        if (res.getResponseCode() !== 200) {
          ok = false;
          console.error("Meta API " + res.getResponseCode() + " (form " + formId + "): " + res.getContentText());
          healthNotifyOnce("META_ERR_LAST", "\u26A0\uFE0F Facebook leads are NOT arriving \u2013 Meta API " + res.getResponseCode(),
            "The lead script could not read form " + formId + ". New Facebook/Instagram leads will not be texted or added to the sheet until this is fixed.\n\n" +
            "Error 190 = the token is wrong/expired (make a new one: runbook Step 5.2). Codes 4/17/32/613 = rate limit (usually clears by itself). " +
            "Error 2635 / 'version deprecated' = set Script Property META_API_VERSION to Meta's newest version (e.g. v28.0).\n\n" + res.getContentText().slice(0, 1000));
          break;
        }
        var body = JSON.parse(res.getContentText());
        (body.data || []).forEach(function (l) { if (seen.indexOf(l.id) === -1) { l._form = formId; got.push(l); } });
        url = body.paging && body.paging.next;
      }
      if (ok) leads = leads.concat(got);       // a form with a failed page is skipped this run; its progress doesn't move
    });
    leads.sort(function (a, b) { return new Date(a.created_time) - new Date(b.created_time); });
    // Handle oldest first, save progress after EACH lead, stop after 4 minutes (Apps Script kills runs at 6)
    for (var k = 0; k < leads.length && Date.now() - t0 < 4 * 60 * 1000; k++) {
      var l = leads[k];
      try { handleLead(l); }
      catch (err) {
        console.error("Lead " + l.id + " failed: " + err);
        healthNotifyOnce("LEAD_ERR_LAST", "\u26A0\uFE0F A Facebook lead could not be processed",
          "Please add this person to the Waiting list by hand and call them:\n\n" + JSON.stringify(l.field_data) + "\n\nError: " + err);
      } finally {
        seen.push(l.id);
        var c = Math.floor(new Date(l.created_time).getTime() / 1000) || 0;
        sinceBy[l._form] = Math.max(sinceBy[l._form] || dflt, c);
        props.setProperties({ META_SEEN: JSON.stringify(seen.slice(-300)), META_SINCE_BY_FORM: JSON.stringify(sinceBy) });
      }
    }
  } finally {
    lock.releaseLock();
  }
}

// Emails OWNER_EMAIL about a problem at most once every 3 hours per problem (key).
function healthNotifyOnce(key, subject, body) {
  var p = PropertiesService.getScriptProperties(), last = Number(p.getProperty(key) || 0);
  if (Date.now() - last < 3 * 3600 * 1000) return;
  p.setProperty(key, String(Date.now()));
  String(p.getProperty("OWNER_EMAIL") || "").split(",").map(function (e) { return e.trim(); }).filter(String).forEach(function (e) {
    try { MailApp.sendEmail(e, subject, body); } catch (x) { console.error("Owner alert failed: " + x); }
  });
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

function handleLead(l) {
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

  // 1. sheet row (matched to the sheet's own column headers)
  var sh = leadsSheet();
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
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
  // 3. alert the team (in calling hours) – done before the row is written so the sheet shows who has it
  if (inHours && !blocked && !quiet) values["Assigned to"] = "'" + alertTeam((repeat ? "REPEAT \u2013 " : "") +
    "\uD83E\uDDB7 NEW LEAD (" + values.Source + ") \u2013 call now: " + String(name).slice(0, 40) + " " + String(phone).slice(0, 20));
  sh.appendRow(headers.map(function (h) { return values.hasOwnProperty(h) ? values[h] : ""; }));
  var row = sh.getLastRow();                         // safe: pollMetaLeads holds the script lock (doPost uses it too)
  var put = function (hdr, v) { var c = headers.indexOf(hdr); if (c !== -1) sh.getRange(row, c + 1).setValue(v); };

  // 2. instant text to the lead (one SMS, 160 characters max). Repeats get one "already on the list" text a day at most.
  var r = null;
  if (!blocked && !repeat) r = sendSms(phone, leadText(first, inHours));
  if (repeat && !seen.recent) r = sendSms(phone, metaRepeatText(first));
  if (r && typeof r === "object") { put("SMS ID", "'" + String(r.id || "")); put("SMS status", r.status === "SUCCESS" ? "Sent" : "Failed: " + r.status); }


  // 4. confirmation email
  if (email && !blocked && !repeat) {
    if (MailApp.getRemainingDailyQuota() < 25) {      // keep the last emails for owner alerts
      healthNotifyOnce("MAIL_QUOTA_LAST", "\u26A0\uFE0F Daily email limit nearly used up",
        "Google's daily email allowance is almost used, so lead confirmation emails are paused until tomorrow. Texts still go out.");
      put("Email status", "Not sent: daily limit");
      return;
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
      put("Email status", "Sent");
    } catch (err) { console.error("Email failed: " + err); put("Email status", "Failed: " + String(err).slice(0, 80)); }
  }
}

// 8am: tell the on-call mobile how many overnight leads are waiting
function morningSummary() {
  var sh = leadsSheet();
  var data = sh.getDataRange().getValues(), col = data[0].map(String).indexOf("Status");
  if (col === -1) return;
  var n = data.slice(1).filter(function (r) { return r[col] === "Call 8am"; }).length;
  if (n) alertTeam("🦷 Good morning – " + n + " overnight lead" + (n > 1 ? "s" : "") +
    " to call. Filter the Waiting List sheet by Status = \"Call 8am\".", false);
}

// ---------- Overload guard + evening report (Facebook script only) ----------
// Every 15 min in calling hours: count leads still not called after 60 min (Status blank).
// If that backlog reaches BACKLOG_ALERT (Script Property, default 15) the owner is emailed
// (OWNER_EMAIL) at most once every 2 hours, so the ad budget can be cut before people wait too long.
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
  if (!inCallHours(new Date())) return;
  var props = PropertiesService.getScriptProperties();
  var limit = Number(props.getProperty("BACKLOG_ALERT") || 15);
  var b = metaBacklog();
  if (b.waiting < limit) return;
  var last = Number(props.getProperty("BACKLOG_LAST") || 0);
  if (new Date().getTime() - last < 2 * 60 * 60 * 1000) return;
  props.setProperty("BACKLOG_LAST", String(new Date().getTime()));
  var to = String(props.getProperty("OWNER_EMAIL") || "").split(",").map(function (e) { return e.trim(); }).filter(String);
  to.forEach(function (e) {
    try {
      MailApp.sendEmail(e, "\u26A0\uFE0F " + b.waiting + " leads waiting over an hour \u2013 Kirkcaldy Dental",
        b.waiting + " waiting-list leads have not been called yet (oldest " + b.oldestMins + " minutes).\n\n" +
        "To catch up: lower the Meta ad budget by about 20% (Ads Manager \u2192 ad set \u2192 budget), " +
        "or add a second caller (Script Property ONCALL_MOBILE: add their number, and set ALERT_MODE to rotate).\n\n" +
        "Remember to fill in Status (Called / No answer / Booked) after each call, otherwise leads count as waiting.\n\n" +
        "Waiting List sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl());
    } catch (err) { console.error("Backlog email failed: " + err); }
  });
}

// 9pm: one email to the owner with today's numbers.
function eveningReport() {
  var props = PropertiesService.getScriptProperties();
  var to = String(props.getProperty("OWNER_EMAIL") || "").split(",").map(function (e) { return e.trim(); }).filter(String);
  if (!to.length) return;
  var sh = leadsSheet(), data = sh.getDataRange().getValues(), h = data[0].map(String);
  var tc = h.indexOf("Signup Time"), sc = h.indexOf("Status"), src = h.indexOf("Source");
  var sinceT = Number(props.getProperty("REPORT_LAST") || (Date.now() - 864e5));   // everything since the last report
  var n = 0, called = 0, booked = 0, noans = 0, dup = 0, bySrc = {};
  for (var i = 1; i < data.length; i++) {
    var t = data[i][tc];
    if (!(t instanceof Date) || t.getTime() <= sinceT) continue;
    n++;
    var st = String(data[i][sc]).trim().toLowerCase();
    if (st === "called") called++; else if (st === "booked") booked++; else if (st === "no answer") noans++; else if (st === "duplicate") dup++;
    var so = String(src === -1 ? "" : data[i][src]) || "unknown"; bySrc[so] = (bySrc[so] || 0) + 1;
  }
  var b = metaBacklog();
  var lines = Object.keys(bySrc).map(function (k) { return "  " + k + ": " + bySrc[k]; }).join("\n");
  to.forEach(function (e) {
    try {
      MailApp.sendEmail(e, "Today: " + n + " new waiting-list sign-ups \u2013 Kirkcaldy Dental",
        "New sign-ups since the last report: " + n + "\n" + lines + "\n\nCalled: " + called + "   Booked: " + booked + "   No answer: " + noans + "   Already on the list (duplicates): " + dup +
        "\nStill waiting over an hour: " + b.waiting + "\n\nWaiting List sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl());
    } catch (err) { console.error("Evening report failed: " + err); }
  });
  props.setProperty("REPORT_LAST", String(Date.now()));
}
