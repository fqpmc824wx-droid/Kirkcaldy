// pollMetaLeads + handleLead (plan 3.5, ads chat): send first, ONE row, Assigned to only on SUCCESS, retries + Failed leads,
// META_LAST_ERR, header check, blank settings, new forms from created_time, META_LEAD_FIELDS; plus the 8am/backlog/9pm jobs.
"use strict";
const { mkEnv, test, run, assert, OWNER_SMS, CALLER_SMS } = require("./harness");

const fields = (name, phone, email, extra) => Object.assign({ full_name: name, phone_number: phone, email: email || "", post_code: "KY1 1AA",
  "how_many_people_would_you_like_to_add?": "4_plus", "who_is_joining?": "family" }, extra || {});
function withLeads(env, leads) { env.meta.forms.F1.leads = leads; }
const wlAppends = env => env.events.filter(e => e[0] === "appendRow" && e[1] === "Waiting list");
const wlSetValues = env => env.events.filter(e => e[0] === "setValue" && e[1] === "Waiting list");

test("new lead in calling hours: caller alert (ASCII), thank-you text, email - THEN one row with SMS ID/status, Email status, Assigned to", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  withLeads(env, [env.lead("1001", 2, fields("Zoë O'Brien", "+447900000001", "zoe@example.com"), { custom_disclaimer_responses: [{ is_checked: "1" }] })]);
  env.fn.pollMetaLeads();
  const seq = env.events.filter(e => e[0] === "sms" || e[0] === "mail" || (e[0] === "appendRow" && e[1] === "Waiting list")).map(e => e[0]);
  assert.deepStrictEqual(seq, ["sms", "mail", "sms", "mail", "appendRow"], "caller text, owner copy email, lead text, lead email, then the row");
  assert.strictEqual(wlAppends(env).length, 1);
  assert.strictEqual(wlSetValues(env).length, 0, "no cell written after the row (no getLastRow)");
  const alert = env.callerSms()[0].body;
  assert.strictEqual(alert, "NEW LEAD (facebook) - call now: Zoe O'Brien +447900000001");
  assert.ok(/^[\x20-\x7E]+$/.test(alert));
  const r = env.rowObj(2);
  assert.strictEqual(r["Lead ID"], "1001"); assert.strictEqual(r["Ad ID"], "AD1"); assert.strictEqual(r["Form ID"], "F1");
  assert.strictEqual(r["SMS status"], "Sent"); assert.ok(/^M\d+$/.test(r["SMS ID"])); assert.strictEqual(r["Email status"], "Sent");
  assert.strictEqual(r["Assigned to"], "07700900001"); assert.strictEqual(r["Status"], ""); assert.strictEqual(r["Marketing consent"], "Yes");
  assert.strictEqual(r["No. of People"], "4+"); assert.strictEqual(r["Source"], "facebook");
  assert.ok(r["Signup Time"] instanceof env.D && r["Logged at"] instanceof env.D);
  assert.strictEqual(env.sms[1].body.indexOf("Hi Zoe, thank you for joining"), 0);
  const j = JSON.parse(env.props.HM_pollMetaLeads);
  assert.strictEqual(j.ok, true, "clean run marked");
});

test("a website sign-up saved at the same moment can't receive this lead's statuses (no getLastRow)", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  let once = false;
  env.mailFail = m => {   // while the Facebook lead's email is being sent, a website doPost saves its own row
    if (!once && m.to === "fb@example.com") { once = true; env.fn.doPost({ parameter: { name: "Web Person", email: "web@example.com", phone: "07900000222", source: "leaflet" } }); }
    return false;
  };
  withLeads(env, [env.lead("2002", 1, fields("Fb Person", "+447900000111", "fb@example.com"))]);
  env.fn.pollMetaLeads();
  const rows = env.dataRows().map((r, i) => env.rowObj(i + 2));
  const web = rows.find(r => r.Name === "Web Person"), fb = rows.find(r => r.Name === "Fb Person");
  assert.ok(web && fb, "both rows saved");
  assert.ok(/^W-/.test(web["Lead ID"]));
  assert.strictEqual(fb["SMS status"], "Sent"); assert.strictEqual(fb["Email status"], "Sent");
  const fbSms = env.sms.find(s => s.to === "+447900000111"), webSms = env.sms.find(s => s.to === "+447900000222");
  assert.strictEqual(fb["SMS ID"], fbSms.id);
  assert.strictEqual(web["SMS ID"], webSms.id, "the website row keeps its own SMS ID");
});

test("caller alert not accepted by ClickSend: 'Assigned to' stays blank (the row is still saved and the lead texted)", () => {
  const env = mkEnv();
  env.smsResult = to => (to === CALLER_SMS ? "INSUFFICIENT_CREDIT" : "SUCCESS");
  withLeads(env, [env.lead("3003", 1, fields("Al Smith", "+447900000003", ""))]);
  env.fn.pollMetaLeads();
  const r = env.rowObj(2);
  assert.strictEqual(r["Assigned to"], ""); assert.strictEqual(r["SMS status"], "Sent");
});

test("rotate mode: Assigned to = the caller who got it; ONCALL_MOBILE invalid -> skipped -> H3 alert", () => {
  const env = mkEnv({ props: { ONCALL_MOBILE: "07700900001,07700900002", ALERT_MODE: "rotate" } });
  withLeads(env, [env.lead("4001", 3, fields("A One", "+447900000041")), env.lead("4002", 2, fields("B Two", "+447900000042"))]);
  env.fn.pollMetaLeads();
  assert.strictEqual(env.rowObj(2)["Assigned to"], "07700900001"); assert.strictEqual(env.rowObj(3)["Assigned to"], "07700900002");
  const env2 = mkEnv({ props: { ONCALL_MOBILE: "0770" } });
  withLeads(env2, [env2.lead("4003", 1, fields("C Three", "+447900000043"))]);
  env2.fn.pollMetaLeads();
  assert.strictEqual(env2.rowObj(2)["Assigned to"], "");
  assert.ok(env2.mails.some(m => /^\[KD-P1\] Setting wrong: ONCALL_MOBILE/.test(m.subject)), "H3 alert");
  assert.ok(env2.ownerSms().some(s => /ONCALL_MOBILE is blank\/invalid/.test(s.body)));
});

test("out of hours: Status Call 8am, no caller alert, text says 'from 8am'", () => {
  const env = mkEnv({ now: "2026-11-10T22:30:00Z" });
  withLeads(env, [env.lead("5005", 1, fields("Night Owl", "+447900000005", "n@example.com"))]);
  env.fn.pollMetaLeads();
  const r = env.rowObj(2);
  assert.strictEqual(r.Status, "Call 8am"); assert.strictEqual(r["Assigned to"], "");
  assert.strictEqual(env.callerSms().length, 0);
  assert.ok(/will call you from 8am/.test(env.sms[0].body));
});

test("DO NOT CONTACT, repeat within 24 h (Duplicate) and older unreached repeat (REPEAT alert) keep their rules", () => {
  const env = mkEnv({ now: "2026-11-10T11:00:00Z" });
  env.row({ "Signup Time": env.minsAgo(5 * 1440), Name: "Nope", Phone: "07900000009", Status: "DO NOT CONTACT", "Lead ID": "W-1" });
  env.row({ "Signup Time": env.minsAgo(60), Name: "Recent", Phone: "07900000010", Status: "", "Lead ID": "W-2" });
  env.row({ "Signup Time": env.minsAgo(4 * 1440), Name: "Old", Phone: "07900000011", Status: "No answer", "Lead ID": "W-3" });
  withLeads(env, [env.lead("6001", 3, fields("Nope", "+447900000009", "x@example.com")), env.lead("6002", 2, fields("Recent", "+447900000010", "r@example.com")),
    env.lead("6003", 1, fields("Old", "+447900000011", "o@example.com"))]);
  env.fn.pollMetaLeads();
  const dnc = env.rowObj(5), dup = env.rowObj(6), rep = env.rowObj(7);
  assert.strictEqual(dnc.Status, "DO NOT CONTACT"); assert.strictEqual(dnc["SMS status"], ""); assert.strictEqual(dnc["Email status"], "");
  assert.ok(!env.sms.some(s => s.to === "+447900000009"), "DNC never texted");
  assert.strictEqual(dup.Status, "Duplicate"); assert.strictEqual(dup["Duplicate of"], "W-2"); assert.ok(/no text sent/.test(dup.Notes));
  assert.ok(!env.sms.some(s => s.to === "+447900000010"));
  assert.strictEqual(rep.Status, ""); assert.ok(/good news - you're already on/.test(env.sms.find(s => s.to === "+447900000011").body));
  assert.ok(env.callerSms().some(s => s.body.indexOf("REPEAT - NEW LEAD") === 0));
  assert.strictEqual(rep["Email status"], "", "repeats get no confirmation email");
});

test("email quota guard: 'Not sent: daily limit'", () => {
  const env = mkEnv(); env.quota = 10;
  withLeads(env, [env.lead("7007", 1, fields("Q Person", "+447900000007", "q@example.com"))]);
  env.fn.pollMetaLeads();
  assert.strictEqual(env.rowObj(2)["Email status"], "Not sent: daily limit");
  assert.strictEqual(env.rowObj(2)["SMS status"], "Sent", "texts still go out");
});

test("row write fails after the texts: next run writes the row only (nobody is texted twice)", () => {
  const env = mkEnv();
  let fails = 1;
  env.wl.onAppend = () => { if (fails-- > 0) throw new Error("Service Spreadsheets timed out"); };
  withLeads(env, [env.lead("8008", 2, fields("Retry Me", "+447900000008", "rm@example.com"))]);
  env.fn.pollMetaLeads();
  assert.strictEqual(env.dataRows().length, 0);
  assert.strictEqual(JSON.parse(env.props.HM_pollMetaLeads).ok, false, "not a clean run");
  const texts = env.sms.length;
  env.advance(1); env.fn.pollMetaLeads();
  assert.strictEqual(env.sms.length, texts, "no new texts on retry");
  assert.strictEqual(env.dataRows().length, 1);
  const r = env.rowObj(2);
  assert.strictEqual(r["Lead ID"], "8008"); assert.strictEqual(r["SMS status"], "Sent"); assert.strictEqual(r["Email status"], "Sent");
  assert.ok(r["Signup Time"] instanceof Date, "dates survive the retry store");
  assert.strictEqual(env.props.META_RETRY, "{}");
  assert.strictEqual(JSON.parse(env.props.HM_pollMetaLeads).ok, true);
});

test("a lead that keeps failing: retried on 2 more runs, then 'Failed leads' tab + one P1 (names in email, count-only text)", () => {
  const env = mkEnv();
  env.leadNames.push("Broken Betty");
  let reads = 0;
  env.wl.onRead = () => { if (++reads <= 3) throw new Error("Service Spreadsheets failed while accessing document"); };
  withLeads(env, [env.lead("9009", 2, fields("Broken Betty", "+447900000099", "bb@example.com"))]);
  env.fn.pollMetaLeads(); env.advance(1); env.fn.pollMetaLeads();
  assert.ok(!env.tab("Failed leads"), "not failed yet after 2 tries");
  assert.ok(JSON.parse(env.props.META_RETRY)["9009"]);
  env.advance(1); env.fn.pollMetaLeads();
  const fl = env.tab("Failed leads");
  assert.ok(fl && fl.rows.length === 2, "one Failed leads row");
  const h = fl.rows[0], row = fl.rows[1];
  assert.strictEqual(row[h.indexOf("Lead ID")], "9009"); assert.strictEqual(row[h.indexOf("Name")], "Broken Betty");
  assert.strictEqual(row[h.indexOf("Already texted?")], "No - not texted yet");
  assert.ok(row[h.indexOf("Alerted at")] instanceof Date, "marked alerted after sending");
  const p1 = env.mails.filter(m => /^\[KD-P1\] A Facebook lead is not in the Waiting list/.test(m.subject));
  assert.strictEqual(p1.length, 2, "one per HEALTH_EMAIL address");
  assert.ok(p1[0].body.indexOf("Broken Betty") !== -1, "name in the email");
  assert.strictEqual(env.ownerSms().length, 1);
  assert.strictEqual(env.ownerSms()[0].body, "KD P1: 1 Facebook lead not in the sheet. Names in your email and the Failed leads tab. Call them first. Plan R3");
  env.checkOwnerSms();
  assert.strictEqual(env.props.META_RETRY, "{}");
  assert.ok(JSON.parse(env.props.META_SEEN).indexOf("9009") !== -1);
  env.advance(1); env.fn.pollMetaLeads();
  assert.strictEqual(env.tab("Failed leads").rows.length, 2, "not reported twice");
  assert.strictEqual(env.mails.filter(m => /not in the Waiting list/.test(m.subject)).length, 2);
});

test("Meta error: META_LAST_ERR kept (with first-seen time), progress unchanged, not clean; cleared on the next clean run", () => {
  const env = mkEnv();
  env.meta.error = { http: 400, code: 190, message: "Error validating access token" };
  const before = env.props.META_SINCE_BY_FORM;
  env.fn.pollMetaLeads(); env.advance(1); env.fn.pollMetaLeads();
  const e = JSON.parse(env.props.META_LAST_ERR);
  assert.strictEqual(e.code, 190); assert.strictEqual(e.form, "F1"); assert.ok(e.last - e.first === 60000, "first-seen kept");
  assert.strictEqual(env.props.META_SINCE_BY_FORM, before);
  const j = JSON.parse(env.props.HM_pollMetaLeads);
  assert.strictEqual(j.ok, false); assert.ok(/^meta:/.test(j.err));
  assert.strictEqual(env.mails.length, 0, "with health.gs the poller itself doesn't email; H2 decides");
  env.meta.error = null; env.advance(1); env.fn.pollMetaLeads();
  assert.strictEqual(env.props.META_LAST_ERR, undefined);
  assert.strictEqual(JSON.parse(env.props.HM_pollMetaLeads).ok, true);
});

test("header row broken: the poller stops BEFORE reading any lead (nothing marked seen) and H4 alerts P1", () => {
  const env = mkEnv();
  env.wl.rows[0][env.H("Status")] = "Status x";
  withLeads(env, [env.lead("1101", 2, fields("Hdr Test", "+447900000101"))]);
  env.fn.pollMetaLeads();
  assert.ok(!env.fetches.some(u => /\/leads\?/.test(u)), "no lead fetched");
  assert.strictEqual(env.props.META_SEEN, undefined);
  assert.ok(env.mails.some(m => /^\[KD-P1\] Waiting list header row changed \(Status missing\)/.test(m.subject)));
  assert.strictEqual(env.ownerSms()[0].body, "KD P1: Waiting list header row changed (Status missing). Lead scripts stopped to avoid misfiling. Restore row 1 (register row 23).");
  assert.ok(/^sheet:/.test(JSON.parse(env.props.HM_pollMetaLeads).err));
  env.wl.rows[0][env.H("Status x")] = "Status";
  env.advance(1); env.fn.pollMetaLeads();
  assert.strictEqual(env.dataRows().length, 1, "collected once row 1 is fixed");
});

test("blank META_PAGE_TOKEN: an alert, not a silent return", () => {
  const env = mkEnv({ props: { META_PAGE_TOKEN: "" } });
  env.fn.pollMetaLeads();
  assert.ok(env.mails.some(m => /Setting wrong: META_PAGE_TOKEN/.test(m.subject)));
  assert.ok(/^config:/.test(JSON.parse(env.props.HM_pollMetaLeads).err));
  const env2 = mkEnv({ only: ["leaflet/apps-script.gs", "leads/meta-leads.gs"], props: { META_FORM_IDS: "" } });
  env2.fn.pollMetaLeads();
  assert.ok(env2.mails.some(m => /NOT being read/.test(m.subject)), "fallback email without health.gs");
});

test("a NEW form ID is read from its created_time (not 'now - 1 h'); META_LEAD_FIELDS replaces the field list", () => {
  const env = mkEnv({ props: { META_SINCE_BY_FORM: "{}", META_LEAD_FIELDS: "id,field_data,form_id" } });
  env.meta.forms.F1.created_time = new Date(env.clock.now - 3 * 86400e3).toISOString();
  withLeads(env, [env.lead("1201", 2 * 1440, fields("Early Bird", "+447900000121"))]);
  env.fn.pollMetaLeads();
  assert.strictEqual(env.lastLeadsFilter, Math.floor((env.clock.now - 3 * 86400e3) / 1000) - 900);
  assert.strictEqual(env.dataRows().length, 1, "2-day-old lead collected");
  assert.strictEqual(env.lastLeadsFields, "created_time,id,field_data,form_id");
  assert.strictEqual(JSON.parse(env.props.META_SINCE_BY_FORM).F1, Math.floor(Date.parse(env.meta.forms.F1.leads[0].created_time) / 1000));
});

test("morningSummary: plain ASCII text; heartbeat", () => {
  const env = mkEnv({ now: "2026-11-10T08:00:00Z" });
  env.row({ "Signup Time": env.minsAgo(600), Name: "N", Status: "Call 8am", "Lead ID": "1" });
  env.row({ "Signup Time": env.minsAgo(500), Name: "M", Status: "Call 8am", "Lead ID": "2" });
  env.fn.morningSummary();
  assert.strictEqual(env.callerSms()[0].body, "Good morning - 2 overnight leads to call. Filter the Waiting List sheet by Status = \"Call 8am\".");
  assert.ok(env.props.HM_morningSummary);
});

test("backlogCheck runs H5 (warning at HEALTH_BACKLOG, wording: add a caller) and marks itself", () => {
  const env = mkEnv({ now: "2026-11-10T14:00:00Z", props: { HEALTH_BACKLOG: "1" } });
  env.row({ "Signup Time": env.minsAgo(70), Name: "Waiting", Status: "", "Lead ID": "W-9" });   // fire drill 6
  env.fn.backlogCheck();
  const m = env.mails.find(x => /^\[KD-P2\] 1 lead waiting over 1h/.test(x.subject));
  assert.ok(m, "P2 backlog email");
  assert.ok(/Add a caller now/.test(m.body) && /Only if nobody at all is available to call: lower the campaign budget/.test(m.body));
  assert.ok(JSON.parse(env.props.HM_backlogCheck).ok);
});

test("eveningReport counts Unreachable, Withdrew, Wrong number, Not interested; shows version and open alerts", () => {
  const env = mkEnv({ now: "2026-11-10T21:00:00Z" });
  ["Unreachable", "Withdrew", "Wrong number", "Not interested", "Called", "Booked"].forEach((s, i) => env.row({ "Signup Time": env.minsAgo(60 + i), Name: "P" + i, Status: s, Source: "facebook", "Lead ID": String(i) }));
  env.fn.healthAlert("P2", "SOMETHING", "Something open", "x");
  env.mails.length = 0;
  env.fn.eveningReport();
  const b = env.mails[0].body;
  ["Unreachable: 1", "Withdrew: 1", "Wrong number: 1", "Not interested: 1", "Called: 1", "Booked: 1", "Open alerts: [P2] Something open", "Script version: " + env.get("HEALTH_VERSION")].forEach(s => assert.ok(b.indexOf(s) !== -1, "has " + s + "\n" + b));
  assert.ok(env.props.HM_eveningReport);
});

if (require.main === module) run();
