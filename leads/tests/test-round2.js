// Round-2 fixes (review of 8 Nov): the leaflet's 2-argument healthAlert, direct alert texts, separate caps, reopen/flap rules,
// H8 vs a stopped lead checker, setup step 0 (headers), backups shared, H18 trigger count, H11 window, H14a recovery,
// crash carry-over, KPI alarm bodies, token scrubbing, H20 override. Run: node leads/tests/test-round2.js
"use strict";
const { mkEnv, test, run, assert, OWNER_SMS, CALLER_SMS } = require("./harness");

const BODY = { what: "Thing broke.", affects: "Leads.", todo: "Fix it.", plan: "R3" };
const owner = env => env.mails.filter(m => m.to === "owner@personal.test");
const subj = env => owner(env).map(m => m.subject);
const has = (list, re) => list.some(s => re.test(s));
const fields = (name, phone, email) => ({ full_name: name, phone_number: phone, email: email || "", post_code: "KY1 1AA" });
const ELEVEN = ["Signup Time", "Name", "Phone", "Email", "Postcode", "No. of People", "Currently Registered?", "Adult/Child/Family", "Source", "Status", "Notes"];

// ---------------- the leaflet's sendSms -> healthAlert("P1", message) ----------------
test("leaflet sendSms, bad caller number (landline): one H3 P1 per recipient with a real subject and text (no blank '[KD-P1] ')", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z", props: { ONCALL_MOBILE: "01592 123456" } });
  env.fn.sendSms("01592 123456", "NEW LEAD (facebook) - call now: Ann 07700900111");
  env.fn.sendSms("01592 123456", "NEW LEAD (facebook) - call now: Bob 07700900112");   // same run: handled once
  assert.deepStrictEqual(env.mails.map(m => m.subject), ["[KD-P1] Setting wrong: ONCALL_MOBILE", "[KD-P1] Setting wrong: ONCALL_MOBILE"]);
  assert.ok(/ONCALL_MOBILE has 1 entry that isn't a UK mobile/.test(env.mails[0].body));
  assert.deepStrictEqual(env.ownerSms().map(s => s.body), ["KD P1: setting wrong - ONCALL_MOBILE is blank/invalid, so the caller gets no lead alerts. Fix in Script Properties. Plan R5"]);
  assert.ok(!Object.keys(env.props).some(k => /^HA_A caller/.test(k)), "no key made from the message");
  env.checkOwnerSms();
});
test("leaflet sendSms with ClickSend keys missing: one P1 per recipient, no text attempted (healthchecks /fail instead), no loop", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z", props: { CLICKSEND_USER: "", HEALTH_PING_DAILY: "https://hc-ping.com/daily" } });
  env.fn.sendSms("07700900111", "Hi Ann, thanks");
  env.fn.sendSms("07700900112", "Hi Bob, thanks");
  assert.deepStrictEqual(subj(env), ["[KD-P1] Setting wrong: CLICKSEND_USER"]);
  assert.strictEqual(env.sms.length, 0);
  assert.ok(!env.fetches.some(u => /sms\/send/.test(u)), "no ClickSend call without keys");
  assert.deepStrictEqual(env.pings, ["https://hc-ping.com/daily/fail"]);
});
test("healthAlert(level, message) for anything else: key made from the message, subject = the message; never throws", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  env.fn.healthAlert("P1", "Something odd happened in the leaflet script");
  assert.deepStrictEqual(subj(env), ["[KD-P1] Something odd happened in the leaflet script"]);
  assert.ok(env.state("MSG_SOMETHING_ODD_HAPPENED_IN_THE_LEAFLET_SC").lastEmail, "key: MSG_ + the message, 40 characters");
  const done = env.get("HEALTH_MSG_DONE"); Object.keys(done).forEach(k => delete done[k]);   // a new run (Apps Script resets globals)
  env.advance(30); env.fn.healthAlert("P1", "Something odd happened in the leaflet script");
  assert.strictEqual(owner(env).length, 1, "a one-off: emailed at most every 3 h, never left open");
  assert.ok(/WHAT HAPPENED\nSomething odd happened in the leaflet script\./.test(owner(env)[0].body));
  const env2 = mkEnv({ props: { HEALTH_EMAIL: "", OWNER_EMAIL: "" } });
  env2.fn.healthAlert("P1", "Nobody to tell");          // called from inside sendSms: must not break lead processing
});

// ---------------- alert texts: direct to ClickSend, own caps ----------------
test("owner P1 text goes out even when the leaflet's hourly text cap is used up; logged in the SMS log as 'health'", () => {
  const env = mkEnv({ now: "2026-11-10 11:00" });
  env.props.SMS_COUNT_HOUR = "2026111011:40";
  const r = env.fn.healthAlert("P1", "X", "Something critical", BODY);
  assert.deepStrictEqual(r, { emailed: true, texted: true });
  assert.strictEqual(env.props.SMS_COUNT_HOUR, "2026111011:40", "the leaflet's lead-text counter is untouched");
  const last = env.smsLog.rows[env.smsLog.rows.length - 1];
  assert.strictEqual(last[1], "health"); assert.strictEqual(last[4], "SUCCESS");
});
test("a P1 text ClickSend refused isn't counted: tried again after 10 min (not 60), and lastSms is set only once it goes", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  let fail = true; env.smsResult = () => (fail ? "INSUFFICIENT_CREDIT" : "SUCCESS");
  assert.strictEqual(env.fn.healthAlert("P1", "K", "Problem", BODY).texted, false);
  assert.strictEqual(env.props.HEALTH_SMS_COUNT, undefined, "refused texts don't count toward HEALTH_SMS_MAX");
  env.advance(5); env.fn.healthAlert("P1", "K", "Problem", BODY);
  assert.strictEqual(env.sms.length, 1, "not retried within 10 min");
  fail = false; env.advance(6); assert.strictEqual(env.fn.healthAlert("P1", "K", "Problem", BODY).texted, true);
  assert.strictEqual(env.props.HEALTH_SMS_COUNT, "2026-11-10|1");
});
test("caller reminders have their own daily cap (HEALTH_CALLER_COUNT): 20 reminders, the owner's texts still go", () => {
  const env = mkEnv({ now: "2026-11-10T08:00:00Z", props: { HEALTH_CALLER_MAX: "20", ONCALL_MOBILE: "07700900001,07700900002" } });
  for (let i = 0; i < 12; i++) { env.fn.healthAlert("P2", "C", "Backlog", BODY, { caller: "KD: ring them" }); env.advance(61); }
  assert.strictEqual(env.sms.filter(s => s.to !== OWNER_SMS).length, 20, "caller cap");
  assert.strictEqual(env.props.HEALTH_CALLER_COUNT, "2026-11-10|20");
  assert.strictEqual(env.fn.healthAlert("P1", "H1_POLLER", "Facebook lead checker stopped", BODY).texted, true);
});

// ---------------- reopen after RESOLVED; flapping ----------------
test("flapping: reopen after RESOLVED is emailed at once; after 2 RESOLVED emails in 6 h the next RESOLVED waits for an hour of passing", () => {
  const env = mkEnv({ now: "2026-11-10T10:00:00Z" });
  const fire = () => env.fn.healthAlert("P1", "F", "Flappy", BODY);
  fire(); env.advance(2); env.fn.healthResolve("F");                    // P1, RESOLVED
  env.advance(2); fire(); env.advance(2); env.fn.healthResolve("F");    // reopened at once: P1, RESOLVED
  env.advance(2); fire(); env.advance(2);
  assert.strictEqual(env.fn.healthResolve("F"), false, "3rd time: not resolved yet");
  env.advance(2); fire(); env.advance(5); env.fn.healthResolve("F");    // failing again: the hour starts over; no email
  assert.deepStrictEqual(subj(env), ["[KD-P1] Flappy", "[KD-OK] RESOLVED: Flappy", "[KD-P1] Flappy", "[KD-OK] RESOLVED: Flappy", "[KD-P1] Flappy"]);
  for (let m = 0; m < 55; m += 5) { env.advance(5); env.fn.healthResolve("F"); }
  assert.strictEqual(subj(env).length, 5, "still within the hour");
  env.advance(5); env.fn.healthResolve("F");
  assert.deepStrictEqual(subj(env).slice(-1), ["[KD-OK] RESOLVED: Flappy"], "RESOLVED once it has passed for an hour");
  assert.ok(env.healthLog().some(r => /keeps coming back/.test(r[4])));
});

// ---------------- H8 and the lead checker ----------------
test("H8 with the lead checker stopped: leads it will still read are left to it; older ones and 'seen but row gone' are reported", () => {
  const env = mkEnv({ now: "2026-11-10T15:00:00Z" });
  const now = Math.floor(env.clock.now / 1000);
  env.props.META_SINCE_BY_FORM = JSON.stringify({ F1: now - 3600 });                       // progress: 14:00
  env.props.META_SEEN = JSON.stringify(["S1"]);
  env.fn.healthMark("pollMetaLeads", false, 100, "sheet: header problem");
  env.meta.forms.F1.leads = [env.lead("W1", 30, fields("Will Wait", "+447900000701")),      // 14:30: the checker will read it
    env.lead("OLD", 120, fields("Too Old", "+447900000702")),                                // 13:00: before its window (13:45)
    env.lead("S1", 50, fields("Seen Gone", "+447900000703"))];                               // handled, but no row
  assert.strictEqual(env.fn.healthMetaReconcile({}), 2);
  const fl = env.tab("Failed leads"), h = fl.rows[0];
  assert.deepStrictEqual(fl.rows.slice(1).map(r => r[1]).sort(), ["OLD", "S1"]);
  assert.ok(/^Probably/.test(fl.rows.slice(1).find(r => r[1] === "S1")[h.indexOf("Already texted?")]));
});
test("the lead checker never adds a lead the owner was told to add by hand (it's in Failed leads)", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  env.fn.healthFailedLead(env.lead("HAND1", 30, fields("By Hand", "+447900000801")), "Not in the Waiting list (H8)", false);
  env.meta.forms.F1.leads = [env.lead("HAND1", 30, fields("By Hand", "+447900000801")), env.lead("NEW1", 2, fields("New One", "+447900000802"))];
  env.fn.pollMetaLeads();
  assert.deepStrictEqual(env.dataRows().map(r => r[env.H("Lead ID")]), ["NEW1"]);
  assert.ok(!env.sms.some(s => s.to === "+447900000801"), "not texted");
  assert.ok(JSON.parse(env.props.META_SEEN).indexOf("HAND1") !== -1);
});

// ---------------- handleLead: nobody contacted twice ----------------
test("the lead's text throws after the caller alert went: next run writes the row only (one caller alert, no double text)", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  const P = env.globals.PropertiesService.getScriptProperties(), orig = P.setProperty;
  let boom = 1;
  P.setProperty = (k, v) => { if (k === "SMS_COUNT_HOUR" && env.callerSms().length === 1 && boom-- > 0) throw new Error("Service error: Properties"); return orig(k, v); };
  env.meta.forms.F1.leads = [env.lead("T1", 1, fields("Tex Ter", "+447900000901", "t@example.com"))];
  env.fn.pollMetaLeads(); env.advance(1); env.fn.pollMetaLeads();
  assert.strictEqual(env.callerSms().filter(s => /NEW LEAD/.test(s.body)).length, 1);
  assert.ok(env.sms.filter(s => s.to === "+447900000901").length <= 1);
  assert.strictEqual(env.dataRows().length, 1);
  assert.strictEqual(env.rowObj(2)["Assigned to"], "07700900001");
});
test("row write keeps failing after the texts: 'Failed leads' says the lead WAS texted", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  env.wl.onAppend = () => { throw new Error("Service Spreadsheets timed out"); };
  env.meta.forms.F1.leads = [env.lead("T2", 1, fields("Al Ways", "+447900000902", "a@example.com"))];
  for (let i = 0; i < 3; i++) { env.fn.pollMetaLeads(); env.advance(1); }
  const fl = env.tab("Failed leads"), h = fl.rows[0];
  assert.ok(/^Yes - already texted/.test(fl.rows[1][h.indexOf("Already texted?")]));
  assert.strictEqual(env.sms.filter(s => s.to === "+447900000902").length, 1);
});
test("an email error inside the confirmation step is written to Email status; the texts aren't repeated", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  env.globals.MailApp.getRemainingDailyQuota = () => { throw new Error("Exception: Service error: Mail"); };
  env.meta.forms.F1.leads = [env.lead("T3", 1, fields("Em Ail", "+447900000903", "e@example.com"))];
  env.fn.pollMetaLeads();
  assert.ok(/^Failed: .*Service error: Mail/.test(env.rowObj(2)["Email status"]), env.rowObj(2)["Email status"]);
  assert.strictEqual(env.rowObj(2)["SMS status"], "Sent");
});

// ---------------- doPost failure -> one P1 at once (no "[KD-P2] P1: ..." copy) ----------------
test("failed website sign-up: one P1 straight away from doPost (no P2 'P1:' duplicate); H15 doesn't repeat it", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  env.fn.healthSheetCheck();
  env.wl.rows[0][env.H("Status")] = "Status x";
  assert.strictEqual(env.fn.doPost({ parameter: { name: "Web Person", email: "w@x.test", phone: "07700900222", source: "leaflet" } }).getContent(), "error");
  const s = subj(env);
  assert.ok(has(s, /^\[KD-P1\] A website sign-up failed to save at 11:00$/), s.join("|"));
  assert.ok(!has(s, /P1:/), "no '[KD-P2] P1: ...' email");
  env.wl.rows[0][env.H("Status x")] = "Status";
  const n = owner(env).length; env.advance(5); env.fn.healthJobsCheck({});
  assert.strictEqual(owner(env).filter(m => /website sign-up/.test(m.subject)).length, 1);
  assert.ok(owner(env).length >= n);
  const fs = env.tab("Failed sign-ups");
  assert.strictEqual(fs.rows[0][8], "Alerted at", "column added to the leaflet's tab"); assert.ok(fs.rows[1][8] instanceof Date);
});
test("healthNotifyOnce: a leaflet subject 'P1: ...' becomes a [KD-P1] alert without the prefix; others stay P2", () => {
  const env = mkEnv();
  env.fn.healthNotifyOnce("SOME_KEY", "⚠️ P1: something odd", "Body text.");
  assert.strictEqual(owner(env)[0].subject, "[KD-P1] Something odd");
  assert.ok(/WHAT TO DO\nSee WHAT HAPPENED above/.test(owner(env)[0].body));
  env.fn.healthNotifyOnce("OTHER_KEY", "⚠️ Texts are failing (ClickSend)", "Body text.");
  assert.strictEqual(owner(env).slice(-1)[0].subject, "[KD-P2] Texts are failing (ClickSend)");
});

// ---------------- setup step 0: the 22 headers ----------------
test("setup step 0: 11-column sheet -> 'missing 12 columns' P1 (not 'header row changed'); healthAddMissingHeaders fixes it", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z", headers: ELEVEN });
  assert.strictEqual(env.fn.healthCheckHeaders(), false);
  assert.throws(() => env.fn.healthInstallTriggers(), /row 1 of the Waiting list isn't ready.*Missing: Assigned to/);
  env.meta.forms.F1.leads = [env.lead("L1", 2, fields("Ann Test", "+447700900111", "a@x.test"))];
  env.fn.pollMetaLeads();
  assert.deepStrictEqual(subj(env), ["[KD-P1] Waiting list is missing 12 columns the scripts need (Assigned to, Marketing consent, Lead ID, ...): lead scripts stopped"]);
  assert.ok(/healthAddMissingHeaders/.test(owner(env)[0].body));
  let inserted = 0; env.wl.getMaxColumns = () => 15; env.wl.insertColumnsAfter = (after, n) => { inserted = n; };   // a 15-column grid
  assert.strictEqual(env.fn.healthAddMissingHeaders(), 12);
  assert.strictEqual(inserted, 8, "columns added to the grid first (11 + 12 = 23 > 15)");
  assert.deepStrictEqual(env.wl.rows[0].slice(0, 11), ELEVEN, "nothing moved");
  assert.strictEqual(env.fn.healthCheckHeaders(), true);
  env.advance(1); env.fn.pollMetaLeads();
  assert.strictEqual(env.dataRows().length, 1, "collected once row 1 is complete");
  assert.strictEqual(env.rowObj(2)["Lead ID"], "L1");
  assert.strictEqual(env.fn.healthInstallTriggers(), 4);
});
test("healthAddMissingHeaders refuses an almost-right header ('Lead ID ' with a space) and the alert names the typo", () => {
  const env = mkEnv();
  env.wl.rows[0][env.H("Lead ID")] = "Lead ID ";
  assert.throws(() => env.fn.healthAddMissingHeaders(), /Retype exactly: "Lead ID " should be "Lead ID"/);
  assert.throws(() => env.fn.healthAssertSheet());
  assert.ok(/Looks like a typo: "Lead ID " should be "Lead ID"/.test(owner(env)[0].body));
  assert.ok(has(subj(env), /header row changed \(Lead ID missing\)/));
});

// ---------------- H21 sharing, H18 trigger count ----------------
test("H21: the backups folder is shared (view) once with the owner's personal address; a refusal shows in the daily email", () => {
  let env = mkEnv({ now: "2026-11-10T23:30:00Z" });
  env.fn.healthBackup({}); env.setNow("2026-11-11T23:30:00Z"); env.fn.healthBackup({});
  assert.deepStrictEqual(env.drive.folders[env.props.HEALTH_BACKUP_FOLDER].viewers, ["owner@personal.test"]);
  env = mkEnv({ now: "2026-11-10T23:30:00Z" }); env.shareFail = true; env.fn.healthBackup({});
  assert.strictEqual(env.props.HEALTH_BACKUP_SHARED, undefined);
  env.setNow("2026-11-11T07:30:00Z"); env.fn.healthSelfTest({});
  assert.ok(/KD backups folder isn't shared with your personal Google account/.test(owner(env).find(m => /Daily check/.test(m.subject)).body));
});
test("H18 before launch day: 14 triggers is the full set (the 3 ad triggers are listed as not set up yet, not as a problem)", () => {
  const env = mkEnv({ now: "2026-11-10T07:30:00Z", props: { HEALTH_CS_BALANCE: "40" } });
  env.addTriggers(["pollMetaLeads", "morningSummary", "backlogCheck", "eveningReport", "trkOnSheetEdit", "trkRetryCheck", "trkPullSmsHistory",
    "trkScanBounces", "trkDailySnapshot", "trkWeeklyEmail", "healthEvery5Min", "healthHourly", "healthDaily", "healthNightly"]);
  env.props.HEALTH_BACKUP_LAST = String(env.clock.now - 8 * 3600e3);
  env.fn.healthSelfTest({});
  const m = owner(env)[0];
  assert.ok(/^\[KD\] Daily check 07:30: all OK \(14 triggers/.test(m.subject), m.subject);
  assert.ok(/the 3 ad triggers \(run adsInstallTriggers on launch day/.test(m.body));
  env.props.META_AD_ACCOUNT_ID = "act_1"; env.mails.length = 0; env.fn.healthSelfTest({});
  assert.ok(/triggers 14 of 17 \(missing adsPullInsights, adsWeeklyPull, adsStatusCheck\)/.test(owner(env)[0].body), "once the ads are set up, 17 expected");
});

// ---------------- H11 window, H3 settings ----------------
test("H11: the 'no Facebook leads' window starts at launch / when the campaigns came on, not at midnight", () => {
  const env = mkEnv({ now: "2026-11-10T14:00:00Z" });
  Object.assign(env.props, { ADS_ACTIVE_CAMPAIGNS: JSON.stringify({ t: env.clock.now - 600000, n: 1 }), ADS_TODAY_SPEND: "2026-11-10|9.4", ADS_DAILY_BUDGET: "20",
    ADS_ACTIVE_SINCE: String(env.at("2026-11-10 10:00").getTime()) });
  env.fn.healthNoMetaLeads({}); assert.strictEqual(env.mails.length, 0, "4 h since the campaign came on (N = 5 h)");
  env.setNow("2026-11-10T16:00:00Z"); env.fn.healthNoMetaLeads({});
  assert.ok(has(subj(env), /No Facebook leads for 6h while the ads spent/), subj(env).join("|"));
});
test("H3: an OWNER_MOBILE that isn't a UK mobile is reported; a blank HEALTH_SMS is not an alert (listed in the daily email)", () => {
  let env = mkEnv({ props: { OWNER_MOBILE: "01592 000000" } }); env.fn.healthConfigCheck({});
  assert.ok(has(subj(env), /Setting wrong: OWNER_MOBILE/));
  env = mkEnv({ props: { HEALTH_SMS: "" } });
  assert.deepStrictEqual(env.fn.healthConfigCheck({}), []);
});

// ---------------- H14a lead texts: open until a text goes through ----------------
test("H14a lead texts: still failing an hour later with no new leads -> stays open (no RESOLVED); a later success resolves it", () => {
  const env = mkEnv({ now: "2026-11-10T12:00:00Z" });
  [5, 10, 15].forEach(m => env.smsLogRow(m, "lead text", "INSUFFICIENT_CREDIT"));
  env.fn.healthSmsCheck({});
  assert.ok(env.state("H14_LEAD_FAIL").open);
  env.advance(90); env.fn.healthSmsCheck({});
  assert.ok(env.state("H14_LEAD_FAIL").open, "no evidence ClickSend works again");
  assert.ok(!has(subj(env), /RESOLVED/));
  env.smsLogRow(0, "lead text", "SUCCESS"); env.advance(5); env.fn.healthSmsCheck({});
  assert.ok(has(subj(env), /RESOLVED: 3 of 3 lead texts failed/));
});

// ---------------- crash carry-over ----------------
test("a crashed check is RESOLVED only after it ran again cleanly", () => {
  const env = mkEnv({ now: "2026-11-10 21:10" });
  env.callLog.rows.push([env.minsAgo(30), "L1", 2, 1, "No answer", "No answer", "", "", 20, "19-21", "Tue", ""]);
  const gr = env.callLog.getRange.bind(env.callLog);
  env.callLog.getRange = () => { throw new Error("Service Spreadsheets failed"); };
  env.fn.healthHourly();
  env.callLog.getRange = gr;
  env.setNow("2026-11-11 20:10"); env.fn.healthHourly();
  assert.ok(!has(subj(env), /RESOLVED: A health check crashed/));
  env.setNow("2026-11-11 21:10"); env.fn.healthHourly();
  assert.ok(has(subj(env), /RESOLVED: A health check crashed: H22/));
});

// ---------------- meta-ads.gs KPI alarms ----------------
test("adsKpiAlarms: owner thresholds (warning over GBP5, pause over GBP8); plain-English body with the sheet link once", () => {
  const mk = (spend, leads) => {
    const env = mkEnv({ now: "2026-11-10T07:00:00Z", props: { META_AD_ACCOUNT_ID: "act_1", LAUNCH_DATE: "2026-11-01" } });
    const ads = env.tab("Ads") || env.ss.addTab("Ads", [env.get("ADS_HEADERS").slice()]);
    for (let d = 1; d <= 3; d++) {
      const r = env.get("ADS_HEADERS").map(() => ""); r[0] = env.at("2026-11-" + String(10 - d).padStart(2, "0")); r[7] = spend / 3;
      ads.rows.push(r);
      for (let i = 0; i < leads / 3; i++) env.row({ "Signup Time": env.at("2026-11-" + String(10 - d).padStart(2, "0") + " 12:00"), Name: "P", "Lead ID": "M" + d + i, "Organic?": "No", Source: "facebook" });
    }
    env.fn.adsKpiAlarms();
    return env;
  };
  let env = mk(36, 9);                                   // GBP4 per lead: fine
  assert.ok(!has(subj(env), /Cost per lead|PAUSE/), subj(env).join("|"));
  env = mk(54, 9);                                       // GBP6
  const m = owner(env).find(x => /Cost per lead is high: £6\.00/.test(x.subject));
  assert.ok(m, subj(env).join("|"));
  assert.strictEqual(m.body.split("docs.google.com").length - 1, 1, "sheet link once");
  assert.ok(/WHAT IT AFFECTS\nEach sign-up costs more than planned/.test(m.body));
  env = mk(81, 9);                                       // GBP9
  assert.ok(has(subj(env), /PAUSE the ads: cost per lead over £8 \(£9\.00\)/), subj(env).join("|"));
});

// ---------------- secrets ----------------
test("the Meta token never reaches the heartbeat (H15 email) when the lead fetch has a network error", () => {
  const env = mkEnv({ props: { META_PAGE_TOKEN: "EAAGsecretTOKEN1234567890" } });
  const f = env.globals.UrlFetchApp.fetch;
  env.globals.UrlFetchApp.fetch = (u, o) => { if (/\/leads\?/.test(u)) throw new Error("Exception: Address unavailable: " + u); return f(u, o); };
  assert.throws(() => env.fn.pollMetaLeads(), e => !/EAAGsecret/.test(String(e)));
  assert.ok(/^other: Error: Exception: Address unavailable/.test(JSON.parse(env.props.HM_pollMetaLeads).err) && !/EAAGsecret/.test(env.props.HM_pollMetaLeads));
  assert.ok(env.fn.healthScrub("x?a=1&access_token=EAAGsecretTOKEN&b=2") === "x?a=1&access_token=***&b=2");
});

// ---------------- H20 after the owner's override ----------------
test("H20 after the owner switched texts back on: 20 more real sign-ups don't re-pause; a much bigger burst (31+) does", () => {
  const env = mkEnv({ now: "2026-11-10 18:00" });
  let n = 0; const add = (k, mins) => { for (let i = 0; i < k; i++) env.row({ "Signup Time": env.minsAgo(mins), Name: "R" + n, "Lead ID": "W-x" + (n++), Source: "leaflet" }); };
  add(20, 30); env.fn.healthSpamCheck({});
  assert.strictEqual(env.props.WEB_SMS_PAUSED, "1");
  delete env.props.WEB_SMS_PAUSED; env.advance(5); env.fn.healthSpamCheck({});
  assert.ok(env.props.HEALTH_SPAM_OVERRIDE && !env.props.WEB_SMS_PAUSED);
  assert.ok(has(subj(env), /RESOLVED: 20 website sign-ups/));
  env.advance(5); add(20, 1); env.fn.healthSpamCheck({});
  assert.ok(!env.props.WEB_SMS_PAUSED, "the owner's decision holds");
  env.advance(5); add(12, 1); env.fn.healthSpamCheck({});
  assert.strictEqual(env.props.WEB_SMS_PAUSED, "1", "32 new sign-ups within the hour after the override");
});

if (require.main === module) run();
module.exports = {};
