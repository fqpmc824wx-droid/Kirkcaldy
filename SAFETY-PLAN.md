# Kirkcaldy Dental – Launch safety plan

**For:** Nas (owner), the deputy, browser Claude on setup night, and every Claude chat.
**Written:** 8 Nov 2026 by the Launch-safety chat, from the pre-mortem (research/premortem-final.md). Where the owner has decided something (OWNER-DECISIONS.md), that decision wins.
**Google Doc copy:** [Launch safety plan](https://docs.google.com/document/d/1Pq8xtwQcC6wErrxMkSWoC6Nz8OtPm5tnWaMEXR0fajU/edit) in Drive → "Kirkcaldy Dental – Print files & marketing" → "10. Launch safety".

## In one minute

- No plan can stop every problem. This plan makes sure that **when something breaks, a named person hears about it fast and knows what to do.**
- Most problems raise an alert within 5–15 minutes. Two outside services (healthchecks.io and UptimeRobot) watch Google from the outside, so even a total Google outage is noticed.
- **Until the fire drill (part 3) has passed, treat the system as not watched.**
- Your jobs are in part 6: fill in the "who covers what" table, and give the few yes/no answers still open.

---

## 1. The top 15 risks, and what protects you

| # | What could go wrong | What protects you |
|---|---|---|
| 1 | Setup night uses an old copy of the code. | Everything is merged into one place first. Browser Claude copies only that version. The daily check shows the version number. |
| 2 | Facebook sign-ups stop reaching the sheet and nobody notices. | A real test sign-up from someone with no Page role before ads go live. An hourly check that every Facebook sign-up is in the sheet. An outside "heartbeat" that alerts if the checker goes quiet. |
| 3 | Alerts land in info@ and nobody sees them. | Important alerts go to your personal email (and your phone by text, if you say yes). A daily "all OK" email, so silence gets noticed. |
| 4 | Not enough people ringing, or the caller is off. | Add a caller for about every 20–25 new sign-ups a day (staff are available). Alerts when someone has waited 2 hours, when no calls are logged, or when the overnight list isn't done by 10am. A named backup caller. |
| 5 | The caller says the wrong thing, or someone is in pain. | A one-page call card with approved wording and the urgent route (NHS 24 on 111), approved by you before the first call. You listen to 5 calls a week for the first 4 weeks. |
| 6 | Texts stop (ClickSend credit, card, sender name). | Auto top-up. Credit checked 4 times a day. Every text checked for delivery. Callers can work from the sheet without texts. |
| 7 | Website and QR sign-ups are lost while the page still says "Thank you". | No leaflets or banner until a test sign-up appears in the sheet. An hourly check of the page, plus an outside monitor every 5 minutes. The page shows an error instead of a false thank-you. |
| 8 | Someone who said "stop" is contacted again, or offers go to people who didn't tick the box. | "Do not contact" set the same day. Automatic checks for missed "stop" notes and texts sent to blocked numbers. Offers only go to people who ticked "Yes". |
| 9 | Legal wording is wrong (website consent box, privacy page). | Privacy page fixed before ads. Consent box fixed before leaflets. Both checked automatically every day. |
| 10 | The "new NHS practice" claim is questioned, or the opening date slips. | NHS approval exists: keep a copy of the NHS Fife approval email or letter in Drive "11. Legal & compliance". Budget follows the weeks left to opening. A "date has changed" message is ready. |
| 11 | An ad is rejected, the card is declined, or the Page is restricted. | An hourly ad check. A backup card. A second admin. Written fixes (part 5: R1, R2, R10). |
| 12 | The sheet is broken or rows are deleted. | Header row and script columns locked. A check every 5 minutes pauses the scripts before anything is misfiled. A nightly backup copy that raises an alarm if rows go missing. |
| 13 | An account is hacked or data leaks. | Two-step login on every account. Code store made private. Sheet shared by name only. Each caller has their own login. A breach procedure. |
| 14 | Only you can fix anything. | A named deputy. A second admin on every account. Backup codes in the clinic safe. A one-page "manual mode" card. |
| 15 | Black Friday and Christmas: higher costs, staff away, many people waiting. | No budget rises 25 Nov – 2 Dec. By 1 Dec, festive cover is named, or ads drop to £5–10 a day. Holiday wording for texts. |

**Cost-per-sign-up alarms** (your figures): **warning above £5, pause above £8** (3-day average, after at least £30 spent).

**Owner decisions applied here:** mixed NHS and private practice; adults and children; "Be first in line" stays; callers are not a limit (no budget cap because of callers, unless nobody at all is available); NHS approval already exists (keep a copy, no new letter); the photos are AI/stock (no model release needed – keep a note of the tool or licence, and never call them real patients).

---

## 2. Before-launch safety checklist (browser Claude, in this order)

Stop at the first thing that fails. Tick each one in the sheet's Change log tab.

1. **Code is in one place.**
   - The owner merges the branches into `main` in the agreed order. Record the `main` commit code in the Change log.
   - Check `main` has: the lead script on Meta version 27, meta-ads.gs, tracking.gs, health.gs, and the same lead text in both files.
   - Copy code only from that commit.
2. **Accounts.**
   - Page, Business portfolio and ad account (GBP, Europe/London).
   - A second admin on the Page, portfolio, ad account **and the developer app**.
   - Two-step login switched on for everyone.
   - Ad account spending limit about £900.
   - Business verification started. App set to Live; submit App Review if Meta asks.
3. **Token.** The "Lead script" system user has the Page, the app and the ad account. The token says "Never" expires. Leads access includes the app and the system user.
4. **Script setup.**
   - All script files pasted (apps-script, tracking, meta-leads, meta-ads, health).
   - Project and sheet time zones set to Europe/London (the sheet is Etc/GMT today).
   - **Before anything else, run `healthAddMissingHeaders()`** so row 1 has all 22 headings. Until then the website replies "error" to every sign-up and healthInstallTriggers refuses to run.
   - Every Script Property filled in, including the new HEALTH_ ones (list in part 7).
   - When Google asks for permissions, tick **"Select all"**.
5. **Timers (triggers).**
   - Run installLeadTriggers, trkInstallTriggers and healthInstallTriggers. Run adsInstallTriggers on launch day.
   - The Triggers page shows 14 before launch day and 17 after, all owned by info@, each set to "Notify me immediately".
   - Gmail filter in info@: forward mail from apps-scripts-notifications@google.com to the owner's personal email.
6. **Outside watchers.** Set up healthchecks.io and UptimeRobot (part 4). Then run the fire drill (part 3).
7. **Sheet.**
   - Share with each caller's own account (edit) and the staff checker (view).
   - Protect row 1, the Dashboard and the script columns.
   - Phone column as plain text.
   - Create the "To call" filter view.
   - A caller changes one Call outcome on their own phone, to prove access works.
8. **Tests** (runbook Step 6), plus:
   - **a real sign-up from someone with no Page role**, through a live ad, gives a row with Lead ID and Ad ID filled in – **no ads go live until this passes**;
   - the caller alert appears on the caller's locked phone screen;
   - a website sign-up typed as "+44 (0)7…" still gets its text;
   - "do not contact", repeat sign-up and after-9pm tests.
9. **Put test settings back** (owner signs it off):
   - CALL_HOURS `8-21`; ONCALL_MOBILE = the caller; BACKLOG_ALERT `10`;
   - no `_UNTIL` settings left; test rows deleted before 8am;
   - the settings check shows no problems.
10. **Paperwork gates.**
    - Copy of the NHS Fife approval saved in Drive "11. Legal & compliance"; its Drive file ID goes in NHS_FIFE_LETTER_ID. (If this is empty while ads are live, the system sends an urgent alert.)
    - Call card approved by the owner (CALL_CARD_APPROVED).
    - "Be first in line" stays (owner decision): record the invite-order rule (sign-up order, households kept together) and its date in PRIORITY_RULE_SIGNED.
    - Privacy page passes the website check. ICO fee paid. DMARC record added.
11. **Campaign.** Instant forms only; KY1–KY5, "people living in"; "Reach more people" unticked; age 18+; every Advantage+ extra off; Meta Automated Rules set (part 4c); the owner says "yes" to the previews.
12. **Launch day.** Set LAUNCH_DATE, ADS_EXPECTED_ON=1, ADS_ALLOWED_CAMPAIGNS, ADS_EXPECTED_BUDGET. Run adsInstallTriggers. The next hourly ad check is clean.

---

## 3. The fire drill (prove every alert works once)

Do this before launch. For the drill, alerts go to the owner's phone: set ONCALL_MOBILE to the owner's number **and** ONCALL_MOBILE_UNTIL to tomorrow, so it can't be forgotten.

1. **Test alert.** Run `healthTestAlert()`. The owner should get a text, a personal email, and a healthchecks "down then up" email.
2. **Facebook link broken.** Set META_API_VERSION to `v2.0`. Within 10 minutes you get a "Meta error" alert. Put it back. (Never touch the token for this.)
3. **Sheet changed.** Rename the "Status" heading to "Status x". Within 5 minutes you get an alert and the lead checker pauses. Rename it back.
4. **Bad phone setting.** Set ONCALL_MOBILE to `0770`. You get a "setting wrong" alert. Put it back.
5. **Heartbeat goes quiet.** Blank HEALTH_PING_POLLER. Within 15 minutes healthchecks.io emails you. Put it back.
6. **Someone waiting too long.** During calling hours, add a test row 70 minutes old with no Status, and set HEALTH_BACKLOG to 1. You get a "leads waiting" alert. Put HEALTH_BACKLOG back to 5 and delete the row.
7. **Website down.** In UptimeRobot, add a temporary monitor on kirkcaldydental.co.uk/nonexistent. You get an alert. Delete that monitor.
8. **Write it down.** Log each pass in the Change log tab. **Any check that hasn't fired in a drill doesn't count as covered.**
9. **Put the drill settings back** (part 2, step 9).

---

## 4. Outside watchers (browser Claude sets these up)

These work even if Google or ClickSend is down. All alerts go to the **owner's personal email** plus a **phone app notification**. Sign up with the owner's personal email, not info@. Store the logins in the password manager, never in the sheet.

### 4a. healthchecks.io – "is the system still running?"

1. Go to healthchecks.io → **Sign Up** → owner's personal email → open the link in the email.
2. Name the project **Kirkcaldy Dental**.
3. Click **Add Check**. Name it `poller`. Click the period settings: **Period 5 minutes, Grace 15 minutes** → Save.
4. Copy its **ping URL** (starts `https://hc-ping.com/`). In Apps Script → Project Settings → Script Properties, paste it into `HEALTH_PING_POLLER`.
5. **Add Check** again: `daily`, **Period 1 day, Grace 2 hours** → copy the ping URL into `HEALTH_PING_DAILY`.
6. **Add Check** again: `backup`, **Period 1 day, Grace 3 hours** → copy the ping URL into `HEALTH_PING_BACKUP`.
7. **Integrations** tab → **Email**: add the owner's personal email (and the deputy once named). Confirm from the inbox.
8. **Integrations** → add one phone push: **Telegram**, **Signal** or **ntfy** (owner's choice; Telegram is simplest – click "Add Integration", open the bot on the owner's phone, press Start).
9. On each check, make sure both integrations are ticked.
10. After the scripts run for 15 minutes, all three checks should show green. If not, stop and tell the ads chat.

### 4b. UptimeRobot – "is the website and sign-up page working?"

First check UptimeRobot's terms. If the free plan doesn't allow business use, take the cheapest paid plan (or a similar service).

1. Go to uptimerobot.com → **Register** → owner's personal email → confirm.
2. **My Settings → Alert Contacts**: add the owner's personal email; install the UptimeRobot app on the owner's phone and sign in (that adds phone alerts).
3. Click **+ Add New Monitor**. For each line below choose **Monitor Type: Keyword**, **interval 5 minutes**, **Alert when: keyword does NOT exist**, tick both alert contacts. If the plan allows it, set alerts to fire only after **2 failures in a row**.

| Friendly name | URL | Keyword |
|---|---|---|
| KD register page | https://kirkcaldydental.co.uk/register/ | `script.google.com/macros/s/` |
| KD privacy page | https://kirkcaldydental.co.uk/privacy.html | `ClickSend` |
| KD leaflet QR | https://kirkcaldydental.co.uk/l/ | `register/?src=leaflet` |
| KD banner QR | https://kirkcaldydental.co.uk/b/ | `register/?src=banner` |
| KD sign-up engine | the web app address ending `/exec?action=ping` | `pong` |

4. Add these **after** the website is live on Hostinger (today the domain still shows the Squarespace parking page). The sign-up engine monitor can be added on setup night.
5. All five should show green ("Up").

### 4c. Meta Automated Rules (free, inside Ads Manager)

Ads Manager → **Rules → Create rule**, one at a time:
- Cost per lead **above £5** over the last 3 days (after at least £30 spent) → **notify**.
- Cost per lead **above £8** over the last 3 days (after at least £30 spent) → **turn off the campaign and notify**.
- 7-day frequency above 3 → notify.
- Spent over £15 today with 0 leads → notify.
- Leads today above about 1.2 × what the callers can ring (30 for one caller, 45 for two) → turn off and notify. Raise it as callers are added.

---

## 5. If things break: what to do

Each fix ends the same way: check the alert now says RESOLVED, and write what happened in the Change log tab.

**R1 – An ad is rejected**
1. Don't edit the live ad, and don't make a new ad account or Page. The other ad keeps working.
2. Read the reason: Ads Manager → the ad → "View errors".
3. Forward the alert email and the reason to the ads chat.
4. If the reason looks wrong: Account Quality → **Request review** – "This is a commercial dental practice advertising its waiting list, not an issue or political ad."
5. If it's fair: the ads chat writes new wording; duplicate the ad, paste it, preview, owner says yes, publish, then switch the rejected one off.

**R2 – Card declined or account unpaid**
1. Ads Manager → Billing & payments. Look for "Payment failed".
2. Phone the bank: say the Meta charges are genuine.
3. **Pay now** with the cleared card, or add the backup card, make it main, then Pay now.
4. Ads usually restart within an hour. If the account says "disabled", go to R10. Never open a second ad account.

**R3 – Facebook sign-ups not arriving**
1. Apps Script → Executions → pollMetaLeads → read the latest error number.
2. **190:** the access key has expired. Business settings → System users → "Lead script" → Generate new token (expiry Never, same permissions) → paste into META_PAGE_TOKEN.
3. **10, 200 or 100:** a permission is missing. Check Leads access, the system user's assets, and that the app is still Live.
4. **4, 17, 32, 613 or 80005:** Meta is slowing us down. Wait; it retries itself. Over 2 hours → tell the ads chat.
5. **"Version deprecated":** set META_API_VERSION to the newest version.
6. **New form not read:** add its ID to META_FORM_IDS (keep the old one).
7. Run pollMetaLeads once. The heartbeat should go green.
8. Missed people replay by themselves. **Never blank ONCALL_MOBILE** – it silently stops every alert.
9. Anyone still missing: download the CSV from Leads Center, add them by hand, the caller rings them first.

**R4 – Texts not sending**
1. Credit: ClickSend → top up £50. Check auto top-up is on.
2. Not credit: SMS → History → read the reason (sender name → ClickSend support; wrong key → copy the key into CLICKSEND_KEY again).
3. Meanwhile callers work from the sheet (blank Status, oldest first).
4. Test with a website sign-up using the owner's phone, then delete the row.
5. Re-send missed thank-you texts with `healthResendFailedTexts()` during calling hours. Never upload a list to ClickSend.

**R5 – Caller off sick**
1. Owner or deputy: Script Properties → ONCALL_MOBILE = **the backup's number only**, and ONCALL_MOBILE_UNTIL = the return date.
2. Text the backup: "You're on calls today. Waiting list → filter view 'To call': Call 8am first, then blanks, oldest first. Call card in Drive folder 8."
3. Test with one website sign-up, then delete the row.
4. If truly nobody is available: lower the budget to £10 a day or pause, and set ADS_PAUSED_UNTIL. People still get their automatic text.
5. On return: put ONCALL_MOBILE back, delete the _UNTIL, test again, clear the waiting list oldest first.

**R6 – Too many people waiting**
1. **First, bring in another caller** (staff are available): add their mobile to ONCALL_MOBILE, set ALERT_MODE to rotate and BACKLOG_ALERT to 15.
2. Only if nobody can be found: lower the campaign budget (20% for the day; 50% or pause if over 10 waiting or the oldest is over a day old).
3. Call order: Call 8am first → blank rows oldest first → overdue call-backs.
4. Anyone not reached after 72 hours gets one text: "Sorry for the wait - you're on our list, no need to do anything. We'll call you between 8am and 9pm."

**R7 – Website down**
1. Whole site down: Hostinger → check the plan hasn't lapsed; reinstall SSL; check the DNS records (don't touch the email records).
2. Sign-up page broken: re-upload it from `main`, clear the cache, test on 4G until a row appears.
3. Sign-up engine not answering: Apps Script → Deploy → Manage deployments – must be "Execute as me", access "Anyone".
4. QR pages show "not found": re-upload site/l and site/b, then scan the printed QR codes on an iPhone and an Android.
5. Down over 2 hours at a busy time: pause leaflet drops. Ads can keep running (they don't use the website), unless the privacy page is down for over a day.

**R8 – Spam sign-ups**
1. The system pauses website texts by itself for 2 hours. Rows still save.
2. Move bot rows to a "Spam" tab so nobody rings them.
3. Real people texted because a bot used their number: mark them "do not contact" and send nothing else.
4. Check ClickSend spend. **Never blank CLICKSEND_KEY** – it stops Facebook texts too.
5. The leaflet chat hardens the form, then unpause.

**R9 – Complaint or "stop"**
- **Stop / remove me / don't call:** same day, set Call outcome to DO NOT CONTACT. Note the date and channel only (no health details). Check nothing was sent afterwards; if it was, one short apology. A deletion request gets logged with a due date one month away.
- **Complaint:** log it in the Complaints tab, acknowledge the same or next working day, reply in writing within 5 working days (20 if it needs investigating). Public comment → "We're sorry to hear this; please email info@kirkcaldydental.co.uk so we can look into it." Anything from the ICO, ASA or NHS Fife → owner the same day.

**R10 – Page or ad account restricted**
1. Don't make a new Page or account.
2. business.facebook.com/accountquality → read the reason → **Request review**. Do ID checks on the owner's usual phone.
3. If the owner's own profile is blocked, the second admin keeps things running.
4. Meanwhile push leaflets and the website. No new posts.
5. No answer in 48 hours → Meta support case. Any "Plan B" ad account only with the ads chat, after a test.

**If everything is down – manual mode**
Business Suite app notifications for new sign-ups → download the Leads Center CSV every 2 hours → callers ring from that → thank-you texts one by one from ClickSend with the exact approved wording. Pause ads if this lasts more than a day.

---

## 6. Who covers what (owner to fill in)

Please type names in the empty boxes. Use first names only if you prefer. Never put passwords here.

| Role | What they do | Name | Mobile on file? | Done by |
|---|---|---|---|---|
| Deputy | Can change budget and script settings; gets the important alerts; trained on part 5 | | | Week 1 |
| Main caller(s) | Rings sign-ups 8am–9pm | | | Setup night |
| Backup caller | Takes over if a caller is off; already has sheet access and the call card | | | Before 16 Nov |
| Weekend cover | Checks alerts, ads and messages Sat/Sun; switches ads back on | | | Week 1 |
| Staff checker | Daily 08:00 and 20:30 checks; replies to comments | | | Week 1 |
| Backup staff checker | Covers the checker | | | Week 1 |
| Complaints lead | Owns complaints and data requests | | | Week 1 |
| Festive cover | Named person for each day 23 Dec – 4 Jan | | | 1 Dec |

**Second admin on each account**

| Account | Main admin | Second admin | Two-step login on? | Backup codes in safe? |
|---|---|---|---|---|
| Facebook Page | Owner | | | |
| Business portfolio | Owner | | | |
| Ad account | Owner | | | |
| Developer app | Owner | | | |
| Google Workspace (info@) | | | | |
| ClickSend | | | | |
| Hostinger | | | | |
| Domain / DNS | | | | |
| GitHub | Owner | | | |
| healthchecks.io | Owner | | | |
| UptimeRobot | Owner | | | |

**Still waiting for your answer** (from OWNER-DECISIONS.md): important-problem texts to your phone (never 10pm–7am)? Until you say yes, urgent problems reach you by email and the healthchecks/UptimeRobot phone app only. · Make GitHub private · deputy and backup caller names · website hosting.

---

## 7. New settings for setup night (Script Properties, no secrets shown)

| Setting | What to put |
|---|---|
| HEALTH_EMAIL | Owner's personal email, then info@kirkcaldydental.co.uk (add the deputy later) |
| HEALTH_SMS | Owner's mobile, only if the owner says yes to problem texts; otherwise leave empty |
| HEALTH_QUIET | `22-7` (no texts 10pm–7am) |
| HEALTH_PING_POLLER / _DAILY / _BACKUP | The three healthchecks.io ping links (part 4a) |
| META_PAGE_ID | The clinic Page ID |
| HEALTH_EXEC_ID | The web app ID from the /exec link |
| CALLER_SHIFT / CALLER_DAYS | Hours and days callers really work. Calls run 8am–9pm, so use `8-21` and the real days. A shorter shift (e.g. 9-17) means no "people waiting" alerts in the evening. |
| HEALTH_SITE | `https://kirkcaldydental.co.uk`, only once the site is live on Hostinger |
| HEALTH_BACKLOG | `5` |
| HEALTH_BALANCE_WARN / _CRIT | `8` / `4` with auto top-up on |
| ADS_EXPECTED_ON, ADS_PAUSED_UNTIL, ADS_ALLOWED_CAMPAIGNS, ADS_EXPECTED_BUDGET, FESTIVE_MAX | Ad watchdog settings (launch day) |
| NHS_FIFE_LETTER_ID | Drive file ID of the NHS Fife approval copy in "11. Legal & compliance" |
| CALL_CARD_APPROVED | Date the owner approved the call card |
| PRIORITY_RULE_SIGNED | Date the owner recorded the invite-order rule |
| OPENING_TARGET, LAST_LIST_UPDATE | Planned opening date; date of the last update to the list |
| `<NAME>_UNTIL` | End date for any temporary change |

The ads chat will confirm the final list once health.gs is finished.

---

## 8. Key dates

| When | What |
|---|---|
| Setup night | Parts 2, 3 and 4. Second admins. Backup card. |
| 16 Nov | Backup caller trained. |
| 24 Nov | Reminder: no budget rises 25 Nov – 2 Dec. |
| 1 Dec | Festive cover named, or ads drop to £5–10 a day 23 Dec – 4 Jan. |
| 22 Dec | Waiting list cleared before the break. |
| 5 Jan | Back to normal; check the budget. |
| Every Monday | Mystery-shopper test: the staff checker signs up once on the website (and once by the Facebook form, using the Page's form link) with their own details. Check: row appears, thank-you text arrives, caller alert arrives. Then mark the row TEST and delete it. Anything missing → tell the owner (part 5). |
| 1st of each month | Monthly test alert – check it reached your phone and email. |
| 21 Jan 2027 | Meta's old version switches off (already handled if `main` is on v27). |
