/**
 * Kirkcaldy Dental – daily Meta ad results + ad health checks (ads chat).
 * Same Apps Script project as apps-script.gs and meta-leads.gs. Every name here starts with "ads".
 * Uses from meta-leads.gs: metaGraph(), healthNotifyOnce(), leadsSheet(), inCallHours(), callWindow().
 *
 * What it does
 *   adsPullInsights()  daily 06:00  – last 7 days of spend/leads/CPM/frequency/video per ad → "Ads" tab
 *                                     (all 7 days re-written each run, because Meta revises recent days),
 *                                     then fills blank "Ad name" cells in the Waiting list, then adsKpiAlarms().
 *   adsWeeklyPull()    Mon 06:30    – placement / age-gender / region breakdowns, quality rankings, audience size
 *                                     → "Ads weekly"; Meta's change history → "Meta change log".
 *   adsStatusCheck()   every 2h     – (08:00–21:00 only) rejected ads, account problems, spend cap, no delivery,
 *                                     spending but no leads arriving → owner email (healthNotifyOnce), "Ad status" tab.
 *   adsKpiAlarms()                  – after each daily pull: cost per lead too high, frequency too high,
 *                                     leads missing from the sheet, too few leads, under-spending.
 *
 * INSTALL (setup night, runbook Step 5):
 *   Script Properties:
 *     META_ADS_TOKEN     = System User token with ads_read (leave empty to reuse META_PAGE_TOKEN if it has ads_read)
 *     META_AD_ACCOUNT_ID = act_XXXXXXXXXXXX   (Ads Manager → account dropdown; add "act_" in front of the number)
 *     LAUNCH_DATE        = yyyy-mm-dd, the day the ads went live
 *     SPEND_MULTIPLIER   = 1.224 (optional; 2% UK location fee + 20% VAT that can't be reclaimed)
 *     CPL_ALARM          = 3.5   (optional; £ per lead, 3-day average, before VAT)
 *   Then run adsInstallTriggers() once.
 */

var ADS_TAB = "Ads", ADS_WEEKLY_TAB = "Ads weekly", ADS_STATUS_TAB = "Ad status", ADS_CHANGES_TAB = "Meta change log";
var ADS_HEADERS = ["Date", "Campaign ID", "Campaign", "Ad set ID", "Ad set", "Ad ID", "Ad name",
  "Spend", "Spend inc fee+VAT", "Impressions", "Reach", "Frequency", "CPM", "Clicks (all)", "CTR (all) %",
  "Link clicks", "Link CTR %", "Cost per link click", "Leads (Meta)", "CPL (Meta)",
  "3s plays", "ThruPlays", "p25", "p50", "p75", "p100", "Avg watch (s)",
  "Post engagement", "Reactions", "Comments", "Shares", "Saves", "Pulled at"];

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
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) {
      console.error("Meta ads API " + res.getResponseCode() + " " + path + ": " + res.getContentText());
      healthNotifyOnce("ADS_API_ERR_LAST", "⚠️ Ad results can't be read from Meta (" + res.getResponseCode() + ")",
        "The daily ad-results script couldn't read " + path + ". Leads still arrive (that's a separate script), but the Ads tab and ad alarms are paused.\n\n" +
        "Error 190 = token wrong or expired. Error 10/200/294 = the token is missing ads_read, or the System User isn't assigned to the ad account (View performance).\n\n" +
        res.getContentText().slice(0, 800));
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
  var acct = adsAccount();
  if (!acct || !adsToken()) return;
  var rows = adsGraphGet(acct + "/insights", {
    level: "ad", time_increment: "1", date_preset: "last_7d", action_report_time: "conversion", limit: "500",
    fields: "date_start,campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,spend,impressions,reach,frequency,cpm," +
      "clicks,ctr,inline_link_clicks,inline_link_click_ctr,cost_per_inline_link_click,actions," +
      "video_thruplay_watched_actions,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions," +
      "video_p100_watched_actions,video_avg_time_watched_actions"
  });
  if (rows === null) return;
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
      adsAction(r.actions, "post"), adsAction(r.actions, "onsite_conversion.post_save"), now];
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
  SpreadsheetApp.flush();
  adsKpiAlarms();
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
function adsKpiAlarms() {
  var p = adsProps(), now = new Date(), byDay = adsTotalsByDay(), sheetBy = adsSheetMetaLeadsByDay();
  var day = function (n) { return adsDay(new Date(now.getTime() - n * 864e5)); };
  var url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  var launch = p.getProperty("LAUNCH_DATE"), daysLive = launch ? Math.floor((now - adsDate(launch)) / 864e5) : 99;
  // 1. cost per lead, last 3 full days (spend ÷ unique paid sheet leads)
  var sp = 0, ld = 0;
  for (var d = 1; d <= 3; d++) { sp += (byDay[day(d)] || {}).spend || 0; ld += sheetBy[day(d)] || 0; }
  var cplAlarm = Number(p.getProperty("CPL_ALARM") || 3.5);
  if (daysLive >= 3 && sp >= 30 && (ld === 0 || sp / ld > cplAlarm))
    healthNotifyOnce("ADS_CPL_LAST", "⚠️ Cost per lead is high: £" + (ld ? (sp / ld).toFixed(2) : sp.toFixed(2) + " spent, 0 leads"),
      "Last 3 days: £" + sp.toFixed(2) + " spent (before VAT), " + ld + " Facebook/Instagram sign-ups in the sheet.\n" +
      "Rule: over £" + cplAlarm + " for 3 days → fix the ad or form (don't add money). Over £5 → pause and ask the ads chat.\n\n" + url);
  // 2. leads Meta counted yesterday but missing from the sheet (the lead script or token is failing)
  var mY = (byDay[day(1)] || {}).leads || 0, sY = sheetBy[day(1)] || 0;
  if (mY - sY >= 2 && (mY - sY) / Math.max(mY, 1) > 0.1)
    healthNotifyOnce("ADS_SYNC_LAST", "⚠️ " + (mY - sY) + " Facebook leads from yesterday are missing from the sheet",
      "Meta counted " + mY + " leads yesterday, but the Waiting list has " + sY + " paid Facebook/Instagram rows.\n" +
      "Check Apps Script → Executions for pollMetaLeads errors, that the Meta app is Live, and Leads access. " +
      "Missing people can be downloaded from Meta Business Suite → Instant Forms → the form → Download leads, and added by hand.\n\n" + url);
  // 3. too few leads for 3 days after day 4
  if (daysLive >= 4 && [1, 2, 3].every(function (n) { return (sheetBy[day(n)] || 0) < 3 && ((byDay[day(n)] || {}).spend || 0) > 0; }))
    healthNotifyOnce("ADS_LOWLEADS_LAST", "⚠️ Fewer than 3 Facebook sign-ups a day for 3 days",
      "Check the ads are approved and delivering, the form works (submit a test), and the token (any 'NOT arriving' emails?).\n\n" + url);
  // 4. under-spending 2 days running (needs the budget seen by adsStatusCheck)
  var budget = Number(p.getProperty("ADS_DAILY_BUDGET") || 0);
  if (budget && daysLive >= 2 && [1, 2].every(function (n) { return ((byDay[day(n)] || {}).spend || 0) < 0.5 * budget; }))
    healthNotifyOnce("ADS_PACING_LAST", "⚠️ Ads spent under half the budget 2 days running",
      "Daily budget £" + budget + ". Yesterday £" + (((byDay[day(1)] || {}).spend) || 0).toFixed(2) +
      ". Usually a rejected ad, a payment problem or an audience that's too small. Check Ads Manager.\n\n" + url);
  // 5. frequency (7-day, ad set level)
  var acct = adsAccount();
  if (acct && daysLive >= 7) {
    var f = adsGraphGet(acct + "/insights", { level: "adset", date_preset: "last_7d", fields: "adset_name,frequency,reach" }) || [];
    f.forEach(function (r) {
      if (adsNum(r.frequency) > 3) healthNotifyOnce("ADS_FREQ_LAST", "⚠️ Ads are being seen too often (frequency " + adsNum(r.frequency).toFixed(1) + ")",
        "People in the area have seen the ads " + adsNum(r.frequency).toFixed(1) + " times on average this week. Ask the ads chat for 1–2 fresh versions of the winning ad.\n\n" + url);
    });
  }
}

// ---------- every 2 hours: are the ads healthy? ----------
function adsStatusCheck(force) {
  if (force !== true && !inCallHours(new Date())) return;
  var acct = adsAccount();
  if (!acct || !adsToken()) return;
  var p = adsProps(), now = new Date(), url = SpreadsheetApp.getActiveSpreadsheet().getUrl(), log = [];
  var last = JSON.parse(p.getProperty("ADS_STATUS_LAST") || "{}"), today = adsDay(now);
  var note = function (check, id, name, value, detail) {
    var key = check + "|" + id, firstToday = last._day !== today;
    if (firstToday || last[key] !== String(value)) log.push([now, check, "'" + id, name, value, detail || ""]);
    last[key] = String(value);
  };
  // account
  var a = (adsGraphGet(acct, { fields: "name,account_status,disable_reason,amount_spent,spend_cap,currency" }) || [])[0];
  if (a) {
    note("Account status", acct, a.name, a.account_status, a.disable_reason ? "disable_reason " + a.disable_reason : "");
    if (Number(a.account_status) !== 1) healthNotifyOnce("ADS_ACCOUNT_LAST", "⚠️ Meta ad account problem (status " + a.account_status + ")",
      "Status 1 = active. 2 = disabled, 3 = unsettled payment, 7/9 = in review or grace period. Open Ads Manager → Account overview.\n\n" + url);
  }
  // campaigns + budget
  var camps = adsGraphGet(acct + "/campaigns", { fields: "name,effective_status,daily_budget", limit: "100" }) || [];
  var active = camps.filter(function (c) { return c.effective_status === "ACTIVE"; });
  var budget = active.reduce(function (s, c) { return s + adsNum(c.daily_budget) / 100; }, 0);
  if (!budget) {
    var sets = adsGraphGet(acct + "/adsets", { fields: "name,effective_status,daily_budget", limit: "100" }) || [];
    budget = sets.filter(function (s) { return s.effective_status === "ACTIVE"; }).reduce(function (s, x) { return s + adsNum(x.daily_budget) / 100; }, 0);
  }
  if (budget) p.setProperty("ADS_DAILY_BUDGET", String(budget));
  note("Daily budget", acct, "active campaigns", budget);
  if (a && a.spend_cap && Number(a.spend_cap) > 0 && budget) {
    var headroom = (Number(a.spend_cap) - Number(a.amount_spent)) / 100;
    if (headroom < 7 * budget) healthNotifyOnce("ADS_SPENDCAP_LAST", "⚠️ Ad account spending limit nearly reached",
      "Only £" + headroom.toFixed(2) + " left before the account spending limit (less than 7 days at £" + budget + "/day). Ads stop when it's reached. Raise it in Billing → Payment settings.\n\n" + url);
  }
  // ads: rejected / issues / stuck in review
  var ads = adsGraphGet(acct + "/ads", { fields: "id,name,effective_status,ad_review_feedback,issues_info,updated_time", limit: "100" }) || [];
  ads.forEach(function (ad) {
    note("Ad status", ad.id, ad.name, ad.effective_status, ad.ad_review_feedback ? JSON.stringify(ad.ad_review_feedback).slice(0, 300) : "");
    var stuck = ad.effective_status === "PENDING_REVIEW" && now - new Date(ad.updated_time) > 864e5;
    if (ad.effective_status === "DISAPPROVED" || ad.effective_status === "WITH_ISSUES" || stuck)
      healthNotifyOnce("ADS_REJECTED_LAST", "⚠️ A Facebook ad needs attention: " + ad.name + " (" + ad.effective_status + ")",
        "Ad \"" + ad.name + "\" is " + ad.effective_status + ".\n" + JSON.stringify(ad.ad_review_feedback || ad.issues_info || "").slice(0, 800) +
        "\n\nDon't edit the wording yourself – send this email to the ads chat. You can request a review in Ads Manager.\n\n" + url);
  });
  // today's delivery
  if (active.length) {
    var t = (adsGraphGet(acct + "/insights", { level: "account", date_preset: "today", fields: "spend,impressions,actions" }) || [])[0] || {};
    var spend = adsNum(t.spend), imps = adsNum(t.impressions);
    p.setProperty("ADS_TODAY_SPEND", today + "|" + spend);
    var hour = Number(Utilities.formatDate(now, "Europe/London", "H"));
    if (hour >= 12 && (imps === 0 || (budget && spend < 0.4 * budget * (hour / 24))))
      healthNotifyOnce("ADS_NODELIVERY_LAST", "⚠️ The ads are hardly running today",
        "By " + hour + ":00 today: £" + spend.toFixed(2) + " spent, " + imps + " views (budget £" + budget + "/day). " +
        "Check for rejected ads, a payment problem or a paused campaign.\n\n" + url);
    if (spend >= 5 && inCallHours(now) && adsHoursSinceLastMetaLead() >= 4)
      healthNotifyOnce("ADS_NOLEADS_LAST", "⚠️ Ads are spending but no Facebook leads have arrived for 4+ hours",
        "£" + spend.toFixed(2) + " spent today, but no facebook/instagram row has reached the Waiting list for 4 hours.\n" +
        "Either the lead script is broken (check Apps Script → Executions, the token, Meta app in Live mode, Leads access) " +
        "or the ad has stopped converting. Compare with Ads Manager's lead count.\n\n" + url);
  }
  last._day = today;
  p.setProperty("ADS_STATUS_LAST", JSON.stringify(last));
  if (log.length) {
    var sh = adsTab(ADS_STATUS_TAB, ["Checked at", "Check", "Object ID", "Object name", "Value", "Detail"]);
    sh.getRange(sh.getLastRow() + 1, 1, log.length, 6).setValues(log);
  }
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
  var acct = adsAccount();
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
      "\n  Today so far: " + todaySpend;
  } catch (e) { return ""; }
}
