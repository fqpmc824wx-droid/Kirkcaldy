/**
 * Kirkcaldy Dental – our own Facebook/Instagram lead handler (no Zapier / Make needed).
 *
 * Every minute it checks Meta for new Instant Form leads, then for each one:
 *   1. adds a row to the Waiting List sheet (Source = "facebook")
 *   2. texts the lead straight away ("thanks, we'll be in touch")
 *   3. 8am–9pm: texts the on-call mobile "NEW LEAD – call now"
 *      9pm–8am: marks the row "Call 8am"; at 8am the on-call mobile gets a summary
 *   4. emails the lead a confirmation
 *
 * INSTALL – in the SAME Apps Script project as apps-script.gs (Waiting List sheet → Extensions → Apps Script):
 *   + Add file "meta-leads" → paste this file → Save.
 *   Project Settings → Script Properties, add:
 *     META_PAGE_TOKEN = a long-lived Page access token with leads_retrieval (see leads/README.md)
 *     META_FORM_IDS   = the Instant Form ID(s), comma-separated
 *     CLICKSEND_USER / CLICKSEND_KEY (already used by apps-script.gs)
 *     ONCALL_MOBILE   = one or more mobiles, comma-separated – all get the team alerts
 *   Then run installLeadTriggers() once and allow the permissions.
 * Uses sendSms() and ukMobile() from apps-script.gs.
 */

var GRAPH = "https://graph.facebook.com/v21.0/";
var CALL_FROM_HOUR = 8, CALL_TO_HOUR = 21;   // calling window, UK time
var LEADS_TAB = "Waiting list";               // NEVER the first tab – that is the Dashboard

function leadsSheet() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEADS_TAB);
  if (!sh) throw new Error("Tab \"" + LEADS_TAB + "\" not found");
  return sh;
}

// ONCALL_MOBILE can hold several numbers, comma-separated, e.g. "07700900111, 07700900222".
// Everyone listed gets every team alert (e.g. the on-call person AND the owner).
function alertTeam(msg) {
  var list = PropertiesService.getScriptProperties().getProperty("ONCALL_MOBILE") || "";
  list.split(",").map(function (n) { return n.trim(); }).filter(String).forEach(function (n) { sendSms(n, msg); });
}

// Lead thank-you text: kept within ONE text message (160 plain characters, no emoji/curly quotes)
// so each costs a single SMS. Long first names fall back to a slightly shorter version.
function niceFirstName(name) {
  var f = String(name || "").trim().split(/\s+/)[0] || "";
  f = f.normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // "Zoë" -> "Zoe" (accents would make it a pricier Unicode SMS)
       .replace(/[\u2018\u2019]/g, "'").replace(/[^A-Za-z\-']/g, "");
  if (!f) return "there";
  if (f === f.toLowerCase() || f === f.toUpperCase())        // "sarah" / "SARAH" -> "Sarah"; "McKenzie" kept as typed
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

function installLeadTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (["pollMetaLeads", "morningSummary"].indexOf(t.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("pollMetaLeads").timeBased().everyMinutes(1).create();
  ScriptApp.newTrigger("morningSummary").timeBased().atHour(CALL_FROM_HOUR).nearMinute(0).everyDays(1)
    .inTimezone("Europe/London").create();
  pollMetaLeads();
}

function pollMetaLeads() {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty("META_PAGE_TOKEN"), forms = props.getProperty("META_FORM_IDS");
  if (!token || !forms) return;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;            // previous run still going
  try {
    var since = Number(props.getProperty("META_SINCE") || Math.floor(Date.now() / 1000) - 3600);
    var seen = JSON.parse(props.getProperty("META_SEEN") || "[]");
    var newest = since, leads = [];
    forms.split(",").map(function (s) { return s.trim(); }).filter(String).forEach(function (formId) {
      var url = GRAPH + formId + "/leads?limit=100&fields=id,created_time,field_data,platform&filtering=" +
        encodeURIComponent(JSON.stringify([{ field: "time_created", operator: "GREATER_THAN", value: since - 120 }])) +
        "&access_token=" + encodeURIComponent(token);
      while (url) {
        var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
        if (res.getResponseCode() !== 200) { console.error("Meta API " + res.getResponseCode() + ": " + res.getContentText()); break; }
        var body = JSON.parse(res.getContentText());
        (body.data || []).forEach(function (l) { if (seen.indexOf(l.id) === -1) leads.push(l); });
        url = body.paging && body.paging.next;
      }
    });
    leads.sort(function (a, b) { return new Date(a.created_time) - new Date(b.created_time); });
    leads.forEach(function (l) {
      handleLead(l);
      seen.push(l.id);
      newest = Math.max(newest, Math.floor(new Date(l.created_time).getTime() / 1000));
    });
    props.setProperty("META_SINCE", String(newest));
    props.setProperty("META_SEEN", JSON.stringify(seen.slice(-300)));
  } finally {
    lock.releaseLock();
  }
}

function field(l, keys) {
  var fd = l.field_data || [];
  for (var i = 0; i < fd.length; i++) {
    var n = String(fd[i].name).toLowerCase();
    for (var k = 0; k < keys.length; k++) if (n.indexOf(keys[k]) !== -1) return (fd[i].values || [])[0] || "";
  }
  return "";
}

function inCallHours(d) {
  var h = Number(Utilities.formatDate(d, "Europe/London", "H"));
  return h >= CALL_FROM_HOUR && h < CALL_TO_HOUR;
}

function handleLead(l) {
  var created = new Date(l.created_time);
  var name = field(l, ["full_name", "name"]) || (field(l, ["first_name"]) + " " + field(l, ["last_name"])).trim();
  var phone = field(l, ["phone"]), email = field(l, ["email"]);
  var first = niceFirstName(name);
  var inHours = inCallHours(new Date());
  var clean = function (v) { v = String(v || "").slice(0, 200); return /^[=+\-@]/.test(v) ? "'" + v : v; };

  // 1. sheet row (matched to the sheet's own column headers)
  var sh = leadsSheet();
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  var values = {
    "Signup Time": created,
    "Name": clean(name),
    "Phone": "'" + String(phone).slice(0, 20),
    "Email": clean(email),
    "Postcode": clean(field(l, ["post"])),
    "No. of People": clean(field(l, ["how_many", "people"])),
    "Currently Registered?": clean(field(l, ["registered", "currently"])),
    "Adult/Child/Family": clean(field(l, ["who", "adult", "family"])),
    "Source": l.platform === "ig" ? "instagram" : "facebook",
    "Status": inHours ? "" : "Call 8am"
  };
  sh.appendRow(headers.map(function (h) { return values.hasOwnProperty(h) ? values[h] : ""; }));

  // 2. instant text to the lead (one SMS, 160 characters max)
  sendSms(phone, leadText(first, inHours));

  // 3. alert the on-call mobile (in calling hours only)
  if (inHours) alertTeam("🦷 NEW LEAD (" + values.Source + ") – call now: " + name + " " + phone);

  // 4. confirmation email
  if (email) {
    try {
      MailApp.sendEmail({
        to: email, name: "Kirkcaldy Dental & Implant Clinic", replyTo: "info@kirkcaldydental.co.uk",
        subject: "You're on our waiting list – Kirkcaldy Dental & Implant Clinic",
        body: "Hi " + first + ",\n\nThank you for joining the waiting list for Kirkcaldy Dental & Implant Clinic, " +
          "a new NHS dental practice opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.\n\n" +
          "A member of our team will be in touch, and we'll keep you updated with opening dates.\n\n" +
          "Any questions? Email info@kirkcaldydental.co.uk.\n\nKirkcaldy Dental & Implant Clinic\nkirkcaldydental.co.uk"
      });
    } catch (err) { console.error("Email failed: " + err); }
  }
}

// 8am: tell the on-call mobile how many overnight leads are waiting
function morningSummary() {
  var sh = leadsSheet();
  var data = sh.getDataRange().getValues(), col = data[0].map(String).indexOf("Status");
  if (col === -1) return;
  var n = data.slice(1).filter(function (r) { return r[col] === "Call 8am"; }).length;
  if (n) alertTeam("🦷 Good morning – " + n + " overnight lead" + (n > 1 ? "s" : "") +
    " to call. Filter the Waiting List sheet by Status = \"Call 8am\".");
}
