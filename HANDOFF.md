# Kirkcaldy Dental & Implant Clinic – launch handoff

> **Setup night: start with [BROWSER-CLAUDE-LAUNCH.md](BROWSER-CLAUDE-LAUNCH.md).** It is the step-by-step runbook and points back to the sections below.

Give this whole note to Claude in the browser. Do the steps in order. Ask the owner before anything that costs money, publishes ads, or sends messages to real people.

## Rules for every ad, page and message
- Allowed (owner-approved, same as banner & leaflet): "New NHS dental practice – opening soon", "Be first in line – join our waiting list", "Join waiting list".
- NOT allowed: "taking on / accepting / registering NHS patients", "limited places", "first come, first served", "free NHS dentist", "guaranteed". Never use the NHS logo (plain text "NHS" is fine). Say "waiting list" only.
- Never print or use the Dentally placeholder phone number anywhere. Use only the clinic's real 01592 number, once it exists.
- The ad and leaflet photos are AI/stock images (owner, 8 Nov). No model release is needed. Keep a note of the AI tool or stock licence in Drive "11. Legal & compliance", and never caption or describe the people as real patients.
- The owner's decisions are in **OWNER-DECISIONS.md**. They win over anything else in this file.
- Colours: cream #F6F2EA, deep gold #8A6A2C, charcoal #30363B, text #262B30.
- Website: kirkcaldydental.co.uk (hosted on Hostinger). Email: info@kirkcaldydental.co.uk

## Assets
- Everything lives in the GitHub repo **fqpmc824wx-droid/Kirkcaldy** and in the Google Drive folder "Kirkcaldy Dental – Print files & marketing" (numbered subfolders; "11. Legal & compliance" is private and kept by the legal chat).
- Website: the **one** zip in Drive "5. Website". After the PRs are merged, the website chat builds it from `site/` on `main` and leaves a one-line READ ME naming it. If there's no READ ME, or more than one zip, use BROWSER-CLAUDE-LAUNCH.md §1.1 instead (download `main` from GitHub).
- Logo pack: `kirkcaldy-dental-logo-pack.zip`, plus `brand/logo/` (Drive: 4. Logo & Brand)
- Banner 180 × 60 cm: `banner/` (Drive: 2. Banner 180x60cm). Send the printer the PRINT PDF (10 mm bleed).
- Leaflet A5: `leaflet/` (Drive: 3. Leaflet A5). Send the printer the PRINT PDF (3 mm bleed).
- Waiting List Google Sheet (owned by info@kirkcaldydental.co.uk, Drive: 6. Sheets & Trackers): https://docs.google.com/spreadsheets/d/1WxadIcaibszu3YYR3eqNMjaQQ0V3LJ_Mvdsx_I2KBQI/edit
  Columns: Signup Time | Name | Phone | Email | Postcode | No. of People | Currently Registered? | Adult/Child/Family | Source | Status | Assigned to | Marketing consent | Notes, then the tracking columns (Lead ID … Call outcome …).
  Both forms ask only for name, phone and (optional) email. The caller fills in Postcode, No. of People, Currently Registered? and Adult/Child/Family on the call.
  The old Interest List sheet (https://docs.google.com/spreadsheets/d/1YBtbcdnAKaPAr3MyNEJFKimbGt2bJ_AB9d-1jppuTDM/edit, in a different Google account) keeps the earlier leads. Point new Facebook leads at the new sheet.
- Weekly trackers: see `tracker/README.md` (Drive: 6. Sheets & Trackers).
- Ads (in the GitHub repo fqpmc824wx-droid/Kirkcaldy, folder `ads/`, 2160 px wide):
  - Ad A (woman in dental chair): `ad-A-feed-4x5.png`, `ad-A-stories-9x16.png`, video `ad-A-video-9x16.mp4` / `ad-A-video-4x5.mp4`
  - Ad B (mum & daughter): `ad-B-feed-4x5.png`, `ad-B-stories-9x16.png`, video `ad-B-video-9x16.mp4` / `ad-B-video-4x5.mp4`
  - Source: `ads/source/ad.html` (`node render.js` for images, `node render-video.js` for videos)

## Step 1 – Website on Hostinger
0. Domain: kirkcaldydental.co.uk is held by Google (Squarespace Domains). In Hostinger add the website to get its IP, then in Google Admin → Domains → DNS add an A record for "@" to that IP and a CNAME "www" → kirkcaldydental.co.uk. Don't touch the MX, SPF or DKIM records (email). Add a DMARC record and remove the Squarespace defaults as in BROWSER-CLAUDE-LAUNCH.md §1.3.
1. hostinger.co.uk → Websites → kirkcaldydental.co.uk → File Manager → `public_html`.
2. Delete any default `index.php` / `default.php`.
3. Upload the one website zip from Drive "5. Website" (see Assets above; if in doubt, follow BROWSER-CLAUDE-LAUNCH.md §1.1) → right-click → Extract. `index.html`, `privacy.html`, `assets/`, `register/`, `b/` and `l/` must sit directly in `public_html`.
4. Security → SSL → enable, then turn on **Force HTTPS**.
5. Check https://kirkcaldydental.co.uk and https://kirkcaldydental.co.uk/privacy.html load, and that http:// and www. addresses end up on https (BROWSER-CLAUDE-LAUNCH.md §1.5).
6. ~~Emails → create mailbox~~ **SKIP:** info@kirkcaldydental.co.uk is already a Google Workspace mailbox. Don't create a Hostinger mailbox or change MX/SPF/nameservers.

## Step 2 – Meta lead form (final spec v1, 8 Nov)
*Copied from research/FORMS-meta-instant-form.md (the owner's fields: name and phone required, email optional). One change from that file: the owner says NHS approval already exists, so no new NHS Fife letter is needed. Keep a copy of the existing approval instead (gate 1 below).*

Build it in **Ads Manager**, during ad creation: Destination → Instant form → Create form. Don't use Business Suite. The order is in BROWSER-CLAUDE-LAUNCH.md §4 (draft campaign and ad set first). **Save as DRAFT.** Show the owner the phone preview and publish only after a clear "yes". A published form can't be edited, only duplicated, and the copy gets a new Form ID.

**Don't publish the form until all three are true:**
1. A copy of the existing **NHS Fife approval** (email or letter) is saved in Drive "11. Legal & compliance". No new letter is needed (owner: "We've got approval").
2. https://kirkcaldydental.co.uk/privacy.html loads on mobile data and already shows the updated text (website spec, privacy section).
3. The owner has said "yes" to the draft preview.

**Form type**
- Form name: `KDIC waiting list v1 – Nov 2026`
- Form type: **More volume** (the default). Not Higher intent.
- **Flexible form delivery** (if shown, at the bottom of Form type): **Off.** Don't let Meta skip or reorder parts of the form.

**Intro**
- Background image: **Use the image from your ad.**
- Greeting: **On.**
- Headline (49 of 60 characters): **Join our waiting list – opening soon in Kirkcaldy**
- Description (Paragraph): **"Kirkcaldy Dental & Implant Clinic is a new NHS dental practice, also offering private treatments, opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free to join our waiting list, and one sign-up covers your whole household. We'll keep you updated about your place and our opening. Joining doesn't register you with the practice yet, and doesn't guarantee an appointment or a place on our patient list. Please sign up here rather than calling in at the practice."**
  - If the editor says the text is too long, delete the last sentence only.

**Questions**
- Custom questions: **none.** Conditional logic: **Off.**
  - Fallback, only if Meta refuses to save without a custom question: add ONE **optional** multiple-choice question, copied word for word: "How many people would you like to add to the waiting list?" with answers 1 / 2 / 3 / 4+. The script already maps it to No. of People.
- Description box (how the information is used): **"We'll use these details to add you to our waiting list, confirm it by text (and by email, if you give one), call you about it between 8am and 9pm, and contact you about your place on the list and our opening."**
- Contact information (+ Add category). Use exactly these three fields, in this order:
  1. User information → **Full name**: **Required.** One Full name field, not First + Last. The caller greets them by name, and the text uses the first name.
  2. Contact fields → **Phone number** (never "Work phone number"): **Required.** If the editor shows it as "optional", switch that off. Every text, caller alert, call and repeat check depends on it, and Required is what makes the text-code check available.
  3. Contact fields → **Email**: **Optional** if the editor offers it. If not, leave it Required (the owner accepted either). Leave "Collect work email address" **off**.
- **Do NOT add:** Post code, First/Last name, "How many people", "Who is this for?", "Are you currently registered…", or anything else. The caller collects all of those on the call.
- Settings → **Field names: leave the defaults** (full_name, phone_number, email). The script finds the fields by these names.

**Privacy policy**
- Link text: **Privacy policy**
- URL: **https://kirkcaldydental.co.uk/privacy.html**

**Custom disclaimer**
- Title: **How we'll contact you**
- Text: **"By tapping Submit, you're asking Kirkcaldy Dental & Implant Clinic to add you to our waiting list. Joining doesn't register you with the practice yet. We'll text you a confirmation shortly (and email you, if you gave your email), call you about your request between 8am and 9pm, and contact you about your place on the list and our opening. We won't send you marketing unless you tick the box below. Our privacy policy explains how we use your details and how to complain."**
- **+ Add new consent, ONE box only:** "Yes, also send me news and offers from Kirkcaldy Dental by text and email. I can opt out at any time."
  - Click **Optional.** Meta makes a box required unless you do.
  - It is not pre-ticked. Only people who tick it may ever get promotional texts or emails.
  - Add no other box and no "I agree" box: Meta already makes people accept the disclaimer before they can submit.

**Ending (Message for leads)**
- Headline (35 of 60 characters): **Thanks – you're on the waiting list**
- Description: **"We'll text you a confirmation shortly. Our team will call you between 8am and 9pm to confirm your details. One sign-up covers your whole household, so there's no need to sign up again – we'll take their details when we call. Need urgent dental care now? Contact your current dentist, or NHS 24 on 111 out of hours."**
  - Don't add the NHS Fife Dental Advice Line here: NHS Fife hasn't confirmed it, and the form can't be changed later.
- Call to action: **Go to website / View website** → **https://kirkcaldydental.co.uk/?src=fb-form-done**. Button text: "View website".
  - Never "Call business".
  - Never /waiting-list/: that page doesn't exist on any branch, and the form can't be changed later.
- **Chat on WhatsApp:** unticked. Meta can tick it automatically if the Page is linked to WhatsApp.
- **Start a conversation on Messenger:** unticked.

**Settings on EVERY ad (Ad A, Ad B and any ad added later)**
- **Destination:** this form. Tick **"Require SMS verification to submit form"**, and pick **Required** if Meta offers Required/Optional.
  - If the box is greyed out, Phone number isn't set to Required.
  - With More volume, this setting is per ad, not in the form editor.
- **Lead nurturing → Follow-up channels:** untick Chat on Messenger, Chat on Instagram and Chat on WhatsApp. Nobody watches those inboxes, and people may post health details there.
- **Lead capture AI agent / AI chat** (if shown): **Off.**

**What people see**
Ad → Sign up → intro screen → contact screen (name, phone and email already filled in) with the notice, disclaimer and box → Submit → enter the text code → thank-you screen.
- In the UK, Meta sends the code by SMS. Someone who has verified isn't asked again for 180 days.
- Landlines can't verify. Those people use the website form, which accepts landlines.
- Text-code ads show only on mobile Facebook and Instagram placements, Stories and Reels included.

**After publishing**
- Copy the Form ID into Script Property **META_FORM_IDS** (comma-separated; keep any old ID until its ads have stopped).
- Wording check: "waiting list" only. No "accepting / taking on / registering NHS patients", "first come first served", "limited places", "free NHS dentist" or "guaranteed".
- Business Settings → Integrations → Leads access → allow our lead app (leads/README.md) for the page.
- Tests: BROWSER-CLAUDE-LAUNCH.md §6 (the three Facebook rows).

## Text messages – legal checklist (UK PECR / UK GDPR / ICO)
The automatic texts are **service messages**: replies to the person's own request to join the waiting list. They are not marketing. Keep them that way:
1. **Lead thank-you text:** only confirms the request and says when we'll call.
   - No offers, prices or promotions, and no "book now".
   - It names the sender: the "KirkDental" sender ID plus "Kirkcaldy Dental" in the text.
   - Wording is fixed in `leadText()`. Ask the ads chat before changing it, and change it only in both script copies at once.
2. **NHS wording:** "waiting list" only. Never "accepting / taking on / registering NHS patients", "free NHS dentist" or "guaranteed".
3. **Calls and caller alerts only 8am–9pm** (`CALL_HOURS` 8-21; nobody is called after 9pm). The one exception is the lead's own confirmation text: it goes at any hour, straight after they sign up, because it's the reply they've just asked for. After 9pm it says "our team will call you from 8am".
4. **Marketing texts or emails** (e.g. opening offers) go **only** to people who ticked the optional consent box. Every marketing message needs an opt-out: "To stop, email info@kirkcaldydental.co.uk" or a reply number. Alphanumeric senders like "KirkDental" can't receive replies.
5. **Opt-outs:** if anyone asks to stop, pick "DO NOT CONTACT" in Call outcome (column Y; Status then shows DO NOT CONTACT) the same day, and never text or call them again.
6. **Privacy policy** (privacy.html) must list everyone who handles the data:
   - Meta (form), Google (sheet, Apps Script, Gmail), ClickSend (texts) and Hostinger (website).
   - It must also say we text and call about the request, and keep the data up to 12 months after opening.
   - Zapier is no longer used.
7. **Team alert texts** contain a name and phone number. Send them only to staff work phones; staff delete them after calling.
8. Keep the sheet private: share it only with the staff who call.
9. **Processor agreements:** accept and save the ClickSend DPA (with the UK International Data Transfer Addendum), the Google Workspace Cloud Data Processing Addendum, Meta's Lead Ads Terms and Data Processing Terms, and the Hostinger DPA into Drive "11. Legal & compliance" (BROWSER-CLAUDE-LAUNCH.md §5.8).
*Not legal advice: have the clinic's compliance lead or the BDA/ICO guidance confirm before launch.*

## Step 3 – Free backup lead alerts on the phones
The main alert is the "NEW LEAD" text from our script: each lead goes to ONE caller, and the owner gets an email copy. These are free backups in case a text fails.
1. **Caller's phone:** install the **Meta Business Suite** app and log in with the caller's own Facebook account. Give the caller the smallest Page access that includes leads (never full control), and add them under Business settings → Integrations → Leads access (BROWSER-CLAUDE-LAUNCH.md §5.5).
2. Turn on notifications for **Leads**. Every new Facebook/Instagram lead then pops up on the phone with name and number. It's free.
3. **Owner's phone:** install the **Gmail** app with info@kirkcaldydental.co.uk and turn on notifications, so the email copy of every lead alert pops up. Callers use their own logins, not info@.
4. ClickSend: pay-as-you-go top-up (BROWSER-CLAUDE-LAUNCH.md §2: ask the owner, about £50). Sender ID `KirkDental`. The username and API key go into Apps Script → Script Properties (BROWSER-CLAUDE-LAUNCH.md §5.5).

> **The instant confirmation text to every lead is a must-have (owner).**

## Step 4 – Lead automation → SUPERSEDED
**Use our own free scripts instead (BROWSER-CLAUDE-LAUNCH.md Step 5, leads/README.md, leaflet/README.md). Don't sign up to Make.com or Zapier.**
Demand evidence used for planning:
- Glenrothes Dental House NHS registrations: Feb 1,187, Mar 2,598 (peak ~85/day), Apr 1,200, then ~480–760/month.
- 2,445 active patients with Kirkcaldy KY1/KY2 postcodes travel to the owner's other practices.

**Team routine – calls 8am to 9pm, 7 days (owner decision: nobody is called after 9pm):**
- 8am–9pm: each lead alert goes to ONE caller. With two or more callers, leads go to the next caller in turn (`ALERT_MODE` = `rotate`). The owner gets an email copy (`OWNER_EMAIL`), not a text. The caller calls within minutes.
- 9pm–8am: the lead gets an instant "our team will call you from 8am to confirm your details" text. The row is marked "Call 8am", and the 8am summary goes to the team. These are the first calls of the day.
- If there's no answer, try again within 2 hours (before 9pm) and once more the next day. After each call, pick a value from **Call outcome** (column Y); Status fills itself, and notes go in Notes (BROWSER-CLAUDE-LAUNCH.md §9).

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
- Two ads, A and B: Drive "1. Meta Ads" → folders "Ad A – Woman (USE THESE)" and "Ad B – Family (USE THESE)". Each has a 4:5 Feed video and image and a 9:16 Stories/Reels video and image, set via placement asset customisation. Ignore "Old versions – not used".
- On each ad: the Step 2 form, **"Require SMS verification to submit form" ticked**, Lead nurturing follow-up channels unticked, AI agent off (Step 2, "Settings on EVERY ad"). Text-code ads run only on mobile placements.
- Primary text (Ad A): "🦷 New NHS dental practice – opening soon in Kirkcaldy. Be first in line – join our waiting list. We'll offer NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free and quick to join our waiting list, and we'll keep you updated with opening news."
- Primary text (Ad B): "👩‍👧 Kirkcaldy families: new NHS dental practice opening soon. Be first in line – join our waiting list. We'll offer NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free and quick to join our waiting list, and when we call, you can add the rest of your household. We'll keep you updated with opening news."
  - "and when we call, you can add the rest of your household" replaces "you can tell us how many people in your household would like to join", because the form no longer asks (research/FORMS-script-changes-and-corrections.md §6).
  - The old "Looking for an NHS dentist for the whole family?" is gone. Questions about the viewer's dental situation risk Meta's personal-attributes policy, and it came close to "taking on patients".
- Stories/Reels primary text: "New NHS dental practice opening soon in Kirkcaldy. Be first in line – join our waiting list 👇 NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW."
- Headlines (load all three): "Free to join our waiting list" / "New NHS dental practice – opening soon" / "Opening soon on Tolbooth Street". Description: "NHS & private dental care · 23–25 Tolbooth Street, Kirkcaldy KY1 1RW". CTA: **Sign up**.
- Owner must confirm before launch:
  - the "NHS and private" line (GDC: publicity must say NHS / mixed / private);
  - a copy of the existing NHS Fife approval (email or letter) is saved in Drive "11. Legal & compliance". The owner says the approval exists and an inspection comes later, so no new letter is needed;
  - the photos' AI tool or stock licence is noted in the same folder (no model release is needed for AI-generated people);
  - "Be first in line" only if invitations really follow sign-up order, with households kept together.
- After about 7 days, pause the ad whose cost per lead is 30% or more worse.

## Step 6 – Banner, leaflet and QR sign-up page
Full instructions are in `leaflet/README.md` and `banner/README.md`. Short version:
1. The website (the one zip in Drive "5. Website", or `main` from GitHub, see BROWSER-CLAUDE-LAUNCH.md §1.1) contains `register/`. Make sure https://kirkcaldydental.co.uk/register/ loads before printing anything: the QR codes on the banner and leaflet open that page.
2. In the Waiting List sheet, go to Extensions → Apps Script, paste in `leaflet/apps-script.gs` and deploy it as a Web app (Execute as: Me, Access: Anyone). Paste the /exec URL in place of `PASTE_APPS_SCRIPT_URL_HERE` **in Hostinger File Manager**, exactly as BROWSER-CLAUDE-LAUNCH.md §5.7 says. Never re-upload the repo copy that still says PASTE_APPS_SCRIPT_URL_HERE.
3. Test by scanning the QR code on the leaflet: a row should appear with Source = leaflet, the page should show the thank-you, and the thank-you text (and the email, if one was given) should arrive.
4. Phone number: not set yet. Dentally shows a placeholder number: **never use or print it.** When the real 01592 number exists, add it with `cd leaflet/source && node render.js "01592 ..."` and add it to the banner.
5. Address: 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.
