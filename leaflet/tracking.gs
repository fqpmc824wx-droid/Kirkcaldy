/**
 * Kirkcaldy Dental – call tracking, text-message log and daily/weekly numbers (tracking.gs).
 * Same Apps Script project as apps-script.gs (website) and meta-leads.gs (Facebook leads).
 * Spec: research/forecast-metricsPlan.md section C1 (metrics chat). All names start with "trk".
 *
 * Install (once, as info@kirkcaldydental.co.uk):
 *   1. Project Settings → Time zone: Europe/London.
 *   2. Paste this file as a new script file "tracking.gs".
 *   3. Run trkInstallTriggers() once and allow the permissions (Sheets, Gmail read for bounces, external requests).
 *
 * What the callers do: pick a value in "Call outcome" (column Y). The script then counts the attempt,
 * sets Status, the timestamps and "Next call due", adds a line to "Call history" and to the "Call log" tab,
 * and clears Call outcome ready for the next call. Changing Status directly still works too.
 */

var TRK_LOG_TAB = "Call log";
var TRK_SMS_TAB = "SMS log";
var TRK_DAILY_TAB = "Daily log";
var TRK_CALL_LOG_HEADERS = ["Timestamp", "Lead ID", "Sheet row", "Attempt #", "Outcome", "Status set", "Caller",
  "Mins since clock start", "Hour", "Band", "Weekday", "Called from"];
var TRK_SMS_HEADERS = ["Sent at", "Type", "To (last 4)", "Message ID", "Send status", "Price", "Delivery status", "Delivery detail", "Checked at"];
var TRK_DAILY_HEADERS = ["Date", "Sign-ups gross", "Unique", "Meta unique", "Organic", "Attempts today", "Reached today", "Booked today",
  "No answer today", "Waiting >1h", "Oldest mins", "Overdue retries", "Rows needing update", "SMS sent", "SMS failed",
  "Email failed/bounced", "DNC today", "Daily budget", "Spend today", "Caller shift hours"];

// ---------- installer ----------
function trkInstallTriggers() {
  var mine = ["trkOnSheetEdit", "trkRetryCheck", "trkPullSmsHistory", "trkScanBounces", "trkDailySnapshot", "trkWeeklyEmail"];
  ScriptApp.getProjectTriggers().forEach(function (t) { if (mine.indexOf(t.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(t); });
  var ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger("trkOnSheetEdit").forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger("trkRetryCheck").timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger("trkPullSmsHistory").timeBased().atHour(6).nearMinute(15).everyDays(1).inTimezone("Europe/London").create();
  ScriptApp.newTrigger("trkScanBounces").timeBased().atHour(6).nearMinute(45).everyDays(1).inTimezone("Europe/London").create();
  ScriptApp.newTrigger("trkDailySnapshot").timeBased().atHour(21).nearMinute(10).everyDays(1).inTimezone("Europe/London").create();
  ScriptApp.newTrigger("trkWeeklyEmail").timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).nearMinute(30).inTimezone("Europe/London").create();
  trkTab(TRK_LOG_TAB, TRK_CALL_LOG_HEADERS); trkTab(TRK_SMS_TAB, TRK_SMS_HEADERS); trkTab(TRK_DAILY_TAB, TRK_DAILY_HEADERS);
}

// ---------- small helpers ----------
function trkTab(name, headers) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) { sh.appendRow(headers); sh.setFrozenRows(1); sh.getRange(1, 1, 1, headers.length).setFontWeight("bold"); }
  return sh;
}
function trkKey(v) { var d = String(v || "").replace(/\D/g, ""); return d.length >= 10 ? d.slice(-10) : d; }
function trkFmt(d, f) { return Utilities.formatDate(d, "Europe/London", f); }
function trkHour(d) { return Number(trkFmt(d, "H")); }
function trkMinsOfDay(d) { return trkHour(d) * 60 + Number(trkFmt(d, "m")); }
// London wall-clock time h:mm on the day `addDays` after d
function trkAt(d, addDays, h, m) {
  var day = new Date(d.getTime() + addDays * 864e5 + 12 * 36e5 - trkMinsOfDay(d) * 6e4);   // noon of that day, safely inside it
  return new Date(trkFmt(day, "yyyy-MM-dd'T'") + ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":00" + trkFmt(day, "XXX"));
}
function trkWindow() {
  var v = String(PropertiesService.getScriptProperties().getProperty("CALL_HOURS") || "8-21").trim().toLowerCase();
  var m = v.match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
  return m ? { from: Number(m[1]), to: Number(m[2]) } : { from: 0, to: 24 };
}
// When the "call within" clock starts for a sign-up: at once in calling hours, otherwise the next opening time
function trkClockStart(t) {
  var w = trkWindow(), h = trkHour(t);
  if (h >= w.to) return trkAt(t, 1, w.from, 0);
  if (h < w.from) return trkAt(t, 0, w.from, 0);
  return t;
}
function trkBand(h) { return h < 10 ? "08-10" : h < 12 ? "10-12" : h < 14 ? "12-14" : h < 17 ? "14-17" : h < 19 ? "17-19" : "19-21"; }

function trkNewLeadId() {
  return "W-" + trkFmt(new Date(), "yyMMddHHmmss") + "-" + Math.random().toString(36).slice(2, 5);
}
// Earliest Waiting list row with the same phone (last 10 digits) or email → {row, leadId, status}, or null
function trkFindDuplicate(phone, email) {
  var key = trkKey(phone), mail = String(email || "").trim().toLowerCase();
  if (key.length < 10 && !mail) return null;
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String);
  var pc = h.indexOf("Phone"), ec = h.indexOf("Email"), sc = h.indexOf("Status"), ic = h.indexOf("Lead ID");
  for (var i = 1; i < data.length; i++) {
    if ((key.length >= 10 && pc !== -1 && trkKey(data[i][pc]) === key) ||
        (mail && ec !== -1 && String(data[i][ec]).trim().toLowerCase() === mail))
      return { row: i + 1, leadId: ic === -1 ? "" : String(data[i][ic]), status: sc === -1 ? "" : String(data[i][sc]) };
  }
  return null;
}

// ---------- call tracking (installable onEdit) ----------
var TRK_OUTCOME_STATUS = {
  "No answer": "No answer", "Voicemail": "No answer", "Busy/declined": "No answer",
  "Reached - booked": "Booked", "Reached - call back": "Called", "Reached - on list": "Called",
  "Reached - not interested": "Not interested", "Already has dentist": "Not interested",
  "Wrong number": "Wrong number", "Withdrew": "Withdrew", "DO NOT CONTACT": "DO NOT CONTACT"
};
var TRK_ATTEMPT_STATUSES = ["Called", "No answer", "Booked", "Not interested", "Wrong number"];

function trkOnSheetEdit(e) {
  if (!e || !e.range) return;
  var sh = e.range.getSheet();
  if (sh.getName() !== LEADS_TAB) return;
  var lastCol = sh.getLastColumn(), h = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  var C = {}; h.forEach(function (name, i) { C[name] = i; });
  if (C["Call outcome"] === undefined || C["Status"] === undefined) return;
  var c0 = e.range.getColumn() - 1, c1 = c0 + e.range.getNumColumns() - 1;
  var hitOutcome = C["Call outcome"] >= c0 && C["Call outcome"] <= c1, hitStatus = C["Status"] >= c0 && C["Status"] <= c1;
  if (!hitOutcome && !hitStatus) return;
  var r0 = Math.max(2, e.range.getRow()), r1 = e.range.getRow() + e.range.getNumRows() - 1;
  if (r1 < r0) return;
  var single = e.range.getNumRows() === 1 && e.range.getNumColumns() === 1;
  if (single && hitStatus && e.oldValue !== undefined && String(e.oldValue) === String(e.value)) return;

  var lock = LockService.getDocumentLock();
  var locked = lock.tryLock(15000);
  try {
    var rows = sh.getRange(r0, 1, r1 - r0 + 1, lastCol).getValues();
    var caller = "";
    try { caller = e.user && e.user.getEmail ? e.user.getEmail() : ""; } catch (x) {}
    var now = new Date(), logRows = [];
    rows.forEach(function (row, k) {
      var r = r0 + k, before = row.slice();
      var outcome = hitOutcome ? String(row[C["Call outcome"]] || "").trim() : "";
      var res = null;
      if (outcome) res = trkApplyOutcome(row, C, outcome, now);
      else if (hitStatus) res = trkApplyStatus(row, C, String(row[C["Status"]] || "").trim(), now);
      if (!res) return;
      var who = caller || String(row[C["Assigned to"]] || "").replace(/^'/, "");
      if (C["Called by"] !== undefined && res.attempt) row[C["Called by"]] = who;
      if (C["Call history"] !== undefined) {
        var line = trkFmt(now, "dd/MM HH:mm") + (res.attempt ? " #" + res.n : "") + " " + res.label + (who ? " (" + who + ")" : "");
        row[C["Call history"]] = (row[C["Call history"]] ? row[C["Call history"]] + "\n" : "") + line;
      }
      if (res.attempt) {
        var t = row[C["Signup Time"]], start = t instanceof Date ? trkClockStart(t) : null;
        logRows.push([now, String(row[C["Lead ID"]] || ""), r, res.n, res.label, row[C["Status"]], who,
          start ? Math.max(0, Math.round((now - start) / 6e4)) : "", trkHour(now), trkBand(trkHour(now)), trkFmt(now, "EEE"), ""]);
      }
      // write back only the cells that changed
      row.forEach(function (v, c) {
        var a = before[c], same = (a instanceof Date && v instanceof Date) ? a.getTime() === v.getTime() : a === v;
        if (!same) sh.getRange(r, c + 1).setValue(v);
      });
    });
    if (logRows.length) {
      var log = trkTab(TRK_LOG_TAB, TRK_CALL_LOG_HEADERS);
      log.getRange(log.getLastRow() + 1, 1, logRows.length, logRows[0].length).setValues(logRows);
    }
  } finally {
    if (locked) lock.releaseLock();
  }
}

// Call outcome picked → attempt, Status, timestamps, Next call due; clears the outcome cell
function trkApplyOutcome(row, C, v, now) {
  var status = TRK_OUTCOME_STATUS[v];
  if (!status) return null;                                   // unknown value: leave it for a person to fix
  var n = trkAttempt(row, C, now);
  var noAnswer = status === "No answer";
  var reached = /^Reached/.test(v) || v === "Already has dentist" || v === "Withdrew";
  if (reached) trkSetIfEmpty(row, C, "First reached at", now);
  if (status === "Booked") trkSet(row, C, "Booked at", now);
  if (v === "DO NOT CONTACT") trkSet(row, C, "Notes", (row[C["Notes"]] ? row[C["Notes"]] + " | " : "") + "DNC " + trkFmt(now, "dd/MM") + " – reason?");
  var next = "";
  if (noAnswer) { var nd = trkNextNoAnswer(row, C, n, now); next = nd.next; if (nd.unreachable) status = "Unreachable"; }
  else if (v === "Reached - call back") next = trkAt(now, 1, 10, 0);
  trkSet(row, C, "Next call due", next);
  trkSetStatus(row, C, status, now);
  trkSet(row, C, "Call outcome", "");
  return { attempt: true, n: n, label: v };
}
// Status typed directly (old habit) → counts as an attempt for the call statuses, otherwise just logged
function trkApplyStatus(row, C, v, now) {
  if (TRK_ATTEMPT_STATUSES.indexOf(v) !== -1) {
    var n = trkAttempt(row, C, now), status = v, next = "";
    if (v === "Called" || v === "Booked" || v === "Not interested") trkSetIfEmpty(row, C, "First reached at", now);
    if (v === "Booked") trkSet(row, C, "Booked at", now);
    if (v === "No answer") { var nd = trkNextNoAnswer(row, C, n, now); next = nd.next; if (nd.unreachable) status = "Unreachable"; }
    trkSet(row, C, "Next call due", next);
    trkSetStatus(row, C, status, now);
    return { attempt: true, n: n, label: "Status: " + v };
  }
  trkSet(row, C, "Status changed at", now);
  return { attempt: false, n: 0, label: "Status: " + (v || "(blank)") };
}
function trkAttempt(row, C, now) {
  var n = (Number(row[C["Call attempts"]]) || 0) + 1;
  trkSet(row, C, "Call attempts", n);
  trkSet(row, C, "Last attempt at", now);
  trkSetIfEmpty(row, C, "First call at", now);
  return n;
}
function trkNextNoAnswer(row, C, n, now) {
  var w = trkWindow();
  if (n >= 3) return { next: "", unreachable: true };
  if (n === 1) {
    var t = new Date(now.getTime() + 2 * 36e5);
    var sameDay = trkFmt(t, "yyyyMMdd") === trkFmt(now, "yyyyMMdd");
    return { next: (sameDay && trkHour(t) < w.to && trkHour(t) >= w.from) ? t : trkAt(now, 1, 10, 0), unreachable: false };
  }
  var first = row[C["First call at"]];
  var bothEarly = trkHour(now) < 17 && (!(first instanceof Date) || trkHour(first) < 17);
  return { next: bothEarly ? trkAt(now, 1, 17, 30) : trkAt(now, 1, 10, 0), unreachable: false };
}
function trkSet(row, C, name, v) { if (C[name] !== undefined) row[C[name]] = v; }
function trkSetIfEmpty(row, C, name, v) { if (C[name] !== undefined && row[C[name]] === "") row[C[name]] = v; }
function trkSetStatus(row, C, status, now) {
  trkSet(row, C, "Status changed at", now);
  row[C["Status"]] = status;
}

// ---------- call-back reminder (every 15 min, calling hours) ----------
function trkRetryCheck() {
  var w = trkWindow(), now = new Date(), hr = trkHour(now);
  if (hr < w.from || hr >= w.to) return;
  var n = trkOverdueRetries(now);
  if (n < 3) return;
  var p = PropertiesService.getScriptProperties(), last = Number(p.getProperty("TRK_RETRY_LAST") || 0);
  if (Date.now() - last < 2 * 36e5) return;
  p.setProperty("TRK_RETRY_LAST", String(Date.now()));
  alertTeam(n + " call-backs due now - see the Waiting list (Next call due)", false);
}
function trkOverdueRetries(now) {
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String);
  var sc = h.indexOf("Status"), nc = h.indexOf("Next call due"), n = 0;
  if (sc === -1 || nc === -1) return 0;
  for (var i = 1; i < data.length; i++)
    if (String(data[i][sc]).trim() === "No answer" && data[i][nc] instanceof Date && data[i][nc] <= now) n++;
  return n;
}

// ---------- text messages ----------
// Called from sendSms() (apps-script.gs) after every send. `to` is stored as its last 4 digits only.
function trkLogSms(type, to, result) {
  try {
    var r = result || {};
    trkTab(TRK_SMS_TAB, TRK_SMS_HEADERS).appendRow([new Date(), type, String(to || "").replace(/\D/g, "").slice(-4),
      "'" + String(r.id || ""), r.status || "", r.price || "", "", "", ""]);
  } catch (err) { console.error("trkLogSms failed: " + err); }
}
function trkSmsType(body) {
  var b = String(body || "");
  return /NEW LEAD/.test(b) ? "caller alert" : /^Hi /.test(b) ? "lead text" : /^Good morning/.test(b) ? "morning summary" : "other";
}

// Daily 06:15: delivery results for the last 3 days from ClickSend, plus a low-balance alarm
function trkPullSmsHistory() {
  var p = PropertiesService.getScriptProperties(), user = p.getProperty("CLICKSEND_USER"), key = p.getProperty("CLICKSEND_KEY");
  if (!user || !key) return;
  var auth = { Authorization: "Basic " + Utilities.base64Encode(user + ":" + key) };
  var to = Math.floor(Date.now() / 1000), from = to - 3 * 86400, page = 1, last = 1, byId = {};
  do {
    var res = UrlFetchApp.fetch("https://rest.clicksend.com/v3/sms/history?date_from=" + from + "&date_to=" + to + "&page=" + page + "&limit=100",
      { headers: auth, muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) { healthNotifyOnce("SMS_HISTORY_ERR", "⚠️ Could not read text delivery reports", res.getContentText().slice(0, 500)); return; }
    var d = (JSON.parse(res.getContentText()).data) || {};
    (d.data || []).forEach(function (m) { byId[String(m.message_id)] = m; });
    last = Number(d.last_page || 1); page++;
  } while (page <= last && page <= 50);

  var log = trkTab(TRK_SMS_TAB, TRK_SMS_HEADERS), n = log.getLastRow() - 1, now = new Date();
  if (n >= 1) {
    var vals = log.getRange(2, 1, n, TRK_SMS_HEADERS.length).getValues(), leadStatus = {};
    vals.forEach(function (v, i) {
      var m = byId[String(v[3]).replace(/^'/, "")];
      if (!m) return;
      v[6] = m.status || ""; v[7] = [m.status_code, m.status_text].filter(String).join(" "); v[8] = now;
      if (m.message_price) v[5] = m.message_price;
      if (v[1] === "lead text") leadStatus[String(v[3]).replace(/^'/, "")] = trkDeliveryLabel(m);
    });
    log.getRange(2, 1, n, TRK_SMS_HEADERS.length).setValues(vals);
    // lead texts: copy the result to the Waiting list "SMS status" (matched on SMS ID)
    var sh = leadsSheet(), data = sh.getDataRange().getValues(), h = data[0].map(String);
    var ic = h.indexOf("SMS ID"), sc = h.indexOf("SMS status");
    if (ic !== -1 && sc !== -1) for (var i = 1; i < data.length; i++) {
      var s = leadStatus[String(data[i][ic]).replace(/^'/, "")];
      if (s && s !== data[i][sc]) sh.getRange(i + 1, sc + 1).setValue(s);
    }
  }
  // balance alarm
  var acc = UrlFetchApp.fetch("https://rest.clicksend.com/v3/account", { headers: auth, muteHttpExceptions: true });
  if (acc.getResponseCode() === 200) {
    var bal = Number(((JSON.parse(acc.getContentText()).data) || {}).balance);
    if (!isNaN(bal) && bal < 10) healthNotifyOnce("SMS_BALANCE", "⚠️ ClickSend credit is low (£" + bal.toFixed(2) + ")",
      "Top up ClickSend soon, or texts to new leads will stop.");
  }
}
function trkDeliveryLabel(m) {
  var s = String(m.status || "").toUpperCase();
  if (s === "DELIVERED" || s === "RECEIVED") return "Delivered";
  if (/INVALID|BAD|UNKNOWN_NUMBER/.test(s + " " + String(m.status_text || "").toUpperCase())) return "Failed: invalid";
  if (s === "SENT" || s === "QUEUED" || s === "SUCCESS") return "Sent";
  return "Failed: " + (m.status_text || s || "unknown");
}

// ---------- email bounces (daily 06:45) ----------
function trkScanBounces() {
  var threads = GmailApp.search("from:(mailer-daemon OR postmaster) newer_than:2d"), bounced = {};
  threads.forEach(function (t) {
    t.getMessages().forEach(function (m) {
      var a = "";
      try { a = m.getHeader("X-Failed-Recipients") || ""; } catch (x) {}
      if (!a) { var mm = m.getPlainBody().match(/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i); a = mm ? mm[0] : ""; }
      a.split(",").forEach(function (x) { x = x.trim().toLowerCase(); if (x && x.indexOf("kirkcaldydental.co.uk") === -1) bounced[x] = true; });
    });
  });
  var sh = leadsSheet(), data = sh.getDataRange().getValues(), h = data[0].map(String);
  var ec = h.indexOf("Email"), xc = h.indexOf("Email status");
  if (ec === -1 || xc === -1) return;
  for (var i = 1; i < data.length; i++)
    if (bounced[String(data[i][ec]).trim().toLowerCase()] && data[i][xc] !== "Bounced") sh.getRange(i + 1, xc + 1).setValue("Bounced");
}

// ---------- daily snapshot (21:10) ----------
function trkDailySnapshot() {
  var now = new Date(), today = trkFmt(now, "yyyy-MM-dd");
  var isToday = function (d) { return d instanceof Date && trkFmt(d, "yyyy-MM-dd") === today; };
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String);
  var col = function (n) { return h.indexOf(n); };
  var T = col("Signup Time"), SRC = col("Source"), ORG = col("Organic?"), DUP = col("Duplicate of"), ST = col("Status"),
      ATT = col("Call attempts"), SC = col("Status changed at"), XS = col("Email status"), SMS = col("SMS status"), APPT = col("Appt date");
  var gross = 0, uniq = 0, metaU = 0, organic = 0, dncToday = 0, emailBad = 0, needsUpdate = 0;
  for (var i = 1; i < data.length; i++) {
    var r = data[i], st = ST === -1 ? "" : String(r[ST]).trim();
    if (isToday(r[T])) {
      gross++;
      var unique = DUP === -1 || !String(r[DUP]);
      if (unique) uniq++;
      var meta = /^(facebook|instagram)$/i.test(String(r[SRC])) && (ORG === -1 || r[ORG] !== "Yes");
      if (unique && meta) metaU++;
      if (ORG !== -1 && r[ORG] === "Yes") organic++;
      if (XS !== -1 && /^(Failed|Bounced)/.test(String(r[XS]))) emailBad++;
    }
    if (st === "DO NOT CONTACT" && SC !== -1 && isToday(r[SC])) dncToday++;
    // M48: blank Status after 24h, Booked with no Appt date, or a call status with no attempts
    var age = r[T] instanceof Date ? (now - r[T]) / 36e5 : 0;
    if ((st === "" && age > 24) || (st === "Booked" && APPT !== -1 && !r[APPT]) ||
        (TRK_ATTEMPT_STATUSES.indexOf(st) !== -1 && ATT !== -1 && !(Number(r[ATT]) > 0))) needsUpdate++;
  }
  var attempts = 0, reached = 0, booked = 0, noAns = 0;
  var log = SpreadsheetApp.getActive().getSheetByName(TRK_LOG_TAB);
  if (log && log.getLastRow() > 1) log.getRange(2, 1, log.getLastRow() - 1, 6).getValues().forEach(function (v) {
    if (!isToday(v[0])) return;
    attempts++;
    if (v[5] === "No answer" || v[5] === "Unreachable") noAns++;
    if (/^Reached|Already has dentist|^Status: (Called|Booked|Not interested)/.test(String(v[4]))) reached++;
    if (v[5] === "Booked") booked++;
  });
  var smsSent = 0, smsFailed = 0, sms = SpreadsheetApp.getActive().getSheetByName(TRK_SMS_TAB);
  if (sms && sms.getLastRow() > 1) sms.getRange(2, 1, sms.getLastRow() - 1, 5).getValues().forEach(function (v) {
    if (!isToday(v[0])) return;
    if (v[4] === "SUCCESS") smsSent++; else smsFailed++;
  });
  var backlog = typeof metaBacklog === "function" ? metaBacklog() : { waiting: "", oldestMins: "" };
  var budget = "", spend = "";
  var ads = SpreadsheetApp.getActive().getSheetByName("Ad status");
  if (ads && ads.getLastRow() > 1) {
    var ah = ads.getRange(1, 1, 1, ads.getLastColumn()).getValues()[0].map(String), last = ads.getRange(ads.getLastRow(), 1, 1, ah.length).getValues()[0];
    var bi = ah.indexOf("Daily budget"), si = ah.indexOf("Spend today");
    if (bi !== -1) budget = last[bi]; if (si !== -1) spend = last[si];
  }
  var shift = "", dc = SpreadsheetApp.getActive().getSheetByName("Daily checks");
  if (dc && dc.getLastRow() > 1) {
    var dh = dc.getRange(1, 1, 1, dc.getLastColumn()).getValues()[0].map(String), dv = dc.getRange(2, 1, dc.getLastRow() - 1, dh.length).getValues();
    var di = dh.indexOf("Date"), hi = dh.indexOf("Caller shift hours");
    if (di !== -1 && hi !== -1) dv.forEach(function (v) { if (isToday(v[di])) shift = v[hi]; });
  }
  trkTab(TRK_DAILY_TAB, TRK_DAILY_HEADERS).appendRow([trkAt(now, 0, 0, 0), gross, uniq, metaU, organic, attempts, reached, booked, noAns,
    backlog.waiting, backlog.oldestMins, trkOverdueRetries(now), needsUpdate, smsSent, smsFailed, emailBad, dncToday, budget, spend, shift]);
}

// ---------- weekly email (Mon 07:30) ----------
function trkWeeklyEmail() {
  var ss = SpreadsheetApp.getActive(), wk = ss.getSheetByName("Weekly");
  var to = String(PropertiesService.getScriptProperties().getProperty("OWNER_EMAIL") || "").split(",").map(function (e) { return e.trim(); }).filter(String);
  if (!wk || !to.length) return;
  SpreadsheetApp.flush();
  var v = wk.getDataRange().getDisplayValues();
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
  var html = "<p>Kirkcaldy Dental – weekly numbers (" + esc(v[0] && v[0][1] || "") + ")</p><table cellpadding='4' style='border-collapse:collapse;font-family:Arial;font-size:13px'>" +
    v.map(function (r) { return "<tr>" + r.map(function (c) { return "<td style='border:1px solid #ddd'>" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") +
    "</table><p><a href='" + ss.getUrl() + "'>Open the Waiting List sheet</a></p>";
  to.forEach(function (e) {
    try { MailApp.sendEmail({ to: e, subject: "Kirkcaldy Dental – weekly numbers", htmlBody: html, body: "Open the sheet: " + ss.getUrl() }); }
    catch (err) { console.error("Weekly email failed: " + err); }
  });
}
