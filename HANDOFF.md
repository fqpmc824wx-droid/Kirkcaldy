# Kirkcaldy Dental & Implant Clinic – launch handoff

Give this whole note to Claude in the browser. Do the steps in order. Ask the owner before anything that costs money, publishes ads, or sends messages to real people.

## Rules for every ad, page and message
- Allowed (owner-approved, same as banner & leaflet): "New NHS dental practice – opening soon", "Be first in line – join our waiting list", "Join waiting list".
- NOT allowed: "taking on / accepting / registering NHS patients", "limited places", "first come, first served". Never use the NHS logo (plain text "NHS" is fine).
- Colours: cream #F6F2EA, deep gold #8A6A2C, charcoal #30363B, text #262B30.
- Website: kirkcaldydental.co.uk (hosted on Hostinger). Email: info@kirkcaldydental.co.uk

## Assets
- Everything lives in the GitHub repo **fqpmc824wx-droid/Kirkcaldy** and in the Google Drive folder "Kirkcaldy Dental – Print files & marketing" (subfolders 1–6).
- Website zip (upload to Hostinger): `kirkcaldy-dental-website.zip` (Drive: 5. Website)
- Logo pack: `kirkcaldy-dental-logo-pack.zip`, plus `brand/logo/` (Drive: 4. Logo & Brand)
- Banner 180 × 60 cm: `banner/` (Drive: 2. Banner 180x60cm). Send the printer the PRINT PDF (10 mm bleed).
- Leaflet A5: `leaflet/` (Drive: 3. Leaflet A5). Send the printer the PRINT PDF (3 mm bleed).
- Waiting List Google Sheet (owned by info@kirkcaldydental.co.uk, Drive: 6. Sheets & Trackers): https://docs.google.com/spreadsheets/d/1WxadIcaibszu3YYR3eqNMjaQQ0V3LJ_Mvdsx_I2KBQI/edit
  Columns: Signup Time | Name | Phone | Email | Postcode | No. of People | Currently Registered? | Adult/Child/Family | Source | Status | Notes
  The old Interest List sheet (https://docs.google.com/spreadsheets/d/1YBtbcdnAKaPAr3MyNEJFKimbGt2bJ_AB9d-1jppuTDM/edit, in a different Google account) keeps the earlier leads. Point new Facebook leads at the new sheet.
- Weekly trackers: see `tracker/README.md` (Drive: 6. Sheets & Trackers).
- Ads (in the GitHub repo fqpmc824wx-droid/Kirkcaldy, folder `ads/`, 2160 px wide):
  - Ad A (woman in dental chair): `ad-A-feed-4x5.png`, `ad-A-stories-9x16.png`, video `ad-A-video-9x16.mp4` / `ad-A-video-4x5.mp4`
  - Ad B (mum & daughter): `ad-B-feed-4x5.png`, `ad-B-stories-9x16.png`, video `ad-B-video-9x16.mp4` / `ad-B-video-4x5.mp4`
  - Source: `ads/source/ad.html` (`node render.js` for images, `node render-video.js` for videos)

## Step 1 – Website on Hostinger
0. Domain: kirkcaldydental.co.uk is held by Google (Squarespace Domains). In Hostinger add the website to get its IP, then in Google Admin → Domains → DNS add an A record for "@" to that IP and a CNAME "www" → kirkcaldydental.co.uk. Don't touch the MX records (email).
1. hostinger.co.uk → Websites → kirkcaldydental.co.uk → File Manager → `public_html`.
2. Delete any default `index.php` / `default.php`.
3. Upload the website zip → right-click → Extract. `index.html`, `privacy.html` and `assets/` must sit directly in `public_html`.
4. Security → SSL → enable.
5. Check https://kirkcaldydental.co.uk and https://kirkcaldydental.co.uk/privacy.html load.
6. Emails → create mailbox info@kirkcaldydental.co.uk.

## Step 2 – Meta lead form (Meta Business Suite → All tools → Instant Forms)
- Form type: Higher intent
- Intro headline: "Be first in line – join our waiting list"
- Intro text: "Kirkcaldy Dental & Implant Clinic is a new NHS dental practice opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. Join our waiting list and we'll keep you updated with opening news."
- Questions: Full name, Phone, Email (prefill) + Post code + multiple choice:
  - "How many people are you registering interest for?" 1 / 2 / 3 / 4+
  - "Are you currently registered with a dentist?" Yes / No / Not sure
  - "Who is this for?" Adult / Child / Family
- Privacy policy URL: https://kirkcaldydental.co.uk/privacy.html
- Completion screen: "Thanks – you're on our waiting list! We'll keep you updated with opening news." Button: View website → https://kirkcaldydental.co.uk
- Business Settings → Integrations → Leads access → allow Make (or Zapier) for the page.

## Step 3 – Free lead alerts on the team phones
1. Install the **Meta Business Suite** app on every team phone. Log in with a page admin/editor account.
2. Turn on notifications for **Leads**. Every new lead then pops up on the phone with name and number. It's free.
3. Install the **Gmail** app on the team phones with info@kirkcaldydental.co.uk and turn on notifications, so the "New lead" email from Step 4 also pops up.
4. ClickSend: pay-as-you-go ~£20 top-up. Sender ID `KirkDental`. Copy the username and API key into Make.

> **The instant confirmation text to every lead is a must-have (owner).**

## Step 4 – Automation sized for a FLOOD of leads
Demand evidence:
- **Glenrothes Dental House launch (opened Feb 2026), NHS registrations per month:** Feb 1,187 · **Mar 2,598** (peak ~600 a week, ~85 a day) · Apr 1,200 · May 762 · Jun–Oct ~480–660. That's ~8,800 in 9 months.
- These are registrations. Raw leads and enquiries will be higher.
- **2,445 active patients with Kirkcaldy KY1/KY2 postcodes** already travel to the owner's Leven, Glenrothes and Cupar practices.
- An aggregator showed 1 of 57 Kirkcaldy NHS dentists accepting new patients (Aug 2026). NHS Fife says "very few" practices can register new NHS patients. Kirkcaldy has ~50,000 residents.
- **Plan for:** 1,200–2,600+ leads in each of the first 2 months, a peak of ~85–100+ a day, settling to 500–700 a month. Ads drive the volume; leaflets add ~10–30 per 1,000 dropped.

**Tool: Make.com (Core plan or above), not Zapier.**
- At that volume Zapier Professional runs out: about 750 tasks, roughly 150 leads. Higher Zapier tiers get expensive.
- Make charges per operation and is far cheaper at volume. Its Facebook Lead Ads, Google Sheets, Gmail and ClickSend modules are all available.
- About 5 operations per lead, so 10,000 ops ≈ 2,000 leads.
- Check make.com/pricing and pick the ops tier for the expected volume. Zapier is fine only if leads stay under ~150/month.

Scenario: Facebook Lead Ads "Watch new leads" (instant) → Router by time (UK):

**Route A – 8am to 9pm:**
1. **ClickSend → SMS to the on-duty/on-call mobile(s)** (fastest alert):
   "🦷 NEW LEAD – call now: {Full Name} {Phone} · {Who is this for} · {No. of people}"
2. **Google Sheets → Create Spreadsheet Row** → Waiting List sheet. Signup Time = created time; map the other columns; Source = `facebook` (exactly, lowercase); Status blank.
3. **ClickSend → SMS to the lead**, From: KirkDental:
   "Hi {First Name}, thanks for joining the waiting list for Kirkcaldy Dental & Implant Clinic, the new NHS dental practice opening soon on Tolbooth Street, Kirkcaldy. We'll call you shortly."
4. **Gmail → email the lead**, text below.

**Route B – 9pm to 8am:**
1. Google Sheets row as above, with Status = `Call 8am`.
2. ClickSend SMS to the lead: "...thanks for joining our waiting list! We'll give you a call from 8am."
3. Gmail email to the lead, text below.
4. Optional: a scheduled 8am scenario that texts → ClickSend SMS to the on-call mobile with the lead's details, so it's the first call of the morning.

**Lead email** (Subject: "You're on our waiting list – Kirkcaldy Dental & Implant Clinic"):
"Hi {First Name},
Thank you for joining the waiting list for Kirkcaldy Dental & Implant Clinic, a new NHS dental practice opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.
A member of our team will be in touch, and we'll keep you updated with opening dates.
Any questions? Email info@kirkcaldydental.co.uk.
Kirkcaldy Dental & Implant Clinic
kirkcaldydental.co.uk"

**Free backups on the team phones:**
- Meta Business Suite app with Leads notifications on.
- Gmail app for info@kirkcaldydental.co.uk.

**Test** with Meta's Lead Ads Testing Tool once in hours and once out of hours. Check all of these:
- the on-call text arrives within ~1 minute
- the sheet row appears
- the lead's text and email arrive
Then turn the Zap on.

**Costs at volume (check current prices):**
- Make ops tier for ~2,500–3,000 leads/month at launch (~15,000 ops). Drop the tier later when it settles.
- ClickSend: about 2 texts per lead (lead + on-call) at a few pence each, so budget roughly **£150–300 per 1,000 leads**. Turn on auto top-up.
- To save money, send the on-call alert by Gmail push instead of SMS (free) and keep the SMS for the lead only.

**Calling capacity:**
- At peak, ~85–100 leads a day is 4–5+ hours of calls a day: **one full-time caller at launch**, plus the evening on-call rota.
- Dedicate a person or shift to calling leads during launch.
- If calls fall behind, lower the Meta daily budget rather than leaving leads uncalled.
- The confirmation text means everyone hears back instantly even when there's a queue.

**Team routine – every lead called the same day, 7 days a week (8am–9pm):**
- **Opening hours:** reception calls new leads within 15 minutes.
- **Evenings and weekends:** one person is **on call** each evening/weekend (rota). Their mobile gets the ClickSend text alert (plus Meta app and Gmail alerts). They call within 15–30 minutes, up to 9pm.
- **After 9pm:** don't phone people late at night. The lead gets the automatic "you're on our waiting list" email/text straight away, and the on-call person calls them from 8am the next morning, including weekends.
- Mark Status in the sheet after each call: Called / No answer / Booked. If there's no answer, try again within 2 hours and once more the next day.

**Upgrade later (only if needed):** an auto-call service such as Callingly (from about $100/month) rings the team phone and connects to the lead automatically.

## Step 5 – Campaign (Ads Manager) – confirm with owner before publishing
- Objective: Leads → Instant forms. One campaign, ONE ad set.
- Budget: £15–25/day. Location: Kirkcaldy + ~10 miles, "People living in this location". Age 18–65+. No detailed interests. Placements: Advantage+.
- Two ads in the same ad set, both using the form above:
  - Ad A: feed = `ad-A-feed-4x5.png`, Stories/Reels = `ad-A-video-9x16.mp4` (fallback `ad-A-stories-9x16.png`)
  - Ad B: feed = `ad-B-feed-4x5.png`, Stories/Reels = `ad-B-video-9x16.mp4` (fallback `ad-B-stories-9x16.png`)
- Primary text (Ad A): "🦷 A new NHS dental practice is opening soon at 23–25 Tolbooth Street, Kirkcaldy! Be first in line – tap Sign up to join our waiting list."
- Primary text (Ad B): "👨‍👩‍👧 Looking for an NHS dentist for the whole family? A new NHS practice is opening soon on Tolbooth Street, Kirkcaldy. Join our waiting list in 30 seconds."
- Headline: "New NHS dental practice – opening soon". CTA button: Sign up.
- After 5–7 days compare cost per lead; pause the weaker ad.

## Step 6 – Banner, leaflet and QR sign-up page
Full instructions are in `leaflet/README.md` and `banner/README.md`. Short version:
1. The website zip contains `register/`. Make sure https://kirkcaldydental.co.uk/register/ loads before printing anything: the QR codes on the banner and leaflet open that page.
2. In the Waiting List sheet, go to Extensions → Apps Script, paste in `leaflet/apps-script.gs` and deploy it as a Web app (Execute as: Me, Access: Anyone). Paste the /exec URL into `site/register/index.html` (replace `PASTE_APPS_SCRIPT_URL_HERE`) and re-upload that file.
3. Test by scanning the QR code on the leaflet: a row should appear with Source = leaflet, and the thank-you email should arrive.
4. Phone number: not set yet (Dentally has a placeholder). When it exists, add it with `cd leaflet/source && node render.js "01592 ..."` and add it to the banner.
5. Address: 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.
