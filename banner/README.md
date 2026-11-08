# Banner – 180 × 60 cm (exterior sign)


| File | Use |
|---|---|
| `kirkcaldy-dental-banner-180x60cm-PRINT-with-10mm-bleed.pdf` | **Send this to the printer.** 1820 × 620 mm = 180 × 60 cm + 10 mm bleed on every side |
| `kirkcaldy-dental-banner-180x60cm-finished-size.pdf` | Exactly 1800 × 600 mm, no bleed – only if the printer asks for "no bleed / finished size" |
| `banner-180x60-preview.jpg` | Preview |
| `source/` | Editable source (HTML + logo/QR SVG + fonts); `node render.js` rebuilds both PDFs |

- Fully vector: logo (SVG), text (Cinzel headline + Inter, embedded) and QR code – sharp at any size.
- Layout: left 130 cm (logo, NEW NHS DENTAL PRACTICE / OPENING SOON!, gold strip BE FIRST IN LINE – JOIN OUR WAITING LIST); right 50 cm charcoal panel (SCAN TO JOIN OUR WAITING LIST + 28 cm QR on a white tile).
- Safe margin: all text/QR ≥ 40 mm inside the finished edge (clear of hems and eyelets).
- QR → `https://kirkcaldydental.co.uk/register/?src=banner` (the real register page; it must be live before the sign goes up).
- Ask the printer to confirm their bleed: this file has 10 mm, the most common requirement for PVC banners. If they want 3 mm or 5 mm, change `bleed` in `source/render.js` and rerun.
