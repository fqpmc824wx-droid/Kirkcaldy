# Leaflet + QR code → register page

## What's here
| File | What it is |
|---|---|
| `kirkcaldy-dental-leaflet-A5.pdf` | A5 double-sided leaflet (front + back), exported from Canva |
| `leaflet-front.png`, `leaflet-back.png` | 300 dpi previews of each side |
| `qr-leaflet.svg` / `.png` | The QR code on its own (vector + PNG) |
| `apps-script.gs` | Saves website sign-ups into the Interest List Google Sheet |

- **Canva design (editable):** https://www.canva.com/d/g-cSkyL9W_XqpW4
- **The QR code goes to:** `https://kirkcaldydentist.co.uk/register/?src=leaflet`
  - The `?src=leaflet` part tags each sign-up as **leaflet** in the sheet's **Source** column. That lets you count how many sign-ups the leaflets bring in, separately from Facebook.
  - A different leaflet run (for example a second area) can use its own code: change it to `?src=leaflet-dysart` and so on.

## Setup (about 10 minutes, do this before printing)

### 1. Upload the website
Upload `kirkcaldy-dental-website.zip` to Hostinger and extract it into `public_html`, the same way as in `HANDOFF.md`, step 1. The zip now includes the `register/` folder.
Check that **https://kirkcaldydentist.co.uk/register/** loads.

### 2. Connect the form to the Google Sheet
1. Open the Interest List sheet: https://docs.google.com/spreadsheets/d/1YBtbcdnAKaPAr3MyNEJFKimbGt2bJ_AB9d-1jppuTDM/edit
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

## Printing
- **Size:** A5 (148 × 210 mm), double-sided, 4-colour.
- **Paper:** 150–170 gsm silk or matt for door drops; 300 gsm if you'll hand them out or leave them on a counter.
- **Bleed:** the PDF here is exactly A5 with no bleed. Most online printers (Instantprint, Solopress, Vistaprint) ask for 3 mm of bleed. For a bleed version, open the Canva design → **Share → Download → PDF Print**, tick **Crop marks and bleed**, then upload that file to the printer.
- **Proof:** order 1 proof or a small run first, and scan the printed QR code before ordering thousands.

## Wording rules (same as the ads)
Allowed: "New NHS dental practice opening in Kirkcaldy", "Register your interest", "Be the first to hear when we open".
NOT allowed: "taking on / registering NHS patients", "join the NHS waiting list", "limited places", "first come, first served". No NHS logo.
