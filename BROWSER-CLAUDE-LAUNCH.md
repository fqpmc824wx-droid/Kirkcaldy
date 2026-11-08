# Setup night: launch runbook for browser Claude

**Browser Claude: read this whole file first.** Then read:
- **BRAND.md** and **leads/README.md**, both on `main`
- **leaflet/README.md**, which is on branch `claude/brave-allen-i14xnx` until PR #1 is merged

Work through the steps in order with the owner watching.

**Where HANDOFF.md and this file differ, this file wins.**
- From HANDOFF.md use only: the Rules, Step 1 items 0–5 (with the DNS fix in Step 1 here), Step 2 (form wording) and the legal checklist.
- **Skip** HANDOFF Step 1 item 6 (Hostinger mailbox) and anything about Make.com or Zapier. **Don't sign up to Make or Zapier.** Our own scripts in Step 5 replace them.

**Ask the owner before anything that costs money, publishes ads, or sends a message to a real person.** Test messages to the owner's own phone are fine. Follow BRAND.md wording exactly. Never say "accepting / taking on / registering NHS patients", "limited places" or "first come, first served", and never use the NHS logo.

Repo: `fqpmc824wx-droid/Kirkcaldy`. Where things are until the PRs are merged:
- **Website pages:** all on branch `claude/brave-allen-i14xnx` (PR #1): `site/index.html`, `site/privacy.html`, `site/register/index.html`, `site/b/index.html`, `site/l/index.html`.
  - PR #2 (`claude/hostinger-plugin-install-eyvjb3`) only adds the new halfway logo files in `site/assets/`.
  - PR #2's own index.html and privacy.html are old and use the WRONG email (info@kirkcaldydentist.co.uk). Never upload those two.
  - The two PRs merge without conflicts. **Ask the owner to merge PR #1 and PR #2 into `main` first.** Then use `site/` on `main`.
- **Website sign-up script:** `leaflet/apps-script.gs` (PR #1 branch, or `main` after merging).
- **Facebook lead script:** `leads/meta-leads.gs` on `main`.
- **Ads (images + videos):** `ads/` on `main`. Also in Google Drive → "Kirkcaldy Dental – Print files & marketing" → **1. Meta Ads**, with the same file names.

---

## 0. Have ready before starting
| Item | Who |
|---|---|
| A **laptop/desktop** (not a phone) to download the website files and upload them to Hostinger | owner |
| Hostinger login with access to the hosting for kirkcaldydental.co.uk (from Abdullah) | owner |
| **Domain/DNS login:** Google Workspace super-admin for kirkcaldydental.co.uk (domain is managed via Squarespace Domains) | owner |
| Google login **info@kirkcaldydental.co.uk** (owns the Waiting List sheet) | owner |
| **GitHub login** for fqpmc824wx-droid (to merge PR #1 and #2) | owner |
| Owner's personal Facebook login + phone for Meta verification codes | owner |
| Payment card (Meta ads + text credit) | owner |
| Mobile number of the **one caller** who gets the lead texts (owner gets email alerts instead) | owner |
| Daily ad budget: **£20/day to start** (2 ads; the family's alternative is £10/day, see section 8) | agreed |
| Clinic phone number 01592 … (optional; can be added later) | owner |

Waiting List sheet: https://docs.google.com/spreadsheets/d/1WxadIcaibszu3YYR3eqNMjaQQ0V3LJ_Mvdsx_I2KBQI/edit
- Tabs: **Dashboard** (first; don't write to it), **Waiting list**, **Visits**.
- Waiting list columns: Signup Time, Name, Phone, Email, Postcode, No. of People, Currently Registered?, Adult/Child/Family, Source, Status, Assigned to, Marketing consent, Notes.

---

## 1. Website live on Hostinger (must come first: the Meta form needs the privacy page)
1. **Get the files.** **Don't upload `kirkcaldy-dental-website.zip`** from the repo or Drive "5. Website": no copy has the QR pages `b/` and `l/`, so the printed QR codes would 404.
   - Instead go to github.com/fqpmc824wx-droid/Kirkcaldy → branch `main` (or `claude/brave-allen-i14xnx` if PR #1 isn't merged) → **Code → Download ZIP** → unzip on the laptop.
   - If PR #2 isn't merged, also download branch `claude/hostinger-plugin-install-eyvjb3` and take its `site/assets/` files (the new logo).
2. **Upload.**
   - Go to Hostinger → Websites → kirkcaldydental.co.uk → **File Manager** → `public_html`, and delete any default `index.php`/`default.php`.
   - Upload the **contents** of `site/`, not the folder itself.
   - `public_html` must end up with: `index.html`, `privacy.html`, `assets/`, `register/index.html`, `b/index.html`, `l/index.html`.
   - Check the footer says **info@kirkcaldydental.co.uk**, never kirkcaldydentist.
3. **DNS (required, not optional).** The domain points at Squarespace today.
   - Go to Google Admin (super-admin) → Domains → Manage domains → kirkcaldydental.co.uk. This opens Squarespace Domains. Then open **DNS**.
   - **Remove** the Squarespace Defaults: the 4 A records for `@` (198.185.159.144, 198.185.159.145, 198.49.23.144, 198.49.23.145) and the CNAME `www` → ext-sq.squarespace.com.
   - **Add** A `@` → the Hostinger IP (plus AAAA if Hostinger gives one), and CNAME `www` → kirkcaldydental.co.uk.
   - **Keep** the MX record (smtp.google.com) and the SPF TXT record. **Don't change nameservers.**
   - **Skip HANDOFF Step 1 item 6.** info@ is already a Google Workspace mailbox. Don't create a Hostinger mailbox, and decline any Hostinger offer to change MX, SPF or nameservers.
4. **SSL.** Old DNS can be cached for up to ~4 hours.
   - Don't wait: carry on with Steps 2, 3, 4 (form privacy URL https://kirkcaldydental.co.uk/privacy.html) and 5.1–5.6.
   - Come back when https://kirkcaldydental.co.uk shows the Hostinger site, then turn on SSL in Hostinger.
   - **Every https page must load before Step 5.7, the Step 6 tests and any ad.**
5. **Check these load over https:** `/`, `/privacy.html`, `/register/`, and `/b` and `/l`, which must forward to `/register/?src=banner` and `?src=leaflet`.
6. **privacy.html: known issue (8 Nov), no branch passes yet.**
   - Use PR #1's `privacy.html` (it has the right email and lists Hostinger).
   - If the website chat hasn't pushed a fixed version by the night, get the owner's OK and edit it in Hostinger File Manager → `public_html/privacy.html` → right-click → Edit:
     - Delete `<li><strong>Zapier</strong>, which transfers your details from the form to our records</li>`.
     - Change the ClickSend line to `<li><strong>ClickSend</strong>, which sends our text messages</li>`.
     - Replace the first "How we use your information" item with `<li>To record your request to join our waiting list, confirm it by text and email, and text and call you about it between 8am and 9pm</li>`.
     - Replace the "We will not use your details for unrelated marketing…" paragraph with `<p>We only send news and offers by text or email if you ticked the optional box on the form. To stop any contact, email <a href="mailto:info@kirkcaldydental.co.uk">info@kirkcaldydental.co.uk</a> or tell the person who calls you. We never sell your information.</p>`.
   - Reload and check: Meta, Google, ClickSend and Hostinger are listed, there's no Zapier, and every email is @kirkcaldydental.co.uk.
   - Tell the owner to send the same edits to the website chat so the repo matches.
   - **Don't publish ads until this page passes.**
7. **/register/ consent check.** The page must show:
   - **(a)** "By joining, you're asking Kirkcaldy Dental & Implant Clinic to add you to our waiting list. We'll text and call you about your request, 8am–9pm, and email you to confirm. We won't send you marketing unless you opt in below. See our privacy policy."
   - **(b)** a separate **optional, unticked** box "Yes, also send me news and offers from Kirkcaldy Dental by text and email. I can opt out at any time." (field `marketing`).
   - If it still has a required "I'm happy … opening news" box, tell the owner. The website/leaflet chat must fix it before leaflets go out. Until then, treat every website row as Marketing consent = No.
8. **The register page saves nothing until Step 5.7 is done.** Finish 5.7 tonight. **Don't hand out leaflets or put up the banner until a test sign-up appears as a row in the sheet.**

## 2. Text-message provider: pick the cheapest, top up safely
1. **Compare UK prices before paying.**
   - Check the ClickSend pricing calculator with **United Kingdom** selected, and Twilio UK SMS pricing (third-party pages showed about $0.056 per UK text in Oct–Nov 2026). Expect about **3–6p per text + VAT**.
   - Tell the owner both prices. The scripts are built for **ClickSend**.
   - Switching to Twilio means changing `sendSms()` in `leaflet/apps-script.gs` only (meta-leads.gs uses that same function), so ask the ads chat if Twilio is much cheaper.
2. **Ask the owner before paying.**
   - **Top up £50.** If you turn on auto top-up, keep it small (e.g. £20 when the balance drops below £10). Set a monthly limit and a low-balance email if ClickSend offers them.
   - If ClickSend lets you restrict destination countries, allow **United Kingdom only**.
3. Register sender ID **KirkDental** and **wait until ClickSend shows it approved/active**.
4. Copy the ClickSend **username** and **API key** (Dashboard → API Credentials).

Budget to tell the owner:
- Each lead uses about **2.2 texts**: the thank-you to the lead plus the alert to the caller.
  - Alerts start with an emoji, so long names cost 2 credits.
  - The 8am summary costs 2 credits a day.
  - The owner gets free email copies instead.
- That's about **9p per lead**, so the text bill follows lead volume: 300 leads ≈ £27; 2,600 leads ≈ £235.

## 3. Facebook Page, Business account, ad account
1. Create the **Facebook Page** "Kirkcaldy Dental & Implant Clinic".
   - Profile picture: Drive "4. Logo & Brand" → **"Logo – gold (FINAL, K on D).png", the NEWEST one** (8 Nov, 18:05; the halfway logo). Check it reads well in Facebook's circular crop.
   - Address: 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.
   - Website: kirkcaldydental.co.uk.
   - Email: info@kirkcaldydental.co.uk.
   - Add the 01592 number if they have one.
2. Link Instagram if the clinic has an account (optional).
3. Create a **Meta Business portfolio** (Business settings) for the clinic, owned by the owner.
4. **Add the Page to it:**
   - Business settings → Accounts → Pages → + Add → Add an existing Facebook Page → the clinic Page.
   - Then Users → People → the owner → Assign assets → the Page (full control).
5. Create an **ad account** (Business settings → Accounts → Ad accounts → Add → Create): currency **GBP**, time zone **Europe/London**. Assign it to the owner with full control.
6. Add the **payment card**. (An ad account 1207154818311419 already exists with **no payment method and no campaigns**. If that is the clinic's account, use it and add the card there. Don't create a second one.)
7. **Lead Ads terms:** logged in as Page admin, open facebook.com/ads/leadgen/tos, pick the clinic Page and accept. Meta may also prompt for this when you create the form.
8. **Remove single points of failure:** add a second trusted person (e.g. a family member) as admin on the Page, Business portfolio and ad account.
9. **Business verification** (Business settings → Security Centre → Start verification). It can take a few days and doesn't block launch. A new ad account has a hidden daily spending limit that rises with verification and good standing.
10. **Account-wide safety settings. Do these now, because they can take up to 48 hours to apply:**
    - Ad account → Advertising settings → Creating ads → Creative features: **untick "Test new creative features"**.
    - Advertising settings → Branding / Identity → restricted words: `accepting`, `taking on`, `first come`, `limited places`, `free dentist`, `guaranteed`, `specialist`. This is only a backstop, because Meta doesn't always obey it.
    - Optional: Account controls → Placement controls (objective Leads) → exclude **Audience Network**, which can bring cheap junk leads. It applies to every Leads campaign in this ad account.

## 4. Instant Form (lead form)
Use HANDOFF.md Step 2 wording **exactly** (updated 8 Nov from the research). Build it in **Ads Manager** (during ad creation → Instant form → Create form), **not** Business Suite, because phone verification needs Ads Manager.
- **Form type: Higher intent**, with **phone number verification: required**. **Lead capture AI agent / AI chat: OFF.**
- Form name `KDIC waiting list v1 – Nov 2026`. Intro headline, intro text, disclaimer, checkbox and completion screen: all exactly as in HANDOFF.md Step 2.
- **Questions:**
  - Full name, Phone number, Email.
  - Meta's built-in **Post code** question (not ZIP code, not a custom short answer).
  - **Only the two** multiple-choice questions ("How many people…", "Who is this for?"), **copied word for word**. The script finds the answers by the words "post", "how many"/"people" and "who".
  - **No** "Are you currently registered with a dentist?" question any more (health-data risk); the caller asks on the call. Conditional logic off.
- **Completion button:** View website → `https://kirkcaldydental.co.uk/waiting-list/?src=fb-form-done`. If the website chat hasn't built /waiting-list/ yet, use `https://kirkcaldydental.co.uk/?src=fb-form-done`.
- **Save as draft → show the owner the preview → publish only after a clear "yes".** A published form can't be edited.
- Copy the **Form ID**.
- **Important for later:** a published Instant Form can't be edited, only duplicated, and the copy gets a NEW Form ID. Whenever a form is created or duplicated, add its ID to Script Property `META_FORM_IDS` (comma-separated; keep the old ID until the old form has no live ads), then submit one test lead.

## 5. Lead system: our own free scripts (no Zapier or Make)
1. **Meta developer app:**
   - Go to developers.facebook.com → My Apps → Create app → type **Business** → owned by the clinic's Business portfolio.
   - Add the Marketing API / Facebook Login for Business product.
   - App settings → Basic: Privacy policy URL `https://kirkcaldydental.co.uk/privacy.html`, category Business. Then switch **App Mode to Live**. In Development mode the app only sees leads from people who have a role on the app, so real leads would silently be missed.
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
   - If the leaflet chat has added `tracking.gs`, add it the same way (see `leaflet/README.md`).
   - Project Settings → Time zone → **(GMT+00:00) London**.
   - In the sheet: File → Settings → Time zone → **London** → Save.
5. **Project Settings → Script Properties:**
| Property | Value |
|---|---|
| `CLICKSEND_USER` | ClickSend username |
| `CLICKSEND_KEY` | ClickSend API key |
| `META_PAGE_TOKEN` | the System User (or Page) token |
| `META_FORM_IDS` | the Form ID (comma-separate if more than one) |
| `ONCALL_MOBILE` | the **one caller's mobile** (owner decision: only one person gets the lead text) |
| `ALERT_MODE` | leave empty (only needed if more callers are added later; then use `rotate`) |
| `OWNER_EMAIL` | `info@kirkcaldydental.co.uk` (owner gets a free **email** copy of every alert; Gmail app on the owner's phone with notifications ON for this account) |
| `OWNER_MOBILE` | leave **empty** (owner chose email alerts instead of text copies) |
| `CALL_HOURS` | `8-21` (owner decision: **no calls after 9pm**) |
| `BACKLOG_ALERT` | `10` for one caller (owner is emailed if 10+ leads have waited over an hour); `15` once there are two callers |
| `META_AD_ACCOUNT_ID` | `act_` + the ad account number (Ads Manager → account dropdown), e.g. `act_1207154818311419` |
| `META_ADS_TOKEN` | leave **empty** (it reuses `META_PAGE_TOKEN`, which has `ads_read`) |
| `LAUNCH_DATE` | the day the ads go live, `yyyy-mm-dd` (set it on launch day) |
| `META_API_VERSION` | leave **empty** (the script uses `v27.0`). If the owner ever gets an email saying the Meta version is deprecated, set it to Meta's newest version, e.g. `v28.0`. |
Don't touch `ALERT_NEXT`, `META_SINCE`, `META_SINCE_BY_FORM`, `META_SEEN`, `BACKLOG_LAST`, `REPORT_LAST` or any `*_ERR_LAST`. They're set automatically.
**Sheet dropdowns:** in the Waiting list tab, the Status column (J) must offer: Called, No answer, Booked, DO NOT CONTACT, Call 8am, Duplicate, Unreachable, Wrong number, Not interested, Withdrew (Data → Data validation, "Show a warning"). The leaflet chat is adding these, plus tracking columns N onwards (Lead ID, Ad name, SMS status…). If they're already there, leave them as they are. Columns K (Assigned to) and L (Marketing consent) must have no restrictive dropdown. Format the Phone column as Plain text. Never set "Reject the input" on columns the scripts write.
6. **Run `installLeadTriggers()` once:**
   - Open the `meta-leads` file, choose `installLeadTriggers` in the function dropdown, then Run → Review permissions → choose info@.
   - If "Google hasn't verified this app" appears: Advanced → Go to … (unsafe) → Allow. This is normal for the clinic's own script.
   - It sets up: checking Meta every minute, the 8am summary, the backlog check every 15 minutes, and the 9pm report to the owner.
   - **On launch day (after the ads are published):** open the `meta-ads` file → run `adsInstallTriggers` once. The Executions log should show the ad account name, "Europe/London" and "GBP". It adds the 06:00 ad-results sync ("Ads" tab), the Monday breakdowns and the 2-hourly ad health check. The owner is emailed if an ad is rejected, the ads stop spending, the cost per lead goes above £3.50, or leads that Meta counted are missing from the sheet.
   - Then Apps Script → **Triggers** (clock icon) → for every trigger, pencil → **Failure notification settings: Notify me immediately** → Save. Do `pollMetaLeads` first.
7. **Deploy the website script:**
   - Deploy → **New deployment** → type **Web app** → Execute as **Me (info@)** → Who has access **Anyone**. Not "Anyone with Google account": if "Anyone" isn't offered, stop and tell the owner, because a Google Admin sharing setting is blocking it.
   - Copy the `/exec` URL.
   - In Hostinger File Manager, open `public_html/register/index.html` → right-click → Edit → replace `PASTE_APPS_SCRIPT_URL_HERE` with the full `https://script.google.com/macros/s/…/exec` URL (keep the quotes) → Save.
   - **A "Thank you" on the page proves nothing: a row must appear in the Waiting list tab.**
   - Send the /exec URL to the website chat via the owner so it's committed. **Never re-upload register/index.html from the repo while it still says PASTE_APPS_SCRIPT_URL_HERE.**
   - After any later script change: Deploy → **Manage deployments** → pencil → Version: **New version** → Deploy. This keeps the same URL; "New deployment" would create a new one.

What happens with every lead, wherever it comes from:
- **8am–9pm:**
  - The row is added to the sheet.
  - The lead gets the thank-you text: "Hi Sarah, thank you for joining the Kirkcaldy Dental waiting list! Our team will call you to confirm your details. We can't wait to welcome you!" (no "very soon" promise, so it stays true on busy days)
  - The caller gets "🦷 NEW LEAD (facebook) – call now: Sarah Smith +447700900123". The source in brackets is facebook, instagram, website, leaflet or banner.
  - The owner gets the same alert as an **email** to info@.
  - The lead gets a confirmation email.
- **9pm–8am:**
  - The text says "…Our team will call you from 8am to confirm your details…".
  - No alert goes out, and the row is marked Status "Call 8am".
  - At 8am the caller gets "Good morning – X overnight leads to call."
- **Status "DO NOT CONTACT"** on any row blocks all future texts, emails and alerts to that number.
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
| Facebook lead | developers.facebook.com/tools/lead-ads-testing → pick the Page and form → **Preview form** → submit with the owner's REAL name, mobile, email and postcode. ("Create lead" fills dummy data, so no text or email would arrive.) Only one test lead per form can exist: press **Delete lead** before each new test. | within ~1–2 min: row with Source facebook; Postcode, No. of People and Adult/Child/Family filled (Currently Registered? stays blank: the caller asks); Lead ID, Ad ID and Form ID filled if those columns exist; thank-you text and email; caller alert; owner alert email in info@ with a Gmail notification; "Assigned to" filled |
| Website sign-up (no tick) | fill in kirkcaldydental.co.uk/register, optional box unticked | row with Source website, Marketing consent **No**, same texts/alerts |
| Website sign-up (ticked) | same, with the optional box ticked | Marketing consent **Yes** |
| Leaflet QR | scan the leaflet PDF QR (Visits tab gets a "leaflet" row), then **fill in and submit** the form | row with Source leaflet |
| Banner QR | the same with the banner PDF QR | row with Source banner |
| Real lead (no app role) | after the app is Live: someone with **no role** on the Page, app or Business (e.g. a family member) submits the form from their own phone, from a live ad preview or the Page's form link | arrives like the test lead. If it doesn't, the app is still in Development mode. Delete the row afterwards |
| Repeat sign-up | submit the same phone again within 24h | new row Status "Duplicate", Notes "Already on the list…", no alert, no second text |
| Do not contact | set a test row's Status to `DO NOT CONTACT`, then submit again with the same phone via /register | row saved with Status DO NOT CONTACT; no text, alert or email |
| Dashboard | open the Dashboard tab | counts by source update |
| Overload email | set `BACKLOG_ALERT` to `1`; edit a test row's Signup Time to over an hour ago with Status blank; run `backlogCheck()` from the editor (in calling hours or with `CALL_HOURS` 24h) | owner gets "leads waiting over an hour"; then set `BACKLOG_ALERT` back to `15` and delete `BACKLOG_LAST` |

**Afterwards:**
- Delete every test row (Waiting list and Visits tabs) **before 8am**, or the 8am summary will text the caller about them. Put `CALL_HOURS` back to `8-21` and `ONCALL_MOBILE` back to the caller.
- **Owner email alerts:** the script sends from info@ to info@. If the Gmail app doesn't notify for these self-sent emails:
  - set `OWNER_EMAIL` to the owner's personal Gmail address, or
  - add a Gmail filter "Subject contains NEW LEAD → Never send to Spam, Mark as important" with notifications set to "All".
- **Errors:** the owner is emailed automatically if Facebook leads stop arriving (e.g. "Meta API 190" = token wrong or expired, so make a new one as in Step 5.2), or if a lead can't be processed (the email includes the person's details so they can be added by hand). Details are in Apps Script → **Executions**.

## 7. Launch the ads (only with the owner's OK)
**Owner must confirm first (ask, don't guess):**
1. Written NHS Fife confirmation that the dentists are on, or provisionally on, the NHS Fife dental list. Until then, NHS wording is risky.
2. The ads say "We'll offer NHS and private dental care". The GDC requires publicity to say whether a practice is NHS, mixed or private. If implants are private, the practice is "mixed".
3. "Be first in line" stays only if invitations really follow sign-up order (households kept together). Otherwise remove it from the headline options.

Ads Manager → Create:
- **Objective: Leads.** Accept the default **Advantage+ leads campaign**. Campaign budget **£20/day**, daily. Bid strategy **Highest volume**.
  - If Meta asks you to declare a special ad category, follow its prompt. A dental practice is usually *none*. If an ad is ever flagged as a "social issue" ad, appeal; don't go through authorisation.
- **One ad set:**
  - **Conversion location: "Instant forms"** (the default "Website and instant forms" would send some people to the website, and those leads never reach our script).
  - Performance goal: **Maximise number of leads**. Pick the form from step 4.
  - **Location:** remove the default and add **postcodes KY1, KY2, KY3, KY4, KY5**, "**People living in this location**".
    - Then open "Advantage+ audience / Reach more people…" and make sure **"Reach more people likely to respond to your ads" is UNTICKED**.
    - Never add EH (Leith and Granton are 9 miles away across the Forth), KY6, KY7 or KY8 (the owner's own Glenrothes and Leven practices).
  - **Age: minimum 18** (set it as the hard minimum-age control, not just a suggestion). **No detailed interests.** **Placements:** Advantage+ (the only option now).
  - No ad scheduling.
- **Two ads** (Drive "1. Meta Ads"; the newest files are from 8 Nov, 21:20):
  - **Ad A:** Feeds = `Ad A – Feed 4x5 (woman).png`. Stories/Reels = `Ad A – VIDEO Stories-Reels 9x16 (woman).mp4`, backup `Ad A – Stories 9x16 (woman).png` (placement asset customisation).
  - **Ad B:** the same with the `Ad B … (family)` files.
  - Text: copy **exactly** from HANDOFF.md Step 5 (primary text A and B, Stories/Reels text, three headlines, description). **CTA: Sign up.**
  - **Advantage+ creative: switch EVERY enhancement OFF.** Check both the creative step and "Advanced preview / Review defaults". Untick generated text variations, image text rewriting/"text improvements", "add overlays", music, image expansion, visual touch-ups and every AI-generated variant.
  - Optional sound for the videos: pick one calm instrumental from Meta's Sound Collection.
- Preview both ads in every placement with the **safe-zone overlay**. All text must be clear of the top and bottom bars.
- Before publishing, show the owner the ad previews **and the form preview** and get a clear "yes".
- **Automated rule** (Ads Manager → Rules → Create rule): campaign, condition **Leads (today) is greater than 30** → action **Turn off campaign** + notify. Check every 30 minutes. It's a safety valve if the ad goes viral. The daily-jobs person switches the campaign back on at 8am **only if the overnight leads have been called**.
- **48 hours after launch:** check Breakdown → Delivery → Placement (no junk placements) and that no AI-made variants have appeared. After any edit or duplicate, re-check that Advantage+ creative is still all OFF.

## 8. The 4-week plan: tell the owner and leave it in writing
*Updated 8 Nov from the forecast agent team. Three independent methods agreed on: **about £1.50 per lead** (range about £0.65–£4), **about 15 Facebook/Instagram sign-ups a day at £20/day** (about 100 a week), and about **1,650 sign-ups (~3,150 people) by opening** from all channels. **The caller runs out before the budget does.***

| Week | Daily budget | Goal | Rules |
|---|---|---|---|
| 1 | **£20** | check everything works, first data | change nothing for 3–4 days; check approvals, leads, texts and the caller daily |
| 2 | £20 → **£25** | pick the winner | pause the ad whose cost per lead is 30%+ worse after ~7 days; add 1–2 new versions of the winner (ask the ads chat). **Second caller from about week 2** (see below) |
| 3 | £25 → **£35** | scale carefully | only with two callers or a self-booking link; raise ~20–25% every 3–4 days, making ad changes on the same day; if frequency > ~3, add fresh ads |
| 4 | £35 → **£50** | run at caller capacity | settle where every lead is called within the hour |

**One caller can properly work about 20–25 new leads a day,** not 30–40. No-answers and call-backs mean about 1.6 calls per lead.
- Bring in the second caller (`ONCALL_MOBILE` = both numbers, `ALERT_MODE` = `rotate`, `BACKLOG_ALERT` = `15`) as soon as any of these happens:
  - sign-ups from all sources stay above 20 a day for 3 days;
  - the backlog email arrives on 2 evenings in a week;
  - the 9pm report shows leads waiting over 24 hours;
  - a press story or viral post lands. In that case, add the second caller the same day.
- **Don't go above £25/day until there is a second caller.**

**Real cost:** Ads Manager shows the budget before tax. Meta adds a **2% UK location fee** (since 1 Jul 2026, not shown in Ads Manager) and **20% VAT**. Dental care is VAT-exempt, so the clinic normally **can't reclaim** that VAT. £20/day is really about **£24.50/day**. The 4-week plan is about £810 in Ads Manager, or about **£990 all-in**, plus texts (about 9p per lead).

Daily rules:
- Leads arrive faster than the caller can ring within the hour (the owner also gets the overload email) → **cut the budget 20%**.
- Cost per lead **above £3.50 for 3 days** → fix the ad or form, don't add money, and tell the ads chat. **Above £5 → pause** and ask the ads chat.
- Cost per lead under £2.50 for 3 days, the backlog email not firing, and caller time spare → raise 20%, no more than once every 3–4 days.
- An ad gets rejected → tell the ads chat.
- Black Friday (27 Nov) and Christmas push ad prices up 15–30%. That's expected; don't panic.

If opening is more than ~6 weeks away, stay at £15–20/day for longer.

**Cautious alternative (family suggestion):**
- Start at **£10/day** with both ads in the one ad set. That brings about 7 leads a day; learning is slower and the first read on the better ad is noisier.
- Raise to £15 after 4–5 days and £20 in week 2, then follow the table one week behind.
- About £590 in Ads Manager (about £720 all-in), giving about 390 leads instead of about 540.

## 9. Daily jobs for one staff member (~15 min a day)
- 8am: check the ads are running, the card is OK and nothing is rejected. If the 30-leads rule switched the campaign off, switch it back on **only once the overnight leads have been called**.
- Reply to Facebook/Instagram comments and messages within a few hours:
  - Use "waiting list" wording only. Never say "accepting" or "taking on" patients, never promise registration or a date, and never say "first come, first served".
  - Ready reply: "Thanks for your interest! We're a new NHS dental practice opening soon at 23–25 Tolbooth Street. Please join our waiting list using the Sign up button or at kirkcaldydental.co.uk/register and we'll be in touch before we open."
  - **Hide** any comment where someone posts their phone number, address or health details, and reply asking them to use the form.
  - Anyone asking to stop → Status "DO NOT CONTACT" the same day.
- **After every call, overwrite Status**, including rows that say "Call 8am", with Called / No answer / Booked / DO NOT CONTACT (or the new values: Unreachable, Wrong number, Not interested, Withdrew). A row left blank or on "Call 8am" counts as not yet called in the 8am summary, the overload email and the 9pm report. Rows marked "Duplicate" are repeat sign-ups and don't need a call; check the earlier row named in Notes.
- **What callers must say on every call:** their name, "Kirkcaldy Dental & Implant Clinic" and why they're calling (the person joined the waiting list). Then:
  - joining isn't registration;
  - in Scotland, registering with a new practice ends their registration at their old one, but nothing changes until we invite them;
  - we never ask for payment to join or for the first exam;
  - no selling of private treatment on these calls. Only answer questions if the person asks.
  - Ask "Where is your current dentist?" and note it.

## 10. Back to the ads chat (Claude Code) after launch
- Each week the owner asks the ads chat "how are the ads doing?".
  - It reads the Dashboard and, once the ad account is connected, Meta results.
  - It recommends budget, the winning ad and new creatives, and logs what worked.
- Any wording change: update BRAND.md first and tell all chats.

## 11. When the clinic's 01592 phone number exists: add it everywhere (owner wants it on the ads)
Some people would rather phone than fill in a form, so show the number. Keep the form as the main route, because it captures details and gets cheaper leads.
1. **BRAND.md:** add the number under contact details first. Tell all three chats (ads, leaflet, website).
2. **Ad images and videos:**
   - The ads chat sets `PHONE` in `ads/source/ad.html` and re-renders.
   - The number appears as "kirkcaldydental.co.uk/register · Call 01592 …" on all 4 ads and videos.
   - Then replace the files in Drive "1. Meta Ads" and in Ads Manager.
3. **Primary text:** add a last line to both ads: "Prefer to talk? Call us on 01592 … (8am–9pm)."
4. **Instant Form completion screen:** set the button to **Call business** with the number (or add a second "View website" button).
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
