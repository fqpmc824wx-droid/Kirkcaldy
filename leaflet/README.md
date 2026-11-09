# Leaflet + QR code → register page

## What's here
| File | What it is |
|---|---|
| `kirkcaldy-dental-leaflet-A5-PRINT-with-3mm-bleed.pdf` | **Send this to the printer.** A5 double-sided (front + back), 3 mm bleed |
| `kirkcaldy-dental-leaflet-A5.pdf` | Same, exact A5 with no bleed (only if the printer asks for it) |
| `leaflet-preview.jpg` | Front and back side by side |
| `source/` | The design files (`leaflet.html`, `render.js`). To add the phone number: `cd source && node render.js "01592 123456"` |
| `leaflet-front.png`, `leaflet-back.png` | 300 dpi previews of each side |
| `qr-leaflet.svg` / `.png` | The QR code on its own (vector + PNG) |
| `apps-script.gs` | Saves website sign-ups into the Waiting List Google Sheet |

- **Design:** matches the 180 × 60 cm banner (same fonts, gold italic "Opening Soon!", gold strip). The older Canva version is replaced.
- **The QR code goes to:** `https://kirkcaldydental.co.uk/l (short link → /register/?src=leaflet)`
  - The `?src=leaflet` part tags each sign-up as **leaflet** in the sheet's **Source** column. That lets you count how many sign-ups the leaflets bring in, separately from Facebook.
  - A different leaflet run (for example a second area) can use its own code: change it to `?src=leaflet-dysart` and so on.

## Setup (about 10 minutes, do this before printing)

### 1. Upload the website
Upload `kirkcaldy-dental-website.zip` to Hostinger and extract it into `public_html`, the same way as in `HANDOFF.md`, step 1. The zip now includes the `register/` folder and the `b/` and `l/` QR short links.

**Don't print the banner or leaflets until these work live on your phone:** https://kirkcaldydental.co.uk/b and https://kirkcaldydental.co.uk/l should both open the waiting-list page.
Check that **https://kirkcaldydental.co.uk/register/** loads.

### 2. Connect the form to the Google Sheet
1. Open the Waiting List sheet: https://docs.google.com/spreadsheets/d/1WxadIcaibszu3YYR3eqNMjaQQ0V3LJ_Mvdsx_I2KBQI/edit
2. Go to **Extensions → Apps Script**. Delete the sample code and paste in all of `apps-script.gs`, then save.
3. Go to **Deploy → New deployment**, set the type to **Web app**, set *Execute as* to **Me** and *Who has access* to **Anyone**, then click **Deploy**. Allow the permissions it asks for.
4. Copy the **Web app URL**, which ends in `/exec`.
5. In `site/register/index.html`, replace `PASTE_APPS_SCRIPT_URL_HERE` with that URL. Re-upload `register/index.html` to Hostinger at `public_html/register/`.

### 2b. Instant text messages (ClickSend)
Website and QR sign-ups get the same instant thank-you text as Facebook leads, and the on-call mobile gets a "new lead" alert.
1. Open a ClickSend account, top up (about £20), and register the sender ID **KirkDental**.
2. In the Apps Script editor, go to **Project Settings → Script Properties** and add:
   - `CLICKSEND_USER`: your ClickSend username
   - `CLICKSEND_KEY`: your ClickSend API key (Dashboard → API Credentials)
   - `CALL_HOURS` (optional): leave unset for the default `8-21` (no calls after 9pm). Out-of-hours sign-ups get the "we'll call you tomorrow from 8am" text, Status "Call 8am" and no team alert, and the 8am morning summary picks them up. Set `24h` for round-the-clock calling
   - `ONCALL_MOBILE`: one or more mobiles for new-lead alerts, comma-separated, e.g. `07700900123, 07700900456` (optional)
   - `ALERT_MODE` (optional): `all` (default, every ONCALL_MOBILE gets each lead) or `rotate` (each lead goes to the next ONCALL_MOBILE in turn, for the remote team). The person it went to is written in the **Assigned to** column
   - `OWNER_MOBILE` (optional): mobile(s) that get a copy of every alert by text, comma-separated. Leave empty if you use OWNER_EMAIL
   - `OWNER_EMAIL` (optional): email(s) that get a free copy of every alert, comma-separated, e.g. `info@kirkcaldydental.co.uk` (shows as a Gmail app notification). When it's set, the separate "new sign-up" email is only sent for out-of-hours sign-ups, so you don't get two
   - `ALERT_NEXT`: set automatically by the rotation, shared with the Facebook leads script so the turn order runs across both. Don't edit it

**Protection against misuse (the form is public)**
- Texts only go to UK mobiles (+447…). Landlines, premium and foreign numbers are never texted.
- A hidden `website` field on the form catches bots. Anything that fills it in is ignored.
- **Repeat sign-ups** follow the same rule as the Facebook leads, matched on the phone (last 10 digits) or the email:
  - signed up again within 24 hours, or already Called / Booked / Not interested: Status **Duplicate**, with no alert, no text and no email;
  - older and never reached: the callers get a "REPEAT" alert, and the person gets one "you're already on the list" text;
  - DO NOT CONTACT always wins.
- If ClickSend refuses a text (wrong key, no credit, sender ID not approved), it's logged and OWNER_EMAIL gets an email, at most once an hour.

**Consent and do-not-contact (PECR / GDPR)**
- **Marketing consent** column: `Yes` only when the person ticked the optional, unticked box on the form (field `marketing`), otherwise `No`. Only `Yes` people may ever get promotional texts or emails. The thank-you text and email are service messages only, with no offers.
- **Status** dropdown: Called · No answer · Booked · DO NOT CONTACT · Call 8am · Duplicate · Unreachable · Wrong number · Not interested · Withdrew. It only warns, so the scripts can still write other values. After calling, replace "Call 8am" with the real result.
- Set a row's **Status** to exactly `DO NOT CONTACT` to stop all texts, calls and emails to that phone number or email address (numbers match however they're written: 07…, +44 7…, +44 (0)7…). Any new sign-up with the same number is still saved (with Status `DO NOT CONTACT`), but gets no text, no team alert and no email. The Facebook leads script uses the same string.
3. Deploy a **new version** of the web app (Deploy → Manage deployments → Edit → New version).
Until the keys are added, sign-ups still save and email as normal; the texts are just skipped.

### 3. Test it
Scan the QR code on the PDF with your phone and submit your own details. Check that:
- a row appears in the sheet with **Source = leaflet**
- the thank-you email and text arrive, and the on-call mobile gets the alert
- info@ gets a "new sign-up" note

Delete the test row afterwards.

## Tracking
- Every sign-up gets a **Source** (leaflet, banner, facebook, website, phone) in the Waiting List sheet. The forms only ask for name, phone and email (email optional); the caller fills in postcode, number of people, adult/child/family and "currently registered" on the call.
- Every visit to the waiting-list page (e.g. a QR scan) is counted on the **Visits** tab: time and source only, nothing personal, no cookies. This works once the Apps Script URL is pasted into `register/index.html`.
- The **Dashboard** tab shows sign-ups, total people, "no dentist" count, visits vs sign-ups by source, adult/child/family, registered-elsewhere, sign-ups by postcode sector and week by week, with charts. It updates by itself.

## Printing
- **Size:** A5 (148 × 210 mm), double-sided, 4-colour.
- **Paper:** 150–170 gsm silk or matt for door drops; 300 gsm if you'll hand them out or leave them on a counter.
- **Bleed:** use `kirkcaldy-dental-leaflet-A5-PRINT-with-3mm-bleed.pdf` (3 mm bleed, which Instantprint, Solopress and Vistaprint ask for). All text sits at least 8 mm inside the trim.
- **Proof:** order 1 proof or a small run first, and scan the printed QR code before ordering thousands.

## Wording rules (same as the banner and ads)
Allowed: "New NHS dental practice – opening soon", "Be first in line – join our waiting list", "Join waiting list".
NOT allowed until after the NHS inspection: "taking on / accepting / registering NHS patients", "limited places", "first come, first served". No NHS logo.

## Tracking columns (N onwards)
Columns N–AR are written by name, so their order doesn't matter: Lead ID (website rows are `W-yyMMddHHmmss-xxx`), Logged at, Ad name, Ad ID, Form ID, Organic?, Duplicate of, How heard, SMS ID, SMS status, Email status, Call outcome, call timings, Appt date, People booked, Not booked reason, Current practice, Private interest, Dentally fields, and Visit ID. N–X and Z–AH are hidden, so callers see A–M, **Call outcome (Y)** and AI–AM. Don't put formulas in the Waiting list tab.
The website form can send `heard` (How heard) and `visit` (Visit ID).

## Call tracking (tracking.gs)
`leaflet/tracking.gs` goes in the same Apps Script project, as a second script file. It covers call outcomes, the Call log, the SMS log, call-back reminders, the daily snapshot, delivery reports, bounces and the weekly email. All its names start with `trk`.

**Install once, as info@:**
1. Project Settings → Time zone → Europe/London.
2. Add `tracking.gs`.
3. Run `trkInstallTriggers()` and allow the permissions.

| What | When |
|---|---|
| Call tracking | when the sheet is edited |
| Call-back reminder | every 15 minutes, 8am–9pm |
| ClickSend delivery reports and low-credit alarm (under £10) | 06:15 |
| Email bounce scan | 06:45 |
| Daily snapshot | 21:10 |
| Weekly email | Monday 07:30 |

**For callers:** after each call, pick the result in **Call outcome** (column Y). The script then:
- counts the attempt and sets **Status**, the timestamps and **Next call due**;
- adds a line to **Call history** and a row to the **Call log** tab;
- clears Call outcome, ready for the next call.

Next call due works like this:
- 1st no answer: try again in 2 hours, or 10am the next day if that's after 9pm.
- 2nd no answer: 5:30pm the next day if both calls were before 5pm, otherwise 10am the next day.
- 3rd no answer: Status becomes **Unreachable**.

Setting Status directly still counts as an attempt (Called, No answer, Booked, Not interested, Wrong number).

**Tabs:**
- Script-written: Call log, SMS log, Daily log.
- Formulas only: Lead analysis. Never sort it.
- Filled in by people: Daily checks, Costs, Change log, Complaints.

## Safety switches (Script Properties)
- `WEB_SMS_PAUSED` = `true`: website sign-ups are still saved, but get no text (SMS status "Paused").
- `SMS_HOURLY_MAX` (default 40) and `SMS_DAILY_MAX` (default 300) cap the texts sent. When a cap is hit, the owner gets one email.
- If saving a sign-up fails, the details go to the **Failed sign-ups** tab, the owner is emailed (P1), and the form gets the reply "error".
- `…/exec?action=ping` returns `pong <version>` for uptime checks.
- Only known sources are kept (website, home, leaflet, leaflet-<area>, banner, banner-<n>, gbp, fb-page, ig-bio, fb-form-done, fb-dm, facebook, instagram, google, email, phone, other). Anything else is saved as "website".

## Do-not-contact, backups, retention
- Anyone on the **Do-not-contact list** tab (phone or email) is blocked, as well as rows with Status `DO NOT CONTACT`.
- `trkWeeklyBackup` runs Sunday 23:30. It saves a dated, view-only copy of the whole sheet in a "Backups" folder next to it and keeps the last 8.
- `trkPurgeReport` runs on the 1st of each month. It only *counts* rows past the retention periods and writes the counts to the **Purge report** tab. It deletes nothing.

  | Tab | Kept for |
  |---|---|
  | Waiting list | 12 months from sign-up, or from **Re-confirmed at** if they asked to stay on |
  | Call log, SMS log | 12 months |
  | Visits | 90 days |
  | Failed sign-ups | 30 days |

  Real deletion is switched on only after the owner signs the retention schedule.
- Daily log budget/spend come from Script Properties `ADS_DAILY_BUDGET` / `ADS_TODAY_SPEND` (set by the ads script), or from an "Ad status" tab.
