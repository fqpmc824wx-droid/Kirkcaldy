# Kirkcaldy Dental & Implant Clinic – launch handoff

Give this whole note to Claude in the browser. Do the steps in order. Ask the owner before anything that costs money, publishes ads, or sends messages to real people.

## Rules for every ad, page and message
- Allowed (owner-approved, same as banner & leaflet): "New NHS dental practice – opening soon", "Be first in line – join our waiting list", "Join waiting list".
- NOT allowed: "taking on / accepting / registering NHS patients", "limited places", "first come, first served". Never use the NHS logo (plain text "NHS" is fine).
- Colours: cream #F6F2EA, deep gold #8A6A2C, charcoal #30363B, text #262B30.
- Website: kirkcaldydental.co.uk (hosted on Hostinger). Email: info@kirkcaldydental.co.uk

## Assets
- Website zip (upload to Hostinger): `kirkcaldy-dental-website.zip` in the GitHub repo langtounsmiles/Dental, branch `claude/determined-heisenberg-d02bac`
- Logo pack: `kirkcaldy-dental-logo-pack.zip` (same repo; SVG + PNG)
- Waitlist Google Sheet: https://docs.google.com/spreadsheets/d/1YBtbcdnAKaPAr3MyNEJFKimbGt2bJ_AB9d-1jppuTDM/edit
  Columns: Signup Time | Name | Phone | Email | Postcode | No. of People | Currently Registered? | Adult/Child/Family | Contacted? | Notes
  (Rename the sheet to "Interest List – Kirkcaldy" if you like; keep the columns.)
- Ads (in the GitHub repo fqpmc824wx-droid/Kirkcaldy, folder `ads/`, 2160 px wide):
  - Ad A (woman in dental chair): `ad-A-feed-4x5.png`, `ad-A-stories-9x16.png`, video `ad-A-video-9x16.mp4` / `ad-A-video-4x5.mp4`
  - Ad B (mum & daughter): `ad-B-feed-4x5.png`, `ad-B-stories-9x16.png`, video `ad-B-video-9x16.mp4` / `ad-B-video-4x5.mp4`
  - Source: `ads/source/ad.html` (`node render.js` for images, `node render-video.js` for videos)

## Step 1 – Website on Hostinger
1. hostinger.co.uk → Websites → kirkcaldydental.co.uk → File Manager → `public_html`.
2. Delete any default `index.php` / `default.php`.
3. Upload the website zip → right-click → Extract. `index.html`, `privacy.html` and `assets/` must sit directly in `public_html`.
4. Security → SSL → enable.
5. Check https://kirkcaldydental.co.uk and https://kirkcaldydental.co.uk/privacy.html load.
6. Emails → create mailbox info@kirkcaldydental.co.uk.

## Step 2 – Meta lead form (Meta Business Suite → All tools → Instant Forms)
- Form type: Higher intent
- Intro headline: "Register your interest"
- Intro text: "Kirkcaldy Dental & Implant Clinic is a new NHS dental practice opening soon in Kirkcaldy. Register your interest and we'll keep you updated with opening news."
- Questions: Full name, Phone, Email (prefill) + Post code + multiple choice:
  - "How many people are you registering interest for?" 1 / 2 / 3 / 4+
  - "Are you currently registered with a dentist?" Yes / No / Not sure
  - "Who is this for?" Adult / Child / Family
- Privacy policy URL: https://kirkcaldydental.co.uk/privacy.html
- Completion screen: "Thanks! We'll keep you updated with opening news." Button: View website → https://kirkcaldydental.co.uk
- Business Settings → Integrations → Leads access → allow Zapier for the page.

## Step 3 – ClickSend
Sign up, top up ~£20, Sender ID `KirkDental`, copy username + API key.

## Step 4 – Zapier (Starter plan)
Trigger: Facebook Lead Ads → New Lead (clinic page + form above)
1. Google Sheets → Create Spreadsheet Row → sheet above. Signup Time = lead Created Time; map the other columns; leave Contacted?/Notes blank.
2. ClickSend → Send SMS → To: phone, From: KirkDental, Message:
   "Hi {First Name}, thanks for registering your interest in Kirkcaldy Dental & Implant Clinic, the new NHS dental practice opening in Kirkcaldy. We'll keep you updated with opening news. kirkcaldydental.co.uk"
3. Gmail (or Hostinger mail) → Send Email → To: email
   Subject: "Thanks for registering your interest – Kirkcaldy Dental & Implant Clinic"
   Body:
   "Hi {First Name},
   Thank you for registering your interest in Kirkcaldy Dental & Implant Clinic, a new NHS dental practice opening soon in Kirkcaldy.
   We'll be in touch with opening dates and practice information as soon as they're confirmed.
   Any questions? Email info@kirkcaldydental.co.uk.
   Kirkcaldy Dental & Implant Clinic
   kirkcaldydental.co.uk"
4. Test with Meta's Lead Ads Testing Tool: row appears in the sheet, SMS arrives, email arrives. Then publish the Zap.

## Step 5 – Campaign (Ads Manager) – confirm with owner before publishing
- Objective: Leads → Instant forms. One campaign, ONE ad set.
- Budget: £15–25/day. Location: Kirkcaldy + ~10 miles, "People living in this location". Age 18–65+. No detailed interests. Placements: Advantage+.
- Two ads in the same ad set, both using the form above:
  - Ad A: feed = `ad-A-feed-4x5.png`, Stories/Reels = `ad-A-video-9x16.mp4` (fallback `ad-A-stories-9x16.png`)
  - Ad B: feed = `ad-B-feed-4x5.png`, Stories/Reels = `ad-B-video-9x16.mp4` (fallback `ad-B-stories-9x16.png`)
- Primary text (Ad A): "🦷 A new NHS dental practice is opening soon in Kirkcaldy! Be first in line – tap Sign up to join our waiting list."
- Primary text (Ad B): "👨‍👩‍👧 Looking for an NHS dentist for the whole family? A new NHS practice is opening soon in Kirkcaldy. Join our waiting list in 30 seconds."
- Headline: "New NHS dental practice – opening soon". CTA button: Sign up.
- After 5–7 days compare cost per lead; pause the weaker ad.
