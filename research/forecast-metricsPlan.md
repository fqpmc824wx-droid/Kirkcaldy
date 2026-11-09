# Kirkcaldy Dental waiting-list launch: tracking plan

Version 1, 8 Nov 2026. This merges both metric designs into one plan. Section A is what the owner looks at, B lists every metric, C is the build list that makes B work, and D is the Monday report.

---

## 0. Definitions used everywhere

- **Calling hours:** 08:00–21:00 Europe/London (`CALL_HOURS` 8-21).
- **Clock start:**
  - Signup Time, for sign-ups in calling hours.
  - 08:00 the same day, for sign-ups between 00:00 and 07:59.
  - 08:00 the next day, for sign-ups between 21:00 and 23:59.
- **Week:** Monday 00:00 to Sunday 23:59.
- **Cohort metrics** (reach and booking rates) are grouped by sign-up week. They are reported only once the cohort is at least 3 days old. Last week's cohort is shown as "provisional".
- **Unique lead:** a Waiting list row whose phone (last 10 digits) or email (lower case) is not on any earlier row. Every rate uses unique leads as its base.
- **Meta lead (sheet):** a Source of facebook or instagram, with Organic? not "Yes".
- **Active:** Status is not DO NOT CONTACT, Not interested, Wrong number or Withdrew.
- **People (n):** the number in No. of People. "4+" counts as 4 and a blank counts as 1.
- **Attempted:** Call attempts is 1 or more.
- **Reached:** First reached at is not blank.
- **Spend:** Meta spend ex VAT. This is what Ads Manager shows, and the daily budget is also ex VAT.
  - Spend inc VAT = spend x 1.2 when there is no UK VAT number on the ad account.
  - Dental care is VAT-exempt, so budget on the inc-VAT figure. Alarm thresholds use ex VAT so they match Ads Manager.
- **CPL:** spend ex VAT ÷ unique Meta leads (sheet), on a 3-day rolling window. Meta's own CPL (spend ÷ the leads Meta reports) is shown next to it as a cross-check.

### Planning numbers behind the targets
- **Budget:**
  - £20/day = £140 a week ex VAT, or £168 inc VAT.
  - The 4-week plan (£20 → £25 → £35 → £50) comes to about £800–850 ex VAT, or £960–1,020 inc VAT.
- **Expected leads:**
  - Planning CPL band: £1–4 ex VAT. Demand is extreme: 1 of 57 Kirkcaldy NHS practices was accepting new patients.
  - At £20/day that gives 5–20 Meta leads a day: about 10 a day, or about 70 a week, at the centre of the band.
  - At £50/day it gives 12–50 a day.
- **Caller ceiling:**
  - One caller can take about 35 new leads a day.
  - At £20/day that is reached only if CPL falls below about £0.60. At £50/day it is reached below about £1.45.
  - So at £20/day the risk is too few leads, not too many.
- **Learning phase:** leaving learning takes about 50 leads in 7 days, which needs a CPL of about £2.85 or less at £20/day. "Learning limited" at £20/day is fine if CPL is on target.
- **What the Glenrothes figures can and can't tell you:**
  - Glenrothes figures are registrations from all channels, and its ad spend is unknown, so they cannot be used as a CPL benchmark.
  - The useful demand baseline is Kirkcaldy (KY1/KY2) people who already travel out of town to register:
    - Leven: 200–235 a month when it was the open option.
    - Glenrothes: 235 in March 2026, then 100–135 a month.

---

## A. Launch scorecard (15 metrics)

Daily figures are checked at 08:00 on the Dashboard and in the 21:00 email. Weekly figures go in the Monday report.

| # | Metric | Calculation | Green | Alarm → action |
|---|---|---|---|---|
| **S1** | Spend and pacing | Yesterday's spend ÷ daily budget. Cumulative spend ÷ plan. | 85–115% over the week (one day can reach 175% under Meta's allowed overspend). Cumulative within ±10% of plan. | £0 spent by 12:00, under 50% for 2 days, or cumulative more than 10% over plan → check review, payment and delivery. |
| **S2** | Meta leads a day (unique, sheet), plus all sign-ups by source | COUNTIFS on the Waiting list | 5–20 a day at £20/day | Fewer than 3 a day for 3 days after day 4 → check the ads are live, the form, and the token. More than 35 a day for 2 days → cut the budget 20% or add a second caller. |
| **S3** | CPL, 3-day rolling, ex VAT | Spend ÷ unique Meta leads. Meta's CPL shown alongside. | £3 or less = green. £3–6 = amber. | Above £6 for 3 days → tell the ads chat. £3 or less with caller load below 40% → raise the budget 20% (at most one change every 3–4 days). |
| **S4** | Plumbing: zero red flags | Lead sync gap; disapproved ads; account status; spend-cap headroom; failed lead texts; ClickSend balance; Meta API errors | Gap 0 (±1), 0 disapproved, account status 1, more than 7 days of headroom, under 3% texts failed, balance £10 or more | Any red → fix the same day. Each check sends its own email. |
| **S5** | Speed to lead and backlog | Median minutes from clock start to first attempt; % within 60 min; % of overnight leads attempted by 10:00; leads waiting over an hour at 21:00; overdue retries | Median 15 min or less (stretch: 5). 90%+ within 60 min. 90%+ of overnight leads by 10:00. 0 waiting at 21:00. 0 overdue retries. | Median over 30 min, any lead waiting over 2h in calling hours, 15+ waiting over an hour (the existing email), or a retry more than 4h overdue. |
| **S6** | Caller load | New leads per caller per day (by clock-start day) ÷ 35 | 60–90% | Above 100% for 2 days → cut the budget 20%, or add a second caller (ALERT_MODE `rotate`). Below 40% with S3 green → there is room to raise the budget. |
| **S7** | People on the waiting list | SUM of People (n) on unique, active rows; week-on-week growth | Grows every week. By opening day, at least as many people as there are new-patient exam slots in the first 4–6 weeks. | Growth falls 30% or more week on week at the same budget → check S10. |
| **S8** | Reach rate | Leads reached within 3 attempts ÷ leads attempted, by source and ad (cohort) | 70% or more | Below 55% overall, or below 50% for any source or ad → check placements, lead quality and calling times. |
| **S9** | Ad A vs Ad B | Spend share, CPL, cost per reached lead and people per lead, for each ad | Decide only once each ad has £50+ spend and 20+ leads. | An ad that is 30% or more worse on cost per reached lead after about 7 days → pause it. Don't force an ad that Meta gives less than 20% of spend. |
| **S10** | Fatigue and saturation | 7-day frequency (ad set); 3-day link CTR vs that ad's first 7 days; reach to date ÷ audience estimate | Frequency 2.5 or less; link CTR 1.5% or more; penetration below 50% | Frequency above 3, link CTR below 0.8% on 2,000+ impressions, or the fatigue flag (M22) → 1–2 new versions of the winning ad, or widen to 15 miles. |
| **S11** | Local share | % in Core (KY1/KY2); % in KY1–KY8; % in the owner's other practice areas (KY6–KY8); % invalid postcodes | Core 55% or more. KY1–KY8 90% or more. KY6–KY8 30% or less. Invalid 5% or less. | Core below 40% or outside the area above 10% → tighten the radius or exclude areas. KY6–KY8 above 35% → exclude Glenrothes/Leven, or route them to Glenrothes Dental House. |
| **S12** | Lead quality | Wrong numbers (including texts rejected as an invalid number); unreachable after 3 attempts; duplicates | 5% or less; 15% or less; 5% or less | Above 8%, 25% or 10% for any source or ad → check placements (Audience Network) and the form. |
| **S13** | Blended cost | (Meta inc VAT + print + distribution + banner + texts) ÷ unique sign-ups. Also leaflet response % and cost per leaflet sign-up. | Blended £4 or less. Leaflet CPL no more than 2x the Meta CPL. Leaflet response 0.3% or more. | Leaflet response below 0.2% 14 days after a drop → stop drops and move the money to Meta. |
| **S14** | Trust and compliance | DNC %; complaints; comments and DMs unanswered at 21:00 | DNC 2% or less. 0 formal complaints. 0 unanswered at 21:00. | Any formal, ICO or NHS Fife complaint, any "I never signed up", or DNC above 5% in a week → review the ad wording against BRAND.md the same day. |
| **S15** | Conversion (from opening) | Kirkcaldy new NHS registrations per week vs Glenrothes in the same week since opening; % of sign-ups registered within 8 weeks; show rate; cost per registered person | 100% or more of the Glenrothes curve. 50% or more registered. Show rate 90% or more. | Below 70% of Glenrothes in weeks 1–4 → invite waves from the list and restart the ads. DNA above 12%. |

---

## B. Metric catalogue

Notes on the table:
- WL = the Waiting list tab and LA = the Lead analysis tab.
- In the "Now" column, "yes", "partly" and "no" describe today's state, before the build in C.
- Targets marked "S#" are in the scorecard.

### B1. Meta delivery and cost
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M01 | Spend ex/inc VAT, daily and cumulative | `spend`; x VAT_ON_SPEND; running SUM from LAUNCH_DATE | Insights → Ads | Daily 06:00 | partly | S1 |
| M02 | Budget pacing | Yesterday's spend ÷ (daily_budget/100). At 12:00: today's spend ÷ (budget x 0.4) | Insights + ad set → Ad status | Daily + 12:00 | partly | S1 |
| M03 | Impressions | `impressions` | Ads | Daily | partly | 2,500–6,500 a day at £20. Alarm: 0 by 12:00, or a fall of more than 50% day on day with no budget change |
| M04 | Reach and audience penetration | `reach` (never add up across days). Reach to date ÷ midpoint(estimate_mau_lower_bound, upper_bound) | Insights + delivery_estimate → Ads weekly | Daily / weekly | partly | 2,000–5,000 a day; S10 |
| M05 | Frequency, 7-day and to date | Impressions ÷ reach from ONE 7-day query | Ads weekly | Daily | partly | S10 |
| M06 | CPM | spend ÷ impressions x 1000, 3-day | Ads → KPIs | Daily | partly | £3–8. Alarm: above £12 for 3 days. Below £1.50 with a poor CTR points to junk placements. |
| M07 | Clicks (all), CTR (all) | `clicks`, `ctr` | Ads | Daily | partly | 2% or more. Far above link CTR → read the comments. |
| M08 | Link clicks (= form opens), link CTR | `inline_link_clicks` ÷ impressions | Ads | Daily | partly | S10 |
| M09 | Cost per form open | `cost_per_inline_link_click` | Ads | Daily | partly | £0.50 or less. Alarm: above £1 for 3 days. |
| M10 | Form completion rate | Meta leads ÷ link clicks, per ad, 3-day | Ads → KPIs | Daily | no | 35% or more. Below 20% → shorten the intro, and test the postcode question and privacy link on a phone. |
| M11 | Leads as Meta reports them | `actions` onsite_conversion.lead_grouped (fall back to `lead`), dated by conversion time | Ads | Daily | partly | S2 |
| M12 | CPL (sheet-unique and Meta) | Spend ÷ unique Meta leads, 3-day; Meta CPL; x1.2 for inc VAT | Ads + LA → KPIs | Daily | partly | S3 |
| M13 | Marginal CPL after a budget step | (spend in the 3 days after − 3 days before) ÷ (leads after − leads before) | Ads + LA + Change log | 3–4 days after each step | no | No more than 1.5x the average. Alarm: above £8 → stop scaling. |
| M14 | Learning phase | ad set `learning_stage_info.status` | Ad status | Daily | partly | Out of learning within 7 days, or learning limited with CPL on target. Alarm: learning reset by an edit. |

### B2. Creative
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M15 | Spend share, leads, CPL by ad | Per ad_id. Sheet side: COUNTIFS on WL Ad ID | Ads + WL | Daily data, weekly decision | no | S9 |
| M16 | Placement split | `breakdowns=publisher_platform,platform_position`: spend share, CPL | Ads weekly | Weekly | partly | A placement with more than 10% of spend and a CPL above 1.5x the average for 7 days → check its reach rate, then exclude it |
| M17 | Age x gender | `breakdowns=age,gender` | Ads weekly | Weekly | partly | No narrowing in weeks 1–2. Flag a band with more than 15% of spend and a CPL above 2x the average for 2 weeks. |
| M18 | Region check | `breakdowns=region` | Ads weekly | Weekly | no | 100% Scotland. Anything else is a targeting error: fix it the same day. |
| M19 | Video hook rate | 3-second plays (`video_view`; fall back to 2-second continuous plays) ÷ impressions, Stories/Reels rows only | Ads weekly | Weekly per ad | partly | 25% or more. Below 15% → new first frame (face plus "NHS"). |
| M20 | Video hold, quartiles, average watch time | ThruPlays ÷ 3-second plays; p25–p100 ÷ plays; `video_avg_time_watched_actions` | Ads | Weekly | partly | Hold 40% or more; average 3 s or more. Hold below 25%, or a steep drop from p25 to p50 → move the address and "waiting list" earlier. |
| M21 | Relevance rankings | `quality_ranking`, `engagement_rate_ranking`, `conversion_rate_ranking`, last 7 days | Ads weekly | Weekly | partly | Average or better. Below average on an ad with 500+ impressions → replace the creative. |
| M22 | Creative fatigue flag | (3-day link CTR ≤ 0.7x the first-7-day CTR AND 7-day frequency ≥ 2.5) OR 3-day CPL ≥ 1.3x the first-7-day CPL | KPIs | Daily | no | S10. Never edit a live ad: that resets learning. |
| M23 | Ad engagement | `post_reaction`, `comment`, `post` (shares), `onsite_conversion.post_save`, `like`; post_engagement ÷ impressions | Ads | Weekly | partly | Watch the trend. Rising shares mean free reach. |

### B3. Meta account health and change history
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M24 | Ad rejections and issues | Count of ads that are DISAPPROVED, WITH_ISSUES, or PENDING_REVIEW for more than 24h, plus `ad_review_feedback` | Ads endpoint → Ad status | Every 2h, 08–21 | partly | 0. On any: fix the same day using BRAND.md wording ("waiting list" only). |
| M25 | Account health and payment | `account_status` (1 ok, 2 disabled, 3 unsettled, 7 risk review, 9 grace); headroom = spend_cap − amount_spent (in pence) | Account → Ad status | Every 2h | partly | Status 1 and more than 7 days of headroom |
| M26 | Change log | Meta activities plus manual lines | Change log | On every change; reviewed weekly | partly | Week 1: no changes for 3–4 days. After that, at most one significant change every 3–4 days. |

### B4. Lead capture and sync
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M27 | Sign-ups a day by source, gross and unique | COUNTIFS(date, Source[, Unique?="Yes"]) | WL/LA → Dashboard | Live, 21:00, weekly | partly (gross: yes) | S2. Alarm: fewer than 35 in total in any full week after week 1. |
| M28 | People on the list | SUMIFS(People (n), Unique?, Active?) | LA → KPIs | Daily | partly | S7 |
| M29 | Lead sync gap | Meta leads by conversion date − gross Meta rows that day (duplicates included, because Meta counts each submission) | Ads + LA | Daily; no-lead check every 2h | no | S4. Alarm: a gap of 2 or more or above 10%, or £5+ spent today with no facebook/instagram row for 4h in calling hours. |
| M30 | Sync delay | (Logged at − Signup Time) x 1440, median and maximum | WL | Daily | no | Median 2 min or less. Alarm: above 10 min. |
| M31 | Organic form leads | COUNTIF(Organic?,"Yes") | WL | Weekly | no | Left out of CPL and the sync gap |
| M32 | Facebook vs Instagram | Share of Meta leads | WL Source | Weekly | yes | Read together with placement CPL and reach rate |
| M33 | Duplicate rate, with a cross-source matrix | Rows with Unique?="No" ÷ gross rows | LA | Weekly | no | S12 |
| M34 | Sign-ups by hour x weekday; out-of-hours share | COUNTIFS on LA Hour/Weekday; Overnight="Yes" ÷ rows | LA | Weekly | partly | Out-of-hours above 30% → a dedicated 08–10 calling block |

### B5. Calling funnel
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M35 | Speed to lead | Median of LA Mins to first call; % within 5 and within 60 min | WL + LA | Daily | no | S5 |
| M36 | Overnight queue cleared | Overnight leads with First call at by 10:00 ÷ overnight leads | LA | Daily (morning) | partly | 90% or more by 10:00; 100% by 12:00 |
| M37 | Backlog and overdue retries | `metaBacklog()` (waiting, oldestMins); Status "No answer" with Next call due earlier than now | WL | Every 15 min, plus 21:00 snapshot | partly | S5 |
| M38 | Caller load and productivity | New leads per caller ÷ 35; dials per caller; dials per shift hour | WL Assigned to/Called by + Call log + Daily checks | Daily | partly | S6. 80 dials or fewer per caller a day. |
| M39 | Attempted within 24h | Attempted within 24h of clock start ÷ unique contactable leads | WL + LA | Daily | partly | 100%. Alarm: below 95%, or any lead past 24h with no attempt. |
| M40 | Answer rate by time band, weekday and attempt number | "Reached" attempts ÷ attempts | Call log | Weekly (needs 30+ attempts per band) | no | 45% or more on the 1st attempt; 40% or more overall. A band below 25% → move retries out of it. |
| M41 | Reach rate | Reached ÷ attempted, cohort | LA | Weekly | partly | S8 |
| M42 | Time to first contact | (First reached at − clock start) x 24 | LA | Daily / weekly | no | Median 1h or less; 80% or more within 72h. Alarm: median above 24h. |
| M43 | Attempts per lead | Attempt number at first "Reached"; total at close; spread across 1 / 2 / 3 / 4+ | Call log | Weekly | no | Average 2 or fewer. Cap of 3. Any lead with more than 4 attempts is a harassment risk. |
| M44 | Retry completion | No-answer leads that got attempt 2 by its due time and attempt 3 the next day ÷ no-answer leads | Call log | Daily | no | 95% or more. Alarm: below 85%, or any retry more than 4h overdue. |
| M45 | Reached → booked or "on list"; reasons not booked | Booked ÷ reached. Before the diary opens, "Reached - on list" is counted separately. | WL | Weekly cohort | partly | 70% or more booked once the diary opens. Below 50% → review the call script, wording and slots. |
| M46 | Lead → booked; booked people per lead | Booked ÷ unique; SUM(People booked) ÷ unique | WL | Weekly cohort | partly | 50% or more; 0.9 or more people a lead. Alarm: below 35%. |
| M47 | Days from sign-up to booking, and booking to appointment | MEDIAN(Booked at − Signup Time); MEDIAN(Appt date − Booked at) | WL + Dentally | Weekly | no | Booked within 2 days; appointment within 6 weeks. Above 8 weeks → slow the ads or open more new-patient sessions. |
| M48 | Call logging compliance | Status blank after 24h + Booked with no Appt date (once the diary is open) + Status set with no attempts | WL | Daily | no | 0 |

### B6. Lead quality and audience
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M49 | Postcode tiers | LA Tier: Core KY1/2, Near KY3–5, Own-practice area KY6–8, Outside, Invalid | LA | Weekly | partly | S11 |
| M50 | Overlap with the owner's other practices | Area: KY6–8 share. Patients: hashed matched count against actives at the 4 practices, or the caller's "Current practice" answer | LA + Dentally | Weekly / monthly | no | Area: S11. Patients: alarm above 20% (the ads are paying to move existing patients). |
| M51 | Currently-registered share | Yes / No / Not sure ÷ unique | WL | Weekly | yes | Alarm: "Yes" above 50% (switchers) |
| M52 | Adult/Child/Family mix, by ad | COUNTIFS on H by Ad name | WL | Weekly | yes (by ad: no) | Alarm: Family below 20% while Ad B runs, or more than 5% blank (field mapping broken) |
| M53 | People per lead; cost per person | SUM(People (n)) ÷ unique; spend ÷ people | LA + Ads | Weekly, by source and ad | partly | 1.5–2 a lead. Alarm: below 1.3. Meta £2 or less a person. Ad B should beat Ad A. |
| M54 | Wrong number, invalid, unreachable | Status Wrong number + SMS status "Failed: invalid"; Status Unreachable ÷ unique | WL + SMS log | Weekly | no | S12 |
| M55 | DNC rate and reason | COUNTIF(Status,"DO NOT CONTACT") ÷ unique, by source and ad | WL | Weekly | partly | S14 |
| M56 | Marketing-consent rate | "Yes" ÷ unique, by source | WL | Weekly; daily zero check | partly | 30% or more. Alarm: below 15%, or 0 "Yes" on a day with 5+ leads (checkbox or parsing broken). |
| M57 | Self-reported source | How heard ÷ answered, compared with Source | WL (website and caller), Dentally after opening | Weekly | no | More than 20% "friend or family" → ask sign-ups to share |
| M58 | Private-treatment interest → consultation → accepted £ | Private interest ≠ None ÷ reached; consultations; accepted plan £ | WL + Dentally | Weekly / monthly | no | 5% or more of people reached; 30% or more of consultations accepted |

### B7. Offline and other channels
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M59 | Visits by source | COUNTIFS(Visits!B, src, period) | Visits (Hostinger as a cross-check) | Daily / weekly | yes | 0 leaflet scans 3 days after a drop → test the printed QR code |
| M60 | Visit → sign-up conversion | Sign-ups ÷ visits per src (exact match once Visit ID exists) | Visits + WL | Weekly | partly | 30% or more. Below 15% with 20+ visits → test /register/ on a phone. |
| M61 | Leaflet response and cost per sign-up, per drop | Sign-ups ÷ leaflets delivered; (print + distribution) ÷ sign-ups | WL + Costs sheet | Weekly, and 14 days after each drop | no | S13 |
| M62 | Banner scans and cost per sign-up | Banner visits a week; (print + fitting) ÷ sign-ups | Visits + WL + Costs sheet | Weekly | partly | 5+ scans a week. Fewer than 5 after 2 weeks → move it or enlarge the QR. |
| M63 | Website and tagged links | Visits and sign-ups for src fb-page, ig-bio, fb-form-done, fb-dm, home, website | Visits + WL + Hostinger | Weekly | partly | A rise is the ads' wider effect. Don't credit it to Meta. |
| M64 | Inbound calls (once the 01592 number is live) | Answered ÷ received; missed calls; median callback time; Source=phone rows ÷ new callers; Meta `click_to_call_call_confirm` | Phone provider log + WL + Ads | Daily | no | 90% or more answered; callbacks within 60 min. Alarm: below 80%, or callbacks over 4h. |

### B8. Text messages and email
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M65 | Text delivery rate by type | Delivered ÷ sent for lead text, caller alert, owner copy and morning summary | ClickSend → SMS log | Daily | no | 97% or more. Alarm: below 95% in a day, or any INSUFFICIENT_CREDIT. A failed caller alert is a lead nobody was told about. |
| M66 | Text cost per lead; ClickSend balance | SUM(price) ÷ unique leads; `/v3/account` balance | SMS log | Weekly; balance daily | partly | 15p a lead or less. Alarm: above 30p, or balance below £10. |
| M67 | Email failures and bounces | (Failed + Bounced) ÷ emails sent; share of leads with no email | WL Email status | Daily | no | 2% or less. Alarm: above 5%, or any quota error. |

### B9. Cost roll-ups (KPIs tab)
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M68 | CPL by channel; blended CPL; total acquisition cost | Channel cost ÷ channel sign-ups; all costs ÷ all unique sign-ups | Ads + Costs sheet + SMS log + LA | Weekly | no | S13 |
| M69 | Cost per reached lead, by ad and source | Spend ÷ reached leads (cohort) | Ads + LA | Weekly | no | S9 |
| M70 | Cost per booked lead / per booked person | Spend ÷ Booked; ÷ SUM(People booked) | Ads + WL | Weekly cohort | no | £8 or less / £4.50 or less. Alarm: above £12 a booked lead. |
| M71 | Cost per attended / per registered person | Ads only, and fully loaded (Meta inc VAT + texts + print + caller hours x rate) ÷ people attended or registered | Ads + Costs sheet + Daily log + Dentally match | Monthly (weekly once open) | no | Ads only £6 or less per attended person; fully loaded £12 or less. Alarm: above £10 / £20, or above M84. |

### B10. Social and reputation (manual first)
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M72 | Comments: new, unanswered at 21:00, reply time, risky | Counts logged by staff | Daily checks | Daily | partly | Reply within 3h, 08–21; 0 unanswered at 21:00 |
| M73 | DMs: new, first reply time, unanswered | Business Suite inbox | Daily checks | Daily | no | First reply within 3h; 0 unanswered at 21:00 |
| M74 | Facebook and Instagram followers | `followers_count`, `fan_count`; daily change | Page/IG API → Ad status | Daily | partly | A sudden drop → check comments and complaints |
| M75 | Complaints per 1,000 leads by type; days to close | Count ÷ unique x 1000; Closed − Date | Complaints | Weekly; serious ones the same day | no | S14. NHS Scotland procedure: frontline complaints closed in 5 working days; investigations acknowledged in 3 and answered in 20. |

### B11. After opening (Dentally)
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M76 | Diary capacity and fill | People booked ÷ new-patient exam slots, per week | Dentally → Capacity | Weekly | no | Weeks 1–4 90% or more full before opening. Next 4 weeks below 60% with 14 days to go → raise the budget or do a leaflet drop. |
| M77 | Show rate | Attended ÷ booked appointments now past (per person) | Dentally match | Weekly | no | 90% or more. Alarm: below 85%. |
| M78 | DNA rate | DNAs ÷ appointments due, by source, booking lead-time band (0–2, 3–4, 5–8, 8+ weeks) and registered answer | Dentally | Weekly | no | 8% or less. Alarm: above 12%. Baseline: Glenrothes Feb–Mar 2026. |
| M79 | Cancellations, late cancellations, rebooking, backfill | Cancelled ÷ booked; cancelled under 24h ÷ booked; rebooked within 7 days ÷ cancelled; slots refilled from the list ÷ slots freed | Dentally + WL | Weekly | no | 10% or less; 4% or less; 60% or more rebooked. Alarm: cancellations above 15%. |
| M80 | Drop-out before the first appointment | Withdrew ÷ (Booked + on list) | WL + Dentally | Weekly | no | 10% or less. Above 15% → send keep-warm updates. |
| M81 | Attended → NHS registered; registered people per lead | Registered ÷ attended; SUM(People registered) ÷ unique | Dentally match | Weekly | partly | 95% or more; 0.8 or more a lead. Below 90% = a paperwork gap. |
| M82 | Waiting list → registered, by source and ad | Matched registrations ÷ unique sign-ups | Dentally + WL | Weekly for 8 weeks, then monthly | no | S15. A source below 25% = a poor channel. |
| M83 | Attribution coverage | Registrations matched to a lead or with How heard ÷ all registrations | Dentally | Weekly | no | 90% or more. Alarm: below 75%. |
| M84 | First-visit value, NHS vs private (60 days) | (NHS claims + private invoiced) ÷ attended | Dentally → Value | Monthly | no | No more than 25% below the Glenrothes 2026 baseline, and above M71 |
| M85 | Kirkcaldy-postcode new patients at Leven and Glenrothes | Weekly KY1/KY2 count per practice | Weekly tracker | Weekly | yes | Baseline: Leven 30–65 a month, Glenrothes 100–135. A drop shows the list is capturing local demand. |
| M86 | Opening curve vs Glenrothes | Kirkcaldy week n ÷ Glenrothes week n | Weekly tracker | Weekly from opening | partly | S15 |

### B12. Market
| ID | Metric | Formula | Source → tab | Freq | Now | Target / alarm |
|---|---|---|---|---|---|---|
| M87 | Local competition | Fife dental advertisers in the Meta Ad Library; number of Kirkcaldy NHS practices accepting | Change log (Source = market) | Weekly / monthly | no | A Kirkcaldy practice starts accepting → expect a higher CPL; stress the address and opening date |

---

## C. Tracking gaps and build list

### C0. Rules for the shared Apps Script project (all chats)
- **Files:** one project, bound to the Waiting List sheet.
  - `leaflet/apps-script.gs`: website (leaflet chat).
  - `leads/meta-leads.gs`: Facebook leads (ads chat).
  - New `tracking.gs` (leaflet chat).
  - New `meta-ads.gs` (ads chat).
  - Every function is global across all files.
- **Names already taken:**
  - Functions: `doPost, isDoNotContact, logVisit, ukMobile, sendSms, out, metaDoNotContact, installLeadTriggers, pollMetaLeads, healthNotifyOnce, field, handleLead, morningSummary, metaBacklog, backlogCheck, eveningReport`.
  - Variables: `GRAPH, LEADS_TAB, SHEET_NAME, SEND_EMAIL, DO_NOT_CONTACT, NOTIFY, SMS_FROM`.
- **Functions defined twice:** `leadsSheet, niceFirstName, leadText, callWindow, inCallHours, alertTeam` are in BOTH existing files. The copy in whichever file loads last silently wins, so keep the two copies identical and never add a third.
- **New names:**
  - Prefix `trk` (leaflet chat) and `ads` (ads chat).
  - Never use `onEdit`, `onOpen`, `onChange`, `onFormSubmit` or `doGet` as handler names. An installable trigger on a function called `onEdit` runs twice per edit.
- **Installers:** each installer (`trkInstallTriggers`, `adsInstallTriggers`) deletes and recreates only its own handlers, the way `installLeadTriggers()` does. The project ends up with 13 triggers (the limit is 20).
- **Time zones:** set the project time zone to Europe/London (Project Settings). Check the ad account's `timezone_name`.
- **No formulas in Waiting list or in any script-written tab:**
  - `appendRow` writes "" into every header the script doesn't fill.
  - An ARRAYFORMULA that returns "" pushes `getLastRow()` to the bottom of the sheet.
  - Put all formulas in Lead analysis, KPIs, Weekly and Dashboard. Use `IF(x="",,…)` so blank rows stay truly empty.
- **Column positions:** new Waiting list headers go to the right of Notes (from N onwards). That keeps the documented letters J (Status), K and L where they are. Scripts match headers by exact text.
- **IDs as text:** write Lead ID, Ad ID, Form ID and SMS ID with a leading `'`. Numbers of 15+ digits lose precision in Sheets.
- **Data validation:** use "Show a warning", never "Reject the input", on any column a script writes.
- **Locks:** the edit trigger uses `LockService.getDocumentLock()`. `pollMetaLeads` and `doPost` can hold the script lock for minutes.
- **Alarms:** every new owner alarm uses the existing `healthNotifyOnce(key, subject, body)`, which sends at most one email per problem every 3h.
- **Reading formula results:** call `SpreadsheetApp.flush()` before a script reads formula results it has just fed.

### C1. Leaflet chat: sheet, website script, call tracking, ClickSend

**C1.1 Waiting list columns to add**

| Col | Header | Values | Written by |
|---|---|---|---|
| N | Lead ID | Meta: `'`+lead id. Website: `W-yyMMddHHmmss-xxx` | handleLead / doPost |
| O | Logged at | Date/time the row was written | both scripts |
| P | Ad name | `l.ad_name`, back-filled from Ads by Ad ID if blank | handleLead, adsPullInsights |
| Q | Ad ID | `'`+`l.ad_id` | handleLead |
| R | Form ID | `'`+(`l.form_id`\|\|`l._form`) | handleLead |
| S | Organic? | Yes / No (`l.is_organic`) | handleLead |
| T | Duplicate of | Lead ID of the earliest row with the same phone (last 10 digits) or email; blank if new | both scripts, via `trkFindDuplicate` |
| U | How heard | Facebook or Instagram ad / Leaflet through the door / Banner on Tolbooth Street / Friend or family / Google search / Other | doPost; caller for phone sign-ups |
| V | SMS ID | ClickSend message_id of the lead's text | both scripts |
| W | SMS status | Sent / Delivered / Failed: reason / Failed: invalid | both scripts, then trkPullSmsHistory |
| X | Email status | Sent / Failed: error / Bounced | both scripts, then trkScanBounces |
| Y | Call outcome | Dropdown (C1.2). An input cell: the trigger clears it after logging. | caller |
| Z | Call attempts | Number | trigger |
| AA | First call at | Date/time | trigger |
| AB | First reached at | Date/time | trigger |
| AC | Last attempt at | Date/time | trigger |
| AD | Next call due | Date/time | trigger (caller can overwrite) |
| AE | Status changed at | Date/time of the last Status change | trigger |
| AF | Booked at | Date/time | trigger |
| AG | Called by | `e.user` email (only filled in on the same Workspace domain), otherwise Assigned to | trigger |
| AH | Call history | `dd/MM HH:mm #n outcome (caller)` lines | trigger |
| AI | Appt date | Date (later overwritten by Dentally) | caller / Dentally match |
| AJ | People booked | Number | caller |
| AK | Not booked reason | Already found dentist / Wants later / Only wanted info / Too far / Times don't suit / Wants private only / Other | caller |
| AL | Current practice | None / Lapsed / Leven (own) / Glenrothes Dental House (own) / Other own practice / Other NHS / Private / Not sure | caller |
| AM | Private interest | None / Implants / Aligners-ortho / Whitening / Cosmetic / Other (ask neutrally; never a condition of an NHS place) | caller |
| AN–AQ | Dentally ID, Attended (Yes / DNA / Cancelled / Pending), People attended, People registered | from opening | Dentally match (C3) |
| AR | Visit ID (optional) | Random ID for each page load | doPost |

Group or hide N–X and Z–AH so callers see A–M, Y and AI–AM.

**C1.2 Dropdowns**
- **Status (J):**
  - Keep: Called, No answer, Booked, DO NOT CONTACT, Call 8am.
  - Add: Unreachable, Wrong number, Not interested, Withdrew.
  - Nothing breaks: `metaBacklog`, `morningSummary` and `eveningReport` already treat any value other than blank or "Call 8am" as handled.
- **Call outcome (Y)**, using plain hyphens: No answer | Voicemail | Busy/declined | Reached - booked | Reached - call back | Reached - on list | Reached - not interested | Already has dentist | Wrong number | Withdrew | DO NOT CONTACT.

**C1.3 Installable edit trigger: `trkOnSheetEdit(e)` in tracking.gs**
- **Install:** `ScriptApp.newTrigger('trkOnSheetEdit').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create()` inside `trkInstallTriggers()`.
- **How it runs:**
  - Run it once as info@. It then runs as info@ for everyone's edits, including from the Sheets mobile app.
  - It does not fire on script writes, so `appendRow` and its own writes can't loop.
- **Guard:** return if the sheet ≠ `LEADS_TAB`, or if the edited columns don't include Call outcome or Status. Find the columns by header name, read once per call.
- **Rows:** loop over every row ≥ 2 in `e.range`, to handle pastes and fill-downs. Write each row's changed cells in one `setValues`. Append the Call log rows in one batch.
- **A. Call outcome set to value v:**
  1. Attempt number: n = Call attempts + 1. Set Last attempt at = now, and First call at = now if it is empty.
  2. Set Status from v:
     - No answer, Voicemail, Busy/declined → "No answer".
     - Reached - booked → "Booked", and set Booked at.
     - Reached - call back, Reached - on list → "Called".
     - Reached - not interested, Already has dentist → "Not interested".
     - Wrong number, Withdrew, DO NOT CONTACT → the same text. DNC also adds "DNC dd/MM – reason?" to Notes.
  3. Any "Reached …", Already has dentist or Withdrew → set First reached at = now if it is empty.
  4. Set Next call due:
     - After no-answer n=1: now + 2h, or 10:00 the next day if that would be 21:00 or later.
     - After n=2: 17:30 the next day if both attempts were before 17:00, otherwise 10:00 the next day.
     - After n=3: Status = "Unreachable" and Next call due blank.
     - Reached - call back: 10:00 the next day (the caller can overwrite it).
     - Any other outcome: blank.
  5. Set Status changed at, Called by and the Call history line.
  6. Append to Call log: Timestamp | Lead ID | Sheet row | Attempt # | Outcome | Status set | Caller | Mins since clock start | Hour | Band (08-10, 10-12, 12-14, 14-17, 17-19, 19-21) | Weekday | Called from (blank until the 01592 number exists).
  7. Clear the Call outcome cell.
- **B. Status edited directly (the caller's old habit):**
  - Applies when the value changes, or always for a multi-cell paste (`e.oldValue` is then undefined).
  - Called, No answer, Booked, Not interested or Wrong number count as an attempt: steps 1 and 4–6, with Outcome "Status: v". Called, Booked and Not interested also set First reached at. Booked also sets Booked at.
  - DO NOT CONTACT, Withdrew, Unreachable, Call 8am or blank: set Status changed at and add a history line only, not an attempt.
- **Retry reminder:** `trkRetryCheck()`, every 15 min, calling hours only. Count Status "No answer" rows whose Next call due has passed. If there are 3 or more, call `alertTeam("N call-backs due …", false)`, at most once every 2h.
- **Daily snapshot:** `trkDailySnapshot()` at 21:10 adds one row to **Daily log**:
  - Date, Sign-ups gross, Unique, Meta unique, Organic.
  - Attempts today (from Call log), Reached today, Booked today, No answer today.
  - Waiting >1h (`metaBacklog()`), Oldest mins, Overdue retries, Rows needing update (M48).
  - SMS sent, SMS failed, Email failed/bounced, DNC today.
  - Daily budget and Spend today (latest Ad status rows).
  - Caller shift hours (copied from Daily checks).

**C1.4 Website (`doPost` and the /register/ page)**
- **Register page:** add an optional "How did you hear about us?" dropdown, sent as `heard`. Send `vid` (a random ID per page load, kept in memory with no cookie) with both the visit beacon and the sign-up. `logVisit` writes it to Visits column C, "Visit ID".
- **New values in `doPost`:** Lead ID, Logged at, How heard, Duplicate of (`trkFindDuplicate(p.phone, p.email)`), Visit ID.
- **Row number for later writes:** capture `row = sh.getLastRow()` straight after `appendRow`, while the lock is still held. After `sendSms`, write SMS ID and SMS status to that row.
- **Email:** wrap `MailApp.sendEmail` in try/catch and write Email status. Today, if the email fails after the row is saved, the person sees an error and submits again, which creates a duplicate.
- **Duplicates:**
  - If the earlier row is Booked, Called or Not interested, skip the caller alert. The row and the text are still sent.
  - Otherwise, start the alert text with "REPEAT – ".
  - Use the same rule in `handleLead`.
- **Tagged links:** ask the ads chat to set these in Meta: Page website button `?src=fb-page`; Instagram bio `?src=ig-bio`; Instant Form completion button `?src=fb-form-done`; DM instant reply `?src=fb-dm`. Add the visit beacon to `site/index.html` with source `home`.
- **Helpers in tracking.gs:**
  - `trkFindDuplicate(phone, email)` → {row, leadId, status} or null.
  - `trkNewLeadId()`.

**C1.5 ClickSend delivery reporting**
- **`sendSms` in apps-script.gs:**
  - Parse the response `data.messages[0]` and return `{id: message_id, status, price: message_price}`. Existing callers ignore the return, so nothing breaks.
  - Log every send through `trkLogSms(type, to, result)`. Work out the type from the text: "Hi " = lead text, "NEW LEAD" = caller alert, "Good morning" = morning summary, anything else = other.
  - Because the logging is inside `sendSms`, the caller alerts and OWNER_MOBILE copies sent by `alertTeam` are logged without touching `alertTeam`.
- **SMS log tab:** Sent at | Type | To (last 4 digits) | Message ID | Send status | Price | Delivery status | Delivery detail | Checked at.
- **Send failures:** when a send status is not SUCCESS, call `healthNotifyOnce` straight away. Always for INSUFFICIENT_CREDIT and for any failed caller alert.
- **`trkPullSmsHistory()` daily at 06:15:**
  - Call `GET https://rest.clicksend.com/v3/sms/history?date_from={unix now-3d}&date_to={unix now}&page={p}&limit=100` with Basic auth `CLICKSEND_USER:CLICKSEND_KEY`, paging to `last_page`.
  - Match on message_id and write status, status_code, status_text and message_price to the SMS log.
  - For lead texts, also set Waiting list SMS status (match on V). An invalid-number failure becomes "Failed: invalid", which counts towards M54.
- **Balance:** call `GET https://rest.clicksend.com/v3/account`. If `data.balance` is below 10, call `healthNotifyOnce('SMS_BALANCE', …)`.
- No webhook is needed.

**C1.6 Email bounces:** `trkScanBounces()` daily at 06:45.
- Run `GmailApp.search('from:(mailer-daemon OR postmaster) newer_than:2d')`.
- Read the address from `getHeader('X-Failed-Recipients')`, or with a regex on the body, and set Email status to "Bounced".
- This needs one extra Gmail permission prompt for info@.

**C1.7 Formula tabs (leaflet chat builds them; they are not script-written)**

- **Lead analysis:** row 2 holds ARRAYFORMULAs, so each row lines up with the same Waiting list row. Never sort this tab.

  | Col | Header | Formula |
  |---|---|---|
  | A | Sign-up date | `=ARRAYFORMULA(IF('Waiting list'!A2:A="",,INT('Waiting list'!A2:A)))` |
  | B | Week (Mon) | `=ARRAYFORMULA(IF(A2:A="",,A2:A-WEEKDAY(A2:A,3)))` |
  | C | Hour | `HOUR('Waiting list'!A2:A)` |
  | D | Weekday | `TEXT(A2:A,"ddd")` |
  | E | Overnight | `=ARRAYFORMULA(IF(A2:A="",,IF((C2:C>=21)+(C2:C<8),"Yes","No")))` |
  | F | Clock start | `=ARRAYFORMULA(IF(A2:A="",,IF(C2:C>=21,A2:A+1+8/24,IF(C2:C<8,A2:A+8/24,'Waiting list'!A2:A))))` (hard-codes 8–21, the same as `CALL_HOURS`) |
  | G | Mins to first call | `=ARRAYFORMULA(IF((A2:A="")+('Waiting list'!AA2:AA=""),,ROUND(IF('Waiting list'!AA2:AA<F2:F,0,('Waiting list'!AA2:AA-F2:F)*1440))))` |
  | H | Hours to reach | the same pattern on AB, x24 |
  | I | Phone key | `=ARRAYFORMULA(IF('Waiting list'!C2:C="",,RIGHT(REGEXREPLACE(TO_TEXT('Waiting list'!C2:C),"\D",""),10)))` |
  | J | People (n) | `=ARRAYFORMULA(IF(A2:A="",,IFERROR(VALUE(REGEXEXTRACT(TO_TEXT('Waiting list'!F2:F),"\d+")),1)))` (handles "4+" and "4_plus") |
  | K | Outward code | `=ARRAYFORMULA(LET(s,UPPER(REGEXREPLACE(TO_TEXT('Waiting list'!E2:E),"\s","")),IF(A2:A="",,IF(REGEXMATCH(s,"^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$"),REGEXEXTRACT(s,"^([A-Z]{1,2}\d[A-Z\d]?)\d[A-Z]{2}$"),IF(REGEXMATCH(s,"^[A-Z]{1,2}\d[A-Z\d]?$"),s,"Invalid")))))` (reads KY11/KY12 correctly) |
  | L | Tier | `=ARRAYFORMULA(IF(A2:A="",,IF(REGEXMATCH(K2:K,"^KY[12]$"),"Core",IF(REGEXMATCH(K2:K,"^KY[345]$"),"Near",IF(REGEXMATCH(K2:K,"^KY[678]$"),"Own-practice area",IF(K2:K="Invalid","Invalid","Outside"))))))` |
  | M | Meta lead? | `=ARRAYFORMULA(IF(A2:A="",,IF(REGEXMATCH(LOWER('Waiting list'!I2:I),"^(facebook\|instagram)$")*('Waiting list'!S2:S<>"Yes"),"Yes","No")))` |
  | N | Unique? | `=ARRAYFORMULA(IF(A2:A="",,IF((I2:I<>"")*(COUNTIFS(I2:I,I2:I,ROW(I2:I),"<"&ROW(I2:I))>0)+(R2:R<>"")*(COUNTIFS(R2:R,R2:R,ROW(R2:R),"<"&ROW(R2:R))>0),"No","Yes")))` (the official duplicate rule; works back to the first row) |
  | O | Active? | `IF(REGEXMATCH('Waiting list'!J2:J,"^(DO NOT CONTACT\|Not interested\|Wrong number\|Withdrew)$"),"No","Yes")` |
  | P | Attempted? | `IF('Waiting list'!Z2:Z>0,"Yes","No")` |
  | Q | Reached? | `IF('Waiting list'!AB2:AB<>"","Yes","No")` |
  | R | Email key | `LOWER(TRIM('Waiting list'!D2:D))` |

  Wrap C, D, H and O–R in `ARRAYFORMULA(IF(A2:A="",,…))` like the others.

- **KPIs:** every scorecard figure, each with a named range so the scripts can read it.
  - Named ranges: `KPI_SPEND_YDAY, KPI_PACING_YDAY, KPI_SPEND_CUM, KPI_PLAN_CUM, KPI_LEADS_META_YDAY, KPI_LEADS_ALL_YDAY, KPI_CPL_3D, KPI_CPL_3D_META, KPI_SYNC_GAP_YDAY, KPI_FREQ_7D, KPI_LINKCTR_3D, KPI_FATIGUE_FLAGS, KPI_SPEED_MEDIAN, KPI_PCT_60, KPI_OVERNIGHT_10AM, KPI_OVERDUE_RETRIES, KPI_CALLER_LOAD, KPI_CALLER_LOAD_PREV, KPI_PEOPLE_ON_LIST, KPI_DAYS_LIVE`.
  - Example formulas:
    - `KPI_CPL_3D =IFERROR(SUMIFS(Ads!H:H,Ads!A:A,">="&TODAY()-3,Ads!A:A,"<"&TODAY())/COUNTIFS('Lead analysis'!A:A,">="&TODAY()-3,'Lead analysis'!A:A,"<"&TODAY(),'Lead analysis'!M:M,"Yes",'Lead analysis'!N:N,"Yes"),"")`
    - `KPI_SYNC_GAP_YDAY =SUMIFS(Ads!S:S,Ads!A:A,TODAY()-1)-COUNTIFS('Lead analysis'!A:A,TODAY()-1,'Lead analysis'!M:M,"Yes")`
    - `KPI_CALLER_LOAD =COUNTIFS('Lead analysis'!F:F,">="&TODAY()-1,'Lead analysis'!F:F,"<"&TODAY(),'Lead analysis'!N:N,"Yes")/35/MAX(1,callers)`
  - Also on this tab: a **Plan** table (Date → planned daily budget: £20 / £25 / £35 / £50 by week), plus input cells for weekly Hostinger page views (/, /register/, /l, /b), the caller's hourly cost and the number of callers.
- **Dashboard (first tab, never written by scripts):**
  - S1–S15 at the top, with green/amber/red conditional formatting.
  - Then the existing counts, plus:
    - Gross vs unique sign-ups, and people on the list.
    - Sign-ups by Ad name.
    - Consent and DNC rates by source.
    - Tier shares.
    - A 24 x 7 heat map.
    - A funnel pivot by Ad name x Source: leads → attempted → reached → booked, people per lead, cost per reached lead.
- **Weekly:** B1 holds `=TODAY()-WEEKDAY(TODAY(),3)-1` (last Sunday). Every number in Section D is calculated for B1−6 to B1 and for the week before.
- **Manual tabs** (with dropdowns): Change log, Daily checks, Complaints (columns in C4).
- **Costs are not in this sheet** (owner, 9 Nov). They live in the separate sheet "Kirkcaldy Dental – Costs & Expenses" (id `11MG9ErGdpZcGczFl1TARUt9MiUGtY7B_tNPNAT__mSg`), tab "All costs": Date / Channel / Item / Qty printed / Qty delivered / Route / Cost ex VAT / VAT / Total (col I) / Invoice ref / Paid by / Monthly? / Notes. The KPIs tab pulls it with `IMPORTRANGE("11MG9ErGdpZcGczFl1TARUt9MiUGtY7B_tNPNAT__mSg","All costs!A4:M")` for M61, M62, M68, M71 and the blended CPL (S13). The owner clicks "Allow access" once.
- **Later tabs:** Capacity, Dentally.
- **`trkWeeklyEmail()`, Monday 07:30:** emails the Weekly tab to OWNER_EMAIL as an HTML table with the sheet link.

**C1.8 `trkInstallTriggers()`** installs: `trkOnSheetEdit` (onEdit); `trkRetryCheck` (every 15 min); `trkPullSmsHistory` (06:15); `trkScanBounces` (06:45); `trkDailySnapshot` (21:10); `trkWeeklyEmail` (Mon 07:30). All in Europe/London.

### C2. Ads chat: Meta Insights sync and meta-leads.gs

**C2.1 Access**
- **System user:** Business settings → System users → "Lead script" → Assign assets → Ad accounts → the clinic ad account → *View performance*.
- **Token permissions:** `ads_read, leads_retrieval, pages_show_list, pages_read_engagement, pages_manage_ads, business_management`, plus `instagram_basic` for Instagram followers. Check it in the Access Token Debugger.
- **Script Properties:** `META_ADS_TOKEN`, `META_AD_ACCOUNT_ID` (act_…), `META_ADSET_IDS` (comma-separated), `META_PAGE_ID`, `META_IG_USER_ID` (optional), `LAUNCH_DATE` (yyyy-mm-dd), `VAT_ON_SPEND` (1.2).
- **Account check:** `GET act_{id}?fields=timezone_name,currency` should return Europe/London and GBP. If not, the Ads tab's days are the account's days.

**C2.2 Daily sync into the "Ads" tab: `adsPullInsights()`, daily 06:00**

```
GET https://graph.facebook.com/v21.0/act_{META_AD_ACCOUNT_ID}/insights
  ?level=ad
  &time_increment=1
  &date_preset=last_7d              (yesterday + 6 days; all 7 re-written every run because Meta revises recent days)
  &action_report_time=conversion    (leads dated by submission, to match Signup Time; Ads Manager defaults to impression time)
  &limit=500                        (follow paging.next)
  &fields=date_start,campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,spend,impressions,reach,frequency,cpm,
          clicks,ctr,inline_link_clicks,inline_link_click_ctr,cost_per_inline_link_click,actions,cost_per_action_type,
          video_play_actions,video_continuous_2_sec_watched_actions,video_thruplay_watched_actions,
          video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions,video_p100_watched_actions,
          video_avg_time_watched_actions
  &access_token={META_ADS_TOKEN}     (permission: ads_read)
breakdowns: none on the daily table (breakdowns go in the weekly pull)
```
- **Upsert:** the key is Date + Ad ID. Delete the 7 dates the response covers and re-write them.
- **Ads tab columns:**
  - A Date | B Campaign ID | C Campaign | D Ad set ID | E Ad set | F Ad ID | G Ad name
  - H Spend | I Spend inc VAT | J Impressions | K Reach | L Frequency | M CPM | N Clicks (all) | O CTR (all) % | P Link clicks | Q Link CTR % | R Cost per link click | S Leads (Meta) | T CPL (Meta)
  - U 2s plays | V 3s plays | W ThruPlays | X p25 | Y p50 | Z p75 | AA p100 | AB Avg watch (s)
  - AC Post engagement | AD Reactions | AE Comments | AF Shares | AG Saves | AH Page likes | AI Call clicks | AJ Pulled at
  - Dates are real dates, IDs are text, and every other field is a number (missing = 0).
- **Parsing with `adsAction(arr, type)`:**
  - Leads = `onsite_conversion.lead_grouped`, falling back to `lead`.
  - 3-second plays = `video_view`.
  - `post_reaction`, `comment`, `post` (shares), `onsite_conversion.post_save`, `like`, `post_engagement`, `click_to_call_call_confirm`.
  - For each `video_*_actions` field, take `[0].value`.
- **Extra calls in the same run**, written to **Ads weekly**. Each replaces the previous "rolling 7d" or "to date" rows.
  - (b) `level=ad&date_preset=last_7d&fields=ad_id,ad_name,spend,impressions,reach,frequency,inline_link_clicks,actions`
  - (c) the same at `level=adset`. This is the 7-day frequency for S10.
  - (d) `level=adset&time_range={"since":"<LAUNCH_DATE>","until":"<yesterday>"}&fields=reach,frequency,impressions,spend,actions`. This is reach to date.
- **Then:**
  - Back-fill any blank Waiting list "Ad name" from Ads by Ad ID.
  - `SpreadsheetApp.flush()`.
  - Call `adsKpiAlarms()`. It runs at the end of this function, not on its own trigger, because time triggers drift by ±15 min.

**C2.3 `adsWeeklyPull()`, Monday 06:30 → Ads weekly and Change log**
- **Breakdown calls** (all `level=ad&date_preset=last_7d`):
  - `breakdowns=publisher_platform,platform_position` with `fields=ad_id,ad_name,spend,impressions,reach,inline_link_clicks,actions,video_play_actions,video_thruplay_watched_actions`
  - `breakdowns=age,gender` with the same fields minus the video fields.
  - `breakdowns=region` with `fields=spend,impressions,actions`
- **Rankings:** `level=ad&date_preset=last_7d&fields=ad_id,ad_name,impressions,quality_ranking,engagement_rate_ranking,conversion_rate_ranking`, with no breakdowns.
- **Audience size:** `GET {adset_id}/delivery_estimate?optimization_goal=LEAD_GENERATION` → `estimate_mau_lower_bound`, `estimate_mau_upper_bound`.
- **Change log:** `GET act_{id}/activities?since={unix 8 days ago}&fields=event_time,event_type,translated_event_type,actor_name,object_id,object_name,object_type,extra_data`. Write rows with Source = Meta, de-duplicated on event_time + object_id.
- **Ads weekly columns:** Week ending (or as-of date) | Period (rolling 7d / to date / last full week) | Level | Breakdown (none, placement, age-gender, region, rankings, audience) | Key 1 | Key 2 | Ad set/Ad ID | Ad name | Spend | Impressions | Reach | Frequency | Link clicks | Leads | CPL | 3s plays | ThruPlays | Quality | Engagement | Conversion | Audience low | Audience high | Pulled at.

**C2.4 `adsStatusCheck()`, every 2h (returns at once outside 08–21)**
- **Output:** the Ad status tab (Checked at | Check | Object ID | Object name | Value | Detail). Only changes are logged, plus one row a day for each check.
- **Ads:** `GET act_{id}/ads?fields=id,name,effective_status,configured_status,ad_review_feedback,issues_info,updated_time&limit=100`. Alarm on DISAPPROVED, WITH_ISSUES, or PENDING_REVIEW for more than 24h.
- **Account:** `GET act_{id}?fields=account_status,disable_reason,amount_spent,spend_cap,balance,currency`. Alarm if account_status ≠ 1, or if (spend_cap − amount_spent) is less than 7 x the daily budget. All amounts are in pence.
- **Ad set:** `GET {adset_id}?fields=name,daily_budget,effective_status,learning_stage_info`. daily_budget ÷ 100 = £. Log the learning status.
- **Today's delivery:** `GET act_{id}/insights?level=account&date_preset=today&fields=spend,impressions,actions`.
  - First run after 12:00: alarm if impressions are 0, or spend is below 0.4 x the daily budget.
  - Any run: alarm if today's spend is £5 or more and no facebook/instagram row has reached the Waiting list for 4h in calling hours.
- **Followers:** on the first run after 08:00, `GET {META_PAGE_ID}?fields=followers_count,fan_count` and `GET {META_IG_USER_ID}?fields=followers_count,media_count`.
- **`adsInstallTriggers()`** installs `adsPullInsights` (06:00), `adsWeeklyPull` (Mon 06:30) and `adsStatusCheck` (every 2h). Helpers: `adsGraphGet` (paging, plus `healthNotifyOnce` on errors, 190 included), `adsUpsert`, `adsAction`.

**C2.5 `adsKpiAlarms()`** reads the KPIs named ranges and calls `healthNotifyOnce` when any of these is true:
- KPI_CPL_3D is above £6 (for 3 days).
- KPI_FREQ_7D is above 3.
- KPI_SYNC_GAP_YDAY is 2 or more, or above 10%.
- Caller load is above 100% on both KPI_CALLER_LOAD and KPI_CALLER_LOAD_PREV.
- Pacing is below 50% for 2 days.
- KPI_FATIGUE_FLAGS is above 0.
- Fewer than 3 Meta leads a day for 3 days after day 4.
- KPI_SPEND_CUM is more than 10% above KPI_PLAN_CUM.

**C2.6 Changes to meta-leads.gs**
- **`pollMetaLeads`:** add `ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,is_organic` to `fields=`.
- **`handleLead` values:**
  - "Lead ID", "Logged at", "Ad name", "Ad ID", "Form ID", "Organic?", "Duplicate of" (via `trkFindDuplicate`), with the REPEAT alert rule from C1.4.
  - Map Graph option keys such as `4_plus` to "4+".
  - After `appendRow`, `row = sh.getLastRow()`. This is safe because `pollMetaLeads` holds the script lock, which `doPost` also uses. Then `r = sendSms(...)` and write SMS ID and SMS status.
  - Put the email in try/catch and write Email status.
- **`eveningReport`, add:**
  - Yesterday: spend, Meta and sheet leads, CPL 3-day (sheet and Meta) and 7-day frequency.
  - Today: spend so far, attempts and leads reached (from Call log), overdue retries, rows needing update, caller load %, texts failed.
  - People on the list, and any open alarms.
- **Optional:** have `morningSummary` write Assigned to for "Call 8am" rows in rotate mode, so per-caller metrics include overnight leads.
- **Failure notifications:** Apps Script → Triggers → set failure notifications to "Notify me immediately" on every trigger, `pollMetaLeads` first.

### C3. Dentally (owner's weekly tracker, `tracker/weekly_counts.py`)
- **Now, before opening:**
  - Keep the weekly new patients per practice and the KY1/KY2 count per practice. Add a KY1 vs KY2 split, and plot the weekly waiting-list sign-ups (from the Weekly tab) on the same chart.
  - One-off Glenrothes baselines for Feb–May 2026:
    - New NHS registrations **per week since opening**. The monthly figures aren't enough for the comparison curve.
    - New-patient exam DNA %, cancellation % and late-cancellation %.
    - Median booking lead time.
    - 60-day first-visit value (NHS and private) per new patient.
- **Once Kirkcaldy is open: every Monday, for the previous Monday–Sunday, Kirkcaldy site**
  - a) **Registrations:** patient ID; NHS registration date and type/status; age band from date of birth (0–17, 18–64, 65+); postcode outward code; mobile and email, used only to build the match key; referral source field or an "SRC:" note.
  - b) **Appointments** created or due in the last 7 days and the next 8 weeks: appointment ID, patient ID, start time, type/reason (new-patient exam), state (booked / arrived / completed / did not attend / cancelled), created at, cancelled at, cancellation reason, practitioner.
  - c) **Diary:** new-patient exam slots available vs booked, per week, for the next 8 weeks. Goes to the Capacity tab.
  - d) **Monthly value:** NHS claim value and private invoiced £ per patient first seen in the month (60-day window); implant and cosmetic consultations; accepted private plan £.
- **Outputs:**
  - **Kirkcaldy row in the weekly tracker:** week since opening; new NHS registrations (people); Glenrothes in the same week, and the ratio; new-patient exams booked / attended / DNA / cancelled / late-cancelled; next-4-weeks fill %; median booking lead time.
  - **Waiting list match:** the same practice, so row level is fine.
    - Key = last 10 digits of the mobile, falling back to the lower-case email.
    - Write Dentally ID, Attended, People attended and People registered (household members who share the key) into AN–AQ, and replace Appt date with Dentally's date.
    - Totals by Source, Ad name and sign-up week go to the Weekly tab.
  - **Overlap with the 4 other practices (22,701 active patients):** matched counts only, using hashed keys and no names, and only after the data-protection lead confirms a lawful basis between the practices' legal entities. Until then, use the caller's "Current practice" answer.
  - **New-patient form:** add "How did you hear about us?" (Facebook/Instagram ad, leaflet, banner, website, friend/family, walked past, NHS Fife list, other). Reception enters it in Dentally's referral source field, or as an "SRC:" note.

### C4. Manual tasks (people, not code)
| What | Tab / columns | Who | When |
|---|---|---|---|
| Comments (FB/IG): new, replied, unanswered at 21:00, risky (count + an example), hidden | Daily checks | staff member | 21:00 daily |
| DMs: new, replied, unanswered at 21:00, median first reply (Business Suite), common question | Daily checks | staff member | 21:00 daily |
| Caller shift hours and who worked | Daily checks (copied into Daily log) | caller | end of shift |
| Complaints from any channel | Complaints: Date / Channel (phone, email, FB comment, DM, in person, NHS Fife) / Lead ID / Type / Formal? / Summary / Action / Owner / Closed date | owner | same day; any opt-out → DO NOT CONTACT the same day |
| Opt-outs by email or phone | WL Status DO NOT CONTACT, reason in Notes | whoever receives it | same day |
| Print and distribution invoices, quantities printed and delivered, route or sectors, banner print and fitting, ClickSend top-ups, caller hourly cost | "Kirkcaldy Dental – Costs & Expenses" sheet, tab "All costs": Date / Channel / Item / Qty printed / Qty delivered / Route / Cost ex VAT / VAT / Total / Invoice ref / Paid by / Monthly? / Notes | owner (browser Claude logs receipts) | on each invoice |
| Leaflet drops, banner going up, phone number live, wording changes, opening date announced | Change log (Source = manual) | owner / ads chat | on the day |
| Ad Library check of Fife dental advertisers (weekly); count of NHS Fife practices accepting (monthly) | Change log (Source = market) | ads chat / owner | weekly / monthly |
| Hostinger page views for /, /register/, /l and /b | KPIs input cells | owner | Monday |
| Phone, once the 01592 number is live: weekly export from the provider (received, answered, missed, callbacks); every new caller added as a WL row with Source = phone | Daily checks / Phone log | owner / caller | weekly / each call |
| Caller questions: How heard (phone sign-ups), Current practice, Private interest, Not booked reason | WL dropdowns | caller | every call |

### C5. Build order
- **P0, before the ads go live.** These can't be back-filled later.
  1. Leaflet chat: columns N–AR and dropdowns; tracking.gs (`trkFindDuplicate`, `trkNewLeadId`, `trkLogSms`, `trkOnSheetEdit`, Call log); `sendSms` returns and logs; new `doPost` values.
  2. Ads chat: `pollMetaLeads` fields and the new `handleLead` values.
  3. Owner: Change log, Daily checks and Complaints tabs; print run and banner entered in the separate Costs & Expenses sheet.
  4. Test:
     - Create a lead with the Lead Ads Testing Tool and do a website sign-up. All new columns should fill.
     - Set Call outcome to "No answer". Expect: attempts 1, the timestamps, Next call due set, a Call log row, Status "No answer", and the outcome cell cleared.
     - Delete the test rows before 08:00.
- **P1, week 1:** the Ads token and `adsPullInsights`; `adsStatusCheck`; Lead analysis, KPIs and the Dashboard scorecard; `adsKpiAlarms`; the `eveningReport` lines; `trkDailySnapshot`; trigger failure notifications.
- **P2, by week 2:** `adsWeeklyPull`; `trkPullSmsHistory` and the balance alarm; `trkScanBounces`; `trkRetryCheck`; the Weekly tab and `trkWeeklyEmail`; tagged links, the home-page beacon, How heard and Visit ID.
- **P3:** the Dentally baselines now; Capacity tab; the Kirkcaldy weekly pull and match from opening week.

**New function registry**
| Function | File | Chat | Trigger |
|---|---|---|---|
| trkInstallTriggers | tracking.gs | leaflet | run once |
| trkOnSheetEdit | tracking.gs | leaflet | installable onEdit |
| trkRetryCheck | tracking.gs | leaflet | every 15 min |
| trkPullSmsHistory | tracking.gs | leaflet | daily 06:15 |
| trkScanBounces | tracking.gs | leaflet | daily 06:45 |
| trkDailySnapshot | tracking.gs | leaflet | daily 21:10 |
| trkWeeklyEmail | tracking.gs | leaflet | Mon 07:30 |
| trkFindDuplicate, trkNewLeadId, trkLogSms | tracking.gs | leaflet | helpers |
| adsInstallTriggers | meta-ads.gs | ads | run once |
| adsPullInsights | meta-ads.gs | ads | daily 06:00 |
| adsWeeklyPull | meta-ads.gs | ads | Mon 06:30 |
| adsStatusCheck | meta-ads.gs | ads | every 2h |
| adsKpiAlarms, adsGraphGet, adsUpsert, adsAction | meta-ads.gs | ads | helpers / called |

---

## D. Monday report template

Sent at 07:30 by `trkWeeklyEmail` from the Weekly tab. The ads chat adds the commentary and decisions when the owner asks "how are the ads doing?".

**Subject:** `Week {n} ({Mon dd}–{Sun dd Mmm}): {unique sign-ups} sign-ups, {people} people, CPL £{x} – {GREEN/AMBER/RED}`

1. **Headline (3 lines)**
   - Sign-ups this week (unique, and change vs last week); people on the list in total.
   - CPL ex VAT, and cost per reached lead; spend ex and inc VAT vs plan.
   - The one decision for this week (budget hold / +20% / −20%, the ad to pause, a new creative, the radius).
2. **Scorecard:** S1–S14 (S15 from opening), with columns this week | last week | target | status.
3. **Meta spend and delivery**
   - Spend ex and inc VAT, this week and cumulative vs plan; pacing; daily budget(s) used.
   - Impressions, reach this week and to date, penetration of the audience estimate; 7-day frequency.
   - CPM, CTR (all), link CTR, cost per form open, form completion %.
   - Leads as Meta reports them vs sheet-unique; CPL (Meta and sheet); sync gap; learning status.
4. **Creative: Ad A vs Ad B**
   - Table of spend share, leads, CPL, reach rate, cost per reached lead, people per lead, Family %, Core %, DNC %.
   - Video hook and hold rates, ThruPlays, average watch time; the three rankings; fatigue flags.
   - Verdict, using the S9 rules.
5. **Placements and audience:** the best and worst 3 placements by CPL; the age x gender table; the region check (100% Scotland?); Facebook vs Instagram.
6. **Calling funnel**
   - Leads → attempted (24h) → reached (within 3 attempts) → booked / on list, for the matured cohort and the provisional cohort.
   - Speed to lead (median, % within 60 min); overnight leads cleared by 10:00; times the backlog email fired; overdue retries.
   - Answer rate by time band and by attempt number; average attempts to reach.
   - Caller load % and dials per shift hour; logging compliance (rows needing an update).
7. **Lead quality**
   - Tier shares (Core, Near, own-practice area KY6–8, Outside, Invalid).
   - Duplicates (with the cross-source matrix); wrong numbers and unreachable.
   - Currently-registered split; consent rate; DNC rate and reasons.
   - Out-of-hours share and the peak sign-up hours.
   - How heard (website and phone).
8. **Offline and other channels**
   - Leaflets: per drop, delivered, scans, sign-ups, response %, CPL, days since the drop.
   - Banner: scans and sign-ups to date; cost per sign-up.
   - Website and tagged links: visits, sign-ups, conversion.
   - Phone: once the number is live.
9. **Costs**
   - Totals to date by channel (Meta inc VAT, print, distribution, banner, texts, caller hours).
   - Blended CPL, cost per reached lead, cost per booked lead / person.
   - Text cost per lead, delivery rate, ClickSend balance; email bounce rate.
10. **Social and trust:** comments (new, unanswered at 21:00, risky themes); DMs; complaints (count, type, open items); follower change.
11. **Context**
    - Kirkcaldy-postcode new patients at Leven and Glenrothes vs baseline.
    - Competitor ads and NHS Fife openings.
    - Glenrothes week-n comparison (once open).
12. **After opening:**
    - Diary fill for the next 4 weeks; booking lead time.
    - Booked, attended, DNA and cancelled; registrations vs the Glenrothes curve.
    - Waiting list → registered % by source and ad; attribution coverage.
    - Cost per attended and per registered person; first-visit value.
13. **Changes and decisions**
    - Last week's Change log entries.
    - Alarms raised and how each was resolved.
    - Decisions for this week, against the rules:
      - CPL above £6 for 3 days → ads chat.
      - Caller load above 100% → −20% budget.
      - CPL £3 or less with caller load below 40% → +20% budget.
      - An ad 30% or more worse → pause it.
      - Frequency above 3 → fresh creative or a 15-mile radius.
    - Owner actions due.