# Setup night: launch runbook for browser Claude

**Browser Claude: read this whole file first.** Then read:
- **OWNER-DECISIONS.md**, **BRAND.md** and **leads/README.md**, all on `main`. The owner's decisions win over everything else.
- **leaflet/README.md**, which is on branch `claude/brave-allen-i14xnx` until PR #1 is merged

**Check the code version first.** On github.com/fqpmc824wx-droid/Kirkcaldy → branch `main`, the latest commit must be **`<hash the owner records after merging>`** (the owner writes it in the sheet's Change log tab after merging the PRs). If it's different, stop and ask the owner. Paste code and upload files only from that commit.

**If the owner has made the repo private** (it's on their to-do list), browser Claude can only download from GitHub while the owner is signed in to GitHub in that browser (§0, §1.1).

Work through the steps in order with the owner watching. The **Meta pre-work day** below happens 2–5 days before setup night.

**Where HANDOFF.md and this file differ, this file wins.**
- From HANDOFF.md use only: the Rules, Step 1 items 0–5 (with the file and DNS fixes in Step 1 here), Step 2 (the lead form spec, word for word), Step 3 (backup lead alerts on the phones) and the legal checklist.
- **Skip** HANDOFF Step 1 item 6 (Hostinger mailbox) and anything about Make.com or Zapier. **Don't sign up to Make or Zapier.** Our own scripts in Step 5 replace them.

**Ask the owner before anything that costs money, publishes ads, or sends a message to a real person.** Test messages to the owner's own phone are fine. Follow BRAND.md wording exactly. Say "waiting list" only. Never say "accepting / taking on / registering NHS patients", "limited places", "first come, first served", "free NHS dentist" or "guaranteed", and never use the NHS logo. Never use or print the Dentally placeholder phone number.

**Guides for setup night and after:** Drive "1. Meta Ads → Setup-night & how-to guides" (App Review pack, Launch-day fallback card, Adding a caller, Weekly mystery-shopper test, Surge plan, If this email arrives).

Repo: `fqpmc824wx-droid/Kirkcaldy`. Where things are until the PRs are merged:
- **Website pages:** all on branch `claude/brave-allen-i14xnx` (PR #1): `site/index.html`, `site/privacy.html`, `site/register/index.html`, `site/b/index.html`, `site/l/index.html`.
  - PR #2 (`claude/hostinger-plugin-install-eyvjb3`) only adds the new halfway logo files in `site/assets/`.
  - PR #2's own index.html and privacy.html are old and use the WRONG email (info@kirkcaldydentist.co.uk). Never upload those two.
  - The two PRs merge without conflicts. **Ask the owner to merge PR #1 and PR #2 into `main` first.** Then use `site/` on `main`.
- **Website sign-up script:** `leaflet/apps-script.gs` (PR #1 branch, or `main` after merging).
- **Facebook lead script:** `leads/meta-leads.gs` on `main`.
- **Ads (images + videos):** `ads/` on `main`. Also in Google Drive → "Kirkcaldy Dental – Print files & marketing" → **1. Meta Ads**, with the same file names.

---

## Meta pre-work day (2–5 days before setup night)
Do this with the owner 2–5 days before setup night. Meta can take days to review a Page name, verify the business and approve the app. Without that, real leads may not reach the sheet on launch night.
1. Do all of **§3** (the existing Page, Business portfolio, the existing ad account, security, Business Verification, safety settings).
2. Do **§5.1**: create the developer app and fill in App settings → Basic. If the privacy page isn't live yet, finish those fields and switch to Live on setup night.
3. **Check what Meta needs for the app.** App Dashboard → **App Review → Permissions and features**. Write down the access level shown for each of these, and whether it says App Review is required:
   `leads_retrieval`, `pages_manage_ads`, `pages_read_engagement`, `pages_show_list`, `pages_manage_metadata`, `business_management`, `ads_read`.
   - Save a screenshot in Drive "11. Legal & compliance" and send the list to the ads chat.
   - **If any of them needs Advanced access or App Review, submit the request the same day**, using the App Review pack (Drive "1. Meta Ads → Setup-night & how-to guides", doc 1). Meta asks for Business Verification as part of this, so start it today (step 4).
   - Why: Meta's lead-ads guide says reading leads through the API needs App Review and then Business Verification (developers.facebook.com/docs/marketing-api/guides/lead-ads/; research/meta-playbook.md §6). Some vendors say your own Page doesn't need it. Check, don't assume.
4. **Start Business Verification** today (§3.10).
5. If the owner agrees: open the ClickSend account and register the sender ID **KirkDental** now (§2.3), so it's approved before setup night.
6. Tell the owner what is still waiting (name review, Business Verification, App Review). Check again the day before setup night. If App Review is still pending, the real-lead gate in §6 will fail: don't publish ads until it passes.

## 0. Have ready before starting
| Item | Who |
|---|---|
| A **laptop/desktop** (not a phone) to download the website files and upload them to Hostinger | owner |
| Hostinger login with access to the hosting for kirkcaldydental.co.uk (from Abdullah) | owner |
| **Domain/DNS login:** Google Workspace super-admin for kirkcaldydental.co.uk (domain is managed via Squarespace Domains) | owner |
| Google login **info@kirkcaldydental.co.uk** (owns the Waiting List sheet) | owner |
| **GitHub login** for fqpmc824wx-droid (to merge the PRs, and to download the files if the repo is private) | owner |
| Owner's personal Facebook login + phone for Meta verification codes | owner |
| Payment card (Meta ads + text credit) | owner |
| Mobile number of the **caller** who gets the lead texts. Start with 1–2 callers. Each lead alert goes to **one** caller (they take turns when there are two or more). The owner gets email copies instead. | owner |
| The caller's work phone, with the Google Sheets and Meta Business Suite apps (§5.5) | owner |
| A copy of the existing **NHS Fife approval** (email or letter), saved in Drive "11. Legal & compliance". No new letter is needed: the owner says the approval exists and an inspection comes later. | owner |
| Daily ad budget: **£20/day to start** (2 ads; the family's alternative is £10/day, see section 8) | agreed |
| Clinic phone number 01592 … (optional; can be added later) | owner |

Waiting List sheet: https://docs.google.com/spreadsheets/d/1WxadIcaibszu3YYR3eqNMjaQQ0V3LJ_Mvdsx_I2KBQI/edit
- Tabs: **Dashboard** (first; don't write to it), **Waiting list**, **Visits**, Call log, SMS log, Daily log, Lead analysis, Daily checks, Costs, Change log, Complaints, Do-not-contact list, plus tabs the scripts add (e.g. Failed sign-ups).
- Waiting list columns: Signup Time, Name, Phone, Email, Postcode, No. of People, Currently Registered?, Adult/Child/Family, Source, Status, Assigned to, Marketing consent, Notes, then the tracking columns from N (Lead ID …; **Call outcome** is column Y).
- The forms ask for name and phone (required) and email (required or optional: the owner is deciding, see OWNER-DECISIONS.md). The website also asks postcode (optional) and how many people. **The caller fills in whatever is blank** (Postcode, No. of People, Currently Registered?, Adult/Child/Family).

---

## 1. Website live on Hostinger (must come first: the Meta form needs the privacy page)
*(Text from the website chat, 9 Nov; PR #2 already has the fixed register page, privacy page, email address, spam trap, honest error, b/, l/ and .htaccess.)*
0. **Email record (do this now, about 2 minutes; it's safe and doesn't touch email delivery).**
   - Go to Google Admin → Domains → Manage domains → kirkcaldydental.co.uk → DNS (Squarespace Domains) → Add record.
   - Type **TXT**, Host **_dmarc**, Value **v=DMARC1; p=none; rua=mailto:info@kirkcaldydental.co.uk**. Save.
   - SPF and DKIM are already set. This record stops confirmation emails going to spam.
1. **Get the files.**
   - Go to github.com/fqpmc824wx-droid/Kirkcaldy and pick branch **main** if PR #2 is merged, otherwise branch **claude/hostinger-plugin-install-eyvjb3**.
   - Code → Download ZIP → unzip. If the repo is private, the owner must be signed in to GitHub.
   - Use only the `site/` folder. Don't use any older website zip from Drive or the repo root.
2. **Upload.**
   - Hostinger → Websites → kirkcaldydental.co.uk → File Manager → `public_html`. Delete any default index.php/default.php.
   - Upload the **contents** of `site/`, including the hidden file **`.htaccess`** (turn on "show hidden files" if needed).
   - `public_html` must end up with: index.html, privacy.html, .htaccess, assets/, register/index.html, b/index.html, l/index.html.
   - The footer must say info@kirkcaldydental.co.uk.
3. **Paste the Google Sheet link** (once Step 5.7 gives you the /exec URL).
   - In File Manager, edit **two** files, `register/index.html` and `index.html`.
   - In each, replace `PASTE_APPS_SCRIPT_URL_HERE` with the full https://script.google.com/macros/s/…/exec URL. Save.
   - Until this is done, the sign-up page shows "Sign-ups open shortly – please email…". That's deliberate, not a bug.
4. **DNS** (same DNS screen as item 0).
   - **Remove** the 4 Squarespace A records for @ (198.185.159.144, 198.185.159.145, 198.49.23.144, 198.49.23.145) and the CNAME www → ext-sq.squarespace.com.
   - **Add** A @ → the Hostinger IP (plus AAAA if given), and CNAME www → kirkcaldydental.co.uk.
   - **Keep** MX (smtp.google.com), the SPF TXT, google._domainkey and the new _dmarc.
   - Don't change nameservers. Don't create a Hostinger mailbox, and decline any Hostinger offer to change MX, SPF or nameservers.
5. **SSL.**
   - Carry on with Steps 2–5 while DNS updates (up to about 4 hours). Don't publish the Facebook form until the privacy page loads.
   - When https://kirkcaldydental.co.uk shows the new site, turn on SSL in Hostinger, then **Force HTTPS**.
6. **Check over https:**
   - `/`, `/privacy.html` and `/register/` load.
   - `/b` and `/l`, with and without a trailing slash, land on `/register/?src=banner` and `/register/?src=leaflet`.
   - Also try `http://` and `www.`: each must end on `https://kirkcaldydental.co.uk/…`.
   - The privacy page lists Meta, Google, ClickSend and Hostinger, with no Zapier.
   - /register/ shows the 8am–9pm notice and an optional, unticked marketing box.
7. **Test sign-up** (after item 3).
   - On mobile data, scan the printed banner and leaflet QR codes and submit with the owner's phone and email.
   - Confirm a sheet row with Source = banner / leaflet, and the thank-you screen.
   - If the page shows an error instead of the thank-you, the sheet didn't save it: check the /exec URL and the Apps Script deployment (access: Anyone).
   - Delete the test rows afterwards.
8. **Don't put up the banner or hand out leaflets until item 7 passes.** Tell the website chat (Claude Code) the Hostinger IP and that the site is live.
9. **Domain renewal and the old domain** (with the owner):
   - Google Admin → Domains → kirkcaldydental.co.uk: turn on **auto-renew** and check the card on file.
   - Old domain **kirkcaldydentist.co.uk**: forward its email to info@kirkcaldydental.co.uk, and redirect its website to https://kirkcaldydental.co.uk. Ask the owner where it's managed.
   - In Hostinger, check the hosting plan is set up for **kirkcaldydental.co.uk**, not only the old domain.

## 2. Text-message provider: pick the cheapest, top up safely
1. **Compare UK prices before paying.**
   - Check the ClickSend pricing calculator with **United Kingdom** selected, and Twilio UK SMS pricing (third-party pages showed about $0.056 per UK text in Oct–Nov 2026). Expect about **3–6p per text + VAT**.
   - Tell the owner both prices. The scripts are built for **ClickSend**.
   - Switching to Twilio means changing `sendSms()` in `leaflet/apps-script.gs` only (meta-leads.gs uses that same function), so ask the ads chat if Twilio is much cheaper.
2. **Ask the owner before paying.**
   - **Top up £50.** If you turn on auto top-up, keep it small (e.g. £20 when the balance drops below £10). Set a monthly limit and a low-balance email if ClickSend offers them.
   - If ClickSend lets you restrict destination countries, allow **United Kingdom only**.
3. Register sender ID **KirkDental** (best on the Meta pre-work day) and **wait until ClickSend shows it approved/active**.
4. Copy the ClickSend **username** and **API key** (Dashboard → API Credentials).
5. Accept ClickSend's data processing agreement and save it (§5.8).

Budget to tell the owner:
- Each lead uses about **2.2 texts**: the thank-you to the lead plus the alert to the caller.
  - Alerts start with an emoji, so long names cost 2 credits.
  - The 8am summary costs 2 credits a day.
  - The owner gets free email copies instead.
- That's about **9p per lead**, so the text bill follows lead volume: 300 leads ≈ £27; 2,600 leads ≈ £235.

## 3. Facebook Page, Business account, ad account (do this on the Meta pre-work day)
1. **Don't create a new Page.** Use the clinic's existing Page **"KirkcaldyDental"** (Page ID **1421462957723791**).
   - **Check its admins** (Page settings → Page setup → Page access). The owner must have full control. Ask the owner about anyone they don't know before removing them.
   - **Rename it** to **Kirkcaldy Dental & Implant Clinic** (Settings → Page info → Name). Meta may review the new name, which can take a few days. That's one reason this is done early.
   - Profile picture and cover: Drive "4. Logo & Brand" → **"Facebook profile picture (1080x1080).png"** and **"Facebook cover (1640x624).png"**. Check the profile picture reads well in Facebook's circular crop.
   - Address: 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.
   - Website: kirkcaldydental.co.uk.
   - Email: info@kirkcaldydental.co.uk.
   - Phone: add the clinic's real 01592 number only once it exists (§11). **Never use the Dentally placeholder number**, on the Page or anywhere else.
2. Link Instagram if the clinic has an account (optional).
3. Create a **Meta Business portfolio** (Business settings) for the clinic, owned by the owner. If the owner already has one for the clinic, use it; don't make a second.
4. **Add the Page to it:**
   - Business settings → Accounts → Pages → + Add → Add an existing Facebook Page → the clinic Page.
   - Then Users → People → the owner → Assign assets → the Page (full control).
5. **Ad account: use the existing one; don't create a second.** Ad account **1207154818311419** is a personal ad account: it isn't in any Business portfolio and has no payment method and no campaigns.
   - Business settings → Accounts → Ad accounts → **Add → Add an ad account** → enter `1207154818311419`.
   - **Tell the owner first: moving an ad account into a Business portfolio can't be undone.**
   - Assign it to the owner with full control.
   - Then check its settings: time zone **Europe/London** and currency **GBP**. These can't be changed later. If either is wrong, create a new ad account in the portfolio instead (Ad accounts → Add → Create a new ad account: GBP, Europe/London), assign it to the owner, use its number from then on (`META_AD_ACCOUNT_ID`, §5.5), and tell the ads chat.
6. Add the **payment card** to that ad account.
7. **Lead Ads terms:** logged in as Page admin, open facebook.com/ads/leadgen/tos, pick the clinic Page and accept. Meta may also prompt for this when you create the form.
8. **Remove single points of failure:** add a second trusted person (e.g. a family member) as admin on the Page, Business portfolio and ad account.
9. **Security (pre-mortem):**
   - Turn on **two-step verification** for every person with access to the Page, Business portfolio, ad account, developer app, Google (info@) and ClickSend.
   - Add the second admin to the **developer app** too (App roles → Administrators). Without that, only one person can fix the token.
   - Ad account → Billing → **Account spending limit ≈ £900** (a safety cap for the 4-week plan; raise it on purpose later).
   - Add a **backup payment card**.
10. **Business verification** (Business settings → Security Centre → Start verification). Start it on the Meta pre-work day: it can take a few days, and **it can hold up launch**. Meta's lead-ads guide says reading leads through the API needs App Review and then Business Verification (developers.facebook.com/docs/marketing-api/guides/lead-ads/; research/meta-playbook.md §6). A new ad account also has a hidden daily spending limit that rises with verification and good standing.
11. **Account-wide safety settings. Do these now, because they can take up to 48 hours to apply:**
    - Ad account → Advertising settings → Creating ads → Creative features: **untick "Test new creative features"**.
    - Advertising settings → Branding / Identity → restricted words: `accepting`, `taking on`, `registering`, `first come`, `limited places`, `free dentist`, `free NHS dentist`, `guaranteed`, `specialist`. This is only a backstop, because Meta doesn't always obey it.
    - Optional: Account controls → Placement controls (objective Leads) → exclude **Audience Network**, which can bring cheap junk leads. It applies to every Leads campaign in this ad account.

## 4. Instant Form (lead form)
The full spec, with every word to copy, is **HANDOFF.md Step 2** (from research/FORMS-meta-instant-form.md v1, the owner's fields). Copy all text there **word for word**. Build the form in **Ads Manager**, inside an ad, **not** Business Suite.

**Order: build the form inside a draft ad, so nothing goes live early.**
1. Ads Manager → Create → set up the **campaign and the ad set exactly as in §7** (Leads, Advantage+ leads campaign, £20/day, **conversion location: Instant forms**, KY1–KY5 "living in", age 18, and so on). **Don't publish.** Leave them as a draft.
2. In the first ad (Ad A): Destination → **Instant form → Create form**.
3. Build the form from HANDOFF Step 2:
   - Form name `KDIC waiting list v1 – Nov 2026`. **Form type: More volume** (not Higher intent). **Flexible form delivery: Off** if shown.
   - **Only three contact fields:** **Full name** (Required), **Phone number** (Required; if the editor shows it as "optional", switch that off; never "Work phone number"), **Email** (Required or Optional as the owner decides, see OWNER-DECISIONS.md; "Collect work email address" off).
   - **No** Post code, no multiple-choice questions, no other custom questions. Conditional logic off. Field names: leave the defaults. Only if Meta refuses to save without a custom question, add the one optional fallback question in HANDOFF Step 2.
   - Intro, description box, privacy link, disclaimer, the **one optional, unticked** news-and-offers box and the ending screen: word for word.
   - Ending button: **View website** → `https://kirkcaldydental.co.uk/?src=fb-form-done`. Never "Call business". Never /waiting-list/: the form can't be changed later. "Chat on WhatsApp" and Messenger unticked.
4. **Save as draft.** In the draft preview, check that Submit works with the box **unticked**. If it doesn't, the box is wrongly Required: click Optional.
5. **Publish the form only when all four are true:**
   - a copy of the existing NHS Fife approval is saved in Drive "11. Legal & compliance" (no new letter is needed);
   - https://kirkcaldydental.co.uk/privacy.html loads on mobile data with the updated text (§1.6);
   - the owner has seen the phone preview and said a clear "yes". A published form can't be edited;
   - the owner has said whether email is Required or Optional on the Facebook form (OWNER-DECISIONS.md). Until then, don't publish the form.
6. **Publish the form, not the ads.** Copy the **Form ID** (for `META_FORM_IDS`, §5.5). Leave the campaign and both ads unpublished until §7.
7. Still in Ad A, set the per-ad settings from HANDOFF Step 2 ("Settings on EVERY ad"):
   - Destination: tick **"Require SMS verification to submit form"** (Required if offered). If it's greyed out, Phone number isn't Required on the form.
   - **Lead nurturing → Follow-up channels:** untick Messenger, Instagram and WhatsApp.
   - **Lead capture AI agent / AI chat: Off** (if shown).
   - With More volume these are set on each ad, not in the form. Ad B gets the same in §7.
- **Important for later:** a published Instant Form can't be edited, only duplicated, and the copy gets a NEW Form ID. Whenever a form is created or duplicated, add its ID to Script Property `META_FORM_IDS` (comma-separated; keep the old ID until the old form has no live ads), then submit one test lead.

## 5. Lead system: our own free scripts (no Zapier or Make)
1. **Meta developer app** (create it on the Meta pre-work day):
   - Go to developers.facebook.com → My Apps → Create app → type **Business** → owned by the clinic's Business portfolio.
   - Add the Marketing API / Facebook Login for Business product.
   - **App settings → Basic, all before Live mode:**
     - Privacy policy URL: `https://kirkcaldydental.co.uk/privacy.html`
     - **Data deletion instructions URL:** `https://kirkcaldydental.co.uk/privacy.html#delete-your-data` (the website chat is adding that section; check the link opens it)
     - **App icon, 1024 × 1024:** the KD icon from `brand/logo/logo-icon.svg` in deep gold (#8E6B2E) on cream. That file is light gold, so ask the ads chat for the deep-gold PNG if it isn't in Drive "4. Logo & Brand".
     - **Category:** Business.
   - If the App Dashboard shows **Data Use Checkup**, complete it.
   - Check App Review (Meta pre-work day, step 3).
   - Then switch **App Mode to Live**. In Development mode the app only sees leads from people who have a role on the app, so real leads would silently be missed.
2. **Never-expiring token, using a System User (best):**
   - Business settings → Accounts → Apps: check the app is listed (add it by App ID if not).
   - Users → **System users** → Add → name "Lead script", role Admin.
   - Assign assets:
     - Pages → clinic Page → Full control.
     - Apps → the app → Full control.
     - Ad accounts → the clinic ad account → **View performance** (for the daily ad-results sync, meta-ads.gs).
   - **Generate new token:**
     - Pick the app, Token expiration: **Never**.
     - Tick `leads_retrieval`, `pages_show_list`, `pages_read_engagement`, `pages_manage_metadata`, `pages_manage_ads`, `business_management`, and `ads_read` (for the daily ad-results report later).
     - Generate, then keep the token for `META_PAGE_TOKEN`.
   - Check it at developers.facebook.com/tools/debug/accesstoken: "Expires: Never", with `leads_retrieval` listed.
   - If the script later logs a "Meta API" error, open Graph API Explorer with that token, run `GET me/accounts`, and use the clinic Page's `access_token` from the result instead. It also never expires.
3. **Leads access:** Business settings → Integrations → **Leads access** → the Page → allow the app (and the System User).
4. **Apps Script:** use a browser window signed in **only** to info@kirkcaldydental.co.uk (a new Chrome profile or private window).
   - Open the Waiting List sheet → **Extensions → Apps Script**.
   - Paste `leaflet/apps-script.gs` over the sample code in `Code.gs`.
   - Click **+** next to Files → **Script** → name it `meta-leads` → paste `leads/meta-leads.gs` → Save.
   - Again **+** → **Script** → name it `meta-ads` → paste `leads/meta-ads.gs` → Save (daily ad results and ad health alarms).
   - **Required:** again **+** → **Script** → name it `tracking` → paste `leaflet/tracking.gs` → Save. It runs the Call outcome column, call-backs and the Call log, SMS log and Daily log. Without it, no call is logged.
   - **REQUIRED: add `leads/health.gs` the same way (name it `health`).** This is the automatic safety check.
   - **Step 0, straight after pasting:** run `healthAddMissingHeaders()` once. Until it has run, the website form replies "error" to every sign-up.
   - Then follow the setup notes at the top of that file: the HEALTH_* Script Properties below, and `healthInstallTriggers()`.
   - Its `NHS_FIFE_LETTER_ID` setting takes the Drive file ID of the saved NHS Fife approval copy in "11. Legal & compliance".
   - Project Settings → Time zone → **(GMT+00:00) London**.
   - In the sheet: File → Settings → Time zone → **London** → Save.
5. **Project Settings → Script Properties:**
| Property | Value |
|---|---|
| `CLICKSEND_USER` | ClickSend username |
| `CLICKSEND_KEY` | ClickSend API key |
| `META_PAGE_TOKEN` | the System User (or Page) token |
| `META_FORM_IDS` | the Form ID (comma-separate if more than one) |
| `META_PAGE_ID` | `1421462957723791` (the clinic Page; used for the Page followers count and the health checks) |
| `META_IG_USER_ID` | the clinic's Instagram account ID, if Instagram is linked (Business settings → Accounts → Instagram accounts). Otherwise leave **empty**. |
| `ONCALL_MOBILE` | the caller's mobile. Each lead text goes to **one** person. When more callers join, list all their mobiles, comma-separated, and set `ALERT_MODE` to `rotate`. |
| `ALERT_MODE` | `rotate` (always, even with one caller, so adding a second caller can never double-alert; each lead goes to the next caller in turn). Never `all` (the code's default if this is left empty): each lead goes to ONE caller (owner decision). |
| `OWNER_EMAIL` | `info@kirkcaldydental.co.uk` (owner gets a free **email** copy of every alert; Gmail app on the owner's phone with notifications ON for this account) |
| `OWNER_MOBILE` | leave **empty** (owner chose email alerts instead of text copies) |
| `CALL_HOURS` | `8-21` (owner decision: **no calls after 9pm**) |
| `BACKLOG_ALERT` | `10` for one caller (owner is emailed if 10+ leads have waited over an hour); `15` once there are two callers |
| `META_AD_ACCOUNT_ID` | `act_` + the ad account number (Ads Manager → account dropdown), e.g. `act_1207154818311419` |
| `META_ADS_TOKEN` | leave **empty** (it reuses `META_PAGE_TOKEN`, which has `ads_read`) |
| `LAUNCH_DATE` | the day the ads go live, `yyyy-mm-dd` (set it on launch day) |
| `META_API_VERSION` | leave **empty** (the script uses `v27.0`). If the owner ever gets an email saying the Meta version is deprecated, set it to Meta's newest version, e.g. `v28.0`. |
| `CPL_ALARM` | `5` (warning level in £ per lead: the owner expects about £5. The pause level is £8, §8.) |
| `CPL_PAUSE` | `8` (pause level in £; owner decision) |
| `WEB_SMS_PAUSED` | leave **empty**. Set it to `true` only to stop website texts during a spam attack (rows still save). Delete it to switch texts back on. |
| `SMS_HOURLY_MAX` | leave **empty** (default 40 texts an hour, a safety cap) |
| `SMS_DAILY_MAX` | leave **empty** (default 300 texts a day). Raise it on purpose during a real surge. |
| `NHS_FIFE_LETTER_ID` | the Drive file ID of the saved NHS Fife approval copy (no new letter is needed). **Required before ads go live if health.gs is used**, or a critical alert (text and email) goes out as soon as the ads are live. |
| `CALL_CARD_APPROVED` | the date the owner approved the caller script. **Required before ads go live** (same alert). |
| `ADS_EXPECTED_ON` | `1` on launch day. |
| `ADS_EXPECTED_BUDGET` | `20` (change it with every agreed budget step; the fallback card and the owner card both say so). |
| `ADS_ALLOWED_CAMPAIGNS` | the campaign ID, on launch day. |
| `ADS_PAUSED_UNTIL` | leave **empty**. Set it only when pausing on purpose (`yyyy-mm-dd hh:mm`). |
| `FESTIVE_COVER` | decide by 1 Dec (§8): who calls 24 Dec–2 Jan, or the lower budget. |
| `HEALTH_EMAIL` | **required** (health.gs): the owner's **personal** email first, then info@ (see §6 "Owner email alerts"). |
| `HEALTH_SMS` | leave **blank** until the owner says yes to critical-only texts. Then use the owner's mobile; it never texts 10pm–7am. |
| `HEALTH_PING_POLLER` / `HEALTH_PING_DAILY` / `HEALTH_PING_BACKUP` | the three healthchecks.io ping URLs (SAFETY-PLAN.md part 3). |
| `HEALTH_EXEC_ID` | the web-app deployment ID, from the /exec URL. |
| `HEALTH_SITE` | `https://kirkcaldydental.co.uk`. Set it **only once the site is live**. |
| `CALLER_SHIFT` / `CALLER_DAYS` | the real calling window and days, e.g. `8-21` and `Mon-Sun`. Not 9-17, or nobody gets backlog alerts between 5pm and 9pm. |
| `PRIORITY_RULE_SIGNED` | the date of the invitation-order rule (the owner keeps "Be first in line", so invitations go in sign-up order). |
| `OPENING_TARGET` | the target opening month, `yyyy-mm`. |
| `LAST_LIST_UPDATE` | the date of the last update message to the list. |
| `FESTIVE_MAX` | the daily budget cap for 24 Dec–2 Jan if it's lowered (e.g. `10`). |
Don't touch `ALERT_NEXT`, `META_SINCE`, `META_SINCE_BY_FORM`, `META_SEEN`, `BACKLOG_LAST`, `REPORT_LAST`, `ADS_DAILY_BUDGET`, `ADS_TODAY_SPEND`, `ADS_CPL5_LAST`, `ADS_CPL_LAST` or any `*_ERR_LAST`. They're set automatically.
**Sheet access for callers:**
- The sheet is currently shared with info@ only, so the caller can't open it.
- Share → add each caller's Google account by name as **Editor**. Never use "anyone with the link".
- Data → **Protect ranges**: protect row 1 (headers) and the script-written columns (N–X, Z–AH) with "Show a warning".
- Create a filter view "To call" (Status is empty or "Call 8am" or "No answer").
- Callers use their own login, not info@.

**Caller's phone** (free backup alerts; HANDOFF Step 3):
- **Google Sheets** app, signed in with the caller's own Google account. Open the Waiting list → filter view "To call".
- **Meta Business Suite** app, signed in with the caller's own Facebook account, with **Leads notifications on**. Business settings → People → add the caller → assign the Page with the smallest access that includes leads (never full control). Then Integrations → **Leads access** → the Page → add the caller. Every new Facebook/Instagram lead then also pops up there, even if a text fails.
- The real-lead gate in §6 still needs someone with no role at all, so use a family member for it, not the caller.
- **Owner's phone:** the Gmail app with info@ and notifications on, for the email copy of every alert.

**Sheet dropdowns:** in the Waiting list tab, the Status column (J) must offer: Called, No answer, Booked, DO NOT CONTACT, Call 8am, Duplicate, Unreachable, Wrong number, Not interested, Withdrew (Data → Data validation, "Show a warning"). The leaflet chat is adding these, plus tracking columns N onwards (Lead ID, Ad name, SMS status…). If they're already there, leave them as they are. Column Y (**Call outcome**) is the callers' dropdown from `tracking.gs` (leaflet chat): No answer, Voicemail, Busy/declined, Reached - booked, Reached - call back, Reached - on list, Reached - not interested, Found another dentist – leave list, Wrong number, Withdrew, DO NOT CONTACT. Use the leaflet chat's final list if it differs. Columns K (Assigned to) and L (Marketing consent) must have no restrictive dropdown. Format the Phone column as Plain text. Never set "Reject the input" on columns the scripts write.
6. **Run `installLeadTriggers()` once:**
   - Open the `meta-leads` file, choose `installLeadTriggers` in the function dropdown, then Run → Review permissions → choose info@.
   - If "Google hasn't verified this app" appears: Advanced → Go to … (unsafe) → Allow. This is normal for the clinic's own script.
   - It sets up: checking Meta every minute, the 8am summary, the backlog check every 15 minutes, and the 9pm report to the owner.
   - **Required:** open the `tracking` file → run **`trkInstallTriggers`** once. It adds call tracking (on every edit), the 15-minute call-back check, the SMS history and email bounce checks, the 9pm Daily log and the Monday email.
   - Run `healthInstallTriggers` once (setup notes at the top of that file). Expect **14 triggers before launch day and 17 after**.
   - In info@ Gmail, add a filter that forwards emails from **apps-scripts-notifications@google.com** to the owner's personal email, so failure emails get seen.
   - **Outside watchers + fire drill:** follow SAFETY-PLAN.md parts 3 and 4 (Launch-safety chat; Drive "10. Launch safety"). **Do this BEFORE the real-lead gate.**
   - **On launch day (after the ads are published):** open the `meta-ads` file → run `adsInstallTriggers` once. The Executions log should show the ad account name, "Europe/London" and "GBP". It adds the 06:00 ad-results sync ("Ads" tab), the Monday breakdowns and the 2-hourly ad health check. The owner is emailed if an ad is rejected, the ads stop spending, the cost per lead goes above £5 (warning) or £8 (pause), or leads that Meta counted are missing from the sheet.
   - Then Apps Script → **Triggers** (clock icon) → for **every** trigger, including the `trk…` ones from tracking.gs, pencil → **Failure notification settings: Notify me immediately** → Save. Do `pollMetaLeads` first.
7. **Deploy the website script:**
   - Deploy → **New deployment** → type **Web app** → Execute as **Me (info@)** → Who has access **Anyone**. Not "Anyone with Google account": if "Anyone" isn't offered, stop and tell the owner, because a Google Admin sharing setting is blocking it.
   - Copy the `/exec` URL.
   - **Before pasting it,** open https://kirkcaldydental.co.uk/register/ once: it must hide the form and show the "Sorry – online sign-up isn't working right now" box (the §6 "Website – not set up" test).
   - In Hostinger File Manager, find where `PASTE_APPS_SCRIPT_URL_HERE` is: `public_html/assets/config.js` (`window.KD_ENDPOINT = '…'`) if the website chat moved it there, otherwise `public_html/register/index.html`. Right-click → Edit → replace `PASTE_APPS_SCRIPT_URL_HERE` with the full `https://script.google.com/macros/s/…/exec` URL (keep the quotes) → Save.
   - **Thank-you check (website chat):** on a phone, open https://kirkcaldydental.co.uk/register/ and submit once with the owner's details. The page must show the thank-you **and** a row must appear in the Waiting list tab. The new page only shows the thank-you after the script replies "ok", so this proves the reply can be read.
     - If the page shows the "didn't go through" error but a row **did** appear, stop. Don't hand out leaflets, and tell the website and leaflet chats.
     - If the thank-you shows but no row appears, the page is probably still the old version (or the URL is wrong). Stop and tell the website chat.
   - Send the /exec URL to the website chat via the owner so it's committed. **Never re-upload register/index.html or assets/config.js from the repo while it still says PASTE_APPS_SCRIPT_URL_HERE.**
   - After any later script change: Deploy → **Manage deployments** → pencil → Version: **New version** → Deploy. This keeps the same URL; "New deployment" would create a new one.
8. **Processor agreements (UK GDPR).** With the owner, accept each one and save a PDF or screenshot into Drive **"11. Legal & compliance"**:
   - **ClickSend:** the Data Processing Agreement, plus the UK International Data Transfer Addendum (ClickSend is in Australia).
   - **Google Workspace:** Admin console → Account → Account settings → Legal and compliance → the **Cloud Data Processing Addendum**.
   - **Meta:** the Lead Ads Terms (§3.7) and Meta's Data Processing Terms (offered in Business settings or Ads Manager).
   - **Hostinger:** its Data Processing Agreement.

What happens with every lead, wherever it comes from:
- **8am–9pm:**
  - The row is added to the sheet.
  - The lead gets the thank-you text: "Hi Sarah, thank you for joining the Kirkcaldy Dental waiting list! Our team will call you to confirm your details. We can't wait to welcome you!" (no "very soon" promise, so it stays true on busy days)
  - ONE caller gets "🦷 NEW LEAD (facebook) – call now: Sarah Smith +447700900123" (with two or more callers, they take turns). The source in brackets is facebook, instagram, website, leaflet or banner.
  - The owner gets the same alert as an **email** to info@, not a text.
  - The lead gets a confirmation email, if they gave an email.
- **9pm–8am:**
  - The text says "…Our team will call you from 8am to confirm your details…".
  - The confirmation text still goes straight away. No caller alert goes out, nobody is called after 9pm, and the row is marked Status "Call 8am".
  - At 8am the caller gets "Good morning – X overnight leads to call."
- **Status "DO NOT CONTACT"** on any row blocks all future texts, emails and alerts to that number. Also add their phone (last 10 digits) and email to the "Do-not-contact list" tab, so a deleted row never forgets the request.
- **Someone signs up twice** (same mobile or email):
  - If it's within 24 hours, or they were already Called / Booked / Not interested: the new row gets Status "Duplicate", there's no caller alert, and they get at most one "you're already on the list" text a day.
  - If they were never reached: the caller gets a "REPEAT – NEW LEAD" alert so they try again.

## 6. Test everything, using the owner's own phone and email
**Before testing:**
- **Caller's phone:** `ONCALL_MOBILE` holds the caller's real mobile, so every test texts them "NEW LEAD – call now". Ask the owner to choose:
  - (a) warn the caller that test texts are coming and they shouldn't call back, or
  - (b) set `ONCALL_MOBILE` to the owner's mobile for the tests. Afterwards put the caller's number back, and do one website sign-up in calling hours the next day to confirm the caller gets the alert.
- **Testing after 9pm UK?** The scripts follow `CALL_HOURS`. After 9pm there's no caller alert, no owner email, no "Assigned to", Status is "Call 8am", and `backlogCheck()` does nothing.
  - For the tests, set `CALL_HOURS` to `24h` temporarily (only with option (b), or the caller's agreement).
  - Afterwards set it back to `8-21` and do one more website sign-up. Expect the "will call you from 8am" text, Status "Call 8am" and no alert.
- **Text not arriving?** Apps Script won't show an error, because ClickSend failures are silent. Open **ClickSend → Reports / SMS history** and read the status (e.g. invalid sender ID, insufficient credit, invalid number).

| Test | How | Expect |
|---|---|---|
| Facebook lead – no email, box unticked (only if email stays optional) | developers.facebook.com/tools/lead-ads-testing → pick the Page and form → **Preview form** → the owner's REAL name and mobile, **email deleted**, news-and-offers box **unticked** → submit. ("Create lead" fills dummy data, so no text would arrive.) Only one test lead per form can exist: press **Delete lead** before each new test. | within ~1–2 min: row with Source facebook; **Phone shows the real +447… number**; Email and Email status blank; **Marketing consent No**; Postcode, No. of People, Adult/Child/Family and Currently Registered? **blank** (the caller fills them on the call); Lead ID and Form ID filled; the thank-you text; in calling hours the caller alert, the owner's alert email in info@ (Gmail notification) and "Assigned to" filled. If Submit won't work with the box unticked, the box is wrongly Required: duplicate the form, set the box to Optional, publish the copy (owner's OK) and add its new Form ID (§4). |
| Facebook lead – box ticked | **Delete lead**, then the same with the box **ticked** and the owner's email filled in | **Marketing consent Yes**; Email filled; the confirmation email arrives |
| Facebook – phone check | on a phone, open Ad A's preview (Ads Manager → the ad → preview on mobile) and go through the form | the text-code step appears and the code arrives by SMS; on the thank-you screen, "View website" opens the home page |
| Website – no email (only if email stays optional) | on a phone, kirkcaldydental.co.uk/register: the owner's name and mobile, **email blank**, box unticked | the page shows the thank-you; row with Source website, Marketing consent **No**, Email status blank; the thank-you text; caller alert and owner email in calling hours |
| Website – box ticked | the same, with the owner's email and the box ticked | Marketing consent **Yes**; the confirmation email arrives |
| Website – postcode and people filled | the same, with a postcode and a number of people chosen | Postcode and No. of People saved |
| Website – landline | a real landline number the owner has (e.g. 01592 …) | a row and a caller alert; no text; the page says it will call instead |
| Website – number formats | the owner's mobile typed as "+44 (0)7…" | Phone saved as +447…, and the text arrives |
| Website – bad numbers | a +33 number, then a 070 number | an error under the phone box; no row |
| Website – not set up | before 5.7, while the site still has `PASTE_APPS_SCRIPT_URL_HERE`, open /register/ | the form is hidden and the "Sorry – online sign-up isn't working right now" box shows |
| Leaflet QR | scan the leaflet PDF QR (Visits tab gets a "leaflet" row), then **fill in and submit** the form | row with Source leaflet |
| Banner QR | the same with the banner PDF QR | row with Source banner. (/register/ typed in directly gives Source website.) |
| **GATE – Real lead (no app role)** | **Don't publish the ads until this passes.** After the app is Live: someone with **no role** on the Page, app or Business (e.g. a family member) submits the form from their own phone, from a live ad preview or the Page's form link | arrives like the test lead. If it doesn't, the app is still in Development mode. Delete the row afterwards |
| Repeat sign-up | submit the same phone again within 24h | new row Status "Duplicate", Notes "Already on the list…", no alert, no second text |
| Do not contact | pick `DO NOT CONTACT` in a test row's Call outcome (Status then shows DO NOT CONTACT), then submit again with the same phone via /register | row saved with Status DO NOT CONTACT; no text, alert or email |
| Call tracking (caller's phone) | on the **caller's phone**, Sheets app → a test row → **Call outcome** (column Y) → pick "No answer" | within a few seconds: Status "No answer", attempt 1, "Next call due" filled, a line in Call history and a new row in the Call log tab; Call outcome clears itself. Then pick "Reached - on list": Status "Called". Also pick "Found another dentist – leave list": Status must become Withdrew. If the dropdown doesn't offer it, use the sheet's list and tell the leaflet chat. If nothing happens, `trkInstallTriggers` wasn't run (§5.6) |
| Dashboard | open the Dashboard tab | counts by source update |
| Overload email | set `BACKLOG_ALERT` to `1`; edit a test row's Signup Time to over an hour ago with Status blank; run `backlogCheck()` from the editor (in calling hours or with `CALL_HOURS` 24h) | owner gets "leads waiting over an hour"; then set `BACKLOG_ALERT` back to `10` with one caller (`15` only once there are two or more) and delete `BACKLOG_LAST`. If health.gs is installed, this check uses its own settings instead: follow its fire drill |

**Afterwards:**
- Delete every test row **before 8am**, or the 8am summary will text the caller about them: the Waiting list and Visits tabs, and the test rows in **SMS log, Call log, Daily log and Failed sign-ups** (and Failed leads, if that tab exists). Put `CALL_HOURS` back to `8-21` and `ONCALL_MOBILE` back to the caller. Don't leave test numbers in the **Do-not-contact list** tab.
- After the last Facebook test, **leave that test lead in Meta** (don't press Delete lead) until real leads arrive. A brand-new Page gets a very small allowance for reading leads, and it grows with the leads the Page has.
- **Owner email alerts:** the script sends from info@ to info@. If the Gmail app doesn't notify for these self-sent emails, add a **Gmail filter in info@**: Subject contains "NEW LEAD" → Never send to Spam, Mark as important. Set the Gmail app's notifications for info@ to "All". Keep `OWNER_EMAIL` as info@ (don't use a personal address). This is about `OWNER_EMAIL` only. `HEALTH_EMAIL` (health.gs) should hold the owner's personal email first, then info@, so critical alerts still reach the owner if info@ breaks.
- **Errors:** the owner is emailed automatically if Facebook leads stop arriving (e.g. "Meta API 190" = token wrong or expired, so make a new one as in Step 5.2), or if a lead can't be processed (the email includes the person's details so they can be added by hand). Details are in Apps Script → **Executions**.

## 7. Launch the ads (only with the owner's OK)
**Owner must confirm first (ask, don't guess):**
1. A copy of the existing **NHS Fife approval** (email or letter) is saved in Drive "11. Legal & compliance". The owner says the approval exists ("They know that we're opening an NHS practice") and an inspection comes later, so **no new letter is needed**. The copy is proof if anyone questions the word "NHS" in the ads.
2. The ads say "We'll offer NHS and private dental care". The GDC requires publicity to say whether a practice is NHS, mixed or private. The owner confirmed it's a mixed practice (NHS and private), so keep this line.
3. "Be first in line" stays (owner decision). Invitations follow sign-up order, with households kept together.
4. **Photos:** the ad photos are AI/stock images. No model release is needed for AI-generated people. Keep a note of the AI tool or stock licence in Drive "11. Legal & compliance", and never caption or describe the people as real patients.

Use the **draft campaign and ad set from §4** (Ads Manager → the draft), and check every setting below:
- **Objective: Leads.** Accept the default **Advantage+ leads campaign**. Campaign budget **£20/day**, daily. Bid strategy **Highest volume**.
  - If Meta asks you to declare a special ad category, follow its prompt. A dental practice is usually *none*. If an ad is ever flagged as a "social issue" ad, appeal; don't go through authorisation.
- **One ad set:**
  - **Conversion location: "Instant forms"** (the default "Website and instant forms" would send some people to the website, and those leads never reach our script).
  - Performance goal: **Maximise number of leads**. Pick the form from §4.
  - **Location:** remove the default and add **postcodes KY1, KY2, KY3, KY4, KY5**, "**People living in this location**".
    - Then open "Advantage+ audience / Reach more people…" and make sure **"Reach more people likely to respond to your ads" is UNTICKED**.
    - Never add EH (Leith and Granton are 9 miles away across the Forth), KY6, KY7 or KY8 (the owner's own Glenrothes and Leven practices).
  - **Age: minimum 18** (set it as the hard minimum-age control, not just a suggestion). **No detailed interests.** **Placements:** Advantage+ (the only option now).
  - No ad scheduling.
- **Two ads.** Drive "1. Meta Ads" has a "READ ME – which ad file goes where" doc. **Use only the folders marked "(USE THESE)"**; ignore "Old versions – not used".
  - **Ad A:** folder "Ad A – Woman (USE THESE)". Feeds = `2 – Ad A – FEED video (4x5).mp4` (backup `1 – Ad A – FEED image (4x5).png`). Stories/Reels = `4 – Ad A – STORIES & REELS video (9x16).mp4` (backup `3 – … image (9x16).png`). Use placement asset customisation.
  - **Ad B:** folder "Ad B – Family (USE THESE)", with the same four files.
  - **On each ad (A, B and any ad added later)** – HANDOFF Step 2, "Settings on EVERY ad":
    - Destination: the form from §4, with **"Require SMS verification to submit form" ticked** (Required if offered).
    - **Lead nurturing → Follow-up channels:** Messenger, Instagram and WhatsApp all **unticked**. Nobody watches those inboxes.
    - **Lead capture AI agent / AI chat: Off** (if shown).
  - Text: copy **exactly** from HANDOFF.md Step 5 (primary text A and B, Stories/Reels text, three headlines, description). **CTA: Sign up.**
  - **Advantage+ creative: switch EVERY enhancement OFF.** Check both the creative step and "Advanced preview / Review defaults". Untick generated text variations, image text rewriting/"text improvements", "add overlays", music, image expansion, visual touch-ups and every AI-generated variant.
  - Optional sound for the videos: pick one calm instrumental from Meta's Sound Collection.
- Preview both ads in every placement with the **safe-zone overlay**. All text must be clear of the top and bottom bars.
- **Tell the owner:** ads with the text-code check run **only on mobile** Facebook and Instagram placements (Feeds, Stories and Reels; no desktop). In the placement preview, check that the 9:16 Stories/Reels videos are offered. If Stories/Reels are missing, tell the ads chat.
- Before publishing, show the owner the ad previews **and the form preview** and get a clear "yes".
- **Automated rule** (Ads Manager → Rules → Create rule): campaign, condition **Leads (today) is greater than 25 × the number of callers on shift** (e.g. 50 with two callers; raise it whenever callers are added) → action **Turn off campaign** + notify. Check every 30 minutes. It's a safety valve if the ad goes viral. The daily-jobs person switches the campaign back on at 8am **only if the overnight leads have been called**.
- **Launch day, within 2 hours of the ads going live:** compare the number of leads in **Leads Center** (Business Suite → All tools → Leads Center, or Ads Manager) with the facebook/instagram rows in the sheet since launch.
  - If any are missing: check the app is still **Live** (§5.1) and **Leads access** includes the app and the System User (§5.3).
  - Then download the missing leads from Leads Center (CSV) and add each one to the Waiting list by hand: a real Signup Time, Source facebook (or instagram), Notes "added by hand – no auto text". The caller rings them first. Tell the ads chat.
  - If leads are missing, use the Launch-day fallback card.
- **48 hours after launch:** check Breakdown → Delivery → Placement (no junk placements) and that no AI-made variants have appeared. After any edit or duplicate, re-check that Advantage+ creative is still all OFF.

## 8. The 4-week plan: tell the owner and leave it in writing
*Updated 8 Nov from the forecast agent team. Three independent methods agreed on: **about £1.50 per lead** (range about £0.65–£4), **about 15 Facebook/Instagram sign-ups a day at £20/day** (about 100 a week), and about **1,650 sign-ups (~3,150 people) by opening** from all channels. **Callers are not a limit: the owner has staff available, so add callers as sign-ups grow (owner, 8 Nov).***

| Week | Daily budget | Goal | Rules |
|---|---|---|---|
| 1 | **£20** | check everything works, first data | change nothing for 3–4 days; check approvals, leads, texts and the caller daily |
| 2 | £20 → **£25** | pick the winner | pause the ad whose cost per lead is 30%+ worse after ~7 days; add 1–2 new versions of the winner (ask the ads chat) |
| 3 | £25 → **£35** | scale carefully | raise ~20–25% every 3–4 days, making ad changes on the same day; if frequency > ~3, add fresh ads |
| 4 | £35 → **£50** | keep scaling while cost per lead stays good | every lead still called within the hour (add callers as needed) |

**Callers:** the owner has staff, so calling is not a limit. Rule of thumb: **one caller for every ~20–25 new sign-ups a day** (no-answers and call-backs mean about 1.6 calls per lead).
- Before each budget step, make sure there are enough callers on shift for the extra leads.
- To add callers: Script Property `ONCALL_MOBILE` = the mobiles of every caller on shift today (take out anyone who is off), comma-separated (UK mobiles only); `ALERT_MODE` = `rotate`, so each lead goes to the next caller and no two people ring the same person; `BACKLOG_ALERT` = `15`.
- Add one the same day if the backlog email arrives, sign-ups stay above ~20 a day per caller, or a press story or viral post lands.

**Real cost:** Ads Manager shows the budget before tax. Meta adds a **2% UK location fee** (since 1 Jul 2026, not shown in Ads Manager) and **20% VAT**. Dental care is VAT-exempt, so the clinic normally **can't reclaim** that VAT. £20/day is really about **£24.50/day**. The 4-week plan is about £810 in Ads Manager, or about **£990 all-in**, plus texts (about 9p per lead).

Daily rules:
- Leads arrive faster than the callers can ring within the hour (the owner also gets the overload email) → **add a caller** the same day; only if nobody is available, cut the budget 20%.
- Cost per lead **above £5 for 3 days** (the owner's expected level) → fix the ad or form, don't add money, and tell the ads chat. **Above £8 → pause** and ask the ads chat. The forecast expects about £1.50; if it's well under £5, keep going.
- Cost per lead under £4 for 3 days, and the backlog email not firing → raise 20% (with enough callers on shift), no more than once every 3–4 days.
- An ad gets rejected → tell the ads chat.
- Black Friday (27 Nov) and Christmas push ad prices up 15–30%. That's expected; don't panic.

If opening is more than ~6 weeks away, stay at £15–20/day for longer.

**Black Friday and Christmas (pre-mortem):**
- **No budget rises from 25 Nov to 2 Dec.** Ad prices jump, so lead costs rise for reasons that have nothing to do with the ads.
- **By 1 Dec, decide the festive plan:** either name who calls from 24 Dec to 2 Jan, or drop the ads to £5–10/day for that period. Overnight and holiday leads still get the instant text.

**Cautious alternative (family suggestion):**
- Start at **£10/day** with both ads in the one ad set. That brings about 7 leads a day; learning is slower and the first read on the better ad is noisier.
- Raise to £15 after 4–5 days and £20 in week 2, then follow the table one week behind.
- About £590 in Ads Manager (about £720 all-in), giving about 390 leads instead of about 540.

## 9. Daily jobs for one staff member (~15 min a day)
- 8am: check the ads are running, the card is OK and nothing is rejected. If the daily leads rule switched the campaign off, switch it back on **only once the overnight leads have been called**.
- Reply to Facebook/Instagram comments and messages within a few hours:
  - Use "waiting list" wording only. Never say "accepting" or "taking on" patients, never promise registration or a date, and never say "first come, first served", "limited places", "free NHS dentist" or "guaranteed".
  - Ready reply: "Thanks for your interest! We're a new NHS dental practice, also offering private treatment, opening soon at 23–25 Tolbooth Street. Please join our waiting list using the Sign up button or at kirkcaldydental.co.uk/register and we'll be in touch before we open."
  - **Hide** any comment where someone posts their phone number, address or health details, and reply asking them to use the form.
  - Anyone asking to stop → pick "DO NOT CONTACT" in their row's Call outcome (Status then shows DO NOT CONTACT) the same day, and add their phone (last 10 digits) and email to the "Do-not-contact list" tab, so a deleted row never forgets the request.
- **After every call, pick a value from Call outcome (column Y)**, including on rows that say "Call 8am". **Status fills itself; notes go in Notes**, never in Call outcome. Don't type over Status.
  - The values: No answer, Voicemail, Busy/declined, Reached - booked, Reached - call back, Reached - on list, Reached - not interested, Found another dentist – leave list, Wrong number, Withdrew, DO NOT CONTACT. This matches the waiting-list chat's caller script and the leaflet chat's tracking.gs.
  - Before the practice opens, pick "Reached - on list", not "Reached - booked".
  - People still registered at another practice who want to join stay on the list: write their practice in "Current practice" (or Notes if there's no such column). Use "Found another dentist – leave list" only if they want to come off.
  - The script then sets Status, counts the attempt, sets "Next call due" and logs the call. A row left blank or on "Call 8am" counts as not yet called in the 8am summary, the overload email and the 9pm report.
  - Rows marked "Duplicate" are repeat sign-ups and don't need a call; check the earlier row named in Notes.
- **After reaching someone, fill in** whichever of Postcode, No. of People, Adult/Child/Family and Currently Registered? are still blank. For rows with Source website, also ask how they heard about us.
- **What callers must say on every call:** their name, "Kirkcaldy Dental & Implant Clinic" and why they're calling (the person joined the waiting list). Then:
  - joining isn't registration;
  - in Scotland, registering with a new practice ends their registration at their old one, but nothing changes until we invite them;
  - we never ask for payment to join or for the first exam;
  - no selling of private treatment on these calls. Only answer questions if the person asks.
  - Ask "Where is your current dentist?" and note it in "Current practice" (or Notes).

## 10. Back to the ads chat (Claude Code) after launch
- Each week the owner asks the ads chat "how are the ads doing?".
  - It reads the Dashboard and, once the ad account is connected, Meta results.
  - It recommends budget, the winning ad and new creatives, and logs what worked.
- Any wording change: update BRAND.md first and tell all chats.

## 11. When the clinic's 01592 phone number exists: add it everywhere (owner wants it on the ads)
Some people would rather phone than fill in a form, so show the number. Keep the form as the main route, because it captures details and gets cheaper leads.
**Use only the clinic's real 01592 number. Never use the Dentally placeholder number** (Dentally still shows a placeholder for Kirkcaldy): not on the ads, Page, form, website, leaflet, banner or texts.
1. **BRAND.md:** add the number under contact details first. Tell all three chats (ads, leaflet, website).
2. **Ad images and videos:**
   - The ads chat sets `PHONE` in `ads/source/ad.html` and re-renders.
   - The number appears as "kirkcaldydental.co.uk/register · Call 01592 …" on all 4 ads and videos.
   - Then replace the files in Drive "1. Meta Ads" and in Ads Manager.
3. **Primary text:** add a last line to both ads: "Prefer to talk? Call us on 01592 … (8am–9pm)."
4. **Instant Form completion screen:** a published form can't be edited, so this needs a duplicated form (new Form ID in `META_FORM_IDS`, §4, with the owner's OK). On the copy, set the button to **Call business** with the number (or add it next to "View website"), and only once someone answers the phone 8am–9pm.
5. **Facebook Page:** add the number and a **Call now** button.
6. **Leaflet and banner:** the leaflet chat re-renders with the number (`node render.js "01592 …"`).
7. **Website:** the website chat adds it to the footer and the register page.
8. **Phone answering:**
   - Answer 8am–9pm.
   - Voicemail: "Thanks for calling Kirkcaldy Dental. Leave your name and number and we'll call you back, or join our waiting list at kirkcaldydental.co.uk/register."
   - Log every caller in the Waiting list tab with **Source = phone**.
9. Optional later:
   - Missed-call text-back: callers who aren't answered get a text with the sign-up link (the ads chat can build it).
   - A separate **Calls** ad.

---
*Being added when the research teams finish:*
- Meta ads 2026 playbook
- Waiting-list playbook (journey, keep-warm messages, invite waves, NHS Scotland rules)
- Creative improvements
- Strategy, forecast and metrics
- Risk register with health checks

*This file will be updated. Use the latest version on `main`.*
