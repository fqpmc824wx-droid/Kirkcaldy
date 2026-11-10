# Kirkcaldy Dental & Implant Clinic: Meta lead ads launch playbook (pre-opening waiting list)

*Prepared 8 November 2026. Every fact links to its source. Anything marked **(estimate)** or **(our judgement)** has no source behind it. Meta Help Centre pages carry no dates; all of them were retrieved on 8 Nov 2026.*

**In short:** the plan is mostly right: one campaign, one ad set, broad targeting and an Instant Form. These things need to change:
1. Set the conversion location to **Instant forms only**.
2. Launch with **4–6 genuinely different creatives**, not 2.
3. Switch off **every Meta AI creative feature** and the lead-capture AI agent.
4. Fix the **Apps Script before 10 November**: API version, consent field and Google quotas.
5. Size the budget to about **45 leads a day**, with an automatic cap.
6. Reword the **disclaimer, the SMS and the weekend calling hours**.

---

## 1. What's changed since mid-2026 that matters to us

- **You can no longer choose placements for Leads ad sets.** They run on Advantage+ placements. Only four placements can be blocked, and only at account level: Audience Network native/banner/interstitial, Audience Network rewarded video, Marketplace and the Facebook right column. A block can take up to 48 hours to apply. Sources: [Meta Help](https://www.facebook.com/business/help/1546753450586085); [Meta Help, account controls](https://www.facebook.com/business/help/1438478636941047); first reported by [Jon Loomer, 20 Aug 2026](https://www.jonloomer.com/meta-removing-placement-controls-ad-sets/).
- **The default conversion location is now "Website and Instant Forms".** Meta sends each person to whichever it predicts they are likelier to complete ([Jon Loomer, 21 Jul 2026](https://www.jonloomer.com/meta-ads-lead-generation/); [Meta Help](https://www.facebook.com/business/help/1438863853809586)). Leads that go to the website never reach our Apps Script.
- **New Leads campaigns start as "Advantage+ leads campaigns".** Advantage+ budget, audience and placements are on by default. Meta claims 14% lower CPL from its own tests ([Meta Help](https://www.facebook.com/business/help/992035952809423)).
- **The "qualified leads" goal now requires the Conversions API.** New campaigns have needed it since April 2026, and existing campaigns have been affected since August 2026 ([Meta Help](https://www.facebook.com/business/help/782657799338685)).
- **Meta guidance from 21 Oct 2026:** an ad set needs about 50 conversions a week. Every edit "rebriefs" the system, so make changes all at once. Ad sets under 50 conversions cost about 28% more *per purchase*; that figure comes from sales data, not leads ([Meta for Business, 21 Oct 2026](https://www.facebook.com/business/news/you-dont-beat-the-auction-you-brief-it); [PPC Land, 25 Oct 2026](https://ppc.land/meta-says-ad-sets-under-50-weekly-conversions-cost-28-more-per-purchase/)).
- **Meta's ranking upgrades reward genuinely different creative.** On 28 Oct 2026 Meta announced Andromeda, GEM and GenRecs. There is "no setting to switch on", and campaigns with few conversions now draw on wider learning ([Meta for Business, 28 Oct 2026](https://www.facebook.com/business/news/three-new-ai-innovations-in-ads-ranking); [Meta Engineering, 28 Oct 2026](https://engineering.fb.com/2026/10/28/ml-applications/meta-andromeda-next-gen-ads-retrieval-gpu-co-design/)). GenRecs reads each ad's text and images, and "similar items share tokens" ([Meta Engineering, 19 Oct 2026](https://engineering.fb.com/2026/10/19/ml-applications/genrecs-tokenization-transforming-ads-recommendation-at-meta-with-stable-model-vocabulary/)).
- **New "Creative diversity" rating.** It scores an ad set High, Medium or Low by comparing its images and video thumbnails, and Meta says it is "in development" ([Meta Help](https://www.facebook.com/business/help/2371176336684086)). It launched on 26 Aug 2026 ([Common Thread Collective, 9 Sep 2026](https://commonthreadco.com/blogs/coachs-corner/metas-new-creative-diversity-score-is-live-in-ads-manager-what-ecommerce-brands-must-act-on-now)).
- **Meta's AI can now rewrite the headline inside an uploaded image.** In testing, the Branding "restricted words" were "not followed as strictly as I'd like" ([Jon Loomer, 28 Jul 2026](https://www.jonloomer.com/meta-rewrite-text-ad-images/); [AdMake AI, Aug 2026](https://admakeai.com/blog/meta-ads-updates-august-2026)). "Some enhancements are turned on by default" ([Meta Help](https://www.facebook.com/business/help/1082295769403815)).
- **A "lead capture AI agent" is available to some accounts.** Meta decides whether a person sees an AI chat instead of the form, and the conversation "isn't stored" ([Jon Loomer, 9 Jul 2026](https://www.jonloomer.com/lead-capture-ai-agent-instant-forms/)).
- **A 2% UK location fee applies from 1 Jul 2026.** It is charged on top of the budget, VAT is added on top of that, and it does not appear in Ads Manager ([Meta Help](https://www.facebook.com/business/help/1238737454289085)).
- **API versions:** Graph/Marketing API v26.0 came out on 29 Jul 2026 and v27.0 on 4 Nov 2026. Marketing API v24.0 is only available until **10 Nov 2026**. Since 27 Oct 2026, `date_format` and `GET /?ids=` fail on every version ([Marketing API changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog); [Meta developers blog, 4 Nov 2026](https://developers.facebook.com/blog/post/2026/11/04/introducing-graph-api-v27-and-marketing-api-v27/)).
- **Auction prices are rising.** Meta's average price per ad was up 14% year on year in Q3 2026 ([Meta Q3 results, 21 Oct 2026](https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Third-Quarter-2026-Results/)).
- **Ads Manager can now report each creative asset separately** (Breakdown > Creative > Media) ([Social Samosa, 28 Oct 2026](https://www.socialsamosa.com/news-2/meta-ads-manager-breakdown-tool-track-individual-creative-performance-12760366); [Meta Help](https://www.facebook.com/business/help/1822387965412520)).
- **Meta's Health & Wellness ad standard was updated on 22 Jul 2026.** Ads must not create negative self-perception, and cosmetic procedures must target people aged 18+ ([Meta Transparency](https://transparency.meta.com/en-gb/policies/ad-standards/restricted-goods-services/health-wellness)).
- **The ASA is actively monitoring paid health ads.** Its Pulse report (Sep 2026) rated more than 86% of sampled ads medium or high risk in every priority group. Dentistry was not one of the groups ([ASA Pulse report, Sep 2026](https://www.asa.org.uk/static/645be1e9-39a2-4089-bfda1be49ed03243/Pulse-ReportHealth-Claims-in-Ads.pdf)).
- **The GDC consulted from 2 Jun to 31 Aug 2026 on folding its advertising guidance into a new framework.** No decision has been published, so the 2013 guidance still applies ([PSA response, Aug 2026](https://www.professionalstandards.org.uk/sites/default/files/attachments/PSA%20response%20to%20GDC%20consultation%20on%20the%20framework%20for%20professionalism%20%28August%202026%29.pdf)).
- **UK data law.** Since 19 Jun 2026 every controller must have a data protection complaints procedure. Since 5 Feb 2026 PECR fines can reach £17.5m or 4% of turnover ([ICO statement via WiredGov, 6 Feb 2026](https://www.wired-gov.net/wg/news.nsf/articles/Statement+on+the+commencement+of+the+Data+Use+and+Access+Act+DUAA+06022026102000); [SI 2026/82](https://www.legislation.gov.uk/uksi/2026/82/made); [Bratby, 6 Apr 2026](https://bratby.law/data-protection-complaints-duaa-controllers-june-2026/)).
- **The ICO fined callers in July and August 2026**, including a fine for callers not identifying themselves ([ICO, 8 Jul 2026](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/07/two-home-improvement-companies-fined-370-000-for-nuisance-calls-targeting-vulnerable-people/); [Recording Law, 27 Aug 2026](https://www.recordinglaw.com/news/ico-elderly-aids-nuisance-calls-pecr-fine)).
- **Ofcom's business-SMS rules start on 15 Jul 2027.** Providers will run KYC checks on sender IDs ([ISPreview, 15 Jul 2026](https://www.ispreview.co.uk/index.php/2026/07/ofcom-introduce-new-uk-rules-to-tackle-mobile-messaging-scams.html)).

---

## 2. Campaign setup, step by step

**48 hours before launch (account settings)**
1. **ADD (optional, our judgement):** go to Advertising Settings > Account controls > Placement controls, objective = Leads, and exclude both Audience Network types. The change can take 48 hours. It applies to every Leads campaign in the ad account, including Glenrothes if it shares the account ([Meta Help](https://www.facebook.com/business/help/1438478636941047)).
2. **ADD:** go to Advertising Settings > Creating ads > Creative features and untick "Test new creative features" ([Meta Help](https://www.facebook.com/business/help/2084198785720343)).
3. **ADD:** in Branding (Identity), add the banned phrases as restricted words. This is only a backstop, because testing found it lets things through ([Jon Loomer](https://www.jonloomer.com/meta-rewrite-text-ad-images/)).

**Campaign level**
4. **Objective: Leads. KEEP.**
5. **Setup: one Advantage+ leads campaign (Meta's default). KEEP** ([Meta Help](https://www.facebook.com/business/help/992035952809423)).
6. **Budget: Advantage+ campaign budget, daily, £20/day. KEEP.** Use a daily budget because budget scheduling only works with daily budgets ([Meta Help](https://www.facebook.com/business/help/633318028866693)).
7. **Bid strategy: Highest volume. KEEP.** There is no cost history yet, and the creative test tool only works with Highest volume ([Meta Help](https://www.facebook.com/business/help/272336376749096); [Meta Help](https://www.facebook.com/business/help/1423851372208214)).

**Ad set (one only, KEEP)**
8. **Conversion location: CHANGE to "Instant forms".** The default "Website and instant forms" would send some people to the website. Those leads never appear in `/{form-id}/leads`, so they get no SMS and no caller alert. The combined option also cannot report CPL by location ([Jon Loomer](https://www.jonloomer.com/meta-ads-lead-generation/); [Meta Help](https://www.facebook.com/business/help/1438863853809586)).
9. **Performance goal: "Maximize number of leads". KEEP.** The qualified-leads goal is unavailable without the Conversions API ([Meta Help](https://www.facebook.com/business/help/782657799338685)).
10. **Location: CHANGE.** Meta shows ads to people "living there or recently there" and says "complete accuracy is not guaranteed", so "living within 10 miles" cannot be enforced ([Meta Help](https://www.facebook.com/business/help/365561350785642)). Do this instead:
    - Untick **"Reach more people likely to respond to your ads"**. It may already be ticked.
    - Then either drop a pin on 23–25 Tolbooth Street at the smallest radius that covers Kirkcaldy, or target postcode districts (for example KY1, KY2 and any others you choose). A radius cannot be added to postcodes.
    - Keep the postcode question on the form so callers can screen out-of-area leads.
11. **Glenrothes overlap: CHECK.** Glenrothes is about 6 miles away, so it sits inside a 10-mile radius. Ads from the same advertiser compete in the same auctions, even from separate ad accounts ([Meta Help](https://www.facebook.com/business/help/537699989762051)). If the Glenrothes practice is advertising, keep this campaign to Kirkcaldy postcodes (our judgement) or pause one of the two.
12. **Age: CHANGE.** Set **minimum age 18** as the hard control, because the 18–65+ range is only a suggestion to Meta ([Meta Help](https://www.facebook.com/business/help/365561350785642)). It also meets Meta's 18+ rule for cosmetic procedures ([Meta Transparency](https://transparency.meta.com/en-gb/policies/ad-standards/restricted-goods-services/health-wellness)).
13. **Detailed targeting: none, with Advantage+ audience on. KEEP** ([Meta for Business](https://www.facebook.com/business/news/three-new-ai-innovations-in-ads-ranking)).
14. **Placements: Advantage+. KEEP**, because it is now the only option ([Meta Help](https://www.facebook.com/business/help/1546753450586085)).
15. **Ad scheduling (dayparting): don't use it.** Overnight leads are simply called from 8am. Meta's own pages disagree on whether dayparting needs a lifetime budget ([Meta Help](https://www.facebook.com/business/help/633318028866693) vs [Meta Help](https://www.facebook.com/business/help/1381935425400769); [Adship, Sep 2026](https://www.adship.ai/blog/facebook-ads-scheduling-tool)).

**Ads**
16. **Creatives: CHANGE from 2 to 4–6 distinct concepts, all published on day 1** (see §4). Adding an ad later counts as a significant edit and restarts learning ([Meta Help](https://www.facebook.com/business/help/316478108955072)).
17. **Media: give every ad 4:5, 9:16 and a 1:1 crop** using media customisation. Meta does not deliver an ad where it has no supported media ([Meta Help](https://www.facebook.com/business/help/1546753450586085); [Meta Help](https://www.facebook.com/business/help/1001112308024751)).
18. **Advantage+ creative: CHANGE to all off**, in both the creative step and Advanced preview / Review defaults. Untick every generated text or image variant ([Meta Help](https://www.facebook.com/business/help/1082295769403815); [Meta Help](https://www.facebook.com/business/help/4321026574777213)).
19. **Form: Higher intent with required phone verification** (see §3). Keep the **lead capture AI agent OFF**.
20. **Call to action: "Sign up"** (our judgement; no test data was found).

**What to expect:** at £140 a week, the ad set only gets out of learning if CPL is £2.80 or less. Otherwise it will show "Learning limited", which "isn't a penalty" ([Meta Help](https://www.facebook.com/business/help/269269737396981)). Judge cost after about 50 leads ([Meta Help](https://www.facebook.com/business/help/1707952432550214)).

---

## 3. Instant Form settings

Build the form in **Ads Manager**, not Business Suite. Phone verification and conditional logic need Ads Manager ([Meta Help](https://www.facebook.com/business/help/761812391313386)). A published form **cannot be edited**; you have to duplicate it to change it ([Meta Help](https://www.facebook.com/business/help/179258984144385)). Save it as a draft and have the owner sign it off first.

| Setting | Recommended |
|---|---|
| Form name | `KDIC waiting list v1 – Nov 2026` (log this in the Sheet as the consent version; our judgement) |
| Form type | **Higher intent. KEEP.** It adds follow-up context and a review screen. Meta says it delivers **only to Facebook and Instagram Feed on mobile** ([Meta Help](https://www.facebook.com/business/help/252352181957512)). The page is undated, so check the placement preview. |
| Phone verification | **ADD: required (OTP).** For Higher intent it is set in the form editor. UK codes are sent by SMS. Landlines cannot verify. It "may be enabled by default", so decide deliberately ([Meta Help](https://www.facebook.com/business/help/898260175547909)). |
| Intro headline | "New NHS dental practice opening soon" |
| Intro text | "Kirkcaldy Dental & Implant Clinic is opening soon at 23–25 Tolbooth Street. Joining this list does not register you with the practice yet – we'll contact you before we open. Please sign up here rather than calling in at the practice." |
| Contact fields (prefill) | Full name, Phone (required), Email, **Post code**. Use the prefill Post code field, not a custom question, because duplicating a prefill field breaks the rules ([Meta Help](https://www.facebook.com/business/help/219356599612120); [Meta Help](https://www.facebook.com/business/help/438193446367413)). |
| Q1 (multiple choice) | "How many people would you like to add?" 1 / 2 / 3–4 / 5+ |
| Q2 (multiple choice) | "Who is this for?" Just me / Me and my family / Child or children only |
| Q3 (CHANGE, replaces "registered with a dentist?") | "Where is your current dentist?" In Kirkcaldy / Elsewhere in Fife / Outside Fife / I don't have one / Not sure. Registration in Scotland is "generally lifelong", so "registered?" does not show need ([Dentistry.co.uk, 22 Sep 2026](https://dentistry.co.uk/2026/09/22/nhs-dental-participation-scotland/)). This wording is about location rather than health (our judgement; untested in Meta review). The alternative is to ask it on the call. |
| Never ask | Pain, treatment needed, conditions, or a child's date of birth ([Meta Help](https://www.facebook.com/business/help/219356599612120)) |
| Conditional logic | Off at launch, because Meta says it "may increase your cost per lead" ([Meta Help](https://www.facebook.com/business/help/3373123166040766)) |
| Privacy policy link | The updated policy (see §7) |
| Custom disclaimer (CHANGE wording) | "By submitting, you're asking to join the waiting list for Kirkcaldy Dental & Implant Clinic. Joining does not register you with the practice yet. We'll send an instant confirmation text and email, then call or text you about your request between 8am and 9pm (9am–9pm at weekends). Our privacy policy explains how we use your details and how to complain." People must agree to it to submit, and it cannot be added once the form is running ([Meta Help](https://www.facebook.com/business/help/1550411888622740)). |
| Optional checkbox (unticked, optional) | "Optional: I'd also like news and offers from Kirkcaldy Dental & Implant Clinic by text and email. I can opt out at any time." |
| Completion screen | Headline: "Thanks – you're on the waiting list" (35 characters; the limit is 60). Description: "We've sent a confirmation text and email. We'll be in touch before we open. Joining doesn't register you yet." CTA: **"View website"** linking to a waiting-list FAQ page, not "Call business", so the two callers aren't flooded ([Meta Help](https://www.facebook.com/business/help/179258984144385)) |
| Lead capture AI agent | **OFF** ([Jon Loomer](https://www.jonloomer.com/lead-capture-ai-agent-instant-forms/)) |

**Higher intent or More volume?** Keep Higher intent plus OTP. Callers are the bottleneck, and comparable NHS lists filled within a day ([NHS Somerset](https://nhssomerset.nhs.uk/news/more-than-4500-people-sign-up-for-appointments-at-new-nhs-dental-practice-in-crewkerne/)), so it makes sense to give up some volume for quality (our judgement). If CPL is high and volume is below target after 2 weeks, duplicate the form as "More volume" with required OTP. That version also runs in mobile Stories and Reels. Add it as a new ad on a planned edit day and compare cost per *contacted* lead in the Sheet. Don't run a formal A/B test: at £20/day each half would fall short of Meta's 80% power guidance ([Meta Help](https://www.facebook.com/business/help/290009911394576)).

---

## 4. Creative plan

**How many:** 5–6 ads at launch, one per concept. Each ad holds 4:5, 9:16 and 1:1 versions. Meta suggests "up to 10 creatives per ad set, then keep the top 5" and at least 4 days of testing ([Meta Help](https://www.facebook.com/business/help/188534925073536)). Running too many ads at once can cause "Learning limited" ([Meta Help](https://www.facebook.com/business/help/269269737396981)), so 5–6 is the middle ground at this budget (our judgement).

| # | Concept | Format | Notes |
|---|---|---|---|
| A | Woman in dental chair (existing) | Static + 8s video | Keep it calm and neutral. No close-ups of teeth. |
| B | Mum + daughter (existing) | Static + 8s video | Family angle: "Add the whole family in one sign-up." |
| C | **NEW** text-led graphic | Static | "New NHS dental practice opening soon – Tolbooth Street, Kirkcaldy. Join our waiting list." |
| D | **NEW** the building | Static or 8s video | Real Tolbooth Street exterior or fit-out photo with "Opening soon". No AI-generated interior. |
| E | **NEW** meet the team | 8–15s phone-shot video | Dentist or practice manager speaking to camera. If a dentist is named, show their GDC number and never use "specialist" ([GDC](https://www.gdc-uk.org/standards-guidance/standards-and-guidance/gdc-guidance-for-dental-professionals/guidance-on-advertising)). |
| F | **NEW** "How the waiting list works" | Carousel, 3–5 cards | Opening soon / where we are / who can join / what happens next. Carousels work with Instant Forms but not inside multi-media ads ([Meta Help](https://www.facebook.com/business/help/835561738423867)). |

If concept E isn't ready, launch the other five and add E on the first planned budget-change day, so both edits happen together.

**What to add to Ads A and B**
- A 1:1 crop.
- Video openings: start on a **different first frame from the still**, because thumbnails count towards Creative diversity ([Meta Help](https://www.facebook.com/business/help/2371176336684086)).
- Show the brand and "new NHS dental practice opening soon" on screen within the **first 3 seconds**, with **burned-in captions**. Feed videos should be under 15s and Stories under 10s, so the 8s videos are fine ([Meta Help](https://www.facebook.com/business/help/188534925073536)).
- Keep the top, bottom and sides of 9:16 versions clear. On Reels, if there is a disclaimer, leave the bottom 40% empty. Turn on the safe-zone guardrail ([Meta Help](https://www.facebook.com/business/help/980593475366490)).
- If the people shown are stock or AI-generated, never caption them as real patients ([CAP AdviceOnline](https://www.asa.org.uk/advice-online/dental-general.html)). Don't use AI-generated patients or staff ([ASA, 11 Jun 2026](https://www.asa.org.uk/news/ai-and-deepfakes-four-things-advertisers-need-to-know-before-they-hit-run.html)).

**Copy.** Limits are 125 characters for primary text, 40 for the headline and 25 for the description ([Meta Help](https://www.facebook.com/business/help/223409425500940)). Load 3–5 owner-approved options yourself; don't let Meta's AI generate text.
- Primary 1 (113 characters): "Kirkcaldy's new NHS dental practice is opening soon on Tolbooth Street. Be first in line – join our waiting list."
- Primary 2 (96): "A new NHS dental practice is opening soon in Kirkcaldy town centre. Join our waiting list today."
- Primary 3 (99): "Add the whole family in one sign-up. Join the waiting list for Kirkcaldy's new NHS dental practice."
- Headlines: "New NHS dental practice opening soon" (36) / "Join our waiting list" (21) / "Opening soon on Tolbooth Street" (31). Description: "Kirkcaldy town centre" (21).
- **Use statements, never questions about the viewer.** Avoid "Toothache?", "Embarrassed by your smile?", "Fed up being let down?" and "Lost your NHS dentist?" ([Meta Help](https://www.facebook.com/business/help/2557868957763449); [ASA Pulse](https://www.asa.org.uk/static/645be1e9-39a2-4089-bfda1be49ed03243/Pulse-ReportHealth-Claims-in-Ads.pdf)). One research source thought "Lost your NHS dentist?" was acceptable; we would avoid it.

**Refresh cadence**
- **Weekly review every Monday.** Use Breakdown > Creative > Media and the Dynamic creative element breakdown ([Meta Help](https://www.facebook.com/business/help/1822387965412520)), alongside contact rate by `ad_id` in the Sheet. Don't judge any ad on fewer than 7 days.
- **Refresh trigger:** an ad's CPL reaches 1.5–2× its week-1 baseline, or frequency is rising while CTR falls. This is adapted from Meta's 2× fatigue rule; the thresholds are our judgement. Meta's own fatigue label will not appear, because it only shows for ad sets with one creative ([Meta Help](https://www.facebook.com/business/help/1346816142327858)).
- **How to refresh:** add new concepts through the **Ads Manager creative test**. It takes 2–7 variants, uses up to about 20% of budget and keeps existing learnings ([Meta Help](https://www.facebook.com/business/help/1423851372208214)). Leave the winners running.
- Expect to need **one new concept every 3–4 weeks**, because the catchment is small (estimate).
- Don't reuse Glenrothes images on the same Facebook Page. Meta counts exposures across the whole Page ([Meta Help](https://www.facebook.com/business/help/1346816142327858)).

---

## 5. Budget and scaling

**Capacity maths**
- On any one day Meta can spend up to **175%** of the daily budget, but no more than 7× the daily budget in a week ([Meta Help](https://www.facebook.com/business/help/190490051321426)).
- So aim for an **average of about 45 leads a day**. That way a peak day of 1.75× still fits within 80 calls.
- If the callers don't work every day, use: **target leads per day ≈ (calls per day × calling days per week ÷ 7) × 0.57** (estimate). For example, 80 calls on 5 days gives about 33 a day.
- **Target daily budget = target leads per day × your 7-day CPL**, using lead counts from the Sheet. At £3 CPL that is £135/day; at £6 CPL, £270/day.
- **Real cost** is the budget plus 2%, plus VAT ([Meta Help](https://www.facebook.com/business/help/1238737454289085)). £20/day is about £20.40 plus VAT, or about £24.48 at 20% VAT if it can't be reclaimed. Check that with your accountant (estimate).

| Week | Daily budget | Actions | Move on when |
|---|---|---|---|
| 0 (pre-launch) | £0 | All §6 checks, test leads, sign-offs | Live test lead lands in the Sheet with consent and `ad_id` |
| 1 (days 1–7) | **£20** (any single day can reach £35) | **No edits for 7 days.** Check daily: uncalled backlog, contact rate, out-of-area postcodes. At 48 hours, check placements and that no AI variants appeared. | 7 full days of data |
| 2 | First step on day 8, second on day 11–12, each **up to 2×** | Make creative changes on the same days | Backlog is under one day of calling and CPL is within about 30% of week 1 (estimate) |
| 3 | Keep stepping every 3–4 days towards the target budget | Start the creative test once the budget is at least about £50/day (estimate) | Same as week 2 |
| 4 | **Hold at target** | Compare cost per lead with cost per contacted lead. Start sending CAPI stages if leads exceed 200 a month (§6). | — |

- **Step size.** Meta publishes no threshold. Its example is that $100→$101 is unlikely to reset learning while $100→$1,000 may ([Meta Help](https://www.facebook.com/business/help/316478108955072)). "20% per step" is an industry rule of thumb, not Meta policy. While the ad set is still "Learning limited", a reset costs little, so steps of up to 2× are reasonable early on (our judgement).
- **If £20/day already produces more than about 45 leads a day,** reduce the budget rather than pausing again and again.
- **Cost per result goal:** only consider it at 50–100 or more leads a week with a stable CPL. Set it 10–20% above the average. It "may spend less than your full budget", and changing bid strategy is a significant edit ([Meta Help](https://www.facebook.com/business/help/272336376749096)).

**Throttling to 2 callers**
1. **Size the budget to capacity.** This is the main control.
2. **Automated rule at campaign level:** "leads today ≥ 70 → turn off campaign", plus a scheduled rule that turns it back on each morning. Rules check every 30–60 minutes, so set the cap about 10% below capacity ([Meta Help](https://www.facebook.com/business/help/192277077825914)). Pauses shorter than 7 days are not significant edits ([Meta Help](https://www.facebook.com/business/help/316478108955072)).
3. **Backlog alarm in the Sheet:** if uncalled leads exceed one day of calling, the script emails the owner. It could also pause the campaign through the Marketing API, but that needs an `ads_management` token.
4. **Budget scheduling for planned pushes.** A scheduled increase "won't prompt the delivery system to enter a learning phase". Limits: up to 8× the daily budget, windows of at least 3 hours, 50 periods per campaign ([Meta Help](https://www.facebook.com/business/help/633318028866693)).
5. **Holding message:** when the list is paused, put a short notice on the website and the Facebook Page. Somerset paused its portals the same way ([NHS Somerset](https://nhssomerset.nhs.uk/news/more-than-4500-people-sign-up-for-appointments-at-new-nhs-dental-practice-in-crewkerne/)).
6. **Christmas.** Q4 auction prices are higher ([Meta Q3](https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Third-Quarter-2026-Results/)). Scaling after Christmas may be cheaper (inference). Cut the budget when callers are off; a pause of 7 days or more restarts learning ([Meta Help](https://www.facebook.com/business/help/316478108955072)).

---

## 6. Lead handling & tracking

**Polling or webhooks? KEEP polling for now, but harden it.** Webhooks also arrive "with a delay of up to a few minutes" ([Meta developers](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving)), so a 1-minute poll is no slower. Whether Apps Script works reliably as a webhook endpoint is unverified.

**Apps Script fixes (before launch)**
- [ ] **Pin the API version to v26.0 or v27.0.** Use v27.0 if the Meta app was created on or after 4 Nov 2026 ([Meta developers blog](https://developers.facebook.com/blog/post/2026/11/04/introducing-graph-api-v27-and-marketing-api-v27/)). Marketing API v24.0 ends on **10 Nov 2026**, and calls after that "may fail or be upgraded" ([changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog); [versioning](https://developers.facebook.com/docs/marketing-api/overview/versioning)).
- [ ] Request `fields=created_time,id,ad_id,form_id,field_data` **and `custom_disclaimer_responses`**. The marketing-consent tick is **not** in `field_data` ([Meta developers](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving)). If the bulk edge doesn't return it, make a separate call per lead.
- [ ] Filter on `time_created GREATER_THAN` the last timestamp seen, dedupe on lead id, and run a full re-sync nightly. Parse the ISO `created_time`; don't use `date_format` ([Meta developers](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving)).
- [ ] **Handle the rate limit.** It is 200 × 24 × the number of leads in the past 90 days, so a brand-new Page may have a very low allowance at first. Back off and send an alert on any Graph error ([Meta developers](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving)).
- [ ] **Run the script under Google Workspace, not Gmail.** Gmail allows 90 minutes of trigger runtime a day (so each run must average under 3.75 seconds) and only 100 email recipients a day. Workspace allows 6 hours and 1,500 recipients ([Google](https://developers.google.com/apps-script/guides/services/quotas)). Exit straight away when there are no new leads, and log run times.
- [ ] **Meta app:** it must be Live, with App Review passed for `leads_retrieval` and `pages_manage_ads`, and Business Verification done. In Development mode it only sees leads from people with a role on the app ([Meta developers](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/)). **Test with a real lead from someone with no role on the app.**
- [ ] **Token:** a long-lived Page token belonging to someone who can advertise on both the ad account and the Page ([Meta developers](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving)). That person must be listed under Leads Access ([Meta Help](https://www.facebook.com/business/help/540596413257598)).
- [ ] **Meta deletes leads after 90 days,** so the Sheet is the master record. Keep a weekly protected copy ([Meta Help](https://www.facebook.com/business/help/734933888443065)).

**Sheet columns:** lead_id, created_time, form_id + form version, ad_id, contact fields, Q1–Q3, marketing consent (true/false + disclaimer version), phone_number_verified (if the API returns it; unconfirmed), SMS sent at, first call attempt at, attempts, stage (Intake / Contacted / Confirmed household / Registered / Not reachable / Out of area / **Do not contact**), caller. No clinical notes in free text (our judgement).

**Follow-up standard**
- First call attempt within **5–15 minutes** during calling hours, with overnight leads at the front of the morning queue. The evidence for speed is directional: a 2007 vendor study found calling within 5 rather than 30 minutes raised contact odds about 100× ([Digital Applied, updated 5 Nov 2026](https://www.digitalapplied.com/blog/speed-to-lead-response-time-benchmarks-2026-data-playbook)).
- Make 3 attempts over 48 hours, then send an SMS. This comes from a vendor ([Viva](https://www.getviva.ai/lead-response-time-statistics-dental-2026/)).

**Sending lead quality back to Meta (phase 2, from about week 4)**
- **Fit criteria:** at least 200 leads a month, a daily upload, and a target stage reached within 28 days by 1–40% of leads. Each event carries `event_name` = stage, `action_source=system_generated`, `user_data.lead_id`, `custom_data.event_source=crm` and `lead_event_source`. Send every stage, including the first lead stage ([Meta developers](https://developers.facebook.com/docs/marketing-api/conversions-api/conversion-leads-integration)).
- **Target stage:** use "Confirmed household". "Call answered" will probably exceed 40%, and "Registered" may happen more than 28 days after sign-up if registration only opens at opening.
- **Lowest-effort route:** Meta's own Google Sheets connection, which adds a `lead_status` column that callers update ([Meta Help](https://www.facebook.com/business/help/1095577538573756)). Use a dedicated Google account, and don't run it alongside a hand-coded sender.
- **Guardrails:** send only the lead_id and the stage. First check Events Manager for a "Health and wellness" data-source category, which can restrict events ([Meta Help](https://www.facebook.com/business/help/511197658391698)). Expect about a month before results show; then test the qualified-leads goal in a new campaign ([Meta Help](https://www.facebook.com/business/help/782657799338685)).

**Reporting:** report **cost per contacted lead and cost per registered patient** from invoices or Billing & payments, because Ads Manager leaves out the 2% fee and VAT ([Meta Help](https://www.facebook.com/business/help/1238737454289085)).

---

## 7. Compliance checklist

**Meta policy**
- [ ] Minimum age 18 is set; no inferiority statements; no time-bound promises ([Meta Transparency](https://transparency.meta.com/en-gb/policies/ad-standards/restricted-goods-services/health-wellness)).
- [ ] No questions that imply anything about the viewer's health ([Meta Transparency](https://transparency.meta.com/en-gb/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/)).
- [ ] Form asks nothing about health and has no child date of birth ([Meta Help](https://www.facebook.com/business/help/219356599612120)).
- [ ] All Advantage+ enhancements, text generation, "Test new creative features" and the lead AI agent are **off**. Re-check after every edit or duplication ([Meta Help](https://www.facebook.com/business/help/620917123959992)).

**ASA / CAP / consumer law**
- [ ] **KEEP** the bans on "limited places" and "first come first served". False time-limited claims are banned in all circumstances under DMCCA Sch 20 para 7 ([legislation.gov.uk](https://www.legislation.gov.uk/ukpga/2024/13/schedule/20)).
- [ ] Never imply that the NHS endorses the clinic (para 4). Don't seed or incentivise reviews (para 13).
- [ ] Make it obvious this is a *waiting list*, not registration and not quick access. The ASA upheld complaints against "See an NHS GP in minutes" ([ASA Babylon ruling, 2018](https://www.asa.org.uk/rulings/babylon-healthcare-services-ltd-a18-439274.html)).
- [ ] Only use demand figures your records support. The Glenrothes figures total **4,985**, so "over 5,000" would not be supported ([CAP Code s12](https://www.asa.org.uk/type/non_broadcast/code_section/12.html)).
- [ ] No "let down" or "embarrassed" framing, and no star-rating claims ([ASA Pulse](https://www.asa.org.uk/static/645be1e9-39a2-4089-bfda1be49ed03243/Pulse-ReportHealth-Claims-in-Ads.pdf)).
- [ ] Anything Meta's AI produces is your responsibility ([ASA, 11 Jun 2026](https://www.asa.org.uk/news/ai-and-deepfakes-four-things-advertisers-need-to-know-before-they-hit-run.html)).

**GDC** ([guidance](https://www.gdc-uk.org/standards-guidance/standards-and-guidance/gdc-guidance-for-dental-professionals/guidance-on-advertising))
- [ ] Show the GDC number wherever a dentist is named. Never use "implant specialist" or "specialising in implants".
- [ ] The website linked from the form shows the address, contact details, a GDC link, the complaints procedure and a last-updated date.
- [ ] Publicity must state whether the practice is NHS, mixed or wholly private. **If implants will be private, the practice is "mixed"; confirm the wording.**

**NHS Scotland / NHS Fife**
- [ ] No NHS logo without consent. No "NHS" in the Page name, Instagram handle or SMS sender ID. Don't mislead about which services are NHS-funded, so keep implant promotion out of this campaign ([NHS Scotland Brand Policy](https://policyonline.nhslothian.scot/wp-content/uploads/2026/07/NHS-Scotland-Brand-Policy.pdf)).
- [ ] **Get written confirmation that the dentists are on, or provisionally on, the NHS Fife dental list before "NHS" copy runs.** Provisional listing lasts at most 6 months ([SSI 2025/380](https://www.legislation.gov.uk/ssi/2025/380/made)). Tell the Fife Dental Advice Line (01592 226555) when registration opens ([NHS Fife](https://nhsfife.org/services/all-services/dental-service)).

**PECR / ICO / UK GDPR**
- [ ] Confirmation SMS, email and calls stay **purely administrative**: no offers and no implant or whitening promotion. Allay Claims was fined £120k for marketing "under the guise of service updates" ([ICO via WiredGov, 20 Jan 2026](https://www.wired-gov.net/wg/news.nsf/articles/Fines+of+225000+for+nuisance+marketing+messages+20012026162000?open=)).
- [ ] Marketing goes only to people who ticked the box. Don't rely on the soft opt-in: the new soft opt-in is for charities only ([SI 2026/82](https://www.legislation.gov.uk/uksi/2026/82/made)), and legitimate interests does not replace consent for marketing SMS or email ([DMA, 1 Apr 2026](https://www.dma.org.uk/about/articles/ico-updates-legitimate-interests-guidance-after-duaa-changes)).
- [ ] Calls show a number people can call back. Callers give their name, the practice and the reason for the call at the start. No pitching of private treatments on these calls ([ICO live calls](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-live-calls/what-are-the-rules-on-live-direct-marketing-calls/); [Recording Law](https://www.recordinglaw.com/news/ico-elderly-aids-nuisance-calls-pecr-fine)).
- [ ] A "Do not contact" status is checked before any SMS, email or call. No bought-in lead lists ([ICO, 8 Jul 2026](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/07/two-home-improvement-companies-fined-370-000-for-nuisance-calls-targeting-vulnerable-people/)).
- [ ] Call 8am–9pm on weekdays and **9am–9pm at weekends**. This is the DMA Code (industry practice, not law), and Sunday calling should be limited ([Call Centre Helper](https://www.callcentrehelper.com/regulations-on-outbound-calling-times-207054.htm)).
- [ ] **SMS:** register a brand-specific Alpha Tag such as "KirkDental". Recipients can't reply to an Alpha Tag, so put the practice phone number in the text. Any marketing SMS needs "free message" and a STOP opt-out ([ClickSend](https://help.clicksend.com/en/articles/43642-united-kingdom-44)). Avoid shortened links ([ISPreview](https://www.ispreview.co.uk/index.php/2026/07/ofcom-introduce-new-uk-rules-to-tackle-mobile-messaging-scams.html)).
- [ ] **Privacy policy** includes a complaints route, a 30-day acknowledgement and how to escalate to the ICO ([Bratby](https://bratby.law/data-protection-complaints-duaa-controllers-june-2026/)). It names an Article 6 basis and an Article 9 condition, because waiting-list data may count as health data (risk flag; [Recital 35](https://gdpr-info.eu/recitals/no-35/)). Restrict access to the Sheet, and don't upload the list to Meta as an audience without legal advice.

**Risky items in the current plan**

| Plan item | Risk | Fix |
|---|---|---|
| Disclaimer says texts and calls 8am–9pm, but the SMS fires instantly at any hour | Disclaimer contradicts what actually happens | Use the reworded disclaimer (§3) |
| SMS says "we'll call you very soon" | Promise broken if volume exceeds callers; Somerset lists took months to work through ([NHS Somerset](https://nhssomerset.nhs.uk/news/its-already-making-a-big-difference-guests-gather-for-ceremonial-opening-of-somersets-latest-nhs-dental-practice/)) | "Kirkcaldy Dental: you're on our waiting list. This doesn't register you yet. We'll call or text to confirm your details. Questions? 01592 XXXXXX" (144 characters) |
| Calls from 8am at weekends | Breaches DMA best practice | Start at 9am at weekends |
| Marketing consent box | Script doesn't capture it, so there is no consent record | Add `custom_disclaimer_responses` |
| "Registered with a dentist?" | Health-data risk and gives little insight | Replace with Q3 (§3) |
| Default conversion location | Website leads missed by the script | Instant forms only |
| Advantage+ creative and AI agent | AI could produce "accepting NHS patients" | Switch all of it off |
| "Kirkcaldy Dental & **Implant** Clinic" alongside NHS messaging | Could imply implants are NHS-funded; GDC "mixed" status | No implant content in these ads; confirm the NHS or mixed wording |
| "Be first in line" | Misleading if list order doesn't decide contact order (our judgement) | Use it only if contact really follows sign-up order |
| Glenrothes inside the radius | Auction overlap; same-Page fatigue | Kirkcaldy postcodes only |

---

## 8. Benchmarks to judge success

*No NHS or UK Meta lead-ad benchmark exists. Everything external below is US or private-practice data, or comes from vendors.*

| Metric | External reference | Our working target |
|---|---|---|
| CPL | US dental **$61.56 (about £47)**; all industries $27.39 ([LocaliQ, Sep 2026](https://localiq.com/blog/facebook-advertising-benchmarks/); [PPC Land, 14 Sep 2026](https://ppc.land/facebook-lead-costs-hold-at-27-39-as-traffic-clicks-drop-to-0-60/)). UK private new-patient exam £10–£25, from an agency's own clients ([Upscale, 5 Oct 2026](https://upscaleleadmarketing.co.uk/blog/uk-cost-per-lead-benchmarks)) | **Estimate:** under £10 is good for a free NHS list; investigate above £15. Set your real baseline after about 50 leads. |
| CPL to exit learning at £20/day | About 50 leads a week ([Meta Help](https://www.facebook.com/business/help/269269737396981)) | £2.80 or less |
| CTR | Dental 1.62%; all industries 2.70% ([LocaliQ](https://localiq.com/blog/facebook-advertising-benchmarks/)) | 1.6% or more |
| Click-to-lead | Dental 6.07%; all industries 8.54% ([LocaliQ](https://localiq.com/blog/facebook-advertising-benchmarks/)) | Track it; Instant Forms are likely higher (estimate) |
| Contacted | Illustrative 70% ([Dentistry.co.uk, sponsored](https://dentistry.co.uk/2025/12/10/why-more-leads-wont-grow-your-dental-practice/)); a vendor says 60–70% of leads are never reached with manual follow-up ([Viva](https://www.getviva.ai/lead-response-time-statistics-dental-2026/)) | 80% or more within 48 hours (estimate) |
| Lead to booking | 20–35% with structured follow-up vs 5–10% without; low-quality data ([WebTonic](https://www.webtonic.io/blog/dental-facebook-ads-statistics)) | Measure "Confirmed household", then "Registered" |
| Attended | 80% illustrative ([Dentistry.co.uk, sponsored](https://dentistry.co.uk/2025/12/10/why-more-leads-wont-grow-your-dental-practice/)) | Measure after opening |
| Demand | Crewkerne: more than 4,500 in one day ([NHS Somerset](https://nhssomerset.nhs.uk/news/more-than-4500-people-sign-up-for-appointments-at-new-nhs-dental-practice-in-crewkerne/)). Chard about 8,000, Wellington more than 4,000 ([NHS Somerset](https://nhssomerset.nhs.uk/news/new-somerset-dental-practices-to-provide-nhs-care-for-up-to-20000-more-people/)). A new Fife practice passed 3,000 ([Central Fife Times, 30 Jan 2026](https://www.centralfifetimes.com/news/25813106.fife-nhs-dentist-access-shows-slight-improvements/)) | Expect the list to fill faster than callers can work through it |
| List size | If SDAI-funded: 1,500 patients per grant-aided surgery within 12 months ([Scottish Dental](https://www.scottishdental.nhs.scot/dental-team/workforce-education-and-training/scottish-dental-access-initiative-sdai/)) | For example, 4 surgeries = 6,000 |

---

## 9. Open questions / unverified

- Are the dentists on, or provisionally on, the NHS Fife list? Is there an SDAI grant? Will the practice be NHS-only or mixed?
- Does the Higher intent form still deliver to Feed only now that Advantage+ placements are forced? Meta's page is undated; check the preview and the 48-hour placement breakdown.
- Is phone OTP pre-ticked in this account? Is the "optional" OTP setting (Marketing API v27) offered to UK accounts in Ads Manager?
- What is the lead-retrieval rate limit for a Page with zero leads?
- Does the bulk `/{form-id}/leads` edge return `custom_disclaimer_responses`? Is `phone_number_verified` returned at all?
- Do leads endpoints follow the Marketing API or Graph API expiry dates? When was the Meta app created?
- Is the Apps Script running on Gmail or Workspace? Are data processing agreements in place with Google and ClickSend? What are ClickSend's Alpha Tag fees?
- Will Meta review accept Q3 ("Where is your current dentist?")? Is waiting-list data special category data? There is no ICO source.
- Will Meta put the practice's dataset in the "Health and wellness" data-source category for the UK?
- Is Advantage+ image-text rewriting on by default for Leads? Is the lead AI agent on by default? Does the Creative diversity column appear for Leads campaigns?
- Does dayparting work with a daily budget? Meta's pages conflict. What is the minimum daily budget in GBP?
- Is "Reach more people likely to respond" pre-ticked in the UK interface? The source saying so is from March 2025.
- Is the Glenrothes practice advertising, and from the same Page or ad account?
- Which days do the callers work, and is there cover over Christmas?
- Are the Ad A and Ad B images stock or AI-generated?
- What does the current text of Meta's 22 Jul 2026 Health & Wellness change say for dental services? Has the ICO published its redrafted direct-marketing guidance? What is the outcome of the GDC framework consultation?
- Meta's Commercial Terms change, paused on 5 Nov 2026, was reported by ppc.land on 8 Nov 2026. No URL was in the research pack.
- **Unverifiable, not relied on:** reports of 14,000 sign-ups in Bridlington and 6,000 places at Castlebank (Dumfries); vendor claims that OTP or Higher intent cut volume by 20–40%.

---

## Top 10 actions

1. Get written confirmation from NHS Fife that the dentists are on, or provisionally on, the dental list, and settle the NHS-or-mixed wording, before any "NHS" ad runs.
2. Today: move the Apps Script to API v26.0 or v27.0 (v24.0 ends on 10 Nov), add `ad_id`, `form_id` and `custom_disclaimer_responses`, and run it under Google Workspace.
3. Confirm the Meta app is Live with App Review and Business Verification, and the token holder is in Leads Access; then test with a real lead from someone who has no role on the app.
4. Build one Advantage+ leads campaign: Instant forms only, "Maximize number of leads", Highest volume, one ad set, £20/day campaign budget.
5. Untick "Reach more people", target Kirkcaldy by pin or postcodes, set minimum age 18, add no interests, and check for overlap with Glenrothes.
6. Build a Higher intent form with required OTP, the Post code prefill, multiple-choice questions and the reworded disclaimer and completion screen, and get the owner's sign-off before publishing.
7. Turn off every Advantage+ creative enhancement, the generated variants, "Test new creative features" and the lead capture AI agent, and add the banned phrases as restricted words.
8. Launch 5–6 distinct concepts on day one (A, B, text graphic, building, team video, carousel) in 4:5, 9:16 and 1:1, then make no edits for 7 days.
9. Set the throttles: budget of about 45 × CPL, a campaign rule that pauses at about 70 leads a day, a backlog alarm in the Sheet, and budget steps made all at once, 3–4 days apart.
10. Keep follow-up compliant: admin-only SMS with the practice number, a call script where callers identify themselves, 9am weekend starts, a "Do not contact" column, and a privacy policy with a complaints route.