/**
 * Kirkcaldy Dental – website "Register your interest" form → Waiting List sheet (owned by info@kirkcaldydental.co.uk).
 *
 * Install: open the "Kirkcaldy Dental – Waiting List" Google Sheet → Extensions → Apps Script,
 * paste this whole file over the sample code, save, then
 * Deploy → New deployment → type "Web app" → Execute as: Me →
 * Who has access: Anyone → Deploy. Copy the Web app URL into
 * site/register/index.html (ENDPOINT).
 *
 * Each sign-up is added as a new row, matched to the sheet's column headers,
 * with the Source column showing where it came from (e.g. "leaflet").
 * It also sends the same thank-you email the Facebook leads get.
 */

var LEADS_TAB = "Waiting list";               // NEVER the first tab – that is the Dashboard (same as meta-leads.gs)
var SHEET_NAME = "Waiting list"; // the sign-ups tab (the first tab is the Dashboard, so always use the name)
var SEND_EMAIL = true;
var DO_NOT_CONTACT = "DO NOT CONTACT"; // Status value that stops all texts, calls and emails (exact same string in meta-leads.gs)
var NOTIFY = "info@kirkcaldydental.co.uk"; // gets a short "new sign-up" note; "" to turn off

// Instant text messages via ClickSend (same as the Facebook leads get through Zapier).
// Keys are NOT stored here: Apps Script editor → Project Settings → Script Properties:
//   CLICKSEND_USER   = your ClickSend username
//   CLICKSEND_KEY    = your ClickSend API key
//   ONCALL_MOBILE    = one or more mobiles for the "new lead" alert, comma-separated (optional, e.g. 07700900123, 07700900456)
//   ALERT_MODE       = "all" (default: every ONCALL_MOBILE gets each lead) or "rotate" (one caller per lead, in turn)
//   OWNER_MOBILE     = mobile(s) that get a copy of every alert, comma-separated (optional)
//   OWNER_EMAIL      = email(s) that get a free copy of every alert, comma-separated (e.g. info@kirkcaldydental.co.uk)
//   ALERT_NEXT       = rotation pointer, set automatically – don't edit
// If CLICKSEND_USER / CLICKSEND_KEY are missing, texts are simply skipped.
var SMS_FROM = "KirkDental";
var MAX_TEXTS_PER_DAY = 2;   // per phone number, website sign-ups (stops anyone using the form to send us texts)

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.action === "visit") return logVisit(p);
  if (p.website) return out("ok");          // honeypot: hidden field only bots fill in – drop silently
  if (!p.name || !p.email) return out("missing");

  var inHours = inCallHours(new Date());   // CALL_HOURS unset = 8-21 (owner: no calls after 9pm)

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
    if (headers.indexOf("Source") === -1) {
      sh.getRange(1, headers.length + 1).setValue("Source");
      headers.push("Source");
    }
    var clean = function (v) { v = String(v || "").slice(0, 200); return /^[=+\-@]/.test(v) ? "'" + v : v; };
    var values = {
      "Signup Time": new Date(),
      "Name": clean(p.name),
      "Phone": "'" + String(p.phone || "").slice(0, 20),   // keep the leading 0 / +
      "Email": clean(p.email),
      "Postcode": clean(p.postcode),
      "No. of People": clean(p.people),
      "Currently Registered?": clean(p.registered),
      "Adult/Child/Family": clean(p.who),
      "Source": clean(p.source || "website"),
      "Status": inHours ? "" : "Call 8am",   // out of hours: picked up by the 8am summary (meta-leads.gs)
      // optional, unticked-by-default box on /register/; only "Yes" people may ever get promotional texts/emails
      "Marketing consent": /^(yes|true|on|1)$/i.test(String(p.marketing || "").trim()) ? "Yes" : "No"
    };
    // Anyone whose phone already has a row with Status "DO NOT CONTACT" gets no texts, calls or emails (same string as meta-leads.gs)
    var dnc = isDoNotContact(p.phone);
    // abuse cap: no more than MAX_TEXTS_PER_DAY sign-ups per phone number in 24h get a text/alert (row still saved)
    var capped = !dnc && websiteRecentSignups(sh, headers, p.phone) >= MAX_TEXTS_PER_DAY;
    if (capped) values["Notes"] = "Repeat sign-up – no text sent";
    if (dnc) values["Status"] = DO_NOT_CONTACT;
    // "new lead" alert (calling hours only) – sent before the row is written so the sheet shows who has it.
    // ALERT_MODE "rotate" gives each lead to the next ONCALL_MOBILE in turn (ALERT_NEXT is shared with meta-leads.gs).
    if (inHours && !dnc && !capped) values["Assigned to"] = "'" + alertTeam("\uD83E\uDDB7 NEW LEAD (" + values.Source + ") \u2013 call now: " + String(p.name).trim() + " " + String(p.phone || ""));
    sh.appendRow(headers.map(function (h) { return values.hasOwnProperty(h) ? values[h] : ""; }));
  } finally {
    lock.releaseLock();
  }

  if (dnc) return out("ok");   // row kept for the record, but no contact of any kind
  if (capped) return out("ok");
  var first = String(p.name).trim().split(/\s+/)[0];

  // Instant thank-you text to the person (the team alert was sent above)
  sendSms(p.phone, leadText(niceFirstName(p.name), inHours));
  if (SEND_EMAIL) {
    MailApp.sendEmail({
      to: p.email,
      name: "Kirkcaldy Dental & Implant Clinic",
      replyTo: "info@kirkcaldydental.co.uk",
      subject: "You're on our waiting list – Kirkcaldy Dental & Implant Clinic",
      body: "Hi " + first + ",\n\n" +
        "Thank you for joining the waiting list for Kirkcaldy Dental & Implant Clinic, a new NHS dental practice opening soon in Kirkcaldy.\n\n" +
        "We'll be in touch with opening dates and practice information as soon as they're confirmed.\n\n" +
        "Any questions? Email info@kirkcaldydental.co.uk.\n\n" +
        "Kirkcaldy Dental & Implant Clinic\nkirkcaldydental.co.uk"
    });
  }
  // In calling hours the owner already got the NEW LEAD alert by email (alertTeam → OWNER_EMAIL), so this note is only sent out of hours
  if (NOTIFY && !(inHours && PropertiesService.getScriptProperties().getProperty("OWNER_EMAIL"))) {
    MailApp.sendEmail(NOTIFY, "New sign-up (" + (p.source || "website") + "): " + first,
      "A new person joined the waiting list on the website. See the Waiting List sheet.");
  }
  return out("ok");
}

// Copied unchanged from leads/meta-leads.gs (same Apps Script project – keep them identical, incl. LEADS_TAB above).
// Anyone whose row has Status "DO NOT CONTACT" is never texted, emailed or alerted again.
function isDoNotContact(phone) {
  var digits = function (v) { return String(v || "").replace(/\D/g, "").replace(/^44/, "0"); };
  var target = digits(phone);
  if (!target) return false;
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String);
  var pc = h.indexOf("Phone"), sc = h.indexOf("Status");
  if (pc === -1 || sc === -1) return false;
  for (var i = 1; i < data.length; i++)
    if (String(data[i][sc]).trim().toUpperCase() === "DO NOT CONTACT" && digits(data[i][pc]) === target) return true;
  return false;
}
function leadsSheet() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEADS_TAB);
  if (!sh) throw new Error("Tab \"" + LEADS_TAB + "\" not found");
  return sh;
}

// How many rows with this phone number were added in the last 24 hours
function websiteRecentSignups(sh, headers, phone) {
  var pc = headers.indexOf("Phone"), tc = headers.indexOf("Signup Time"), n = sh.getLastRow() - 1;
  var want = ukMobile(phone), since = Date.now() - 24 * 3600 * 1000, count = 0;
  if (pc === -1 || tc === -1 || n < 1 || !want) return 0;
  var rows = sh.getRange(Math.max(2, n - 498), 1, Math.min(n, 500), headers.length).getValues();   // newest 500 rows is plenty
  rows.forEach(function (r) { if (ukMobile(r[pc]) === want && new Date(r[tc]).getTime() > since) count++; });
  return count;
}

// Counts page visits (e.g. QR scans) on the "Visits" tab: time + source only, nothing personal.
function logVisit(p) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Visits") || ss.insertSheet("Visits");
  if (sh.getLastRow() === 0) sh.appendRow(["Visit Time", "Source"]);
  var src = String(p.source || "website").replace(/[^a-z0-9\-_]/gi, "").slice(0, 40) || "website";
  sh.appendRow([new Date(), src]);
  return out("ok");
}

// Same lead thank-you text as Facebook leads (copied unchanged from leads/meta-leads.gs, keep them identical).
// ONE text message: at most 160 plain characters, no emoji or curly quotes.
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
  var when = inHours ? "very soon" : "tomorrow from 8am";
  var options = [
    "Hi " + first + ", thank you for joining the Kirkcaldy Dental waiting list! A friendly member of our team will call you " + when + ". We can't wait to welcome you!",
    "Hi " + first + ", thank you for joining the Kirkcaldy Dental waiting list! Our team will call you " + when + ". We can't wait to welcome you!",
    "Hi " + first + ", thanks for joining the Kirkcaldy Dental waiting list! We'll call you " + when + "."
  ];
  for (var i = 0; i < options.length; i++) if (options[i].length <= 160) return options[i];
  return options[options.length - 1].slice(0, 160);
}
// Call hours from Script Property CALL_HOURS (same as meta-leads.gs):
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

// Who gets the "new lead" alert (copied unchanged from leads/meta-leads.gs, keep them identical). Returns the assignee(s).
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

// UK numbers to international format for ClickSend (07… → +447…)
// NOTE: ukMobile() and sendSms() are also used by leads/meta-leads.gs (Facebook leads) in the same Apps Script project: don't rename them.
function ukMobile(n) {
  n = String(n || "").replace(/[^\d+]/g, "");
  if (n.indexOf("+") === 0) return n;
  if (n.indexOf("44") === 0) return "+" + n;
  if (n.indexOf("0") === 0) return "+44" + n.slice(1);
  return n;
}

function sendSms(to, body) {
  var props = PropertiesService.getScriptProperties();
  var user = props.getProperty("CLICKSEND_USER"), key = props.getProperty("CLICKSEND_KEY");
  var num = ukMobile(to);
  if (!user || !key || !/^\+447\d{9}$/.test(num)) return;   // UK mobiles only (no landlines, premium or foreign numbers)
  try {
    var res = UrlFetchApp.fetch("https://rest.clicksend.com/v3/sms/send", {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: "Basic " + Utilities.base64Encode(user + ":" + key) },
      payload: JSON.stringify({ messages: [{ source: "apps-script", from: SMS_FROM, to: num, body: body }] }),
      muteHttpExceptions: true
    });
    var code = res.getResponseCode(), txt = res.getContentText(), bad = [];
    try { ((JSON.parse(txt).data || {}).messages || []).forEach(function (m) { if (m.status !== "SUCCESS") bad.push(m.status); }); } catch (e) { bad.push("unreadable reply"); }
    if (code !== 200 || bad.length) smsFailed("HTTP " + code + (bad.length ? ", status " + bad.join("/") : "") + " – " + txt.slice(0, 300));
  } catch (err) { smsFailed(String(err)); }
}

// Logs a failed text and emails OWNER_EMAIL, at most once an hour (wrong keys, no credit, sender ID not approved…)
function smsFailed(detail) {
  console.error("SMS failed: " + detail);
  var cache = CacheService.getScriptCache();
  if (cache.get("SMS_FAIL_EMAILED")) return;
  cache.put("SMS_FAIL_EMAILED", "1", 3600);
  String(PropertiesService.getScriptProperties().getProperty("OWNER_EMAIL") || "").split(",").map(function (e) { return e.trim(); }).filter(String)
    .forEach(function (e) {
      try { MailApp.sendEmail(e, "Kirkcaldy Dental: a text message failed to send",
        "ClickSend did not send a text. Check the ClickSend account (credit, API key, sender ID).\n\n" + detail +
        "\n\n(You get this at most once an hour.)"); } catch (err) { console.error("Fail email failed: " + err); }
    });
}

function out(s) { return ContentService.createTextOutput(s); }
