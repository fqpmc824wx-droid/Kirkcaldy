# Banner – 180 × 60 cm

| File | What it is |
|---|---|
| `kirkcaldy-dental-banner-180x60cm.pdf` | Print file – exactly 1800 × 600 mm, single-sided |
| `banner-preview.jpg` | High-resolution preview (zoomable) |
| `qr-banner.svg` / `.png` | The banner's QR code on its own |

- **Design:** no photo – large vector logo on the left, headline + "Scan to Register" in the middle, big QR code on the right, gold swirls in the corners.
- **Canva design (editable):** "Kirkcaldy Dental – Banner 180x60cm" (design DAHaSWvNUik)
- **QR code goes to:** `https://kirkcaldydental.co.uk/register/?src=banner` – sign-ups from the banner show **Source = banner** in the Interest List sheet (the leaflet's show "leaflet"). The QR is ~31 cm square, so it scans from a few metres away.

## Ordering
1. Choose a **PVC banner, 180 × 60 cm** (e.g. 440–510 gsm PVC), single-sided.
2. Finishing: **hemmed edges + eyelets** (corners, or every ~50 cm) for cable ties/rope.
3. Upload `kirkcaldy-dental-banner-180x60cm.pdf`. It is already the finished size, so choose "use my artwork as is / fit to size". All text is kept ≥5 cm from the edges so hems and eyelets don't touch it.
4. If the printer insists on bleed: open the Canva design → Share → Download → **PDF Print** → tick **Crop marks and bleed**, and upload that instead.
5. Check the proof, and scan the QR on the proof with your phone before approving.

The register page must be live before the banner goes up (see `leaflet/README.md` steps 1–3 and HANDOFF.md step 0).

---

# Exterior sign banner – 160 × 60 cm (replaces the existing sign)

| File | Use |
|---|---|
| `kirkcaldy-dental-banner-160x60cm-PRINT-with-10mm-bleed.pdf` | **Send this to the printer.** 1620 × 620 mm = 160 × 60 cm + 10 mm bleed on every side |
| `kirkcaldy-dental-banner-160x60cm-finished-size.pdf` | Exactly 1600 × 600 mm, no bleed – only if the printer asks for "no bleed / finished size" |
| `banner-160x60-preview.jpg` | Preview |
| `source/` | Editable source (HTML + logo/QR SVG + fonts); `node render.js` rebuilds both PDFs |

- Fully vector: logo (SVG), text (Playfair Display headline + Inter, embedded) and QR code – sharp at any size.
- Layout: left 115 cm (logo, NEW NHS DENTAL PRACTICE / OPENING SOON!, gold strip BE FIRST IN LINE – JOIN OUR WAITING LIST); right 45 cm charcoal panel (SCAN TO JOIN OUR WAITING LIST + 28 cm QR on a white tile).
- Safe margin: all text/QR ≥ 40 mm inside the finished edge (clear of hems and eyelets).
- QR → `https://kirkcaldydental.co.uk/register/?src=banner` (the real register page; it must be live before the sign goes up).
- Ask the printer to confirm their bleed: this file has 10 mm, the most common requirement for PVC banners. If they want 3 mm or 5 mm, change `bleed` in `source/render.js` and rerun.
