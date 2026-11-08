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
6. Add the **payment card**.
7. **Lead Ads terms:** logged in as Page admin, open facebook.com/ads/leadgen/tos, pick the clinic Page and accept. Meta may also prompt for this when you create the form.
8. **Remove single points of failure:** add a second trusted person (e.g. a family member) as admin on the Page, Business portfolio and ad account.

## 4. Instant Form (lead form)
Use HANDOFF.md Step 2 wording exactly.
- **Form type: Higher intent.**
- Intro headline: "Be first in line – join our waiting list". Intro text, privacy link (https://kirkcaldydental.co.uk/privacy.html) and completion screen: as in HANDOFF.md Step 2.
- **Questions:**
  - Full name, Phone number, Email.
  - Meta's built-in **Post code** question (not ZIP code, not a custom short answer).
  - The three multiple-choice questions, **copied word for word**. The script finds the answers by the words "post", "how many"/"people", "currently"/"registered" and "who".
- **Custom disclaimer:** title "How we'll contact you", text as in HANDOFF.md.
- **Optional consent checkbox:** NOT pre-ticked and NOT required: "Yes, also send me news and offers from Kirkcaldy Dental by text and email. I can opt out at any time."
- Copy the **Form ID**.

## 5. Lead system: our own free scripts (no Zapier or Make)
1. **Meta developer app:**
   - Go to developers.facebook.com → My Apps → Create app → type **Business** → owned by the clinic's Business portfolio.
   - Add the Marketing API / Facebook Login for Business product.
2. **Never-expiring token, using a System User (best):**
   - Business settings → Accounts → Apps: check the app is listed (add it by App ID if not).
   - Users → **System users** → Add → name "Lead script", role Admin.
   - Assign assets:
     - Pages → clinic Page → Full control.
     - Apps → the app → Full control.
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
| `BACKLOG_ALERT` | `15` (owner is emailed if 15+ leads have waited over an hour; `10` is fine for one caller) |
Don't touch `ALERT_NEXT`, `META_SINCE`, `META_SEEN` or `BACKLOG_LAST`. They're set automatically.
6. **Run `installLeadTriggers()` once:**
   - Open the `meta-leads` file, choose `installLeadTriggers` in the function dropdown, then Run → Review permissions → choose info@.
   - If "Google hasn't verified this app" appears: Advanced → Go to … (unsafe) → Allow. This is normal for the clinic's own script.
   - It sets up: checking Meta every minute, the 8am summary, the backlog check every 15 minutes, and the 9pm report to the owner.
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
  - The lead gets the thank-you text: "Hi Sarah, thank you for joining the Kirkcaldy Dental waiting list! A friendly member of our team will call you very soon. We can't wait to welcome you!"
  - The caller gets "🦷 NEW LEAD (facebook) – call now: Sarah Smith +447700900123". The source in brackets is facebook, instagram, website, leaflet or banner.
  - The owner gets the same alert as an **email** to info@.
  - The lead gets a confirmation email.
- **9pm–8am:**
  - The text says "…will call you tomorrow from 8am…".
  - No alert goes out, and the row is marked Status "Call 8am".
  - At 8am the caller gets "Good morning – X overnight leads to call."
- **Status "DO NOT CONTACT"** on any row blocks all future texts, emails and alerts to that number.

## 6. Test everything, using the owner's own phone and email
**Before testing:**
- **Caller's phone:** `ONCALL_MOBILE` holds the caller's real mobile, so every test texts them "NEW LEAD – call now". Ask the owner to choose:
  - (a) warn the caller that test texts are coming and they shouldn't call back, or
  - (b) set `ONCALL_MOBILE` to the owner's mobile for the tests. Afterwards put the caller's number back, and do one website sign-up in calling hours the next day to confirm the caller gets the alert.
- **Testing after 9pm UK?** The scripts follow `CALL_HOURS`. After 9pm there's no caller alert, no owner email, no "Assigned to", Status is "Call 8am", and `backlogCheck()` does nothing.
  - For the tests, set `CALL_HOURS` to `24h` temporarily (only with option (b), or the caller's agreement).
  - Afterwards set it back to `8-21` and do one more website sign-up. Expect the "tomorrow from 8am" text, Status "Call 8am" and no alert.
- **Text not arriving?** Apps Script won't show an error, because ClickSend failures are silent. Open **ClickSend → Reports / SMS history** and read the status (e.g. invalid sender ID, insufficient credit, invalid number).

| Test | How | Expect |
|---|---|---|
| Facebook lead | developers.facebook.com/tools/lead-ads-testing → pick the Page and form → **Preview form** → submit with the owner's REAL name, mobile, email and postcode. ("Create lead" fills dummy data, so no text or email would arrive.) Only one test lead per form can exist: press **Delete lead** before each new test. | within ~1–2 min: row with Source facebook; Postcode, No. of People, Currently Registered? and Adult/Child/Family all filled; thank-you text and email; caller alert; owner alert email in info@ with a Gmail notification; "Assigned to" filled |
| Website sign-up (no tick) | fill in kirkcaldydental.co.uk/register, optional box unticked | row with Source website, Marketing consent **No**, same texts/alerts |
| Website sign-up (ticked) | same, with the optional box ticked | Marketing consent **Yes** |
| Leaflet QR | scan the leaflet PDF QR (Visits tab gets a "leaflet" row), then **fill in and submit** the form | row with Source leaflet |
| Banner QR | the same with the banner PDF QR | row with Source banner |
| Do not contact | set a test row's Status to `DO NOT CONTACT`, then submit again with the same phone via /register | row saved with Status DO NOT CONTACT; no text, alert or email |
| Dashboard | open the Dashboard tab | counts by source update |
| Overload email | set `BACKLOG_ALERT` to `1`; edit a test row's Signup Time to over an hour ago with Status blank; run `backlogCheck()` from the editor (in calling hours or with `CALL_HOURS` 24h) | owner gets "leads waiting over an hour"; then set `BACKLOG_ALERT` back to `15` and delete `BACKLOG_LAST` |

**Afterwards:**
- Delete every test row (Waiting list and Visits tabs) **before 8am**, or the 8am summary will text the caller about them. Put `CALL_HOURS` back to `8-21` and `ONCALL_MOBILE` back to the caller.
- **Owner email alerts:** the script sends from info@ to info@. If the Gmail app doesn't notify for these self-sent emails:
  - set `OWNER_EMAIL` to the owner's personal Gmail address, or
  - add a Gmail filter "Subject contains NEW LEAD → Never send to Spam, Mark as important" with notifications set to "All".
- **Errors:** check Apps Script → **Executions**. "Meta API 190" means the token is wrong or expired.

## 7. Launch the ads (only with the owner's OK)
Ads Manager → Create:
- **Objective: Leads**, conversion location **Instant forms**, the form from step 4.
  - If Meta asks you to declare a special ad category, follow its prompt. A dental practice is usually *none*.
- **One campaign, one ad set. Budget £20/day.**
- **Location:** Kirkcaldy + **10 miles**, "**People living in this location**".
- **Age:** 18–65+. **No detailed interests.** **Placements:** Advantage+.
- **Two ads** (Drive "1. Meta Ads", or `ads/` on main; use whichever is newer):
  - **Ad A:** feed = `Ad A – Feed 4x5 (woman).png`, Stories/Reels = `Ad A – VIDEO Stories-Reels 9x16 (woman).mp4`. Backup: `Ad A – Stories 9x16 (woman).png`.
  - **Ad B:** feed = `Ad B – Feed 4x5 (family).png`, Stories/Reels = `Ad B – VIDEO Stories-Reels 9x16 (family).mp4`. Backup: `Ad B – Stories 9x16 (family).png`.
- **Primary text Ad A:** "🦷 A new NHS dental practice is opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW! Be first in line – tap Sign up to join our waiting list."
- **Primary text Ad B:** "👨‍👩‍👧 Looking for an NHS dentist for the whole family? A new NHS dental practice is opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. Adults, children and families can all join our waiting list."
- **Headline:** "New NHS dental practice – opening soon". **CTA:** Sign up.
- Before publishing, show the owner the ad previews and get a clear "yes".

## 8. The 4-week plan: tell the owner and leave it in writing
| Week | Daily budget | Goal | Rules |
|---|---|---|---|
| 1 | **£20** | check everything works, first data | change nothing for 3–4 days; check approvals, leads, texts and caller daily |
| 2 | £20 → **£25** | pick the winner | pause the ad whose cost per lead is 30%+ worse after ~7 days; add 1–2 new versions of the winner (ask the ads chat) |
| 3 | £25 → **£35** | scale carefully | raise budget ~20–25% every 3–4 days; if frequency > ~3, widen to 15 miles or add fresh ads |
| 4 | £35 → **£50** | run at caller capacity | settle where the caller can ring every lead within the hour (~30–40 leads/day for one person); add a second caller to ONCALL_MOBILE with ALERT_MODE `rotate` if more |

Total ≈ **£800–850** for 4 weeks, plus texts. Meta adds 20% VAT if the clinic has no UK VAT number (≈ £960–1,020).

Daily rules:
- Leads arrive faster than the caller can ring within the hour (the owner also gets the overload email) → **cut the budget 20%**.
- Cost per lead above ~£6 for 3 days → tell the ads chat.
- An ad gets rejected → tell the ads chat.
- Cheap leads and spare caller time → raise 20% every 3–4 days.

If opening is more than ~6 weeks away, stay at £15–20/day for longer.

**Cautious alternative (family suggestion):**
- Start at **£10/day** with both ads in the one ad set. Meta automatically gives more budget to the better ad; learning is just slower.
- Raise to £15 after 4–5 days and £20 in week 2, then follow the table.
- Total ≈ £550–650 (≈ £660–780 with VAT).

## 9. Daily jobs for one staff member (~15 min a day)
- Check the ads are running, the card is OK and nothing is rejected.
- Reply to Facebook/Instagram comments and messages within a few hours. Use "waiting list" wording only, and never promise registration.
- **After every call, overwrite Status**, including rows that say "Call 8am", with Called / No answer / Booked / DO NOT CONTACT. A row left blank or on "Call 8am" counts as not yet called in the 8am summary, the overload email and the 9pm report.

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
