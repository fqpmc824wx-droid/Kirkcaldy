/**
 * Kirkcaldy Dental – website "Register your interest" form → Interest List sheet.
 *
 * Install: open the Interest List Google Sheet → Extensions → Apps Script,
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
var NOTIFY = "info@kirkcaldydentist.co.uk"; // gets a short "new sign-up" note; "" to turn off

function doPost(e) {
  var p = (e && e.parameter) || {};
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
  if (SEND_EMAIL) {
    MailApp.sendEmail({
      to: p.email,
      name: "Kirkcaldy Dental & Implant Clinic",
      replyTo: "info@kirkcaldydentist.co.uk",
      subject: "Thanks for registering your interest – Kirkcaldy Dental & Implant Clinic",
      body: "Hi " + first + ",\n\n" +
        "Thank you for registering your interest in Kirkcaldy Dental & Implant Clinic, a new NHS dental practice opening soon in Kirkcaldy.\n\n" +
        "We'll be in touch with opening dates and practice information as soon as they're confirmed.\n\n" +
        "Any questions? Email info@kirkcaldydentist.co.uk.\n\n" +
        "Kirkcaldy Dental & Implant Clinic\nkirkcaldydentist.co.uk"
    });
  }
  if (NOTIFY) {
    MailApp.sendEmail(NOTIFY, "New sign-up (" + (p.source || "website") + "): " + first,
      "A new person registered interest on the website. See the Interest List sheet.");
  }
  return out("ok");
}

function out(s) { return ContentService.createTextOutput(s); }
