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

// Any error while saving a sign-up: keep the details in "Failed sign-ups", alert the owner, and reply "error" (never a silent loss)
function doPost(e) {
  try {
    var res = websiteHandlePost(e);
    if (typeof healthMark === "function") healthMark("doPost");
    return res;
  } catch (err) {
    var p = (e && e.parameter) || {};
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet(), fs = ss.getSheetByName("Failed sign-ups") || ss.insertSheet("Failed sign-ups");
      if (fs.getLastRow() === 0) fs.appendRow(["Time", "Error", "Name", "Phone", "Email", "Postcode", "Source", "All fields"]);
      fs.appendRow([new Date(), String(err).slice(0, 300), String(p.name || "").slice(0, 100), "'" + String(p.phone || "").slice(0, 20),
        String(p.email || "").slice(0, 200), String(p.postcode || "").slice(0, 20), String(p.source || "").slice(0, 40), JSON.stringify(p).slice(0, 2000)]);
    } catch (x) { console.error("Could not save failed sign-up: " + x); }
    if (typeof healthNotifyOnce === "function") healthNotifyOnce("WEB_SIGNUP_FAIL", "\u26A0\uFE0F P1: a website sign-up failed to save",
      "The details are in the \"Failed sign-ups\" tab – copy them into the Waiting list and call the person.\n\n" + String(err).slice(0, 500));
    console.error("doPost failed: " + err);
    return out("error");
  }
}

// Uptime check: GET …/exec?action=ping → "pong <version>" once the Waiting list tab is reachable
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action !== "ping") return out("ok");
  if (typeof healthAssertSheet === "function") healthAssertSheet(); else leadsSheet();
  return out("pong " + (typeof HEALTH_VERSION !== "undefined" ? HEALTH_VERSION : ""));
}

// Sources the website may send (?src=…); anything else is saved as "website"
var WEB_SOURCES = ["website", "home", "direct", "leaflet", "banner", "fb-page", "ig-bio", "fb-form-done", "fb-dm", "facebook", "instagram", "google", "gbp", "email", "phone", "other"];

function websiteHandlePost(e) {
  var p = (e && e.parameter) || {};
  if (p.action === "visit") return logVisit(p);
  if (p.website) return out("ok");          // honeypot: hidden field only bots fill in – drop silently
  // name + a phone number (10+ digits) are required; email is optional (same rule as the Facebook form)
  if (!p.name || String(p.phone || "").replace(/\D/g, "").length < 10) return out("missing");
  if (typeof healthAssertSheet === "function") healthAssertSheet();

  var inHours = inCallHours(new Date());   // CALL_HOURS unset = 8-21 (owner: no calls after 9pm)
  var name = String(p.name).trim(), first = niceFirstName(name);

  var lock = LockService.getScriptLock();
  // tryLock (not waitLock): if the Facebook poller holds the shared lock, still save the sign-up rather than lose it
  var locked = lock.tryLock(20000);
  if (!locked) console.warn("Script lock busy – saving the sign-up without it");
  try {
    var sh = leadsSheet();
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
    var clean = function (v) { v = String(v || "").slice(0, 200); return /^[=+\-@]/.test(v) ? "'" + v : v; };
    // Same repeat rule as the Facebook leads (meta-leads.gs): match on last 10 phone digits or email.
    //  - DO NOT CONTACT always wins: row saved, no contact of any kind.
    //  - signed up again within 24h, or already Called / Booked / Not interested -> "Duplicate", no alert, no new call.
    //  - older and never reached -> "REPEAT" alert so the callers try again. Repeats get the "already on the list" text, max 1 a day.
    var seen = websiteLookup(p.phone, p.email), blocked = seen.blocked, repeat = seen.repeat && !blocked;
    var quiet = repeat && (seen.recent || seen.handled);
    var src = String(p.source || "website").toLowerCase().replace(/[^a-z0-9\-_]/g, "").slice(0, 40);
    // also tagged variants: leaflet-<area>, banner-<n>, and gbp (Google Business Profile)
    if (WEB_SOURCES.indexOf(src) === -1 && !/^(leaflet|banner)-[a-z0-9_]{1,20}$/.test(src)) src = "website";
    var leadId = "W-" + Utilities.formatDate(new Date(), "Europe/London", "yyMMddHHmmss") + "-" + Math.random().toString(36).slice(2, 5);
    var values = {
      "Signup Time": new Date(),
      "Name": clean(name),
      "Phone": "'" + String(p.phone || "").slice(0, 20),   // keep the leading 0 / +
      "Email": clean(p.email),
      "Postcode": clean(p.postcode),
      "No. of People": clean(p.people),
      "Currently Registered?": clean(p.registered),
      "Adult/Child/Family": clean(p.who),
      "Source": src,
      "Status": blocked ? DO_NOT_CONTACT : quiet ? "Duplicate" : (inHours ? "" : "Call 8am"),   // "Call 8am": picked up by the 8am summary
      // optional, unticked-by-default box on /register/; only "Yes" people may ever get promotional texts/emails
      "Marketing consent": /^(yes|true|on|1)$/i.test(String(p.marketing || "").trim()) ? "Yes" : "No",
      "Lead ID": "'" + leadId,
      "Logged at": new Date(),
      "Duplicate of": seen.repeat ? "'" + seen.firstId : "",
      "How heard": clean(p.heard),
      "Visit ID": (p.vid || p.visit) ? "'" + String(p.vid || p.visit).replace(/[^a-z0-9\-_]/gi, "").slice(0, 40) : ""
    };
    // Owner/health switch WEB_SMS_PAUSED = true: save the row only – no texts, no caller alert, no emails
    var paused = /^(1|true|yes|on)$/i.test(String(PropertiesService.getScriptProperties().getProperty("WEB_SMS_PAUSED") || ""));
    if (repeat) values["Notes"] = "Already on the list (same phone/email) - see " + seen.firstId + (seen.recent ? "; no text sent" : "");
    // "new lead" alert (calling hours only) – sent before the row is written so the sheet shows who has it.
    if (paused && !blocked) values["Notes"] = (values["Notes"] ? values["Notes"] + "; " : "") + "paused - check";
    if (inHours && !blocked && !quiet && !paused) values["Assigned to"] = "'" + alertTeam((repeat ? "REPEAT \u2013 " : "") +
      "\uD83E\uDDB7 NEW LEAD (" + src + ") \u2013 call now: " + name.slice(0, 40) + " " + String(p.phone || "").slice(0, 20));

    // Thank-you text (one SMS) and email – also before the row is written, so SMS/Email status go in the same row
    var r = null;
    if (paused && !blocked) values["SMS status"] = "Paused";   // owner switch: Script Property WEB_SMS_PAUSED = true
    if (!paused && !blocked && !repeat) r = sendSms(p.phone, leadText(first, inHours));
    if (!paused && repeat && !seen.recent) r = sendSms(p.phone, websiteRepeatText(first));
    if (r && typeof r === "object") { values["SMS ID"] = "'" + String(r.id || ""); values["SMS status"] = r.status === "SUCCESS" ? "Sent" : "Failed: " + r.status; }
    if (!r && !paused && !blocked && !repeat && !/^\+447\d{9}$/.test(ukMobile(p.phone))) values["SMS status"] = "Not sent: not a mobile";   // landlines get a call, not a text
    if (SEND_EMAIL && !paused && !blocked && !repeat && p.email) values["Email status"] = websiteConfirmEmail(p.email, first);

    sh.appendRow(headers.map(function (h) { return values.hasOwnProperty(h) ? values[h] : ""; }));
  } finally {
    if (locked) lock.releaseLock();
  }

  // In calling hours the owner already got the NEW LEAD alert by email (alertTeam → OWNER_EMAIL), so this note is only sent out of hours
  if (NOTIFY && !paused && !blocked && !quiet && !(inHours && PropertiesService.getScriptProperties().getProperty("OWNER_EMAIL"))) {
    try { MailApp.sendEmail(NOTIFY, "New sign-up (" + src + "): " + first, "A new person joined the waiting list on the website. See the Waiting List sheet."); }
    catch (err) { console.error("Notify email failed: " + err); }
  }
  return out("ok");
}

// Earlier rows with the same phone (last 10 digits) or email – same logic as metaLookup() in meta-leads.gs
function websiteLookup(phone, email) {
  var digits = function (v) { var d = String(v || "").replace(/\D/g, ""); return d.length >= 10 ? d.slice(-10) : d; };
  var target = digits(phone), mail = String(email || "").trim().toLowerCase();
  var res = { blocked: false, repeat: false, recent: false, handled: false, firstId: "" };
  if (!target && !mail) return res;
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String);
  var pc = h.indexOf("Phone"), sc = h.indexOf("Status"), ec = h.indexOf("Email"), tc = h.indexOf("Signup Time"), ic = h.indexOf("Lead ID");
  for (var i = 1; i < data.length; i++) {
    var same = (target.length >= 10 && pc !== -1 && digits(data[i][pc]) === target) ||
               (mail && ec !== -1 && String(data[i][ec]).trim().toLowerCase() === mail);
    if (!same) continue;
    if (!res.repeat) res.firstId = (ic !== -1 && String(data[i][ic])) || "row " + (i + 1);
    res.repeat = true;
    var st = sc === -1 ? "" : String(data[i][sc]).trim().toUpperCase();
    if (st === DO_NOT_CONTACT) res.blocked = true;
    if (st === "CALLED" || st === "BOOKED" || st === "NOT INTERESTED") res.handled = true;
    var t = tc === -1 ? null : data[i][tc];
    if (t instanceof Date && Date.now() - t.getTime() < 864e5) res.recent = true;
  }
  if (!res.blocked && websiteOnDncList(target, mail)) res.blocked = true;   // the "Do-not-contact list" tab counts too
  return res;
}
// True if the phone (last 10 digits) or email is on the "Do-not-contact list" tab
function websiteOnDncList(target, mail) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Do-not-contact list");
  if (!sh || sh.getLastRow() < 2) return false;
  var data = sh.getDataRange().getValues(), h = data[0].map(String);
  var pc = h.findIndex(function (x) { return /^Phone/.test(x); }), ec = h.indexOf("Email");
  var digits = function (v) { var d = String(v || "").replace(/\D/g, ""); return d.length >= 10 ? d.slice(-10) : d; };
  for (var i = 1; i < data.length; i++) {
    if (target.length >= 10 && pc !== -1 && digits(data[i][pc]) === target) return true;
    if (mail && ec !== -1 && String(data[i][ec]).trim().toLowerCase() === mail) return true;
  }
  return false;
}
// Same wording as metaRepeatText() in meta-leads.gs (service message only, no offers)
function websiteRepeatText(first) {
  return "Hi " + first + ", good news - you're already on the Kirkcaldy Dental waiting list, so there's nothing more to do. We'll be in touch.";
}
// Confirmation email (admin only – no offers or links). Returns the "Email status" value.
function websiteConfirmEmail(to, first) {
  if (MailApp.getRemainingDailyQuota() < 25) {      // keep the last emails of the day for owner alerts
    if (typeof healthNotifyOnce === "function") healthNotifyOnce("MAIL_QUOTA_LAST", "\u26A0\uFE0F Daily email limit nearly used up",
      "Google's daily email allowance is almost used, so lead confirmation emails are paused until tomorrow. Texts still go out.");
    return "Not sent: daily limit";
  }
  try {
    MailApp.sendEmail({
      to: to, name: "Kirkcaldy Dental & Implant Clinic", replyTo: "info@kirkcaldydental.co.uk",
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
function leadsSheet() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEADS_TAB);
  if (!sh) throw new Error("Tab \"" + LEADS_TAB + "\" not found");
  return sh;
}

// Counts page visits (e.g. QR scans) on the "Visits" tab: time + source only, nothing personal.
function logVisit(p) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Visits") || ss.insertSheet("Visits");
  if (sh.getLastRow() === 0) sh.appendRow(["Visit Time", "Source", "Visit ID"]);
  else if (String(sh.getRange(1, 3).getValue()) !== "Visit ID") sh.getRange(1, 3).setValue("Visit ID");
  var src = String(p.source || "website").replace(/[^a-z0-9\-_]/gi, "").slice(0, 40) || "website";
  var vid = String(p.vid || p.visit || "").replace(/[^a-z0-9\-_]/gi, "").slice(0, 40);   // random per page load, no cookie
  sh.appendRow([new Date(), src, vid ? "'" + vid : ""]);
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
  n = String(n || "").replace(/\(0\)/g, "").replace(/[^\d+]/g, "");   // "+44 (0)7…" → "+447…"
  if (n.indexOf("00") === 0) n = "+" + n.slice(2);                     // "0044 7…" → "+447…"
  if (n.indexOf("+440") === 0) n = "+44" + n.slice(4);                 // "+4407…" → "+447…"
  if (n.indexOf("+") === 0) return n;
  if (n.indexOf("44") === 0) return "+" + n;
  if (n.indexOf("0") === 0) return "+44" + n.slice(1);
  if (/^7\d{9}$/.test(n)) return "+44" + n;                             // "7700900123" → "+447700900123"
  return n;
}

// Returns {id, status, price} from ClickSend (status "SUCCESS" when accepted), or nothing if the text was skipped.
function sendSms(to, body) {
  var props = PropertiesService.getScriptProperties();
  var user = props.getProperty("CLICKSEND_USER"), key = props.getProperty("CLICKSEND_KEY");
  var num = ukMobile(to), result;
  var isAlert = /NEW LEAD|call-backs due/.test(String(body));
  if (!user || !key) {
    if (typeof healthAlert === "function") healthAlert("P1", "ClickSend keys missing – texts are not being sent");
    return;
  }
  if (!to) return;
  if (!/^\+447\d{9}$/.test(num)) {   // no landlines, premium or foreign numbers
    console.warn("Not a UK mobile, SMS skipped");
    if (isAlert && typeof healthAlert === "function") healthAlert("P1", "A caller alert number is not a UK mobile: check ONCALL_MOBILE / OWNER_MOBILE");
    return;
  }
  if (!smsWithinCaps()) return;
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
    var m0 = {}; try { m0 = ((JSON.parse(txt).data || {}).messages || [])[0] || {}; } catch (e) {}
    var result = { id: m0.message_id || "", status: m0.status || (code === 200 ? "UNKNOWN" : "HTTP " + code), price: m0.message_price || "" };
    if (code !== 200 || bad.length) smsFailed("HTTP " + code + (bad.length ? ", status " + bad.join("/") : "") + " – " + txt.slice(0, 300), result.status, body);
  } catch (err) { smsFailed(String(err), "ERROR", body); result = { id: "", status: "ERROR", price: "" }; }
  if (typeof trkLogSms === "function") trkLogSms(trkSmsType(body), num, result);   // tracking.gs: SMS log tab
  return result;
}

// Hourly / daily safety caps on texts (Script Properties SMS_HOURLY_MAX, default 40, and SMS_DAILY_MAX, default 300)
function smsWithinCaps() {
  var props = PropertiesService.getScriptProperties(), now = new Date();
  var hKey = Utilities.formatDate(now, "Europe/London", "yyyyMMddHH"), dKey = Utilities.formatDate(now, "Europe/London", "yyyyMMdd");
  var h = String(props.getProperty("SMS_COUNT_HOUR") || "").split(":"), d = String(props.getProperty("SMS_COUNT_DAY") || "").split(":");
  var hn = h[0] === hKey ? Number(h[1]) || 0 : 0, dn = d[0] === dKey ? Number(d[1]) || 0 : 0;
  var hMax = Number(props.getProperty("SMS_HOURLY_MAX") || 40), dMax = Number(props.getProperty("SMS_DAILY_MAX") || 300);
  if (hn >= hMax || dn >= dMax) {
    console.warn("SMS cap reached (" + hn + "/h, " + dn + "/day) – text skipped");
    if (typeof healthNotifyOnce === "function") healthNotifyOnce("SMS_CAP", "\u26A0\uFE0F Text limit reached – texts paused",
      "More than " + (hn >= hMax ? hMax + " texts this hour" : dMax + " texts today") + " were sent, so texts are paused until the limit resets. " +
      "If this is real demand, raise SMS_HOURLY_MAX / SMS_DAILY_MAX in Script Properties; if not, the form may be being abused.");
    return false;
  }
  props.setProperty("SMS_COUNT_HOUR", hKey + ":" + (hn + 1));
  props.setProperty("SMS_COUNT_DAY", dKey + ":" + (dn + 1));
  return true;
}

// Logs a failed text and tells the owner by email (wrong keys, no credit, sender ID not approved…)
function smsFailed(detail, status, body) {
  console.error("SMS failed: " + detail);
  if (typeof healthSmsCheck === "function") return;   // health.gs reports failed texts itself (one P1/P2), so no second email from here
  // no credit, or a caller alert that didn't go out: tell the owner straight away (own keys, so the 3h limit of other errors doesn't hide it)
  if (typeof healthNotifyOnce === "function" && /INSUFFICIENT_CREDIT/.test(String(status)))
    healthNotifyOnce("SMS_ERR_CREDIT", "\u26A0\uFE0F ClickSend is out of credit – texts are not being sent", "Top up ClickSend now.\n\n" + detail.slice(0, 500));
  else if (typeof healthNotifyOnce === "function" && /NEW LEAD/.test(String(body)))
    healthNotifyOnce("SMS_ERR_ALERT", "\u26A0\uFE0F A new-lead alert to the callers failed", "Check the Waiting list for new leads and call them.\n\n" + detail.slice(0, 500));
  // healthNotifyOnce() lives in meta-leads.gs (same project): emails OWNER_EMAIL at most every 3h per key
  if (typeof healthNotifyOnce === "function") return healthNotifyOnce("SMS_ERR_LAST", "\u26A0\uFE0F Texts are failing (ClickSend)",
    "ClickSend did not send a text. Check the ClickSend account (credit, API key, sender ID).\n\n" + detail.slice(0, 500));
  // fallback if this file is used on its own: at most one email an hour
  var cache = CacheService.getScriptCache();
  if (cache.get("SMS_FAIL_EMAILED")) return;
  cache.put("SMS_FAIL_EMAILED", "1", 3600);
  String(PropertiesService.getScriptProperties().getProperty("OWNER_EMAIL") || "").split(",").map(function (e) { return e.trim(); }).filter(String)
    .forEach(function (e) {
      try { MailApp.sendEmail(e, "Kirkcaldy Dental: a text message failed to send",
        "ClickSend did not send a text. Check the ClickSend account (credit, API key, sender ID).\n\n" + detail); } catch (err) { console.error("Fail email failed: " + err); }
    });
}

function out(s) { return ContentService.createTextOutput(s); }
