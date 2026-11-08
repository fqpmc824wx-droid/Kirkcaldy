[
 {
  "metrics": [
   {
    "name": "Amount spent (ex VAT and inc VAT), daily and cumulative",
    "definition": "What Meta charged for delivering the ads, per day and per ad. Meta reports spend without VAT. If the ad account has no UK VAT number, the clinic also pays 20% VAT on top.",
    "formula": "Spend = Insights `spend`. Spend inc VAT = spend x 1.2 (only if no VAT number is on the account). Cumulative = SUM('Meta daily'!Spend) from the launch date.",
    "source": "Meta Ads Manager/API (Insights `spend`, level=ad, time_increment=1)",
    "frequency": "Daily (06:00 pull, overwriting the last 7 days); today's running total in the 9pm email",
    "target_or_alarm": "Plan: \u00a320/day in week 1 (\u00a3140/week ex VAT); 4-week total about \u00a3800\u2013850 ex VAT (about \u00a3960\u20131,020 inc VAT). Alarm if the cumulative total runs more than 10% above plan.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Today it shows only in Ads Manager. Nothing reaches the sheet, so there is no history, no cost per lead by channel and no alarm. This metric's setup is the 'Meta daily pull' that every other Meta metric below uses. (1) Business settings \u2192 System users \u2192 'Lead script' \u2192 Assign assets \u2192 Ad accounts \u2192 the clinic ad account \u2192 View performance. Check that the token includes ads_read, and regenerate it if not. (2) Add Script Properties META_AD_ACCOUNT_ID=act_<id>, META_ADS_TOKEN=that System User token (it can be the same as META_PAGE_TOKEN) and META_PAGE_ID. (3) Create a new file meta-insights.gs in the same Apps Script project with pullMetaInsights() on a daily 06:00 Europe/London trigger. It calls GET graph.facebook.com/v21.0/act_{id}/insights?level=ad&time_increment=1&date_preset=last_7d&limit=500&fields=date_start,campaign_name,adset_name,ad_id,ad_name,spend,impressions,reach,frequency,cpm,clicks,ctr,inline_link_clicks,inline_link_click_ctr,cost_per_inline_link_click,actions,cost_per_action_type,video_play_actions,video_continuous_2_sec_watched_actions,video_thruplay_watched_actions,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions,video_p100_watched_actions,video_avg_time_watched_actions (4) Upsert one row per Date + Ad ID into a new tab 'Meta daily', re-writing the last 7 days on every run because Meta revises figures for about 3 days. Add a 'Spend inc VAT' column. (5) Do all the maths in a new 'Ad KPIs' tab. Never put formula columns in the 'Waiting list' tab: appendRow writes blanks into any column the script doesn't fill."
   },
   {
    "name": "Impressions",
    "definition": "The number of times the ads were on screen.",
    "formula": "Insights `impressions` (sum per day and per ad)",
    "source": "Meta Ads Manager/API (Meta daily pull)",
    "frequency": "Daily; plus a midday delivery check",
    "target_or_alarm": "At \u00a320/day with a \u00a33\u20138 CPM, expect about 2,500\u20136,500 a day. Alarm if impressions are still 0 by 12:00 on a day the ads should be live, or if they fall more than 50% from one day to the next with no budget change.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Field `impressions` in the Meta daily pull. For the midday check, have adStatusCheck() (see Ad rejections) also call GET act_{id}/insights?date_preset=today&fields=impressions,spend at 12:00 and email OWNER_EMAIL if the result is 0."
   },
   {
    "name": "Reach (daily, weekly, campaign-to-date) and audience penetration",
    "definition": "How many different Meta Accounts saw an ad at least once, and what share of the estimated targetable audience within 10 miles that is.",
    "formula": "Penetration = campaign-to-date reach \u00f7 midpoint of (estimate_mau_lower_bound, estimate_mau_upper_bound). Reach can't be added up across days: daily reach rows must never be summed.",
    "source": "Meta Ads Manager/API (Insights `reach` + ad set `delivery_estimate`)",
    "frequency": "Daily reach comes from the daily pull. Campaign-to-date reach and audience size: weekly, on Mondays.",
    "target_or_alarm": "Expect about 2,000\u20135,000 a day and 10,000\u201325,000 a week at \u00a320/day. The audience is probably about 110,000\u2013160,000 Meta Accounts (check with the delivery estimate). Alarm: penetration above 50%, 7-day frequency above 3 and CPL rising together mean saturation. Then widen to 15 miles or add fresh ads (runbook week 3).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Add weeklyMetaPull() on a Monday 06:30 trigger. (a) Call GET act_{id}/insights?level=adset&time_range={'since':'<launch date>','until':'<yesterday>'}&fields=reach,frequency,impressions,spend. (b) Call GET {adset_id}/delivery_estimate?optimization_goal=LEAD_GENERATION and read estimate_mau_lower_bound and estimate_mau_upper_bound. Write both to a new tab 'Meta weekly' with the week-ending date."
   },
   {
    "name": "Frequency (7-day and campaign-to-date)",
    "definition": "The average number of times each Meta Account saw the ads. Daily frequency always looks low (about 1.1\u20131.3), so make decisions on the 7-day figure.",
    "formula": "7-day frequency = 7-day impressions \u00f7 7-day reach, taken from a single 7-day query. Never sum daily rows for this.",
    "source": "Meta Ads Manager/API (Insights `frequency`)",
    "frequency": "Daily (rolling 7 days) and weekly",
    "target_or_alarm": "Target 2.5 or lower. Alarm above 3 (runbook): add fresh creatives or widen to 15 miles. Above 3 together with a falling link CTR means creative fatigue.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "In pullMetaInsights() add a second call: GET act_{id}/insights?level=ad&date_preset=last_7d&fields=ad_id,ad_name,reach,frequency,impressions. Write the result to 'Meta weekly' as a 'rolling 7d' row each day, overwriting the previous one."
   },
   {
    "name": "CPM (cost per 1,000 impressions)",
    "definition": "The price of the auction. A rising CPM pushes CPL up even when the creative is working.",
    "formula": "spend \u00f7 impressions x 1,000 (Insights `cpm`)",
    "source": "Meta Ads Manager/API (Meta daily pull)",
    "frequency": "Daily, judged on a 3-day rolling figure",
    "target_or_alarm": "Expect \u00a33\u20138 for a broad local UK audience. Alarm if it stays above \u00a312 for 3 days (competition, or a poor quality ranking). A CPM below \u00a31.50 with a poor link CTR points to junk placements (check the placement breakdown).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Field `cpm` in the Meta daily pull. In 'Ad KPIs', work out the 3-day rolling CPM as SUM(spend)/SUM(impressions)*1000."
   },
   {
    "name": "Clicks (all) and CTR (all)",
    "definition": "Every tap on the ad: the form opens plus 'see more', profile, reaction and comment taps. It's a broad interest signal.",
    "formula": "CTR (all) = clicks \u00f7 impressions (Insights `clicks`, `ctr`)",
    "source": "Meta Ads Manager/API (Meta daily pull)",
    "frequency": "Daily",
    "target_or_alarm": "Target 2% or more. CTR (all) far above link CTR means people are engaging (for example in the comments) without opening the form. Check the comments for objections.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Fields `clicks` and `ctr` in the Meta daily pull."
   },
   {
    "name": "Link clicks (= Instant Form opens) and link CTR",
    "definition": "On an Instant Form ad, a link or CTA click ('Sign up', or tapping the image) is what opens the form. So link clicks are the best available count of form opens; Meta doesn't report form opens as a separate standard Insights field.",
    "formula": "Link CTR = inline_link_clicks \u00f7 impressions (`inline_link_click_ctr`)",
    "source": "Meta Ads Manager/API (Meta daily pull)",
    "frequency": "Daily, judged per ad over 3 days",
    "target_or_alarm": "Target 1.5% or more. Demand is very high, so 2\u20134% is plausible. Alarm below 0.8% on an ad with 2,000+ impressions: the hook or creative isn't landing.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Fields `inline_link_clicks` and `inline_link_click_ctr` in the Meta daily pull. In Ads Manager \u2192 Columns, search 'form' and add any Instant Form column Meta offers, as a cross-check."
   },
   {
    "name": "Cost per form open (CPC link)",
    "definition": "What it costs to get one person to open the form.",
    "formula": "spend \u00f7 inline_link_clicks (`cost_per_inline_link_click`)",
    "source": "Meta Ads Manager/API (Meta daily pull)",
    "frequency": "Daily",
    "target_or_alarm": "Target \u00a30.50 or less. Alarm above \u00a31.00 for 3 days.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Field `cost_per_inline_link_click` in the Meta daily pull."
   },
   {
    "name": "Form completion rate (form opens \u2192 submitted leads)",
    "definition": "The share of people who open the Higher-intent Instant Form and then submit it, review screen included. It measures how much the form puts people off.",
    "formula": "Meta leads \u00f7 inline_link_clicks, per ad, over 3 or 7 days",
    "source": "Meta Ads Manager/API (Meta daily pull)",
    "frequency": "Daily (rolling 3 days); weekly per ad",
    "target_or_alarm": "Target 35% or more. Higher-intent forms usually land around 20\u201350%. Alarm below 20%: shorten the intro text, check the postcode question works on mobile, and make sure the privacy page loads.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Calculate it in 'Ad KPIs' from the Meta daily columns Leads and Link clicks, for example =SUMIFS('Meta daily'!Leads,'Meta daily'!Date,\">=\"&TODAY()-3)/SUMIFS('Meta daily'!LinkClicks,'Meta daily'!Date,\">=\"&TODAY()-3)."
   },
   {
    "name": "Leads (as Meta reports them)",
    "definition": "Instant Form submissions that Meta attributes to the ads.",
    "formula": "actions[action_type = 'onsite_conversion.lead_grouped'] (use action_type 'lead' if that one is missing)",
    "source": "Meta Ads Manager/API (Meta daily pull)",
    "frequency": "Daily; weekly totals",
    "target_or_alarm": "At \u00a320/day with a CPL of \u00a31\u20133, expect about 7\u201320 a day (50\u2013140 a week). Alarm: fewer than 4 a day after day 4 (CPL above \u00a35). More than 35 a day is above the single caller's capacity (see Leads per day vs caller capacity).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Parse the `actions` array in the Meta daily pull into a 'Leads' column. The sheet already counts lead rows by source, but nothing ties those rows to spend."
   },
   {
    "name": "Cost per lead, Meta (ex VAT, inc VAT, 3-day rolling)",
    "definition": "Meta spend divided by Meta leads: the main efficiency number.",
    "formula": "CPL = spend \u00f7 leads (`cost_per_action_type` for the lead action). Use a 3-day rolling figure = SUM(spend over 3 days) \u00f7 SUM(leads over 3 days). CPL inc VAT = CPL x 1.2.",
    "source": "Meta Ads Manager/API (Meta daily pull) \u2192 'Ad KPIs'",
    "frequency": "Daily (3-day rolling); weekly",
    "target_or_alarm": "Expect about \u00a30.75\u20133, because demand is extreme: 1 of 57 Kirkcaldy NHS dentists is accepting new patients. Target \u00a33 or less. Amber \u00a33\u20136. Red above \u00a36 for 3 days (runbook): tell the ads chat. If CPL is \u00a33 or less and the caller has spare time, raise the budget 20% every 3\u20134 days.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Calculate it in 'Ad KPIs'. Add kpiAlarms(), run straight after pullMetaInsights(), which emails OWNER_EMAIL when the 3-day CPL goes above \u00a36, 7-day frequency goes above 3, the lead sync gap goes above 10%, or any ad is disapproved. Add yesterday's spend, leads, CPL and 7-day frequency to the existing 9pm eveningReport() email."
   },
   {
    "name": "Spend share, leads and CPL by ad (Ad A woman vs Ad B mum and daughter)",
    "definition": "The creative comparison: how Meta splits the budget between the two ads, and what each one's leads cost.",
    "formula": "Per ad: spend share = ad spend \u00f7 total spend. CPL = ad spend \u00f7 ad leads. Sheet-side, leads per ad = COUNTIF('Waiting list'!Ad, ad name).",
    "source": "Meta Ads Manager/API (Meta daily pull, level=ad) + Waiting list sheet (new 'Ad' column)",
    "frequency": "Daily data; decide weekly",
    "target_or_alarm": "Only compare once each ad has \u00a350+ spend or 15+ leads. Pause the ad that is 30% or more worse after about 7 days (runbook). If Meta gives one ad less than 20% of spend, that is Meta's verdict: don't force it.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Meta side: the level=ad rows in the Meta daily pull. Sheet side: in pollMetaLeads() add ad_id,ad_name,adset_id,campaign_id,form_id,is_organic to the fields= list. In handleLead(), add values 'Ad': l.ad_name || l.ad_id, 'Ad ID': \"'\"+(l.ad_id||''), 'Form ID': \"'\"+(l.form_id||''), 'Organic?': l.is_organic ? 'Yes' : 'No'. Add those 4 headers to the Waiting list tab; the script only fills headers that exist. ad_name needs the token to have ads_read on the ad account; if it comes back empty, look the name up from 'Meta daily' by Ad ID."
   },
   {
    "name": "Spend, leads and CPL by placement (Facebook/Instagram/Messenger/Audience Network/Threads x Feed/Stories/Reels)",
    "definition": "Where Advantage+ placements spends the money. Feed shows the image and Stories/Reels show the 8 s video, so this is also the image-vs-video comparison.",
    "formula": "Per publisher_platform x platform_position: spend share and CPL = spend \u00f7 leads",
    "source": "Meta Ads Manager/API (Insights breakdowns=publisher_platform,platform_position)",
    "frequency": "Weekly (daily slices are too small at \u00a320/day)",
    "target_or_alarm": "Alarm: a placement with more than 10% of spend and a CPL above 1.5x the average for 7 days (usually Audience Network or Messenger). Exclude it, and check its leads' contact rate first.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "In weeklyMetaPull() call GET act_{id}/insights?level=ad&date_preset=last_7d&breakdowns=publisher_platform,platform_position&fields=ad_name,spend,impressions,inline_link_clicks,actions. Write it to a new tab 'Meta breakdowns' with columns Week ending | Breakdown | Value 1 | Value 2 | Ad | Spend | Impressions | Link clicks | Leads | CPL."
   },
   {
    "name": "Spend, leads and CPL by age band and gender",
    "definition": "Who Meta is reaching and converting: 18\u201324, 25\u201334, 35\u201344, 45\u201354, 55\u201364, 65+ and female/male/unknown.",
    "formula": "Per age x gender: lead share = leads \u00f7 total leads; CPL = spend \u00f7 leads",
    "source": "Meta Ads Manager/API (Insights breakdowns=age,gender)",
    "frequency": "Weekly",
    "target_or_alarm": "No narrowing in weeks 1\u20132. Flag any band with more than 15% of spend and a CPL above 2x the average for 2 weeks. Expect a female skew, because mothers often sign up the family.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "In weeklyMetaPull() call the same query as the placement one with breakdowns=age,gender, appending to 'Meta breakdowns'."
   },
   {
    "name": "Delivery by region (Meta)",
    "definition": "Meta's own geography split. For the UK it only goes down to country or nation level ('Scotland'), so it can't show Kirkcaldy vs Glenrothes. Real geography comes from lead postcodes (see Share of leads inside target postcodes).",
    "formula": "Spend share by `region` breakdown",
    "source": "Meta Ads Manager/API (breakdowns=region)",
    "frequency": "Weekly (sanity check)",
    "target_or_alarm": "100% of spend should be in Scotland. Any spend elsewhere is a targeting error: fix it the same day.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "In weeklyMetaPull() add breakdowns=region to 'Meta breakdowns'. Don't use it for town-level decisions."
   },
   {
    "name": "Video hook rate (thumb-stop)",
    "definition": "The share of video impressions where someone watched at least 3 seconds. It measures the first frame and first second of the 8 s video.",
    "formula": "3-second plays (actions[action_type='video_view']) \u00f7 impressions on video placements (Stories/Reels from the placement breakdown). If Meta has retired 3-second plays, use video_continuous_2_sec_watched_actions.",
    "source": "Meta Ads Manager/API (Meta daily pull + placement breakdown)",
    "frequency": "Weekly per ad",
    "target_or_alarm": "Target 25% or more. Alarm below 15%: change the opening frame (face plus the word 'NHS' in frame 1).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Add 'actions' video_view and video_continuous_2_sec_watched_actions to the placement-breakdown query. Ad-level figures divide by impressions that include the image placements and so understate the rate, so use the Stories/Reels rows."
   },
   {
    "name": "Video hold rate, ThruPlays, quartiles and average watch time",
    "definition": "Whether people stay to the end of the 8 s video. A video shorter than 15 s counts as a ThruPlay only when played to completion.",
    "formula": "Hold rate = ThruPlays \u00f7 3-second plays. Retention curve = p25, p50, p75 and p100 plays \u00f7 video_play_actions. Average watch time = video_avg_time_watched_actions.",
    "source": "Meta Ads Manager/API (Meta daily pull)",
    "frequency": "Weekly per ad",
    "target_or_alarm": "Hold rate 40% or more. Average watch time 3 s or more. Alarm: hold rate below 25%, or a steep drop between p25 and p50 (the message comes too late; put the address and 'waiting list' earlier).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The video_* fields are already listed in the Meta daily pull; calculate the ratios in 'Ad KPIs'."
   },
   {
    "name": "Ad relevance diagnostics (quality, engagement-rate and conversion-rate rankings)",
    "definition": "Meta ranks each ad against ads that competed for the same audience: Above average / Average / Below average (bottom 35%, 20% or 10%).",
    "formula": "Insights quality_ranking, engagement_rate_ranking and conversion_rate_ranking (ad level, last 7 days)",
    "source": "Meta Ads Manager/API",
    "frequency": "Weekly",
    "target_or_alarm": "Target Average or better on all three. Alarm: any Below average on an ad with 500+ impressions in the last 7 days. Meta doesn't rank an ad until it has 500.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "In weeklyMetaPull() call GET act_{id}/insights?level=ad&date_preset=last_7d&fields=ad_name,impressions,quality_ranking,engagement_rate_ranking,conversion_rate_ranking and write it to 'Meta weekly'."
   },
   {
    "name": "Creative fatigue flag",
    "definition": "Whether an ad is wearing out: the same people see it more often and respond less.",
    "formula": "Flag = (3-day link CTR \u2264 0.7 x that ad's first-7-day link CTR AND 7-day frequency \u2265 2.5) OR (3-day CPL \u2265 1.3 x its first-7-day CPL)",
    "source": "Meta Ads Manager/API (Meta daily pull) \u2192 'Ad KPIs'",
    "frequency": "Daily calculation; act weekly",
    "target_or_alarm": "No flag. Flag on \u2192 ask the ads chat for 1\u20132 new versions of the winner, then rotate them in. Don't edit the live ad, because that resets learning.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "In 'Ad KPIs' store each ad's baseline (first 7 days: link CTR, CPL) and compare it daily with the rolling 3-day values. Include the flag in kpiAlarms()."
   },
   {
    "name": "Ad rejections and delivery issues",
    "definition": "Ads that Meta has disapproved, that are stuck in review, or that are running with issues (wording rules, the NHS name, or a broken form or privacy link).",
    "formula": "Count of ads with effective_status in (DISAPPROVED, WITH_ISSUES, PENDING_REVIEW for more than 24 h), plus the ad_review_feedback text",
    "source": "Meta Ads Manager/API (ad object)",
    "frequency": "Every 2 hours, 8am\u20139pm",
    "target_or_alarm": "0. Alarm: any disapproval. Fix the same day using BRAND.md wording ('waiting list' only, never 'accepting NHS patients') and tell the ads chat.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Today only Meta's own notifications and emails to admins cover this; nothing is logged. Add adStatusCheck() on a 2-hourly trigger that calls GET act_{id}/ads?fields=id,name,effective_status,configured_status,ad_review_feedback,issues_info,updated_time. Write it to a new tab 'Ad status' and email OWNER_EMAIL whenever a status changes to DISAPPROVED or WITH_ISSUES."
   },
   {
    "name": "Ad account health and payment",
    "definition": "Whether the ad account can spend: account status, payment failures and the spending limit.",
    "formula": "account_status (1 = active; 2 = disabled; 3 = unsettled; 7 = pending risk review; 9 = grace period). Headroom = spend_cap \u2212 amount_spent.",
    "source": "Meta Ads Manager/API (ad account object)",
    "frequency": "Daily (and in adStatusCheck)",
    "target_or_alarm": "Status 1. Headroom of more than 7 days of budget. Alarm: any other status, a failed payment, or headroom of less than 7 days.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "In adStatusCheck() call GET act_{id}?fields=account_status,disable_reason,amount_spent,spend_cap,balance and email the owner on any problem. The daily staff check (runbook section 9) stays as a backup."
   },
   {
    "name": "Budget pacing",
    "definition": "Whether the ad set is spending its daily budget. Too little means a delivery problem; too much means Meta's allowed overspend.",
    "formula": "Pacing = yesterday's spend \u00f7 daily_budget. Midday pacing = today's spend at 12:00 \u00f7 (daily_budget x 0.4).",
    "source": "Meta Ads Manager/API (Insights + ad set daily_budget)",
    "frequency": "Daily, plus a 12:00 check",
    "target_or_alarm": "85\u2013115% over a week. Meta may spend up to 75% more on a single day (up to \u00a335 on a \u00a320 day) while keeping the weekly average. Alarm: below 50% for 2 days (limited delivery or review), or \u00a30 spent by 12:00.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "In adStatusCheck() call GET {adset_id}?fields=daily_budget,effective_status and act_{id}/insights?date_preset=today&fields=spend. Log both to 'Ad status' and calculate pacing in 'Ad KPIs'."
   },
   {
    "name": "Learning phase status",
    "definition": "Meta's optimisation state for the ad set: Learning, Active (learning finished) or Learning limited. Leaving learning takes about 50 leads in 7 days.",
    "formula": "Ad set learning_stage_info.status (LEARNING, SUCCESS or FAIL = learning limited)",
    "source": "Meta Ads Manager/API (ad set object)",
    "frequency": "Daily",
    "target_or_alarm": "Leave learning within 7 days. That needs a CPL of about \u00a32.85 or less at \u00a320/day. 'Learning limited' at \u00a320/day is fine if CPL is under target: don't make edits to escape it. Alarm: learning reset by an edit. Keep budget rises to 20\u201325% at a time, every 3\u20134 days.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "In adStatusCheck() add a call to GET {adset_id}?fields=learning_stage_info and write the status to 'Ad status'."
   },
   {
    "name": "Campaign change log",
    "definition": "Every budget, creative, targeting, form or status change, with its date. Without this, the metric movements above can't be explained.",
    "formula": "Count and list of changes per week",
    "source": "Meta Ads Manager/API (account activity log) + manual",
    "frequency": "Logged on every change; reviewed weekly",
    "target_or_alarm": "Week 1: no changes for 3\u20134 days (runbook). After that, at most one significant change every 3\u20134 days.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Add a new tab 'Change log' (Date | Who | What changed | Old | New | Why). Fill it automatically in weeklyMetaPull() from GET act_{id}/activities?fields=event_time,event_type,actor_name,object_name,extra_data&since=<7 days ago>. Add a manual line for non-Meta changes too (a leaflet drop, banner installed, phone number added)."
   },
   {
    "name": "Ad engagement: reactions, shares, saves and engagement rate",
    "definition": "Social proof and word of mouth on the ad posts. Shares spread the waiting list to friends and family for free.",
    "formula": "From `actions`: post_reaction, comment, post (shares), onsite_conversion.post_save, like (Page likes from the ad). Engagement rate = post_engagement \u00f7 impressions.",
    "source": "Meta Ads Manager/API (Meta daily pull)",
    "frequency": "Weekly",
    "target_or_alarm": "Track the trend; there's no hard target. A rising share count is a strong signal. Alarm: negative reactions or a wave of hostile comments (see Comments on ads).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Parse these action types from the `actions` array already returned by the Meta daily pull into their own columns."
   },
   {
    "name": "Comments on ads (volume, response time, unanswered, risky questions)",
    "definition": "Comments on the ad posts (Facebook and Instagram): how many, how fast they're answered, how many are unanswered, and how many raise risky topics ('are you taking NHS patients?', 'is this a scam?', complaints).",
    "formula": "New comments per day. Unanswered = top-level comments with no Page reply. Median reply time (hours). Risky share = flagged comments \u00f7 all comments.",
    "source": "Meta Ads Manager/API (Graph comments) + manual",
    "frequency": "Daily",
    "target_or_alarm": "Reply within 4 hours, 8am\u20139pm. 0 unanswered at 9pm. Use only the approved 'waiting list' wording and never promise registration.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Staff already reply (runbook section 9), but nothing is counted. API route: get each ad's creative{effective_object_story_id,effective_instagram_media_id} \u2192 GET {story_id}/comments?filter=toplevel&summary=total_count&fields=created_time,message,comment_count,from (add the pages_read_user_content permission). For Instagram, GET {ig_media_id}/comments (instagram_manage_comments). Write the counts daily to a new tab 'Social daily'. Simpler start: add a 'Daily checks' tab where the staff member logs Date | New comments | Replied | Unanswered at 9pm | Risky (count + example)."
   },
   {
    "name": "Facebook and Instagram messages (DMs)",
    "definition": "Private messages the ads trigger: how many, first-response time, and unanswered at 9pm.",
    "formula": "New conversations per day. Median first-response time. Unanswered at 9pm.",
    "source": "Manual (Meta Business Suite inbox); API optional",
    "frequency": "Daily",
    "target_or_alarm": "First reply within 2\u20134 hours in calling hours. 0 unanswered at 9pm. Turn on a Business Suite instant reply with the sign-up link (kirkcaldydental.co.uk/register/?src=fb-dm).",
    "currently_tracked": "no",
    "how_to_capture_if_not": "The current token has no pages_messaging permission, so start manually with 'Daily checks' columns DMs new | DMs replied | Unanswered at 9pm | Common question. Optional: add pages_messaging and pull GET {page_id}/conversations?fields=updated_time,message_count,unread_count once a day. Give the instant-reply link its own src tag so those sign-ups are counted separately."
   },
   {
    "name": "Facebook Page and Instagram followers",
    "definition": "The organic audience that will see the free opening-date announcement.",
    "formula": "followers_count each day, and the daily change. Page likes from ads = actions[action_type='like'].",
    "source": "Meta Ads Manager/API (Page and Instagram user objects)",
    "frequency": "Daily snapshot; weekly review",
    "target_or_alarm": "Steady growth while the ads run. Alarm: a sudden drop (spam or complaints).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Visible in Business Suite only. In pullMetaInsights() call GET {page_id}?fields=followers_count,fan_count,instagram_business_account, then GET {ig_user_id}?fields=followers_count,media_count (needs instagram_basic, and Instagram linked to the Page). Append to 'Social daily'."
   },
   {
    "name": "Lead sync health (Meta leads vs sheet rows)",
    "definition": "Whether every Meta lead reached the sheet, and so got its text, email and call. It catches an expired token (Meta API 190), script failures and Leads-access problems.",
    "formula": "Gap for each day = Meta leads (by lead date) \u2212 COUNTIFS('Waiting list'!A:A in that day, 'Waiting list'!I:I in {facebook, instagram}, Organic?='No'). Gap % = gap \u00f7 Meta leads.",
    "source": "Meta Ads Manager/API + Waiting list sheet",
    "frequency": "Daily, plus a 'no leads' check every 15 minutes",
    "target_or_alarm": "Gap = 0 (\u00b11 for timing). Alarm: a gap above 10% or 2+ leads on any day. Also alarm if ads have spent \u00a35+ today and no Facebook or Instagram row has arrived for 4 hours in daytime \u2192 check Apps Script \u2192 Executions.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Today only an error in the Executions log would show it. In pullMetaInsights() add GET act_{id}/insights?level=account&time_increment=1&date_preset=last_7d&fields=actions&action_report_time=conversion, which dates leads by when they were submitted, to match the sheet. Write it to 'Meta daily account' and calculate the gap in 'Ad KPIs'. Add the 4-hour no-lead check to backlogCheck(). In Apps Script \u2192 Triggers, set failure notifications for pollMetaLeads to 'Notify me immediately'."
   },
   {
    "name": "Sign-ups per day and week by source, plus waiting-list size",
    "definition": "New rows by Source (facebook, instagram, website, leaflet, banner, phone), and the running total of sign-ups and people.",
    "formula": "COUNTIFS('Waiting list'!I:I, source, 'Waiting list'!A:A, period). Waiting-list people = SUM of No. of People, with '4+' counted as 4.",
    "source": "Waiting list sheet (Dashboard tab, 9pm email)",
    "frequency": "Real time; 9pm daily; weekly",
    "target_or_alarm": "Week 1 at \u00a320/day: about 50\u2013140 Meta sign-ups, plus leaflet, banner and website. Alarm: fewer than 35 sign-ups in total in any full week after week 1.",
    "currently_tracked": "yes",
    "how_to_capture_if_not": "Already on the Dashboard (by source and by week) and in the 9pm email (today by source). Add a cumulative 'people on list' tile, and a week-on-week % change by source."
   },
   {
    "name": "Facebook vs Instagram leads",
    "definition": "Which platform the Meta leads come from.",
    "formula": "COUNTIF('Waiting list'!I:I,\"instagram\") \u00f7 (COUNTIF(I:I,\"facebook\") + COUNTIF(I:I,\"instagram\"))",
    "source": "Waiting list sheet (Source, from the lead's `platform` field)",
    "frequency": "Weekly",
    "target_or_alarm": "No target. Read it alongside the placement CPL. If one platform's leads are much harder to reach by phone, tell the ads chat.",
    "currently_tracked": "yes",
    "how_to_capture_if_not": "Already captured. Note that organic form leads are also labelled facebook for now (see Organic form leads)."
   },
   {
    "name": "Organic form leads",
    "definition": "Instant Form submissions that didn't come from an ad (for example from the form shared on the Page). Today they are counted as ad leads and make CPL look better than it is.",
    "formula": "COUNTIF('Waiting list'!Organic?,\"Yes\")",
    "source": "Meta Ads Manager/API (lead field is_organic) \u2192 Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "No target. Leave them out of the Meta CPL and the lead sync check.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Comes with the pollMetaLeads() field change described under the per-ad metric (is_organic \u2192 'Organic?' column)."
   },
   {
    "name": "Leads per day vs caller capacity",
    "definition": "Whether the single caller can ring every lead within an hour. Capacity is about 30\u201340 a day for one person.",
    "formula": "Capacity use = leads per day (8am\u20139pm leads + 'Call 8am' leads) \u00f7 35",
    "source": "Waiting list sheet",
    "frequency": "Daily",
    "target_or_alarm": "60\u201390% use. Alarm above 100% two days running, or the backlog email \u2192 cut the budget 20% or add a second caller (ALERT_MODE rotate). Below 40% with CPL at \u00a33 or less \u2192 raise the budget 20%.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Only the 15+-waiting email exists. Add a 'Leads per day vs capacity' line to 'Ad KPIs' (=COUNTIFS(A:A,\">=\"&TODAY()-1,A:A,\"<\"&TODAY())/35) and to the 9pm email."
   },
   {
    "name": "Lead backlog (waiting more than an hour)",
    "definition": "Leads still not called 60 minutes after sign-up (or after 8am for overnight leads).",
    "formula": "metaBacklog(): rows with Status blank or 'Call 8am' and age of 60 minutes or more",
    "source": "Waiting list sheet",
    "frequency": "Every 15 minutes in calling hours",
    "target_or_alarm": "Below 5. Alarm at 15 or more (BACKLOG_ALERT; 10 is fine for one caller). The owner is emailed at most every 2 hours.",
    "currently_tracked": "yes",
    "how_to_capture_if_not": "Already captured. Log each alert's count to 'Ad KPIs' so you can see how often it fires."
   },
   {
    "name": "Speed to lead (time to first call)",
    "definition": "Minutes from sign-up to the first call attempt. The faster the call, the higher the contact rate.",
    "formula": "Median of (First call time \u2212 Signup Time), in calling hours only, by source",
    "source": "Waiting list sheet (new columns)",
    "frequency": "Daily and weekly",
    "target_or_alarm": "Median under 15 minutes in calling hours. 90% within 60 minutes. Overnight leads called by 10am. Alarm: median above 60 minutes.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "There's no call timestamp today. Add headers 'First call time' and 'Call attempts' to the Waiting list tab. Add an onEdit(e) function in the same project. When the edited cell is in the Status column, row 2 or below, and the new value is not blank or 'Call 8am': stamp new Date() in First call time if it's empty, and add 1 to Call attempts. Calculate the median in a separate 'Lead analysis' tab, because appendRow blanks formula columns in Waiting list."
   },
   {
    "name": "Contact rate, no-answer rate, booking rate and lead quality by source and ad",
    "definition": "Of the leads the caller has tried: how many were reached, not reached or booked, and the 'no dentist' share, for each source and each ad.",
    "formula": "Contact rate = COUNTIFS(Source=x, Status in {Called, Booked}) \u00f7 COUNTIFS(Source=x, Status not in {blank, Call 8am}). Also no-answer % and Booked \u00f7 contacted. Same by the 'Ad' column.",
    "source": "Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Contact rate 70% or more within 3 attempts. Alarm: any source or ad below 50% (poor-quality or accidental leads). Judge creatives on cost per contacted lead, not only on CPL.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The 9pm email gives today's Called, Booked and No answer only. Add a 'Lead analysis' tab with QUERY/COUNTIFS by Source and Ad. Add Status options 'Wrong number' and 'Not interested'; the scripts treat any non-blank status as handled, so they won't break."
   },
   {
    "name": "Duplicate sign-up rate",
    "definition": "The same person signing up more than once (for example Meta and then the leaflet, or the form twice). Duplicates inflate the lead count and cost an extra text, email and call.",
    "formula": "Normalised phone = REGEXREPLACE(REGEXREPLACE(Phone,\"\\D\",\"\"),\"^44\",\"0\"). Duplicate rate = (rows \u2212 unique phones) \u00f7 rows.",
    "source": "Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Below 5%. Alarm above 10%. Cross-channel duplicates also tell you about overlap: they show a person was reached by both channels.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "In 'Lead analysis': =ARRAYFORMULA(IF('Waiting list'!C2:C=\"\",,COUNTIF(norm_range,norm_range)>1)) over a normalised-phone helper column. Report the rate and a cross-source duplicate matrix. Optional: have the scripts write 'Duplicate of row N' in Notes."
   },
   {
    "name": "Invalid or unreachable lead rate",
    "definition": "Leads that can't be contacted: the text failed (a bad number) or the caller marked 'Wrong number'.",
    "formula": "(SMS failed for the lead number + Status 'Wrong number') \u00f7 leads, by source and ad",
    "source": "ClickSend + Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Below 5%. Alarm above 10% for a source or ad.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "ClickSend failures are silent in Apps Script. Change sendSms() to read the ClickSend response (data.messages[0].status) and, for the lead's own text, write 'SMS failed: <status>' into Notes. Add a 'Wrong number' Status option for the caller."
   },
   {
    "name": "Do-not-contact and opt-out rate",
    "definition": "Sign-ups who ask not to be contacted. A complaint and compliance signal, and a sign of misleading or irritating ads.",
    "formula": "COUNTIF('Waiting list'!J:J,\"DO NOT CONTACT\") \u00f7 rows, by source",
    "source": "Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Below 1%. Alarm above 2%, or any complaint that mentions the NHS wording.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The status exists but isn't counted. Add it to the Dashboard or 'Lead analysis' tab, split by source."
   },
   {
    "name": "Marketing-consent opt-in rate",
    "definition": "The share of sign-ups who ticked the optional box. Only they can get the opening offers and news, so this sets the size of the free re-marketing list.",
    "formula": "COUNTIF('Waiting list'!L:L,\"Yes\") \u00f7 rows, by source",
    "source": "Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Track it; 30% or more would be good. Alarm: a sudden fall to 0% for a source, which means the box or field is broken (test the form).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The column exists. Add the rate by source to the Dashboard."
   },
   {
    "name": "People per lead and cost per person",
    "definition": "How many people each sign-up covers. A '4+' family lead is worth far more than a single adult, so cost per person is the fairer price.",
    "formula": "People per lead = SUM(VALUE(SUBSTITUTE(F,\"+\",\"\"))) \u00f7 rows. Cost per person = channel cost \u00f7 people from that channel.",
    "source": "Waiting list sheet + Meta daily + Costs tab",
    "frequency": "Weekly, by source and ad",
    "target_or_alarm": "Expect about 1.5\u20132 people per lead. Target a cost per person of \u00a32 or less on Meta. Ad B (family) should show more people per lead; if it doesn't, rethink its message.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The Dashboard shows total people. Add people by source and by ad, and divide by spend in 'Ad KPIs'."
   },
   {
    "name": "Adult / Child / Family mix",
    "definition": "Who the sign-ups are for. It affects how many chairs and appointment types the opening needs, and whether Ad B is working.",
    "formula": "COUNTIF(H:H, each value) \u00f7 rows, by source and ad",
    "source": "Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "No target. Watch whether Ad B moves the Family share.",
    "currently_tracked": "yes",
    "how_to_capture_if_not": "Already on the Dashboard. Add the split by the 'Ad' column once it exists."
   },
   {
    "name": "Currently-registered share (unmet-need indicator)",
    "definition": "The share of sign-ups who already have a dentist. A high 'No' share confirms real unmet NHS demand. A high 'Yes' share means switchers, who are less urgent.",
    "formula": "COUNTIF(G:G,\"No\") \u00f7 rows (and the same for Yes and Not sure)",
    "source": "Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Expect 'No' to be the largest group, given that 1 of 57 Kirkcaldy NHS practices is accepting. Alarm if 'Yes' goes above 50%: the list is filling with switchers, so check whether they are the owner's own patients.",
    "currently_tracked": "yes",
    "how_to_capture_if_not": "Already on the Dashboard ('no dentist' count and registered elsewhere)."
   },
   {
    "name": "Share of leads inside target postcodes",
    "definition": "Whether the money is buying local people. Core = KY1/KY2 (Kirkcaldy). Near = KY3 (Burntisland, Kinghorn), KY4 (Cowdenbeath, Kelty), KY5 (Lochgelly, Cardenden), KY6/KY7 (Glenrothes), KY8 (Leven, Methil). Outside = everything else, plus blank or invalid.",
    "formula": "Outward code = LET(s,UPPER(REGEXREPLACE(E2,\"\\s\",\"\")),IF(LEN(s)>=5,LEFT(s,LEN(s)-3),s)). This avoids reading KY11/KY12 Dunfermline as KY1/KY2. Tier = IF(REGEXMATCH(o,\"^KY[12]$\"),\"Core\",IF(REGEXMATCH(o,\"^KY[3-8]$\"),\"Near\",\"Outside\")). Core share = Core \u00f7 rows, by source and ad.",
    "source": "Waiting list sheet (Postcode)",
    "frequency": "Weekly",
    "target_or_alarm": "Core 55% or more; Core + Near 90% or more. Alarm: Core below 40% or Outside above 10% \u2192 tighten the radius to 5\u20137 miles, or exclude areas.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The Dashboard counts by postcode sector but has no tiers or target share. Add the outward-code and tier ARRAYFORMULA columns in 'Lead analysis' (not in Waiting list), plus a Core/Near/Outside share tile by source."
   },
   {
    "name": "Overlap with the owner's other practices",
    "definition": "Sign-ups the owner's existing practices could already serve. Glenrothes postcodes (KY6/KY7) can still register at Glenrothes Dental House, which takes about 500 a month. KY8 is near the Leven practice. Some leads are already active patients at one of the 4 Fife practices, which hold 22,701 actives, 2,445 of them with KY1/KY2 postcodes.",
    "formula": "Area overlap = (KY6 + KY7 + KY8 leads) \u00f7 Meta leads. Patient overlap = waiting-list phones matching active Dentally patients at the 4 practices \u00f7 rows (totals only).",
    "source": "Waiting list sheet + Dentally",
    "frequency": "Area overlap weekly; patient overlap monthly",
    "target_or_alarm": "Area overlap below 25%. Alarm above 35% \u2192 exclude Glenrothes/Leven in Meta location targeting, or route those people to Glenrothes Dental House.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "For area overlap, use the tier formula above. For patient overlap, extend tracker/weekly_counts.py. Normalise and hash the waiting-list phone numbers and the Dentally active-patient mobiles, and output only the matched count, with no names. Have the data-protection lead confirm this use first. Otherwise the caller asks 'Which practice are you with?' and logs it in Notes."
   },
   {
    "name": "Sign-ups by hour and weekday; out-of-hours share",
    "definition": "When people sign up. This shapes the caller's hours and shows how much lands overnight as 'Call 8am'.",
    "formula": "COUNTIFS by HOUR('Waiting list'!A:A) and WEEKDAY(A:A). Out-of-hours share = sign-ups with HOUR < 8 or \u2265 21 \u00f7 rows.",
    "source": "Waiting list sheet (Signup Time)",
    "frequency": "Weekly",
    "target_or_alarm": "Informational. If out-of-hours goes above 30%, the morning catch-up needs a dedicated 8\u201310am block.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Signup Time exists, but there's no hour view. Add a 24 x 7 heat-map table in 'Lead analysis' using COUNTIFS on helper hour and weekday columns."
   },
   {
    "name": "QR scans (page visits) by source",
    "definition": "Loads of /register/ tagged by source (leaflet from /l, banner from /b), logged with time and source only.",
    "formula": "COUNTIFS(Visits!B:B, source, Visits!A:A, period)",
    "source": "Visits tab (plus Hostinger visitor stats for /l and /b as a cross-check)",
    "frequency": "Daily and weekly",
    "target_or_alarm": "Banner: 5 or more scans a week after installation. Leaflet: scans spike within 7 days of each drop. Alarm: 0 leaflet scans 3 days after a drop \u2192 test the printed QR code.",
    "currently_tracked": "yes",
    "how_to_capture_if_not": "Already logged, but only once the /exec URL is in register/index.html. Caveats: it counts page loads, not people (a reload counts twice), and it needs JavaScript. Improvements: (1) Generate a random visit ID in page memory (no storage or cookie), send it with the visit and with the sign-up, and add 'Visit ID' columns to Visits and Waiting list, so scans link exactly to sign-ups. (2) For future print runs, give each distribution route its own QR (for example /register/?src=leaflet-templehall)."
   },
   {
    "name": "Scan \u2192 sign-up conversion rate",
    "definition": "The share of QR and page visits that end in a sign-up, per source. It measures how well the /register/ page works.",
    "formula": "COUNTIF('Waiting list'!I:I, source) \u00f7 COUNTIF(Visits!B:B, source). Exact version, once Visit IDs exist: matched Visit IDs \u00f7 visits.",
    "source": "Visits tab + Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Target 40% or more, because the page is short and the intent is high. Alarm below 20% \u2192 test the page on a phone: is the form slow, is the consent text confusing, did it save?",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The Dashboard shows visits and sign-ups by source side by side. Add the explicit rate per source, and switch to the Visit ID match when it's added."
   },
   {
    "name": "Leaflet response rate and cost per sign-up",
    "definition": "How many leaflets delivered turn into sign-ups, and what each sign-up costs once print and distribution are included.",
    "formula": "Response rate = leaflet sign-ups \u00f7 leaflets delivered. Leaflet CPL = (print + distribution cost) \u00f7 leaflet sign-ups. Count each route separately when it has its own src code.",
    "source": "Waiting list sheet (Source starts with 'leaflet') + Costs tab (manual)",
    "frequency": "Weekly, and 14 days after each drop",
    "target_or_alarm": "Expect a 0.3\u20131% response. Door drops usually manage 0.1\u20130.5%, but NHS demand here is unusually high. Target a leaflet CPL of 2x the Meta CPL or less. Alarm: below 0.2% response 14 days after a drop \u2192 stop further drops and spend on Meta.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "There's no cost or quantity record. Add a new tab 'Costs' with columns Date | Channel (meta, leaflet, banner, sms, other) | Item | Quantity printed | Quantity delivered | Route or postcode sectors | Cost ex VAT | VAT | Total | Notes. Enter each print invoice and each distribution invoice. Calculate the response rate and CPL in 'Ad KPIs' with SUMIFS on Channel = 'leaflet'."
   },
   {
    "name": "Banner scans and cost per sign-up",
    "definition": "How many people scan the 180 x 60 cm Tolbooth Street banner, and what its sign-ups cost.",
    "formula": "Scans per week = COUNTIF(Visits!B:B,\"banner\") per week. Banner CPL = (print + fitting cost) \u00f7 banner sign-ups to date.",
    "source": "Visits tab + Waiting list sheet + Costs tab",
    "frequency": "Weekly",
    "target_or_alarm": "5 or more scans a week. Banner CPL keeps falling over time because the cost is one-off. Alarm: fewer than 5 scans a week after 2 weeks \u2192 the spot or height is poor; move it or make the QR code bigger.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Scans and sign-ups are already tracked. Add the banner cost to the 'Costs' tab, and the date it went up to the 'Change log'."
   },
   {
    "name": "Website visits and sign-ups (direct, home page, Page and Instagram links)",
    "definition": "Sign-ups and visits that didn't come from the Instant Form or a QR code: people typing the address, the Facebook Page website button, the Instagram bio and the form's 'View website' button.",
    "formula": "Visits = COUNTIF(Visits!B:B, src) per src. Sign-ups = COUNTIF('Waiting list'!I:I, src). Conversion = sign-ups \u00f7 visits.",
    "source": "Visits tab + Waiting list sheet + Hostinger visitor stats (no Google Analytics is installed)",
    "frequency": "Weekly",
    "target_or_alarm": "No target. Organic and website sign-ups usually grow as the ads build awareness, so a rise here means the ads are having a wider effect.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Today everything untagged shows as 'website', and the home page logs nothing. (1) Tag every link: Page website button \u2192 kirkcaldydental.co.uk/register/?src=fb-page; Instagram bio \u2192 ?src=ig-bio; Instant Form completion button \u2192 ?src=fb-form-done; DM instant reply \u2192 ?src=fb-dm. The register page already reads src or utm_source. (2) Add the same visit beacon to index.html with source 'home'. (3) Each week, copy Hostinger's page-view totals for /, /register/, /l and /b into 'Ad KPIs'. Avoid Google Analytics unless you add a cookie consent banner."
   },
   {
    "name": "Self-reported source ('How did you hear about us?')",
    "definition": "What each person says brought them in. Dentally records no channel, so this is the only way to see word of mouth and cross-channel effects (for example, saw the ad, then signed up on the website).",
    "formula": "COUNTIF('Waiting list'!How heard, answer) \u00f7 non-blank answers, compared against Source",
    "source": "Waiting list sheet (new field) + phone + Dentally",
    "frequency": "Weekly",
    "target_or_alarm": "No target. Above 20% 'friend or family' means word of mouth is strong: ask happy sign-ups to share.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Add an optional dropdown to /register/: Facebook or Instagram ad / Leaflet through the door / Banner on Tolbooth Street / Friend or family / Google search / Other. Send it as field 'heard', and add 'How heard': clean(p.heard) to doPost with a 'How heard' column. The caller asks the same question on phone sign-ups. Don't add it to the Meta form: Meta leads already have a source, and an extra question costs completions. After opening, record the same answer in Dentally's referral or source field if your Dentally setup has one."
   },
   {
    "name": "Phone calls (once the 01592 number is live)",
    "definition": "Calls the ads, leaflet, banner and website bring in: received, answered, missed, and turned into waiting-list rows.",
    "formula": "Answer rate = answered \u00f7 received. Call \u2192 sign-up = rows with Source 'phone' \u00f7 answered calls. If the call button is used: Meta action click_to_call_call_confirm.",
    "source": "Phone system call log + Waiting list sheet (Source = phone) + Meta Ads Manager/API",
    "frequency": "Daily once live",
    "target_or_alarm": "Answer rate 90% or more, 8am\u20139pm. Missed calls returned the same day. Alarm: answer rate below 80%, or calls crowding out callbacks to form leads.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "The number isn't live yet. When it is: log every caller in Waiting list with Source = phone (runbook section 11). Export a weekly call count from the phone provider's portal into 'Ad KPIs'. If the provider allows it, use separate numbers or call-tracking numbers for the ads and for print, so calls can be credited to a channel. Add the 'actions' click-to-call types to the Meta daily parse."
   },
   {
    "name": "Text-message cost and delivery rate",
    "definition": "ClickSend spend per lead (about 2.2 texts per lead, so about 9p) and the share of texts delivered.",
    "formula": "SMS cost per lead = ClickSend spend \u00f7 sign-ups. Delivery rate = delivered \u00f7 sent.",
    "source": "ClickSend",
    "frequency": "Weekly; balance checked daily",
    "target_or_alarm": "About 9p per lead. Delivery rate 97% or more. Alarm: delivery below 93%, any 'insufficient credit' error, or a balance below \u00a310.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Today it's visible only in the ClickSend dashboard. Add pullClickSend() on a daily trigger that calls GET https://rest.clicksend.com/v3/sms/history?date_from=<unix>&date_to=<unix> (Basic auth with the existing keys). Count messages by status and sum message_price into a new tab 'SMS daily'. Also call GET /v3/account to read the balance, and email OWNER_EMAIL if it drops below \u00a310."
   },
   {
    "name": "Cost per lead by channel, blended CPL and total acquisition cost",
    "definition": "The full price of the waiting list, by channel and in total: Meta (inc VAT) + leaflets (print and distribution) + banner + text messages.",
    "formula": "Channel CPL = channel cost \u00f7 channel sign-ups. Blended CPL = (Meta inc VAT + Costs tab total + ClickSend) \u00f7 all sign-ups. Also cost per person = total cost \u00f7 people.",
    "source": "Meta Ads Manager/API + Costs tab + ClickSend + Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Blended CPL \u00a34 or less inc VAT and texts. Move budget towards the cheapest channel per contacted lead. Organic and website sign-ups lower the blended figure; don't credit them to Meta.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Build it in 'Ad KPIs' from 'Meta daily' (spend inc VAT), the 'Costs' tab (manual invoices), 'SMS daily' and COUNTIF on Source. Add one line of it to the Monday summary."
   },
   {
    "name": "Waiting list \u2192 registered patient conversion, and cost per registered patient (after opening)",
    "definition": "The true outcome: how many sign-ups from each source actually register at Kirkcaldy, and what each registered patient cost.",
    "formula": "Conversion = waiting-list phones matched to new Kirkcaldy Dentally registrations \u00f7 sign-ups, by Source. Cost per registered patient = channel cost \u00f7 matched registrations.",
    "source": "Dentally + Waiting list sheet",
    "frequency": "Monthly from opening (weekly in the first 8 weeks)",
    "target_or_alarm": "Target 50% or more of sign-ups registered within 8 weeks of opening. Alarm: a source below 25%, which means poor-quality leads from that channel.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Extend tracker/weekly_counts.py for the Kirkcaldy practice. Normalise and hash the new-patient mobiles and the waiting-list phones, and output totals by Source only. Add the matched counts to the Kirkcaldy Launch Weekly Tracker."
   },
   {
    "name": "Kirkcaldy-postcode registrations at the owner's other practices",
    "definition": "Kirkcaldy KY1/KY2 residents registering at Leven and Glenrothes. This is the baseline demand that travels out of town. It should drop as people wait for Kirkcaldy, and drop further once it opens.",
    "formula": "Weekly count of new patients with KY1/KY2 postcodes per practice",
    "source": "Dentally (weekly tracker)",
    "frequency": "Weekly (Monday routine)",
    "target_or_alarm": "Informational. Baseline: Leven 200\u2013235 a month before Glenrothes opened, then about 30\u201365; Glenrothes about 100\u2013135 a month. A big drop during the campaign shows the waiting list is capturing local demand.",
    "currently_tracked": "yes",
    "how_to_capture_if_not": "Already in the Fife Practices Weekly Patient Tracker. Add a chart line for the waiting-list sign-ups each week next to it."
   },
   {
    "name": "Kirkcaldy opening curve vs Glenrothes (after opening)",
    "definition": "New NHS registrations at Kirkcaldy by week since opening, compared with Glenrothes Dental House's curve (Feb 2026: 1,187; Mar: 2,598, peaking at about 600 a week; Apr: 1,200; then 480\u2013760 a month).",
    "formula": "Kirkcaldy new patients in week n \u00f7 Glenrothes new patients in week n since opening",
    "source": "Dentally (weekly tracker)",
    "frequency": "Weekly from opening",
    "target_or_alarm": "Kirkcaldy should match or beat Glenrothes, because it's a bigger town, it starts with a waiting list, and 2,445 Kirkcaldy-postcode patients already travel to the other practices. Alarm: below 70% of the Glenrothes curve in weeks 1\u20134 \u2192 invite waves from the waiting list and restart the ads.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The weekly tracker already logs new patients per practice. Add a 'week since opening' index and a comparison chart once Kirkcaldy has an opening date."
   },
   {
    "name": "Local competition (competing ads and NHS openings)",
    "definition": "Other dental practices advertising or opening NHS lists nearby. More competition pushes CPM and CPL up and lowers the urgency of the message.",
    "formula": "Count of active dental ads in Fife in the Meta Ad Library. Count of Kirkcaldy NHS practices accepting new patients.",
    "source": "Manual (Meta Ad Library, NHS Fife practice list)",
    "frequency": "Weekly (Ad Library); monthly (NHS Fife)",
    "target_or_alarm": "Informational. Alarm: a new practice accepting NHS patients in Kirkcaldy \u2192 expect a higher CPL, and stress the opening date and the address.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Add a 'Market' section to 'Daily checks' or 'Change log': each week search the Ad Library for 'dentist' and 'dental' in the UK and note any Fife advertisers. Each month check NHS Fife's 'practices accepting patients' page and note the count."
   }
  ]
 },
 {
  "metrics": [
   {
    "name": "1. Sign-ups per day by source (gross and unique)",
    "definition": "Waiting list rows created per day, split by Source: facebook, instagram, leaflet, banner, website and later phone. 'Unique' leaves out rows flagged as a repeat sign-up from someone already on the list. Every rate below uses unique leads as its base.",
    "formula": "Gross = COUNTIFS([Signup Time] >= day, [Signup Time] < day+1, [Source] = src). Unique = the same with [Duplicate of] blank. Show 3-day and 7-day rolling totals.",
    "source": "Waiting list sheet (Meta Ads Manager 'Results' used only to cross-check, see metric 4)",
    "frequency": "Live count; daily in the 9pm report; weekly trend on the Dashboard",
    "target_or_alarm": "Planning range at \u00a320/day: about 5-10 Meta leads a day, if cost per lead is \u00a32-4. Alarm if there are fewer than 3 Meta leads a day for 3 days running (check delivery, approval, form or token). Alarm if there are more than 35 a day for 2 days, which is over one caller's capacity: hold the budget or cut it by 20%.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Gross counts already appear on the Dashboard by source and week, and in the 9pm report. Add a 'Duplicate of' column (metric 25) so the Dashboard can show unique counts next to gross. Add 'Ad name' (metric 43) so Meta leads split by ad as well as by platform."
   },
   {
    "name": "2. People on the waiting list (head count)",
    "definition": "How many individual people the list represents, both in total and added per week. It uses 'No. of People' and counts only unique, still-active rows, so DO NOT CONTACT, Not interested, Wrong number and Withdrew rows are left out.",
    "formula": "SUMIFS([People (n)], [Duplicate of] blank, [Status] not in {DO NOT CONTACT, Not interested, Wrong number, Withdrew}). '4+' counts as 4, which is conservative. Weekly change = this week's total minus last week's.",
    "source": "Waiting list sheet",
    "frequency": "Daily; weekly trend",
    "target_or_alarm": "Target: by opening day, at least as many people as there are new-patient exam slots in the first 4-6 weeks (see metric 47). Alarm if weekly growth falls more than 30% week on week while the budget stays the same, which points to creative fatigue or audience saturation.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Add a helper column 'People (n)' = IF([No. of People]='4+', 4, VALUE([No. of People])). Also map any option keys the Graph API returns, such as '4_plus', and treat blank as 1. Then add the SUMIFS above to the Dashboard."
   },
   {
    "name": "3. Cost per unique lead (Meta)",
    "definition": "Meta spend including VAT, divided by unique Facebook and Instagram leads counted in the sheet. It uses the sheet count rather than Ads Manager 'Results', so duplicates and junk leads don't make it look better than it is.",
    "formula": "Spend incl. VAT (spend x 1.2 if the clinic has no UK VAT number) / COUNTIFS([Source] in {facebook, instagram}, [Duplicate of] blank). Judge it on a 3-day rolling window.",
    "source": "Meta Ads Manager/API (spend) + Waiting list sheet (leads)",
    "frequency": "Daily (3-day rolling)",
    "target_or_alarm": "Target \u00a34 or less (planning range \u00a32-4). Alarm if it is above \u00a36 for 3 days, which is the existing launch rule: tell the ads chat.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Add a 'Spend' tab with Date | Ad name | Spend ex VAT | Spend incl VAT | Meta results | Reach | Frequency | Daily budget. Fill it daily from an Ads Manager export (Reports, broken down by Day and Ad). Or use an Apps Script pull of GET /act_<id>/insights?level=ad&time_increment=1&fields=ad_name,spend,actions,reach,frequency, which needs the ads_read permission on the token. The Dashboard then divides spend by unique sheet leads per day."
   },
   {
    "name": "4. Meta-to-sheet reconciliation and sync delay",
    "definition": "Two checks. First, leads Meta recorded that never reached the sheet. Second, the minutes between Meta's created_time and the row being written. Together they show whether the 1-minute poller and the token are working.",
    "formula": "Missing = Meta Results(day) - COUNTIFS(sheet facebook+instagram rows, day). Delay = ([Logged at] - [Signup Time]) x 1440, reported as median and maximum.",
    "source": "Meta Ads Manager/API + Waiting list sheet + Apps Script Executions",
    "frequency": "Daily",
    "target_or_alarm": "Target: nothing missing and a median delay of 2 minutes or less. Alarm on any of: a gap of 1 or more leads in a day, a delay over 10 minutes, or any 'Meta API 190' error (expired token) in Executions.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "In handleLead() add values['Logged at'] = new Date() and values['Lead ID'] = l.id, and add both as column headers to the right of Notes. The script fills columns by header name, so new columns don't break it. A nightly function can count today's leads per form with GET /{form_id}/leads and filtering on time_created, compare that with the sheet's rows, and email OWNER_EMAIL if they differ."
   },
   {
    "name": "5. Lead to contacted rate (at least one call attempt)",
    "definition": "Share of unique, contactable leads who got at least one call attempt, whatever the outcome. It is measured at 24 hours and to date; overnight leads start their clock at 08:00.",
    "formula": "COUNTIFS([Call attempts] > 0, [Duplicate of] blank) / COUNTIFS([Duplicate of] blank, not DO NOT CONTACT at sign-up). 24-hour version: count only rows where [First call at] - [Call clock start] is 1 day or less.",
    "source": "Waiting list sheet (new columns) + Call log tab",
    "frequency": "Daily",
    "target_or_alarm": "Target: 100% within 24 hours. Alarm if it is below 95% at 24 hours, or if any lead goes more than 24 hours without an attempt.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "This is the main call-logging capture; other metrics refer to it as 'onCallLogged'.\n- Add columns: 'Call outcome' (a dropdown), 'Call attempts', 'First call at', 'First reached at', 'Last attempt at', 'Next call due', 'Called by', 'Call history'.\n- Add a 'Call log' tab: Timestamp | Lead ID | Row | Attempt # | Outcome | Caller | Mins since sign-up.\n- Dropdown values: No answer, Voicemail, Busy/declined, Reached - booked, Reached - call back, Reached - on list (no slot yet), Reached - not interested, Already has dentist, Wrong number, Withdrew, DO NOT CONTACT.\n- Install an installable onEdit trigger, onCallLogged(e): ScriptApp.newTrigger('onCallLogged').forSpreadsheet(ss).onEdit().create(). It fires on edits from the Sheets mobile app too.\n- When a Call outcome cell is edited, the trigger does this:\n  - adds 1 to Call attempts;\n  - stamps First call at if it is empty, and Last attempt at;\n  - stamps First reached at on the first outcome that starts with 'Reached';\n  - writes the matching Status. No answer, Voicemail and Busy become 'No answer'. Reached - booked becomes 'Booked'. Reached - call back and Reached - on list become 'Called'. Not interested, Wrong number, Withdrew and DO NOT CONTACT keep their own names;\n  - adds 'dd/MM HH:mm outcome (caller)' to Call history and a row to the Call log tab;\n  - clears the Call outcome cell, ready for the next attempt.\n- The trigger should also stamp the same columns when a caller edits Status directly, out of old habit.\n- Blank and 'Call 8am' must still mean 'not yet called', so backlogCheck() and the 9pm report keep working.\n- Today Status is simply overwritten, so the history and timing of calls are lost."
   },
   {
    "name": "6. Speed to lead: time to first call attempt",
    "definition": "Minutes from sign-up to the first call attempt. For leads that arrive between 21:00 and 07:59, the clock starts at 08:00.",
    "formula": "Mins = ([First call at] - [Call clock start]) x 1440. Report median, 90th percentile, % within 5 minutes and % within 60 minutes: MEDIAN(FILTER(Mins, Mins <> '')), PERCENTILE(..., 0.9), and COUNTIFS(Mins <= 5) / COUNT(Mins).",
    "source": "Waiting list sheet",
    "frequency": "Live (backlog alert); daily; weekly",
    "target_or_alarm": "Target: median 5 minutes or less in calling hours, and at least 90% called within 60 minutes. Alarm if the median is over 15 minutes on any day, or any in-hours lead waits more than 2 hours.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "'First call at' comes from onCallLogged (metric 5). Add a helper column 'Call clock start' = IF(HOUR(A2) >= 21, INT(A2) + 1 + 8/24, IF(HOUR(A2) < 8, INT(A2) + 8/24, A2)), with A = Signup Time. Add 'Mins to first call' = ([First call at] - [Call clock start]) * 1440. Today only the count of leads still waiting over 60 minutes is known (metaBacklog)."
   },
   {
    "name": "7. Overnight queue cleared by 10:00",
    "definition": "Share of leads that arrived between 21:00 and 07:59 (initially marked 'Call 8am') whose first attempt happened by 10:00 the next morning. Also record the clock time when the last overnight lead was first called.",
    "formula": "COUNTIFS([Overnight] = 'Yes', [First call at] <= INT([Call clock start]) + 10/24) / COUNTIFS([Overnight] = 'Yes') for that morning.",
    "source": "Waiting list sheet",
    "frequency": "Daily (morning)",
    "target_or_alarm": "Target: at least 90% by 10:00 and 100% by 12:00. Alarm if any overnight lead has not been attempted by 12:00.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Add a helper column 'Overnight' = IF(OR(HOUR([Signup Time]) >= 21, HOUR([Signup Time]) < 8), 'Yes', 'No'). This keeps the fact even after Status is overwritten. 'First call at' comes from onCallLogged. Today the 8am text only gives the count of overnight leads."
   },
   {
    "name": "8. Time to first successful contact",
    "definition": "Hours from the clock start to the first real conversation with the person.",
    "formula": "([First reached at] - [Call clock start]) x 24. Report median, % reached within 24 hours and % within 72 hours.",
    "source": "Waiting list sheet",
    "frequency": "Daily; weekly cohort",
    "target_or_alarm": "Target: median 1 hour or less, and at least 80% reached within 72 hours. Alarm if the median is over 24 hours.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "onCallLogged stamps 'First reached at' on the first outcome that starts with 'Reached', or on a direct Status edit to Called, Booked or Not interested."
   },
   {
    "name": "9. Call attempts per lead",
    "definition": "Number of dial attempts per lead, measured two ways: attempts until first contact (for leads who were reached) and total attempts until the lead was closed.",
    "formula": "Attempts to reach = the Attempt # on the first 'Reached' row in the Call log, averaged across leads. Total = AVERAGE([Call attempts]) for closed leads. Also show the spread across 1, 2, 3 and 4+ attempts.",
    "source": "Call log tab + Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Target: 2 attempts or fewer on average to reach someone. The policy caps it at 3 attempts (straight away, after 2 hours, the next day), then 'Unreachable'. Alarm if the average to reach is above 2.5, or if any lead has more than 4 attempts (wasted time and a risk of harassment complaints).",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Use the 'Call attempts' column and the Call log tab from onCallLogged. Add 'Attempts to reach', which the trigger writes as the Attempt # when the first 'Reached' outcome is logged."
   },
   {
    "name": "10. Answer rate by time of day, day of week and attempt number",
    "definition": "Share of call attempts that were answered. Split it by time band (08-10, 10-12, 12-14, 14-17, 17-19, 19-21), by weekday, and by attempt number (1st, 2nd, 3rd).",
    "formula": "COUNTIFS(CallLog[Outcome] = 'Reached*', CallLog[Band] = b) / COUNTIFS(CallLog[Band] = b). Build it as a QUERY pivot on the Dashboard.",
    "source": "Call log tab",
    "frequency": "Weekly (needs 30 or more attempts per band)",
    "target_or_alarm": "Target: at least 45% answered on the first attempt and at least 40% across all attempts. Alarm if any band falls below 25% (move retries to the best bands) or the overall rate falls below 30%.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "The Call log tab has one row per attempt, written by onCallLogged. Add helper columns: Hour = HOUR(Timestamp), Band = LOOKUP(Hour, {8,10,12,14,17,19}, {'08-10','10-12','12-14','14-17','17-19','19-21'}), and Weekday = TEXT(Timestamp, 'ddd'). Once the 01592 number exists, add 'Called from' (mobile or 01592) to compare answer rates by caller ID."
   },
   {
    "name": "11. Reach rate (contacted to reached)",
    "definition": "Share of leads with at least one attempt who were eventually spoken to within the 3-attempt policy.",
    "formula": "COUNTIFS([First reached at] not blank) / COUNTIFS([Call attempts] > 0). Only count leads that signed up at least 3 days ago, grouped by sign-up week.",
    "source": "Waiting list sheet",
    "frequency": "Weekly cohort",
    "target_or_alarm": "Target: 70% or more. Alarm if it falls below 55% for a 2-week cohort.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Use 'First reached at' from onCallLogged. The Status values Called and No answer exist today, but each call overwrites the last, so the sequence is lost."
   },
   {
    "name": "12. No-answer follow-up completion",
    "definition": "Share of leads not answered on the first attempt who still got the full follow-up: attempt 2 within 2 hours (or by 10:00 the next day if attempt 1 was after 19:00), and attempt 3 the next day before being marked Unreachable.",
    "formula": "COUNTIFS(first outcome = No answer, Attempt 2 time <= due time) / COUNTIFS(first outcome = No answer). Overdue retries = COUNTIFS([Status] = 'No answer', [Next call due] < NOW()).",
    "source": "Call log tab + Waiting list sheet",
    "frequency": "Daily",
    "target_or_alarm": "Target: 95% or more. Alarm if it is below 85%, or if any retry is more than 4 hours overdue.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "onCallLogged sets 'Next call due': +2 hours after the first no-answer, or 10:00 the next day if that would fall after 21:00, then the next day after the second. After the third no-answer it sets Status to 'Unreachable'. Optionally send one 'sorry we missed you' service text, which can include the 01592 number once it exists. Extend backlogCheck() to count overdue retries, and add an 'Overdue retries' line to the 9pm report. The 2-hour retry rule is in HANDOFF.md but nobody measures it today."
   },
   {
    "name": "13. Wrong-number and unreachable rate (lead quality)",
    "definition": "Share of unique leads who turned out to be a wrong or invalid number, plus the share never reached after 3 attempts.",
    "formula": "Wrong = COUNTIFS([Status] = 'Wrong number') / unique leads. Unreachable = COUNTIFS([Status] = 'Unreachable') / unique leads at least 3 days old. Split both by Ad name and platform.",
    "source": "Waiting list sheet + ClickSend (invalid-number failures)",
    "frequency": "Weekly",
    "target_or_alarm": "Target: wrong numbers 3% or less, unreachable 15% or less. Alarm if wrong numbers are above 8% in a week (junk leads: check the Higher intent form and the placements) or unreachable is above 25%.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Use the 'Wrong number' dropdown outcome and the automatic 'Unreachable' status from onCallLogged. A ClickSend 'invalid number' failure (metric 20) also flags the row. Segment by 'Ad name' (metric 43)."
   },
   {
    "name": "14. Reached to booked rate",
    "definition": "Share of people reached who got an appointment booked. Before the diary opens, count those who confirmed they want a first slot ('Reached - on list') separately.",
    "formula": "COUNTIFS([Status] = 'Booked') / COUNTIFS([First reached at] not blank), grouped by sign-up week. Also show the spread of 'Not booked reason'.",
    "source": "Waiting list sheet",
    "frequency": "Daily; weekly cohort",
    "target_or_alarm": "Target: 70% or more. Alarm if it is below 50% (check the call script, how clear the NHS wording is, and whether slots are available).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "onCallLogged sets Status to Booked and stamps 'Booked at'. The caller fills in 'Appt date' and 'People booked'. Add a 'Not booked reason' dropdown: Already found dentist / Wants later / Only wanted info / Too far / Times don't suit / Wants private only / Other. The current 9pm report counts Booked only among that day's sign-ups, which understates it."
   },
   {
    "name": "15. Lead to booked rate, and booked people per lead",
    "definition": "Share of unique leads with a booking, and the number of people booked per lead (one sign-up can book a whole family).",
    "formula": "COUNTIFS([Status] = 'Booked', [Duplicate of] blank) / COUNTIFS([Duplicate of] blank). People per lead = SUM([People booked]) / unique leads. Group by sign-up week.",
    "source": "Waiting list sheet",
    "frequency": "Weekly cohort",
    "target_or_alarm": "Target: at least 50% of leads booked and at least 0.9 people booked per lead. Alarm if a 2-week cohort falls below 35% booked.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Add a 'People booked' number column that the caller fills in at booking. The weekly Dentally match (metric 33) replaces it with the actual number of household appointments."
   },
   {
    "name": "16. Days from sign-up to booking, and booking to appointment",
    "definition": "Days from sign-up until the booking is made, and the booking lead time: days from the booking to the appointment itself.",
    "formula": "MEDIAN([Booked at] - [Signup Time]) and MEDIAN([Appt date] - [Booked at]).",
    "source": "Waiting list sheet + Dentally",
    "frequency": "Weekly",
    "target_or_alarm": "Target: booked within 2 days of sign-up, and an appointment lead time of 6 weeks or less. Alarm if the lead time goes over 8 weeks, because no-shows rise: slow the ads or open more new-patient sessions.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "'Booked at' comes from onCallLogged. The caller enters 'Appt date' from Dentally, and the weekly Dentally match overwrites it with the true date."
   },
   {
    "name": "17. Backlog size and age",
    "definition": "Open leads with no call attempt yet (Status blank or 'Call 8am') that have waited over 60 minutes, the age of the oldest one, and the number of overdue retries.",
    "formula": "The existing metaBacklog() gives the number waiting over 60 minutes and oldestMins. Add overdue retries (metric 12).",
    "source": "Waiting list sheet (Apps Script)",
    "frequency": "Every 15 minutes in calling hours; daily snapshot at 21:00",
    "target_or_alarm": "Target: nobody waiting over 60 minutes at 21:00. Alarm when 15 or more wait over 60 minutes (the existing BACKLOG_ALERT email) or the oldest wait goes over 4 hours in calling hours.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The live alert and the 9pm figure already exist, but no history is kept. Add a 'Daily log' tab, and have eveningReport() add one row a day: Date | Sign-ups | Unique | Attempted | Reached | Booked | No answer | Waiting >1h | Oldest mins | Overdue retries | SMS failed | Email bounced | DNC | Daily budget | Caller shift hours. backlogCheck() can also record each hour's peak backlog, to show when queues build."
   },
   {
    "name": "18. Leads and calls per caller per day (capacity)",
    "definition": "For each caller and day: new leads assigned, dial attempts, conversations and bookings, plus dials per shift hour.",
    "formula": "COUNTIFS([Assigned to] = caller, sign-up date = d); COUNTIFS(CallLog[Caller] = caller, date = d); attempts / shift hours.",
    "source": "Waiting list sheet (Assigned to) + Call log tab + manual shift hours",
    "frequency": "Daily",
    "target_or_alarm": "Target: 35 or fewer new leads and 80 or fewer dials per caller per day (one person handles about 30-40 leads a day). Alarm if there are more than 35 new leads a day for 2 days: cut the budget 20%, or add a second caller to ONCALL_MOBILE with ALERT_MODE set to rotate. If there are fewer than 10 a day, the caller has spare time and there are open slots, raise the budget by 20%.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Today 'Assigned to' is written only for leads that arrive in calling hours; overnight leads get no caller. Have morningSummary() assign 'Call 8am' rows in rotate mode. onCallLogged writes 'Called by' from e.user when the callers use clinic Workspace accounts; otherwise add a 'Caller' dropdown. Shift hours go in the Daily log."
   },
   {
    "name": "19. Call logging compliance (data hygiene)",
    "definition": "Checks that calls are actually recorded: rows still blank more than 24 hours after sign-up, Booked rows with no appointment date, and Called rows with no attempts recorded.",
    "formula": "COUNTIFS([Status] blank, [Signup Time] < NOW() - 1) + COUNTIFS([Status] = 'Booked', [Appt date] blank) + COUNTIFS([Status] not blank, [Call attempts] blank).",
    "source": "Waiting list sheet",
    "frequency": "Daily",
    "target_or_alarm": "Target: 0 on all three. Alarm on any row, because unlogged calls break every funnel number and inflate the backlog alert.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Add the counts to the Dashboard and as a 'Rows needing update' line in the 9pm report. Add conditional formatting that turns these rows red."
   },
   {
    "name": "20. SMS delivery rate (ClickSend)",
    "definition": "Texts delivered versus failed, split by type: lead confirmation, caller alert and owner copy. Also track the ClickSend credit balance.",
    "formula": "Delivered / Sent and Failed / Sent, per type per day. Credit balance in \u00a3.",
    "source": "ClickSend",
    "frequency": "Daily; balance checked daily",
    "target_or_alarm": "Target: 98% or more delivered. Alarm if more than 3% fail in a day, on any 'Insufficient credit' or 'Invalid sender ID' error, or if the balance drops below \u00a310. A failed caller alert means a lead nobody was told about.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Failures are silent in Apps Script today.\n- Change sendSms() in apps-script.gs to return ClickSend's message_id and status, and write 'SMS ID' and 'SMS status' columns for the lead text.\n- Log every send to an 'SMS log' tab: Time | Type | To (last 4 digits) | message_id | Status | Price.\n- Add a daily pullSmsStatus() trigger that calls GET https://rest.clicksend.com/v3/sms/history with date_from and date_to, using Basic auth with CLICKSEND_USER and CLICKSEND_KEY. It matches message_id and writes Delivered or Failed with the reason.\n- Or set a ClickSend delivery-receipt URL pointing at the Apps Script web app's doPost.\n- Check GET /v3/account daily and email the owner if the balance is below \u00a310."
   },
   {
    "name": "21. SMS cost per lead",
    "definition": "Total ClickSend spend divided by unique leads. It includes the lead text, caller alerts, owner copies and messages that split into 2 parts.",
    "formula": "SUM(SMS log[Price] for the day) / unique leads for the day.",
    "source": "ClickSend",
    "frequency": "Weekly",
    "target_or_alarm": "Target: \u00a30.20 per lead or less. Alarm above \u00a30.30, usually caused by OWNER_MOBILE copies, several callers in 'all' mode, or 2-part messages.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "ClickSend's sms/history returns a price for each message, so sum it into the Daily log. Or enter the monthly ClickSend top-up and invoice in the Spend tab."
   },
   {
    "name": "22. Email bounce rate",
    "definition": "Share of confirmation emails that bounce, plus the share of leads with no email at all.",
    "formula": "COUNTIFS([Email status] = 'Bounced') / COUNTIFS([Email] not blank). No email = COUNTIFS([Email] blank) / unique leads.",
    "source": "Gmail (bounce notices in the info@ inbox)",
    "frequency": "Daily",
    "target_or_alarm": "Target: 2% or less. Alarm above 5%, from typos on the website form (add a 'confirm email' field) or junk leads. Also alarm on any 'quota exceeded' failure (Workspace allows about 1,500 recipients a day).",
    "currently_tracked": "no",
    "how_to_capture_if_not": "MailApp sends from info@, so bounces arrive there as Delivery Status Notifications. Add a daily scanBounces() that runs GmailApp.search('from:(mailer-daemon OR postmaster) newer_than:2d'), takes the failed address from the X-Failed-Recipients header or the message body, finds the row and sets 'Email status' to Bounced. Set 'Email status' to Sent when MailApp succeeds in handleLead() and in the website script, and to 'Failed: error' in the catch block."
   },
   {
    "name": "23. Opt-out (DO NOT CONTACT) rate",
    "definition": "Share of unique leads set to DO NOT CONTACT, with the reason.",
    "formula": "COUNTIFS([Status] = 'DO NOT CONTACT', sign-up week = w) / unique leads for week w, split by Ad name and Source.",
    "source": "Waiting list sheet + info@ inbox",
    "frequency": "Weekly",
    "target_or_alarm": "Target: 2% or less. Alarm above 5% in a week, or on any opt-out saying 'I never signed up' (accidental form taps or a misleading ad).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The status exists and the scripts enforce it, but no rate is reported. Use the DNC dropdown outcome; onCallLogged stamps 'DNC at' and asks for a reason in Notes. Add a weekly COUNTIFS to the Dashboard, and log stop requests that arrive by email in the same way."
   },
   {
    "name": "24. Marketing consent rate",
    "definition": "Share of unique leads who ticked the optional, unticked-by-default box for news and offers. Only these people may ever get promotional messages.",
    "formula": "COUNTIFS([Marketing consent] = 'Yes', [Duplicate of] blank) / unique leads, by Source.",
    "source": "Waiting list sheet",
    "frequency": "Weekly (daily check that it isn't 0)",
    "target_or_alarm": "Target: 30% or more. Alarm below 15%. Also alarm on 0 'Yes' in a day with 5 or more leads, which means the checkbox is missing or custom_disclaimer_responses parsing has broken.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The Meta script already fills the column. Add the rate to the Dashboard. Check that the website /register script writes the same column. For phone leads, record consent only when it is given explicitly, in Notes (e.g. 'consent verbal dd/mm')."
   },
   {
    "name": "25. Duplicate sign-up rate",
    "definition": "Share of sign-ups whose phone number (normalised) or email is already on an earlier row, including people who are already booked and sign up again.",
    "formula": "COUNTIFS([Duplicate of] not blank) / gross sign-ups, by week and Ad.",
    "source": "Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Target: 5% or less. Alarm above 10%, which suggests ad frequency is too high or people aren't sure they're on the list (reassure them in the text).",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Before appendRow in handleLead() and in the website script, search the Phone column with the same digit normaliser that metaDoNotContact() uses, and the Email column in lowercase. Write 'Duplicate of' = the first row's Lead ID, and skip the caller alert for duplicates. If you'd rather not touch the scripts, use a sheet helper instead: =IF(COUNTIF(Key$1:Key(row-1), Key) > 0, 'Dup', ''), where Key = RIGHT(REGEXREPLACE(TO_TEXT(Phone), '\\D', ''), 10). Leave duplicates out of cost per lead and every funnel denominator."
   },
   {
    "name": "26. People per sign-up",
    "definition": "Average number of people per unique sign-up, and the spread across 1, 2, 3 and 4+.",
    "formula": "SUM([People (n)]) / COUNT(unique rows), by Ad name.",
    "source": "Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Target: 1.8 or more. Alarm below 1.3. Ad B (mum and daughter) should come out higher than Ad A; if it doesn't, the family angle isn't working.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Use the 'People (n)' helper from metric 2, and break it down by 'Ad name' (metric 43)."
   },
   {
    "name": "27. Adult / child / family mix",
    "definition": "Split of unique sign-ups by the answer to 'Who is this for?'.",
    "formula": "COUNTIFS([Adult/Child/Family] = x) / unique leads, by Ad name and Source.",
    "source": "Waiting list sheet; later Dentally (age at registration)",
    "frequency": "Weekly",
    "target_or_alarm": "No fixed target; use it to plan child and family sessions. Alarm if more than 5% of answers are blank (the form field mapping has broken), or if families fall below 20% while Ad B is running.",
    "currently_tracked": "yes",
    "how_to_capture_if_not": "Already on the Dashboard. Add a breakdown by Ad name once that is captured. After opening, check it against the age bands of patients actually registered in Dentally."
   },
   {
    "name": "28. Share currently registered with another dentist",
    "definition": "Split of answers to 'Are you currently registered with a dentist?' (Yes / No / Not sure), and the rest of the funnel for each answer.",
    "formula": "COUNTIFS([Currently Registered?] = 'Yes') / unique leads. Booked % and no-show % by answer.",
    "source": "Waiting list sheet + caller notes",
    "frequency": "Weekly",
    "target_or_alarm": "No fixed target; expect a majority 'No'. Alarm if 'Yes' is above 50%: these are switchers, who have less urgency and a higher no-show risk, and some may be the owner's own patients (see metric 29).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Add the split to the Dashboard. Add a caller dropdown, 'Current practice': none / lapsed / Leven (own) / Glenrothes Dental House (own) / other own practice / other NHS practice / private / not sure. Show the funnel by this answer."
   },
   {
    "name": "29. Own-practice cannibalisation",
    "definition": "Share of leads and new registrations who are already active patients at the owner's 4 Fife practices. Alongside it, the weekly count of Kirkcaldy-postcode (KY1/KY2) new patients at Leven and Glenrothes, compared with before launch.",
    "formula": "Leads matched to existing patients / unique leads. KY1/KY2 new patients per month at Glenrothes (baseline about 100-135 a month) and Leven (about 30-65 a month) before and after launch.",
    "source": "Dentally (all 4 practices) + Waiting list sheet + weekly Dentally tracker",
    "frequency": "Weekly tracker; monthly match",
    "target_or_alarm": "No fixed target. Alarm if more than 20% of leads are already the owner's patients, because the ads are then paying to move existing patients. A sharp drop in KY1/KY2 sign-ups at Glenrothes or Leven shows the effect too.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The weekly tracker already logs Kirkcaldy-postcode counts; keep it. To match leads: check first that there is a data-sharing basis between the practices' legal entities. If there is, export active patients' mobiles monthly, store only the last 10 digits in a protected 'Existing patients' tab with no names, and add a column 'Existing patient at' = MATCH(Key, Existing!A:A, 0). If there isn't, rely on the caller's 'Current practice' answer (metric 28)."
   },
   {
    "name": "30. Postcode mix and in-area rate",
    "definition": "Spread of unique leads by postcode sector, the share inside the roughly 10-mile target, and the share with an invalid or blank postcode. Target sectors: KY1/KY2 Kirkcaldy core; KY3 Burntisland/Kinghorn; KY4/KY5 Cowdenbeath/Lochgelly; KY6/KY7 Glenrothes; KY8 Leven/Methil.",
    "formula": "COUNTIFS([Postcode sector] = s) / unique leads. In area = COUNTIFS([In area] = 'Yes') / unique leads. Invalid = COUNTIFS([Postcode sector] = 'Invalid') / unique leads.",
    "source": "Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Target: at least 70% in KY1/KY2 and at least 95% in KY1-KY8. Alarm if more than 10% are out of area or more than 5% invalid. Also alarm if KY7 is above 15%, which means pulling patients from Glenrothes Dental House.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The Dashboard already counts by sector. Add helper columns P = UPPER(REGEXREPLACE([Postcode], '\\s', '')), and 'Postcode sector' = IF(REGEXMATCH(P, '^[A-Z]{1,2}\\d[A-Z\\d]?\\d[A-Z]{2}$'), REGEXREPLACE(P, '^([A-Z]{1,2}\\d[A-Z\\d]?)(\\d)[A-Z]{2}$', '$1 $2'), 'Invalid'). Add 'In area' = IF(REGEXMATCH([Postcode sector], '^KY[1-8] '), 'Yes', 'No'). Compare booked and no-show rates by sector."
   },
   {
    "name": "31. Overnight vs daytime sign-ups, and the hourly pattern",
    "definition": "Share of sign-ups that arrive from 21:00 to 07:59, a sign-up histogram by hour and weekday, and the funnel for overnight versus daytime leads.",
    "formula": "COUNTIFS([Overnight] = 'Yes') / unique leads; COUNTIFS(HOUR([Signup Time]) = h); reach % and booked % for each group.",
    "source": "Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "No fixed target. Alarm if overnight is above 35% of sign-ups: the 8am queue is then bigger than the caller's first 2 hours, so start a caller at 08:00 sharp or add morning cover.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Use the 'Overnight' helper from metric 7 and Hour = HOUR([Signup Time]). The 'Call 8am' status disappears once a caller overwrites it, so the helper column is the only lasting record."
   },
   {
    "name": "32. QR scan to sign-up conversion (leaflet, banner, website)",
    "definition": "For each source, the share of visits logged in the Visits tab that become a sign-up from the same source, plus the cost per lead for print.",
    "formula": "COUNTIFS(WL[Source] = 'leaflet', week) / COUNTIFS(Visits[Source] = 'leaflet', week). The same for banner and website. Print cost per lead = (print + distribution cost) / leaflet leads.",
    "source": "Visits tab + Waiting list sheet + Spend tab",
    "frequency": "Weekly",
    "target_or_alarm": "Target: 25% or more. Alarm if it is below 10% with 20 or more visits, which suggests the register page or form is broken or slow on mobile.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Visits and sign-ups are both logged already; add the ratio to the Dashboard. Enter print, banner and distribution costs in the Spend tab. For future print runs, give each leaflet drop area its own short link (e.g. /l2) so areas can be compared."
   },
   {
    "name": "33. Booked to attended (show rate)",
    "definition": "Share of booked first new-patient appointments that the patient attended, counted per person, including each family member booked under one lead.",
    "formula": "COUNTIFS([Attended] = 'Yes') / COUNTIFS([Appt date] < TODAY(), [Status] = 'Booked'), counted per person from the Dentally tab.",
    "source": "Dentally (weekly pull) matched to the Waiting list sheet",
    "frequency": "Weekly from opening",
    "target_or_alarm": "Target: 90% or more. Alarm below 85%.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Every week, export the Dentally Appointments report for the Kirkcaldy site (the last 7 days and the next 8 weeks). Fields: patient ID, mobile, email, postcode, appointment date, type, state (Completed / Did not attend / Cancelled) and date created. Paste it into a 'Dentally' tab, or pull it through the Dentally API if the account has it. On both tabs add 'Key' = RIGHT(REGEXREPLACE(TO_TEXT(mobile), '\\D', ''), 10). Fill the Waiting list columns 'Dentally ID', 'Appt date', 'Attended' and 'People attended' with XLOOKUP or COUNTIFS on Key, falling back to email. Family members who share a mobile count as people under the same lead."
   },
   {
    "name": "34. No-show (DNA) rate",
    "definition": "Share of new-patient appointments where the patient did not attend and gave no notice.",
    "formula": "COUNTIFS(Dentally[State] = 'Did not attend', new-patient appointments due in week w) / appointments due in week w. Split by source, booking lead time, and 'Currently registered' answer.",
    "source": "Dentally",
    "frequency": "Weekly",
    "target_or_alarm": "Target: 8% or less. Alarm above 12% in a week. Set the baseline from Glenrothes' new-patient no-show rate for Feb-Mar 2026 in Dentally.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Use the same weekly Dentally pull and match (metric 33). Record whether Dentally's reminders went out (7 days and 48 hours before), and show the no-show rate by booking lead-time band (0-2, 3-4, 5-8, 8+ weeks) to decide how far ahead to book."
   },
   {
    "name": "35. Cancellations, late cancellations and rebooking",
    "definition": "Share of booked appointments cancelled, the share cancelled less than 24 hours before, the share rebooked within 7 days, and how many freed slots were refilled from the waiting list.",
    "formula": "Cancelled / booked; late (<24h) / booked; rebooked within 7 days / cancelled; refilled slots / freed slots.",
    "source": "Dentally + Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Targets: cancellations 10% or less, late cancellations 4% or less, at least 60% rebooked. Alarm if cancellations are above 15%.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Take the appointment state, cancellation time and reason from the weekly Dentally pull, and add 'Cancelled' and 'Rebooked' columns through the match. When a slot frees up, the caller rings the next people on the list and logs the outcome 'Backfill booked' to count refilled slots."
   },
   {
    "name": "36. Drop-out before the first appointment",
    "definition": "Share of booked or on-list people who withdraw before their first appointment (found another dentist, moved away, no longer needed).",
    "formula": "COUNTIFS([Status] = 'Withdrew') / COUNTIFS(ever Booked or 'on list'), with the reasons.",
    "source": "Waiting list sheet + Dentally cancellations",
    "frequency": "Weekly",
    "target_or_alarm": "Target: 10% or less. Alarm above 15%, which suggests the gap to opening is too long or keep-warm contact isn't happening.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Add 'Withdrew' to the Call outcome dropdown, with the reason in 'Not booked reason'. Log each opening-date update sent (a service message to everyone; promotional content only to people who gave consent) in the Daily log, and count the replies and withdrawals that follow."
   },
   {
    "name": "37. Attended to NHS registered, and registered people per lead",
    "definition": "Share of attended new patients with an NHS registration recorded in Dentally, and the number of NHS-registered people per unique lead.",
    "formula": "Registered / attended (people). Registered people per lead = SUM([People registered]) / unique leads, by sign-up cohort and source.",
    "source": "Dentally + Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Target: at least 95% of attended patients registered, and at least 0.8 registered people per lead. Alarm if fewer than 90% of attended patients are registered (paperwork or process gap).",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "The weekly Dentally tracker already counts new patients per practice, but they aren't linked to leads. Add the Dentally new patients / registrations report (registration date, patient ID, mobile, postcode) to the weekly pull, match on Key, and count household members per Key into 'People registered'."
   },
   {
    "name": "38. Where new registrations came from (attribution coverage)",
    "definition": "Share of new Kirkcaldy registrations that can be traced to a channel: a matched waiting-list lead (by its Source and Ad), walk-in, phone, word of mouth, NHS Fife list or other. Also the share that can't be traced. Glenrothes never had this.",
    "formula": "Registrations matched to a lead / all new registrations. Remaining registrations split by the 'How did you hear about us' answer. Unattributed = 1 minus the attributed share.",
    "source": "Dentally + Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Target: at least 90% of registrations attributed. Alarm below 75%.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Add 'How did you hear about us?' to the new-patient registration and medical history form: Facebook/Instagram ad, leaflet, banner, website, friend/family, walked past, NHS Fife list, other. Reception records the answer in Dentally: in a referral-source or custom field or patient flag if the account has one, otherwise as a note starting 'SRC:'. Each week, match on Key to the waiting-list Source first, and use the form answer for patients who don't match."
   },
   {
    "name": "39. First-visit treatment value: NHS vs private",
    "definition": "Average value per new patient in the 60 days after their first exam, split into NHS fees (claims) and private income, by source and ad.",
    "formula": "(SUM(NHS claim value) + SUM(private invoiced)) / attended new patients, over a 60-day window. Private share = private / total.",
    "source": "Dentally (NHS claims and treatment plans; invoices and payments)",
    "frequency": "Monthly",
    "target_or_alarm": "Target: set from the 2026 Glenrothes new-patient baseline in Dentally. Alarm if the average is more than 25% below that baseline after 8 weeks, or if it is below cost per attended patient (metric 42).",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Run Dentally reports monthly: claims and treatment by patient (NHS) and invoices or payments (private), for patients first seen in the period. Paste them into a 'Value' tab, join on Dentally ID, and show averages by Source and Ad name on the Dashboard."
   },
   {
    "name": "40. Private treatment interest (implants etc.) and conversion",
    "definition": "Share of people reached, and later of patients who attended, who are interested in implants, aligners or orthodontics, whitening or cosmetic work. Then follow them through: consultations booked, treatment accepted, and \u00a3 value.",
    "formula": "Interest = COUNTIFS([Private interest] not in {blank, None}) / reached. Consultations = implant or cosmetic consult appointments. Acceptance = accepted private plans / consultations. Value = SUM(accepted plan \u00a3).",
    "source": "Waiting list sheet (caller) + Dentally",
    "frequency": "Weekly; monthly value",
    "target_or_alarm": "Target: interest from at least 5% of people reached, and at least 30% of consultations accepted. Alarm if there are no implant consultations in the first 4 weeks after opening.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Add a caller dropdown, 'Private interest': None / Implants / Aligners-ortho / Whitening / Cosmetic / Other. Ask it neutrally at the end of the call, and never as a condition of an NHS place. Follow-up marketing goes only to people with Marketing consent = Yes. After opening, count consult appointment types and accepted private plans in Dentally, matched by Dentally ID."
   },
   {
    "name": "41. Cost per booked patient",
    "definition": "Ad spend divided by booked leads and by booked people, by source and by ad, grouped by sign-up week.",
    "formula": "Meta spend incl. VAT for week w / COUNTIFS([Status] = 'Booked', [Source] in {facebook, instagram}, sign-up week = w). Per person: / SUM([People booked]). Per ad: Spend tab spend for the ad / that ad's bookings.",
    "source": "Meta Ads Manager/API (Spend tab) + Waiting list sheet",
    "frequency": "Weekly cohort",
    "target_or_alarm": "Target: \u00a38 or less per booked lead, or \u00a34.50 or less per booked person (at \u00a33 per lead and 50% booked, expect about \u00a36). Alarm above \u00a312 per booked lead over a 2-week cohort.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Needs the Spend tab (metric 3), the Booked status from onCallLogged, 'People booked', and 'Ad name' (metric 43)."
   },
   {
    "name": "42. Cost per attended and per NHS-registered patient (fully loaded)",
    "definition": "Total acquisition cost divided by people who attended and by people NHS-registered. Total cost = Meta spend incl. VAT + ClickSend + print, banner and distribution + caller time. Also show an ads-only version.",
    "formula": "(Meta spend incl VAT + SMS + print + caller hours x hourly cost) / SUM([People attended]); the same divided by SUM([People registered]); ads-only = Meta spend / SUM([People attended]).",
    "source": "Spend tab (Meta, ClickSend, print) + Daily log (caller hours) + Dentally match",
    "frequency": "Monthly (weekly once open)",
    "target_or_alarm": "Target: ads-only \u00a36 or less per attended person, and \u00a312 or less fully loaded. Alarm if ads-only is above \u00a310, fully loaded is above \u00a320, or either is above the average first-visit NHS value (metric 39).",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Add rows to the Spend tab for ClickSend (monthly), the print runs, the banner and leaflet distribution. Record caller shift hours in the Daily log at a stated hourly cost. Attended and registered people come from the weekly Dentally match (metrics 33 and 37)."
   },
   {
    "name": "43. Funnel by ad and source (choosing the winner on quality)",
    "definition": "For Ad A (woman in chair) vs Ad B (mum and daughter), Facebook vs Instagram, and leaflet / banner / website / phone: leads, reach %, booked %, attended %, people per lead, cost per booked and cost per attended.",
    "formula": "A QUERY pivot of the Waiting list by [Ad name] and [Source], with the metrics above; per-ad spend from the Spend tab.",
    "source": "Waiting list sheet + Meta Ads Manager/API + Dentally match",
    "frequency": "Weekly (decide once each ad has 50 or more leads)",
    "target_or_alarm": "Target: in week 2, pick the winner on cost per booked lead rather than cost per lead. Alarm when one ad's cost per lead is 30% cheaper but its booked rate is 30% lower: the cheap leads are poor quality.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Today the sheet records only the platform, not which ad brought the lead. In pollMetaLeads() add ad_id, ad_name, adset_name, campaign_name, form_id and is_organic to the Graph 'fields' list. In handleLead() write 'Ad name' = l.ad_name and 'Lead ID' = l.id, and add both column headers."
   },
   {
    "name": "44. Complaints",
    "definition": "Complaints and negative feedback about the campaign or how people were contacted, per 1,000 leads. Types: contacted too often or after opting out, misleading ad or NHS wording, privacy or data, call manner, no call received, long wait for an appointment.",
    "formula": "COUNT(Complaints rows in week w) / unique leads in week w x 1000, by type. Days to close = [Closed date] - [Date].",
    "source": "Manual (Complaints tab) + Facebook/Instagram comments and DMs + info@ email + phone",
    "frequency": "Weekly; same day for serious ones",
    "target_or_alarm": "Target: no formal complaints, and 1 or fewer informal per 1,000 leads. Alarm on any formal, privacy/ICO or NHS Fife complaint, or 2 or more of the same type in a week. Under the NHS Scotland complaints procedure, frontline complaints are resolved within 5 working days; investigations are acknowledged within 3 working days and answered within 20.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Add a 'Complaints' tab: Date | Channel (phone / email / FB comment / DM / in person / NHS Fife) | Lead ID | Type | Summary | Action | Owner | Closed date. Add the weekly count to the Daily log and the Dashboard. Any complaint that involves an opt-out gets DO NOT CONTACT the same day."
   },
   {
    "name": "45. Reply time on social comments and messages",
    "definition": "Time to first reply to comments and messages on the ads and the Page, plus a weekly count of negative or 'nobody called me' comments.",
    "formula": "Median minutes to first reply (Business Suite Inbox) and the count of comments still unanswered after 12 hours.",
    "source": "Meta Business Suite (Inbox) + manual",
    "frequency": "Daily check; weekly figure",
    "target_or_alarm": "Target: 3 hours or less, 8am-9pm. Alarm if any reply takes over 12 hours, or any 'nobody called me' comment goes unanswered.",
    "currently_tracked": "partly",
    "how_to_capture_if_not": "Business Suite shows message response time; comments are not tracked. Record a weekly manual count of comments and negative comments in the Daily log. Reply only with the 'waiting list' wording."
   },
   {
    "name": "46. Inbound phone calls (once the 01592 number is live)",
    "definition": "Calls received, share answered, missed calls, voicemails, time to call back a missed call, and the share of callers added to the waiting list (Source = phone).",
    "formula": "Answered / received (8am-9pm); MEDIAN(callback time - missed call time); COUNTIFS(WL[Source] = 'phone') / callers who were new contacts.",
    "source": "Phone system call log + Waiting list sheet",
    "frequency": "Daily",
    "target_or_alarm": "Target: 90% or more answered, and missed calls returned within 60 minutes. Alarm if fewer than 80% are answered or callbacks take over 4 hours.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Export the phone provider's call log daily into a 'Phone log' tab, or keep a manual tally. Log every new caller as a Waiting list row with Source = phone. If missed-call text-back is added later, count those texts in the SMS log."
   },
   {
    "name": "47. New-patient diary capacity and fill",
    "definition": "People booked compared with available new-patient exam slots for each week after opening.",
    "formula": "Fill(w) = SUMIFS([People booked], appointment week = w) / Slots(w).",
    "source": "Dentally (diary) + Waiting list sheet",
    "frequency": "Weekly",
    "target_or_alarm": "Target: weeks 1-4 at least 90% full before opening. Alarm if the next 4 weeks are under 60% full with 14 days to go (raise the budget or do a leaflet drop). Also alarm if booking lead time goes over 8 weeks (metric 16): cut the budget or open more sessions. For scale, Glenrothes peaked at about 85 registrations a day.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Every week, export Dentally's free and booked new-patient exam slots by week into a 'Capacity' tab: Week | Slots | Booked | Fill %. Show it on the Dashboard next to the waiting-list head count (metric 2)."
   },
   {
    "name": "48. Marginal cost per lead after each budget increase",
    "definition": "What the extra leads cost after a budget step (\u00a320 to \u00a325, \u00a335 and \u00a350). It shows whether scaling is still worth it and still within what one caller can handle.",
    "formula": "(Spend over the 3 days after the change - spend over the 3 days before) / (unique leads after - unique leads before).",
    "source": "Meta Ads Manager/API (Spend tab) + Waiting list sheet",
    "frequency": "3-4 days after each budget change",
    "target_or_alarm": "Target: marginal cost per lead no more than 1.5 times the current average. Alarm if it is above \u00a38, or if leads go above 35 a day per caller: stop scaling.",
    "currently_tracked": "no",
    "how_to_capture_if_not": "Record the daily budget in the Spend tab and the Daily log. Mark each budget-change date, and have the Dashboard compute the before/after windows."
   }
  ]
 }
]