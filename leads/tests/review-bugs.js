// Adversarial review tests (bug hunter). Each test asserts the CORRECT behaviour, so it FAILS while the bug is present.
// Run: node leads/tests/review-bugs.js
"use strict";
const { mkEnv, test, run, assert, OWNER_SMS, CALLER_SMS } = require("./harness");

const BODY = { what: "Thing broke.", affects: "Leads.", todo: "Fix it.", plan: "R3" };
const ownerMails = env => env.mails.filter(m => m.to === "owner@personal.test");
const fields = (name, phone, email) => ({ full_name: name, phone_number: phone, email: email || "", post_code: "KY1 1AA" });

// ---------------------------------------------------------------------------------------------------------------
// R1. The leaflet's sendSms calls healthAlert("P1", "<message>") with TWO arguments (plan 3.5: "missing keys or a bad
// alert number -> healthAlert P1"). health.gs treats arg 2 as the key and leaves the subject blank.
// ---------------------------------------------------------------------------------------------------------------
test("R1a fire drill 4 (ONCALL_MOBILE=0770): leaflet's 2-arg healthAlert gives an email with a blank subject and a text 'KD P1:'", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z", props: { ONCALL_MOBILE: "0770" } });
  env.fn.sendSms("0770", "NEW LEAD (facebook) - call now: Al Smith +447900000003");
  const p1 = ownerMails(env).filter(m => /^\[KD-P1\]/.test(m.subject));
  console.log("        owner P1 subjects:", JSON.stringify(p1.map(m => m.subject)), " owner texts:", JSON.stringify(env.ownerSms().map(s => s.body)));
  assert.ok(p1.length >= 1);
  p1.forEach(m => assert.ok(m.subject.replace("[KD-P1]", "").trim().length > 0, "P1 email has a blank subject: '" + m.subject + "'"));
  env.ownerSms().forEach(s => assert.ok(s.body.replace(/^KD P1:?/, "").trim().length > 0, "owner text has no content: '" + s.body + "'"));
});

test("R1b CLICKSEND keys missing: one sendSms -> the same P1 is emailed TWICE (healthAlert -> healthSendSms -> sendSms -> healthAlert)", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z", props: { CLICKSEND_KEY: "" } });
  env.fn.sendSms("+447900000001", "Hi Al, thanks");
  const p1 = ownerMails(env).filter(m => /^\[KD-P1\]/.test(m.subject));
  console.log("        P1 emails to owner@personal.test for ONE event:", p1.length);
  assert.strictEqual(p1.length, 1, "one event -> one P1 email per recipient");
});

// ---------------------------------------------------------------------------------------------------------------
// R2. The 15/day health-text cap (HEALTH_SMS_COUNT) is shared by owner P1 texts AND caller nudges (opts.caller).
// ---------------------------------------------------------------------------------------------------------------
test("R2 caller nudges (H5, 2 callers, hourly) use up HEALTH_SMS_MAX: a later P1 (lead checker stopped) is never texted to the owner", () => {
  const env = mkEnv({ now: "2026-11-10 09:00", props: { ONCALL_MOBILE: "07700900001,07700900002" } });
  for (let i = 0; i < 12; i++) env.row({ "Signup Time": env.minsAgo(180 + i), Name: "Lead " + i, Phone: "'0790000" + String(1000 + i), Status: "", "Lead ID": "L" + i });
  for (let h = 0; h < 7; h++) { env.fn.healthBacklogCheck(); env.advance(61); }   // 09:00 .. 15:06, one H5 run an hour
  const callerTexts = env.sms.filter(s => s.to !== OWNER_SMS).length;
  console.log("        caller nudges sent:", callerTexts, " owner texts:", env.ownerSms().length, " HEALTH_SMS_COUNT:", env.props.HEALTH_SMS_COUNT);
  env.fn.healthAlert("P1", "H1_POLLER", "Facebook lead checker stopped (last good run 15:00)", BODY, { sms: "KD P1: Facebook lead checker stopped at 15:00." });
  const last = env.ownerSms().pop();
  assert.ok(last && /lead checker stopped/.test(last.body), "the critical 'lead checker stopped' text never reached the owner (daily cap used by caller nudges)");
});

// ---------------------------------------------------------------------------------------------------------------
// R3. H20: the owner follows the alert's own instructions ("delete WEB_SMS_PAUSED ... to switch texts back on") for a
// real burst (leaflet drop); 5 minutes later H20 pauses the texts again, and keeps doing so while the hour count is high.
// ---------------------------------------------------------------------------------------------------------------
test("R3 H20 re-pauses website texts 5 min after the owner switched them back on (real leaflet-drop burst)", () => {
  const env = mkEnv({ now: "2026-11-10 18:00" });
  for (let i = 0; i < 20; i++) env.row({ "Signup Time": env.minsAgo(55 - i * 2), Name: "Real Person " + i, "Lead ID": "W-26111018" + i, Source: "leaflet" });
  env.fn.healthSpamCheck();
  assert.strictEqual(env.props.WEB_SMS_PAUSED, "1", "paused by H20 (expected)");
  delete env.props.WEB_SMS_PAUSED; delete env.props.WEB_SMS_PAUSED_UNTIL;   // owner: "they're real - switch texts back on"
  env.advance(5);
  env.row({ "Signup Time": env.minsAgo(0), Name: "Another real person", "Lead ID": "W-2611101805x", Source: "leaflet" });
  env.fn.healthSpamCheck();
  console.log("        WEB_SMS_PAUSED after the owner deleted it:", env.props.WEB_SMS_PAUSED, " until:", env.props.WEB_SMS_PAUSED_UNTIL);
  assert.ok(!env.props.WEB_SMS_PAUSED, "H20 overrode the owner's decision and paused website texts again");
});

// ---------------------------------------------------------------------------------------------------------------
// R4. Router: a problem that comes back soon after its RESOLVED email gets no email (P1: within 10 min of the last
// email -> silent until the 3 h reminder; P2: silent for 3 h). The owner's last word is "RESOLVED".
// ---------------------------------------------------------------------------------------------------------------
test("R4a P1 resolved then broken again 8 min later: no new email for ~3 hours (last email the owner saw says RESOLVED)", () => {
  const env = mkEnv({ now: "2026-11-10T10:00:00Z" });
  env.fn.healthAlert("P1", "H1_POLLER", "Facebook lead checker stopped", BODY);
  env.advance(4); env.fn.healthResolve("H1_POLLER");
  const before = ownerMails(env).length;   // P1 + RESOLVED
  env.advance(4);
  let firstNew = null;
  for (let t = 0; t < 170 && firstNew === null; t += 5) { env.fn.healthAlert("P1", "H1_POLLER", "Facebook lead checker stopped", BODY); if (ownerMails(env).length > before) firstNew = t; env.advance(5); }
  console.log("        minutes until the re-opened P1 was emailed:", firstNew === null ? ">170" : firstNew);
  assert.ok(firstNew !== null && firstNew <= 10, "re-opened P1 after a RESOLVED email was not emailed for " + (firstNew === null ? ">170" : firstNew) + " min");
});

test("R4b P2 resolved then broken again 30 min later: no email for the new episode for 3 h", () => {
  const env = mkEnv({ now: "2026-11-10T10:00:00Z" });
  env.fn.healthAlert("P2", "H14_NO_TEXT", "1 Facebook lead got no thank-you text", BODY);
  env.advance(15); env.fn.healthResolve("H14_NO_TEXT");
  env.advance(30);
  const before = ownerMails(env).length;
  env.fn.healthAlert("P2", "H14_NO_TEXT", "2 Facebook leads got no thank-you text", BODY, { sig: "5,9" });
  assert.ok(ownerMails(env).length > before, "new P2 episode right after RESOLVED was not emailed");
});

// ---------------------------------------------------------------------------------------------------------------
// R5. H14a "caller alert not sent" only looks at the last 15 min, so it RESOLVES (RESOLVED email) while ClickSend is
// still failing, and re-opens with every new lead: P1 + RESOLVED email ping-pong.
// ---------------------------------------------------------------------------------------------------------------
test("R5 ClickSend failing all afternoon, a lead every 30 min: H14a sends P1 + 'RESOLVED' emails in a loop", () => {
  const env = mkEnv({ now: "2026-11-10T12:00:00Z" });
  for (let m = 0; m <= 180; m += 5) {
    if (m % 30 === 0) env.smsLogRow(0, "caller alert", "INSUFFICIENT_CREDIT");
    env.fn.healthSmsCheck({});
    env.advance(5);
  }
  const p1 = ownerMails(env).filter(x => /^\[KD-P1\] Caller alert not sent/.test(x.subject)).length;
  const ok = ownerMails(env).filter(x => /^\[KD-OK\] RESOLVED: Caller alert not sent/.test(x.subject)).length;
  console.log("        in 3 h while ClickSend never recovered: P1 emails", p1, ", RESOLVED emails", ok);
  assert.strictEqual(ok, 0, "RESOLVED email sent while ClickSend was still failing");
  assert.ok(p1 <= 2, "P1 email storm: " + p1 + " P1 emails in 3 h for one ongoing problem");
});

// ---------------------------------------------------------------------------------------------------------------
// R6. healthAlertFailedRows marks rows "Alerted at" even when nothing was delivered (no email, no text).
// ---------------------------------------------------------------------------------------------------------------
test("R6 Failed lead while the email allowance is used up and a text went 30 min ago: row marked 'Alerted at', never re-alerted", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  env.fn.healthFailedLead(env.lead("901", 20, fields("First Fail", "+447900000901")), "test", false);
  env.fn.healthAlertFailedRows();                                     // 11:00 - emailed + texted (fine)
  env.advance(30);
  env.mailFail = () => true;                                         // spam burst used the daily allowance
  env.fn.healthFailedLead(env.lead("902", 20, fields("Second Fail", "+447900000902")), "test", false);
  const sms0 = env.ownerSms().length;
  env.fn.healthAlertFailedRows();                                     // 11:30 - email fails, text not due (60 min rule)
  const tab = env.tab("Failed leads"), ac = tab.rows[0].indexOf("Alerted at");
  console.log("        2nd failed lead: owner texts +" + (env.ownerSms().length - sms0) + ", 'Alerted at' =", tab.rows[2][ac] ? "set" : "blank");
  env.mailFail = null; env.advance(65);
  const mails0 = ownerMails(env).length;
  env.fn.healthAlertFailedRows();                                     // 12:35 - mail works again
  assert.ok(ownerMails(env).length > mails0 || env.ownerSms().length > sms0, "the 2nd failed lead was never alerted (marked as alerted although nothing went out)");
});

// ---------------------------------------------------------------------------------------------------------------
// R7. "Failed sign-ups" (made by the leaflet's doPost, no "Alerted at" column): H15 tracks rows by INDEX
// (HEALTH_SEEN_WEB = row count). After the owner deletes the handled rows, new failures are never alerted.
// ---------------------------------------------------------------------------------------------------------------
test("R7 'Failed sign-ups': owner deletes the 2 handled rows, then a new sign-up fails -> no P1, ever", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  const fs = env.ss.addTab("Failed sign-ups", [["Time", "Error", "Name", "Phone", "Email", "Postcode", "Source", "All fields"]]);
  fs.rows.push([env.minsAgo(30), "Error: x", "A One", "07900000011", "a@x.test", "KY1", "leaflet", "{}"]);
  fs.rows.push([env.minsAgo(20), "Error: x", "B Two", "07900000012", "b@x.test", "KY1", "leaflet", "{}"]);
  env.fn.healthAlertFailedRows();
  assert.strictEqual(ownerMails(env).filter(m => /website sign-up/.test(m.subject)).length, 1, "first two alerted (expected)");
  fs.rows.splice(1);                                                  // owner: added them by hand, deleted the rows
  env.advance(60);
  fs.rows.push([env.minsAgo(0), "Error: y", "C Three", "07900000013", "c@x.test", "KY2", "banner", "{}"]);
  for (let i = 0; i < 4; i++) { env.fn.healthAlertFailedRows(); env.advance(5); }
  const n = ownerMails(env).filter(m => /website sign-up/.test(m.subject)).length;
  console.log("        website-sign-up P1 emails after the new failure:", n - 1, " HEALTH_SEEN_WEB =", env.props.HEALTH_SEEN_WEB);
  assert.ok(n >= 2, "new failed website sign-up never alerted");
});

// ---------------------------------------------------------------------------------------------------------------
// R8. pollMetaLeads retry: only a failed ROW write keeps the prepared row (err.metaValues). Any exception thrown after
// the caller alert / thank-you text were sent makes the retry contact everyone again.
// ---------------------------------------------------------------------------------------------------------------
test("R8 transient exception after the texts (MailApp quota read) -> next run texts the lead and alerts the caller AGAIN", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  let thrown = 0;
  const orig = env.globals.MailApp.getRemainingDailyQuota;
  env.globals.MailApp.getRemainingDailyQuota = () => { if (!thrown++) throw new Error("Exception: Service error: Mail"); return orig(); };
  env.meta.forms.F1.leads = [env.lead("777", 1, fields("Al Smith", "+447900000777", "al@example.com"))];
  env.fn.pollMetaLeads(); env.advance(1); env.fn.pollMetaLeads();
  const leadTexts = env.sms.filter(s => s.to === "+447900000777").length, callerAlerts = env.callerSms().filter(s => /NEW LEAD/.test(s.body)).length;
  console.log("        thank-you texts to the lead:", leadTexts, " caller alerts:", callerAlerts, " rows:", env.dataRows().length);
  assert.strictEqual(leadTexts, 1, "lead texted " + leadTexts + " times");
  assert.strictEqual(callerAlerts, 1, "caller alerted " + callerAlerts + " times for one lead");
});

test("R8b same, failing every time: lead texted 3x, then 'Failed leads' says 'No - not texted yet'", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  env.globals.MailApp.getRemainingDailyQuota = () => { throw new Error("Exception: Service error: Mail"); };
  env.meta.forms.F1.leads = [env.lead("778", 1, fields("Bo Jones", "+447900000778", "bo@example.com"))];
  for (let i = 0; i < 3; i++) { env.fn.pollMetaLeads(); env.advance(1); }
  const fl = env.tab("Failed leads"), r = fl && fl.rows[1], c = fl ? fl.rows[0].indexOf("Already texted?") : -1;
  const n = env.sms.filter(s => s.to === "+447900000778").length;
  console.log("        lead texted", n, "times; Failed leads 'Already texted?':", r && r[c]);
  assert.ok(!(n > 0 && /^No/.test(r && r[c])), "Failed leads tells the owner the lead was NOT texted, but it was texted " + n + " times");
});

// ---------------------------------------------------------------------------------------------------------------
// R9. healthBacklogCheck P2 <-> P1 flapping: every P2->P1 step counts as "escalated" and bypasses all email throttles.
// ---------------------------------------------------------------------------------------------------------------
test("R9 H5 waiting count hovering 9/10 for 3 hours: a P1 email on every flip", () => {
  const env = mkEnv({ now: "2026-11-10 11:00" });
  for (let i = 0; i < 10; i++) env.row({ "Signup Time": env.minsAgo(70 + i), Name: "L" + i, Status: "", "Lead ID": "ID" + i });
  const toggleRow = env.wl.rows.length, sc = env.H("Status"), tc = env.H("Signup Time");
  for (let k = 0; k < 12; k++) {                                      // every 15 min the 10th lead is called / a new one waits
    for (let r = 2; r <= toggleRow; r++) env.wl.rows[r - 1][tc] = env.minsAgo(70 + r);   // callers keep the oldest under 2 h
    env.wl.rows[toggleRow - 1][sc] = k % 2 ? "Called" : "";
    env.fn.healthBacklogCheck(); env.advance(15);
  }
  const p1 = ownerMails(env).filter(m => /^\[KD-P1\]/.test(m.subject)).length;
  console.log("        P1 emails in 3 h for one backlog:", p1);
  assert.ok(p1 <= 2, p1 + " P1 emails in 3 h (expected 1 + at most one 3-hour reminder)");
});

// ---------------------------------------------------------------------------------------------------------------
// R10. H4: a caller typing in any cell right of the table makes row 1 "longer" (extra "" header): spurious P2 email.
// ---------------------------------------------------------------------------------------------------------------
test("R10 H4_ROW1: text typed in a cell to the right of the table -> P2 'Waiting list header row changed ()'", () => {
  const env = mkEnv();
  env.fn.healthSheetCheck();
  env.row({ "Signup Time": env.minsAgo(5), Name: "X" });
  env.wl.rows[1][40] = "rang twice";                                  // a note typed in column AO of row 2
  env.fn.healthSheetCheck();
  const p2 = ownerMails(env).filter(m => /header row changed/.test(m.subject));
  console.log("        P2 subjects:", JSON.stringify(p2.map(m => m.subject)));
  assert.strictEqual(p2.length, 0, "row 1 did not change, but a 'header row changed' P2 was emailed");
});

// ---------------------------------------------------------------------------------------------------------------
// R11. Owner P1 texts go through the leaflet's sendSms caps (40/h). During a spam burst H20's own P1 text is
// swallowed, and healthAlert records lastSms anyway, so it isn't retried for 60 min (even after the cap resets).
// ---------------------------------------------------------------------------------------------------------------
test("R11 spam burst hits the 40/h text cap: H20's P1 text is never sent, and not retried when the cap resets", () => {
  const env = mkEnv({ now: "2026-11-10 10:50" });
  for (let i = 0; i < 41; i++) env.smsLogRow(i, "lead text", "SUCCESS");
  env.props.SMS_COUNT_HOUR = "2026111010:40";                         // leaflet cap for this clock hour already used
  env.fn.healthSpamCheck({});
  env.setNow("2026-11-10 11:05");                                    // new clock hour: cap reset
  for (let i = 0; i < 41; i++) env.smsLogRow(i, "lead text", "SUCCESS");
  env.fn.healthSpamCheck({});
  console.log("        owner texts about the spam burst by 11:05:", env.ownerSms().length, " emails:", ownerMails(env).filter(m => /KD-P1/.test(m.subject)).length);
  assert.ok(env.ownerSms().length >= 1, "P1 spam alert was never texted (cap) and not retried after the cap reset");
});

// ---------------------------------------------------------------------------------------------------------------
// R12. HEALTH_CRASH_<job>: a crash in an hour-specific check (H22 at 21:00) is "RESOLVED" by the next run, in which
// that check isn't even scheduled.
// ---------------------------------------------------------------------------------------------------------------
test("R12 H22 crashes at 21:xx; the 22:xx run (no H22) sends 'RESOLVED: A health check crashed'", () => {
  const env = mkEnv({ now: "2026-11-10 21:10" });
  env.callLog.rows.push([env.minsAgo(30), "L1", 2, 1, "No answer", "No answer", "", "", 20, "19-21", "Tue", ""]);
  env.callLog.getRange = () => { throw new Error("Service Spreadsheets failed while accessing document"); };
  env.fn.healthHourly();
  assert.ok(ownerMails(env).some(m => /crashed: H22/.test(m.subject)), "crash reported (expected)");
  env.setNow("2026-11-10 22:10");
  env.fn.healthHourly();
  const res = ownerMails(env).filter(m => /RESOLVED: A health check crashed/.test(m.subject));
  console.log("        RESOLVED emails while H22 is still broken:", res.length);
  assert.strictEqual(res.length, 0, "crash 'resolved' by a run that didn't run the crashing check");
});

// ---------------------------------------------------------------------------------------------------------------
// R13. H5 counts "waiting over 1h" from the CALL_HOURS start (08:00) but the caller starts at CALLER_SHIFT (09:00):
// at the first minute of the shift, 10 overnight leads = P1 "10 leads waiting over 1h, oldest 0m" + "add a caller".
// ---------------------------------------------------------------------------------------------------------------
test("R13 CALLER_SHIFT 9-17: at 09:05 ten overnight 'Call 8am' leads -> P1 'waiting over 1h, oldest 0m' before the caller could start", () => {
  const env = mkEnv({ now: "2026-11-10 09:05", props: { CALLER_SHIFT: "9-17" } });
  for (let i = 0; i < 10; i++) env.row({ "Signup Time": env.at("2026-11-09 23:00"), Name: "N" + i, Status: "Call 8am", "Lead ID": "N" + i });
  env.fn.healthBacklogCheck();
  const p1 = ownerMails(env).filter(m => /^\[KD-P1\]/.test(m.subject));
  console.log("        ", JSON.stringify(p1.map(m => m.subject)), "owner text:", JSON.stringify(env.ownerSms().map(s => s.body)));
  assert.strictEqual(p1.length, 0, "P1 'add a caller' 5 minutes into the shift");
});

// ---------------------------------------------------------------------------------------------------------------
// R14. DST: healthShiftMins steps whole days of 24 h from the start time; across the spring change a start near
// midnight skips a whole day (oldest / idle shift minutes too low -> H5/H6 P1 missed).
// ---------------------------------------------------------------------------------------------------------------
test("R14 healthShiftMins Sat 27 Mar 2027 23:30 -> Mon 29 Mar 10:00 (shift 9-17 every day) = 540 min (Sun 480 + Mon 60)", () => {
  const env = mkEnv({ now: "2027-03-29 10:00", props: { CALLER_SHIFT: "9-17" } });
  const v = env.fn.healthShiftMins(env.at("2027-03-27 23:30"), env.at("2027-03-29 10:00"));
  console.log("        healthShiftMins =", v);
  assert.strictEqual(v, 540);
});

// ---------------------------------------------------------------------------------------------------------------
// R15. A new form with no leads yet: its start time is never saved, so metaFormStart calls Meta EVERY minute.
// ---------------------------------------------------------------------------------------------------------------
test("R15 new form (no leads yet): metaFormStart Graph call on every poll (1,440 extra Meta calls a day)", () => {
  const env = mkEnv({ props: { META_FORM_IDS: "F1,F2" } });
  env.meta.forms.F2 = { id: "F2", name: "Waitlist v2", status: "ACTIVE", created_time: "2026-11-09T10:00:00+0000", leads: [], leads_count: 0 };
  for (let i = 0; i < 5; i++) { env.fn.pollMetaLeads(); env.advance(1); }
  const n = env.fetches.filter(u => /\/F2\?fields=created_time/.test(u)).length;
  console.log("        created_time lookups for F2 in 5 polls:", n, " META_SINCE_BY_FORM:", env.props.META_SINCE_BY_FORM);
  assert.ok(n <= 1, n + " lookups in 5 minutes");
});


// ---------------------------------------------------------------------------------------------------------------
// R16. H21 writes text values into a NEW spreadsheet with setValues and no plain-text format. Google Sheets parses
// such strings like typed input: "07700900123" -> 7700900123, a 16-digit Lead ID -> a number kept to 15 significant
// digits. (Simulated below for the backup spreadsheet only.) Next night every 16-digit Meta Lead ID looks "missing".
// ---------------------------------------------------------------------------------------------------------------
function sheetsCoercion(env) {
  const R = env.wl.getRange(1, 1).constructor.prototype, orig = R.setValues;
  R.setValues = function (vals) {
    if (!this.sh.coerce) return orig.call(this, vals);
    return orig.call(this, vals.map(row => row.map(v => (typeof v === "string" && /^[+-]?\d+(\.\d+)?$/.test(v.trim()) ? Number(Number(v).toPrecision(15)) : v))));
  };
  const create = env.globals.SpreadsheetApp.create;
  env.globals.SpreadsheetApp.create = name => {
    const bk = create(name), ins = bk.insertSheet.bind(bk);
    bk.insertSheet = (n, i) => { const sh = ins(n, i); sh.coerce = true; return sh; };
    return bk;
  };
}
test("R16 H21 backup: no rows deleted, but the 2nd night raises P1 'rows vanished' (Lead IDs/phones turned into numbers in the copy)", () => {
  const env = mkEnv({ now: "2026-11-10 23:30" });
  sheetsCoercion(env);
  ["1234567890123456", "2384728347283472", "1048475936282717"].forEach((id, i) =>
    env.row({ "Signup Time": env.minsAgo(600 + i), Name: "P" + i, Phone: "'0790000000" + i, "Lead ID": "'" + id, Source: "facebook" }));
  env.row({ "Signup Time": env.minsAgo(500), Name: "W", Phone: "'07900000009", "Lead ID": "'W-261110120000-abc", Source: "leaflet" });
  env.fn.healthBackup({});
  const bk1 = Object.values(env.drive.files).find(f => /^KD backup/.test(f.name)).ss.getSheetByName("Waiting list");
  console.log("        backup copy row 2: Phone =", JSON.stringify(bk1.rows[1][env.H("Phone")]), " Lead ID =", JSON.stringify(bk1.rows[1][env.H("Lead ID")]));
  env.setNow("2026-11-11 23:30");
  const r = env.fn.healthBackup({});
  console.log("        night 2: missing =", r.missing, " P1 subjects:", JSON.stringify(ownerMails(env).filter(m => /KD-P1/.test(m.subject)).map(m => m.subject)));
  assert.strictEqual(r.missing, 0, "false 'rows vanished' P1: nothing was deleted");
});

// ---------------------------------------------------------------------------------------------------------------
// R17. healthHourly / healthNightly don't run the H4 header guard. A typo in the "Lead ID" header (e.g. a trailing
// space) makes H8 copy EVERY lead of the last 26 h into "Failed leads" and send a P1 "not in the Waiting list".
// ---------------------------------------------------------------------------------------------------------------
test("R17 'Lead ID' header typo: H8 reports every lead as missing (P1, Failed leads filled with people who ARE in the sheet)", () => {
  const env = mkEnv({ now: "2026-11-10 11:10" });
  const L = [env.lead("5001", 120, fields("Ann Lee", "+447900005001")), env.lead("5002", 60, fields("Ben Roe", "+447900005002"))];
  env.meta.forms.F1.leads = L;
  L.forEach(l => env.row({ "Signup Time": new Date(l.created_time), Name: l.field_data[0].values[0], "Lead ID": "'" + l.id, "Form ID": "'F1", Source: "facebook" }));
  env.wl.rows[0][env.H("Lead ID")] = "Lead ID ";                     // someone typed a space after the header
  env.fn.healthHourly();
  const fl = env.tab("Failed leads");
  const p1 = ownerMails(env).filter(m => /Facebook leads? (is|are) not in the Waiting list/.test(m.subject));
  console.log("        Failed leads rows:", fl ? fl.rows.length - 1 : 0, " P1:", JSON.stringify(p1.map(m => m.subject)), " SMS:", JSON.stringify(env.ownerSms().map(s => s.body)));
  assert.ok(!fl || fl.rows.length === 1, "people who are in the sheet were copied to 'Failed leads' and the owner told to add them by hand");
});
test("R17b same header typo at 23:30: H21 says every Meta row 'vanished' (P1)", () => {
  const env = mkEnv({ now: "2026-11-10 23:30" });
  for (let i = 0; i < 3; i++) env.row({ "Signup Time": env.minsAgo(600 + i), Name: "P" + i, "Lead ID": "'60" + i, Source: "facebook" });
  env.fn.healthBackup({});
  env.wl.rows[0][env.H("Lead ID")] = "Lead id";
  env.setNow("2026-11-11 23:30");
  const r = env.fn.healthBackup({});
  console.log("        night 2 after header typo: missing =", r.missing);
  assert.strictEqual(r.missing, 0, "rows reported vanished because of a header typo");
});

// ---------------------------------------------------------------------------------------------------------------
// R18. H6 "no calls logged yet today" fires as soon as ANY lead is queued (b.queue >= 1), even one that arrived a minute
// ago. Quiet morning, first lead at 14:00 -> P1 text "Is the caller OK?" 5 minutes later.
// ---------------------------------------------------------------------------------------------------------------
test("R18 quiet day, first lead of the day at 14:00: H6 P1 'no calls logged yet today' 5 min later", () => {
  const env = mkEnv({ now: "2026-11-10 14:05" });
  env.row({ "Signup Time": env.at("2026-11-09 15:00"), Name: "Old", Status: "Booked", "Status changed at": env.at("2026-11-09 16:00"), "Lead ID": "O1" });
  env.row({ "Signup Time": env.minsAgo(5), Name: "New Lead", Status: "", "Lead ID": "N1" });
  env.fn.healthCallerActive();
  console.log("        P1:", JSON.stringify(ownerMails(env).filter(m => /KD-P1/.test(m.subject)).map(m => m.subject)), " owner texts:", JSON.stringify(env.ownerSms().map(s => s.body)));
  assert.strictEqual(env.ownerSms().length, 0, "owner texted 'Is the caller OK?' about a 5-minute-old lead");
});

// ---------------------------------------------------------------------------------------------------------------
// R19. healthResendFailedTexts (R4 step 5) re-sends the thank-you text ("our team will call you to confirm your
// details") to rows that were already Called / Booked / Unreachable since the text failed.
// ---------------------------------------------------------------------------------------------------------------
test("R19 healthResendFailedTexts texts a lead who has already been called and booked", () => {
  const env = mkEnv({ now: "2026-11-10 15:00" });
  env.row({ "Signup Time": env.minsAgo(300), Name: "Sam Booked", Phone: "'07900000444", Status: "Booked", "SMS status": "Failed: INSUFFICIENT_CREDIT", "Lead ID": "B1" });
  env.fn.healthResendFailedTexts();
  const t = env.sms.filter(x => x.to === "+447900000444");
  console.log("        texts to the booked lead:", JSON.stringify(t.map(x => x.body)));
  assert.strictEqual(t.length, 0, "booked lead got 'our team will call you to confirm your details'");
});

// ---------------------------------------------------------------------------------------------------------------
// R20. Apps Script UrlFetchApp network exceptions contain the request URL ("Address unavailable: https://..."), and the
// Graph URLs carry ?access_token=. healthFinish emails String(err).slice(0, 300) (HEALTH_CRASH) and H18 emails
// healthGraph's msg (200 chars): part of the Meta token ends up in plain email.
// ---------------------------------------------------------------------------------------------------------------
test("R20 a network error in adsStatusCheck (H12) emails part of the Meta access token in the 'health check crashed' P2", () => {
  const env = mkEnv({ now: "2026-11-10 12:10", props: { META_AD_ACCOUNT_ID: "act_123", META_PAGE_TOKEN: "EAAGsecretTOKENabcdefghijklmnopqrstuvwxyz0123456789" } });
  const f = env.globals.UrlFetchApp.fetch;
  env.globals.UrlFetchApp.fetch = (u, o) => { if (/graph\.facebook\.com\/v[\d.]+\/act_/.test(u)) throw new Error("Exception: Address unavailable: " + u); return f(u, o); };
  env.fn.healthHourly();
  const leak = env.mails.filter(m => /EAAGsecret/.test(m.subject + m.body));
  console.log("        emails containing the token:", leak.length, leak.length ? JSON.stringify(leak[0].subject) : "");
  if (leak.length) console.log("        excerpt:", JSON.stringify((leak[0].body.match(/.{0,40}access_token=.{0,20}/) || [""])[0]));
  assert.strictEqual(leak.length, 0, "Meta access token emailed");
});
test("R20b same for H18's Graph /me check (daily email body)", () => {
  const env = mkEnv({ now: "2026-11-10 07:30", props: { META_PAGE_TOKEN: "EAAGsecretTOKENabcdefghijklmnopqrstuvwxyz0123456789" } });
  const f = env.globals.UrlFetchApp.fetch;
  env.globals.UrlFetchApp.fetch = (u, o) => { if (/graph\.facebook\.com\/v[\d.]+\/me\?/.test(u)) throw new Error("Exception: Address unavailable: " + u); return f(u, o); };
  env.fn.healthSelfTest({});
  const leak = env.mails.filter(m => /EAAGsecret/.test(m.subject + m.body));
  assert.strictEqual(leak.length, 0, "Meta access token emailed in the daily check");
});

test("R4c H4: header broken (P1), fixed (RESOLVED), broken again 3 min later -> poller stopped, no email for ~3 h, no text for ~1 h", () => {
  const env = mkEnv({ now: "2026-11-10 10:00" });
  const sc = env.H("Status");
  env.wl.rows[0][sc] = "Status x"; env.fn.healthSheetCheck();
  env.advance(5); env.wl.rows[0][sc] = "Status"; env.fn.healthSheetCheck();
  const mails0 = ownerMails(env).length, sms0 = env.ownerSms().length;
  env.advance(3); env.wl.rows[0][sc] = "Status x";
  let firstMail = null, firstSms = null;
  for (let m = 0; m < 150; m++) {                                    // poller every minute, H4 every 5 min
    env.fn.pollMetaLeads(); if (m % 5 === 0) env.fn.healthSheetCheck();
    if (firstMail === null && ownerMails(env).length > mails0) firstMail = m;
    if (firstSms === null && env.ownerSms().length > sms0) firstSms = m;
    env.advance(1);
  }
  console.log("        after the RESOLVED email: first new email after", firstMail, "min, first text after", firstSms, "min (poller stopped all that time)");
  assert.ok(firstMail !== null && firstMail <= 10, "no email for " + firstMail + " min after the header broke again");
});

test("R17c 'Status' renamed for 40 min (poller stopped by H4): H8 puts the waiting lead in 'Failed leads'; when fixed the poller ALSO adds and texts it", () => {
  const env = mkEnv({ now: "2026-11-10 10:00" });
  env.wl.rows[0][env.H("Status")] = "Status x";
  env.meta.forms.F1.leads = [env.lead("8801", -5, fields("Cat Diaz", "+447900008801"))];   // created 10:05
  for (let m = 0; m < 30; m++) { env.fn.pollMetaLeads(); env.advance(1); }               // stopped by healthAssertSheet
  env.fn.healthMetaReconcile();                                                           // H8 at 10:30
  const fl = env.tab("Failed leads");
  env.wl.rows[0][env.H("Status x")] = "Status"; env.advance(10); env.fn.pollMetaLeads();  // fixed at 10:40
  const inWl = env.dataRows().some(r => String(r[env.H("Lead ID")]) === "8801");
  console.log("        in 'Failed leads':", !!(fl && fl.rows.length > 1), " in Waiting list after fix:", inWl, " texted:", env.sms.some(x => x.to === "+447900008801"));
  assert.ok(!(fl && fl.rows.length > 1 && inWl), "the same lead is in 'Failed leads' (owner told to add by hand and call first) AND processed by the poller");
});

if (require.main === module) run();
module.exports = {};
