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
- **The QR code goes to:** `https://kirkcaldydental.co.uk/register/?src=leaflet`
  - The `?src=leaflet` part tags each sign-up as **leaflet** in the sheet's **Source** column. That lets you count how many sign-ups the leaflets bring in, separately from Facebook.
  - A different leaflet run (for example a second area) can use its own code: change it to `?src=leaflet-dysart` and so on.

## Setup (about 10 minutes, do this before printing)

### 1. Upload the website
Upload `kirkcaldy-dental-website.zip` to Hostinger and extract it into `public_html`, the same way as in `HANDOFF.md`, step 1. The zip now includes the `register/` folder.
Check that **https://kirkcaldydental.co.uk/register/** loads.

### 2. Connect the form to the Google Sheet
1. Open the Waiting List sheet: https://docs.google.com/spreadsheets/d/1WxadIcaibszu3YYR3eqNMjaQQ0V3LJ_Mvdsx_I2KBQI/edit
2. Go to **Extensions → Apps Script**. Delete the sample code and paste in all of `apps-script.gs`, then save.
3. Go to **Deploy → New deployment**, set the type to **Web app**, set *Execute as* to **Me** and *Who has access* to **Anyone**, then click **Deploy**. Allow the permissions it asks for.
4. Copy the **Web app URL**, which ends in `/exec`.
5. In `site/register/index.html`, replace `PASTE_APPS_SCRIPT_URL_HERE` with that URL. Re-upload `register/index.html` to Hostinger at `public_html/register/`.

### 3. Test it
Scan the QR code on the PDF with your phone and submit your own details. Check that:
- a row appears in the sheet with **Source = leaflet**
- the thank-you email arrives
- info@ gets a "new sign-up" note

Delete the test row afterwards.

## Tracking
- Every sign-up gets a **Source** (leaflet, banner, facebook, website, phone) and a postcode in the Waiting List sheet.
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
