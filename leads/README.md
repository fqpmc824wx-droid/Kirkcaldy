# Our own lead handler – free alternative to Zapier / Make

`meta-leads.gs` runs inside the Waiting List Google Sheet, using Google Apps Script. It's free with the clinic's Google account.

Every minute it pulls new Facebook/Instagram Instant Form leads from Meta and, for each one:
- adds a row to the sheet
- texts the lead straight away
- texts the on-call mobile(s) "NEW LEAD – call now", 8am–9pm (`CALL_HOURS` default `8-21`); leads after 9pm get a "our team will call you from 8am to confirm your details" text, are marked "Call 8am", and the team gets an 8am summary
- emails the lead a confirmation

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
   - Request the permissions `pages_show_list`, `pages_read_engagement`, `pages_manage_metadata`, `leads_retrieval`, `pages_manage_ads`, `business_management`.
   - Exchange it for a **long-lived** token (Access Token Debugger → *Extend*).
   - Then get the Page token again from `/me/accounts`; that Page token does not expire.
   - Alternatively, create a **System User** in Business Settings, give it the Page and the app, and generate a token that never expires.
3. **Leads access:** Business Settings → Integrations → **Leads access** → allow the app and the people who need it.
4. **Form ID:** Meta Business Suite → Instant Forms → the form → copy its ID.
5. **Apps Script:**
   - In the Waiting List sheet, go to Extensions → Apps Script and add the file `meta-leads`.
   - Paste the code in, then add the Script Properties `META_PAGE_TOKEN` and `META_FORM_IDS`.
   - The ClickSend keys and `ONCALL_MOBILE` are shared with the website form. Team alert settings (Script Properties):
- `ONCALL_MOBILE`: the callers' mobiles, comma-separated.
- `ALERT_MODE`: `all` (everyone gets every lead) or **`rotate`** (each lead goes to the next caller in turn, so two people never ring the same lead). Recommended with a big team.
- `OWNER_MOBILE`: optional. Gets a TEXT copy of every alert in either mode.
- `OWNER_EMAIL`: optional and free. Gets an EMAIL copy of every alert, e.g. `info@kirkcaldydental.co.uk` with the Gmail app notifications on.
- `CALL_HOURS`: `8-21` (default – no calls after 9pm) or `24h`.

If the sheet has an **"Assigned to"** column, it shows which caller each lead went to.
- `META_API_VERSION`: leave empty (default `v27.0`). Set it to Meta's newest version if the owner is emailed that the version is deprecated.

**Repeat sign-ups** (same mobile, last 10 digits, or same email):
- Signed up again within 24h, or already Called / Booked / Not interested → Status **Duplicate**, no caller alert, Notes "Already on the list – see <earlier Lead ID>". They get at most one "you're already on the list" text a day.
- Signed up before but never reached → the callers get a **"REPEAT – NEW LEAD"** alert so they try again.
- DO NOT CONTACT always wins: no text, email or alert.

**Tracking columns** filled automatically when they exist in the Waiting list tab (exact header text): Lead ID, Logged at, Ad name, Ad ID, Form ID, Organic?, Duplicate of, SMS ID, SMS status, Email status. The leaflet chat adds them (metrics plan, research/forecast-metricsPlan.md §C1).

**Meta app must be Live** (not Development), or real leads from people without a role on the app are invisible to the script.

**Daily ad results:** `meta-ads.gs` (same project) copies Meta's spend, leads, CPM, frequency and video views into an "Ads" tab every morning at 06:00. It also checks every 2 hours that the ads are running (no rejections, spend happening, leads arriving). Script Properties: `META_ADS_TOKEN` (the same System User token, with `ads_read`, is fine), `META_AD_ACCOUNT_ID` (`act_…`), `LAUNCH_DATE`. Run `adsInstallTriggers()` once.
6. Run `installLeadTriggers()` once and allow the permissions.
7. **Test:**
   - Use Meta's Lead Ads Testing Tool (developers.facebook.com/tools/lead-ads-testing) to create a test lead.
   - Within ~1 minute: the row appears, both texts arrive and the email arrives.
   - Delete the test row.

If the token ever stops working, the script logs "Meta API 190" (Apps Script → Executions). Generate a new token as in step 2.

## Legal safeguards built in
- The lead text is a **service message** that only confirms the request. It contains no marketing.
- **"DO NOT CONTACT":** put this in a row's Status column and that phone number gets no more texts or emails, and no team alert, even if they sign up again.
- **"Marketing consent" column:** "Yes" only if the person ticked the optional consent box on the Meta form. Only "Yes" people may ever get promotional messages.
- The texts follow `CALL_HOURS` (8am–9pm).
- Full checklist: HANDOFF.md → "Text messages – legal checklist".

## Overload guard and evening report (emails to OWNER_EMAIL)
- **Every 15 minutes** in calling hours, the script counts leads not yet called after 60 minutes (Status still blank, or "Call 8am" leads an hour after opening). If there are **15 or more** (Script Property `BACKLOG_ALERT` to change it), the owner gets an email: "⚠️ 16 leads waiting over an hour". It suggests lowering the ad budget ~20% or adding a second caller. It sends at most one email every 2 hours.
- **At 9pm** the owner gets one email with today's numbers: new sign-ups by source, called, booked, no answer, and still waiting.
- Callers must fill in **Status** after every call, otherwise leads keep counting as waiting.
