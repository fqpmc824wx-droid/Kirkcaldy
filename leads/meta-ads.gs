/**
 * Kirkcaldy Dental – daily Meta ad results + ad health checks (ads chat).
 * Same Apps Script project as apps-script.gs and meta-leads.gs. Every name here starts with "ads".
 * Uses from meta-leads.gs: metaGraph(), healthNotifyOnce(), leadsSheet(), inCallHours(), callWindow().
 * Alerts go through healthAlert() (leads/health.gs) when it's in the project – P1 = email + text to the owner, P2 = email –
 * and fall back to healthNotifyOnce() without it. health.gs runs adsStatusCheck every hour 07:00–23:00 (check H12).
 *
 * What it does
 *   adsPullInsights()  daily 06:00  – last 7 days of spend/leads/CPM/frequency/video per ad → "Ads" tab
 *                                     (all 7 days re-written each run, because Meta revises recent days),
 *                                     then fills blank "Ad name" cells in the Waiting list, then adsKpiAlarms().
 *   adsWeeklyPull()    Mon 06:30    – placement / age-gender / region breakdowns, quality rankings, audience size
 *                                     → "Ads weekly"; Meta's change history → "Meta change log".
 *   adsStatusCheck()   every 2h     – (08:00–21:00 only; hourly 07–23 via health.gs H12) account status, rejected ads,
 *                                     no campaign running, £0 / over-spend, unknown campaign, budget changed, festive limit,
 *                                     spend cap → healthAlert (P1/P2), "Ad status" tab.
 *   adsKpiAlarms()                  – after each daily pull: cost per lead too high, frequency too high,
 *                                     leads missing from the sheet, too few leads, under-spending.
 *
 * INSTALL (setup night, runbook Step 5):
 *   Script Properties:
 *     META_ADS_TOKEN     = System User token with ads_read (leave empty to reuse META_PAGE_TOKEN if it has ads_read)
 *     META_AD_ACCOUNT_ID = act_XXXXXXXXXXXX   (Ads Manager → account dropdown; add "act_" in front of the number)
 *     LAUNCH_DATE        = yyyy-mm-dd, the day the ads went live
 *     SPEND_MULTIPLIER   = 1.224 (optional; 2% UK location fee + 20% VAT that can't be reclaimed)
 *     CPL_ALARM          = 5     (optional; warning above this £ per lead, 3-day average, before VAT; owner decision £5)
 *     CPL_PAUSE          = 8     (optional; "pause the ads" above this; owner decision £8)
 *   Then run adsInstallTriggers() once.
 */

var ADS_TAB = "Ads", ADS_WEEKLY_TAB = "Ads weekly", ADS_STATUS_TAB = "Ad status", ADS_CHANGES_TAB = "Meta change log";
var ADS_HEADERS = ["Date", "Campaign ID", "Campaign", "Ad set ID", "Ad set", "Ad ID", "Ad name",
  "Spend", "Spend inc fee+VAT", "Impressions", "Reach", "Frequency", "CPM", "Clicks (all)", "CTR (all) %",
  "Link clicks", "Link CTR %", "Cost per link click", "Leads (Meta)", "CPL (Meta)",
  "3s plays", "ThruPlays", "p25", "p50", "p75", "p100", "Avg watch (s)",
  "Post engagement", "Reactions", "Comments", "Shares", "Saves", "Pulled at", "All actions (raw)"];

function adsInstallTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (["adsPullInsights", "adsWeeklyPull", "adsStatusCheck"].indexOf(t.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("adsPullInsights").timeBased().atHour(6).nearMinute(0).everyDays(1).inTimezone("Europe/London").create();
  ScriptApp.newTrigger("adsWeeklyPull").timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(6).nearMinute(30).inTimezone("Europe/London").create();
  ScriptApp.newTrigger("adsStatusCheck").timeBased().everyHours(2).create();
  var acct = adsAccount();
  if (!acct) throw new Error("Set Script Property META_AD_ACCOUNT_ID (act_…) first, then run again.");
  var info = adsGraphGet(acct, { fields: "name,timezone_name,currency,account_status" })[0] || {};
  console.log("Ad account: " + info.name + " | time zone " + info.timezone_name + " | " + info.currency + " | status " + info.account_status);
  if (info.timezone_name && info.timezone_name !== "Europe/London") console.warn("Ad account time zone is " + info.timezone_name + " – the Ads tab days follow it.");
  if (info.currency && info.currency !== "GBP") console.warn("Ad account currency is " + info.currency + ", not GBP.");
  adsStatusCheck(true);
}

// ---------- helpers ----------
function adsProps() { return PropertiesService.getScriptProperties(); }
function adsAccount() {
  var a = String(adsProps().getProperty("META_AD_ACCOUNT_ID") || "").trim();
  if (!a) return "";
  return /^act_/.test(a) ? a : "act_" + a.replace(/\D/g, "");
}
function adsToken() { var p = adsProps(); return p.getProperty("META_ADS_TOKEN") || p.getProperty("META_PAGE_TOKEN") || ""; }

// Every ads alert goes through healthAlert (health.gs) when it's installed; otherwise the old 3-hourly email.
// body = string or {what, affects, todo, plan}; opts as healthAlert (sms text for P1, sig, ...).
function adsAlert(level, key, subject, body, opts) {
  if (typeof healthAlert === "function") return healthAlert(level, key, subject, body, opts);
  var b = typeof body === "string" ? body : [body.what, body.affects, body.todo].filter(Boolean).join("\n\n");
  healthNotifyOnce(key, "[KD-" + (level === "P1" ? "P1" : "P2") + "] " + subject, b + "\n\nWaiting List sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}
function adsResolve(key) { if (typeof healthResolve === "function") healthResolve(key); }
// "2026-12-24", "2026-12-24 18:00" (London) or anything Date understands -> Date, else null
function adsWhen(v) {
  v = String(v || "").trim();
  if (!v) return null;
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return new Date(Utilities.parseDate(v, "Europe/London", "yyyy-MM-dd").getTime() + 864e5 - 6e4);
    if (/^\d{4}-\d{2}-\d{2}[ T]\d{1,2}:\d{2}$/.test(v)) return Utilities.parseDate(v.replace("T", " "), "Europe/London", "yyyy-MM-dd HH:mm");
  } catch (e) {}
  var t = Date.parse(v);
  return isNaN(t) ? null : new Date(t);
}

// GET with paging. Returns the list of rows (data[]), or [object] for single-object calls. null on error (owner emailed).
function adsGraphGet(path, params) {
  var token = adsToken();
  if (!token) return null;
  var q = Object.keys(params || {}).map(function (k) {
    var v = params[k]; return k + "=" + encodeURIComponent(typeof v === "string" ? v : JSON.stringify(v));
  });
  q.push("access_token=" + encodeURIComponent(token));
  var url = metaGraph() + path + "?" + q.join("&"), out = [], pages = 0;
  while (url && pages++ < 50) {
    var res;
    try { res = UrlFetchApp.fetch(url, { muteHttpExceptions: true }); }
    catch (e) { throw new Error(String(e && e.message || e).replace(/(access_token=)[^&\s"']+/gi, "$1***")); }   // network errors quote the URL (token)
    if (res.getResponseCode() !== 200) {
      console.error("Meta ads API " + res.getResponseCode() + " " + path + ": " + res.getContentText());
      var shared = !adsProps().getProperty("META_ADS_TOKEN");      // empty = the same token the lead checker uses
      adsAlert("P2", "ADS_API_ERR_LAST", "Ad results can't be read from Meta (" + res.getResponseCode() + ")", {
        what: "The ad-results script couldn't read " + path + " (HTTP " + res.getResponseCode() + "): " + res.getContentText().slice(0, 800),
        affects: (shared ? "META_ADS_TOKEN is empty, so this is the SAME token the Facebook lead checker uses: if it's error 190 (token wrong or expired), " +
          "new Facebook/Instagram leads have stopped too - check for a 'Facebook lead checker' or 'Meta lead token' alert. "
          : "The ads use their own token (META_ADS_TOKEN), so Facebook leads should still arrive - the lead checker's own alerts say if not. ") +
          "The Ads tab and the ad alarms are paused until it's fixed.",
        todo: "Error 190 = token wrong or expired (make a new System User token). Error 10/200/294 = the token is missing ads_read, or the System User isn't assigned to the ad account (View performance)."
      }, { event: true });
      return null;
    }
    var body = JSON.parse(res.getContentText());
    if (body.data && Object.prototype.toString.call(body.data) === "[object Array]") { out = out.concat(body.data); url = body.paging && body.paging.next; }
    else { out.push(body); url = null; }
  }
  return out;
}

function adsAction(arr, types) {
  types = [].concat(types);
  for (var t = 0; t < types.length; t++)
    for (var i = 0; i < (arr || []).length; i++) if (arr[i].action_type === types[t]) return Number(arr[i].value) || 0;
  return 0;
}
function adsNum(v) { var n = Number(v); return isFinite(n) ? n : 0; }
function adsDay(d) { return Utilities.formatDate(d, "Europe/London", "yyyy-MM-dd"); }
function adsDate(ymd) { return Utilities.parseDate(ymd, "Europe/London", "yyyy-MM-dd"); }

function adsTab(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(headers); sh.setFrozenRows(1); }
  return sh;
}

// ---------- daily pull ----------
function adsPullInsights() {
  var t0 = Date.now(), acct = adsAccount(), mark = function (ok) { if (typeof healthMark === "function") healthMark("adsPullInsights", ok, Date.now() - t0); };
  if (!acct || !adsToken()) { mark(true); return; }
  var rows = adsGraphGet(acct + "/insights", {
    level: "ad", time_increment: "1", date_preset: "last_7d", action_report_time: "conversion", limit: "500",
    fields: "date_start,campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,spend,impressions,reach,frequency,cpm," +
      "clicks,ctr,inline_link_clicks,inline_link_click_ctr,cost_per_inline_link_click,actions," +
      "video_thruplay_watched_actions,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions," +
      "video_p100_watched_actions,video_avg_time_watched_actions"
  });
  if (rows === null) { mark(false); return; }
  var mult = Number(adsProps().getProperty("SPEND_MULTIPLIER") || 1.224), now = new Date();
  var v0 = function (a) { return a && a[0] ? adsNum(a[0].value) : 0; };
  var lines = rows.map(function (r) {
    var spend = adsNum(r.spend), leads = adsAction(r.actions, ["onsite_conversion.lead_grouped", "lead", "leadgen_grouped"]);
    return [adsDate(r.date_start), "'" + r.campaign_id, r.campaign_name, "'" + r.adset_id, r.adset_name, "'" + r.ad_id, r.ad_name,
      spend, Math.round(spend * mult * 100) / 100, adsNum(r.impressions), adsNum(r.reach), adsNum(r.frequency), adsNum(r.cpm),
      adsNum(r.clicks), adsNum(r.ctr), adsNum(r.inline_link_clicks), adsNum(r.inline_link_click_ctr), adsNum(r.cost_per_inline_link_click),
      leads, leads ? Math.round(spend / leads * 100) / 100 : "",
      adsAction(r.actions, "video_view"), v0(r.video_thruplay_watched_actions), v0(r.video_p25_watched_actions), v0(r.video_p50_watched_actions),
      v0(r.video_p75_watched_actions), v0(r.video_p100_watched_actions), v0(r.video_avg_time_watched_actions),
      adsAction(r.actions, "post_engagement"), adsAction(r.actions, "post_reaction"), adsAction(r.actions, "comment"),
      adsAction(r.actions, "post"), adsAction(r.actions, "onsite_conversion.post_save"), now,
      JSON.stringify((r.actions || []).reduce(function (o, a) { o[a.action_type] = adsNum(a.value); return o; }, {})).slice(0, 2000)];
  });
  // upsert: drop the dates Meta just returned (plus the whole 7-day window), then write back sorted
  var sh = adsTab(ADS_TAB, ADS_HEADERS), data = sh.getDataRange().getValues(), keep = [], drop = {};
  for (var d = 1; d <= 7; d++) drop[adsDay(new Date(now.getTime() - d * 864e5))] = true;
  lines.forEach(function (l) { drop[adsDay(l[0])] = true; });
  for (var i = 1; i < data.length; i++) if (!(data[i][0] instanceof Date) || !drop[adsDay(data[i][0])]) keep.push(data[i]);
  var all = keep.concat(lines).sort(function (a, b) { return (a[0] instanceof Date ? a[0].getTime() : 0) - (b[0] instanceof Date ? b[0].getTime() : 0); });
  if (data.length > 1) sh.getRange(2, 1, data.length - 1, ADS_HEADERS.length).clearContent();
  if (all.length) sh.getRange(2, 1, all.length, ADS_HEADERS.length).setValues(all.map(function (r) {
    r = r.slice(0, ADS_HEADERS.length); while (r.length < ADS_HEADERS.length) r.push(""); return r; }));
  adsBackfillAdNames(all);
  adsPullReach();
  SpreadsheetApp.flush();
  adsKpiAlarms();
  mark(true);
}

// One row per ad set per day: rolling 7-day reach/frequency and reach since launch -> "Ads 7-day" tab.
function adsPullReach() {
  var acct = adsAccount(), p = adsProps();
  if (!acct) return;
  var asOf = adsDate(adsDay(new Date(Date.now() - 864e5))), launch = p.getProperty("LAUNCH_DATE");
  var r7 = adsGraphGet(acct + "/insights", { level: "adset", date_preset: "last_7d", fields: "adset_id,adset_name,spend,impressions,reach,frequency,inline_link_clicks,actions" }) || [];
  var toDate = {};
  if (launch && adsDate(launch) <= asOf)
    (adsGraphGet(acct + "/insights", { level: "adset", time_range: { since: launch, until: adsDay(asOf) }, fields: "adset_id,reach,frequency,impressions,spend" }) || [])
      .forEach(function (r) { toDate[r.adset_id] = r; });
  var H = ["As of", "Ad set ID", "Ad set", "7d spend", "7d impressions", "7d reach", "7d frequency", "7d link clicks", "7d leads (Meta)", "Reach to date", "Frequency to date", "Pulled at"];
  var sh = adsTab("Ads 7-day", H), maxF = 0;
  var rows = r7.map(function (r) {
    var t = toDate[r.adset_id] || {}; maxF = Math.max(maxF, adsNum(r.frequency));
    return [asOf, "'" + r.adset_id, r.adset_name, adsNum(r.spend), adsNum(r.impressions), adsNum(r.reach), adsNum(r.frequency), adsNum(r.inline_link_clicks),
      adsAction(r.actions, ["onsite_conversion.lead_grouped", "lead", "leadgen_grouped"]), adsNum(t.reach), adsNum(t.frequency), new Date()];
  });
  var data = sh.getDataRange().getValues(), key = adsDay(asOf), keep = [];
  for (var i = 1; i < data.length; i++) if (!(data[i][0] instanceof Date) || adsDay(data[i][0]) !== key) keep.push(data[i]);   // re-runs replace the day
  var all = keep.concat(rows);
  if (data.length > 1) sh.getRange(2, 1, data.length - 1, H.length).clearContent();
  if (all.length) sh.getRange(2, 1, all.length, H.length).setValues(all);
  p.setProperty("ADS_FREQ_7D", String(maxF));
}

// Fill blank "Ad name" cells in the Waiting list from the Ads tab (matched on Ad ID).
function adsBackfillAdNames(adRows) {
  var names = {};
  adRows.forEach(function (r) { names[String(r[5]).replace(/^'/, "")] = r[6]; });
  var sh = leadsSheet(), data = sh.getDataRange().getValues(), h = data[0].map(String);
  var ic = h.indexOf("Ad ID"), nc = h.indexOf("Ad name");
  if (ic === -1 || nc === -1) return;
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][ic]).replace(/^'/, "");
    if (id && !data[i][nc] && names[id]) sh.getRange(i + 1, nc + 1).setValue(names[id]);
  }
}

// Facebook/Instagram sign-ups in the sheet per day (unique, paid): Source facebook/instagram, not Organic, not Duplicate.
function adsSheetMetaLeadsByDay() {
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String), out = {};
  var tc = h.indexOf("Signup Time"), src = h.indexOf("Source"), oc = h.indexOf("Organic?"), sc = h.indexOf("Status");
  if (tc === -1 || src === -1) return out;
  for (var i = 1; i < data.length; i++) {
    var t = data[i][tc], so = String(data[i][src]).toLowerCase();
    if (!(t instanceof Date) || (so !== "facebook" && so !== "instagram")) continue;
    if (oc !== -1 && String(data[i][oc]) === "Yes") continue;
    if (sc !== -1 && String(data[i][sc]) === "Duplicate") continue;
    var k = adsDay(t); out[k] = (out[k] || 0) + 1;
  }
  return out;
}

// Per-day totals from the Ads tab: {ymd: {spend, leads, impressions}}
function adsTotalsByDay() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ADS_TAB), out = {};
  if (!sh) return out;
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (!(data[i][0] instanceof Date)) continue;
    var k = adsDay(data[i][0]); out[k] = out[k] || { spend: 0, leads: 0, impressions: 0 };
    out[k].spend += adsNum(data[i][7]); out[k].leads += adsNum(data[i][18]); out[k].impressions += adsNum(data[i][9]);
  }
  return out;
}

// ---------- alarms after the daily pull ----------
// Bodies are {what, affects, todo}: healthAlert adds the sheet link and the plain-English layout.
function adsKpiAlarms() {
  var p = adsProps(), now = new Date(), byDay = adsTotalsByDay(), sheetBy = adsSheetMetaLeadsByDay(), launch = p.getProperty("LAUNCH_DATE");
  var day = function (n) { return adsDay(new Date(now.getTime() - n * 864e5)); };
  var daysLive = launch ? Math.floor((now - adsDate(launch)) / 864e5) : 99;
  // 1. cost per lead, last 3 full days (spend ÷ unique paid sheet leads). Owner decision: warning above £5, pause above £8.
  var sp = 0, ld = 0;
  for (var d = 1; d <= 3; d++) { sp += (byDay[day(d)] || {}).spend || 0; ld += sheetBy[day(d)] || 0; }
  var cplAlarm = Number(p.getProperty("CPL_ALARM") || 5), cplPause = Number(p.getProperty("CPL_PAUSE") || 8);
  var cplTxt = ld ? "£" + (sp / ld).toFixed(2) : "£" + sp.toFixed(2) + " spent, 0 leads";
  var last3 = "Last 3 days: £" + sp.toFixed(2) + " spent (before VAT), " + ld + " Facebook/Instagram sign-ups in the Waiting list.";
  if (daysLive >= 3 && sp >= 30 && (ld === 0 || sp / ld > cplPause))
    adsKpiAlert("ADS_CPL5_LAST", "⛔ PAUSE the ads: cost per lead over £" + cplPause + " (" + cplTxt + ")", {
      what: last3 + " That's over the £" + cplPause + " pause level.",
      affects: "The budget is buying very few sign-ups.",
      todo: "Pause the campaign in Ads Manager, then ask the ads chat to rebuild the ad or the form. Don't add money."
    });
  else if (daysLive >= 3 && sp >= 30 && (ld === 0 || sp / ld > cplAlarm))
    adsKpiAlert("ADS_CPL_LAST", "⚠️ Cost per lead is high: " + cplTxt, {
      what: last3 + " That's over the £" + cplAlarm + " warning level.",
      affects: "Each sign-up costs more than planned.",
      todo: "Ask the ads chat to fix the ad or the form (don't add money). Over £" + cplPause + " for 3 days: pause the campaign."
    });
  // 2. leads Meta counted yesterday but missing from the sheet (the lead script or token is failing)
  var mY = (byDay[day(1)] || {}).leads || 0, sY = sheetBy[day(1)] || 0;
  if (mY - sY >= 2 && (mY - sY) / Math.max(mY, 1) > 0.1)
    adsKpiAlert("ADS_SYNC_LAST", "⚠️ " + (mY - sY) + " Facebook leads from yesterday are missing from the sheet", {
      what: "Meta counted " + mY + " leads yesterday, but the Waiting list has " + sY + " paid Facebook/Instagram rows.",
      affects: "Real people may have filled in the form without reaching the Waiting list, so nobody calls them.",
      todo: "Download yesterday's leads (Meta Business Suite > Instant Forms > the form > Download leads) and add anyone missing by hand. " +
        "Then check Apps Script > Executions for pollMetaLeads errors, that the Meta app is Live, and Leads access."
    });
  // 3. too few leads for 3 days after day 4
  if (daysLive >= 4 && [1, 2, 3].every(function (n) { return (sheetBy[day(n)] || 0) < 3 && ((byDay[day(n)] || {}).spend || 0) > 0; }))
    adsKpiAlert("ADS_LOWLEADS_LAST", "⚠️ Fewer than 3 Facebook sign-ups a day for 3 days", {
      what: "Each of the last 3 days had fewer than 3 Facebook/Instagram sign-ups while the ads were spending.",
      affects: "Few new people are joining the waiting list.",
      todo: "Check the ads are approved and delivering (Ads Manager), submit a test through the form, and look for any 'lead checker' or 'Meta' alert emails."
    });
  // 4. under-spending 2 days running (needs the budget seen by adsStatusCheck)
  var budget = Number(p.getProperty("ADS_DAILY_BUDGET") || 0);
  if (budget && daysLive >= 2 && [1, 2].every(function (n) { return ((byDay[day(n)] || {}).spend || 0) < 0.5 * budget; }))
    adsKpiAlert("ADS_PACING_LAST", "⚠️ Ads spent under half the budget 2 days running", {
      what: "Daily budget £" + budget + ". Yesterday £" + (((byDay[day(1)] || {}).spend) || 0).toFixed(2) + " was spent.",
      affects: "Fewer people see the ads than planned.",
      todo: "Check Ads Manager: usually a rejected ad, a payment problem or an audience that's too small."
    });
  // 5. frequency (7-day, ad set level, stored daily by adsPullReach)
  var freq = Number(p.getProperty("ADS_FREQ_7D") || 0);
  if (daysLive >= 7 && freq > 3)
    adsKpiAlert("ADS_FREQ_LAST", "⚠️ Ads are being seen too often (frequency " + freq.toFixed(1) + ")", {
      what: "People in the area have seen the ads " + freq.toFixed(1) + " times on average this week.",
      affects: "People start to ignore an ad they've seen many times, so each sign-up costs more.",
      todo: "Ask the ads chat for 1-2 fresh versions of the winning ad."
    });
  // 6. fatigue: an ad's 3-day link click rate under 0.8% (2,000+ views), or under 60% of its own first 7 days
  var tired = adsFatigue();
  if (tired.length)
    adsKpiAlert("ADS_FATIGUE_LAST", "⚠️ An ad is getting tired: " + tired.map(function (t) { return t.name; }).join(", "), {
      what: tired.map(function (t) { return t.name + ": link click rate " + t.ctr3.toFixed(2) + "% in the last 3 days (first week " + t.ctr1.toFixed(2) + "%)"; }).join("\n"),
      affects: "Fewer people click the ad, so each sign-up costs more.",
      todo: "Ask the ads chat for a fresh version of this ad."
    });
  // 7. spend running ahead of the plan (only if the leaflet chat's KPIs tab defines KPI_PLAN_CUM)
  var plan = adsNamed("KPI_PLAN_CUM");
  if (plan && launch) {
    var cum = 0; Object.keys(byDay).forEach(function (k) { if (k >= launch && k < day(0)) cum += byDay[k].spend; });
    if (cum > plan * 1.1) adsKpiAlert("ADS_OVERPLAN_LAST", "⚠️ Ad spend is more than 10% over the plan", {
      what: "Spent £" + cum.toFixed(2) + " since launch against a plan of £" + Number(plan).toFixed(2) + " (before VAT).",
      affects: "The ads budget runs out sooner than planned.",
      todo: "Check the budget in Ads Manager."
    });
  }
  // 8. more sign-ups than the callers can ring: add a caller (owner: staff are available)
  var callers = String(p.getProperty("ONCALL_MOBILE") || "").split(",").filter(function (x) { return x.trim(); }).length || 1;
  var allBy = adsAllSignupsByDay();
  if ([1, 2].every(function (n) { return (allBy[day(n)] || 0) > 25 * callers; }))
    adsKpiAlert("ADS_CALLERS_LAST", "☎️ Add a caller: " + (allBy[day(1)] || 0) + " sign-ups yesterday for " + callers + " caller" + (callers > 1 ? "s" : ""), {
      what: "Sign-ups have been above " + 25 * callers + " a day (about 25 per caller) for 2 days.",
      affects: "Callers can't ring everyone within the hour, so people wait longer.",
      todo: "Add another caller: Script Property ONCALL_MOBILE = all callers' mobiles, comma-separated, and ALERT_MODE = rotate."
    });
}

// The daily KPI alarms are one-off warnings (P2, at most every 3 h per key, never left "open").
function adsKpiAlert(key, subject, body) { return adsAlert("P2", key, subject, body, { event: true }); }

function adsNamed(name) {
  try { var r = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(name); var v = r ? Number(r.getValue()) : 0; return isFinite(v) ? v : 0; }
  catch (e) { return 0; }
}

// Ads whose last-3-day link click rate is weak, from the Ads tab.
function adsFatigue() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ADS_TAB);
  if (!sh) return [];
  var data = sh.getDataRange().getValues(), now = Date.now(), ads = {};
  for (var i = 1; i < data.length; i++) {
    var d = data[i][0]; if (!(d instanceof Date)) continue;
    var id = String(data[i][5]), a = ads[id] = ads[id] || { name: data[i][6], first: null, rows: [] };
    a.rows.push({ t: d.getTime(), imp: adsNum(data[i][9]), lc: adsNum(data[i][15]) });
    a.first = a.first === null ? d.getTime() : Math.min(a.first, d.getTime());
  }
  var out = [];
  Object.keys(ads).forEach(function (id) {
    var a = ads[id], i3 = 0, c3 = 0, i1 = 0, c1 = 0;
    a.rows.forEach(function (r) {
      if (now - r.t <= 3.5 * 864e5) { i3 += r.imp; c3 += r.lc; }
      if (r.t - a.first < 7 * 864e5) { i1 += r.imp; c1 += r.lc; }
    });
    if (i3 < 2000) return;
    var ctr3 = 100 * c3 / i3, ctr1 = i1 ? 100 * c1 / i1 : 0, ageDays = (now - a.first) / 864e5;
    if (ctr3 < 0.8 || (ageDays >= 10 && ctr1 > 0 && ctr3 < 0.6 * ctr1)) out.push({ name: a.name, ctr3: ctr3, ctr1: ctr1 });
  });
  return out;
}

// All sign-ups per day (every source), unique (not Duplicate).
function adsAllSignupsByDay() {
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String), out = {};
  var tc = h.indexOf("Signup Time"), sc = h.indexOf("Status");
  for (var i = 1; i < data.length; i++) {
    var t = data[i][tc]; if (!(t instanceof Date)) continue;
    if (sc !== -1 && String(data[i][sc]) === "Duplicate") continue;
    var k = adsDay(t); out[k] = (out[k] || 0) + 1;
  }
  return out;
}

// People on the waiting list now: "No. of People" summed over rows that aren't duplicates or opted out ("4+" counts as 4, blank as 1).
function adsPeopleOnList() {
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String), n = 0, rows = 0;
  var pc = h.indexOf("No. of People"), sc = h.indexOf("Status"), tc = h.indexOf("Signup Time");
  var skip = { "DUPLICATE": 1, "DO NOT CONTACT": 1, "NOT INTERESTED": 1, "WRONG NUMBER": 1, "WITHDREW": 1 };
  for (var i = 1; i < data.length; i++) {
    if (tc !== -1 && !(data[i][tc] instanceof Date)) continue;
    if (sc !== -1 && skip[String(data[i][sc]).trim().toUpperCase()]) continue;
    var m = String(pc === -1 ? "" : data[i][pc]).match(/\d+/);
    n += m ? Number(m[0]) : 1; rows++;
  }
  return { people: n, households: rows };
}

// ---------- every hour (health.gs H12, 07:00–23:00), or every 2h in calling hours without health.gs: are the ads healthy? ----------
// Alerts go through healthAlert (P1 = email + text to the owner, P2 = email) with the keys below; each is resolved when it clears.
function adsStatusCheck(force) {
  if (force !== true) {
    if (!inCallHours(new Date())) return;
    if (typeof healthJob === "function") {             // health.gs already runs this every hour (H12): nothing to add
      var hh = healthJob("healthHourly");
      if (hh && Date.now() - hh.last < 70 * 6e4) return;
    }
  }
  var acct = adsAccount();
  if (!acct || !adsToken()) return;
  var p = adsProps(), now = new Date(), log = [];
  var last = JSON.parse(p.getProperty("ADS_STATUS_LAST") || "{}"), today = adsDay(now), hour = Number(Utilities.formatDate(now, "Europe/London", "H"));
  var hm = function (t) { return Utilities.formatDate(new Date(t), "Europe/London", "HH:mm"); };
  var note = function (check, id, name, value, detail) {
    var key = check + "|" + id, firstToday = last._day !== today;
    if (firstToday || last[key] !== String(value)) log.push([now, check, "'" + id, name, value, detail || ""]);
    last[key] = String(value);
  };
  // account
  var a = (adsGraphGet(acct, { fields: "name,account_status,disable_reason,amount_spent,spend_cap,currency" }) || [])[0];
  if (a) {
    note("Account status", acct, a.name, a.account_status, a.disable_reason ? "disable_reason " + a.disable_reason : "");
    var as = Number(a.account_status), asName = adsAccountStatusName(as);
    if (as !== 1) adsAlert("P1", "ADS_ACCOUNT_LAST", "Meta ad account problem (status " + as + ": " + asName + ")", {
      what: "Meta reports the ad account as status " + as + " (" + asName + ")" + (a.disable_reason ? ", reason code " + a.disable_reason : "") + ". Status 1 = active.",
      affects: "The ads have stopped (or will stop) - no new Facebook/Instagram leads.",
      todo: as === 3 || as === 9 || as === 8 ? "Ads Manager > Billing & payments: pay the balance, or add the backup card." :
        "Ads Manager > Account overview / Account quality: follow Meta's steps (request a review if offered). Don't create a new account.",
      plan: as === 3 || as === 9 || as === 8 ? "R2" : "R10"
    }, { sig: String(as), short: "ad account status " + as,
      sms: "KD P1: Meta ad account status " + as + " (" + asName + "). Ads stopped. " + (as === 3 || as === 9 || as === 8 ? "Pay in Billing & payments or use the backup card. Plan R2" : "Check Account quality. Plan R10") });
    else adsResolve("ADS_ACCOUNT_LAST");
  }
  // campaigns + budget
  var camps = adsGraphGet(acct + "/campaigns", { fields: "id,name,effective_status,daily_budget,created_time", limit: "100" });
  var campsOk = camps !== null; camps = camps || [];
  var active = camps.filter(function (c) { return c.effective_status === "ACTIVE"; });
  var budget = active.reduce(function (s, c) { return s + adsNum(c.daily_budget) / 100; }, 0);
  if (!budget) {
    var sets = adsGraphGet(acct + "/adsets", { fields: "name,effective_status,daily_budget", limit: "100" }) || [];
    budget = sets.filter(function (s) { return s.effective_status === "ACTIVE"; }).reduce(function (s, x) { return s + adsNum(x.daily_budget) / 100; }, 0);
  }
  if (budget) p.setProperty("ADS_DAILY_BUDGET", String(budget));
  if (campsOk) {
    p.setProperty("ADS_ACTIVE_CAMPAIGNS", JSON.stringify({ t: Date.now(), n: active.length }));   // read by health.gs H11, H24
    if (!active.length) p.deleteProperty("ADS_ACTIVE_SINCE");                                       // H11 counts "no leads" from here
    else if (!p.getProperty("ADS_ACTIVE_SINCE")) p.setProperty("ADS_ACTIVE_SINCE", String(Date.now()));
  }
  note("Daily budget", acct, "active campaigns", budget);
  // no campaign running although the ads should be on (ADS_EXPECTED_ON=1), unless paused on purpose (ADS_PAUSED_UNTIL)
  var pausedUntil = adsWhen(p.getProperty("ADS_PAUSED_UNTIL"));
  if (!campsOk) { /* Meta didn't answer: leave the no-campaign alert as it is */ }
  else if (String(p.getProperty("ADS_EXPECTED_ON") || "") === "1" && !active.length && !(pausedUntil && pausedUntil > now)) {
    var since = Number(p.getProperty("ADS_NOACTIVE_SINCE") || 0) || Date.now();
    p.setProperty("ADS_NOACTIVE_SINCE", String(since));
    var rule = adsPausedByRule(acct);
    adsAlert(rule ? "P2" : "P1", "ADS_NOACTIVE", "No Facebook campaign running since " + hm(since) + (rule ? " (an automated rule turned it off)" : ""), {
      what: "No campaign in the ad account is ACTIVE, but ADS_EXPECTED_ON is 1 and ADS_PAUSED_UNTIL isn't set to a future time." +
        (rule ? "\nMeta's Activity history shows an automated rule did it: " + rule : ""),
      affects: "No new Facebook/Instagram leads while the ads are off.",
      todo: (rule ? "That's usually the daily 30-leads rule: switch the campaign back on at 8am once the overnight leads are called. " : "") +
        "If you paused it on purpose, set Script Property ADS_PAUSED_UNTIL (yyyy-mm-dd hh:mm). Otherwise check Ads Manager: payment, rejected ads, or a mis-click.",
      plan: "R2/R10"
    }, { short: "no campaign running", sms: "KD P1: no Facebook campaign running since " + hm(since) + ". Paused on purpose? Set ADS_PAUSED_UNTIL. Otherwise Plan R2/R10" });
  } else { p.deleteProperty("ADS_NOACTIVE_SINCE"); adsResolve("ADS_NOACTIVE"); }
  // a campaign nobody approved (ADS_ALLOWED_CAMPAIGNS = the campaign IDs that may exist): possible hack
  var allowed = String(p.getProperty("ADS_ALLOWED_CAMPAIGNS") || "").split(",").map(function (x) { return x.trim(); }).filter(String);
  if (allowed.length && campsOk) {
    var unknown = camps.filter(function (c) { return allowed.indexOf(String(c.id)) === -1 && (c.effective_status === "ACTIVE" || now - new Date(c.created_time) < 2 * 864e5); });
    if (unknown.length) adsAlert("P1", "ADS_UNKNOWN_CAMPAIGN", "Unknown Facebook campaign in the ad account: " + unknown[0].name, {
      what: unknown.map(function (c) { return "'" + c.name + "' (ID " + c.id + ", " + c.effective_status + ")"; }).join("\n") + "\nis not in ADS_ALLOWED_CAMPAIGNS.",
      affects: "If nobody at the clinic made it, someone else may be spending your money (hacked account).",
      todo: "Ads Manager > Activity history: who created it? If it wasn't you or the ads chat: turn it off, change the Facebook password, check two-step verification and the people with access. If it's ours, add its ID to ADS_ALLOWED_CAMPAIGNS.",
      plan: "register row 52"
    }, { sig: unknown.map(function (c) { return c.id; }).join(","), short: "unknown campaign",
      sms: "KD P1: unknown Facebook campaign '" + String(unknown[0].name).slice(0, 30) + "' in the ad account. Possible hack: check Ads Manager now. Register row 52" });
    else adsResolve("ADS_UNKNOWN_CAMPAIGN");
  }
  // festive limit (24 Dec - 4 Jan)
  var md = Utilities.formatDate(now, "Europe/London", "MM-dd"), fmax = Number(p.getProperty("FESTIVE_MAX") || 0);
  if (fmax && (md >= "12-24" || md <= "01-04") && budget > fmax) adsAlert("P1", "ADS_FESTIVE", "Ad budget £" + budget + "/day is above the festive limit £" + fmax, {
    what: "Between 24 Dec and 4 Jan the budget should be at most FESTIVE_MAX (£" + fmax + "/day). It's £" + budget + "/day.",
    affects: "More leads than the festive cover can call; people wait over the holidays.",
    todo: "Lower the campaign budget in Ads Manager (or pause), or raise FESTIVE_MAX if more callers are covering.", plan: "register row 10"
  }, { sig: String(budget), short: "festive budget", sms: "KD P1: ad budget GBP" + budget + "/day is above the festive limit GBP" + fmax + ". Lower it in Ads Manager. Register row 10" });
  else adsResolve("ADS_FESTIVE");
  // budget changed from the agreed one (says who changed it)
  var expected = Number(p.getProperty("ADS_EXPECTED_BUDGET") || 0);
  if (expected && budget && Math.abs(budget - expected) > 0.009) {
    var who = adsBudgetChanger(acct);
    adsAlert("P2", "ADS_BUDGET_CHANGED", "Ad budget is £" + budget + "/day, not the agreed £" + expected, {
      what: "The active campaigns' daily budget adds up to £" + budget + ", but ADS_EXPECTED_BUDGET is £" + expected + "." + (who ? "\nLast budget change in Meta: " + who + "." : ""),
      affects: "Spend and the number of leads differ from the plan (and from what the callers can handle).",
      todo: "If the change was agreed, set ADS_EXPECTED_BUDGET to the new amount. If not, change it back in Ads Manager and check Activity history."
    }, { sig: String(budget) });
  } else adsResolve("ADS_BUDGET_CHANGED");
  // spending limit headroom
  if (a && a.spend_cap && Number(a.spend_cap) > 0 && budget) {
    var headroom = (Number(a.spend_cap) - Number(a.amount_spent)) / 100;
    if (headroom < 7 * budget) adsAlert("P2", "ADS_SPENDCAP_LAST", "Ad account spending limit nearly reached (£" + headroom.toFixed(2) + " left)", {
      what: "Only £" + headroom.toFixed(2) + " left before the account spending limit (less than 7 days at £" + budget + "/day).",
      affects: "The ads stop when the limit is reached.",
      todo: "Raise it in Billing & payments > Payment settings > Account spending limit."
    });
    else adsResolve("ADS_SPENDCAP_LAST");
  }
  // ads: rejected / issues / waiting for billing / stuck in review
  var adsRaw = adsGraphGet(acct + "/ads", { fields: "id,name,status,effective_status,ad_review_feedback,issues_info,updated_time", limit: "100" });
  var ads = adsRaw || [], bad = [], stuck = [], running = 0;
  ads.forEach(function (ad) {
    note("Ad status", ad.id, ad.name, ad.effective_status, ad.ad_review_feedback ? JSON.stringify(ad.ad_review_feedback).slice(0, 300) : "");
    if (ad.effective_status === "ACTIVE") running++;
    if (/^(PAUSED|ARCHIVED|DELETED)$/.test(String(ad.status || ""))) return;          // switched off on purpose
    if (ad.effective_status === "DISAPPROVED" || ad.effective_status === "WITH_ISSUES" || ad.effective_status === "PENDING_BILLING_INFO") bad.push(ad);
    else if (ad.effective_status === "PENDING_REVIEW" && now - new Date(ad.updated_time) > 864e5) stuck.push(ad);
  });
  if (bad.length) {
    var b0 = bad[0], billing = b0.effective_status === "PENDING_BILLING_INFO", nm = String(b0.name).slice(0, 30);
    adsAlert("P1", "ADS_REJECTED_LAST", "A Facebook ad needs attention: " + b0.name + " (" + b0.effective_status + ")" + (bad.length > 1 ? " and " + (bad.length - 1) + " more" : ""), {
      what: bad.map(function (ad) { return "Ad \"" + ad.name + "\" is " + ad.effective_status + ". " + JSON.stringify(ad.ad_review_feedback || ad.issues_info || "").slice(0, 600); }).join("\n\n"),
      affects: running ? "The other ad(s) still run, so leads still come in, but fewer." : "No other ad is running: no new Facebook/Instagram leads.",
      todo: billing ? "Ads Manager > Billing & payments: add or fix the payment method." : "Don't edit the wording yourself - forward this email to the ads chat. You can request a review in Ads Manager.",
      plan: billing ? "R2" : "R1"
    }, { sig: bad.map(function (ad) { return ad.id + ad.effective_status; }).join(","), short: "ad " + (billing ? "needs billing" : "rejected"),
      sms: billing ? "KD P1: ad '" + nm + "' is waiting for payment details. Fix Billing & payments. Plan R2" :
        "KD P1: ad '" + nm + "' rejected by Meta. " + (running ? "The other ad still runs" : "No other ad is running") + ". Forward the email to the ads chat. Plan R1" });
  } else if (adsRaw) adsResolve("ADS_REJECTED_LAST");
  if (stuck.length) adsAlert("P2", "ADS_STUCK_REVIEW", "A Facebook ad has been in review for over a day: " + stuck[0].name, {
    what: stuck.map(function (ad) { return "\"" + ad.name + "\" is still PENDING_REVIEW (last change " + ad.updated_time + ")."; }).join("\n"),
    affects: "That ad isn't running yet.", todo: "Usually Meta clears it within 48 hours. If not, forward this email to the ads chat."
  }, { sig: stuck.map(function (ad) { return ad.id; }).join(",") });
  else if (adsRaw) adsResolve("ADS_STUCK_REVIEW");
  // today's delivery
  if (active.length) {
    var t = (adsGraphGet(acct + "/insights", { level: "account", date_preset: "today", fields: "spend,impressions,actions" }) || [])[0] || {};
    var spend = adsNum(t.spend), imps = adsNum(t.impressions);
    p.setProperty("ADS_TODAY_SPEND", today + "|" + spend);
    if (spend > 0) adsResolve("ADS_ZERO_SPEND");
    else if (hour >= 11) adsAlert(hour >= 13 ? "P1" : "P2", "ADS_ZERO_SPEND", "Facebook ads have spent £0 today (by " + hour + ":00)", {
      what: "A campaign is switched on, but Meta shows £0 spent and " + imps + " views today by " + hour + ":00.",
      affects: "No ads are being shown, so no new Facebook/Instagram leads.",
      todo: "Ads Manager: look for a rejected ad, a payment problem (Billing & payments) or an ad set that's off.", plan: "R2"
    }, { short: "ads not spending", sms: "KD P1: Facebook ads have spent GBP0 today by " + hour + ":00. Check for a rejected ad, payment problem or paused campaign. Plan R2" });
    if (hour >= 12 && spend > 0 && budget && spend < 0.4 * budget * (hour / 24)) adsAlert("P2", "ADS_NODELIVERY_LAST", "The ads are hardly running today", {
      what: "By " + hour + ":00 today: £" + spend.toFixed(2) + " spent, " + imps + " views (budget £" + budget + "/day).",
      affects: "Fewer leads than planned.", todo: "Check for rejected ads, a payment problem or a paused ad set."
    });
    else if (spend > 0) adsResolve("ADS_NODELIVERY_LAST");
    if (budget && spend > 1.5 * budget) adsAlert("P1", "ADS_OVERSPEND", "Ads spent £" + spend.toFixed(2) + " today on a £" + budget + " budget", {
      what: "Meta shows £" + spend.toFixed(2) + " spent today, more than 1.5 times the daily budget (£" + budget + ").",
      affects: "Money is being spent faster than planned. It can mean someone changed the budget or the account is hacked.",
      todo: "Ads Manager > Activity history now: who changed what? If it wasn't you or the ads chat, turn the campaign off and secure the Facebook account.",
      plan: "register row 52"
    }, { short: "ads overspending", sms: "KD P1: ads spent GBP" + Math.round(spend) + " today on a GBP" + budget + " budget. Check Ads Manager > Activity history now. Possible hack: register row 52" });
    else adsResolve("ADS_OVERSPEND");
    // spending but no leads for 4h+: health.gs H11 does this with a budget-based window (and more evidence), so only without it
    if (typeof healthNoMetaLeads !== "function" && spend >= 5 && inCallHours(now) && adsHoursSinceLastMetaLead() >= 4)
      adsAlert("P2", "ADS_NOLEADS_LAST", "Ads are spending but no Facebook leads have arrived for 4+ hours", {
        what: "£" + spend.toFixed(2) + " spent today, but no facebook/instagram row has reached the Waiting list for 4 hours.",
        affects: "Either the lead script is broken or the ad has stopped converting.",
        todo: "Check Apps Script > Executions for pollMetaLeads errors, the token, Meta app in Live mode, Leads access. Compare with Ads Manager's lead count."
      }, { event: true });
  } else if (campsOk) { adsResolve("ADS_ZERO_SPEND"); adsResolve("ADS_OVERSPEND"); }
  if (last._day !== today) {
    var pid = p.getProperty("META_PAGE_ID"), ig = p.getProperty("META_IG_USER_ID");
    if (pid) { var pg = (adsGraphGet(pid, { fields: "name,followers_count,fan_count" }) || [])[0]; if (pg) note("Facebook followers", pid, pg.name, pg.followers_count || pg.fan_count || 0); }
    if (ig) { var ia = (adsGraphGet(ig, { fields: "username,followers_count" }) || [])[0]; if (ia) note("Instagram followers", ig, ia.username, ia.followers_count || 0); }
  }
  last._day = today;
  p.setProperty("ADS_STATUS_LAST", JSON.stringify(last));
  if (log.length) {
    var sh = adsTab(ADS_STATUS_TAB, ["Checked at", "Check", "Object ID", "Object name", "Value", "Detail"]);
    sh.getRange(sh.getLastRow() + 1, 1, log.length, 6).setValues(log);
  }
}
function adsAccountStatusName(s) {
  return { 1: "active", 2: "disabled", 3: "payment problem", 7: "in risk review", 8: "payment being settled", 9: "grace period - payment due",
    100: "closing", 101: "closed", 201: "any active", 202: "any closed" }[s] || "unknown";
}
// Meta's Activity history (last 24 h): did an automated rule switch a campaign/ad set/ad off? Returns a short description or "".
function adsPausedByRule(acct) {
  var acts = adsGraphGet(acct + "/activities", { since: String(Math.floor(Date.now() / 1000) - 86400), limit: "100",
    fields: "event_time,event_type,translated_event_type,actor_name,object_name,object_type,extra_data" }) || [];
  var r = acts.filter(function (x) { return /rule/i.test(String(x.actor_name || "") + " " + String(x.translated_event_type || "") + " " + String(x.event_type || "")); })[0];
  return r ? (r.translated_event_type || r.event_type) + " '" + (r.object_name || "") + "' at " + r.event_time : "";
}
// Who last changed a budget (Activity history, last 7 days)
function adsBudgetChanger(acct) {
  var acts = adsGraphGet(acct + "/activities", { since: String(Math.floor(Date.now() / 1000) - 7 * 86400), limit: "100",
    fields: "event_time,event_type,translated_event_type,actor_name,object_name" }) || [];
  var r = acts.filter(function (x) { return /budget/i.test(String(x.event_type || "") + " " + String(x.translated_event_type || "")); })
    .sort(function (x, y) { return new Date(y.event_time) - new Date(x.event_time); })[0];
  return r ? (r.actor_name || "someone") + " (" + (r.translated_event_type || r.event_type) + ", " + r.event_time + ")" : "";
}

function adsHoursSinceLastMetaLead() {
  var data = leadsSheet().getDataRange().getValues(), h = data[0].map(String);
  var tc = h.indexOf("Signup Time"), src = h.indexOf("Source"), latest = 0;
  if (tc === -1 || src === -1) return 0;
  for (var i = data.length - 1; i >= 1 && i >= data.length - 2000; i--) {
    var so = String(data[i][src]).toLowerCase(), t = data[i][tc];
    if ((so === "facebook" || so === "instagram") && t instanceof Date) latest = Math.max(latest, t.getTime());
  }
  var launch = adsProps().getProperty("LAUNCH_DATE");
  if (!latest) latest = launch ? adsDate(launch).getTime() : Date.now();
  return (Date.now() - latest) / 3600000;
}

// ---------- Monday: breakdowns, rankings, audience, change history ----------
function adsWeeklyPull() {
  var t0 = Date.now(), acct = adsAccount();
  if (!acct || !adsToken()) return;
  var asOf = adsDate(adsDay(new Date(Date.now() - 864e5))), out = [];
  var H = ["As of", "Period", "Level", "Breakdown", "Key 1", "Key 2", "ID", "Name", "Spend", "Impressions", "Reach", "Frequency",
    "Link clicks", "Leads", "CPL", "Quality", "Engagement", "Conversion", "Audience low", "Audience high"];
  var row = function (period, level, bd, k1, k2, r) {
    var spend = adsNum(r.spend), leads = adsAction(r.actions, ["onsite_conversion.lead_grouped", "lead", "leadgen_grouped"]);
    out.push([asOf, period, level, bd, k1 || "", k2 || "", "'" + (r.ad_id || r.adset_id || ""), r.ad_name || r.adset_name || "",
      spend, adsNum(r.impressions), adsNum(r.reach), adsNum(r.frequency), adsNum(r.inline_link_clicks), leads,
      leads ? Math.round(spend / leads * 100) / 100 : "", r.quality_ranking || "", r.engagement_rate_ranking || "", r.conversion_rate_ranking || "", "", ""]);
  };
  var base = "ad_id,ad_name,spend,impressions,reach,frequency,inline_link_clicks,actions";
  (adsGraphGet(acct + "/insights", { level: "ad", date_preset: "last_7d", fields: base }) || []).forEach(function (r) { row("rolling 7d", "ad", "none", "", "", r); });
  (adsGraphGet(acct + "/insights", { level: "adset", date_preset: "last_7d", fields: "adset_id,adset_name,spend,impressions,reach,frequency,inline_link_clicks,actions" }) || [])
    .forEach(function (r) { row("rolling 7d", "adset", "none", "", "", r); });
  var launch = adsProps().getProperty("LAUNCH_DATE");
  if (launch) (adsGraphGet(acct + "/insights", { level: "adset", time_range: { since: launch, until: adsDay(asOf) }, fields: "adset_id,adset_name,spend,impressions,reach,frequency,actions" }) || [])
    .forEach(function (r) { row("to date", "adset", "none", "", "", r); });
  (adsGraphGet(acct + "/insights", { level: "ad", date_preset: "last_7d", breakdowns: "publisher_platform,platform_position", fields: base }) || [])
    .forEach(function (r) { row("rolling 7d", "ad", "placement", r.publisher_platform, r.platform_position, r); });
  (adsGraphGet(acct + "/insights", { level: "ad", date_preset: "last_7d", breakdowns: "age,gender", fields: base }) || [])
    .forEach(function (r) { row("rolling 7d", "ad", "age-gender", r.age, r.gender, r); });
  (adsGraphGet(acct + "/insights", { level: "ad", date_preset: "last_7d", breakdowns: "region", fields: "ad_id,ad_name,spend,impressions,actions" }) || [])
    .forEach(function (r) { row("rolling 7d", "ad", "region", r.region, "", r); });
  (adsGraphGet(acct + "/insights", { level: "ad", date_preset: "last_7d", fields: "ad_id,ad_name,impressions,quality_ranking,engagement_rate_ranking,conversion_rate_ranking" }) || [])
    .forEach(function (r) { row("rolling 7d", "ad", "rankings", "", "", r); });
  (adsGraphGet(acct + "/adsets", { fields: "id,name,effective_status", limit: "100" }) || []).filter(function (s) { return s.effective_status === "ACTIVE"; })
    .forEach(function (s) {
      var e = (adsGraphGet(s.id + "/delivery_estimate", { optimization_goal: "LEAD_GENERATION" }) || [])[0] || {};
      out.push([asOf, "now", "adset", "audience", "", "", "'" + s.id, s.name, "", "", "", "", "", "", "", "", "", "",
        e.estimate_mau_lower_bound || "", e.estimate_mau_upper_bound || ""]);
    });
  if (out.length) { var sh = adsTab(ADS_WEEKLY_TAB, H); sh.getRange(sh.getLastRow() + 1, 1, out.length, H.length).setValues(out); }
  // Meta change history (who changed what), de-duplicated
  var acts = adsGraphGet(acct + "/activities", { since: String(Math.floor(Date.now() / 1000) - 8 * 86400), limit: "200",
    fields: "event_time,event_type,translated_event_type,actor_name,object_id,object_name,object_type,extra_data" }) || [];
  var ch = adsTab(ADS_CHANGES_TAB, ["Event time", "Event", "Actor", "Object type", "Object ID", "Object", "Details", "Key"]);
  var seenKeys = {}; ch.getDataRange().getValues().slice(1).forEach(function (r) { seenKeys[r[7]] = true; });
  var add = acts.filter(function (x) { return !seenKeys[x.event_time + "|" + x.object_id + "|" + x.event_type]; }).map(function (x) {
    return [new Date(x.event_time), x.translated_event_type || x.event_type, x.actor_name || "", x.object_type || "", "'" + (x.object_id || ""),
      x.object_name || "", String(x.extra_data || "").slice(0, 500), x.event_time + "|" + x.object_id + "|" + x.event_type];
  });
  if (add.length) ch.getRange(ch.getLastRow() + 1, 1, add.length, 8).setValues(add);
  if (typeof healthMark === "function") healthMark("adsWeeklyPull", true, Date.now() - t0);
}

// Lines for the 9pm owner email (called from eveningReport in meta-leads.gs if this file is installed).
function adsEveningLines() {
  try {
    var by = adsTotalsByDay(), sheetBy = adsSheetMetaLeadsByDay(), now = new Date();
    var day = function (n) { return adsDay(new Date(now.getTime() - n * 864e5)); };
    var y = by[day(1)] || { spend: 0, leads: 0 }, sp = 0, ld = 0;
    for (var d = 1; d <= 3; d++) { sp += (by[day(d)] || {}).spend || 0; ld += sheetBy[day(d)] || 0; }
    var t = String(adsProps().getProperty("ADS_TODAY_SPEND") || "").split("|");
    var todaySpend = t[0] === day(0) ? "£" + adsNum(t[1]).toFixed(2) + " (at the last 2-hourly check)" : "not checked yet";
    if (!sp && !y.spend && t[0] !== day(0)) return "";
    return "\n\nFacebook/Instagram ads\n  Yesterday: £" + y.spend.toFixed(2) + " spent, " + y.leads + " leads (Meta), " + (sheetBy[day(1)] || 0) + " in the sheet" +
      "\n  Cost per lead, last 3 days: " + (ld ? "£" + (sp / ld).toFixed(2) : "n/a") + " (before VAT)" +
      "\n  Today so far: " + todaySpend +
      "\n  Frequency (7 days): " + (Number(adsProps().getProperty("ADS_FREQ_7D") || 0).toFixed(1)) +
      (function () { var l = adsPeopleOnList(); return "\n\nOn the waiting list: " + l.people + " people in " + l.households + " sign-ups"; })();
  } catch (e) { return ""; }
}
