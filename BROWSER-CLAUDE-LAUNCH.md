# Setup night: launch runbook for browser Claude

**Browser Claude: read this whole file first, then BRAND.md, HANDOFF.md, leads/README.md and leaflet/README.md.** Work through the steps in order with the owner watching.

**Ask the owner before anything that costs money, publishes ads, or sends a message to a real person** (test messages to the owner's own phone are fine). Follow BRAND.md wording exactly. Never say "accepting / taking on / registering NHS patients", "limited places" or "first come, first served", and never use the NHS logo.

Repo: `fqpmc824wx-droid/Kirkcaldy`. Some files are still on branches until their pull requests are merged into `main`:
- **Website + register page + QR short links:** branch `claude/hostinger-plugin-install-eyvjb3` (PR #2). Also `site/register/` and `site/b`, `site/l` from branch `claude/brave-allen-i14xnx` (PR #1) if PR #2 doesn't have them yet.
- **Website sign-up script:** `leaflet/apps-script.gs` on branch `claude/brave-allen-i14xnx` (PR #1).
- **Facebook lead script:** `leads/meta-leads.gs` on `main`.
- **Ads (images + videos):** `ads/` on `main`, also in Google Drive → "Kirkcaldy Dental – Print files & marketing" → **1. Meta Ads**.

Ask the owner to merge PR #1 and PR #2 into `main` first, if they're happy to. Otherwise take the files from the branches above.

---

## 0. Have ready before starting
| Item | Who |
|---|---|
| Hostinger login with access to the hosting for kirkcaldydental.co.uk (from Abdullah) | owner |
| Google login **info@kirkcaldydental.co.uk** (owns the Waiting List sheet) | owner |
| Owner's personal Facebook login (will be admin of the clinic Page) | owner |
| Payment card (Meta ads + text credit) | owner |
| Mobile numbers: **2 callers** + **owner** | owner |
| Daily ad budget: **£20/day to start** (2 ads; the family's alternative is £10/day, see section 8) | agreed |
| Clinic phone number 01592 … (optional; can be added later) | owner |

Waiting List sheet: https://docs.google.com/spreadsheets/d/1WxadIcaibszu3YYR3eqNMjaQQ0V3LJ_Mvdsx_I2KBQI/edit
- Tabs: **Dashboard** (first, don't write to it), **Waiting list**, **Visits**.
- Waiting list columns include: Signup Time, Name, Phone, Email, Postcode, No. of People, Currently Registered?, Adult/Child/Family, Source, Status, Assigned to, Marketing consent, Notes.

---

## 1. Website live on Hostinger (must be first: the Meta form needs the privacy page)
1. Follow HANDOFF.md Step 1 and leaflet/README.md step 1.
   - Upload the website (index, privacy, register, QR short links /b and /l, assets) to `public_html`.
   - Point the domain's DNS at Hostinger if needed.
   - Turn on SSL.
2. Check these all load over https:
   - `/`
   - `/privacy.html`
   - `/register/`
   - `/b` and `/l`, which should forward to `/register/?src=banner` and `?src=leaflet`
3. Check privacy.html:
   - Lists Meta, Google, ClickSend (or Twilio) and Hostinger.
   - Doesn't mention Zapier.
   - Says we text and call about the request 8am–9pm, with marketing only if opted in.
   - Explains how to stop contact (email info@).
   - If any of this is wrong, tell the owner. The website chat owns this file.

## 2. Text-message provider: pick the cheapest and top up
1. **Compare UK prices before paying:**
   - ClickSend pricing calculator, with **United Kingdom** selected.
   - Twilio UK SMS pricing. Third-party pages showed about $0.056 per UK text in Oct–Nov 2026.
   - Expect about **3–6p per text + VAT**.
   - Tell the owner both prices. The scripts are built for **ClickSend**. Switching to Twilio means changing `sendSms()` in both scripts, so ask the ads chat (in Claude Code) if Twilio is much cheaper.
2. Open the account and **top up £50–100**. Turn on **auto top-up**, so texts never stop mid-launch.
3. Register sender ID **KirkDental**.
4. Copy the ClickSend **username** and **API key** (Dashboard → API Credentials).

Budget to tell the owner:
- Each lead uses **2 texts**: thank-you to the lead and alert to one caller. The owner gets a free email copy instead. That's about **8–10p per lead**.
- About **£200–250/month** at launch volume (~2,600 leads) and **£50–60** when it settles (inc. VAT, at ~4p a text).

## 3. Facebook Page, Business account, ad account
1. Create the **Facebook Page** "Kirkcaldy Dental & Implant Clinic".
   - Profile picture: the gold logo from Drive "4. Logo & Brand".
   - Address: 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.
   - Website: kirkcaldydental.co.uk.
   - Email: info@kirkcaldydental.co.uk.
   - Add the 01592 number if they have one.
2. Link Instagram if the clinic has an account (optional).
3. Create a **Meta Business account** (Business Settings) for the clinic, owned by the owner.
4. Create an **ad account**: currency **GBP**, time zone **Europe/London**.
5. Add the **payment card**.
6. Accept the **Lead Ads terms** for the Page.

## 4. Instant Form (lead form)
Use HANDOFF.md Step 2 wording exactly.
- **Form type: Higher intent.**
- Intro headline: "Be first in line – join our waiting list".
- Intro text, questions, privacy link and completion screen: as in HANDOFF.md Step 2.
- **Custom disclaimer:** title "How we'll contact you", text as in HANDOFF.md.
- **Optional consent checkbox:** NOT pre-ticked and NOT required: "Yes, also send me news and offers from Kirkcaldy Dental by text and email. I can opt out at any time."
- Copy the **Form ID**.

## 5. Facebook lead system: our own free script, no Zapier or Make
Follow **leads/README.md** "One-time setup":
1. Create a Meta developer app (type **Business**) owned by the clinic's Business account.
2. Generate a **non-expiring Page access token** with `leads_retrieval`. A System User token is best.
3. Business Settings → Integrations → **Leads access**: allow the app.
4. Open the Waiting List sheet → **Extensions → Apps Script**. One project holds both files:
   - `apps-script.gs` (from `leaflet/`): website and QR sign-ups.
   - `meta-leads.gs` (from `leads/`): Facebook and Instagram leads.
5. **Project Settings → Script Properties:**
| Property | Value |
|---|---|
| `CLICKSEND_USER` | ClickSend username |
| `CLICKSEND_KEY` | ClickSend API key |
| `META_PAGE_TOKEN` | the Page token |
| `META_FORM_IDS` | the Form ID (comma-separate if more than one) |
| `ONCALL_MOBILE` | the **2 callers' mobiles**, comma-separated |
| `ALERT_MODE` | `rotate` (each lead goes to the next caller in turn) |
| `OWNER_EMAIL` | `info@kirkcaldydental.co.uk` (owner gets a free **email** copy of every alert; Gmail app on the owner's phone with notifications ON for this account) |
| `OWNER_MOBILE` | leave **empty** (owner chose email alerts instead of text copies) |
| `CALL_HOURS` | `8-21` (owner decision: **no calls after 9pm**) |
Don't touch `ALERT_NEXT`, `META_SINCE` or `META_SEEN`. They are set automatically.
6. Run **`installLeadTriggers()`** once and allow permissions. It checks Meta every minute and sends the 8am summary.
7. **Deploy the website script** as a Web app:
   - Execute as Me, access Anyone.
   - Paste the `/exec` URL into `site/register/index.html` (`PASTE_APPS_SCRIPT_URL_HERE`) and re-upload it.
   - After any script change, deploy a **new version**.

What happens with every lead, wherever it comes from:
- **8am–9pm:**
  - The row is added to the sheet.
  - The lead gets the thank-you text: "Hi Sarah, thank you for joining the Kirkcaldy Dental waiting list! A friendly member of our team will call you very soon. We can't wait to welcome you!"
  - The next caller in turn gets the text alert "🦷 NEW LEAD – call now…". The owner gets the same alert as an **email** to info@kirkcaldydental.co.uk.
  - The lead gets a confirmation email.
- **9pm–8am:**
  - The text says "…will call you tomorrow from 8am…".
  - No alert is sent, and the row is marked Status "Call 8am".
  - At 8am the team gets "Good morning – X overnight leads to call."
- **Status "DO NOT CONTACT"** on any row blocks all future texts, emails and alerts to that number.

## 6. Test everything, using the owner's own phone and email
| Test | How | Expect |
|---|---|---|
| Facebook lead | Meta **Lead Ads Testing Tool** (developers.facebook.com/tools/lead-ads-testing) | within ~1–2 min: row in Waiting list with Source facebook; thank-you text and email; text alert to one caller; **owner alert email arrives in info@ and the Gmail app shows a notification** (if not, see note below); "Assigned to" filled |
| Website sign-up | fill in kirkcaldydental.co.uk/register | row with Source website + same texts/alerts |
| Leaflet QR | scan the QR on the leaflet PDF | row with Source leaflet; Visits tab counts the scan |
| Banner QR | scan the QR on the banner PDF | row with Source banner |
| Rotation | submit 2 more test leads | alerts alternate between the 2 callers |
| Do not contact | set a test row's Status to DO NOT CONTACT, submit again with the same phone | row saved, but no text, alert or email |
| Dashboard | open the Dashboard tab | counts by source update |
Delete all test rows afterwards.
**Owner email alerts:** the script sends from info@ to info@. If the Gmail app doesn't notify for these self-sent emails, set `OWNER_EMAIL` to the owner's personal Gmail address instead, or add a Gmail filter "From: info@… Subject contains NEW LEAD → Mark as important" with notifications set to "All". If anything fails, check Apps Script → **Executions** for errors. "Meta API 190" means the token is wrong or expired.

## 7. Launch the ads (only with the owner's OK)
Ads Manager → Create:
- **Objective: Leads**, conversion location **Instant forms**, the form from step 4.
  - If Meta asks you to declare a special ad category, choose the one that applies. A dental practice is usually *none*, but follow Meta's current prompt.
- **One campaign, one ad set. Budget £20/day.**
- **Location:** Kirkcaldy + **10 miles**, "**People living in this location**".
- **Age:** 18–65+. **No detailed interests.** **Placements:** Advantage+.
- **Two ads:**
  - **Ad A:** feed = `Ad A – Feed 4x5 (woman).png`, Stories/Reels = `Ad A – VIDEO Stories-Reels 9x16 (woman).mp4` (backup: `Ad A – Stories 9x16 (woman).png`).
  - **Ad B:** feed = `Ad B – Feed 4x5 (family).png`, Stories/Reels = `Ad B – VIDEO Stories-Reels 9x16 (family).mp4` (backup: `Ad B – Stories 9x16 (family).png`).
- **Primary text, headline and CTA:** as in HANDOFF.md Step 5. CTA **Sign up**.
- Before publishing, show the owner the ad previews and get a clear "yes".

## 8. The 4-week plan: tell the owner and leave it in writing
| Week | Daily budget | Goal | Rules |
|---|---|---|---|
| 1 | **£20** | check everything works, first data | change nothing for 3–4 days; check approvals, leads, texts, callers daily |
| 2 | £20 → **£25** | pick the winner | pause the ad whose cost per lead is 30%+ worse after ~7 days; add 1–2 new versions of the winner (ask the ads chat) |
| 3 | £25 → **£35** | scale carefully | raise budget ~20–25% every 3–4 days; if frequency > ~3, widen to 15 miles or add fresh ads |
| 4 | £35 → **£50** | run at caller capacity | settle at the level the 2 callers can call within the hour (~60–80 leads/day max) |
Total ≈ **£800–850** for 4 weeks, plus texts.

Daily rules:
- Leads arrive faster than the callers can ring within the hour → **cut the budget 20%**.
- Cost per lead above ~£6 for 3 days → tell the ads chat.
- An ad gets rejected → tell the ads chat.
- Cheap leads and spare caller time → raise 20% every 3–4 days.

If opening is more than ~6 weeks away, stay at £15–20/day longer.

**Cautious alternative (family suggestion):**
- Start at **£10/day** with both ads in the one ad set. Meta automatically gives more of the budget to the better ad. Learning is just slower.
- Raise to £15 after 4–5 days and £20 in week 2, then follow the table.
- Total ≈ £550–650 for 4 weeks.

## 9. Daily jobs for one staff member (~15 min a day)
- Check the ads are running, the card is OK and nothing is rejected.
- Reply to Facebook/Instagram comments and messages within a few hours. Use "waiting list" wording only, and never promise registration.
- Make sure Status (Called / No answer / Booked / DO NOT CONTACT) is filled in for every lead.

## 10. Back to the ads chat (Claude Code) after launch
- Each week, the owner asks the ads chat "how are the ads doing?".
  - The ads chat reads the Dashboard and, once the ad account is connected, Meta results.
  - It recommends budget, winner and new creatives, and logs what worked.
- Any wording change: update BRAND.md first and tell all chats.

---
*Being added when the research teams finish:*
- Meta ads 2026 research playbook
- waiting-list playbook (journey, keep-warm messages, invite waves, NHS Scotland rules)
- creative review improvements and new ad versions
- strategy and forecast

*This file will be updated. Use the latest version on `main`.*
