// Alert router (plan 3.2), healthNotifyOnce, triggers installer, fire drill.
"use strict";
const { mkEnv, test, run, assert, OWNER_SMS, CALLER_SMS } = require("./harness");

const BODY = { what: "Thing broke.", affects: "Leads.", todo: "Fix it.", plan: "R3" };

test("P1: email to every HEALTH_EMAIL first, then one text to HEALTH_SMS; plain-English layout; Health log row", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  const r = env.fn.healthAlert("P1", "K1", "Facebook lead checker stopped", BODY, { sms: "KD P1: test £3.10 – call 07700 900123 now" });
  assert.deepStrictEqual(r, { emailed: true, texted: true });
  assert.deepStrictEqual(env.mails.map(m => m.to), ["owner@personal.test", "info@kirkcaldydental.co.uk"]);
  const m = env.mails[0];
  assert.strictEqual(m.subject, "[KD-P1] Facebook lead checker stopped");
  ["WHAT HAPPENED\nThing broke.", "WHAT IT AFFECTS\nLeads.", "WHAT TO DO\nFix it.", "runbook R3", "Waiting List sheet: https://docs.google.com/"].forEach(s => assert.ok(m.body.indexOf(s) !== -1, "body has " + s));
  const ev = env.events.filter(e => e[0] === "mail" || e[0] === "sms").map(e => e[0]);
  assert.deepStrictEqual(ev, ["mail", "mail", "sms"], "email before text");
  assert.strictEqual(env.ownerSms().length, 1);
  assert.strictEqual(env.ownerSms()[0].body, "KD P1: test GBP3.10 - call [number] now");
  env.checkOwnerSms();
  const log = env.healthLog();
  assert.strictEqual(log.length, 1);
  assert.deepStrictEqual(log[0].slice(1, 7), ["P1", "K1", "Facebook lead checker stopped", "open", "Yes", "Yes"]);
});

test("P1 repeats: max one text per key per 60 min and 3 a day; email reminder only every 3 h", () => {
  const env = mkEnv({ now: "2026-11-10T09:00:00Z" });
  const fire = () => env.fn.healthAlert("P1", "K", "Problem", BODY);
  fire(); env.advance(5); fire(); env.advance(30); fire();
  assert.strictEqual(env.ownerSms().length, 1); assert.strictEqual(env.mailsTo("owner@personal.test").length, 1);
  env.advance(26); fire();            // 61 min after the first
  assert.strictEqual(env.ownerSms().length, 2); assert.strictEqual(env.mailsTo("owner@personal.test").length, 1);
  env.advance(61); fire(); env.advance(61); fire(); env.advance(61); fire();
  assert.strictEqual(env.ownerSms().length, 3, "no more than 3 texts a day");
  assert.strictEqual(env.mailsTo("owner@personal.test").length, 2, "3-hourly email reminder");
});

test("quiet hours: P1 at 23:00 is emailed but not texted; one text after 07:00 lists it", () => {
  const env = mkEnv({ now: "2026-11-10T23:00:00Z" });
  env.fn.healthAlert("P1", "K", "Night problem", BODY, { short: "night problem" });
  assert.strictEqual(env.mailsTo("owner@personal.test").length, 1);
  assert.strictEqual(env.ownerSms().length, 0);
  assert.strictEqual(env.state("K").smsPending, true);
  env.setNow("2026-11-11T06:55:00Z"); env.fn.healthQuietSummary();
  assert.strictEqual(env.ownerSms().length, 0, "still quiet at 06:55");
  env.setNow("2026-11-11T07:02:00Z"); env.fn.healthQuietSummary(); env.fn.healthQuietSummary();
  assert.strictEqual(env.ownerSms().length, 1);
  assert.strictEqual(env.ownerSms()[0].body, "KD P1: 1 problem from overnight: night problem. Details in email.");
  env.fn.healthAlert("P1", "K", "Night problem", BODY);   // the problem's own repeat right after: no second text within 60 min
  assert.strictEqual(env.ownerSms().length, 1);
});

test("ClickSend is the failure (noSms): no text, healthchecks /fail instead", () => {
  const env = mkEnv({ props: { HEALTH_PING_DAILY: "https://hc-ping.com/daily-uuid" } });
  env.fn.healthAlert("P1", "CS", "ClickSend login failed", BODY, { noSms: true });
  assert.strictEqual(env.ownerSms().length, 0);
  assert.deepStrictEqual(env.pings, ["https://hc-ping.com/daily-uuid/fail"]);
  assert.strictEqual(env.mailsTo("owner@personal.test").length, 1);
});

test("P2: email only, at most once per key every 3 h; P2 -> P1 escalation emails and texts at once", () => {
  const env = mkEnv();
  env.fn.healthAlert("P2", "W", "Warning", BODY); env.advance(60); env.fn.healthAlert("P2", "W", "Warning", BODY);
  assert.strictEqual(env.mailsTo("owner@personal.test").length, 1); assert.strictEqual(env.ownerSms().length, 0);
  assert.ok(env.mails[0].subject.indexOf("[KD-P2] ") === 0);
  env.advance(121); env.fn.healthAlert("P2", "W", "Warning", BODY);
  assert.strictEqual(env.mailsTo("owner@personal.test").length, 2);
  env.advance(5); env.fn.healthAlert("P1", "W", "Now critical", BODY);
  assert.strictEqual(env.mailsTo("owner@personal.test").length, 3); assert.strictEqual(env.ownerSms().length, 1);
});

test("RESOLVED email once when the check passes again (and only if an alert email went out)", () => {
  const env = mkEnv();
  env.fn.healthAlert("P1", "R", "Broken thing", BODY);
  assert.strictEqual(env.fn.healthResolve("R"), true);
  assert.strictEqual(env.fn.healthResolve("R"), false);
  const res = env.mails.filter(m => /RESOLVED/.test(m.subject));
  assert.strictEqual(res.length, 2, "one per recipient");
  assert.strictEqual(res[0].subject, "[KD-OK] RESOLVED: Broken thing");
  assert.ok(env.healthLog().some(r => r[4] === "resolved"));
  env.fn.healthResolve("never-opened");
  assert.strictEqual(env.mails.filter(m => /RESOLVED/.test(m.subject)).length, 2);
});

test("no recipients: throws so Google's trigger-failure email fires (but texts first)", () => {
  const env = mkEnv({ props: { HEALTH_EMAIL: "", OWNER_EMAIL: "" } });
  assert.throws(() => env.fn.healthAlert("P1", "X", "No one to tell", BODY), e => e.healthNoRecipients === true);
  assert.strictEqual(env.ownerSms().length, 1);
});

test("HEALTH_EMAIL blank falls back to OWNER_EMAIL", () => {
  const env = mkEnv({ props: { HEALTH_EMAIL: "" } });
  env.fn.healthAlert("P2", "X", "Fallback", BODY);
  assert.deepStrictEqual(env.mails.map(m => m.to), ["info@kirkcaldydental.co.uk"]);
});

test("daily cap on health texts (HEALTH_SMS_MAX)", () => {
  const env = mkEnv({ props: { HEALTH_SMS_MAX: "2" } });
  ["a", "b", "c"].forEach(k => env.fn.healthAlert("P1", k, "P " + k, BODY));
  assert.strictEqual(env.ownerSms().length, 2);
});

test("healthSmsText: ASCII, one SMS, no phone numbers, no emoji", () => {
  const env = mkEnv();
  const t = env.fn.healthSmsText("KD P1: Zoë 🦷 “quote” — +44 7700 900123 / 07700900123 " + "x".repeat(200));
  assert.ok(t.length <= 160 && /^[\x20-\x7E]+$/.test(t), t);
  assert.ok(t.indexOf("7700") === -1, t);
  assert.ok(t.indexOf("Zoe") !== -1 && t.indexOf("\"quote\"") !== -1);
});

test("healthNotifyOnce (via healthAlert): HEALTH_EMAIL + OWNER_EMAIL, 3-hour rule, logged, never throws", () => {
  const env = mkEnv();
  env.fn.healthNotifyOnce("SMS_ERR_LAST", "⚠️ Texts are failing (ClickSend)", "ClickSend did not send a text.");
  assert.deepStrictEqual(env.mails.map(m => m.to).sort(), ["info@kirkcaldydental.co.uk", "owner@personal.test"]);
  assert.strictEqual(env.mails[0].subject, "[KD-P2] Texts are failing (ClickSend)");
  env.advance(60); env.fn.healthNotifyOnce("SMS_ERR_LAST", "x", "y");
  assert.strictEqual(env.mails.length, 2);
  env.advance(121); env.fn.healthNotifyOnce("SMS_ERR_LAST", "x", "y");
  assert.strictEqual(env.mails.length, 4);
  assert.ok(env.healthLog().some(r => r[2] === "SMS_ERR_LAST" && r[4] === "event"));
  const env2 = mkEnv({ props: { HEALTH_EMAIL: "", OWNER_EMAIL: "" } });
  env2.fn.healthNotifyOnce("K", "s", "b");   // nobody to email: must not throw (it's called from inside sendSms/doPost)
});

test("healthNotifyOnce sends FIRST, records after: a failed send doesn't silence the alert", () => {
  const env = mkEnv();
  let fail = true; env.mailFail = () => fail;
  env.fn.healthNotifyOnce("KEY", "Subject", "Body");
  assert.strictEqual(env.mails.length, 0);
  fail = false; env.advance(5);
  env.fn.healthNotifyOnce("KEY", "Subject", "Body");
  assert.strictEqual(env.mails.length, 2, "sent on the next try, not silenced for 3 h");
});

test("healthNotifyOnce without health.gs: copies HEALTH_EMAIL, sends first, records after", () => {
  const env = mkEnv({ only: ["leaflet/apps-script.gs", "leads/meta-leads.gs"] });
  assert.strictEqual(typeof env.get("healthAlert") === "function", false);
  let fail = true; env.mailFail = () => fail;
  env.fn.healthNotifyOnce("KEY", "Subject", "Body");
  assert.strictEqual(env.props.KEY, undefined, "not recorded when nothing was sent");
  fail = false; env.fn.healthNotifyOnce("KEY", "Subject", "Body");
  assert.deepStrictEqual(env.mails.map(m => m.to).sort(), ["info@kirkcaldydental.co.uk", "owner@personal.test"]);
  env.fn.healthNotifyOnce("KEY", "Subject", "Body");
  assert.strictEqual(env.mails.length, 2, "3-hour rule");
});

test("healthInstallTriggers: 13 + 4 = 17; re-run replaces its own; refuses above 18 without deleting anything", () => {
  const env = mkEnv();
  const thirteen = ["pollMetaLeads", "morningSummary", "backlogCheck", "eveningReport", "adsPullInsights", "adsWeeklyPull", "adsStatusCheck",
    "trkOnSheetEdit", "trkRetryCheck", "trkPullSmsHistory", "trkScanBounces", "trkDailySnapshot", "trkWeeklyEmail"];
  env.addTriggers(thirteen);
  assert.strictEqual(env.fn.healthInstallTriggers(), 17);
  assert.strictEqual(env.fn.healthInstallTriggers(), 17);
  assert.strictEqual(env.triggers.length, 17);
  const mine = env.triggers.filter(t => /^health/.test(t.getHandlerFunction()));
  assert.deepStrictEqual(mine.map(t => t.getHandlerFunction() + "|" + (t.kind || t.hour)), ["healthEvery5Min|every 5m", "healthHourly|every 1h", "healthDaily|7", "healthNightly|23"]);
  const env2 = mkEnv(); env2.addTriggers(thirteen.concat(["x1", "x2"]));
  assert.throws(() => env2.fn.healthInstallTriggers(), /limit 18/);
  assert.strictEqual(env2.triggers.length, 15);
});

test("healthTestAlert (fire drill 1): email + text even in quiet hours + healthchecks fail ping", () => {
  const env = mkEnv({ now: "2026-11-10T23:30:00Z", props: { HEALTH_PING_POLLER: "https://hc-ping.com/poller" } });
  const r = env.fn.healthTestAlert();
  assert.deepStrictEqual(r, { emailed: true, texted: true, pinged: true });
  assert.strictEqual(env.ownerSms()[0].body, "KD TEST: fire drill. If you got this text and the email, alerts work. Nothing to do.");
  assert.deepStrictEqual(env.pings, ["https://hc-ping.com/poller/fail"]);
  env.fn.healthTestAlert();
  assert.strictEqual(env.ownerSms().length, 2, "a second drill texts again");
});

test("caller texts (C) go to ONCALL_MOBILE only in calling hours, at most hourly", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  env.fn.healthAlert("P2", "C", "Backlog", BODY, { caller: "KD: ring them" });
  env.advance(10); env.fn.healthAlert("P2", "C", "Backlog", BODY, { caller: "KD: ring them" });
  assert.strictEqual(env.callerSms().length, 1);
  const env2 = mkEnv({ now: "2026-11-10T22:30:00Z" });
  env2.fn.healthAlert("P2", "C", "Backlog", BODY, { caller: "KD: ring them" });
  assert.strictEqual(env2.callerSms().length, 0);
});

test("open alerts list; a check that stopped re-raising for 26 h drops off", () => {
  const env = mkEnv();
  env.fn.healthAlert("P2", "A", "Old", BODY); env.fn.healthAlert("P1", "B", "New", BODY);
  assert.deepStrictEqual(env.fn.healthOpenAlerts().map(a => a.key), ["B", "A"]);
  env.advance(27 * 60); env.fn.healthAlert("P1", "B", "New", BODY);
  assert.deepStrictEqual(env.fn.healthOpenAlerts().map(a => a.key), ["B"]);
});

if (require.main === module) run();
