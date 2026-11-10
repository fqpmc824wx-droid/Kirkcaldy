# Kirkcaldy Dental: final launch risk plan (8 Nov 2026)

**For:** the owner, the ads chat, the leaflet chat, the website chat and browser Claude. BRAND.md now lists five chats, so the metrics and waiting-list chats should read this too.

## Read this first

The owner asked for a plan where nothing can go wrong. No plan can promise that. Meta can reject an ad, a bank can decline a card, and a caller can get ill. What this plan can promise is three things you can check:

1. **Nothing important fails without a named person being told quickly.** Most checks alert within 5–15 minutes. The slowest alert the next morning.
2. **Every alert reaches a phone or inbox that someone reads, and says what to do.**
3. **Every likely failure has a written fix (section 5) that someone other than the owner can follow.**

Risk can be reduced and caught fast. It can't be removed. In this plan, "covered" means protected, watched and tested. It never means "can't happen".

**Where things stand (checked 8 Nov, about 22:10):**
- **`main` is out of date (5da6217).** Its lead script still calls Meta's v21.0. `meta-ads.gs` and `tracking.gs` aren't on it.
- **The ads branch (a00e460)** has the v27 lead script and `meta-ads.gs`.
- **The leaflet branch (2441aab, 22:01)** has the website script and the new `tracking.gs`: call outcomes, SMS log, daily delivery reports, and an email when ClickSend credit drops below £10.
- **No pull request takes the ads branch into `main` yet.** A test merge of every branch went through with no conflicts.
- **The live Waiting List sheet:**
  - 44 columns (A–AR) and 11 tabs;
  - shared with info@ only, so the caller can't open it yet;
  - no protected ranges;
  - time zone Etc/GMT instead of London.
- **The domain still points at the Squarespace parking page.** DKIM is on, DMARC is missing, MX and SPF are fine.
- **The GitHub repo is public.**
- **Nothing has been pasted into the live Apps Script project yet.** So no row below is "covered" today.

---

## 1) Top 15 risks and what protects us

| # | What could go wrong | What protects us | Ready? |
|---|---|---|---|
| 1 | Setup night uses old code. `main` still has the old lead script, with no ad checks and no call tracking. | Merge everything into `main` first and paste only that version. The daily check prints the version number. | Not yet |
| 2 | Facebook leads stop reaching us and nobody notices. Causes: an expired token, a missing permission, a new form, or real leads hidden from our app. | Before the ads go live, someone with no role on the Page sends a real test lead. Every hour, a check confirms each Meta lead is in the sheet. An outside "heartbeat" service emails and pushes to your phone if the checker goes quiet. | Not yet |
| 3 | Alerts go only to info@, which nobody watches closely. | Critical alerts go by SMS to your phone and by email to your personal address. A daily "all OK" email means silence gets noticed. | Not yet |
| 4 | The caller can't keep up, or is off. | Budget stays at £20–25/day until there's a second caller. Alerts fire when a lead has waited 2 hours, when no calls are logged, or when the overnight list isn't done by 10am. A named, trained backup caller. | Partly |
| 5 | The caller says the wrong thing, or mishandles someone in pain. | A one-page call card with the banned phrases and the urgent route (NHS 24 on 111), approved by you before the first call. You listen to 5 calls a week for the first 4 weeks. | Partly (draft exists) |
| 6 | Texts stop: ClickSend credit, the card, or the sender name. | Auto top-up. Credit checked 4 times a day. Delivery of every text checked. The caller can work from the sheet without texts. | Partly |
| 7 | Website and QR sign-ups are lost while the page still says "Thank you". | No leaflets or banner until a test sign-up appears as a row. An hourly check of the page and its sign-up link. The page will show an error instead of a false thank-you. | Not yet |
| 8 | Someone who said "stop" is contacted again, or a promotion goes to people who didn't opt in. | DO NOT CONTACT is set the same day. Checks catch "stop" notes that aren't marked DNC, and any text sent to a DNC number. Offers go only to people who ticked "Yes", and never from the ClickSend dashboard. | Partly |
| 9 | The legal wording is wrong: the website consent box is bundled, and the privacy page still names Zapier. | Privacy page fixed before the ads. Consent box fixed before the leaflets. Both are checked automatically every day. | Not yet |
| 10 | The "new NHS practice" claim or the opening date isn't backed up, or the date slips. | The NHS Fife letter is on file before any ads or printing. "Be first in line" stays only if you sign the priority rule. The budget follows the weeks left until opening. A date-change message is ready. | Not yet |
| 11 | An ad is rejected, the card is declined, or the Page or ad account is restricted. | An hourly ad check (rejected, stopped, unpaid, overspent, unknown campaign). A backup card. A second admin. Written fixes R1, R2 and R10. | Partly |
| 12 | The sheet is broken or rows are deleted. | The header row and script columns are locked. A check every 5 minutes stops the scripts before they misfile anything. A nightly backup raises an alarm if rows go missing. | Not yet |
| 13 | An account is hacked or data leaks: public repo, shared logins. | Two-step verification on every account. Repo made private. Sheet shared by name only. Callers use their own logins. A breach procedure. | Partly |
| 14 | You are the only person who can fix anything. | A named deputy with budget rights and script access. A second admin on every account. Backup codes in the clinic safe. A one-page "manual mode" card. | Not yet |
| 15 | Black Friday and Christmas: higher costs, the caller away, hundreds of people waiting. | No budget rises from 25 Nov to 2 Dec. By 1 Dec, festive cover is chosen or the ads drop to £5–10/day. Holiday wording for the texts. | Not yet |

---

## 2) Full risk register (merged, with the critics' additions)

**Status:**
- **covered** = on `main`, live, and passed its fire drill (section 3.6);
- **partly** = built on a branch, or only part of it exists;
- **gap** = nothing in place.

**Scoring:**
- Likelihood H/M/L = 3/2/1; Impact S(evere)/Ma(jor)/Mi(nor) = 3/2/1; score = L×I.
- Rows 1–78 keep their old numbers so earlier references still work.
- Rows 79–105 are new: from the two critics (M1–M22, plus their smaller items) and from the final check (F).

**Labels used in the table:**
- **H1–H24** are the automatic checks in section 3.
- **R1–R10** are the runbooks in section 5.
- **S1–S15** are the shared safeguards below.

### Corrections applied to the 8 Nov register
- **Baseline moved:**
  - The ads branch is at a00e460 and now holds the META_API_VERSION fix, dedupe, the ID columns and `meta-ads.gs`.
  - The leaflet branch is at 2441aab and now holds `tracking.gs`.
  - None of it is on `main`.
- **S4 / row 30:** an ad watchdog already exists (`adsStatusCheck`: every 2 h, calling hours only, emails info@).
- **Row 22:** the shared functions are now identical between the ads and leaflet branches. The real risk is pasting from `main` (row 79).
- **Row 34 is not covered.** A website row can receive a Meta lead's SMS and email status (see row 34).
- **Row 62:** the runbook now targets postcodes KY1–KY5, "living in", with EH and KY6–8 excluded.
- **Row 72:** DKIM is published. Only DMARC is missing.
- **Triggers:**
  - There are 13 today (4 lead, 3 ads, 6 tracking) and 17 once the health checks are added, not "exactly 4".
  - Apps Script allows 20 per user per script.
- **Row 9:** "caller,backup" with rotate sends half the leads to the absent caller. Use the backup's number only.
- **BACKLOG_ALERT:** the runbook table says 10, but its Step 6 test resets it to 15. Delete the "back to 15" line.
- **S6 Status list:** use the runbook's 10 values, which the code already writes. `tracking.gs` counts attempts in "Call attempts", so "No answer 1/2/3" isn't needed.
- **Row 11 and the Status/Call outcome clash:** solved once `tracking.gs` is pasted. Choosing "DO NOT CONTACT" in Call outcome sets Status to DNC.
- **healthNotifyOnce:** it records the alert as sent before sending it, so one failed send silences that alert for 3 hours. Fix: send first, record after.
- **Testing Tool leads:**
  - They are organic (no ad_id), so they don't test the ad-account permission.
  - They come from an admin, so they don't test App Review or access levels either.
- **Row 48:** making email optional on the page before the server accepts it would lose every phone-only sign-up without trace.
- **Rows 51 and 56:** an automatic admin-count check would need `business_management`, which row 51 removes. Keep the admin check manual.

### Shared safeguards
| Code | Safeguard | Built by | Status |
|---|---|---|---|
| S1 | Escalation routing: HEALTH_EMAIL (owner's personal address first, info@ as a copy, the deputy once named) and HEALTH_SMS (owner, critical alerts only). Gmail filter in info@: forward mail from apps-scripts-notifications@google.com to the owner. Alert subjects start "[KD-P1]" or "[KD-P2]", not emoji. | ads chat, browser Claude | gap |
| S2 | Outside dead-man's switch on healthchecks.io: "poller" (5 min, grace 15), "daily" (1 day, grace 2 h), "backup" (1 day, grace 3 h). Alerts go to the owner's personal email plus a push channel (Telegram, Signal or ntfy). This is H1. | ads chat, browser Claude | gap |
| S3 | Meta reconciliation by exact lead IDs and Meta's own counts (H8–H10). | ads chat | partly (next-day count in meta-ads.gs) |
| S4 | Ad watchdog (H12) plus Meta Automated Rules. | ads chat, browser Claude | partly |
| S5 | Outside site monitors (UptimeRobot or similar, every 5 min) plus H16 and H17. | browser Claude | gap |
| S6 | Sheet hardening: protect row 1, the Dashboard and the script-written columns. The 10-value Status list. A "To call" filter view, and callers never use "Sort sheet". Phone column as plain text. H4 runs before every script run. DNC fails closed. | leaflet chat, ads chat | gap (live: row 1 frozen, nothing protected) |
| S7 | A protected Suppression tab (phone, last 10 digits, email, date, channel), kept even after erasure, and checked by both scripts. | leaflet chat, ads chat | gap |
| S8 | Lead identity and dedupe (Lead ID, Form ID, Ad ID, Logged at). | ads chat, leaflet chat | partly (both branches) |
| S9 | Call stamps (attempts, first call, last attempt, next call due, Call log tab). | leaflet chat | partly (`tracking.gs`, 2441aab) |
| S10 | Daily numbers (Daily log tab, 21:10) and the 9pm report additions. | leaflet chat, ads chat | partly |
| S11 | Call card and FAQ, owner-approved: who's calling and why, approved answers, banned phrases, the urgent route, no health details in Notes, "stop" = DNC, calls 08:00–20:45, voicemail script. | waiting-list chat drafts (its playbook §2), owner approves | partly (draft only) |
| S12 | LEAD_TEXT_MODE wording: normal / delayed / list-only / holiday. | ads chat, leaflet chat | gap |
| S13 | Control sheet (no secrets) listing every account, its admins, where the two-step codes are, renewal dates, Form IDs, the deployment ID, VERSION and the API expiry date. Passwords in a password manager shared with the deputy. | owner, browser Claude | gap |
| S14 | A named deputy and 1–2 trained, UK-based backup callers. | owner | gap |
| S15 | Code hygiene: paste only from the agreed `main` commit. After every paste: Save → selfTest → New version → one test lead and one web sign-up. | all chats | partly |

### A. Facebook/Instagram lead pipeline
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 1 | Graph API version: `main` pins v21.0. Meta's rule is that an app can call the version that was current when it was created, or newer, so the app made on setup night needs v27.0. v21.0 is removed on 21 Jan 2027. | H×S=9 | Merge the ads branch (metaGraph(), default v27.0). Send Testing Tool leads with the box ticked and unticked. Put the version's expiry in S13. | H2, H18 (checks the facebook-api-version header) | R3 step 5 | ads chat | partly |
| 2 | A new or duplicated Instant Form isn't read. Any change creates a new Form ID. A new form is read only from "now − 1 h", so its earlier leads are lost. | H×S=9 | Final wording before the first publish. All section-11 changes in one duplicate. Date in the form name. New IDs start from the form's created_time (code change). | H10, H8, H9 | R3 steps 6 and 9 | ads chat, browser Claude | partly |
| 3 | Leads stop arriving: error 190, 10/200, rate limits, a Meta outage, deleted triggers, or a blank token or Form ID (the script returns silently). | M×S=6 | System User token that never expires. Assign the Page, the app and the ad account. Leads access includes the app and the System User. Replace the silent return with an alert. | H1, H2, H3, H8, H9, H11 | R3 | ads chat, browser Claude | partly |
| 4 | Failed leads are lost: the `finally` block marks a failed lead as seen, and only the first failure in 3 h is emailed. | M×Ma=4 | Don't mark a failed lead seen. Retry for 2 runs. Then write it to a "Failed leads" tab and send a P1 alert for each one, no throttle. | H15, H8 | Failed leads tab → add the person → the caller rings them first | ads chat | partly |
| 5 | Late or pre-install leads missed (15-min overlap, start at now − 1 h). | L×Ma=2 | Publish the ads only after an end-to-end test. | H8 (26-hour ID comparison) | R3 step 9 | ads chat | partly |
| 6 | Reworded questions leave answers in blank columns (substring matching). | M×Mi=2 | Copy the questions word for word. Write unmatched answer keys to Notes. | H18: today's Meta rows with a blank Postcode or No. of People | Update the field() keys and backfill from the CSV | ads chat | partly |
| 80 | (new, M2) **Real leads are invisible while test leads work.** Lead retrieval may need App Review for leads_retrieval and pages_manage_ads, then Business verification. Standard Access only sees people with a role on the app. Meta's yearly Data Use Checkup, if missed, restricts the app. | M×S=6 | The runbook's "Real lead (no app role)" test becomes a hard gate before the ads publish. Submit App Review and Business verification if Meta asks. Checkup due date in S13. | H9 (Meta's own count against the sheet) | Manual mode: Business Suite notifications, Leads Center CSV every 2 h, thank-you texts by hand. Or keep the ads unpublished. | browser Claude, owner, ads chat | partly |
| 84 | (new, M6) The leads request now asks for ad and campaign fields. If the token can't see the ad account (ads_read removed, System User unassigned, a group ad account used as Plan B), Meta may refuse the whole call and all intake stops. Not tested. | M×S=6 | On setup night, test once with a token that lacks ads_read. Add a META_LEAD_FIELDS property so the ad fields can be dropped. | H2, H9 | Set META_LEAD_FIELDS to the core fields, then poll again | ads chat | gap |
| 102 | (new) The phone verification code on the Higher-intent form fails on some networks, and leads are lost without trace. | L×Ma=2 | Use optional verification if Meta offers it for the account. | Weekly: form opens → leads conversion drops by more than half → P2 | Turn verification to optional (this makes a new form; see row 2) | ads chat | gap |

### B. Calling operations and capacity
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 7 | No approved call script. The caller improvises: banned phrases, a private-care pitch, deposits, health details in Notes. | H×S=9 | S11 from the waiting-list playbook draft (`research/waitlist-playbook.md` §2), approved by the owner before the first real call. 30 minutes of training. The owner listens to 5 calls a week for 4 weeks. | H22 (scan of Notes), H24 (ads live without CALL_CARD_APPROVED → P1) | Remove health details. Send a correcting service text. Refund anything taken. Retrain. DNC if asked. | waiting-list chat, owner | partly |
| 8 | Demand outruns one caller (about 20–25 new leads a day). Expect about 15 a day from Meta at £20, and about 22 a day from all sources in week 1. | H×Ma=6 | Never above £25/day without a second caller (runbook §8). Second-caller triggers. LEAD_TEXT_MODE. The 30-leads rule set to about 1.2× caller capacity. | H5, H7, Daily log | R6 | owner, ads chat | partly |
| 9 | The caller is absent, or alerts are missed. One phone. At week-1 volumes, a 15-lead threshold never fires. A typo in ONCALL_MOBILE is skipped silently. | H×Ma=6 | BACKLOG_ALERT 10 (delete the "back to 15" test line). H3 checks the number. Absence rule: the caller tells the owner and the backup by 07:30. The backup already has sheet access. | H3, H5, H6, H14 | R5 | owner, caller, ads chat | partly |
| 10 | Black Friday (27–30 Nov) and the festive break (bank holidays 25 and 28 Dec, 1 and 4 Jan). | H×Ma=6 | No rises from 25 Nov to 2 Dec. By 1 Dec, named cover for each day, or £5–10/day or a pause from 23 Dec to 4 Jan. Holiday wording. Backlog at 0 by 23 Dec. | H24 reminders (24 Nov, 1 Dec, 22 Dec, 5 Jan). H12: budget above FESTIVE_MAX in those dates → P1 | Original register row 10 | owner, ads chat | gap |
| 11 | Status logged badly or late. | H×Ma=6 | `tracking.gs`: the caller picks Call outcome (column Y); the script sets Status, attempts, timestamps and Next call due, and marks Unreachable after 3 tries. Use the "To call" view. Tag test rows TEST. eveningReport must also count Unreachable, Withdrew, Wrong number and Not interested. | trkDailySnapshot "Rows needing update", H6, H22 | The caller fixes today's rows. The owner searches Notes for stop words → DNC. | leaflet chat, caller | partly |
| 12 | No 01592 number. Withheld or 07 numbers aren't answered. | H×Ma=6 | VoIP 01592 before week 2. Never withheld. All section-11 changes on one day. | H18: "No answer" share over 40% for 3 days → P2 | Voicemail script, then the no-answer service text | owner | partly |
| 13 | Lead data on personal phones, untrained helpers, leavers. | H×Ma=6 | A work SIM or softphone. Confidentiality agreement and training. Group data-sharing agreement. UK-based callers only. Named sharing, no exports. Same-day offboarding. | H23 monthly access email | Original register row 13 | owner | partly |
| 14 | People are called outside 8am–9pm. | M×Ma=4 | Call card: 08:00–20:45 only. VoIP time limits if available. | H22: any Call log attempt before 08:00 or after 21:00 | Apology, log, retrain | owner, caller | partly |
| 89 | (new, M11) Rows added by hand are invisible to the automation. Text-only dates, "p:" or "l:" prefixes from Meta's CSV, no DNC check, no text. | H×Ma=6 | A "Manual add" menu that goes through the same handler. Never paste a raw CSV into Waiting list. | H18: text dates, "l:" IDs, "p:" phones → P2 | Fix the rows | leaflet chat | gap |
| 93 | (new, M15) Dedupe on phone OR email merges different people: households, carers. A DNC blocks the whole household. Someone who re-joins after a DNC gets nothing and no one is told. | H×Ma=6 | Mark Duplicate only when the name and the contact both match; otherwise "Same household", with an alert. DNC applies to the person. A re-join after DNC goes to the owner. | 9pm counts of Duplicates whose name differs, and of re-joins after DNC | Review the rows | leaflet chat, ads chat | gap |
| 94 | (new, M16) Two callers ring the same overnight leads. REPEAT alerts go to the wrong caller. | H×Mi=3 | morningSummary splits the Call 8am rows between callers. REPEAT goes to the original "Assigned to". | Call log: two callers on one row within 30 min | Before the second caller starts | ads chat | gap |
| 95 | (new, M17) The calling number gets labelled "spam" or barred. | M×Ma=4 | Register the 01592 number with caller-ID services. Pace the calls. Add the number to the confirmation email. | Row 12 no-answer alert. Weekly lookup on Truecaller and Hiya. | Register or appeal the number | owner | gap |

### C. Patient safety
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 15 | People in urgent pain. Red flags missed, advice given, health details in Notes. | H×S=9 | The Meta form's completion screen already gives NHS 24 on 111. Add the urgent route to the call card, the reply bank and both confirmation emails. Notes say only "Urgent – signposted". | H22 (health words; count of "Urgent – signposted") | Incident report the same day. A dentist reviews it. Remove the details from Notes. | owner, caller, staff checker | partly |
| 16 | People leave their current dentist too early. | M×Ma=4 | The runbook §9 caller line exists. Add "Please stay with your current dentist until we invite you" to the texts, emails and form. | Complaints log | Give the urgent route and a written explanation | ads chat, leaflet chat | partly |

### D. Opening readiness and list conversion
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 17 | The opening date slips while everything still says "opening soon". | H×S=9 | Readiness tracker, reviewed every fortnight. Budget by weeks to opening (more than 6 weeks: £15–20; more than 10: £10 or pause). Date-update template. | H24 (OPENING_TARGET; LAST_LIST_UPDATE over 28 days) | Original register row 17 | owner | gap |
| 18 | The list outgrows capacity, or conversion breaks NHS rules. | H×S=9 | Capacity model and target list size (the playbook §4 has a draft). Invitation policy agreed with NHS Fife. | 9pm "List X / target Y", alert at 80% and 100% | Cut the ads. Open in waves. | owner | gap |
| 19 | The list goes stale. | H×Ma=6 | A service update every 3–4 weeks (playbook templates). A "still want a place?" step before each wave. | H24 last-update reminder. Delivery counts. | Original register row 19 | owner | gap |
| 20 | No-shows at first appointments. | H×Ma=6 | Book no more than 2–3 weeks ahead. Reminders. A short-notice list. | Weekly Dentally report | Original register row 20 | owner | gap |
| 21 | Invite-day surge. | M×Ma=4 | Waves sized to two weeks of slots. A Dentally import test. | Missed calls | Hold the next wave | owner | gap |
| 100 | (new, M22) Nothing switches the waiting-list system off at opening: "opening soon" ads and texts, triggers every minute, the public /exec, never-expiring tokens, auto top-up, data past its retention date. | H×Ma=6 | A dated switch-over checklist. An OPENING_DATE property. | After OPENING_DATE, the 9pm report warns while ads or texts still say "opening soon" | Run the checklist | owner, ads chat | gap |

### E. Apps Script, sheet and Google Workspace
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 79 | (new, M1) **Setup night pastes old code from `main`.** `main` has v21, no meta-ads.gs, no tracking.gs, the old form and the old runbook. No PR exists for the ads branch. | H×S=9 | Merge in a fixed order (section 4.3). Check `main` is complete. Freeze `main` until setup night is done. Put a HEALTH_VERSION constant in the code and record the commit hash. | H18 (version, triggers, metaGraph present), H16 (version returned by the web app) | Project History → paste from the agreed hash → New version | owner, ads chat | gap |
| 22 | The same function names in several files: whichever loads last wins. The branches match today; `main` doesn't. | M×S=6 | Move the shared functions into one shared.gs, or keep the copies identical with a CI check. | H18, H16 VERSION | Project History → last good version | ads chat, leaflet chat | partly |
| 23 | Sheet structure broken (sort, renamed header or tab). DNC then fails open and rows go into the wrong columns. | M×S=6 | S6. H4 runs at the start of every script run and stops it. | H4 every 5 min | Original register row 23 | leaflet chat, ads chat | partly |
| 24 | Data loss with no backup. | M×S=6 | H21: nightly values-only backup, 30 kept, never "Make a copy". | H21 rows-missing alarm | Original register row 24; never restore over the live sheet | ads chat, owner | gap |
| 25 | The script runs as the wrong account, or hits quotas. | L×S=3 | Chrome profile signed in only to info@. | H18 (effective user, triggers), H19 | Original register row 25 | browser Claude | partly |
| 26 | info@ locked out or suspended. | L×S=3 | Paid plan. Two super admins that aren't info@. Printed backup codes. | H1 runs outside Google. Admin alert centre → owner's personal email. | Original register row 26 | owner | gap |
| 27 | Time zone: the live sheet is Etc/GMT (checked); the project setting is unknown. Times will be an hour out from 28 Mar 2027. | M×Mi=2 | Set London in both (runbook 5.4). | H18 checks both settings | Fix them and re-run the installers | browser Claude | partly |
| 81 | (new, M3) Apps Script's consent screen lets people untick individual permissions. Triggers install, but fetches or email fail when they run, and so do the alert emails. | M×S=6 | Tick "Select all". | H18 makes one call of each kind. H1 doesn't depend on email. | Re-authorise with every box ticked | browser Claude | gap |
| 82 | (new, M4) **Test settings are never put back:** CALL_HOURS left at 24h, ONCALL_MOBILE left as the owner, BACKLOG_ALERT at 1. A blank key or number stops texts or alerts silently. | H×S=9 | A `<NAME>_UNTIL` property for every temporary change. A signed restore checklist. Never blank keys to "pause". | H3 every 5 min | Restore the runbook values | browser Claude, ads chat | gap |
| 90 | (new, M12) Backup or restore copies carry a working script. If anyone runs or deploys from a copy, every lead gets texted twice. | M×Ma=4 | Values-only backups (H21). Delete the script from any restore copy. | H14: the same number texted twice within 5 min → P2 | script.google.com → My projects → delete that copy's triggers and deployments | ads chat | gap |
| 103 | (new, F) **Trigger limit: 20 per user per script.** 13 are planned. A separate trigger for each check would make installs fail. | M×Ma=4 | Health uses 4 dispatcher triggers (17 in total). | H18 checks the exact trigger list | Remove spare triggers | ads chat | gap |
| 104 | (new, F) Quotas as the sheet grows. Every lead and every check reads the whole sheet. The minute poll runs 1,440 times a day against Workspace's 6 h/day of trigger time. | L×Ma=2 | Read the sheet once per run. Archive rows after opening. | H15 flags any run longer than 60 s | Optimise the slow job | ads chat | partly |

### F. Monitoring and alerting
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 28 | The whole system stops and nobody notices. | M×S=6 | S2 outside heartbeat. A daily "all OK" email. | H1, H18 | Original register row 28 | ads chat, browser Claude | gap |
| 29 | The owner doesn't see alerts. Everything goes to info@, sent to itself, buried under lead emails. | H×Ma=6 | S1 routing, SMS for P1 only. Deputy as a second recipient. | H23 monthly test alert | The deputy acts | ads chat, owner | partly |
| 30 | Ads stop or costs drift unnoticed. | H×Ma=6 | H12 hourly, plus Meta Automated Rules. | H12 | R1, R2, R10 | ads chat | partly |
| 86 | (new, M8) Too many false alarms, so the real one gets ignored. | H×Ma=6 | Exact counts (H8, H9) instead of time gaps. P1/P2 tiers. Site checks alert only after 2 failures in a row. Every alert names its fix. Target: no more than 2 false alarms a week. | Weekly count in the Health log tab | Tune the thresholds | ads chat | gap |

### G. Website, QR, leaflet and banner sign-ups
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 31 | Sign-ups lost behind "Thank you": the placeholder ENDPOINT, access not "Anyone", a new deployment URL, doPost throwing, the cache. doPost also texts and emails the person **before** writing the row, so a failed write means a text with no row and no alert. | M×S=6 | Commit the real /exec URL. Block submit unless ENDPOINT starts with `https://script.google.com/macros/s/`. try/catch → "Failed sign-ups" tab plus P1. doGet ping. | H16, H15, UptimeRobot | R7 | website chat, leaflet chat | partly |
| 32 | /l and /b return 404. HANDOFF Step 6 and the leaflet README still say "upload the zip". | M×S=6 | Fix both documents. `.htaccess` 302 redirects as a fallback. | H16 (checks the page text, not "Join") | R7(d) | website chat, leaflet chat | partly |
| 33 | The public endpoint is abused. | M×Ma=4 | Phone required. UK mobiles only. One sign-up per number per 10 min. SMS caps (40 an hour, 300 a day). WEB_SMS_PAUSED. | H20, H14, H13 | R8 | leaflet chat | partly |
| 34 | Row race (was marked "covered"). doPost saves without the lock after 20 s. handleLead then uses getLastRow(), so a Meta lead's SMS and email status can land in a website row. | L×Ma=2 | handleLead writes the whole row in one appendRow, after sending, as doPost already does. | None needed | None needed | ads chat | partly |
| 88 | (new, M10) A link tagged `utm_source=facebook` makes website rows that look like Meta leads and hide a dead poller. | M×Ma=4 | doPost renames unknown sources to `website-<src>`. Checks count only rows with real Meta Lead IDs (not "W-"). | 9pm flag | Fix the source values | leaflet chat, ads chat | gap |
| 91 | (new, M13) A burst of visitors uses up Apps Script's limit of about 30 runs at once, since every page load logs a visit. | L×S=3 | Sample or drop server-side visit logging. The poller releases the lock between leads. | H15 | Same as row 31 | leaflet chat | gap |
| 105 | (new, F) /register still asks "Are you currently registered with a dentist?" (removed from the Meta form as a data risk) and still says "about 30 seconds" (removed from the leaflet). | L×Mi=1 | Align it with the Meta form. | H16 keyword check | Website chat edit | website chat | gap |

### H. Texts (ClickSend)
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 35 | ClickSend stops sending: credit, card, trial account, sender ID, key, outage. | M×S=6 | Verified account. Sender ID approved. UK only. Auto top-up (£20 when under £10). Business Suite app as a channel that doesn't use ClickSend. | H13 (4 times a day), H14. `tracking.gs` already emails at 06:15 below £10. | R4 | leaflet chat, browser Claude | partly |
| 36 | Unicode alerts cost 2–3 credits (emoji, en dash). | H×Mi=3 | Plain-ASCII SMS text. | H18 template check | Edit the strings | ads chat, leaflet chat | partly |
| 83 | (new, M5) **Alerts "sent" but never seen.** ClickSend "SUCCESS" means accepted, not delivered. "Assigned to" is written even if the alert failed. Phone spam filters. Numbers typed "+44 (0)7…", "0044 7…" or "7700…" are skipped with only a log line. | H×S=9 | Test on the caller's real lock screen. Work phone with filtering off. Fix ukMobile for these formats. Write "Assigned to" only when the send succeeded. | H14 (caller alert not delivered within 15 min → P1; blank SMS status → P2) | R4, R5 | leaflet chat, ads chat, browser Claude | partly |

### I. Compliance: PECR and UK GDPR
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 37 | Bundled required consent box on /register; no marketing field sent. | H×Ma=6 | Hard gate for the QR codes: notice (a) plus an optional, unticked `marketing` box and a consent_version. Mark earlier rows "WEB-v1 – never market". | H16 (`name="marketing"`). 9pm: website Yes = 0% with at least 20 sign-ups. | Original register row 37 | website chat | partly |
| 38 | Opt-outs can't be received, and DNC is fragile. | H×Ma=6 | S7. Call outcome "DO NOT CONTACT" sets Status (`tracking.gs`). "Questions or stop? Email info@" in the text. A reply-capable number before any marketing. | H22 | R9 | leaflet chat, ads chat | partly |
| 39 | An "opening news" blast to the whole list. | M×S=6 | A sendCampaign script that refuses marketing to non-"Yes" rows. Never upload the sheet to ClickSend. Every bulk template approved in writing. | H14 (over 200 a day, or texts not sent by our scripts) | Original register row 39 | ads chat, owner | partly |
| 40 | Data requests missed; inbox buried. | H×Ma=6 | Requests log. Named inbox owner. Alerts moved off info@ (S1). | Gmail "DSR" filter. Overdue requests in the 9pm report. | R9 | owner, staff checker | partly |
| 41 | Privacy notice wrong: still lists Zapier on 2441aab, consent as the basis, a "Practice Manager" who may not exist, open-ended retention. | H×Ma=6 | The website chat commits the corrected page before the ads (the runbook has interim edits). | H16 (Zapier, kirkcaldydentist) | Re-upload from `main` | website chat | partly |
| 42 | Consent bug: any ticked checkbox counts as "Yes". | M×Ma=4 | Match on a MARKETING_CHECKBOX_KEY. Store the form version. | 9pm Yes rate over 80% or 0% | Original register row 42 | ads chat | partly |
| 43 | Controller not identifiable; ICO fee unpaid. | M×Ma=4 | Confirm the legal entity. Pay at ico.org.uk/fee. Footer details. | H16 looks for "Ltd" or a company number | Pay the same day | owner | gap |
| 44 | Retention isn't automated. | H×Mi=3 | Monthly purge, keeping S7. | The purge emails its counts | Original register row 44 | leaflet chat | gap |
| 96 | (new, M18) The VoIP service records calls by default. | M×Ma=4 | Decide on or off before the number goes live. If on: notice, privacy page, retention, processing agreement. | None | None | owner | gap |

### J. Advertising, NHS, GDC, consumer law and equality
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 45 | The NHS claim isn't backed by NHS Fife. | M×S=6 | Runbook §7 asks first. Make it a hard gate: the letter goes in Drive and NHS_FIFE_LETTER_ID is set. The print review already says no-go without it. | H24 (ads live without it → P1) | Original register row 45 | owner | partly |
| 46 | Old copy or print runs ahead of decisions. | H×Ma=6 | The runbook now uses the updated HANDOFF Step 5 copy. Print gate (PRINT-REVIEW must-fix 1–4). | Weekly creative scan | Duplicate with corrected text | ads chat, leaflet chat | partly |
| 47 | "Be first in line" doesn't match who gets places first. | H×Ma=6 | Owner signs the priority rule, or the phrase is removed everywhere (the print review has the patch). | H24 PRIORITY_RULE_SIGNED | Original register row 47 | owner | gap |
| 48 | Accessibility and equality. | M×Ma=4 | The server must accept a missing email **before** the page makes it optional. Darker gold #8A6A2C. Captions. | Lighthouse check | One release | website chat | partly |
| 49 | Future promotions, facts and reviews. | M×Ma=4 | Rulebook. Reviews policy. Claim the Google Business Profile. | Weekly scan | Original register row 49 | ads chat, owner | partly |
| 50 | Banner planning consent. | L×Mi=1 | Check with Fife Council and the landlord. | None | Take it down or apply | owner | gap |

### K. Security and data protection
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 51 | Keys and data exposed. The repo is public (checked again 8 Nov). The sheet is private (info@ only). Any project editor can read the Script Properties. | M×S=6 | Repo private. Sheet restricted. Trim the token scopes. Standalone project later. ClickSend subaccount key. | H18 sharing check | Rotate the keys; original register row 51 | owner, ads chat | partly |
| 52 | Hacked admin or phishing. | M×S=6 | App-based or passkey 2FA. Spending limit. A dedicated card with bank alerts. | H12 (unknown campaign, 1.5× spend) | Original register row 52 | owner | partly |
| 53 | Bulk email exposure; no breach procedure. | M×S=6 | Never send bulk mail from Gmail. One-page breach procedure and log. | Daily check of Sent for more than 20 recipients | Contain it; ICO within 72 h | owner, ads chat | gap |
| 54 | AI tools process lead data. | M×Ma=4 | AI tools see only a counts-only "Stats" sheet. A DPIA. | Monthly API-controls review | Revoke access | owner | gap |
| 87 | (new, M9) info@ is everyone's login. A lost phone means a full takeover. "Skip inbox" filters cancel the Gmail backup channel. Every recovery email goes to info@. | M×S=6 | Callers get their own Workspace accounts. Only the owner and deputy sign in as info@. Recovery emails go to the owner's personal address (S13). | Monthly review of Admin console → Devices | Sign out everywhere, reset, rotate the keys, check the triggers | owner, browser Claude | gap |
| 92 | (new, M14) Hardening locks out the caller or the scripts. Today the sheet is shared with nobody but info@, so the caller can't edit Status yet. | M×Ma=4 | Give the caller a caller@ account. After every hardening change: the caller edits a Status on their phone, then one test lead and one web sign-up. | H18 editor allow-list | Undo the change | browser Claude | gap |

### L. Meta accounts, billing and ad review
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 55 | New account disabled, or the owner's profile restricted. | M×S=6 | Owner's usual device, no VPN. Page warmed up with posts. Card in the owner's or business name. Business verification. | H12 account status | R10 | owner | partly |
| 56 | The owner is the only admin. | M×S=6 | A second admin on the Page, portfolio, ad account **and developer app**. Recovery codes in the safe. | Monthly manual check (not automatic; row 51) | R10 | owner | partly |
| 57 | Ads rejected or held in review. | M×Ma=4 | CREATIVE-REVIEW copy. Publish 2–3 days early. Backups ready. | H12 within the hour | R1 | ads chat | partly |
| 58 | Advantage+ rewrites the ads. | M×Ma=4 | Every enhancement off (runbook §3.10, §7). | Weekly creative scan | Pause, turn the enhancements off, republish | browser Claude | partly |
| 59 | Payment failure, spending limit, slow verification. | M×Ma=4 | Business card with headroom. Tell the bank. Backup card. | H12 (status 3/9, PENDING_BILLING_INFO, £0 by 1pm) | R2 | owner | partly |
| 60 | Overspend and budget mistakes. | M×Ma=4 | Account spending limit about £900, since the 4-week plan is about £810 before fee and VAT. Rules. One campaign. | H12 (1.5× budget, budget change) | Undo from Activity History | owner | partly |
| 61 | App or System User setup stalls on setup night. | M×Ma=4 | Pre-flight the day before. | Access Token Debugger | Page-token fallback (runbook 5.2) | browser Claude | partly |
| 85 | (new, M7) The campaign is switched off (the 30-leads rule, a mis-click, Meta) and the watchdog stays quiet: delivery is checked only `if (active.length)`. Nobody owns switching it back on at weekends. | H×Ma=6 | Set the 30-leads rule to about 1.2× caller capacity (30 for one caller, 45 for two). Name a weekend owner. ADS_PAUSED_UNTIL for deliberate pauses. | H12 "no active campaign" (P2 if an automated rule did it, P1 otherwise) | Switch on at 8am once the overnight leads are called | ads chat, owner | gap |

### M. Targeting, budget and measurement
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 62 | Out-of-area leads. | M×Mi=2 | KY1–KY5, "living in", "Reach more people" unticked, re-checked after every duplicate. | H18: postcodes outside KY1–KY5 over 10% (at least 10 rows) → P2 | Status "Out of area" | browser Claude | partly |
| 63 | The ads take the group's own patients. KY6–8 are excluded, but 2,445 KY1/KY2 patients already use the group. | H×Ma=6 | The owner decides in writing whether transfers are wanted. The caller asks "Are you a patient at one of our practices?" | 9pm group-patient share over 20% | Adjust the area or copy | owner | partly |
| 64 | Can't tell which ad or channel works. | H×Ma=6 | Attribution columns (live sheet plus branch code). "How heard". Tagged links. | Dashboard per ad | Judge ads on 30+ leads each | ads chat | partly |
| 65 | List can't be marketed; private interest unknown. | M×Ma=4 | Fix row 37. | Consent % by source | A separate private-care campaign | website chat | partly |
| 66 | Ad fatigue. | H×Mi=3 | Fresh ads ready by week 2. | meta-ads frequency over 3 | Add a new ad | ads chat | partly |
| 67 | Wrong numbers and junk leads. | H×Mi=3 | Higher-intent form. | Wrong-number rate over 10% | Exclude the bad placement | ads chat | partly |
| 68 | Duplicate sign-ups. | H×Mi=3 | Both handlers dedupe (branches). | Dashboard unique count | The caller merges notes | ads chat, leaflet chat | partly |
| 69 | Learning resets from scattered edits. | M×Mi=2 | One weekly edit window. Steps of 20% or less. | Delivery column | Stop editing for 4–7 days | ads chat | partly |
| 70 | Money spent on low-value channels. | M×Mi=2 | Events tab. A small first leaflet drop. | Sign-ups per sector | Stop weak sectors | leaflet chat | partly |

### N. Hosting, DNS and email
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 71 | Site down or lapsed. Not on Hostinger yet: the A records still point to Squarespace (8 Nov). | M×S=6 | Owner's own Hostinger login. Auto-renew. SSL for the bare domain and www. Fallback static host ready. | UptimeRobot, H16 | R7 | owner, website chat | partly |
| 72 | Confirmation emails land in Junk. DKIM published; **no DMARC**. | H×Ma=6 | Add `_dmarc` TXT "v=DMARC1; p=none; rua=mailto:info@kirkcaldydental.co.uk". Test with mail-tester. | H17 | Fix and retest | browser Claude | partly |
| 73 | A DNS change breaks email. MX and SPF are intact today. | L×S=3 | Runbook 1.3: keep MX and SPF, don't change nameservers. | H17 (MX missing → P1) | Restore smtp.google.com MX | browser Claude | partly |

### O. Social media, complaints, reputation and fraud
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 74 | Comments unanswered or answered wrongly. | H×Ma=6 | Named checker and backup. Reply bank. Moderation. The Daily checks tab exists. | Daily checks counts | Section 4.1 | staff checker | partly |
| 75 | Impersonation and scams ("£20 registration fee"). | M×S=6 | Pinned "we never charge to join" post, also on /register and in the email. | Weekly search | Report it; pinned warning | staff checker, owner | gap |
| 76 | No complaints owner or timescale. A Complaints tab exists. | M×Ma=4 | Name the lead. NHS Scotland timescales: 5 working days for front-line resolution, 20 for an investigation. | Due dates | R9 | owner | partly |
| 77 | Opening-day queues and press calls. | M×Ma=4 | No walk-in registration. Holding statement. | Google Alerts | Original register row 77 | owner | gap |
| 97 | (new, M19) The building becomes a sign-up channel. Contractors improvise; someone sticks a fake QR code on the banner. | M×Ma=4 | Door sign. Contractor brief. Locked slip box. Weekly scan of the banner's QR code. | Banner visits drop to 0 | Remove the fake sticker; warning post | owner | gap |
| 101 | (new) A similar trading name, or a clash on the "KirkDental" sender ID. | L×Ma=2 | Check the local names and the UK SMS SenderID Protection Registry. | None | None | owner | gap |

### P. Governance and documents
| # | Risk | Score | Prevention | Detection | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| 78 | **Setup documents contradict each other:**<br>• HANDOFF 3.4 still says "Make";<br>• HANDOFF Step 4 says rotate + OWNER_MOBILE;<br>• HANDOFF Step 6 and the leaflet README say "upload the zip";<br>• the runbook's test resets BACKLOG_ALERT to 15;<br>• the backlog email says "ad set budget", but the budget sits on the campaign. | M×Ma=4 | Fix all five on `main` before setup night. | Setup test: exactly 1 row, 1 lead text, 1 caller text and 1 email | Correct the docs and tell the chats | ads chat, leaflet chat | partly |
| 98 | (new, M20) Nobody at the clinic can maintain the system. The Claude operators can be misled by instructions hidden in comments, emails or lead names (names reach the caller's SMS). | M×S=6 | A "manual mode" card. Browser Claude never reads public messages while signed in to admin consoles. Strip URLs and digits from names in alerts. The owner confirms any destructive action on screen. | None | Manual mode | owner, ads chat | gap |
| 99 | (new, M21) The BRAND.md Drive clean-up rule bins the evidence of what each version said. | M×Ma=4 | A "Compliance archive" folder that is never cleaned. Git tags for every published or printed version. | None | None | owner | gap |

### Gaps by deadline
**Before setup night (blockers)**
1. Owner merges the branches into `main` in the order in 4.3. Freeze `main`. Record the commit hash. (79, 1, 22)
2. The ads chat builds `leads/health.gs` and the code changes in 3.5. The leaflet chat makes its changes. (1–4, 28, 29, 82, 83, 103)
3. Fix the runbook and HANDOFF contradictions. Make the "real lead, no app role" test a hard gate. (78, 80, 9)
4. Test the ad-permission case for the leads request. (84)
5. Set up healthchecks.io and UptimeRobot. Run the fire drill (3.6). (28, 86)
6. Owner gates: NHS Fife letter on file; call card approved; priority rule signed or "Be first in line" removed; ICO fee paid; publish-now or warm-up decision. (45, 7, 47, 43, 55)
7. Privacy page fixed. DMARC added. Both time zones set to London. (41, 72, 27)
8. Spending limit about £900. 2FA required for everyone. A second admin, including on the developer app. (60, 52, 56)
9. Caller gets their own login and edit access to Status and Call outcome only. "To call" filter view. Row 1 protected. (92, 87, S6)

**Before leaflets, banner or QR codes go out**
10. /register: optional marketing box, consent_version, a real /exec URL, blocked submit while the URL is a placeholder, doPost try/catch, doGet ping. (37, 31)
11. Upload site/ from `main`, test /l and /b on printed proofs, and add the `.htaccess` fallback. Print gate signed. (32, 46)
12. SMS caps and WEB_SMS_PAUSED. Phone required. Source allow-list. (33, 88)

**Week 1**
13. Suppression tab. "Manual add". Household-aware dedupe. (38, 89, 93)
14. Name the deputy, the backup caller, the staff checker and a weekend cover person. (14, 74, 85)
15. Repo private. Breach procedure. Requests log. (51, 53, 40)

**Week 2, before going above £25/day**
16. 01592 on VoIP (decide on call recording). Second caller with split morning lists. (12, 96, 94)

**By 1 December**
17. Festive cover or pause. Holiday wording. Readiness tracker and the date-update template. (10, 17, 19)

**Before any bulk message or opening**
18. sendCampaign. Capacity model and NHS Fife policy. Invite waves. Switch-over checklist. Retention purge. DPIA. (39, 18, 20, 21, 100, 44, 54)

---

## 3) Automatic monitoring build list (ads chat, Apps Script)

### 3.1 Shape
- **File:** `leads/health.gs` on the ads branch, then `main`, pasted into the same project. Every function starts with `health`.
  - `healthNotifyOnce` already exists in meta-leads.gs. Don't redefine it. Fix it as described in 3.5.
- **It uses:** metaGraph, leadsSheet, sendSms, ukMobile, callWindow, inCallHours, adsGraphGet, adsAccount and metaBacklog.
- **Four triggers only** (13 + 4 = 17 of the 20 allowed). `healthInstallTriggers()` deletes only its own four, and refuses to run if the project would go above 18.

| Trigger | Schedule | Runs |
|---|---|---|
| `healthEvery5Min` | every 5 min, 24 h | H1, H2, H3, H4, H14a, H15, H20. Every third run, in calling hours: H5, H6 |
| `healthHourly` | every hour, 24 h | H8, H16, H19, H14b. 07–23: H12. 08–22: H9, H10. 09–21: H11. At 08/12/16/20: H13. At 10/12: H7. At 21: H22 |
| `healthDaily` | 07:30 | H17, H18, H24. On the 1st of the month: H23 |
| `healthNightly` | 23:30 | H21 |

- **Each run** reads the Waiting list once and shares it between its checks. Target: under 10 s for the 5-minute run, under 60 s for the hourly run.

**New Script Properties**

| Property | Value |
|---|---|
| HEALTH_EMAIL | owner's personal email, info@kirkcaldydental.co.uk (and the deputy later) |
| HEALTH_SMS | owner's mobile (critical only). OWNER_MOBILE stays empty, so the owner doesn't get a copy of every lead. |
| HEALTH_QUIET | `22-7`: no owner SMS 22:00–07:00. Email still goes immediately. At 07:00, one SMS lists any P1 still open. |
| HEALTH_PING_POLLER / _DAILY / _BACKUP | healthchecks.io ping URLs |
| META_PAGE_ID | the clinic Page ID |
| HEALTH_EXEC_ID | the web-app deployment ID, from the /exec URL |
| CALLER_SHIFT / CALLER_DAYS | the hours and days the caller really works, e.g. `9-17`, `Mon-Sat`. Workload alerts fire only inside the shift, because one person can't cover 91 hours a week. |
| HEALTH_BACKLOG | `5` |
| HEALTH_BALANCE_WARN / _CRIT | `8` / `4` with auto top-up on (top-up should fire at £10); `15` / `5` without it |
| ADS_EXPECTED_ON, ADS_PAUSED_UNTIL, ADS_ALLOWED_CAMPAIGNS, ADS_EXPECTED_BUDGET, FESTIVE_MAX | ad watchdog settings |
| NHS_FIFE_LETTER_ID, CALL_CARD_APPROVED, PRIORITY_RULE_SIGNED, OPENING_TARGET, LAST_LIST_UPDATE | gates and dates for H24 |
| `<NAME>_UNTIL` | expiry for any temporary change (row 82) |

**Constant:** `var HEALTH_VERSION = "<date>-<commit>"`, set at paste time and shown by H16 and H18.

### 3.2 Alert router
- **`healthAlert(level, key, subject, body, opts)`:**
  - **P1 (critical):** email HEALTH_EMAIL now. Then SMS HEALTH_SMS, unless it's quiet hours or ClickSend itself is the failure (`opts.noSms`). If ClickSend is the failure, it sends healthchecks `/fail` instead.
  - **P1 repeats:** at most one SMS per key per 60 min while the problem is still open, and no more than 3 a day.
  - **P2 (warning):** email only, at most once per key every 3 h.
  - **Order:** send first, record after.
  - **No recipients set:** throw an error, so Google's trigger-failure email fires.
- **Every alert:**
  - is written to a "Health log" tab (time, level, key, subject, open/resolved);
  - sends a "RESOLVED" email once when the check passes again (`healthResolve(key)`).
- **Per-lead and per-sign-up failures are never throttled:** one email each, or one digest per run.
- **Email layout:** what happened / what it affects / what to do (plan section) / sheet link.
- **SMS:** plain text, 160 characters at most, no lead names or numbers.

**Who gets what**
- **E** = HEALTH_EMAIL.
- **S** = HEALTH_SMS (P1 only).
- **C** = caller via ONCALL_MOBILE, only for work the caller can act on.
- **X** = outside watchers (healthchecks.io and UptimeRobot) → the owner's personal email plus phone push. These work even if Google or ClickSend is down.

### 3.3 Checks
**H1 `healthPollerAlive`.** Every 5 min, 24 h.
- **Tests:** pollMetaLeads finished a clean run (every form returned 200, no lead failed, headers OK) within the last 10 min. If so, it pings HEALTH_PING_POLLER.
- **If nothing pings for 15 min,** healthchecks.io alerts by itself. That catches deleted triggers, revoked authorisation, a Google outage and a suspended account.
- **Alerts:** P1 → E, S, X.
- **SMS:** "KD P1: Facebook lead checker stopped at 14:05. New FB/IG leads are not added or texted. Apps Script > Executions. Plan R3".
- **Email subject:** "[KD-P1] Facebook lead checker stopped (last good run 14:05)".

**H2 `healthMetaApiErrors`.** Every 5 min.
- **Tests:** META_LAST_ERR (code, time, form), which pollMetaLeads writes on any non-200 reply.
- **Thresholds and levels:**
  - 190/102 → P1 at once;
  - 10/200/100, permission or "version deprecated" (2635) → P1;
  - rate limits 4/17/32/613/80005 → P2 after 30 min, P1 after 2 h;
  - 5xx or other → P1 after 15 min.
- **Alerts:** E, S.
- **SMS:** "KD P1: Meta lead token rejected (error 190) since 14:05. FB/IG leads stopped. Make a new System User token. Plan R3".
- **P2 email:** "[KD-P2] Meta is rate-limiting the lead checker (code 613, 40 min). It retries by itself."

**H3 `healthConfigCheck`.** Every 5 min. P1 in calling hours, P2 otherwise.
- **Tests:**
  - META_PAGE_TOKEN, META_FORM_IDS, CLICKSEND_USER/KEY and ONCALL_MOBILE aren't blank;
  - every ONCALL_MOBILE entry turns into +447 followed by 9 digits;
  - ONCALL_MOBILE isn't the owner's number without an `_UNTIL`;
  - CALL_HOURS is `8-21`;
  - BACKLOG_ALERT is 10 or less;
  - WEB_SMS_PAUSED isn't left on;
  - no `_UNTIL` property is in the past.
- **Alerts:** E, S.
- **SMS:** "KD P1: setting wrong - ONCALL_MOBILE is blank/invalid, so the caller gets no lead alerts. Fix in Script Properties. Plan R5".
- **Temporary-setting SMS:** "KD P1: test setting left on - CALL_HOURS is 24h, so night leads alert the caller. Set it back to 8-21 now."

**H4 `healthSheetCheck`, plus `healthAssertSheet()` called at the start of pollMetaLeads and doPost.**
- **Tests:**
  - the tab "Waiting list" exists, and A1 is "Signup Time";
  - each of these headers appears exactly once: Signup Time, Name, Phone, Email, Postcode, No. of People, Adult/Child/Family, Source, Status, Assigned to, Marketing consent, Notes, Lead ID, Logged at, Ad ID, Form ID, Duplicate of, SMS ID, SMS status, Email status, Call outcome, Status changed at;
  - Dashboard is still the first tab.
- **It also stores a hash of row 1.** Any change → P2 with the difference.
- **If the check fails,** the poller stops before reading any leads, so nothing is marked as seen.
- **Alerts:** P1 → E, S.
- **SMS:** "KD P1: Waiting list header row changed (Status missing). Lead scripts stopped to avoid misfiling. Restore row 1 (register row 23)."

**H5 `healthBacklogCheck`.** Every 15 min, inside CALLER_SHIFT. It replaces the email from backlogCheck.
- **Waiting** = rows that are blank or "Call 8am" an hour after their clock starts, plus "No answer" rows whose Next call due passed more than 60 min ago.
- **Thresholds and levels:**
  - waiting ≥ 5 → P2 to E, at most every 2 h;
  - waiting ≥ 10, or the oldest ≥ 120 shift minutes → P1 to E and S, plus C.
- **Owner SMS:** "KD P1: 11 leads waiting over 1h, oldest 2h40m. Cut the ad budget 20% or bring in the backup caller. Plan R6".
- **Caller SMS:** "KD: 11 leads waiting, oldest 2h40m. Please ring oldest first (filter view To call)."

**H6 `healthCallerActive`.** Every 15 min, inside CALLER_SHIFT, from an hour after the shift starts.
- **Tests:** whether there's call activity: the latest Call log timestamp, "Status changed at" or "Last attempt at".
- **Threshold:** at least 1 lead waiting over 60 min and no activity for 120 shift minutes, or no activity at all by an hour after the shift starts.
- **Alerts:** P1 → E, S.
- **SMS:** "KD P1: no calls logged since 11:20 and 6 leads are waiting. Is the caller OK? If off, move alerts to the backup. Plan R5".

**H7 `healthOvernightQueue`.** At 10:00 and 12:00 on caller days.
- **Thresholds and levels:**
  - any "Call 8am" rows left at 10:00 → C plus P2 to E;
  - 5 or more at 10:00, or any at 12:00 → P1 to E and S.
- **Caller SMS:** "KD: 4 overnight leads not yet called at 10am. Filter Status = Call 8am and ring them now."
- **Owner SMS:** "KD P1: 7 overnight leads still not called at 10am. Check the caller is working. Plan R5/R6".

**H8 `healthMetaReconcile`.** Hourly, 24 h.
- **Tests:** for each form, it fetches the lead IDs from the last 26 h and compares them with the Lead ID column (ignoring "'" and "l:").
- **Threshold:** any ID older than 15 min that isn't in the sheet.
- **Action:** writes the lead's answers to the "Failed leads" tab.
- **Alerts:** P1 → E (with names), S (count only).
- **SMS:** "KD P1: 3 Facebook leads from today are not in the sheet. Names in your email and the Failed leads tab. Call them first. Plan R3".

**H9 `healthMetaCount`.** Hourly, 08–22.
- **Tests:** compares Meta's own count of today's leads with the sheet's paid Meta rows today (Lead ID present, not organic). Meta's count comes from account Insights, "today", lead actions, and from each form's leads_count change since `healthSetBaseline()`.
- **Threshold:** a gap of 3 or more and at least 20%, on two runs in a row. This is the only check that sees leads Meta has but won't show our app (row 80).
- **Alerts:** P1 → E, S.
- **SMS:** "KD P1: Meta counts 9 leads today, the sheet has 4. Real leads may be hidden from the script (app/permissions). Plan R3".

**H10 `healthFormsCheck`.** Hourly, 08–22.
- **Tests:** `GET /{META_PAGE_ID}/leadgen_forms?fields=id,name,status,created_time`, using a Page token from /me/accounts (test this on setup night).
- **Thresholds and levels:**
  - any ACTIVE form missing from META_FORM_IDS → P1;
  - a listed form ARCHIVED while it's the only one → P2.
- **Alerts:** E, S.
- **SMS:** "KD P1: new Facebook form 'Waitlist v2' (ID 1234567890123) is live but not read. Add its ID to META_FORM_IDS now. Plan R3".

**H11 `healthNoMetaLeads`.** Hourly, 09–21. This is the requested "no leads in N hours" check.
- **Tests:** no Meta row (real Lead ID, not "W-") for N hours while at least one campaign is ACTIVE and today's spend is at least £5.
- **N** = 4.6 ÷ (expected leads per hour), capped between 2 and 6 h. Expected leads = budget ÷ £1.50 ÷ 14 hours.
  - £20/day gives about 5 h; £50/day gives about 2 h.
  - With these numbers, about 1 window in 100 is empty by chance.
- **Alerts:**
  - P2 → E on its own;
  - P1 → E and S if H8 or H9 also shows a gap, or H1 or H2 is failing (it then uses the H9 wording).
- **P2 email:** "[KD-P2] No Facebook leads for 5 hours while the ads spent £9.40 today. Usually chance; check Ads Manager's lead count."

**H12 `healthAdsCheck`.** Hourly, 07–23. adsStatusCheck keeps writing the Ad status tab; its alerts are routed through healthAlert using the same keys.
- **P1 → E, S:**
  - account_status isn't 1 (2 disabled, 3 unpaid, 7 risk review, 9 grace period);
  - an ad is DISAPPROVED, WITH_ISSUES or PENDING_BILLING_INFO;
  - no ACTIVE campaign while ADS_EXPECTED_ON=1 and ADS_PAUSED_UNTIL isn't in the future. This drops to P2 if Activity history shows an automated rule did it;
  - £0 spent by 13:00 (it's P2 at 11:00);
  - today's spend is more than 1.5× the budget;
  - a campaign ID isn't in ADS_ALLOWED_CAMPAIGNS;
  - 24 Dec–4 Jan: budget above FESTIVE_MAX.
- **P2 → E:**
  - the budget differs from ADS_EXPECTED_BUDGET (names who changed it);
  - spending-limit headroom is under 7 days.
- **SMS texts:**
  - "KD P1: Meta ad account status 3 (payment problem). Ads stopped. Pay in Billing & payments or use the backup card. Plan R2"
  - "KD P1: ad 'Ad B' rejected by Meta. The other ad still runs. Forward the email to the ads chat. Plan R1"
  - "KD P1: no Facebook campaign running since 13:00. Paused on purpose? Set ADS_PAUSED_UNTIL. Otherwise Plan R2/R10"
  - "KD P1: ads spent £34 today on a £20 budget. Check Ads Manager > Activity history now. Possible hack: register row 52"

**H13 `healthClickSendBalance`.** At 08, 12, 16 and 20.
- **Tests:** `GET https://rest.clicksend.com/v3/account` → balance.
- **Thresholds and levels:**
  - below HEALTH_BALANCE_WARN, or below 3 days of the last 7 days' average SMS spend (from the SMS log Price column) → P2;
  - below HEALTH_BALANCE_CRIT → P1 (SMS still works while credit lasts);
  - login fails (401) → P1 email plus healthchecks `/fail`, with no SMS.
- **SMS:** "KD P1: ClickSend credit £3.10. Lead and caller texts stop soon. Top up now - auto top-up may have failed. Plan R4".

**H14 `healthSmsCheck`.**
- **(a) Every 5 min, from the SMS log:**
  - any caller alert in the last 15 min with a send status other than SUCCESS → P1;
  - 3 or more lead texts failed in 60 min, or 20% of at least 5 → P1;
  - a Meta row older than 10 min with a blank SMS status that isn't DNC or Duplicate → P2. This catches skipped number formats.
- **(b) Hourly, from ClickSend's history for the last 2 h:**
  - a caller alert not DELIVERED 15 min after sending → P1;
  - lead texts delivered below 90% over 24 h (at least 10 sent) → P2;
  - more than 200 texts in a day, or texts whose source isn't "apps-script" (if ClickSend returns that field) → P1;
  - the same number given the lead text twice within 5 min → P2 (row 90).
- **Alerts:** E, plus S (email only if ClickSend is the failure).
- **SMS texts:**
  - "KD P1: caller alert not delivered (14:32, UNDELIVERED). The caller may not know about new leads. Plan R4/R5"
  - "KD P1: 4 lead texts failed in the last hour (INSUFFICIENT_CREDIT). Plan R4"
  - "KD P1: 230 texts today (normal 60), or texts sent outside our scripts. Check ClickSend now. Plan R8"

**H15 `healthJobsCheck`.** Every 5 min. This is the Apps Script execution-error check.
- **How it knows:** every entry point calls `healthMark(job, ok, ms)` at the end. Google's own failure emails are forwarded to the owner by a Gmail filter.
- **Alerts and levels:**
  - pollMetaLeads not ok for 10 min → P1;
  - backlogCheck or trkRetryCheck not run for 30 min in hours → P2;
  - morningSummary not run by 08:30 → P2;
  - eveningReport not run by 21:30 → P2;
  - adsPullInsights or trkPullSmsHistory not run by 07:00 → P2;
  - trkDailySnapshot not run by 21:40 → P2;
  - any job over 60 s → P2;
  - any new row in "Failed leads" or "Failed sign-ups" → P1 per row, no throttle.
- **Alerts:** E, S.
- **SMS texts:**
  - "KD P1: pollMetaLeads failing since 14:05 (Tab not found). Plan R3"
  - "KD P1: a website sign-up failed to save at 14:32. Details in Failed sign-ups tab. Add and call them."

**H16 `healthSiteCheck`.** Hourly, plus outside UptimeRobot checks every 5 min.
- **Alerting rule:** only after 2 failures in a row. P1 08:00–22:00, P2 overnight.
- **Tests (redirects followed; a bad certificate counts as a failure):**
  - /register/ returns 200, contains `script.google.com/macros/s/` and HEALTH_EXEC_ID, and doesn't contain PASTE_APPS_SCRIPT_URL_HERE. After the consent fix, it contains `name="marketing"`;
  - /privacy.html returns 200, contains ClickSend, Hostinger and Meta, and contains neither Zapier nor kirkcaldydentist;
  - /l/ and /b/ return 200 and contain `register/?src=leaflet` and `register/?src=banner`;
  - www returns 200;
  - `/exec?action=ping` returns "pong " + HEALTH_VERSION.
- **Alerts:** E, S, X.
- **SMS:** "KD P1: website /register broken (404 at 14:00 and 15:00). Leaflet and banner sign-ups fail. Plan R7".

**H17 `healthDnsCheck`.** Daily, via dns.google.
- **Tests and levels:**
  - MX is smtp.google.com → P1 if missing;
  - exactly one SPF record, google._domainkey present, _dmarc present → P2;
  - after go-live, the A record isn't a Squarespace IP → P2.
- **Alerts:** E (to the personal address, because inbound mail to info@ is what breaks), plus S for P1.
- **SMS:** "KD P1: Google mail record (MX) missing. Outside emails to info@ bounce. Restore Google MX (register row 73)."

**H18 `healthSelfTest`.** Daily at 07:30. Pings HEALTH_PING_DAILY.
- **Tests:**
  - effective user is info@;
  - the 17 expected trigger handlers each exist once;
  - script and sheet time zones are Europe/London;
  - Graph /me works, each form is readable, and the facebook-api-version header equals the version requested;
  - MailApp quota is at least 300;
  - sheet sharing is private and the editors are within HEALTH_EDITORS;
  - the last backup is under 30 h old;
  - the web-app ping version equals HEALTH_VERSION;
  - leadText with a 12-letter name is plain text and 160 characters or fewer;
  - today's data checks: Meta rows with a blank Postcode, text dates, "l:" IDs or "p:" phones; postcodes outside KY1–KY5 over 10%; "No answer" over 40% for 3 days;
  - one fetch, email, Sheets, Drive and Gmail call each (catches unticked permissions).
- **Alerts:**
  - always sends E: "[KD] Daily check 07:30: all OK (17 triggers, version 2026-11-09a, ClickSend £42.10, 0 open alerts)". Its absence is itself a signal;
  - any P1 finding adds S: "KD P1: daily check found 2 problems (triggers 15 of 17; ClickSend login). Details in email."

**H19 `healthMailQuota`.** Hourly.
- **Thresholds and levels:** under 300 left → P2; under 50 → P1.
- **Alerts:** E, S.
- **SMS:** "KD P1: Google email allowance nearly used (40 left today). Confirmations pause. Spam? Plan R8".

**H20 `healthSpamCheck`.** Every 5 min.
- **Threshold:** website rows ("W-") in the last 60 min above the larger of 15 or 3× the 7-day average for that hour, or more than 40 texts in an hour.
- **Action:** sets WEB_SMS_PAUSED=1 with WEB_SMS_PAUSED_UNTIL = now + 2 h. Rows still save; there are no texts, emails or alerts; Notes says "paused – check".
- **Alerts:** P1 → E, S.
- **SMS:** "KD P1: 34 website sign-ups in the last hour (normal 2). Website texts paused for 2h automatically. Check for spam. Plan R8".

**H21 `healthBackup`.** 23:30.
- **Action:** copies the values of Waiting list, Call log, SMS log and Health log into a new spreadsheet, "KD backup yyyy-MM-dd", in HEALTH_BACKUP_FOLDER. No script is copied. 30 are kept. The folder is shared (view) with the owner's personal Google account.
- **Threshold:** Lead IDs present last night but missing now, or a drop in rows → P1.
- **Success** pings HEALTH_PING_BACKUP. A failure shows up through healthchecks (X).
- **SMS:** "KD P1: 12 Waiting list rows vanished since last night's backup. Don't restore over the live sheet. Register row 24".

**H22 `healthContentScan`.** 21:00.
- **P1 → E, S:**
  - Notes containing stop|remove|unsubscribe|don't call while Status isn't DNC;
  - any text to a DNC number after its "Status changed at" (matched against ClickSend history);
  - Call outcome is DNC or Withdrew while Status doesn't match.
- **P2 → E, row numbers only:**
  - Notes with health words (pain|abscess|swell|bleed|antibiotic|pregnan) or money words (deposit|£|implant|whiten|private);
  - Status values outside the list;
  - Call log attempts before 08:00 or after 21:00;
  - the count of "Urgent – signposted".
- **SMS texts:**
  - "KD P1: a text went to a DO NOT CONTACT number at 14:32. Check ClickSend, then log and apologise. Plan R9"
  - "KD P1: row 88 says stop/remove but is not DO NOT CONTACT. Set DNC today. Plan R9"

**H23 `healthMonthly`.** 1st of the month, 07:30.
- **Email E:** sheet editors and viewers, ONCALL_MOBILE (masked) and the health recipients, to confirm.
- **Test P1 to E and S:** "KD TEST: monthly alert test. If you got this text and the email, alerts work. Nothing to do."

**H24 `healthGates`.** Daily.
- **P1 → E, S:** a campaign is ACTIVE while NHS_FIFE_LETTER_ID or CALL_CARD_APPROVED is empty.
- **P2 → E (weekly; daily in the last 7 days before a deadline):**
  - PRIORITY_RULE_SIGNED empty;
  - festive cover not set (from 24 Nov);
  - LAST_LIST_UPDATE over 28 days;
  - budget over £20 with more than 42 days to OPENING_TARGET.
- **SMS:** "KD P1: Facebook ads are live but the NHS Fife letter is not recorded (NHS_FIFE_LETTER_ID). Record it or pause the ads."

**Manual-run helpers**
- `healthTestAlert()`: fire-drill alert.
- `healthSetBaseline()`: run after deliberately deleting test rows.
- `healthResendFailedTexts()`: R4 step 5. Calling hours only; skips DNC and Duplicate.
- `healthInstallTriggers()`.

### 3.4 Outside watchers (browser Claude sets them up; they don't depend on Google)
- **healthchecks.io:** the 3 checks in S2, alerting the owner's personal email plus a push integration.
- **UptimeRobot** (check its terms allow business use; otherwise a paid plan or a similar service). Keyword monitors every 5 min, alerting only after 2 failures:
  - /register/ must contain `script.google.com/macros/s/`;
  - /privacy.html must contain `ClickSend`;
  - /l/ must contain `register/?src=leaflet`;
  - /b/ must contain `register/?src=banner`;
  - /exec?action=ping must contain `pong`.
  - Alerts go to the owner's personal email and the app.
- **Meta Automated Rules** (free, inside Meta):
  - CPL over £3.50 over 3 days (at least 5 results) → notify;
  - 7-day frequency over 3 → notify;
  - spent over £15 today with 0 results → notify;
  - Leads today over 30 (45 with two callers) → turn off and notify.

### 3.5 Changes to existing files that the health checks need
- **Ads chat, `meta-leads.gs`:**
  - healthAssertSheet() first in pollMetaLeads;
  - store META_LAST_ERR;
  - an alert instead of the silent return when properties are blank;
  - failed leads: retry, then the Failed leads tab plus P1;
  - healthMark with the clean flag;
  - handleLead sends first, then writes one row (no getLastRow), writes "Assigned to" only on SUCCESS, and uses ASCII alert text;
  - healthNotifyOnce sends before recording and copies HEALTH_EMAIL;
  - backlogCheck calls healthBacklogCheck, and the wording changes to "campaign budget";
  - eveningReport counts Unreachable, Withdrew, Wrong number and Not interested, and prints HEALTH_VERSION and open alerts;
  - new forms start from created_time;
  - META_LEAD_FIELDS.
- **Ads chat, `meta-ads.gs`:**
  - alerts go through healthAlert;
  - fix "Leads still arrive (that's a separate script)". It's false when META_ADS_TOKEN is empty, because a dead token stops both.
- **Leaflet chat, `apps-script.gs`:**
  - doPost: try/catch → Failed sign-ups tab plus P1, reply "error";
  - healthAssertSheet();
  - `doGet(action=ping)` → "pong " + HEALTH_VERSION after the sheet check;
  - honour WEB_SMS_PAUSED;
  - SMS_HOURLY_MAX 40 / SMS_DAILY_MAX 300;
  - ukMobile accepts "+44 (0)7…", "0044 7…" and "7xxxxxxxxx";
  - sendSms: missing keys or a bad alert number → healthAlert P1;
  - source allow-list;
  - healthMark("doPost").
- **Leaflet chat, `tracking.gs`:**
  - healthMark in each trk function;
  - trkSmsType recognises "KD P1" and "KD TEST" as health messages;
  - the balance alarm uses H13's key, so there's no double email.
- **Website chat:**
  - block submit unless ENDPOINT is an /exec URL (better: read the reply);
  - optional marketing box and consent_version;
  - commit the real /exec URL;
  - privacy page fixes;
  - align the questions with the Meta form.

### 3.6 Fire drill (before launch; every alert proven once; ONCALL_MOBILE = owner, with ONCALL_MOBILE_UNTIL)
1. `healthTestAlert()` → the owner gets an SMS, a personal email and a healthchecks fail-and-recover.
2. META_API_VERSION = `v2.0` → H2 P1 within 10 min → clear it. (Don't touch the token.)
3. Rename "Status" to "Status x" → H4 P1 within 5 min, and the poller stops → rename it back.
4. ONCALL_MOBILE = `0770` → H3 P1 → restore it.
5. Blank HEALTH_PING_POLLER → healthchecks emails within 15 min → restore it.
6. A test row 70 min old with a blank Status, in calling hours, with HEALTH_BACKLOG=1 → H5 → restore and delete the row.
7. A temporary UptimeRobot monitor on /nonexistent → alert → delete the monitor.
8. Log each pass in the Change log tab. A check that hasn't fired in a drill isn't "covered".

---

## 4) Manual checklists

### 4.1 Daily: staff checker (15 min; weekends: the named weekend cover or the owner)
**08:00 (10 min)**
1. **Ads Manager (partial access):**
   - the campaign is On and "Active";
   - both ads are Active, with nothing Rejected or "With issues";
   - yesterday's spend was close to the budget;
   - there's no billing banner.
   - If the 30-leads rule switched the campaign off, turn it on only after the caller confirms the overnight leads are called.
   - Problems: R1, R2 or R10, and tell the owner.
2. **business.facebook.com/accountquality:** no restriction on the Page or the ad account.
3. **Waiting list, "To call" view:**
   - How many "Call 8am" rows are there?
   - Does the Call log show calls after the caller's start time?
   - Caller absent → tell the owner (R5).
4. **Health log tab:** is any P1 still open? Make sure the owner knows.
5. **Business Suite inbox** (comments and messages since last night):
   - reply from the reply bank;
   - hide comments with phone numbers, addresses or health details, and send a DM instead;
   - "stop" → the caller sets DNC today (R9);
   - pain → the urgent template;
   - "nobody called me" → find the row and tell the caller;
   - scam or impersonation → tell the owner.

**20:30 (5 min)**

6. Check the inbox again. Note the number still unanswered.
7. Fill in today's row in the **Daily checks** tab: comments new / replied / unanswered at 21:00, risky comments, DMs, median reply time, common question, caller shift hours, who worked.

**Mondays, add:** search Facebook and Instagram for "Kirkcaldy Dental" copycat Pages, and scan the banner's QR code.

### 4.2 Weekly: owner (Monday, about 30 min)
1. **Numbers:** read the Monday numbers email and the metrics chat's report. Decide the week's budget using the runbook §8 rules. Never go above £25 without a second caller.
2. **Health log:** P1/P2 count for the week, anything still open, false alarms (more than 2 → ask the ads chat to tune).
3. **Calls (first 4 weeks):** listen to or sit in on 5 calls. Spot-check 10 rows: Status against Call history, no health details in Notes, every DNC request honoured.
4. **Ads Manager:**
   - Activity history: no unknown people or changes;
   - payment method and card expiry;
   - spending-limit headroom;
   - frequency;
   - 3-day CPL.
5. **Access:**
   - the people lists for the Page, Business portfolio and ad account (no unknowns, 2 admins with 2FA);
   - sheet sharing;
   - ONCALL_MOBILE is right.
6. **ClickSend:** balance, auto top-up still on, monthly spend.
7. **Logs:** Complaints and Requests due dates. Days since the last list update. Opening readiness (every fortnight). List size against capacity.
8. **Backups:** the backup folder has 7 recent copies. Open one.
9. **Calendar:** check off this plan's dates: 24 Nov, 1 Dec, 22 Dec, 5 Jan, and the API-version expiry.

### 4.3 Before launch: browser Claude (in order; stop at any failure)
1. **Code:**
   - The owner merges: PR #3 into the ads branch → a new PR, ads branch → `main` → PR #1 → PR #2. A test merge is clean.
   - Record the `main` commit hash in the Change log.
   - Check `main` has:
     - metaGraph() with v27.0;
     - meta-ads.gs;
     - tracking.gs;
     - health.gs;
     - leadText identical in both files.
   - Paste only from that commit.
2. **Accounts:**
   - Page, portfolio and ad account (GBP, Europe/London).
   - Second admin on the Page, portfolio, ad account and developer app.
   - 2FA required for everyone.
   - Spending limit about £900.
   - Business verification started.
   - App is Live, and App Review submitted if Meta asks.
3. **Token:** System User assigned the Page, the app and the ad account; expiry "Never" in the Access Token Debugger; Leads access includes the app and the System User.
4. **Script setup:**
   - all four files pasted;
   - project and sheet time zones set to London (the sheet is Etc/GMT today);
   - every Script Property, including HEALTH_*;
   - authorise with "Select all".
5. **Triggers:**
   - Run installLeadTriggers, trkInstallTriggers and healthInstallTriggers. adsInstallTriggers runs on launch day.
   - The Triggers page shows 14 (17 after launch day), all owned by info@.
   - Each is set to "Notify me immediately".
   - Gmail filter forwards apps-scripts-notifications@google.com to the owner.
6. **Outside watchers:** set up healthchecks.io and UptimeRobot (3.4). Run the fire drill (3.6).
7. **Sheet:**
   - Share it with the caller's own account (edit) and the staff checker (view).
   - Protect row 1, the Dashboard and the script columns.
   - Phone column as plain text.
   - Create the "To call" filter view.
   - The caller edits one Call outcome on their own phone.
8. **Tests (runbook Step 6), plus:**
   - **a real lead from someone with no role** gives a row with Lead ID **and Ad ID** filled (through a live ad);
   - the alert appears on the caller's lock screen;
   - a website sign-up typed "+44 (0)7…" gets texted;
   - DNC, repeat and after-hours tests.
9. **Restore checklist, signed by the owner:**
   - CALL_HOURS `8-21`;
   - ONCALL_MOBILE = the caller;
   - BACKLOG_ALERT `10`;
   - no `_UNTIL` left;
   - test rows deleted before 8am;
   - H3 shows nothing.
10. **Compliance gates:**
    - NHS Fife letter in Drive (NHS_FIFE_LETTER_ID);
    - call card approved;
    - priority rule signed, or "Be first in line" removed;
    - privacy page passes H16;
    - ICO fee paid;
    - DMARC record added.
11. **Campaign:**
    - Instant forms only;
    - KY1–KY5, "living in";
    - "Reach more people" unticked;
    - age 18;
    - every Advantage+ enhancement off;
    - Automated Rules set up;
    - the owner says "yes" to the previews.
12. **Launch day:** LAUNCH_DATE, ADS_EXPECTED_ON=1, ADS_ALLOWED_CAMPAIGNS, ADS_EXPECTED_BUDGET. Run adsInstallTriggers. The next hourly H12 is clean.

---

## 5) Runbooks for the 10 most likely failures
Every runbook ends the same way: confirm the matching check shows RESOLVED, and log what happened and when in the Change log tab and HANDOFF.md. "Script Properties" always means Apps Script, opened in the info@ Chrome profile.

**R1 Ad rejected** (H12 "rejected" or "with issues")
1. Don't edit the live ad. Don't create a new ad account or Page. The other ad keeps bringing in leads.
2. Read the reason: Ads Manager → Ads → the ad → "View errors", or business.facebook.com/accountquality.
3. Forward the alert email and the reason to the ads chat.
4. **If it looks wrong** (for example "social issue" for the word NHS): Account Quality → Request review → "This is a commercial dental practice advertising its waiting list, not an issue or political ad."
5. **If the reason is fair:**
   - the ads chat writes new wording within BRAND.md;
   - duplicate the ad and paste the new text;
   - check every Advantage+ enhancement is off;
   - preview every placement;
   - owner says yes → publish → turn the rejected ad off.
6. If both ads are down for more than 24 h, keep the leaflets and website going. Don't raise the budget when the ads come back.

**R2 Card declined or account unpaid** (H12: status 3 or 9, PENDING_BILLING_INFO, £0 by 1pm)
1. Go to Ads Manager → Billing & payments. Look for "Payment failed" or an outstanding balance.
2. Phone the bank. Confirm the Meta charges are genuine and ask them to allow them. A fraud check is the usual cause.
3. Payment methods → **Pay now** with the cleared card, or add the backup card, make it primary, then Pay now.
4. The ads restart by themselves, usually within about an hour. If they aren't "Active" after 2 hours, check the campaign's Delivery column.
5. If the status is "disabled" (2) rather than unpaid, follow R10. Never open a second ad account.

**R3 Token expired, or Facebook leads not arriving** (H1, H2, H8–H11)
1. Apps Script → Executions → filter pollMetaLeads → read the latest error code.
2. **190** (token expired or invalid):
   - Go to business.facebook.com/settings → Users → System users → "Lead script" → Generate new token.
   - Choose the app. Expiry: Never. Tick the same permissions as runbook 5.2.
   - Copy the token into Script Properties → META_PAGE_TOKEN → Save.
3. **10 / 200 / 100** (permission): check:
   - Integrations → Leads access → the Page allows the app and "Lead script";
   - System users → Lead script → assigned assets: Page (Full control), app, ad account;
   - developers.facebook.com → the app is still Live.
4. **4 / 17 / 32 / 613 / 80005** (rate limit): wait; it retries every minute. Over 2 hours → tell the ads chat.
5. **2635, or "version deprecated":** set META_API_VERSION to the newest version listed at developers.facebook.com/docs/graph-api/changelog.
6. **H10 says a new form isn't being read:** copy its ID (Ads Manager → the ad → Instant form) into META_FORM_IDS as ",ID". Keep the old ID.
7. Open the meta-leads file → choose pollMetaLeads → Run. Executions should be clean and healthchecks should turn green.
8. **Catch-up:**
   - After an API error, the script replays the missed leads by itself, oldest first. Each gets the normal text, and the caller gets one alert per lead. That list of alerts is the call list.
   - **Don't blank ONCALL_MOBILE.** A blank number silently stops every alert.
9. **Leads that won't replay** (the Failed leads tab, H8's list, or a new form's earlier leads):
   - Download the CSV for the gap from Leads Center.
   - Add each person with "Manual add" (until it's built: a real date in Signup Time, Source facebook, Notes "added by hand – no auto text").
   - The caller rings them first.
   - In calling hours, send each thank-you text one at a time from the ClickSend dashboard, using the exact leadText wording.
10. Send one Testing Tool lead with the owner's details, then delete the row.

**R4 ClickSend out of credit or not sending** (H13, H14)
1. **Credit:** ClickSend → top up £50. Check auto top-up is on (£20 when under £10). Fix or replace the card.
2. **Not credit:** SMS → History → read the status.
   - "sender ID" → ClickSend support;
   - "invalid credentials" → Dashboard → API credentials → copy the key into CLICKSEND_KEY;
   - account on hold → support.
3. **Until it's fixed:** the caller works the sheet (blank Status, oldest first) and uses the Business Suite app notifications.
4. **Test:** a website sign-up with the owner's mobile → texts arrive → delete the row.
5. **Missed thank-you texts:** in calling hours, run `healthResendFailedTexts()` (until it's built: one at a time from the ClickSend dashboard). Never upload a list.

**R5 Caller off sick** (the caller tells the owner and the backup by 07:30, or H6/H7 fires)
1. **Switch alerts** (owner or deputy): Script Properties → ONCALL_MOBILE = **the backup's number only**, and ONCALL_MOBILE_UNTIL = the return date.
2. **Text the backup:** "You're on calls today. Waiting list → filter view 'To call': Call 8am first, then blanks, oldest first. Call card in Drive folder 8."
   - The backup must already have edit access and the call card.
3. **Test:** one website sign-up with the owner's details → the backup gets the alert → delete the row.
4. **No backup available:** Ads Manager → campaign → budget £10/day, or turn it off and set ADS_PAUSED_UNTIL. Leads still get their automatic text.
5. **On return:**
   - restore ONCALL_MOBILE, delete the `_UNTIL`, and run the test sign-up again;
   - clear the backlog, oldest first;
   - check the 9pm report says "Still waiting over an hour: 0";
   - restore the budget.

**R6 Backlog** (H5, H7)
1. **Same hour:** Ads Manager → the **campaign** → Budget −20%.
   - Over 10 waiting, or the oldest over 24 h: −50%, or turn it off for the rest of the day (set ADS_PAUSED_UNTIL).
2. **Second caller:** ONCALL_MOBILE = "caller,second", ALERT_MODE = rotate, BACKLOG_ALERT = 15.
3. **Call order:** Call 8am first → blank rows oldest first → overdue call-backs (Next call due).
4. **Wording:** once LEAD_TEXT_MODE is built, set it to `delayed`.
5. **Anyone not reached after 72 h:** one service text: "Sorry for the wait - you're on our list, no need to do anything. We'll call you between 8am and 9pm."
6. **Raise the budget again** only after 2 days in a row with fewer than 5 waiting at 9pm.

**R7 Website down** (UptimeRobot, H16)
- **(a) The whole site is down:**
  - hPanel → the site's status and billing (plan expired?);
  - Security → SSL → reinstall and Force HTTPS;
  - Google Admin → Domains → DNS: A @ = Hostinger's IP, CNAME www → kirkcaldydental.co.uk, MX unchanged.
- **(b) /register is missing the /exec link or shows the placeholder:**
  - re-upload register/index.html from `main` (with the real ENDPOINT);
  - purge the cache;
  - test on 4G in a private tab until a row appears.
- **(c) The web-app ping fails:**
  - Apps Script → Deploy → Manage deployments: active deployment, Execute as Me (info@), access Anyone;
  - if someone made a "New deployment", put its URL into ENDPOINT, purge and test.
- **(d) /l or /b returns 404:**
  - upload site/l/index.html and site/b/index.html from `main`, then purge;
  - scan the printed QR codes with an iPhone and an Android phone;
  - confirm a Visits row and a test sign-up row.
- **Meanwhile:**
  - Down more than 2 h at peak: pause leaflet drops.
  - The ads can keep running, because the form doesn't use the site. But if /privacy.html is down for more than 24 h, pause the ads.
  - Sign-ups lost while /register was broken can't be recovered. A public "please join again" post needs the owner's OK.

**R8 Form spam** (H20, H14 bulk, H19)
1. **Texts:**
   - H20 has already paused website texts (WEB_SMS_PAUSED). Rows still save.
   - Until that's built: in Hostinger, replace the form on /register with "Sign-ups here are paused for a few hours. Please join via our Facebook page or email info@kirkcaldydental.co.uk."
   - **Don't blank CLICKSEND_KEY.** It silently stops Facebook lead texts and caller alerts too.
2. **Bot rows:** copy them to a "Spam" tab as evidence, then remove them from Waiting list so callers don't ring them.
3. **Real people texted because a bot entered their number:** add them to DNC/Suppression, send nothing else, and log any complaint.
4. **ClickSend:** check the spend. Confirm it's restricted to the UK. Contact support if the spend is large.
5. **Harden, then unpause:** the leaflet chat hardens the form (phone required, UK mobiles only, one sign-up per number per 10 min, caps, Turnstile if needed) → New version → purge → test → clear WEB_SMS_PAUSED.

**R9 Complaint or opt-out**
- **Opt-out** ("stop", "remove me", "don't call", by any channel):
  1. **Same day:** Call outcome or Status = DO NOT CONTACT. Notes: date, channel, "opt-out" (no health details). Add them to the Suppression tab once it exists.
  2. Search ClickSend history and info@ Sent for any contact after the opt-out. If there was any, send one short apology and log it.
  3. A deletion request is an erasure request: log it with a due date one month away. Keep only the suppression entry.
- **Complaint:**
  1. Log it in the Complaints tab and acknowledge the same or the next working day.
  2. The complaints lead checks Call history, the Call log and the SMS log, and replies in writing: within 5 working days for front-line resolution, 20 for an investigation.
  3. Personal data involved → breach assessment within 72 hours.
  4. Public comment → "We're sorry to hear this; please email info@kirkcaldydental.co.uk so we can look into it." Never post details in public.
  5. ICO, ASA or NHS Fife contact → the owner and compliance lead the same day.

**R10 Page restricted** (or ad account disabled, or the owner's profile restricted)
1. Don't create a new Page, portfolio or ad account. It makes things worse.
2. Go to business.facebook.com/accountquality → the asset → read the reason → **Request review**. Complete ID or selfie checks on the owner's usual device.
3. If the owner's profile is the restricted one, the second admin keeps the Page and the ad account running.
4. **Meanwhile:**
   - watch H1, H2 and H8, because lead reads may fail too;
   - push leaflets and the website;
   - no new posts.
5. No answer in 48 h → Meta Verified support (if subscribed) or a Business Help Centre case.
6. **Plan B, only with the ads chat:** run the same Page and form from a group ad account in good standing. First test that the lead script can still read leads (row 84).

---

## 6) Single points of failure and how to remove them

| Single point | What breaks | Fix | Who | By |
|---|---|---|---|---|
| The owner's Facebook profile is the only admin | Page, ads, leads, token renewal | A second trusted admin with 2FA on the Page, portfolio, ad account (full control) **and developer app**. They can regenerate the System User token. | owner, browser Claude | setup night |
| The owner is the only decision-maker | Budget cuts, Script Properties, alerts nobody acts on | A named deputy: Ads Manager budget rights, Apps Script editor, on HEALTH_EMAIL and HEALTH_SMS, trained on R1–R10 | owner | week 1 |
| One caller | Calls stop | 1–2 UK-based backup callers with their own logins, sheet access, the call card, the VoIP app and a test alert done. Absence rule by 07:30. | owner | before week 2 (16 Nov) |
| info@ (shared login, owner of everything) | Gmail, sheet, scripts and web app all at once | A second super admin that isn't info@. info@ 2-step verification with two methods plus printed codes in the safe. Recovery to the owner's personal address. Callers on their own accounts. | owner | week 1 |
| The Apps Script project | All automation | The outside heartbeat (H1). Code on `main`. A one-page **manual mode** card: Business Suite lead notifications, Leads Center CSV every 2 h, ClickSend templates, how to pause the ads. | ads chat | setup night |
| The Waiting List sheet | Every lead record | Nightly values-only backups (H21, 30 kept), shared with the owner's personal account. Protected ranges. A monthly test restore into a copy. | ads chat, owner | week 1 |
| ClickSend (one account, one card) | All texts | Auto top-up plus a backup card. A second login for the owner. Key rotation written down. The Business Suite app as a channel that doesn't use ClickSend. | owner, browser Claude | setup night |
| The Meta payment card | Ads stop | A backup payment method. The bank warned in advance. | owner | setup night |
| Hostinger / the IT contact | Site, QR codes, privacy link | The owner's own Hostinger login with 2FA. Auto-renew for 12+ months. A fallback static host ready. | owner | before leaflets |
| Domain and DNS (Google / Squarespace) | Site and email | Two super admins. Auto-renew for 2 years. A screenshot of the DNS zone before any change. | owner | week 1 |
| The owner's phone (all the 2FA codes) | Locked out of everything | Backup codes on paper in the safe. A second 2FA method (authenticator app or security key). | owner | setup night |
| GitHub (one owner, public) | Code and docs exposed or lost | Make the repo private. Add a second owner or collaborator. | owner | week 1 |
| One staff checker | Comments and messages unanswered | A named backup and weekend cover, both with partial Page access and the Business Suite app. | owner | week 1 |
| The Claude chats hold the know-how | Nobody at the clinic can fix a bad paste | The runbooks in this plan, the manual mode card, HANDOFF on `main`, and the fire drill run with the deputy watching. | ads chat, owner | before week 2 |
| One Facebook Page | Ads and comments stop | Don't create a second Page. Leaflets and the website keep running. A group ad account as Plan B, only once tested (row 84). | owner, ads chat | as needed |

**Bottom line for the owner:** once the "before setup night" items are done, a failure can still happen, but it shouldn't go unnoticed for more than about 15 minutes, and every likely failure has a written fix that someone other than you can follow. Until the fire drill passes, treat the system as not monitored.