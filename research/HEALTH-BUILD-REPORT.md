All 34 review issues are fixed: 23 exactly as asked, 11 in a slightly different way that I explain below. None were rejected outright. All 124 tests in `leads/tests/` pass, including the reviewers' `review-bugs.js` (27 of 27). Nothing was committed or pushed, and I only edited files under `/home/user/Dental/leads/`.

## Files changed
- `/home/user/Dental/leads/health.gs`
- `/home/user/Dental/leads/meta-leads.gs`. The shared functions (alertTeam, callWindow, inCallHours, leadText, niceFirstName, leadsSheet, LEADS_TAB) are still byte-identical to apps-script.gs and to HEAD; a test checks this.
- `/home/user/Dental/leads/meta-ads.gs`
- `/home/user/Dental/leads/README.md`. These were small, targeted edits plus a new "Health checks" section. Another chat edited this file during the session (setup steps 1–7, the "Repeat sign-ups" and "Legal safeguards" sections). Those edits are not mine and I left them alone.
- `/home/user/Dental/leads/tests/harness.js` (mock for `folder.addViewer`), `run-all.js` (now also runs test-round2 and review-bugs), `test-checks.js` (one test updated for the new H8 rule).
- New: `/home/user/Dental/leads/tests/test-round2.js` (25 tests). `review-bugs.js` is the reviewers' file, unchanged.

## Checks implemented (trigger → level)
- **Every 5 min:**
  - H1 lead checker alive + healthchecks ping (P1)
  - H2 Meta errors (P1; rate limits P2 after 30 min, P1 after 2 h)
  - H3 settings (P1 in calling hours, P2 otherwise)
  - H4 row 1 / Dashboard first / row-1 change (P1 / P2 / P2)
  - H14a failed caller alert or lead texts (P1), FB row with no text (P2)
  - H15 jobs late/slow (P2), poller failing (P1), failed rows (P1 per run)
  - H20 spam pause (P1)
  - H5/H6 as a backstop in calling hours
- **Every 15 min (backlogCheck), inside CALLER_SHIFT:**
  - H5 leads waiting: P2 at 5, P1 at 10 or oldest ≥120 shift minutes, plus a text to the caller
  - H6 no calls logged (P1)
- **Hourly:**
  - H8 every Meta lead is in the sheet (P1); H14b ClickSend history (P1/P2); H16 website (P1 08–22, P2 at night); H19 email allowance (P2; P1 under 50)
  - 07–23: H12 ad watchdog (P1/P2)
  - 08–22: H9 Meta counts vs sheet (P1), H10 forms (P1; archived form P2)
  - 09–21: H11 no FB leads (P2; P1 when other lead checks fail)
  - 08/12/16/20: H13 ClickSend credit (P2/P1)
  - 10/12: H7 overnight leads (caller text + P2; P1)
  - 21: H22 content scan (P1/P2)
- **Daily 07:30:** H17 DNS (MX missing P1, rest P2); H18 self-test ("all OK" email always, P1 text on critical findings); H24 gates (P1/P2); H23 monthly test on the 1st (P1).
- **Nightly 23:30:** H21 backup, rows vanished (P1).
- **New:** the hourly, daily and nightly runs now check row 1 first. While it's wrong, H8, H9, H11, H7, H22 and the H21 comparison are skipped; the backup is still taken.

## Deviations and skipped items
- **Alert texts go straight to ClickSend, not through the leaflet's `sendSms`.** This avoids the leaflet's 40-an-hour cap and the loop where a failing alert text raised another alert. They are still logged in the SMS log as "health".
- **H5 owner text says "Add a caller now"**, not the spec's "Cut the ad budget", per the owner's decision.
- **The Meta token still goes in the URL.** Instead, every stored or emailed error text is scrubbed (`access_token=***`). I didn't switch to an Authorization header because it hasn't been verified against Meta.
- **CPL alarm defaults changed to £5 warning / £8 pause** (OWNER-DECISIONS.md, new `CPL_PAUSE` property). This wasn't in the review, but README said the ads chat had to make this change before setup night.
- **Still skipped:** the outside watchers (3.4) and the Gmail filter for Google's failure emails. Those are browser Claude's job.

## New Script Properties (name – example – who sets it)
- **Required:**
  - `HEALTH_EMAIL` – owner's personal address, then info@kirkcaldydental.co.uk – browser Claude/owner
- **Browser Claude:**
  - `HEALTH_SMS` – 07… – the owner hasn't decided yet; blank means email only and is just listed in the daily email
  - `HEALTH_PING_POLLER` / `_DAILY` / `_BACKUP` – healthchecks.io URLs
  - `META_PAGE_ID` – 1421462957723791
  - `HEALTH_EXEC_ID` – from the /exec URL
  - `HEALTH_SITE` – https://kirkcaldydental.co.uk, once the site is live
- **Owner:**
  - `CALLER_SHIFT` / `CALLER_DAYS` – 9-17 / Mon-Sat
  - `ADS_EXPECTED_ON` 1, `ADS_PAUSED_UNTIL`, `ADS_ALLOWED_CAMPAIGNS`, `ADS_EXPECTED_BUDGET` 20, `FESTIVE_MAX`
  - Gates: `NHS_FIFE_LETTER_ID`, `CALL_CARD_APPROVED`, `PRIORITY_RULE_SIGNED`, `OPENING_TARGET`, `LAST_LIST_UPDATE`, `FESTIVE_COVER`
  - `<NAME>_UNTIL` for any temporary change
- **Optional (defaults shown):**
  - `HEALTH_BACKLOG` 5, `HEALTH_BALANCE_WARN` / `_CRIT` 8/4 with auto top-up (15/5 without)
  - New: `HEALTH_SMS_MAX` 15, `HEALTH_CALLER_MAX` 30, `CPL_ALARM` 5, `CPL_PAUSE` 8
  - `HEALTH_QUIET` 22-7, `HEALTH_EDITORS`, `HEALTH_EXPECTED_USER`, `HEALTH_IGNORE_FORMS`
- **Set automatically (don't edit):**
  - New this round: `HEALTH_CALLER_COUNT`, `HEALTH_SPAM_OVERRIDE`, `HEALTH_BACKUP_SHARED`, `ADS_ACTIVE_SINCE` (set by meta-ads.gs)
  - Still in use: `HEALTH_BACKUP_FOLDER` (Drive folder for the backups, created on the first night), `HA_*`, `HM_*`, `HEALTH_ROW1`, `HEALTH_SMS_COUNT`, `HEALTH_BASELINE*`, `META_LAST_ERR`
  - `HEALTH_SEEN_*` is retired (migrated once, then deleted).

## What the leaflet chat must change (checked against 5971c5d)
1. **While `WEB_SMS_PAUSED` is on:** no `alertTeam`, no confirmation email, no NOTIFY email, and Notes "paused - check" (spec H20). Today only the thank-you text stops.
2. **Add `healthMark(job, ok, ms)` at every exit** of trkOnSheetEdit, trkRetryCheck, trkPullSmsHistory, trkScanBounces, trkDailySnapshot and trkWeeklyEmail.
3. **In `smsFailed`, skip the SMS_ERR_ALERT, SMS_ERR_CREDIT and SMS_ERR_LAST emails** when `typeof healthSmsCheck === "function"`. Today the owner gets a P2 and then a P1 for the same failed text.
4. **Install notes:** row 1 must have the 22 headers (or `healthAddMissingHeaders()` must be run) straight after health.gs is pasted. Until then `doPost` replies "error" to every sign-up.
5. **No longer needed:**
   - The 2-argument `healthAlert` calls in `sendSms` work as they are; they now go to H3.
   - No cap exemption needed for alert texts.
   - "Alerted at" in Failed sign-ups is added by health.gs. If the leaflet ever adds a 9th column to that tab, put "Alerted at" in its own header list.
   - No change to `trkSmsType`.

Already done in 5971c5d: doPost try/catch, healthAssertSheet, the ping, SMS caps, ukMobile, source allow-list, healthMark("doPost"), and the SMS_BALANCE key.

For browser Claude: do step 0 at paste time, and expect 14 triggers until launch day (H18 now accepts that).

## Review issues: fixed as asked
- R8 retry: once a text or alert has gone out, the retry only writes the row, and "Already texted?" is correct.
- H4 guard in the hourly and nightly runs (also the daily); H8 returns if there's no Lead ID column.
- The 2-argument `healthAlert` form: settings messages go to H3, anything else gets a key made from the message, at most one email every 3 h, and it never throws. Re-entry is blocked (keys being sent are tracked, and no ClickSend call is made without keys).
- A problem that comes back after its RESOLVED email is emailed and texted at once.
- H14a resolves only after a later text has gone through.
- Separate daily caps for owner texts and caller reminders, counting only texts ClickSend accepted.
- "Failed sign-ups" gets an "Alerted at" column, and rows are stamped only once an email or text actually went out.
- H21 backup writes text values with "'" so phone numbers and Lead IDs stay as text; the H21 comparison is skipped when row 1 is wrong.
- H6 needs a lead waiting over an hour, and "1 lead is" / "N leads are".
- A failed alert text isn't recorded as sent and is retried after 10 min.
- Error texts are scrubbed of the token in the heartbeat, the "health check crashed" email, Graph errors, the poller and `adsGraphGet`.
- An escalation emails only if no P1 email went out for that problem in the last 3 h.
- H5 counts "waiting" in shift minutes.
- Empty cells at the end of row 1 are ignored.
- A crashed check is only RESOLVED after it has run again cleanly.
- `healthResendFailedTexts` only texts rows with Status blank or "Call 8am".
- `healthShiftMins` steps London calendar days, so the clock change is handled.
- A new form's start time is saved straight away.
- README updated.
- The backups folder is shared (view) automatically.
- `healthNotifyOnce`: a failed sign-up goes straight to the per-row P1; a "P1:" prefix becomes a `[KD-P1]` subject; plain-text bodies get "See WHAT HAPPENED above"; KPI alarm bodies are structured with no repeated sheet link.
- H18 expects 14 triggers until the ads are set up.
- H11's window starts at launch, when the campaigns came back on, or after `healthSetBaseline`.

## Review issues: fixed a different way
- **Anti-flap:** instead of delaying every RESOLVED, only a problem with 2 RESOLVED emails in the last 6 h must pass for a full hour before the next RESOLVED. A single RESOLVED stays immediate.
- **H20 override:** after the owner deletes `WEB_SMS_PAUSED`, the script leaves texts on for 6 hours. It only pauses again if a new burst, counted from that moment, passes twice the normal limit.
- **H8:** it skips leads the lead checker will still read (inside its window and not yet seen) while the checker isn't healthy. The lead checker also never adds a lead that is already in Failed leads.
- **Blank `HEALTH_SMS`:** no longer an H3 alert (the owner hasn't decided on texts; it's listed in the daily email instead). An invalid `HEALTH_SMS` is still an alert, and H3 now also checks `OWNER_MOBILE`.
- **Setup trap:** step 0 is in the INSTALL notes and README. New helpers `healthCheckHeaders` and `healthAddMissingHeaders` (it adds columns to the grid first if needed, and refuses near-miss headers like "Lead ID "). `healthInstallTriggers` refuses while row 1 isn't ready. There's a new "missing columns" alert wording, and the "header row changed" alert names a likely typo.
- **Known limit:** if a send fails mid-lead (caller alerted, thank-you text not sent), the retry writes the row without texting the lead. H14_NO_TEXT (P2) then flags the blank SMS status.

## Test output
`node leads/tests/run-all.js`: 124 passed, 0 failed.

| File | Passed |
|---|---|
| test-names | 6 |
| test-router | 17 |
| test-handlelead | 16 |
| test-checks | 33 |
| test-round2 | 25 |
| review-bugs | 27 |

The second reviewer's scratch scripts (`/tmp/claude-0/-home-user/f778202c-7a7e-561e-ac12-c600a726fed0/scratchpad/revtests/t1.js`–`t4.js`) now show:
- t1: one real H3 P1 per address.
- t2: one P1 per failed sign-up, including after the owner deletes handled rows.
- t3: the "missing 12 columns" P1.
- t4: no "Failed leads" row; the lead is added and texted once after the fix.

A 17-hour simulation of all triggers (`/tmp/claude-0/-home-user/f778202c-7a7e-561e-ac12-c600a726fed0/scratchpad/r2/sim.js`) ran with no crashes and no script errors.