# Kirkcaldy Dental & Implant Clinic – launch handoff

> **Setup night: start with [BROWSER-CLAUDE-LAUNCH.md](BROWSER-CLAUDE-LAUNCH.md).** It is the step-by-step runbook and points back to the sections below.

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
6. ~~Emails → create mailbox~~ **SKIP:** info@kirkcaldydental.co.uk is already a Google Workspace mailbox. Don't create a Hostinger mailbox or change MX/SPF/nameservers.

## Step 2 – Meta lead form (build it in **Ads Manager**, not Business Suite: phone verification needs Ads Manager)
*Updated 8 Nov from the Meta research and creative-review agent teams. Save the form as a DRAFT and get the owner's OK before publishing: a published form can't be edited.*
- Form name: `KDIC waiting list v1 – Nov 2026`. Form type: **Higher intent**, with **phone number verification ON (required)**. Landlines can't verify, which is fine because texts only go to UK mobiles.
- **Lead capture AI agent / AI chat: OFF.**
- Intro headline: "Be first in line – join our waiting list"
- Intro text: "Kirkcaldy Dental & Implant Clinic is a new NHS dental practice, also offering private treatments, opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free to join our waiting list and we'll keep you updated with opening news. Joining doesn't register you with the practice yet, and doesn't guarantee an appointment or a place on our patient list. Please sign up here rather than calling in at the practice."
- Contact fields (prefill): Full name, Phone (required), Email, and Meta's built-in **Post code** field.
- **Exactly two** multiple-choice questions:
  - "How many people would you like to add to the waiting list?" 1 / 2 / 3 / 4+
  - "Who is this for?" Adult / Child / Family
  - **REMOVED: "Are you currently registered with a dentist?"** Two agent teams flagged it as health-data risk under Meta's lead-ads policy, with little value. The caller asks "Where is your current dentist?" on the call instead.
  - Conditional logic: off.
- Privacy policy URL: https://kirkcaldydental.co.uk/privacy.html
- **Custom disclaimer** (title "How we'll contact you"). It now matches what actually happens, because the confirmation text goes out at any hour:
  "By tapping Submit, you're asking Kirkcaldy Dental & Implant Clinic to add you to our waiting list. Joining doesn't register you with the practice yet. We'll send you a confirmation text and email straight away, and call you about your request between 8am and 9pm. We won't send you marketing unless you tick the box below. Our privacy policy explains how we use your details and how to complain."
- **Optional consent checkbox** (NOT pre-ticked, NOT required):
  "Yes, also send me news and offers from Kirkcaldy Dental by text and email. I can opt out at any time."
  Only people who tick it may ever get promotional texts or emails.
- Completion screen:
  - Headline "Thanks – you're on the waiting list".
  - Description "We've sent you a confirmation text and email, and we'll be in touch before we open. Need urgent dental care now? Contact your current dentist, or NHS 24 on 111 out of hours." Before adding the NHS Fife Dental Advice Line (01592 226555, weekdays), check the number and hours on nhsfife.org.
  - Button: **View website** → `https://kirkcaldydental.co.uk/waiting-list/?src=fb-form-done` (the FAQ page from the website chat). If that page isn't live yet, use `https://kirkcaldydental.co.uk/?src=fb-form-done`. Never use "Call business": two callers can't take a flood of inbound calls.
- Business Settings → Integrations → Leads access → allow our lead app (leads/README.md) for the page.

## Text messages – legal checklist (UK PECR / UK GDPR / ICO)
The automatic texts are **service messages**: replies to the person's own request to join the waiting list. They are not marketing. Keep them that way:
1. **Lead thank-you text:** only confirms the request and says when we'll call.
   - No offers, prices or promotions, and no "book now".
   - It names the sender: the "KirkDental" sender ID plus "Kirkcaldy Dental" in the text.
   - Wording is fixed in `leadText()`; change it only in both script copies at once.
2. **NHS wording:** "waiting list" only. Never "accepting / taking on / registering NHS patients", never "guaranteed".
3. **Calls and texts only 8am–9pm** (`CALL_HOURS` 8-21). The 9pm–8am texts are the automatic confirmation the person has just asked for.
4. **Marketing texts or emails** (e.g. opening offers) go **only** to people who ticked the optional consent box. Every marketing message needs an opt-out: "To stop, email info@kirkcaldydental.co.uk" or a reply number. Alphanumeric senders like "KirkDental" can't receive replies.
5. **Opt-outs:** if anyone asks to stop, write "DO NOT CONTACT" in Status the same day and never text or call them again.
6. **Privacy policy** (privacy.html) must list everyone who handles the data:
   - Meta (form), Google (sheet, Apps Script, Gmail), ClickSend (texts) and Hostinger (website).
   - It must also say we text and call about the request, and keep the data up to 12 months after opening.
   - Zapier is no longer used.
7. **Team alert texts** contain a name and phone number. Send them only to staff work phones; staff delete them after calling.
8. Keep the sheet private: share it only with the staff who call.
*Not legal advice: have the clinic's compliance lead or the BDA/ICO guidance confirm before launch.*

## Step 3 – Free lead alerts on the team phones
1. Install the **Meta Business Suite** app on every team phone. Log in with a page admin/editor account.
2. Turn on notifications for **Leads**. Every new lead then pops up on the phone with name and number. It's free.
3. Install the **Gmail** app on the team phones with info@kirkcaldydental.co.uk and turn on notifications, so the "New lead" email from Step 4 also pops up.
4. ClickSend: pay-as-you-go ~£20 top-up. Sender ID `KirkDental`. Copy the username and API key into Make.

> **The instant confirmation text to every lead is a must-have (owner).**

## Step 4 – Lead automation → SUPERSEDED
**Use our own free scripts instead (BROWSER-CLAUDE-LAUNCH.md Step 5, leads/README.md, leaflet/README.md). Don't sign up to Make.com or Zapier.**
Demand evidence used for planning:
- Glenrothes Dental House NHS registrations: Feb 1,187, Mar 2,598 (peak ~85/day), Apr 1,200, then ~480–760/month.
- 2,445 active patients with Kirkcaldy KY1/KY2 postcodes travel to the owner's other practices.

**Team routine – calls 8am to 9pm, 7 days (owner decision: nobody is called after 9pm):**
- 8am–9pm: each lead goes to the next caller in turn (`ALERT_MODE` = `rotate`, owner copied via `OWNER_MOBILE`). They call within minutes.
- 9pm–8am: the lead gets an instant "our team will call you from 8am to confirm your details" text. The row is marked "Call 8am", and the 8am summary goes to the team. These are the first calls of the day.
- If there's no answer, try again within 2 hours (before 9pm) and once more the next day. Mark Status in the sheet after each call: Called / No answer / Booked.

**Upgrade later (only if needed):** an auto-call service such as Callingly (from about $100/month) rings the team phone and connects to the lead automatically.

## Step 5 – Campaign (Ads Manager) – confirm with owner before publishing
Full click-by-click steps are in BROWSER-CLAUDE-LAUNCH.md section 7. Summary:
- Objective **Leads**, one Advantage+ leads campaign, campaign budget **£20/day**, bid strategy Highest volume.
- ONE ad set:
  - Conversion location **Instant forms only**. NOT "Website and instant forms": website leads would never reach our script.
  - Performance goal: Maximise number of leads.
- Location: **postcodes KY1, KY2, KY3, KY4, KY5**, "People living in this location". **Untick "Reach more people likely to respond".**
  - Never EH: a 10-mile pin crosses the Forth into Leith and Granton.
  - Never KY6, KY7 or KY8: the owner's own Glenrothes and Leven practices.
- Minimum age **18**. No detailed interests. Placements: Advantage+, now the only option.
- **Every Advantage+ creative enhancement OFF**, including generated text, image text rewriting and "Test new creative features". Meta's AI could otherwise write "accepting NHS patients".
- Two ads, A and B (Drive "1. Meta Ads"): 4:5 image for Feeds; 9:16 video (fallback image) for Stories/Reels via placement asset customisation.
- Primary text (Ad A): "🦷 New NHS dental practice – opening soon in Kirkcaldy. Be first in line – join our waiting list. We'll offer NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free and quick to join our waiting list, and we'll keep you updated with opening news."
- Primary text (Ad B): "👩‍👧 Kirkcaldy families: new NHS dental practice opening soon. Be first in line – join our waiting list. We'll offer NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free and quick to join our waiting list, and you can tell us how many people in your household would like to join. We'll keep you updated with opening news."
  - The old "Looking for an NHS dentist for the whole family?" is gone. Questions about the viewer's dental situation risk Meta's personal-attributes policy, and it came close to "taking on patients".
- Stories/Reels primary text: "New NHS dental practice opening soon in Kirkcaldy. Be first in line – join our waiting list 👇 NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW."
- Headlines (load all three): "Free to join our waiting list" / "New NHS dental practice – opening soon" / "Opening soon on Tolbooth Street". Description: "NHS & private dental care · 23–25 Tolbooth Street, Kirkcaldy KY1 1RW". CTA: **Sign up**.
- Owner must confirm before launch:
  - the "NHS and private" line (GDC: publicity must say NHS / mixed / private);
  - written NHS Fife confirmation that the dentists are on, or provisionally on, the dental list;
  - "Be first in line" only if invitations really follow sign-up order, with households kept together.
- After about 7 days, pause the ad whose cost per lead is 30% or more worse.

## Step 6 – Banner, leaflet and QR sign-up page
Full instructions are in `leaflet/README.md` and `banner/README.md`. Short version:
1. The website zip contains `register/`. Make sure https://kirkcaldydental.co.uk/register/ loads before printing anything: the QR codes on the banner and leaflet open that page.
2. In the Waiting List sheet, go to Extensions → Apps Script, paste in `leaflet/apps-script.gs` and deploy it as a Web app (Execute as: Me, Access: Anyone). Paste the /exec URL into `site/register/index.html` (replace `PASTE_APPS_SCRIPT_URL_HERE`) and re-upload that file.
3. Test by scanning the QR code on the leaflet: a row should appear with Source = leaflet, and the thank-you email should arrive.
4. Phone number: not set yet (Dentally has a placeholder). When it exists, add it with `cd leaflet/source && node render.js "01592 ..."` and add it to the banner.
5. Address: 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.
