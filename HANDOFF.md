# Kirkcaldy Dental & Implant Clinic – launch handoff

Give this whole note to Claude in the browser. Do the steps in order. Ask the owner before anything that costs money, publishes ads, or sends messages to real people.

## Rules for every ad, page and message
- Allowed: "New NHS dental practice opening in Kirkcaldy", "Register your interest", "Be the first to know when we open".
- NOT allowed: "taking on / registering NHS patients", "join the NHS waiting list", "limited places", "first come, first served". Never use the NHS logo (plain text "NHS" is fine).
- Colours: white and gold. Gold = #C3A363, text = #373737.
- Website: kirkcaldydentist.co.uk (hosted on Hostinger). Email: info@kirkcaldydentist.co.uk

## Assets
- Website zip (upload to Hostinger): `kirkcaldy-dental-website.zip` in the GitHub repo langtounsmiles/Dental, branch `claude/determined-heisenberg-d02bac`
- Logo pack: `kirkcaldy-dental-logo-pack.zip` (same repo; SVG + PNG)
- Waitlist Google Sheet: https://docs.google.com/spreadsheets/d/1YBtbcdnAKaPAr3MyNEJFKimbGt2bJ_AB9d-1jppuTDM/edit
  Columns: Signup Time | Name | Phone | Email | Postcode | No. of People | Currently Registered? | Adult/Child/Family | Contacted? | Notes
  (Rename the sheet to "Interest List – Kirkcaldy" if you like; keep the columns.)
- Canva ads (white & gold, compliant wording):
  - Ad A feed 4:5 – https://canva.link/br5twhovj89afgo
  - Ad A Stories 9:16 – https://canva.link/aebftyapo4kra99
  - Ad B feed 4:5 (family) – https://canva.link/cpo3ndlhdoik19v
  - Ad B Stories 9:16 (family) – https://canva.link/ttmm37796yfwy2j
  Export each as PNG (Share → Download → PNG).

## Step 1 – Website on Hostinger
1. hostinger.co.uk → Websites → kirkcaldydentist.co.uk → File Manager → `public_html`.
2. Delete any default `index.php` / `default.php`.
3. Upload the website zip → right-click → Extract. `index.html`, `privacy.html` and `assets/` must sit directly in `public_html`.
4. Security → SSL → enable.
5. Check https://kirkcaldydentist.co.uk and https://kirkcaldydentist.co.uk/privacy.html load.
6. Emails → create mailbox info@kirkcaldydentist.co.uk.

## Step 2 – Meta lead form (Meta Business Suite → All tools → Instant Forms)
- Form type: Higher intent
- Intro headline: "Register your interest"
- Intro text: "Kirkcaldy Dental & Implant Clinic is a new NHS dental practice opening soon in Kirkcaldy. Register your interest and we'll keep you updated with opening news."
- Questions: Full name, Phone, Email (prefill) + Post code + multiple choice:
  - "How many people are you registering interest for?" 1 / 2 / 3 / 4+
  - "Are you currently registered with a dentist?" Yes / No / Not sure
  - "Who is this for?" Adult / Child / Family
- Privacy policy URL: https://kirkcaldydentist.co.uk/privacy.html
- Completion screen: "Thanks! We'll keep you updated with opening news." Button: View website → https://kirkcaldydentist.co.uk
- Business Settings → Integrations → Leads access → allow Zapier for the page.

## Step 3 – ClickSend
Sign up, top up ~£20, Sender ID `KirkDental`, copy username + API key.

## Step 4 – Zapier (Starter plan)
Trigger: Facebook Lead Ads → New Lead (clinic page + form above)
1. Google Sheets → Create Spreadsheet Row → sheet above. Signup Time = lead Created Time; map the other columns; leave Contacted?/Notes blank.
2. ClickSend → Send SMS → To: phone, From: KirkDental, Message:
   "Hi {First Name}, thanks for registering your interest in Kirkcaldy Dental & Implant Clinic, the new NHS dental practice opening in Kirkcaldy. We'll keep you updated with opening news. kirkcaldydentist.co.uk"
3. Gmail (or Hostinger mail) → Send Email → To: email
   Subject: "Thanks for registering your interest – Kirkcaldy Dental & Implant Clinic"
   Body:
   "Hi {First Name},
   Thank you for registering your interest in Kirkcaldy Dental & Implant Clinic, a new NHS dental practice opening soon in Kirkcaldy.
   We'll be in touch with opening dates and practice information as soon as they're confirmed.
   Any questions? Email info@kirkcaldydentist.co.uk.
   Kirkcaldy Dental & Implant Clinic
   kirkcaldydentist.co.uk"
4. Test with Meta's Lead Ads Testing Tool: row appears in the sheet, SMS arrives, email arrives. Then publish the Zap.

## Step 5 – Campaign (Ads Manager) – confirm with owner before publishing
- Objective: Leads → Instant forms. One campaign, ONE ad set.
- Budget: £15–25/day. Location: Kirkcaldy + ~10 miles, "People living in this location". Age 18–65+. No detailed interests. Placements: Advantage+.
- Two ads in the same ad set, both using the form above:
  - Ad A: feed image = Ad A 4:5, Stories/Reels image = Ad A 9:16
  - Ad B: feed image = Ad B 4:5, Stories/Reels image = Ad B 9:16
- Primary text (Ad A): "🦷 A new NHS dental practice is opening in Kirkcaldy! Kirkcaldy Dental & Implant Clinic is coming soon. Tap Sign up to register your interest and be the first to hear when we open."
- Primary text (Ad B): "👨‍👩‍👧 A new NHS dental practice for Kirkcaldy families is opening soon. Register your interest in 30 seconds and we'll keep you updated with opening news."
- Headline: "New NHS dental practice opening in Kirkcaldy". CTA button: Sign up.
- After 5–7 days compare cost per lead; pause the weaker ad.

## Step 6 – Leaflet sign-up page (QR code)
Full instructions are in `leaflet/README.md`. Short version:
1. The website zip now contains `register/`. Make sure https://kirkcaldydentist.co.uk/register/ loads.
2. In the Interest List sheet, go to Extensions → Apps Script, paste in `leaflet/apps-script.gs` and deploy it as a Web app (Execute as: Me, Access: Anyone). Then paste the /exec URL into `register/index.html` (replace `PASTE_APPS_SCRIPT_URL_HERE`) and re-upload that file.
3. Test by scanning the QR code on `leaflet/kirkcaldy-dental-leaflet-A5.pdf`. A row should appear with Source = leaflet, and the thank-you email should arrive.
4. Leaflet artwork in Canva: https://www.canva.com/d/g-cSkyL9W_XqpW4. For printing, download it as "PDF Print" with crop marks and bleed.
