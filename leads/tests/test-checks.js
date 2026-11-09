// Every health check H1–H24 (plan 3.3), the dispatchers, and the ad watchdog in meta-ads.gs (H12).
"use strict";
const { mkEnv, test, run, assert, OWNER_SMS, CALLER_SMS } = require("./harness");

const p1 = env => env.mails.filter(m => /^\[KD-P1\]/.test(m.subject) && m.to === "owner@personal.test");
const p2 = env => env.mails.filter(m => /^\[KD-P2\]/.test(m.subject) && m.to === "owner@personal.test");
const subj = env => env.mails.filter(m => m.to === "owner@personal.test").map(m => m.subject);
const lastSms = env => (env.ownerSms().slice(-1)[0] || {}).body;
const has = (list, re) => list.some(s => re.test(s));
const ctx = () => ({});
function rows(env, n, o) { for (let i = 0; i < n; i++) env.row(Object.assign({ Name: "Person " + i, "Lead ID": String(5000 + i) }, typeof o === "function" ? o(i) : o)); }
const done = env => env.checkOwnerSms();

// ---------------- H1 ----------------
test("H1 poller alive: clean run -> healthchecks ping; stopped 20 min -> P1 text; running-but-failing -> no H1 alert", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z", props: { HEALTH_PING_POLLER: "https://hc-ping.com/poller" } });
  env.fn.pollMetaLeads(); env.advance(3); env.fn.healthPollerAlive(ctx());
  assert.deepStrictEqual(env.pings, ["https://hc-ping.com/poller"]);
  env.advance(20); env.fn.healthPollerAlive(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P1] Facebook lead checker stopped (last good run 11:00)"]);
  assert.strictEqual(lastSms(env), "KD P1: Facebook lead checker stopped at 11:00. New FB/IG leads are not added or texted. Apps Script > Executions. Plan R3");
  assert.strictEqual(env.pings.length, 1, "no ping without a clean run");
  env.fn.healthMark("pollMetaLeads", false, 100, "lead: boom"); env.fn.healthPollerAlive(ctx());
  assert.ok(has(subj(env), /RESOLVED: Facebook lead checker stopped/), "not 'stopped' any more (H15 reports failing runs)");
  done(env);
});

// ---------------- H2 ----------------
function setErr(env, code, minsAgo, msg, http) {
  env.props.META_LAST_ERR = JSON.stringify({ code, http: http || 400, msg: msg || "x", form: "F1", first: env.clock.now - minsAgo * 60000, last: env.clock.now });
}
test("H2 Meta errors: 190 P1 at once; rate limit P2 after 30 min, P1 after 2 h; 5xx P1 after 15 min; cleared -> RESOLVED", () => {
  let env = mkEnv({ now: "2026-11-10T14:20:00Z" });
  setErr(env, 190, 15, "Error validating access token"); env.fn.healthMetaApiErrors(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P1] Meta lead token rejected (error 190) since 14:05"]);
  assert.strictEqual(lastSms(env), "KD P1: Meta lead token rejected (error 190) since 14:05. FB/IG leads stopped. Make a new System User token. Plan R3");
  env.advance(1); env.fn.healthMark("pollMetaLeads", true, 100); env.fn.healthMetaApiErrors(ctx());
  assert.ok(has(subj(env), /RESOLVED: Meta lead token rejected/));
  env = mkEnv(); setErr(env, 613, 10); env.fn.healthMetaApiErrors(ctx()); assert.strictEqual(env.mails.length, 0);
  setErr(env, 613, 40); env.fn.healthMetaApiErrors(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P2] Meta is rate-limiting the lead checker (code 613, 40m). It retries by itself."]);
  setErr(env, 613, 125); env.fn.healthMetaApiErrors(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] Meta has rate-limited the lead checker for 2h05m/)); assert.strictEqual(env.ownerSms().length, 1);
  env = mkEnv(); setErr(env, 0, 5, "Internal error", 500); env.fn.healthMetaApiErrors(ctx()); assert.strictEqual(env.mails.length, 0);
  setErr(env, 0, 20, "Internal error", 500); env.fn.healthMetaApiErrors(ctx()); assert.ok(has(subj(env), /\[KD-P1\] Meta lead API failing \(HTTP 500\)/));
  done(env);
});
test("H2 fire drill 2: META_API_VERSION=v2.0 -> poller stores the error -> P1 within one 5-min run", () => {
  const env = mkEnv({ props: { META_API_VERSION: "v2.0" } });
  env.meta.error = url => (/\/v2\.0\//.test(url) ? { http: 400, code: 12, message: "(#12) This endpoint is deprecated for versions v2.4 and higher" } : null);
  env.fn.pollMetaLeads(); env.fn.healthMetaApiErrors(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] Meta says the API version is too old \(error 12\)/));
  assert.ok(/API version/.test(lastSms(env)));
});

// ---------------- H3 ----------------
test("H3 settings: blank/invalid ONCALL_MOBILE, owner's number, CALL_HOURS 24h, expired _UNTIL, WEB_SMS_PAUSED, BACKLOG_ALERT, HEALTH_EMAIL", () => {
  let env = mkEnv();
  assert.deepStrictEqual(env.fn.healthConfigCheck(ctx()), []); assert.strictEqual(env.mails.length, 0);
  env = mkEnv({ props: { ONCALL_MOBILE: "0770" } }); env.fn.healthConfigCheck(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P1] Setting wrong: ONCALL_MOBILE"]);
  assert.strictEqual(lastSms(env), "KD P1: setting wrong - ONCALL_MOBILE is blank/invalid, so the caller gets no lead alerts. Fix in Script Properties. Plan R5");
  env = mkEnv({ props: { CALL_HOURS: "24h" } }); env.fn.healthConfigCheck(ctx());
  assert.strictEqual(lastSms(env), "KD P1: test setting left on - CALL_HOURS is 24h, so night leads alert the caller. Set it back to 8-21 now.");
  env = mkEnv({ props: { CALL_HOURS: "24h", CALL_HOURS_UNTIL: "2026-11-10 18:00" } }); env.fn.healthConfigCheck(ctx());
  assert.strictEqual(env.mails.length, 0, "temporary change with a future _UNTIL is fine");
  env.setNow("2026-11-10T18:05:00Z"); env.fn.healthConfigCheck(ctx());
  assert.ok(has(subj(env), /2 settings wrong: CALL_HOURS, CALL_HOURS_UNTIL/), subj(env).join("|"));
  env = mkEnv({ props: { ONCALL_MOBILE: "07700900999" } }); env.fn.healthConfigCheck(ctx());
  assert.ok(has(subj(env), /ONCALL_MOBILE_OWNER/));
  env = mkEnv({ props: { WEB_SMS_PAUSED: "1", BACKLOG_ALERT: "15", HEALTH_EMAIL: "not-an-email" } }); env.fn.healthConfigCheck(ctx());
  assert.deepStrictEqual(env.mails.map(m => m.to + " " + m.subject), ["info@kirkcaldydental.co.uk [KD-P1] 3 settings wrong: BACKLOG_ALERT, WEB_SMS_PAUSED, HEALTH_EMAIL"],
    "invalid HEALTH_EMAIL falls back to OWNER_EMAIL");
  env = mkEnv({ now: "2026-11-10T23:00:00Z", props: { CLICKSEND_KEY: "" } }); env.fn.healthConfigCheck(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P2] Setting wrong: CLICKSEND_KEY"], "P2 outside calling hours");
  done(env);
});
test("H3 fire drill 4: ONCALL_MOBILE=0770 -> P1; restored -> RESOLVED", () => {
  const env = mkEnv({ props: { ONCALL_MOBILE: "0770" } });
  env.fn.healthEvery5Min();
  assert.ok(has(subj(env), /\[KD-P1\] Setting wrong: ONCALL_MOBILE/));
  env.props.ONCALL_MOBILE = "07700900001"; env.advance(5); env.fn.healthEvery5Min();
  assert.ok(has(subj(env), /RESOLVED: Setting wrong: ONCALL_MOBILE/));
});

// ---------------- H4 ----------------
test("H4 sheet: renamed header -> P1 (checks that read the sheet are skipped); Dashboard moved -> P2; row-1 change -> P2 with the difference", () => {
  const env = mkEnv();
  const c = ctx(); env.fn.healthSheetCheck(c); assert.strictEqual(env.mails.length, 0); assert.ok(env.props.HEALTH_ROW1);
  env.wl.rows[0][env.H("Status")] = "Status x";
  const c2 = ctx(); env.fn.healthSheetCheck(c2);
  assert.ok(c2.sheetBad); assert.ok(has(subj(env), /\[KD-P1\] Waiting list header row changed \(Status missing\): lead scripts stopped/));
  env.wl.rows[0][env.H("Status x")] = "Status"; env.wl.rows[0].push("New col");
  env.ss.sheets.push(env.ss.sheets.shift());   // Dashboard no longer first
  env.fn.healthSheetCheck(ctx());
  assert.ok(has(subj(env), /RESOLVED: Waiting list header row changed/));
  assert.ok(has(subj(env), /\[KD-P2\] Dashboard is no longer the first tab \(first tab: Waiting list\)/));
  assert.ok(has(subj(env), /\[KD-P2\] Waiting list header row changed \(added New col\)/));
  const env2 = mkEnv(); env2.wl.rows[0].push("Status");
  assert.throws(() => env2.fn.healthAssertSheet(), /Status twice/);
});

// ---------------- H5–H7 ----------------
test("H5 backlog: 6 waiting -> P2 (every 2 h); 11 -> P1 + caller text; 'add a caller', never 'cut the budget' first", () => {
  let env = mkEnv({ now: "2026-11-10T14:00:00Z" });
  rows(env, 6, () => ({ "Signup Time": env.minsAgo(90), Status: "" }));
  env.fn.healthBacklogCheck(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P2] 6 leads waiting over 1h, oldest 1h30m"]);
  assert.strictEqual(env.callerSms().length, 0);
  env = mkEnv({ now: "2026-11-10T14:00:00Z" });
  rows(env, 11, () => ({ "Signup Time": env.minsAgo(70), Status: "" }));
  env.fn.healthBacklogCheck(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P1] 11 leads waiting over 1h, oldest 1h10m"]);
  assert.strictEqual(lastSms(env), "KD P1: 11 leads waiting over 1h, oldest 1h10m. Add a caller now (backup caller). Plan R6");
  assert.strictEqual(env.callerSms()[0].body, "KD: 11 leads waiting, oldest 1h10m. Please ring oldest first (filter view To call).");
  const body = p1(env)[0].body;
  assert.ok(body.indexOf("Add a caller now") < body.indexOf("Only if nobody at all is available"), "add a caller first");
  done(env);
});
test("H5: overnight 'Call 8am' clock starts at 8am; No answer call-backs over an hour late count; outside CALLER_SHIFT nothing", () => {
  let env = mkEnv({ now: "2026-11-11T10:05:00Z" });
  env.row({ "Signup Time": env.at("2026-11-10 22:30"), Name: "Night", Status: "Call 8am", "Lead ID": "1" });
  env.row({ "Signup Time": env.at("2026-11-09 10:00"), Name: "Retry", Status: "No answer", "Next call due": env.minsAgo(90), "Lead ID": "2" });
  const b = env.fn.healthBacklog(ctx(), new env.D());
  assert.strictEqual(b.waiting, 2); assert.strictEqual(b.oldest, 125); assert.strictEqual(b.call8am, 1);
  env.fn.healthBacklogCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] 2 leads waiting over 1h, oldest 2h05m/), "oldest >= 120 shift minutes is P1");
  env = mkEnv({ now: "2026-11-10T18:00:00Z", props: { CALLER_SHIFT: "9-17", CALLER_DAYS: "Mon-Sat" } });
  rows(env, 12, () => ({ "Signup Time": env.minsAgo(300), Status: "" }));
  assert.strictEqual(env.fn.healthBacklogCheck(ctx()), null); assert.strictEqual(env.mails.length, 0);
  env.setNow("2026-11-11T10:00:00Z");
  const b2 = env.fn.healthBacklog(ctx(), new env.D());
  assert.strictEqual(b2.oldest, 4 * 60 + 60, "shift minutes only: 13:00-17:00 yesterday + 09:00-10:00 today");
});
test("H6 caller active: no calls for 2 shift hours while leads wait -> P1; recent call -> nothing; no tracking yet -> nothing", () => {
  let env = mkEnv({ now: "2026-11-10T14:00:00Z" });
  env.row({ "Signup Time": env.minsAgo(400), Name: "Done", Status: "Called", "Status changed at": env.minsAgo(160), "Lead ID": "1" });
  rows(env, 3, () => ({ "Signup Time": env.minsAgo(90), Status: "" }));
  env.fn.healthCallerActive(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P1] No calls logged since 11:20 and 3 leads waiting"]);
  assert.strictEqual(lastSms(env), "KD P1: no calls logged since 11:20 and 3 leads are waiting. Is the caller OK? If off, move alerts to the backup. Plan R5");
  env.callLog.rows.push([env.minsAgo(10), "1", 2, 1, "No answer", "No answer", "c@x", 5, 13, "12-14", "Tue", ""]);
  env.fn.healthCallerActive(ctx());
  assert.ok(has(subj(env), /RESOLVED: No calls logged/));
  env = mkEnv({ now: "2026-11-10T14:00:00Z" });
  rows(env, 3, () => ({ "Signup Time": env.minsAgo(90), Status: "" }));
  env.fn.healthCallerActive(ctx()); assert.strictEqual(env.mails.length, 0);
  done(env);
});
test("H7 overnight queue: 10:00 any left -> caller text + P2; 5+ -> P1; 12:00 any -> P1", () => {
  let env = mkEnv({ now: "2026-11-10T10:10:00Z" });
  rows(env, 3, () => ({ "Signup Time": env.at("2026-11-09 23:00"), Status: "Call 8am" }));
  env.fn.healthOvernightQueue(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P2] 3 overnight leads still not called at 10am"]);
  assert.strictEqual(env.callerSms()[0].body, "KD: 3 overnight leads not yet called at 10am. Filter Status = Call 8am and ring them now.");
  env = mkEnv({ now: "2026-11-10T10:10:00Z" });
  rows(env, 7, () => ({ "Signup Time": env.at("2026-11-09 23:00"), Status: "Call 8am" }));
  env.fn.healthOvernightQueue(ctx());
  assert.strictEqual(lastSms(env), "KD P1: 7 overnight leads still not called at 10am. Check the caller is working. Plan R5/R6");
  env = mkEnv({ now: "2026-11-10T12:10:00Z" });
  rows(env, 1, () => ({ "Signup Time": env.at("2026-11-09 23:00"), Status: "Call 8am" }));
  env.fn.healthOvernightQueue(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] 1 overnight lead still not called at 12pm/));
  done(env);
});

// ---------------- H8–H11 ----------------
test("H8 reconcile: a Meta lead (older than 15 min) missing from the sheet -> Failed leads row + P1 (names by email, count by text); once only", () => {
  const env = mkEnv({ now: "2026-11-10T15:00:00Z" });
  env.leadNames.push("Missing Mary");
  env.row({ "Signup Time": env.minsAgo(60), Name: "Here", "Lead ID": "1111" });
  env.meta.forms.F1.leads = [env.lead("1111", 60, { full_name: "Here" }), env.lead("2222", 30, { full_name: "Missing Mary", phone_number: "+447900000222" }),
    env.lead("3333", 5, { full_name: "Too New" }), env.lead("4444", 40, { full_name: "Retrying" })];
  env.props.META_RETRY = JSON.stringify({ 4444: { n: 1 } });
  env.fn.healthMark("pollMetaLeads", true, 100);                   // the lead checker runs fine, yet 2222 never reached the sheet
  assert.strictEqual(env.fn.healthMetaReconcile(ctx()), 1);
  const fl = env.tab("Failed leads");
  assert.strictEqual(fl.rows.length, 2); assert.strictEqual(fl.rows[1][1], "2222");
  assert.deepStrictEqual(subj(env), ["[KD-P1] A Facebook lead is not in the Waiting list"]);
  assert.ok(p1(env)[0].body.indexOf("Missing Mary") !== -1);
  assert.strictEqual(lastSms(env), "KD P1: 1 Facebook lead not in the sheet. Names in your email and the Failed leads tab. Call them first. Plan R3");
  env.row({ "Signup Time": env.minsAgo(5), Name: "Too New", "Lead ID": "3333" });       // the poller added it meanwhile
  env.advance(60); env.fn.healthMetaReconcile(ctx());
  assert.strictEqual(fl.rows.length, 2, "2222 not reported twice"); assert.strictEqual(p1(env).length, 1);
  done(env);
});
test("H9 Meta count: insights gap (>=3 and >=20%) on two runs in a row -> P1; forms leads_count since baseline", () => {
  let env = mkEnv({ now: "2026-11-10T15:00:00Z", props: { META_AD_ACCOUNT_ID: "act_123" } });
  env.ads = { todayLeads: 9 };
  rows(env, 4, i => ({ "Signup Time": env.minsAgo(60 + i), "Organic?": "No", "Form ID": "F1" }));
  env.fn.healthMetaCount(ctx()); assert.strictEqual(env.mails.length, 0, "one run is not enough");
  env.advance(60); env.fn.healthMetaCount(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P1] Meta counts 9 leads today, the sheet has 4"]);
  assert.strictEqual(lastSms(env), "KD P1: Meta counts 9 leads today, the sheet has 4. Real leads may be hidden from the script (app/permissions). Plan R3");
  env = mkEnv({ now: "2026-11-10T15:00:00Z" });
  env.meta.forms.F1.leads_count = 10; env.fn.healthMetaCount(ctx());        // first run sets the baseline
  assert.ok(JSON.parse(env.props.HEALTH_BASELINE).forms.F1 === 10);
  env.advance(30); env.meta.forms.F1.leads_count = 15; rows(env, 1, () => ({ "Signup Time": env.minsAgo(5), "Form ID": "F1" }));
  env.fn.healthMetaCount(ctx()); env.advance(60); env.fn.healthMetaCount(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] Meta counts 5 leads since 15:00, the sheet has 1/), subj(env).join("|"));
  done(env);
});
test("H10 forms: a live form not in META_FORM_IDS -> P1; the only listed form archived -> P2", () => {
  const env = mkEnv({ props: { META_PAGE_ID: "PAGE" } });
  env.meta.pageForms = [{ id: "F1", name: "Waitlist v1", status: "ACTIVE" }, { id: "1234567890123", name: "Waitlist v2", status: "ACTIVE", created_time: "2026-11-10T09:00:00+0000" }];
  env.fn.healthFormsCheck(ctx());
  assert.strictEqual(lastSms(env), "KD P1: new Facebook form 'Waitlist v2' (ID 1234567890123) is live but not read. Add its ID to META_FORM_IDS now. Plan R3");
  env.meta.pageForms = [{ id: "F1", name: "Waitlist v1", status: "ARCHIVED" }];
  env.fn.healthFormsCheck(ctx());
  assert.ok(has(subj(env), /RESOLVED: New Facebook form/)); assert.ok(has(subj(env), /\[KD-P2\] The Facebook form the script reads is archived/));
  done(env);
});
test("H11 no Meta leads for N hours while spending: P2 alone; P1 when another lead check is failing", () => {
  const mk = () => {
    const env = mkEnv({ now: "2026-11-10T16:00:00Z" });
    Object.assign(env.props, { ADS_ACTIVE_CAMPAIGNS: JSON.stringify({ t: env.clock.now - 600000, n: 1 }), ADS_TODAY_SPEND: "2026-11-10|9.4", ADS_DAILY_BUDGET: "20" });
    env.row({ "Signup Time": env.minsAgo(360), Name: "Last fb", "Lead ID": "777" });
    env.row({ "Signup Time": env.minsAgo(30), Name: "Web", "Lead ID": "W-261110-abc", Source: "facebook" });   // website row tagged facebook doesn't count
    return env;
  };
  let env = mk(); env.fn.healthNoMetaLeads(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P2] No Facebook leads for 6h while the ads spent \u00A39.40 today"]);
  env = mk(); env.fn.healthAlert("P1", "H9_COUNT", "Meta counts more", "x"); env.mails.length = 0; env.sms.length = 0;
  env.fn.healthNoMetaLeads(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] No Facebook leads for 6h/));
  env = mk(); env.props.ADS_TODAY_SPEND = "2026-11-10|3"; env.fn.healthNoMetaLeads(ctx()); assert.strictEqual(env.mails.length, 0, "under GBP5 spent");
  done(env);
});

// ---------------- H12 (meta-ads.gs adsStatusCheck through healthAlert) ----------------
function adsEnv(now, extra) {
  const env = mkEnv({ now: now || "2026-11-10T14:00:00Z", props: Object.assign({ META_AD_ACCOUNT_ID: "act_123" }, extra || {}) });
  env.ads = { campaigns: [{ id: "C1", name: "WL", effective_status: "ACTIVE", daily_budget: "2000", created_time: "2026-11-01T00:00:00+0000" }],
    adList: [{ id: "AD1", name: "Ad A", status: "ACTIVE", effective_status: "ACTIVE" }], todaySpend: 8, activities: [] };
  return env;
}
test("H12: account status, rejected ad, no campaign (rule = P2, ADS_PAUSED_UNTIL = quiet), GBP0 by 13:00, overspend, unknown campaign, festive, budget change", () => {
  let env = adsEnv(); env.ads.account = { account_status: 3 }; env.fn.healthAdsCheck(ctx());
  assert.strictEqual(lastSms(env), "KD P1: Meta ad account status 3 (payment problem). Ads stopped. Pay in Billing & payments or use the backup card. Plan R2");
  env = adsEnv(); env.ads.adList.push({ id: "AD2", name: "Ad B", status: "ACTIVE", effective_status: "DISAPPROVED", ad_review_feedback: { global: { x: "y" } } });
  env.fn.healthAdsCheck(ctx());
  assert.strictEqual(lastSms(env), "KD P1: ad 'Ad B' rejected by Meta. The other ad still runs. Forward the email to the ads chat. Plan R1");
  env = adsEnv(null, { ADS_EXPECTED_ON: "1" }); env.ads.campaigns[0].effective_status = "PAUSED"; env.fn.healthAdsCheck(ctx());
  assert.strictEqual(lastSms(env), "KD P1: no Facebook campaign running since 14:00. Paused on purpose? Set ADS_PAUSED_UNTIL. Otherwise Plan R2/R10");
  env = adsEnv(null, { ADS_EXPECTED_ON: "1" }); env.ads.campaigns[0].effective_status = "PAUSED";
  env.ads.activities = [{ event_time: "2026-11-10T12:00:00+0000", event_type: "update_campaign_run_status", translated_event_type: "Campaign status updated", actor_name: "Automated rule", object_name: "WL" }];
  env.fn.healthAdsCheck(ctx()); assert.ok(has(subj(env), /\[KD-P2\] No Facebook campaign running since 14:00 \(an automated rule turned it off\)/));
  env = adsEnv(null, { ADS_EXPECTED_ON: "1", ADS_PAUSED_UNTIL: "2026-11-11 08:00" }); env.ads.campaigns[0].effective_status = "PAUSED"; env.fn.healthAdsCheck(ctx());
  assert.strictEqual(env.mails.length, 0, "paused on purpose");
  env = adsEnv("2026-11-10T13:10:00Z"); env.ads.todaySpend = 0; env.fn.healthAdsCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] Facebook ads have spent \u00A30 today \(by 13:00\)/));
  env = adsEnv("2026-11-10T11:10:00Z"); env.ads.todaySpend = 0; env.fn.healthAdsCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P2\] Facebook ads have spent \u00A30 today \(by 11:00\)/));
  env = adsEnv(); env.ads.todaySpend = 34; env.fn.healthAdsCheck(ctx());
  assert.strictEqual(lastSms(env), "KD P1: ads spent GBP34 today on a GBP20 budget. Check Ads Manager > Activity history now. Possible hack: register row 52");
  env = adsEnv(null, { ADS_ALLOWED_CAMPAIGNS: "C9" }); env.fn.healthAdsCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] Unknown Facebook campaign in the ad account: WL/));
  env = adsEnv("2026-12-26T11:00:00Z", { FESTIVE_MAX: "10" }); env.fn.healthAdsCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] Ad budget \u00A320\/day is above the festive limit \u00A310/));
  env = adsEnv(null, { ADS_EXPECTED_BUDGET: "15" });
  env.ads.activities = [{ event_time: "2026-11-10T09:00:00+0000", event_type: "update_campaign_budget", translated_event_type: "Campaign budget updated", actor_name: "Jane Doe" }];
  env.fn.healthAdsCheck(ctx());
  const m = p2(env).find(x => /Ad budget is \u00A320\/day, not the agreed \u00A315/.test(x.subject));
  assert.ok(m && /Jane Doe/.test(m.body), "names who changed it");
  assert.ok(JSON.parse(env.props.ADS_ACTIVE_CAMPAIGNS).n === 1, "stored for H11/H24");
  done(env);
});
test("H12: Meta read error says whether Facebook leads stopped too (the false 'Leads still arrive' line is gone)", () => {
  let env = adsEnv(); env.meta.error = { http: 400, code: 190, message: "expired" }; env.fn.healthAdsCheck(ctx());
  let m = p2(env).find(x => /Ad results can't be read from Meta \(400\)/.test(x.subject));
  assert.ok(m && /SAME token the Facebook lead checker uses/.test(m.body) && !/Leads still arrive/.test(m.body));
  env = adsEnv(null, { META_ADS_TOKEN: "adstok" }); env.meta.error = { http: 400, code: 190, message: "expired" }; env.fn.healthAdsCheck(ctx());
  m = p2(env).find(x => /Ad results can't be read/.test(x.subject));
  assert.ok(/their own token \(META_ADS_TOKEN\), so Facebook leads should still arrive/.test(m.body));
});
test("H12: the old 2-hourly trigger defers while health.gs runs hourly; adsKpiAlarms routes through healthAlert", () => {
  const env = adsEnv(); env.fn.healthMark("healthHourly", true, 1000);
  env.fn.adsStatusCheck(); assert.ok(!env.fetches.some(u => /act_123/.test(u)), "no Meta calls");
  Object.assign(env.props, { ADS_FREQ_7D: "3.6", LAUNCH_DATE: "2026-10-25" });
  env.fn.adsKpiAlarms();
  assert.ok(has(subj(env), /^\[KD-P2\] Ads are being seen too often \(frequency 3\.6\)$/));
  assert.ok(env.healthLog().some(r => r[2] === "ADS_FREQ_LAST"));
});

// ---------------- H13, H14 ----------------
test("H13 ClickSend credit: <CRIT P1, <WARN P2, login 401 P1 with no text + /fail; shares tracking.gs's key so no double email", () => {
  let env = mkEnv({ now: "2026-11-10T12:00:00Z" }); env.balance = 3.1; env.fn.healthClickSendBalance(ctx());
  assert.strictEqual(lastSms(env), "KD P1: ClickSend credit GBP3.10. Lead and caller texts stop soon. Top up now - auto top-up may have failed. Plan R4");
  env = mkEnv(); env.balance = 12; env.fn.healthClickSendBalance(ctx()); assert.deepStrictEqual(subj(env), ["[KD-P2] ClickSend credit is low (\u00A312.00)"]);
  env.balance = 40; env.fn.healthClickSendBalance(ctx()); assert.ok(has(subj(env), /RESOLVED: ClickSend credit is low/));
  env = mkEnv({ props: { HEALTH_PING_DAILY: "https://hc-ping.com/daily" } }); env.csAccountCode = 401; env.fn.healthClickSendBalance(ctx());
  assert.deepStrictEqual(subj(env), ["[KD-P1] ClickSend login failed (401)"]); assert.strictEqual(env.ownerSms().length, 0); assert.deepStrictEqual(env.pings, ["https://hc-ping.com/daily/fail"]);
  env = mkEnv({ now: "2026-11-10T06:15:00Z" }); env.balance = 8;
  env.fn.trkPullSmsHistory();                  // tracking.gs 06:15 alarm (< GBP10) -> healthNotifyOnce("SMS_BALANCE")
  assert.strictEqual(env.mailsTo("owner@personal.test").length, 1);
  env.setNow("2026-11-10T08:05:00Z"); env.fn.healthClickSendBalance(ctx());
  assert.strictEqual(env.mailsTo("owner@personal.test").length, 1, "H13 at 08:00 doesn't email the same thing again");
  done(env);
});
test("H14a SMS log: caller alert not sent -> P1; 3 lead texts failed -> P1 (no text if ClickSend is down); Meta row with no SMS status -> P2", () => {
  let env = mkEnv();
  env.smsLogRow(5, "caller alert", "INVALID_RECIPIENT"); env.fn.healthSmsCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] Caller alert not sent \(10:55, INVALID_RECIPIENT\)/));
  assert.strictEqual(lastSms(env), "KD P1: caller alert not sent (10:55, INVALID_RECIPIENT). The caller may not know about new leads. Plan R4/R5");
  env = mkEnv();
  [5, 10, 20].forEach(m => env.smsLogRow(m, "lead text", "INSUFFICIENT_CREDIT")); env.smsLogRow(30, "lead text", "SUCCESS");
  env.fn.healthSmsCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] 3 of 4 lead texts failed in the last hour \(INSUFFICIENT_CREDIT\)/)); assert.strictEqual(env.ownerSms().length, 0, "ClickSend is the failure");
  env = mkEnv();
  const r = env.row({ "Signup Time": env.minsAgo(30), "Logged at": env.minsAgo(30), Name: "No Text", "Lead ID": "888", Status: "" });
  env.row({ "Signup Time": env.minsAgo(30), "Logged at": env.minsAgo(30), Name: "Dup", "Lead ID": "889", Status: "Duplicate" });
  env.row({ "Signup Time": env.minsAgo(3), "Logged at": env.minsAgo(3), Name: "Fresh", "Lead ID": "890", Status: "" });
  env.fn.healthSmsCheck(ctx());
  const m = p2(env)[0]; assert.strictEqual(m.subject, "[KD-P2] 1 Facebook lead got no thank-you text"); assert.ok(m.body.indexOf("row " + r) !== -1);
  done(env);
});
test("H14b ClickSend history: caller alert undelivered -> P1; delivery < 90% -> P2; >200 a day -> P1; same number texted twice in 5 min -> P2", () => {
  const env = mkEnv({ now: "2026-11-10T15:00:00Z" });
  const t = m => String(Math.floor((env.clock.now - m * 60000) / 1000));
  env.csHistory = [{ date: t(20), to: "+447700900001", body: "NEW LEAD (facebook) - call now: X", status: "Undelivered", message_id: "c1" }];
  for (let i = 0; i < 10; i++) env.csHistory.push({ date: t(60 + i * 30), to: "+4479000003" + String(i).padStart(2, "0"), body: "Hi A, thanks", status: i < 8 ? "Delivered" : "Failed" });
  env.csHistory.push({ date: t(40), to: "+447900000500", body: "Hi B, thanks", status: "Delivered" }, { date: t(38), to: "+447900000500", body: "Hi B, thanks", status: "Delivered" });
  env.fn.healthSmsHistoryCheck(ctx());
  const s = subj(env);
  assert.ok(has(s, /\[KD-P1\] Caller alert not delivered \(14:40, Undelivered\)/), s.join("|"));
  assert.ok(has(s, /\[KD-P2\] Only 83% of lead texts delivered \(24 h\)/), s.join("|"));
  assert.ok(has(s, /\[KD-P2\] 1 person got the lead text twice within 5 minutes/));
  const env2 = mkEnv({ now: "2026-11-10T15:00:00Z" });
  for (let i = 0; i < 205; i++) env2.csHistory.push({ date: String(Math.floor(env2.clock.now / 1000) - 60 - i), to: "+4479" + String(i).padStart(8, "0"), body: "x", status: "Delivered" });
  env2.fn.healthSmsHistoryCheck(ctx());
  assert.ok(has(subj(env2), /\[KD-P1\] 205 texts today \(normal 0\)/));
  done(env);
});

// ---------------- H15 ----------------
test("H15 jobs: late/slow jobs P2; poller failing 10+ min P1 (not for Meta/sheet/config causes); new Failed sign-ups row P1 per run", () => {
  let env = mkEnv({ now: "2026-11-10T14:00:00Z" });
  env.props.HM_backlogCheck = JSON.stringify({ last: env.clock.now - 40 * 60000, ok: true, ms: 1000 });
  env.props.HM_morningSummary = JSON.stringify({ last: env.clock.now - 26 * 3600e3, ok: true, ms: 500 });
  env.props.HM_trkDailySnapshot = JSON.stringify({ last: env.clock.now - 10 * 60000, ok: true, ms: 75000 });
  env.fn.healthJobsCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P2\] 2 scheduled jobs didn't run: backlogCheck, morningSummary/), subj(env).join("|"));
  assert.ok(has(subj(env), /\[KD-P2\] A script run took over 60 seconds: trkDailySnapshot took 75 s/));
  env = mkEnv();
  env.props.HM_pollMetaLeads = JSON.stringify({ last: env.clock.now - 60000, ok: false, firstFail: env.clock.now - 12 * 60000, err: "meta: Meta API error on form F1" });
  env.fn.healthJobsCheck(ctx()); assert.strictEqual(env.mails.length, 0, "H2 owns Meta errors");
  env.props.HM_pollMetaLeads = JSON.stringify({ last: env.clock.now - 60000, ok: false, firstFail: env.clock.now - 12 * 60000, err: "other: TypeError: x is undefined" });
  env.fn.healthJobsCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] pollMetaLeads failing since 10:48 \(TypeError: x is undefined\)/));
  env = mkEnv();
  env.ss.addTab("Failed sign-ups", [["Failed at", "Name", "Phone", "Error", "Alerted at"], [env.minsAgo(2), "Web Fail", "'07900000777", "Service timed out", ""]]);
  env.leadNames.push("Web Fail");
  env.fn.healthJobsCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] A website sign-up failed to save at 10:58/));
  assert.strictEqual(lastSms(env), "KD P1: a website sign-up failed to save at 10:58. Details in Failed sign-ups tab. Add and call them.");
  env.fn.healthJobsCheck(ctx()); assert.strictEqual(p1(env).length, 1, "alerted once");
  done(env);
});

// ---------------- H16, H17 ----------------
function site(env, over) {
  const pages = Object.assign({
    "https://kirkcaldydental.co.uk/register/": [200, "<form action='https://script.google.com/macros/s/EXEC123/exec'><input name=\"marketing\">"],
    "https://kirkcaldydental.co.uk/privacy.html": [200, "ClickSend Hostinger Meta"],
    "https://kirkcaldydental.co.uk/l/": [302, "", { Location: "https://kirkcaldydental.co.uk/register/?src=leaflet" }],
    "https://kirkcaldydental.co.uk/b/": [200, "<meta http-equiv=refresh content='0;url=/register/?src=banner'>"],
    "https://www.kirkcaldydental.co.uk/": [200, "home"],
    "https://script.google.com/macros/s/EXEC123/exec?action=ping": [200, "pong " + env.get("HEALTH_VERSION")]
  }, over || {});
  env.site = url => (pages[url] ? { code: pages[url][0], body: pages[url][1], headers: pages[url][2] || {} } : null);
}
test("H16 site: all good -> nothing (version stored); /register 404 twice -> P1; privacy mentions Zapier -> P2", () => {
  const env = mkEnv({ now: "2026-11-10T14:00:00Z", props: { HEALTH_SITE: "https://kirkcaldydental.co.uk", HEALTH_EXEC_ID: "EXEC123" } });
  site(env); env.fn.healthSiteCheck(ctx());
  assert.strictEqual(env.mails.length, 0, subj(env).join("|")); assert.strictEqual(env.props.HEALTH_WEB_VERSION, env.get("HEALTH_VERSION"));
  site(env, { "https://kirkcaldydental.co.uk/register/": [404, "nope"] });
  env.fn.healthSiteCheck(ctx()); assert.strictEqual(env.mails.length, 0, "one failure is not enough");
  env.advance(60); env.fn.healthSiteCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] Website broken: \/register HTTP 404/));
  assert.strictEqual(lastSms(env), "KD P1: website broken (/register HTTP 404) at 14:00 and 15:00. Leaflet and banner sign-ups fail. Plan R7");
  site(env, { "https://kirkcaldydental.co.uk/privacy.html": [200, "ClickSend Hostinger Meta Zapier"] });
  env.advance(60); env.fn.healthSiteCheck(ctx());
  assert.ok(has(subj(env), /RESOLVED: Website broken/)); assert.ok(has(subj(env), /\[KD-P2\] Website content to fix: the privacy page still mentions Zapier/));
  done(env);
});
test("H17 DNS: MX missing -> P1; no DMARC -> P2", () => {
  const env = mkEnv();
  env.dns = { "kirkcaldydental.co.uk|MX": [], "kirkcaldydental.co.uk|TXT": ["v=spf1 include:_spf.google.com ~all"], "google._domainkey.kirkcaldydental.co.uk|TXT": ["v=DKIM1; p=x"] };
  env.fn.healthDnsCheck(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] Google mail record \(MX\) missing/));
  assert.strictEqual(lastSms(env), "KD P1: Google mail record (MX) missing. Outside emails to info@ bounce. Restore Google MX (register row 73).");
  assert.ok(has(subj(env), /\[KD-P2\] Domain settings to fix: no DMARC record/));
});

// ---------------- H18, H19 ----------------
const ALL17 = ["pollMetaLeads", "morningSummary", "backlogCheck", "eveningReport", "adsPullInsights", "adsWeeklyPull", "adsStatusCheck", "trkOnSheetEdit", "trkRetryCheck",
  "trkPullSmsHistory", "trkScanBounces", "trkDailySnapshot", "trkWeeklyEmail", "healthEvery5Min", "healthHourly", "healthDaily", "healthNightly"];
test("H18 daily self-test: 'all OK' email always + healthchecks ping; missing triggers -> P1 text; data problems listed", () => {
  let env = mkEnv({ now: "2026-11-10T07:30:00Z", props: { HEALTH_PING_DAILY: "https://hc-ping.com/daily", HEALTH_CS_BALANCE: "42.1" } });
  env.addTriggers(ALL17); env.props.HEALTH_BACKUP_LAST = String(env.clock.now - 8 * 3600e3);
  env.fn.healthSelfTest(ctx());
  assert.deepStrictEqual(subj(env), ["[KD] Daily check 07:30: all OK (17 triggers, version " + env.get("HEALTH_VERSION") + ", ClickSend \u00A342.10, 0 open alerts)"]);
  assert.deepStrictEqual(env.pings, ["https://hc-ping.com/daily"]);
  env = mkEnv({ now: "2026-11-10T07:30:00Z" });
  env.addTriggers(ALL17.slice(0, 15)); env.sheetTz = "Etc/GMT";
  env.row({ "Signup Time": "10/11/2026 07:00", Name: "Typed date", Phone: "p:+447900000001", "Lead ID": "l:123" });
  env.fn.healthSelfTest(ctx());
  const s = subj(env)[0];
  assert.ok(/^\[KD\] Daily check 07:30: \d+ problems \(triggers 15 of 17/.test(s), s);
  const body = env.mails[0].body;
  ["time zone: script Europe/London, sheet Etc/GMT", "isn't a real date", "\"l:\"", "last backup never"].forEach(x => assert.ok(body.indexOf(x) !== -1, x + "\n" + body));
  assert.strictEqual(lastSms(env), "KD P1: daily check found 1 problem (triggers 15 of 17). Details in email.");
  done(env);
});
test("H19 email allowance: <300 P2, <50 P1", () => {
  const env = mkEnv(); env.quota = 200; env.fn.healthMailQuota(ctx());
  assert.ok(has(subj(env), /\[KD-P2\] Google email allowance low \(200 left today\)/));
  env.quota = 40; env.fn.healthMailQuota(ctx());
  assert.ok(/^KD P1: Google email allowance nearly used \(\d+ left today\). Confirmations pause. Spam\? Plan R8$/.test(lastSms(env)));
});

// ---------------- H20, H21 ----------------
test("H20 spam: 20 website sign-ups in an hour -> WEB_SMS_PAUSED for 2 h + P1; switched back on after 2 h when calm", () => {
  const env = mkEnv({ now: "2026-11-10T14:00:00Z" });
  rows(env, 20, i => ({ "Signup Time": env.minsAgo(2 + i), "Lead ID": "W-261110-" + i, Source: "website" }));
  env.fn.healthSpamCheck(ctx());
  assert.strictEqual(env.props.WEB_SMS_PAUSED, "1"); assert.strictEqual(env.props.WEB_SMS_PAUSED_UNTIL, "2026-11-10 16:00");
  assert.strictEqual(lastSms(env), "KD P1: 20 website sign-ups in the last hour (normal 0). Website texts paused for 2h automatically. Check for spam. Plan R8");
  env.fn.healthConfigCheck(ctx()); assert.ok(!has(subj(env), /WEB_SMS_PAUSED/), "H3 accepts a pause with a future _UNTIL");
  env.setNow("2026-11-10T16:05:00Z"); env.fn.healthSpamCheck(ctx());
  assert.strictEqual(env.props.WEB_SMS_PAUSED, undefined); assert.ok(has(subj(env), /RESOLVED: 20 website sign-ups/));
  done(env);
});
test("H21 backup: values-only copy of 4 tabs in the backup folder; rows vanished -> P1; healthSetBaseline makes a deliberate delete quiet; 30 kept", () => {
  const env = mkEnv({ now: "2026-11-10T23:30:00Z", props: { HEALTH_PING_BACKUP: "https://hc-ping.com/backup" } });
  rows(env, 5, i => ({ "Signup Time": env.minsAgo(100 + i) }));
  env.fn.healthAlert("P2", "X", "for the Health log", "x"); env.mails.length = 0;
  const r1 = env.fn.healthBackup(ctx());
  const fid = env.props.HEALTH_BACKUP_FOLDER, files = Object.values(env.drive.files).filter(f => f.parent === fid);
  assert.strictEqual(files.length, 1); assert.strictEqual(files[0].name, "KD backup 2026-11-10");
  assert.deepStrictEqual(files[0].ss.getSheets().map(s => s.getName()), ["Waiting list", "Call log", "SMS log", "Health log"]);
  assert.strictEqual(files[0].ss.getSheetByName("Waiting list").rows.length, 6);
  assert.deepStrictEqual(env.pings, ["https://hc-ping.com/backup"]); assert.strictEqual(r1.rows, 5);
  env.setNow("2026-11-11T23:30:00Z"); env.drive.files[files[0].id].created = env.clock.now - 864e5;
  env.wl.rows.splice(2, 2);
  env.fn.healthBackup(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] 2 Waiting list rows vanished since last night's backup/));
  assert.strictEqual(env.ownerSms().length, 0, "23:30 is quiet hours: no text yet");
  env.setNow("2026-11-12T07:03:00Z"); env.fn.healthQuietSummary();
  assert.strictEqual(lastSms(env), "KD P1: 1 problem from overnight: 2 rows vanished. Details in email.");
  env.mails.length = 0;
  env.setNow("2026-11-12T12:00:00Z"); env.wl.rows.splice(2, 1); env.fn.healthSetBaseline();
  env.setNow("2026-11-12T23:30:00Z"); env.fn.healthBackup(ctx());
  assert.strictEqual(env.mails.length, 0, "deliberate delete after healthSetBaseline");
  for (let i = 0; i < 35; i++) env.drive.files["OLD" + i] = { id: "OLD" + i, name: "KD backup 2026-09-" + String(i % 30 + 1).padStart(2, "0") + "-" + i, created: 0, parent: fid };
  env.setNow("2026-11-13T23:30:00Z"); env.fn.healthBackup(ctx());
  assert.strictEqual(Object.values(env.drive.files).filter(f => f.parent === fid && !f.trashed).length, 30);
  done(env);
});

// ---------------- H22–H24 ----------------
test("H22 21:00 scan: 'stop' in Notes not DNC -> P1; text to a DNC number after it was marked -> P1; health words -> P2 by row number only", () => {
  const env = mkEnv({ now: "2026-11-10T21:00:00Z" });
  const stop = env.row({ "Signup Time": env.minsAgo(900), Name: "A", Notes: "Said please stop calling me", Status: "No answer", "Lead ID": "1" });
  env.row({ "Signup Time": env.minsAgo(900), Name: "B", Phone: "07900000555", Status: "DO NOT CONTACT", "Status changed at": env.minsAgo(120), "Lead ID": "2" });
  const hrow = env.row({ "Signup Time": env.minsAgo(900), Name: "C", Notes: "has bad toothache pain, abscess", Status: "Called", "Lead ID": "3" });
  env.row({ "Signup Time": env.minsAgo(900), Name: "D", Status: "Maybe later", "Lead ID": "4" });
  env.csHistory = [{ date: String(Math.floor((env.clock.now - 60 * 60000) / 1000)), to: "+447900000555", body: "Hi B", status: "Delivered" }];
  env.callLog.rows.push([env.at("2026-11-10 07:40"), "1", 2, 1, "No answer", "No answer", "c", 0, 7, "08-10", "Tue", ""]);
  env.fn.healthContentScan(ctx());
  const s = subj(env);
  assert.ok(has(s, /\[KD-P1\] A text went to a DO NOT CONTACT number at 20:00/), s.join("|"));
  assert.ok(has(s, new RegExp("\\[KD-P1\\] Row " + stop + " say stop but aren't DO NOT CONTACT")));
  assert.ok(env.ownerSms().some(x => x.body === "KD P1: row " + stop + " says stop/remove but not DO NOT CONTACT. Set DNC today. Plan R9"));
  const m = p2(env)[0];
  assert.ok(/Evening scan/.test(m.subject) && m.body.indexOf("rows " + hrow) !== -1 && m.body.indexOf("toothache") === -1 && m.body.indexOf("Status values outside") !== -1 && /before 08:00/.test(m.body));
  done(env);
});
test("H23 monthly: access list email + 'KD TEST' text to the owner", () => {
  const env = mkEnv({ now: "2026-12-01T07:30:00Z" });
  env.fn.healthMonthly(ctx());
  assert.ok(has(subj(env), /\[KD-P1\] Monthly alert test \+ who has access/));
  assert.ok(/mobile ending 001/.test(p1(env)[0].body) && p1(env)[0].body.indexOf("07700900001") === -1, "numbers masked");
  assert.strictEqual(lastSms(env), "KD TEST: monthly alert test. If you got this text and the email, alerts work. Nothing to do.");
});
test("H24 gates: ads live without NHS_FIFE_LETTER_ID -> P1; festive cover reminder from 24 Nov; budget too high far from opening", () => {
  const env = mkEnv({ now: "2026-11-25T07:30:00Z", props: { CALL_CARD_APPROVED: "2026-11-08", PRIORITY_RULE_SIGNED: "2026-11-08", OPENING_TARGET: "2027-03-01", ADS_DAILY_BUDGET: "25" } });
  env.props.ADS_ACTIVE_CAMPAIGNS = JSON.stringify({ t: env.clock.now - 3600e3, n: 1 });
  env.fn.healthGates(ctx());
  assert.strictEqual(lastSms(env), "KD P1: Facebook ads are live but the NHS Fife letter is not recorded (NHS_FIFE_LETTER_ID). Record it or pause the ads.");
  assert.ok(has(subj(env), /\[KD-P2\] Christmas cover not set \(FESTIVE_COVER\)/));
  assert.ok(has(subj(env), /\[KD-P2\] Ad budget \u00A325\/day with 9\d days to opening/));
  assert.ok(!has(subj(env), /priority rule/i));
  done(env);
});

// ---------------- manual helpers / guards ----------------
test("healthResendFailedTexts (R4 step 5): calling hours only; re-sends failed texts, skips DNC and Duplicate", () => {
  const env = mkEnv({ now: "2026-11-10T22:30:00Z" });
  assert.throws(() => env.fn.healthResendFailedTexts(), /Only in calling hours/);
  env.setNow("2026-11-11T10:00:00Z");
  const a = env.row({ "Signup Time": env.minsAgo(300), Name: "anna", Phone: "07900000601", Status: "", "Lead ID": "601", "SMS status": "Failed: INSUFFICIENT_CREDIT" });
  const b = env.row({ "Signup Time": env.minsAgo(300), Name: "Ben", Phone: "07900000602", Status: "DO NOT CONTACT", "Lead ID": "602", "SMS status": "Failed: INSUFFICIENT_CREDIT" });
  const c = env.row({ "Signup Time": env.minsAgo(300), Name: "Cat", Phone: "07900000603", Status: "Duplicate", "Lead ID": "603", "SMS status": "Failed: X" });
  assert.deepStrictEqual(env.fn.healthResendFailedTexts(), { resent: 1, skipped: 2 });
  assert.strictEqual(env.sms.length, 1); assert.strictEqual(env.sms[0].to, "+447900000601"); assert.ok(env.sms[0].body.indexOf("Hi Anna,") === 0);
  assert.strictEqual(env.rowObj(a)["SMS status"], "Sent (resent)"); assert.strictEqual(env.rowObj(b)["SMS status"], "Failed: INSUFFICIENT_CREDIT");
});
test("a failed Meta read never 'resolves' an open ad alert", () => {
  const env = adsEnv(); env.ads.adList.push({ id: "AD2", name: "Ad B", status: "ACTIVE", effective_status: "DISAPPROVED" });
  env.fn.healthAdsCheck(ctx()); assert.ok(env.state("ADS_REJECTED_LAST").open);
  env.meta.error = url => (/\/ads\?/.test(url) || /\/campaigns\?/.test(url) ? { http: 500, code: 1, message: "Please retry" } : null);
  env.advance(60); env.fn.healthAdsCheck(ctx());
  assert.ok(env.state("ADS_REJECTED_LAST").open, "still open"); assert.ok(!has(subj(env), /RESOLVED/));
});

// ---------------- dispatchers ----------------
test("dispatchers: each run reads the Waiting list once; a crashing check doesn't stop the others (P2 'health check crashed')", () => {
  const env = mkEnv({ now: "2026-11-10T21:10:00Z", props: { META_AD_ACCOUNT_ID: "act_123", META_PAGE_ID: "PAGE", HEALTH_SITE: "" } });
  env.ads = { campaigns: [{ id: "C1", name: "WL", effective_status: "ACTIVE", daily_budget: "2000" }], adList: [], todaySpend: 8 };
  rows(env, 3, i => ({ "Signup Time": env.minsAgo(20 + i), Status: "" }));
  let reads = 0; env.wl.onRead = () => { reads++; };
  env.fn.pollMetaLeads(); reads = 0;
  env.fn.healthEvery5Min(); assert.strictEqual(reads, 1, "5-min run: one read");
  reads = 0; env.fn.healthHourly(); assert.strictEqual(reads, 1, "hourly run: one read");
  assert.ok(JSON.parse(env.props.HM_healthEvery5Min).ok && JSON.parse(env.props.HM_healthHourly).ok, env.logs.filter(l => l[0] === "error").map(l => l[1]).join("\n"));
  env.smsLogRow(30, "lead text", "SUCCESS"); env.smsLog.getRange = () => { throw new Error("SMS log broken"); };
  env.advance(5); env.fn.healthEvery5Min();
  assert.ok(has(subj(env), /\[KD-P2\] A health check crashed: H14a, H20/), subj(env).join("|"));
  assert.ok(JSON.parse(env.props.HM_healthEvery5Min).ok === false);
  const env2 = mkEnv({ now: "2026-12-01T07:30:00Z" }); env2.addTriggers(ALL17);
  env2.fn.healthDaily();
  assert.ok(has(subj(env2), /Monthly alert test/) && has(subj(env2), /^\[KD\] Daily check 07:30/));
  env2.setNow("2026-12-01T23:30:00Z"); env2.fn.healthNightly(); assert.ok(env2.props.HEALTH_BACKUP_LAST);
  const env3 = mkEnv({ props: { HEALTH_EMAIL: "", OWNER_EMAIL: "", ONCALL_MOBILE: "" } });
  assert.throws(() => env3.fn.healthEvery5Min(), /HEALTH_EMAIL/, "nobody to email -> the trigger fails so Google emails its owner");
});

if (require.main === module) run();
