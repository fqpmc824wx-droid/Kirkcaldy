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

var SHEET_NAME = "";            // leave blank to use the first tab
var SEND_EMAIL = true;
var NOTIFY = "info@kirkcaldydental.co.uk"; // gets a short "new sign-up" note; "" to turn off

// Instant text messages via ClickSend (same as the Facebook leads get through Zapier).
// Keys are NOT stored here: Apps Script editor → Project Settings → Script Properties:
//   CLICKSEND_USER   = your ClickSend username
//   CLICKSEND_KEY    = your ClickSend API key
//   ONCALL_MOBILE    = the mobile that gets a "new lead" alert (optional, e.g. 07700900123)
// If CLICKSEND_USER / CLICKSEND_KEY are missing, texts are simply skipped.
var SMS_FROM = "KirkDental";

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.action === "visit") return logVisit(p);
  if (!p.name || !p.email) return out("missing");

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
      "Source": clean(p.source || "website")
    };
    sh.appendRow(headers.map(function (h) { return values.hasOwnProperty(h) ? values[h] : ""; }));
  } finally {
    lock.releaseLock();
  }

  var first = String(p.name).trim().split(/\s+/)[0];
  var src = p.source || "website";

  // Instant thank-you text to the person, and a "new lead" alert to the on-call mobile
  sendSms(p.phone, "Hi " + first + ", thanks for joining the waiting list for Kirkcaldy Dental & Implant Clinic, " +
    "the new NHS dental practice opening soon on Tolbooth Street, Kirkcaldy. We'll be in touch shortly.");
  var oncall = PropertiesService.getScriptProperties().getProperty("ONCALL_MOBILE");
  if (oncall) sendSms(oncall, "\uD83E\uDDB7 NEW LEAD (" + src + ") \u2013 call now: " + String(p.name).trim() + " " + String(p.phone || ""));
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
  if (NOTIFY) {
    MailApp.sendEmail(NOTIFY, "New sign-up (" + (p.source || "website") + "): " + first,
      "A new person joined the waiting list on the website. See the Waiting List sheet.");
  }
  return out("ok");
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

// UK numbers to international format for ClickSend (07… → +447…)
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
  if (!user || !key || !to) return;
  try {
    UrlFetchApp.fetch("https://rest.clicksend.com/v3/sms/send", {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: "Basic " + Utilities.base64Encode(user + ":" + key) },
      payload: JSON.stringify({ messages: [{ source: "apps-script", from: SMS_FROM, to: ukMobile(to), body: body }] }),
      muteHttpExceptions: true
    });
  } catch (err) { console.error("SMS failed: " + err); }
}

function out(s) { return ContentService.createTextOutput(s); }
