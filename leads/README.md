# Our own lead handler – free alternative to Zapier / Make

`meta-leads.gs` runs inside the Waiting List Google Sheet, using Google Apps Script. It's free with the clinic's Google account.

Every minute it pulls new Facebook/Instagram Instant Form leads from Meta and, for each one:
- adds a row to the sheet
- texts the lead straight away, at any hour (it's the confirmation they've just asked for)
- texts ONE caller "NEW LEAD – call now", 8am–9pm (`CALL_HOURS` default `8-21`). With two or more callers, leads go to the next caller in turn (`ALERT_MODE` `rotate`). The owner gets an email copy (`OWNER_EMAIL`), not a text.
- after 9pm nobody is called: the lead's text says "our team will call you from 8am to confirm your details", the row is marked "Call 8am", and the caller gets an 8am summary
- emails the lead a confirmation, if they gave an email (email is optional on the form)

The form itself asks only for full name, phone (both required) and email (optional), plus one optional news-and-offers box. The spec is HANDOFF.md Step 2. Postcode, No. of People, Adult/Child/Family and Currently Registered? stay blank until the caller fills them in.

**Costs:** £0 for the software. You only pay for the texts, a few pence each through ClickSend, or switch `sendSms()` to Twilio.
**Speed:** a lead reaches the team within about 1–2 minutes.
**Capacity:** Google's free limits are thousands of messages a day, far more than the ~100 a day expected at peak.
- Workspace accounts get more.
- Emails: Workspace allows ~1,500 a day.

## One-time setup (~30 min; browser Claude can do it with you)
1. **Meta app:**
   - Go to developers.facebook.com and create an app of type **Business**, owned by the clinic's Business account.
   - Add the **Facebook Login for Business** / Marketing API product.
   - Add yourself as app admin.
2. **Page token:**
   - In **Graph API Explorer**, choose the app, then *Get Page Access Token* for the clinic Page.
   - Request the permissions `pages_show_list`, `pages_read_engagement`, `pages_manage_metadata`, `leads_retrieval`, `pages_manage_ads`, `business_management`, and `ads_read` (for meta-ads.gs).
   - Check App Review → Permissions and features first: if Meta says any of these needs Advanced access or App Review, real leads can't be read until it's approved (BROWSER-CLAUDE-LAUNCH.md, Meta pre-work day).
   - Exchange it for a **long-lived** token (Access Token Debugger → *Extend*).
   - Then get the Page token again from `/me/accounts`; that Page token does not expire.
   - Alternatively, create a **System User** in Business Settings, give it the Page and the app, and generate a token that never expires.
3. **Leads access:** Business Settings → Integrations → **Leads access** → allow the app and the people who need it.
4. **Form ID:** Ads Manager → the ad → Instant form (or Meta Business Suite → Instant Forms → the form) → copy its ID.
5. **Apps Script:**
   - In the Waiting List sheet, go to Extensions → Apps Script and add the file `meta-leads`.
   - Paste the code in, then add the Script Properties `META_PAGE_TOKEN` and `META_FORM_IDS`.
   - The ClickSend keys and `ONCALL_MOBILE` are shared with the website form. Team alert settings (Script Properties):
- `ONCALL_MOBILE`: the callers' mobiles, comma-separated. Start with 1–2 callers and add more as sign-ups grow (about one caller per 20–25 new sign-ups a day).
- `ALERT_MODE`: leave empty with one caller; **`rotate`** with two or more (each lead goes to the next caller in turn, so two people never ring the same lead). Don't use `all`: the owner decided each lead alert goes to ONE caller.
- `OWNER_MOBILE`: leave **empty**. The owner chose email copies instead of text copies.
- `OWNER_EMAIL`: `info@kirkcaldydental.co.uk`. Gets a free EMAIL copy of every alert; the Gmail app on the owner's phone has notifications on. If self-sent emails don't notify, add a Gmail filter in info@ (Subject contains "NEW LEAD" → Never send to Spam, Mark as important).
- `CALL_HOURS`: `8-21` (default and owner decision – no calls after 9pm). Use `24h` only for a test, then set it back.
- The full list of Script Properties (including `META_PAGE_ID`, `META_IG_USER_ID`, `CPL_ALARM`, `WEB_SMS_PAUSED`, `SMS_HOURLY_MAX` and `SMS_DAILY_MAX`) is in BROWSER-CLAUDE-LAUNCH.md §5.5.

If the sheet has an **"Assigned to"** column, it shows which caller each lead went to.
- `META_API_VERSION`: leave empty (default `v27.0`). Set it to Meta's newest version if the owner is emailed that the version is deprecated.

**Repeat sign-ups** (same mobile, last 10 digits, or same email):
- Signed up again within 24h, or already Called / Booked / Not interested → Status **Duplicate**, no caller alert, Notes "Already on the list – see <earlier Lead ID>". They get at most one "you're already on the list" text a day.
- Signed up before but never reached → the callers get a **"REPEAT – NEW LEAD"** alert so they try again.
- DO NOT CONTACT always wins: no text, email or alert.

**Tracking columns** (exact header text): Lead ID, Logged at, Ad name, Ad ID, Form ID, Organic?, Duplicate of, SMS ID, SMS status, Email status (metrics plan, research/forecast-metricsPlan.md §C1). Without `health.gs` they're filled when they exist. **With `health.gs` they're required:** see "Health checks" below, step 0.

**Meta app must be Live** (not Development), or real leads from people without a role on the app are invisible to the script.

**Daily ad results:** `meta-ads.gs` (same project) copies Meta's spend, leads, CPM, frequency and video views into an "Ads" tab every morning at 06:00. It also checks that the ads are running (no rejections, spend happening, leads arriving): every hour 07:00–23:00 through `health.gs` (check H12), or every 2 hours without it. It emails the owner if the cost per lead is too high: a warning above £5 and "pause" above £8 (3-day average, after at least £30 spent; owner decision; Script Properties `CPL_ALARM` / `CPL_PAUSE`, defaults 5 / 8 since the 9 Nov version). Script Properties: `META_ADS_TOKEN` (leave empty to reuse the System User token, which has `ads_read`), `META_AD_ACCOUNT_ID` (`act_…`), `LAUNCH_DATE`, `META_PAGE_ID` (the clinic Page, 1421462957723791) and `META_IG_USER_ID` (the Instagram account, if linked) for the followers count, and `CPL_ALARM` `5`. Run `adsInstallTriggers()` once, on launch day.
6. Run `installLeadTriggers()` once and allow the permissions.
7. **Test** (full list: BROWSER-CLAUDE-LAUNCH.md §6):
   - Use Meta's Lead Ads Testing Tool (developers.facebook.com/tools/lead-ads-testing) → **Preview form** to send a test lead with a real mobile.
   - Within ~1–2 minutes: the row appears, the lead's text and (8am–9pm) the caller alert arrive, plus the confirmation email if an email was given.
   - Test once with the news-and-offers box unticked (Marketing consent No) and once ticked (Yes).
   - Delete the test row. Leave the last test lead in Meta until real leads arrive.

If the token ever stops working, the script logs "Meta API 190" (Apps Script → Executions). Generate a new token as in step 2.

## Legal safeguards built in
- The lead text is a **service message** that only confirms the request. It contains no marketing.
- **"DO NOT CONTACT":** pick it in a row's Call outcome (or put it in Status) and that phone number gets no more texts or emails, and no team alert, even if they sign up again.
- **"Marketing consent" column:** "Yes" only if the person ticked the optional consent box on the Meta form. Only "Yes" people may ever get promotional messages.
- Caller alerts and calls follow `CALL_HOURS` (8am–9pm; nobody is called after 9pm). The lead's own confirmation text goes at any hour, straight after they sign up, because it's the reply they asked for. After 9pm it says the team will call from 8am.
- Full checklist: HANDOFF.md → "Text messages – legal checklist".

## Overload guard and evening report (emails to OWNER_EMAIL)
- **Every 15 minutes**, inside the caller's shift, `health.gs` (check H5) counts leads not yet called an hour (of the shift) after their clock starts: Status blank, "Call 8am" leads from opening time, and "No answer" call-backs over an hour late. **5 or more** (`HEALTH_BACKLOG`) → a warning email at most every 2 hours; **10 or more**, or one waiting over 2 hours → a critical email and text, plus a text to the caller ("ring the oldest first"). The advice is always **add a caller first**; a lower campaign budget only if nobody at all can call (owner: callers are not a limit). Without `health.gs`, the old email fires at `BACKLOG_ALERT` (default 15; H3 flags anything above 10) with the same advice.
- **At 9pm** the owner gets one email with today's numbers: new sign-ups by source, called, booked, no answer, and still waiting.
- After every call, callers pick a value from **Call outcome** (column Y). Status fills itself (tracking.gs, required), and notes go in Notes. Otherwise leads keep counting as waiting.

## Health checks (`health.gs`, same project)
Watches the whole lead pipeline and emails/texts the owner in plain English when something breaks (research/premortem-final.md §3). Every alert email says what happened / what it affects / what to do / the sheet link. Critical (P1) alerts are also texted to `HEALTH_SMS` (never 22:00–07:00, at most 1 an hour and 3 a day per problem, no lead names or numbers). A RESOLVED email follows when the check passes again.

**Setup night, in this order:**
0. **Row 1 first.** As soon as `health.gs` is pasted, the Facebook lead checker and the website form check row 1 of the Waiting list and **stop** if any of these 22 headers is missing (website sign-ups then go to the "Failed sign-ups" tab): Signup Time, Name, Phone, Email, Postcode, No. of People, Adult/Child/Family, Source, Status, Assigned to, Marketing consent, Notes, Lead ID, Logged at, Ad ID, Form ID, Duplicate of, SMS ID, SMS status, Email status, Call outcome, Status changed at. The original sheet has 11 columns, so straight after pasting run **`healthCheckHeaders()`** (lists what's missing, changes nothing) and **`healthAddMissingHeaders()`** (adds the missing ones at the right-hand end of row 1, moves nothing; it refuses if a header is typed twice or almost right, e.g. "Lead ID " with a space).
1. Paste `health.gs` (+ Add file "health"), set `HEALTH_VERSION` at the top to `<date>-<commit>`, save, then step 0.
2. Script Properties: `HEALTH_EMAIL` (**required**: the owner's personal email first, then info@kirkcaldydental.co.uk), `HEALTH_SMS` (the owner's mobile; blank = no alert texts – owner decision still pending), `HEALTH_PING_POLLER` / `HEALTH_PING_DAILY` / `HEALTH_PING_BACKUP` (healthchecks.io), `META_PAGE_ID`, `HEALTH_EXEC_ID`, `HEALTH_SITE` (once the site is live), `CALLER_SHIFT` / `CALLER_DAYS` (e.g. `9-17` / `Mon-Sat`), `HEALTH_BACKLOG` `5`, `HEALTH_BALANCE_WARN` / `HEALTH_BALANCE_CRIT`. The full list is at the top of `health.gs`.
3. Run **`healthInstallTriggers()`** once: 4 triggers (13 + 4 = 17 of Google's 20; it refuses above 18, or while row 1 isn't ready). Until launch day the project has 14 (the 3 ad triggers come with `adsInstallTriggers()`); the daily check knows this.
4. Fire drill step 1: run **`healthTestAlert()`** → a text, an email to the personal address, and a healthchecks.io "down" then "up". Then the rest of the fire drill (premortem-final.md §3.6).

**What runs:** every 5 min (lead checker alive, Meta errors, settings, row 1, failed texts, failed rows, spam), hourly (every Meta lead is in the sheet, Meta's counts, forms, ads, website, ClickSend history and credit, email allowance; 21:00 content scan), daily 07:30 (an "all OK" email – its absence is a signal), nightly 23:30 (a values-only backup of the Waiting list, Call log, SMS log and Health log, 30 kept, shared (view) with the owner's personal Google account).

**Manual helpers:** `healthSetBaseline()` after deleting test rows on purpose (so the backup check doesn't alarm), `healthResendFailedTexts()` after ClickSend is fixed (calling hours; only people nobody has reached yet).
