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
- Business Settings → Integrations → Leads access → allow Zapier for the page.

## Step 3 – ClickSend + call-connect service
ClickSend: sign up, top up ~£20, Sender ID `KirkDental`, copy username + API key.
Call-connect (e.g. Callingly): sign up, add the on-duty team mobiles, set opening hours, connect it to Zapier.

## Step 4 – Zapier (Professional plan, for Paths) – instant team alert + call within 30 seconds
Goal: the team phones every new lead within 30 seconds during opening hours.
Zapier's Facebook Lead Ads trigger is instant (Meta pushes the lead), usually seconds, occasionally up to ~1 minute.

Trigger: Facebook Lead Ads → New Lead (clinic page + form above)

**A. Alert the team first (fastest steps go first):**
1. **Speed-to-lead auto-call** (recommended): a call-connect service such as Callingly (has a Zapier action).
   - Its action (e.g. "Create Lead") rings the on-duty team phone(s) straight away.
   - When a team member answers, it reads out "New lead: {Full Name}, press 1 to connect" and dials the lead.
   - Set the outgoing caller ID to the clinic's 01592 number once it exists.
   - If nobody answers, it rings the next person in the rota.
2. **ClickSend → Send SMS to the team** (every on-duty mobile, backup alert):
   "🦷 NEW LEAD – call now: {Full Name} {Phone} · {Who is this for} · {No. of people}. Tap the number to call."
3. **Gmail → email** to info@kirkcaldydental.co.uk with the same details, as a record.
4. Backup push alerts: install the **Meta Business Suite** app on the team phones and turn on Leads notifications.

**B. Record and confirm:**
5. **Google Sheets → Create Spreadsheet Row** → Waiting List sheet. Signup Time = lead Created Time; map the other columns; Source = `facebook` (type it exactly, lowercase – the Dashboard tab counts on it); leave Status/Notes blank. Team fills **Status** (Called / No answer / Booked) after each call.
6. **ClickSend → Send SMS to the lead**, From: KirkDental:
   "Hi {First Name}, thanks for joining the waiting list for Kirkcaldy Dental & Implant Clinic, the new NHS dental practice opening soon at 23–25 Tolbooth Street. We'll call you shortly. kirkcaldydental.co.uk"
7. **Gmail → Send Email to the lead**
   Subject: "You're on our waiting list – Kirkcaldy Dental & Implant Clinic"
   Body:
   "Hi {First Name},
   Thank you for joining the waiting list for Kirkcaldy Dental & Implant Clinic, a new NHS dental practice opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.
   A member of our team will be in touch shortly, and we'll keep you updated with opening dates.
   Any questions? Email info@kirkcaldydental.co.uk.
   Kirkcaldy Dental & Implant Clinic
   kirkcaldydental.co.uk"

**C. Out of hours** (Zapier Paths or Filter on the lead's Created Time):
- **In hours:** steps 1–7 as above.
- **Out of hours:** skip the auto-call (step 1). Text the lead instead: "…we're closed right now – we'll call you first thing tomorrow from 9am." Then put them on a "Call first thing" list. The team SMS still goes out so nobody is missed.

**D. Test** with Meta's Lead Ads Testing Tool and check all of these before publishing the Zap:
- the team phone rings within ~30 seconds
- the team SMS arrives
- the row appears in the sheet
- the lead's SMS and email arrive

**Rota:** agree who is "on leads" each hour. Put their mobiles in the auto-call service and in the team SMS step.

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
