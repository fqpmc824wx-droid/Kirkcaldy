[
 {
  "key": "analog",
  "method": "I used the owner's own practices as the analog, but kept two questions apart. (1) Total demand: Glenrothes shows how many people register once a new NHS practice opens nearby. (2) Paid-ad output: what \u00a320 to \u00a350 a day of Meta buys. Glenrothes cannot answer (2), because Dentally does not record channel and its ad spend is unknown. Its Nov\u2013Jan pre-launch figure (~15/month) also shows it never ran a real waiting list, so its Feb\u2013Mar wave was word of mouth plus opening news.\n\nDEMAND: I scaled the Glenrothes first-3-month registrations (1,187 + 2,598 + 1,200 = 4,985 people) to Kirkcaldy. Population is 1.28x (50k vs ~39k). I applied an uplift of about 1.1 for worse local access (1 of 57 practices accepting) and a depletion factor of about 0.8. The depletion is because Glenrothes has already taken ~1,200 Kirkcaldy-postcode patients (84 + 235 + 176 + ~6x118), and 2,445 Kirkcaldy residents are already active at the owner's practices. The net factor is ~1.13, giving an opening wave of ~5,600 people in the first 3 months (range 3,500\u20137,500), or ~2,950 households at 1.9 people per sign-up. A cross-check backs up the latent demand. Even after Glenrothes opened, Kirkcaldy postcodes still register at Leven plus Glenrothes at ~130\u2013200 a month while travelling 6\u201310 miles; it was 200\u2013235 a month at Leven alone before.\n\nPAID ADS: I estimated cost per lead bottom-up as CPM / (1000 x click-to-form rate x form completion). That uses CPM \u00a36.50\u2013\u00a39, click-to-form 1.0\u20133.0% (likely ~1.6%) and Higher-intent form completion 35\u201355% (likely ~40%). Steady-state cost per lead comes out at \u00a30.62 best, \u00a31.22 likely and \u00a32.85 worst. I then applied weekly multipliers:\n- Week 1: +10\u201335% for Meta's learning phase.\n- Week 3: +10\u201325% for scaling and Black Friday ad competition (27 Nov 2026).\n- Week 4: +20\u201345% for frequency in a small area and Cyber Monday/Christmas ad costs.\n\nI ran this through the runbook budget (wk1 \u00a320; wk2 \u00a320 to \u00a325; wk3 \u00a330 to \u00a335; wk4 \u00a342 to \u00a350; total ~\u00a3856). Weekly sign-ups in the likely case: wk1 ~94, wk2 ~131, wk3 ~160, wk4 ~202. That is ~13\u201316 a day at \u00a320 and ~31 a day at \u00a350. Organic sources go on top (ad shares, local Facebook groups, press, banner QR, leaflets and later the phone), at 25\u201360% of the Meta volume.\n\nI checked the clinic's Meta ad account today: no campaigns yet and no payment method on file, so there is no real cost-per-lead data yet. After 3\u20135 days of spend, replace these assumptions with the real CPM, click-to-form rate and form completion; those three numbers decide everything.\n\nMain takeaway: the handoff's '85\u2013100 a day / 1,200\u20132,600 a month' planning figure is a POST-opening registration rate (Glenrothes March). It is not what pre-opening Meta ads will bring. Expect a steady stream of about 15 a day at \u00a320, not a flood, until the practice actually opens.",
  "assumptions": [
   {
    "item": "Campaign timing",
    "value": "Ads start ~9\u201310 Nov 2026; 4-week ramp per runbook; opening assumed ~6 weeks after ads start (late Dec 2026 / early Jan 2027)",
    "basis": "BROWSER-CLAUDE-LAUNCH.md section 8; opening date is not stated anywhere, so totals are given for ~6 weeks. Each extra week of list-building adds roughly 210 sign-ups in the likely case."
   },
   {
    "item": "What the Glenrothes data measures",
    "value": "Registrations (people) after opening, all channels mixed; ad spend unknown",
    "basis": "Owner data: Dentally has no channel field. It is used only as a demand ceiling and timing shape, never to infer cost per lead."
   },
   {
    "item": "Population scale Kirkcaldy vs Glenrothes",
    "value": "1.28x (50,000 vs ~39,000 town population)",
    "basis": "Town populations; the 10-mile catchments overlap heavily, so I scaled the town, not the radius."
   },
   {
    "item": "Depletion of the shared demand pool",
    "value": "x0.8",
    "basis": "Glenrothes has already registered ~1,200 Kirkcaldy-postcode patients in 9 months, and 2,445 Kirkcaldy residents are already active at the owner's 4 practices."
   },
   {
    "item": "Scarcity uplift",
    "value": "x1.1",
    "basis": "2026 aggregator: 1 of 57 Kirkcaldy NHS dentists accepting; NHS Fife says very few practices can register; ~41,000 Fifers without an NHS dentist (older Courier figure)."
   },
   {
    "item": "Opening-wave demand (first 3 months open)",
    "value": "~5,600 people likely (3,500\u20137,500), about 2,950 households",
    "basis": "4,985 Glenrothes Feb\u2013Apr x 1.28 x 0.8 x 1.1"
   },
   {
    "item": "Residual Kirkcaldy demand even with travel",
    "value": "~130\u2013200 registrations/month still going to Leven plus Glenrothes",
    "basis": "Leven 30\u201365/month plus Glenrothes 100\u2013135/month after the wave (200\u2013235/month at Leven alone before). People who will travel 6\u201310 miles are a minority of those who would register locally."
   },
   {
    "item": "Meta CPM in the 10-mile radius",
    "value": "\u00a36.50\u2013\u00a39 in early Nov, then +15\u201330% from late Nov to Christmas",
    "basis": "Typical UK local CPMs; Q4 retail competition (Black Friday 27 Nov 2026, Cyber Monday 30 Nov)"
   },
   {
    "item": "Click to open the form",
    "value": "1.0\u20133.0%, likely ~1.6%",
    "basis": "Free, scarce NHS service with a local address is a highly relevant offer. 'Opening soon / waiting list' wording (allowed copy) is weaker than 'registering now', so I stayed below the top end."
   },
   {
    "item": "Form completion",
    "value": "35\u201355%, likely ~40%",
    "basis": "Higher-intent form adds a review screen, plus postcode and 3 multiple-choice questions; name, phone and email are prefilled."
   },
   {
    "item": "Steady-state cost per lead",
    "value": "\u00a30.62 best / \u00a31.22 likely / \u00a32.85 worst",
    "basis": "CPM / (1000 x CTR x completion) with the values above"
   },
   {
    "item": "Weekly cost-per-lead multipliers",
    "value": "Wk1 x1.10\u20131.35 (learning); wk2 x1.0; wk3 x1.10\u20131.25; wk4 x1.20\u20131.45",
    "basis": "Learning phase, rising frequency in a ~100\u2013115k-account audience as budget grows 2.5x, Q4 ad costs"
   },
   {
    "item": "Private-dental cost-per-lead benchmarks",
    "value": "Not applicable (\u00a320\u2013\u00a3150 per lead)",
    "basis": "Agency figures cover implants, cosmetic and Invisalign enquiries, where people pay. An NHS waiting-list sign-up is a free, scarce service, so it is a far easier yes."
   },
   {
    "item": "People per sign-up",
    "value": "1.9 (1.6\u20132.3)",
    "basis": "Fife household ~2.2; form options 1/2/3/4+ (4+ undercounts); the family ad (Ad B) pulls multi-person sign-ups"
   },
   {
    "item": "Organic and word of mouth on top of Meta",
    "value": "+25% low / +40% likely / +60% high",
    "basis": "Fife local Facebook groups and press share NHS dentist news fast. Glenrothes grew from 1,187 in Feb to 2,598 in Mar with no pre-list, which can only be word of mouth and news."
   },
   {
    "item": "Leaflets and banner",
    "value": "Leaflets 10\u201330 per 1,000 dropped (5,000 assumed dropped); banner 2\u20136 QR sign-ups/day",
    "basis": "HANDOFF.md leaflet estimate; Tolbooth Street town-centre footfall. Watch the Visits tab to correct this."
   },
   {
    "item": "Lead to booking",
    "value": "Junk 5\u201312%; reached within 3 attempts 58\u201382%; books when reached 60\u201382%",
    "basis": "Instant Form leads called within minutes; NHS scarcity gives a high booking rate once someone is reached. Assumes the appointment diary is open to book."
   },
   {
    "item": "Caller capacity",
    "value": "30\u201340 calls/day for one person",
    "basis": "Owner plan; this applies to ALL sources (Meta plus web, QR and phone), not just ads"
   }
  ],
  "cpl_gbp": {
   "low": 0.69,
   "likely": 1.46,
   "high": 3.63
  },
  "ad_leads_per_day_at_20": {
   "low": 6,
   "likely": 15,
   "high": 31
  },
  "four_week_ad_leads_on_plan": {
   "low": 236,
   "likely": 587,
   "high": 1239
  },
  "total_waitlist_by_opening": "Likely ~1,420 sign-ups, about 2,700 people, assuming opening ~6 weeks after ads start (range ~510 sign-ups / ~850 people to ~2,590 sign-ups / ~5,400 people).\n\nLikely build-up:\n- Meta 4-week ramp: ~587.\n- Weeks 5\u20136 held at ~\u00a335\u201340/day (the caller limit) at ~\u00a31.70 per lead (December ad costs): ~310. Meta total ~895.\n- Organic (ad shares, local Facebook groups, press, website, phone once live), at ~40% of Meta: ~360.\n- Leaflets: ~90.\n- Banner QR: ~80.\n\nLow case: worst cost per lead (~\u00a33.60), only +25% organic and weak print response, giving ~510 sign-ups.\n\nHigh case: best cost per lead with Meta capped at ~35/day by the caller, +60% organic and strong print response, giving ~2,590 sign-ups. That is ~60+ sign-ups a day across all sources, so it needs a second caller.\n\nSense check: the likely list is ~48% of the ~2,950-household opening wave scaled from Glenrothes. That is plausible for a pre-opening list in a town with 1 of 57 practices accepting, and the high case is close to the realistic ceiling.\n\nEach extra week before opening adds roughly 210 sign-ups in the likely case (~150 Meta + ~60 other).",
  "people_per_signup": 1.9,
  "lead_to_booking_rate": {
   "low": 0.31,
   "likely": 0.48,
   "high": 0.64
  },
  "opening_month_registrations": "Likely ~1,950 people registered in the opening month (range ~720 to ~3,300).\n\nBuild-up for the likely case:\n- About 50% of the ~2,700 waiting-list people register in month 1: ~1,350.\n- Fresh opening demand not on the list: about 45% of Glenrothes' month-1 1,187 x 1.13, so ~600.\n\nThe high case is capped by clinic capacity at ~3,300, which is Glenrothes' 2,598 peak scaled by 1.28.\n\nUnlike Glenrothes, whose peak came in month 2 (2,598 in March) because it had no list, Kirkcaldy's waiting list should pull the peak into month 1. Expect month 2 to be similar or lower (~1,400\u20132,200), then settling toward roughly 500\u2013750 a month. The settled rate is Glenrothes' 480\u2013660 scaled up, minus Kirkcaldy people already absorbed by Glenrothes and Leven.\n\nPlanning implication: the 85\u2013100+ a day surge in HANDOFF.md belongs to the weeks after opening, not to the pre-opening ad period.",
  "is_20_enough": "Yes. \u00a320 a day is enough to start, and it is probably enough for most of the campaign. Your worry about expensive leads comes from private dental ads (implants, Invisalign), which do cost \u00a320\u2013\u00a380+ per lead. A free NHS waiting list in a town where almost no one is taking patients is a much easier yes. I expect roughly \u00a31.20\u2013\u00a31.50 per sign-up at the start, and about \u00a33.50\u2013\u00a34 in a realistic worst case.\n\nAt \u00a320 a day that is about 13\u201316 sign-ups a day, roughly 100 a week. That is enough for Meta to finish its learning phase in week 1, which needs ~50 results a week, and enough to keep the one caller busy without swamping them. \u00a310 a day would give ~7 a day and sit right on that learning threshold, so it is slower and noisier.\n\nThe real limit is the caller, not the budget. At \u00a350 a day you would get ~30 Meta sign-ups a day plus website, QR and phone sign-ups. That already reaches one person's 30\u201340 calls a day, so do not go above ~\u00a335\u201350 a day without a second caller.\n\nExpect cost per lead to rise 15\u201330% from late November to Christmas (Black Friday and Christmas advertisers push prices up). That is normal and not a reason to panic.\n\nHow to judge the real numbers after 3\u20134 days:\n- Under \u00a31.50 per lead: excellent.\n- \u00a31.50\u2013\u00a33: fine.\n- Over ~\u00a33.50 for 3 days: change the ad or form rather than adding money (tighter than the runbook's \u00a36 alarm).\n\nWill you get 'a lot'? Over the whole launch, yes: thousands of people in the opening months. Before opening, from ads alone, it is a steady ~15 a day at \u00a320 and ~30 a day at \u00a350, not a flood.\n\nTo check this forecast, track daily: spend, CPM, click-to-form rate, form completion, cost per lead by ad, frequency, sign-ups by source, people per sign-up, % 'currently registered', time to first call, contact rate and booked rate. Weekly, check cost per booked household (likely ~\u00a33) against the Dentally tracker's Kirkcaldy-postcode counts.\n\nThe clinic's Meta ad account currently has no payment method on file, so add a card before launch.",
  "sources": [
   "Owner data supplied in the task: Glenrothes Dental House monthly new NHS patients Nov 2025\u2013Oct 2026; 4 Fife practices (22,701 active patients, 299 new/week, 2,445 KY1/KY2 patients); Kirkcaldy-postcode sign-ups at Leven and Glenrothes",
   "/home/user/Dental/HANDOFF.md (demand evidence, planning figures, caller capacity)",
   "/home/user/Dental/BROWSER-CLAUDE-LAUNCH.md (4-week budget plan \u00a320\u2192\u00a350, ~\u00a3856 total, cost-per-lead alarm \u00a36, caller 30\u201340/day)",
   "/home/user/Dental/leads/README.md (lead handling, backlog alert at 15+ leads waiting >1h)",
   "Meta Ads account 1207154818311419 (GBP), checked 2026-11-08: ACTIVE, no campaigns yet, has_payment_method=false, so no real cost-per-lead data",
   "Dominate Dental, UK dental advertising cost guide (private dental cost per lead \u00a320\u2013\u00a3150; not applicable to NHS waiting list): https://www.dominatedental.com/dental-advertising-cost-uk-guide/",
   "Delmain, Facebook & Instagram ads for dentists 2026 benchmarks: https://delmain.co/?p=259883",
   "Influee, Facebook ads cost 2026 by industry: https://influee.co/gb/blog/how-much-do-facebook-ads-cost",
   "The Courier, 41,453 Fifers without an NHS dentist: https://thecourier.co.uk/fp/lifestyle/health-wellbeing/5137578/fife-mum-and-her-young-daughters-among-the-41453-fifers-struggling-without-an-nhs-dentist",
   "Dentistry.co.uk, thousands on waiting list for NHS dental practice: https://dentistry.co.uk/2024/01/18/thousands-on-waiting-list-for-nhs-dental-practice/",
   "Model script: /tmp/claude-0/-home-user/f778202c-7a7e-561e-ac12-c600a726fed0/scratchpad/model.py"
  ]
 },
 {
  "key": "bottomup",
  "method": "I built the forecast from the bottom up. CPL = CPM \u00f7 (1000 \u00d7 link CTR \u00d7 form open\u2192submit rate), and leads/day = daily budget \u00f7 CPL. Each input got a lognormal distribution whose P10 and P90 come from UK and dental Meta benchmarks. I adjusted them for this offer: a free NHS place in a town where almost no practice is registering. Then I ran 300,000 Monte Carlo draws. 'Low' and 'high' are the P10 and P90 of the result, not the minimum and maximum.\n\nI applied a week-by-week plan on top: \u00a320, \u00a325, \u00a335 and \u00a350 a day for 7 days each, \u00a3910 spend in total.\n- Seasonal CPM uplift for Black Friday (27 Nov 2026), Cyber Monday and the run-up to December.\n- A week-1 penalty for the learning phase and a new Page. I checked the owner's Meta ad account through the connector: it has zero campaigns, no history and no payment method on file yet.\n- Creative fatigue, since only 2 ads run on a roughly 95\u2013135k adult Meta audience.\n- A budget-scaling elasticity of CPL \u221d (budget/20)^0.15.\n\nResults:\n- **Steady state, after learning, mid-November:**\n  - \u00a320/day: CPL \u00a30.52 / \u00a31.22 / \u00a32.89, about 7 / 16 / 39 leads a day.\n  - \u00a335/day: CPL \u00a30.56 / \u00a31.33 / \u00a33.14, about 11 / 26 / 62 leads a day.\n  - \u00a350/day: CPL \u00a30.59 / \u00a31.40 / \u00a33.31, about 15 / 36 / 84 leads a day.\n- **Week by week on the plan (likely case):**\n  - Week 1 at \u00a320: about 101 leads (14/day, CPL \u00a31.39).\n  - Week 2 at \u00a325: about 125 leads (CPL \u00a31.40).\n  - Week 3 at \u00a335: about 141 leads (CPL \u00a31.74).\n  - Week 4 at \u00a350: about 166 leads (24/day, CPL \u00a32.11).\n- **4-week total:** 225 / 533 / 1,257 paid leads, blended CPL \u00a30.72 / \u00a31.71 / \u00a34.04. Adding organic-share form leads brings it to 254 / 604 / 1,434.\n- **Scenario where the ad looks like a private clinic:** if the ad does not make 'NHS' obvious, CTR and conversion fall to private-dental levels. That gives a CPL of about \u00a34.40 (range \u00a32.60\u2013\u00a37.50) and only about 4\u20135 leads a day at \u00a320. The clinic name 'Dental & Implant Clinic' sounds private, so this is the main way the forecast goes wrong.\n\nProbabilities on the main model: P(week-1 CPL > \u00a33) is about 9%, and P(CPL > \u00a35) is about 2%.\n\nReach check: \u00a3910 buys about 92k impressions over the 4 weeks. The demand pool does not limit volume at this spend: there are 20k+ under-served people in the radius, against about 1,360 people from the paid leads.\n\nWhy the private-dental benchmarks do not transfer: they show CPL of $60\u201377 because CTR is about 1\u20131.6% and click\u2192lead conversion is about 6%. The cost per click is not the problem. Dental CPC/CPM data, for example Delmain's $0.51 CPC, matches my median of about \u00a30.35 per form open. Conversion is what differs for an NHS sign-up form.",
  "assumptions": [
   {
    "item": "CPM (lead objective, ~10-mile Kirkcaldy radius, Advantage+ placements, mid-Nov baseline)",
    "value": "P10 \u00a35.80 / P50 \u00a38.85 / P90 \u00a313.50",
    "basis": "UK all-objective CPM blogs give about \u00a35\u2013\u00a37. Superads UK all-industry CPM was $13.20 in Oct 2025 (low) and $26.48 in Dec 2025 (high), averaging about $17.38 (\u2248\u00a313), and this includes expensive conversion campaigns. Delmain's dental CPM is $15.68 (\u2248\u00a311.80), mostly US, where CPMs run higher. The lead objective costs more than reach. A small Scottish-town auction is less competitive than a city one. Advantage+ adds cheaper Reels, Stories and Audience Network inventory."
   },
   {
    "item": "Seasonal CPM multiplier",
    "value": "Week 1 \u00d71.00, week 2 \u00d71.05, week 3 \u00d71.18 (Black Friday 27 Nov), week 4 \u00d71.28 (Cyber Monday, December)",
    "basis": "Superads UK CPM in Dec 2025 was about 2\u00d7 Oct 2025. I applied only part of that rise because local lead-gen auctions are less exposed to retail competition."
   },
   {
    "item": "Link CTR (form opens \u00f7 impressions)",
    "value": "P10 1.4% / P50 2.5% / P90 4.6%",
    "basis": "The floor is private-dental lead-campaign CTR: 1.05% (WordStream 2025, Apr 2024\u2013Jun 2025) and 1.62% (2026 report). All-industry lead campaigns run 2.59\u20132.70%, Physicians & Surgeons 4.18%, and Delmain's 47 dental practices 3.06%. A free NHS place, when only 1 of 57 Kirkcaldy practices is accepting, is a much stronger offer than elective private treatment."
   },
   {
    "item": "Instant Form open\u2192submit, Higher Intent (prefill, about 4 custom questions plus consent and a review screen)",
    "value": "P10 18% / P50 29% / P90 45%",
    "basis": "Blog-cited Instant Form completion ranges from 10\u201315% up to 30\u201350%. WordStream click\u2192lead conversion is 7.72\u20138.54% across all industries and 6.07% for dentists; that includes landing pages and counts every click, so it is a lower bound. The Higher Intent review step cuts raw completion compared with More Volume. NHS motivation is very high."
   },
   {
    "item": "Derived cost per form open",
    "value": "P50 about \u00a30.35 (P10 \u00a30.17, P90 \u00a30.72)",
    "basis": "Cross-check: Delmain's dental CPC is $0.51 and cost per link click $0.61 (\u2248\u00a30.38\u2013\u00a30.46), so this is consistent."
   },
   {
    "item": "Week-1 learning / new-Page penalty",
    "value": "Response \u00d70.88",
    "basis": "The ad account is brand new: no campaigns, no drafts and no payment method, as read via the Meta Ads connector on 2026-11-08. The Page is new and has low social proof, and Meta's learning phase runs to about 50 results."
   },
   {
    "item": "Creative fatigue, weeks 2\u20134",
    "value": "Response \u00d70.95 / \u00d70.90 / \u00d70.85",
    "basis": "Only 2 ads run on about 95\u2013135k adult Meta users in the radius, and there are about 92k impressions over 4 weeks. Lead optimisation focuses delivery on likely form-fillers, so their frequency rises faster than the average."
   },
   {
    "item": "Budget scaling elasticity",
    "value": "CPL \u221d (budget/20)^0.15, i.e. +9% at \u00a335 and +15% at \u00a350",
    "basis": "Diminishing returns in a small local audience."
   },
   {
    "item": "Organic-share form leads (shared or tagged ad posts)",
    "value": "+3% to +25% on top of paid, median about +13%",
    "basis": "People tag family on NHS-place posts. Leads from organic shares go through the same form and Graph API pull but are not counted as paid results."
   },
   {
    "item": "Junk, duplicate or out-of-area leads",
    "value": "4\u201312% of Meta leads",
    "basis": "Typical for Instant Forms, plus double sign-ups via leaflet QR and ad, plus accidental Audience Network fills. Check leads by placement."
   },
   {
    "item": "Exchange rate",
    "value": "\u00a31 = $1.33",
    "basis": "Used to convert USD benchmarks."
   },
   {
    "item": "People per sign-up",
    "value": "2.25 (range 1.8\u20132.7)",
    "basis": "Scotland's average household is about 2.1 (NRS). The mum-and-daughter creative and the 'No. of People' field push it up. Not every household member is unregistered."
   },
   {
    "item": "Lead\u2192booking",
    "value": "Valid 88\u201396% \u00d7 reached within 3 attempts 62\u201388% \u00d7 book once reached 78\u201392%, giving 0.43 / 0.61 / 0.78",
    "basis": "Private dental lead\u2192appointment is 20\u201335% with structured follow-up (Webtonic); that is the floor for elective offers. NHS scarcity, plus the instant SMS and email and the per-minute lead pull, raise it."
   },
   {
    "item": "Caller capacity",
    "value": "30\u201340 dials/day \u00f7 about 1.7 dials per lead, so about 18\u201323 new leads/day worked properly",
    "basis": "No-answers and 'call 8am' call-backs need repeat dials."
   },
   {
    "item": "Unmet demand in the catchment",
    "value": "20k+ people, so demand does not limit volume at \u00a320\u2013\u00a350/day",
    "basis": "The Courier reported about 41k Fifers without an NHS dentist (older figure). NHS Fife's Dec 2025 briefing (per search snippet; the page returned 403) said 10 Fife practices could register NHS patients. The aggregator showed 1 of 57 in Kirkcaldy. 2,445 group patients with KY1/KY2 postcodes travel out of town."
   },
   {
    "item": "Time from launch to opening, used for the total-waitlist estimate",
    "value": "About 6\u20138 weeks of sign-ups",
    "basis": "Not given in the brief. Total scales with how long the list stays open."
   }
  ],
  "cpl_gbp": {
   "low": 0.59,
   "likely": 1.39,
   "high": 3.28
  },
  "ad_leads_per_day_at_20": {
   "low": 6.1,
   "likely": 14.4,
   "high": 34
  },
  "four_week_ad_leads_on_plan": {
   "low": 225,
   "likely": 533,
   "high": 1257
  },
  "total_waitlist_by_opening": "Likely about 3,100 sign-ups (\u22487,000 people), assuming about 6\u20138 weeks of sign-ups before opening. Low about 1,400 (\u22483,200 people). High about 8,000 (\u224818,000 people).\n\nHow it builds up:\n- **Paid Meta:** about 530 leads in the 4-week plan, plus about 70 organic-share form leads, plus about 150\u2013250 more if ads continue 2\u20134 weeks at \u00a320\u2013\u00a335.\n- **Leaflets, banner and website QR:** about 300\u2013700. That assumes a door-drop response of about 0.5\u20131.5% and roughly 4\u201310 sign-ups a day from the Tolbooth Street banner.\n- **Organic Facebook, Kirkcaldy community groups, local press and word of mouth:** this is the swing factor. It ranges from about 500 if things stay quiet to about 6,500 if it goes viral.\n\nComparators:\n- Crewkerne, Somerset (April 2026): more than 4,500 expressions of interest in the first day from 'local communications', after which the portal was paused.\n- Wellington, Somerset (Sep 2025): 3,984 expressions of interest within weeks, then registrations were suspended.\nBoth are much smaller towns than Kirkcaldy's 150\u2013200k catchment.\n\nThe owner's own data points the same way. Glenrothes registered about 3,785 people in its first two months (\u22481,700 households) without a structured waiting list. Kirkcaldy has a bigger catchment and a worse shortage, and Glenrothes or Leven have only partly absorbed it (about 100\u2013235 Kirkcaldy-postcode sign-ups a month).\n\nIn the likely case, paid ads are only about 20% of the list. The ads give a steady, controllable floor; organic buzz drives the volume.\n\nTrack the 2,445 existing group patients with KY1/KY2 postcodes separately (e.g. Source = 'transfer'). Moving them is not net-new patients for the group.\n\nAll channels together could average 40\u201370 sign-ups a day, front-loaded around any press coverage. That is well beyond what one caller can work.",
  "people_per_signup": 2.25,
  "lead_to_booking_rate": {
   "low": 0.43,
   "likely": 0.61,
   "high": 0.78
  },
  "opening_month_registrations": "Likely about 2,000 new NHS registrations in the opening month (range about 1,200\u20132,700).\n\nThe limit is clinical capacity, not leads. A list of about 3,100 sign-ups is \u22487,000 people; at about 61% booking that is roughly 4,250 bookable people. That is 2\u20133 months of work at Glenrothes' peak pace: about 85 a day, about 600 a week, 2,598 in March 2026.\n\nGlenrothes' own opening month was 1,187, with no pre-built list. With the diary pre-filled from the waiting list, Kirkcaldy should open nearer Glenrothes' peak month than its first month.\n\nIf Kirkcaldy has fewer surgeries or clinicians than Glenrothes, scale this down in proportion. Expect months 2\u20133 to be fed by the backlog. Use the weekly Dentally tracker (Kirkcaldy-postcode counts at Leven and Glenrothes) to see how much of this is people moving from the group's other practices.",
  "is_20_enough": "Yes, \u00a320 a day is enough, and probably more than enough.\n\nThe fear about expensive leads comes from private-dental ad benchmarks, where a lead costs \u00a340\u2013\u00a380 because people are being sold implants or Invisalign. This ad offers a free NHS place in a town where almost nobody is taking NHS patients. People click it and fill in the form cheaply.\n\n**What to expect at \u00a320 a day:** roughly \u00a31.40 a lead and about 14 leads a day in the first week. A realistic range is 6 to 34 a day. That is roughly 100 leads in week 1 and about 530 over the 4-week \u00a320\u2192\u00a350 plan, for \u00a3910 in total.\n\n**The bad case:** at about \u00a33.30 a lead, you would still get about 6 a day. Meta wants about 50 leads a week to finish its learning phase, and \u00a320 a day clears that in most scenarios. \u00a310 a day would work but would be slower (about 9 a day), and Meta's learning would be shakier.\n\n**What runs out first is the caller, not the budget.** One person making 30\u201340 calls a day can properly handle only about 18\u201323 new leads a day, once you allow for no-answers and call-backs. Leaflets, the banner, Facebook shares and word of mouth will come on top of the ad leads. Going to \u00a350 a day (about 24\u201336 ad leads a day) will probably swamp one caller unless organic sign-ups are slow.\n\n**Rules for changing the budget:**\n- Stay at \u00a320 for the first 5\u20137 days.\n- Only step up if both of these hold:\n  - CPL over the last 3 days is under about \u00a33.\n  - The backlog warning (15+ leads waiting over an hour) is not firing at the 9pm report.\n- If CPL sits above about \u00a35 for 3 days, fix the ad, don't add money. It almost certainly means the ad is not reading clearly as 'NHS'. 'Dental & Implant Clinic' sounds private, so put 'NHS' in the first line and on the image.\n\n**Before launch:** the Meta ad account currently has no payment method on it. Add one or the ads won't run.",
  "sources": [
   "https://ppc.land/facebook-ad-costs-jump-21-as-lead-campaigns-struggle-while-traffic-ads-thrive/ (WordStream/LocaliQ 2025, Apr 2024\u2013Jun 2025: dentists lead CPL $76.71, CTR 1.05%, CPC $9.78; all-industry lead CTR 2.59%, CVR 7.72%, CPL $27.66)",
   "https://ppc.land/facebook-lead-costs-hold-at-27-39-as-traffic-clicks-drop-to-0-60/ (2026 report, 452 US lead campaigns: dentists CPL $61.56, CTR 1.62%, CPC $5.70; all-industry CTR 2.70%, CVR 8.54%, CPL $27.39)",
   "https://localiq.com/blog/facebook-advertising-benchmarks/ (dentists lead CVR 6.07%; Physicians & Surgeons CTR 4.18%)",
   "https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/united-kingdom (UK CPM Oct 2025 13.20 low, Dec 2025 26.48 high, ~17.38 avg, likely USD)",
   "https://www.superads.ai/facebook-ads-costs/cost-per-lead/united-kingdom (GB all-industry CPL \u00a358.52 Dec 2025, \u00a317.46 Jul 2026, ~\u00a337.80 median)",
   "https://delmain.co/?p=259883 (47 dental practices, Jul 2025\u2013Jul 2026: CTR 3.06%, CPM $15.68, CPC $0.51, cost per qualified lead ~$58)",
   "https://www.webtonic.io/blog/dental-facebook-ads-statistics (private dental native-form CPL $28\u201355; lead\u2192appointment 20\u201335% with follow-up)",
   "https://growwithsakib.com/meta-lead-ads/ (Instant Form completion 30\u201350% cited from Involve Digital; other guides cite 10\u201315%)",
   "https://www.dominatedental.com/dental-advertising-cost-uk-guide/ (UK private dental Facebook CPL \u00a382 case; \u00a340\u2013\u00a380 typical)",
   "https://www.jdrgroup.co.uk/blog/facebook-instagram-meta-ads-case-study (UK low-friction offer: 1,363 Meta leads at \u00a31.08 CPL)",
   "https://nhssomerset.nhs.uk/news/more-than-4500-people-sign-up-for-appointments-at-new-nhs-dental-practice-in-crewkerne/ (Apr 2026: 4,500+ expressions of interest on day one)",
   "https://www.wellington-today.co.uk/news/new-wellington-dental-practice-pausing-patient-registration-after-4000-overwhelm-it-835077 (Sep 2025: 3,984 expressions of interest, registration paused)",
   "https://www.kentonline.co.uk/faversham/news/huge-overnight-queues-and-27-000-calls-as-dentist-opens-up-n-291092/ (2023: 27,000 calls in a day for NHS places)",
   "https://www.nhsfife.org/news-updates/briefings-for-fife-elected-members-msps-mps-and-councillors/23-december-2025/ (search snippet: 10 Fife practices able to register NHS patients; page returned 403 when fetched)",
   "https://influee.co/gb/blog/good-cpm-facebook-ads and https://www.photonpay.com/uk/blog/article/facebook-advertising-costs (UK general CPM ~\u00a35\u2013\u00a37)",
   "Meta Ads connector, ad account 1207154818311419, read 2026-11-08: no live or draft campaigns, no history, has_payment_method=false, currency GBP",
   "Model script: /tmp/claude-0/-home-user/f778202c-7a7e-561e-ac12-c600a726fed0/scratchpad/mc2.py"
  ]
 },
 {
  "key": "topdown",
  "method": "I built the forecast top-down from the catchment and checked it with a Monte Carlo run (20,000 draws, triangular inputs) plus three fixed scenarios for low, likely and high. Script: /tmp/claude-0/-home-user/f778202c-7a7e-561e-ac12-c600a726fed0/scratchpad/model/topdown.py (scenarios in scen2.py, same folder).\n\n(1) POOL. The 10-mile radius splits into a core (Kirkcaldy plus Burntisland, Kinghorn and the Wemyss villages, about 63,300 people) and an outer ring (about 109,000 people: Glenrothes, Levenmouth edge, Cardenden, Lochgelly and Cowdenbeath edge). For each zone I estimated how many people are unregistered or registered but not being seen, then what share of them would join a Kirkcaldy NHS list. Result: about 12,000 people (10,100 to 14,100), or about 6,750 sign-ups (5,500 to 8,200). That is the ceiling for the whole launch, not for 4 weeks.\n\n(2) REACH. The spend plan of \u00a320, \u00a325, \u00a335 then \u00a350 a day for a week each comes to \u00a3910. At a Q4 CPM of about \u00a38.90 that buys about 102,000 impressions, set against about 110,700 adults in the radius who use Facebook or Instagram. That is an average of about 0.9 impressions per adult, so the ads will not saturate the area in 4 weeks.\n\n(3) RESPONSE. Each day, impressions land on in-market adults at their share of the audience, raised 1.9x by Meta's lead optimisation. Each such impression converts at about 6%, falling as frequency builds. People who sign up are removed from the pool. I added 18% for organic form leads from shares and tags. In practice this means about 1% of impressions become a lead, roughly a 2% click-through and 45% form completion. That is 2 to 3 times a normal lead ad, because a free NHS place is scarce here.\n\nLikely result per week: 154, 178, 227 and 286 leads, at a cost per lead of \u00a30.91, \u00a30.98, \u00a31.08 and \u00a31.23. The Monte Carlo spread for the 4 weeks is 603 to 1,295 leads (P10 to P90). The low and high scenarios move several inputs together to show the real structural risk, which is whether the creative behaves like a scarce-NHS offer or like an ordinary lead ad.\n\n(4) CHECKS. Kirkcaldy-postcode sign-ups at the owner's Leven practice ran at 200 to 235 a month before Glenrothes opened. That means about 2,600 a year were willing to travel about 9 miles, which supports a pool of this size. Glenrothes took about 8,800 people in 9 months, which shows how fast pent-up demand turns into registrations once a practice is open.\n\nTwo facts outside the model. The Meta ad account I can see (1207154818311419) has no payment method and no campaigns or drafts yet, so ads cannot run until a card is added. And in this model the single caller, not the budget, is what limits the result.\n\nTo check the forecast in week 1, track: CPM, CTR, form completion rate, cost per lead per ad, share of leads with in-catchment postcodes (KY1/KY2 versus others), average 'No. of People', minutes to first call, contact rate, booking rate, and how long the backlog is at 9pm.",
  "assumptions": [
   {
    "item": "Fife unregistered rate",
    "value": "11.1% (41,453 of 374,760 people)",
    "basis": "Public Health Scotland figure reported by the Courier and cited by Richard Baker MP (9,265 of them children); NRS Fife mid-2024 population 374,760. Scotland overall is 95.1% registered and 62.1% participating within 2 years (PHS, 31 Mar 2026)."
   },
   {
    "item": "Fife registrations by practice location",
    "value": "311,260 across 57 practices at 31 Mar 2026, about 83% of the Fife population",
    "basis": "PHS open data 'Dental Practices and Patient Registrations', March 2026 CSV, which I downloaded and summed for health board S08000029. NHS Fife's own page says about 84% registered versus 94.5% for Scotland."
   },
   {
    "item": "Kirkcaldy access is getting worse",
    "value": "KY1/KY2 practices fell from 56,335 to 52,824 NHS registrations (-3,511, -6.2%) between Mar 2025 and Mar 2026",
    "basis": "Same PHS CSVs. Park Road went from 5,939 to 2,532 and Redburn from 1,444 to 1,107, while Fife overall rose 0.5%. Only 5 NHS practices have KY1/KY2 postcodes; Templehall alone holds 36,524."
   },
   {
    "item": "Core population (about 5 miles)",
    "value": "63,300 (60,000 to 67,000)",
    "basis": "Kirkcaldy locality 51,117 (Census 2022, via citypopulation.de) plus Burntisland, Kinghorn and the Wemyss villages."
   },
   {
    "item": "Total 10-mile population",
    "value": "172,000 (150,000 to 200,000); outer ring is the total minus the core",
    "basis": "Range given in the brief."
   },
   {
    "item": "Core unregistered now",
    "value": "12% (9% to 15.5%)",
    "basis": "Fife's 11.1%, plus the Kirkcaldy deregistration shock, minus about 1,600 KY1/KY2 people taken on by Glenrothes (84+235+176+about 6x117) and Leven since Feb 2026."
   },
   {
    "item": "Outer-ring unregistered now",
    "value": "7.5% (5% to 10%)",
    "basis": "Fife average, minus about 7,600 non-Kirkcaldy registrations at Glenrothes Dental House in 2026 (I assumed about half of them were previously unregistered)."
   },
   {
    "item": "Share of unregistered who would join a Kirkcaldy list",
    "value": "Core 70% (55% to 85%); outer 22% (12% to 35%)",
    "basis": "Only 1 of 57 Kirkcaldy NHS practices is accepting, so the core has no alternative. The outer ring still has Glenrothes (about 500 a month) and Leven open to them."
   },
   {
    "item": "Switchers (registered elsewhere or not being seen)",
    "value": "28% of the 2,445 KY1/KY2 patients at the owner's practices; 5% (2.5% to 8.5%) of other registered core residents; 1% of registered outer-ring residents",
    "basis": "Owner's Dentally data. Nationally 38% of registered patients have not been seen in 2 years (PHS)."
   },
   {
    "item": "Addressable pool for the whole launch",
    "value": "About 12,000 people, or about 6,750 sign-ups (P5 to P95: 5,500 to 8,200 sign-ups)",
    "basis": "Sum of the rows above, divided by people per sign-up."
   },
   {
    "item": "People per sign-up",
    "value": "1.78 (1.5 to 2.1)",
    "basis": "Scottish household average is about 2.1. Unregistered people skew towards single adults, while the mum-and-daughter creative pushes family sign-ups. The form's 'No. of People' field will measure this in week 1."
   },
   {
    "item": "Meta-reachable adults in the radius",
    "value": "About 110,700 (98,600 to 124,000)",
    "basis": "80% of residents are adults, and 72% to 87% of those use Facebook or Instagram."
   },
   {
    "item": "CPM",
    "value": "\u00a38.90 (\u00a36.00 to \u00a312.50)",
    "basis": "UK 2026 benchmarks of about \u00a36 to \u00a39 (photonpay \u00a38.55, froggyads \u00a35.93), raised because the flight runs through Black Friday (27 Nov) and the pre-Christmas auction peak, and because the target area is small."
   },
   {
    "item": "Lead-optimisation lift",
    "value": "1.9x (1.3 to 2.8)",
    "basis": "Meta concentrates lead-objective delivery on people likely to respond, compared with spreading impressions at random."
   },
   {
    "item": "Per-impression response of an in-market adult",
    "value": "6% (3.5% to 9%), falling as 1/(1 + 0.35 x average frequency)",
    "basis": "Attention on an impression of about 35% to 45%, times a response of 15% to 25% for a free, scarce NHS place. Overall this gives about 0.9% to 1.0% of impressions becoming leads."
   },
   {
    "item": "Organic form leads from shares and tags",
    "value": "+18% (5% to 40%)",
    "basis": "Local 'tag someone who needs a dentist' sharing. These organic leads come through the same Instant Form and are pulled by the Apps Script along with the paid ones."
   },
   {
    "item": "Delivery on plan",
    "value": "\u00a3910 buys about 102,000 impressions, an average of about 0.92 per Meta adult",
    "basis": "Spend plan divided by CPM. This means roughly half the adults see the ad and there is little saturation."
   },
   {
    "item": "Non-Meta sign-ups by opening",
    "value": "0.75x the Meta leads (0.35x to 1.5x), plus 150 (60 to 320) from leaflets, banner and website",
    "basis": "Local Facebook groups, word of mouth and press (Fife Today, Courier, Kingdom FM) usually match paid volume for a dental-desert story. Leaflets get about 0.3% to 1% response. The QR source tracking will show the real split."
   },
   {
    "item": "Lead to booking",
    "value": "83% contactable x 91% valid, in-area and not a duplicate x 74% book = 0.56",
    "basis": "Free NHS registration in a dental desert gives high intent, but Instant Forms bring 5% to 15% junk, wrong numbers or out-of-area leads. The rate falls to about 0.45 if leads wait more than 3 days for a call."
   },
   {
    "item": "Caller capacity",
    "value": "35 calls a day resolves about 22 leads, which books about 12 households (about 22 people) a day",
    "basis": "About 1.6 call attempts per lead (no answers, call-backs at 8am)."
   },
   {
    "item": "Private-dental benchmarks not used",
    "value": "Not applied",
    "basis": "Private dental cost-per-lead figures (\u00a320 to \u00a375 in the UK; US dentists $61 to $77, WordStream) are for paid treatments such as implants and Invisalign. They do not carry over to a free NHS place."
   }
  ],
  "cpl_gbp": {
   "low": 0.37,
   "likely": 1.08,
   "high": 4.56
  },
  "ad_leads_per_day_at_20": {
   "low": 4.9,
   "likely": 22,
   "high": 70.8
  },
  "four_week_ad_leads_on_plan": {
   "low": 200,
   "likely": 845,
   "high": 2450
  },
  "total_waitlist_by_opening": "Likely about 1,830 sign-ups, about 3,260 people, assuming the practice opens about 5 weeks after ads start. The Monte Carlo spread is 1,255 to 2,670 sign-ups (P10 to P90), or 2,250 to 4,700 people.\n\nWhere it comes from: about 845 from Meta on the plan, about 630 to 920 from organic shares, local Facebook groups, press and word of mouth (about 0.75x Meta), and about 150 from leaflets, banner and website. That is roughly 27% of the estimated pool of about 6,750 sign-ups (12,000 people), so the list will keep growing after opening.\n\nIs it a lot? Yes, compared with what one caller can handle, but paid ads alone will not produce a flood. The swing factor is free coverage: a Courier or Fife Today story, or a post going viral in the Kirkcaldy community groups, could add 500 to 1,000 sign-ups in a few days. If neither happens, expect the low case.\n\nExpect sign-ups for Kirkcaldy postcodes at Leven and Glenrothes (currently about 130 to 200 a month) to fall. Track that in the weekly Dentally tracker.",
  "people_per_signup": 1.78,
  "lead_to_booking_rate": {
   "low": 0.36,
   "likely": 0.56,
   "high": 0.73
  },
  "opening_month_registrations": "Likely about 1,500 new NHS registrations in the opening month, with a range of about 900 to 2,600.\n\nHow it builds up: about 590 people booked by the caller before opening, about 340 more booked and seen within the month, and about 600 walk-ins, phone calls and word of mouth. For comparison, Glenrothes registered 1,187 in its opening month with no waiting list.\n\nIf one caller stays the only way to book, expect the lower half (about 1,000 to 1,500). The list will hold about 1,800 people wanting to book (3,260 people x 0.56), but one person can only book about 20 to 25 people a day. The high end (about 2,600, the same as Glenrothes' March peak) needs a second caller or a self-booking link in the instant SMS and email, plus clinical capacity staffed the way Glenrothes was.",
  "is_20_enough": "Yes. \u00a320 a day is enough to start, and probably enough overall.\n\nA free NHS place in a town where 1 of 57 practices is taking people should produce cheap leads. My best estimate is about \u00a31.08 per lead, with a range of about 40p to \u00a34.50. At \u00a320 a day that is about 22 leads a day, with a range of about 5 to 70. The cost per lead creeps up to about \u00a31.23 by week 4 as spend rises.\n\nThe scary \u00a320 to \u00a375 per lead figures are for private implants and Invisalign, where people pay. They do not apply here.\n\nThe real limit is your one caller. 30 to 40 calls a day handles about 20 to 25 new leads a day, and \u00a320 a day roughly fills that before any leaflet, banner or word-of-mouth sign-ups arrive. At \u00a350 a day you would get about 41 Meta leads a day plus organic ones, and the 'waiting more than 1 hour' alarm would fire every day. Leads that wait days convert worse (about 0.45 instead of 0.56).\n\n\u00a310 a day would give about 11 leads a day at almost the same cost per lead (\u00a30.94), so it is fine if budget is tight. It just halves the volume and slows Meta's learning.\n\nWhat to do:\n1. Start at \u00a320 a day.\n2. Judge it on the real cost per lead after about \u00a360 to \u00a3100 of spend (3 to 5 days).\n3. Only step up to \u00a335 and then \u00a350 if the cost per lead stays under about \u00a32.50 and the backlog alarm is not firing, or once you add a second caller or a self-booking link.\n4. If the cost per lead is above about \u00a34 after about \u00a3100, change the creative or the form (for example the headline 'NHS dentist now taking patients in Kirkcaldy'), not the budget.\n\nBefore any of this, the Meta ad account I can see (1207154818311419) has no payment method and no campaigns yet. Ads cannot run until a card is added.",
  "sources": [
   "https://www.publichealthscotland.scot/publications/nhs-dental-data-monitoring-report/nhs-dental-data-monitoring-report-quarter-ending-march-2026/",
   "https://www.publichealthscotland.scot/media/38801/publication-summary-may-2026_final.pdf",
   "https://www.opendata.nhs.scot/dataset/dental-practices-and-patient-registrations",
   "https://www.opendata.nhs.scot/dataset/2f218ba7-6695-4b22-867d-41383ae36de7/resource/6c0d19e7-ba5b-46c2-8135-3200b59ad482/download/nhs-dental-practices-and-nhs-dental-registrations-as-at-31-mar-2026.csv",
   "https://www.opendata.nhs.scot/dataset/2f218ba7-6695-4b22-867d-41383ae36de7/resource/14386246-a376-4f49-97b9-4f9ec01f813d/download/nhs-dental-practices-and-nhs-dental-registrations-as-at-31-mar-2025.csv",
   "https://thecourier.co.uk/fp/lifestyle/health-wellbeing/5137578/fife-mum-and-her-young-daughters-among-the-41453-fifers-struggling-without-an-nhs-dentist",
   "https://www.nrscotland.gov.uk/statistics-and-data/council-area-profiles/fife",
   "https://citypopulation.de/en/uk/scotland/fife/S52000369__kirkcaldy",
   "https://nhsfife.org/lets-talk/dentistry-and-oral-health",
   "https://dentistry.co.uk/2026/09/22/nhs-dental-participation-scotland/",
   "https://www.photonpay.com/uk/blog/article/facebook-advertising-costs",
   "https://froggyads.com/blog/facebook-ads-cost-uk",
   "https://www.wordstream.com/blog/facebook-ads-cost",
   "https://www.dominatedental.com/dental-advertising-cost-uk-guide/",
   "Meta Ads account 1207154818311419 (read-only check, 2026-11-08: no payment method, no campaigns or drafts)",
   "Model scripts: /tmp/claude-0/-home-user/f778202c-7a7e-561e-ac12-c600a726fed0/scratchpad/model/topdown.py and /tmp/claude-0/-home-user/f778202c-7a7e-561e-ac12-c600a726fed0/scratchpad/model/scen2.py"
  ]
 }
]