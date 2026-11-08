# Kirkcaldy Dental & Implant Clinic: print review (180×60cm banner, A5 leaflet)

This covers the banner and both sides of the leaflet. It was checked against the Meta ads and the hard constraints.

## 1) Go / no-go

- **Banner: NO-GO for now.** Fix the URL and address lines (must-fix 4) and file the paperwork (1, plus 5 if the practice is mixed), then order. Hang it only after the phone test in must-fix 3 passes.
- **Leaflet: NO-GO for now.** Make the copy fixes (5, 6) and the should-fix edits in one re-export and file the paperwork (1, 2), then order. Deliver only after the phone test in must-fix 3 passes.

## 2) Must-fix before printing

1. **NHS claim and "Be first in line" need proof on file first (both items).** Before ordering, file two things:
   - NHS Fife's written confirmation of the listing/GDS approval at 23–25 Tolbooth Street.
   - The owner's signed priority rule (waiting-list sign-ups ahead of transfers).

   If both exist, the artwork does not change. If the priority rule is refused, change the strip to **JOIN OUR WAITING LIST** only, on both items and the ads:
   - **Banner:** set `#st1` to `Join our waiting list` and add `style="display:none"` to `#st2`. In `.striptext`, change `justify-content:flex-start; padding-top:6mm` to `justify-content:center; padding-top:0`.
   - **Leaflet:** set `#fs1` to `Join our waiting list` and add `style="display:none"` to `#fs2`.
2. **Photo paperwork (leaflet).** The mum-and-daughter photo is the same one used in Ad B. Before ordering, file the stock licence (or the AI tool's commercial-use terms) and a model release that covers health advertising, plus a child release if it is a real child. Never caption the photo as patients. The artwork does not change.
3. **Every scan and typed URL leads nowhere (both items). This blocks hanging and delivery, not the print order.** /b, /l, /register and /register/ all return the Squarespace "Coming Soon" parking page. The QR artwork is correct. This is for the website chat, not the leaflet chat:
   1. In Google Admin > Domains > DNS, point the @ A record to Hostinger's IP. Leave MX alone.
   2. Upload the website zip from `origin/claude/brave-allen-i14xnx` at 5ee5ba2 or later (it already has `b/` and `l/`), using the halfway deep-gold logo assets from `origin/claude/hostinger-plugin-install-eyvjb3`.
   3. Paste the Apps Script /exec URL into `register/index.html`. Make the page show an error, not the thank-you screen, whenever `ENDPOINT` does not start with `http`. As it stands, it would say "Thank you" and save nothing.
   4. On mobile data, scan both codes from the printed proof with one iPhone and one Android phone. Submit a test sign-up each time and confirm a sheet row with Source = banner or Source = leaflet.
4. **Banner: the URL and address collide, and both are too small** (this also covers the size should-fix). The "g" in "register" touches the "K" in "KY1".
   - **Cause:** `fit()` measures `el.scrollWidth` on a 500mm-wide block, which is never under 500mm. So every line in the right-hand panel is shrunk to 70%: the URL to 45.6pt and the address to 33.7pt.
   - **Edits to `banner/source/banner.html`:**
     - In `fit()`, replace `const w=el.scrollWidth/MM;` with `const rg=document.createRange(); rg.selectNodeContents(el); const w=rg.getBoundingClientRect().width/MM;`
     - In `layout()`, use `fit(url,360,24); fit(addr,360,15.5); fit(sc2,350,30.8);`
     - CSS: `.tile` top 178mm → **160mm**; `.qr` top 188mm → **170mm**; `.url` top 512mm → **490mm** and add `line-height:1`; `.addr` top 528mm → **526mm** and add `line-height:1`.
   - **Test render:**
     - The URL is 68pt (355mm wide) and the address 43.9pt (319mm).
     - There is an 11.7mm clear gap between them, and the baseline-to-baseline distance is 1.19× the URL size.
     - The address sits 11mm inside the gold frame, and "SCAN TO JOIN" is unchanged at 87pt.
   - **If must-fix 5 applies,** use this instead:
     - `.scan` top **64mm**, `fit(sc2,350,26.5)` (75pt), `.tile` **135mm**, `.qr` **145mm**, `.url` **465mm**, `.addr` **501mm**.
     - Add `<div class="abs mixed" id="mixed">NHS &amp; private dental care</div>`, styled like `.url` but with `top:calc(var(--b) + 525mm); font-size:13mm; line-height:1`. That gives 37pt white text, 14mm inside the frame.
   - Re-export both banner PDFs, check them at 400% zoom and decode the QR again.
5. **Say whether the practice is NHS, mixed or private (both items; GDC).** The ads carry this line; the print does not. First get the owner's written confirmation that the practice is mixed. Then:
   - **Leaflet back:** add `We’ll offer NHS and private dental care.` to `.bintro`, after the address sentence.
   - **Banner:** use the variant in must-fix 4.

   If the practice is wholly NHS, make no change.
6. **The family line has no object and can read as "taking on NHS patients of all ages" (leaflet back).** Take it out of `.bfoot` and give it its own line under the intro: `<div class="a x bfam">Adults, children and families can all join our waiting list</div>`, with `.bfam { top:calc(var(--b) + 94.5mm); font-weight:700; font-size:3.6mm; color:#6B5122; }`. Keep it only if the owner confirms NHS places for both adults and children. Otherwise delete it.

**Tested values for the leaflet re-export.** These cover must-fix 5 and 6, should-fix 2–5 and some nice-to-haves. They are rendered and checked: both QR codes decode to /l.

- **Front:**
  - `.fwhere` top **132mm**, colour `#6B5122`
  - `.fstrip` and `.fstriptext` top **139.5mm**
  - `.fcta` top **171.5mm**, width **88mm**; `.fcta .u` font-size **3.9mm** (11pt)
  - `.fqr` left **102.5mm**, top **169mm**, **33.5×33.5mm**; `.fqr img` left/top **1.85mm**
- **Back:**
  - `.blogo` top **11mm**; `.bhead` top **34mm**
  - `.bintro` left **13mm**, width **122mm**, top **59mm**, font-size **3.9mm**, line-height **1.42**
  - `.bfam` top **94.5mm**
  - `.steps` top **103mm**; `.step` width **41mm**
  - `.bqr` left **48mm**, top **125.5mm**, **52×52mm**; `.bqr img` left **6mm**, top **3mm**, **40×40mm**; `.lab` top **45.5mm**, colour `#6B5122`
  - `.bcontact` top **181mm**, font-size **3.9mm**
  - `.bfoot` top **189.5mm**, font-size **3.4mm**, line-height **1.5**
  - `.curve`: see should-fix 5
- **Result:**
  - Body text is 11pt and the footer 9.6pt.
  - The footer ends 10.8mm above trim, and the front QR card sits 7.5mm above trim.
  - Every QR has a white margin of at least 4 modules. The back code shrinks to 35mm (1.21mm modules), which is still well above the 20mm minimum.

## 3) Should-fix

1. **Send only fresh exports.** The PDFs in `/home/user/Dental/print-review` (18:48) are older than the 5ee5ba2 exports, which have exact sizes and TrimBoxes. Re-export from the branch sources after the fixes. Delete the 18:48 copies there and in Drive. Name the files `-PRINT-3mm-bleed-vN` / `-PRINT-10mm-bleed-vN` / `-NO-BLEED-proof-only`.
2. **Remove the untimed "30 seconds" claim** (the ads review rejected it, CAP 3.7):
   - Front `.fcta .t`: `Scan the code<br><i>it’s free &amp; quick to join</i>`
   - Back `#b30`: `it’s free &amp; quick` (the flourishes reposition automatically)

   Or time 5 non-staff on their own phones and keep the record.
3. **Make "what happens next" match the system and manage expectations.**
   - Replace `.bintro` with: `<b>Kirkcaldy Dental &amp; Implant Clinic</b> is a new NHS dental practice opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. [mixed line, must-fix 5] Joining our waiting list is free and there’s no obligation. We’ll text to confirm, and a member of our team will call you (8am–9pm). Joining doesn’t guarantee a place on our patient list.`
   - Step 3: `We’ll text to confirm<br>and give you a call`
4. **Bigger small type:**
   - Front URL line: `.fcta .u` 3.25mm → **3.9mm** (11pt).
   - Back URL: `.bcontact` 3.4mm → **3.9mm**.
   - Footer: `.bfoot` 2.85mm → **3.4mm**, on two lines: `23–25 Tolbooth Street, Kirkcaldy KY1 1RW<br>info@kirkcaldydental.co.uk`.
5. **The gold arc crosses ".co.uk" in the no-bleed export and in leaflet-preview.jpg.** The SVG spans the whole page including bleed, so it squashes differently in each export. Anchor it to the trim instead:
   - `.curve { left:calc(var(--b) - 3mm); top:calc(var(--b) - 3mm); width:154mm; height:216mm; }`
   - `viewBox="-3 -3 154 216"`

   With this, the arcs are identical in both exports and more than 10mm clear of text. Re-export both PDFs and the preview.
6. **Colour.** Both PDFs are RGB only. Order a hard proof of both items, from one printer if possible, and compare it with the ad screenshots. Watch the deep gold on PVC and uncoated stock, and the cream tint. If Acrobat Pro or Affinity is available, convert to CMYK PDF/X-4 (FOGRA39 for coated leaflets).
7. **Banner material.** Solid (non-mesh) frontlit PVC, 440–510gsm, matt or satin, hemmed, with eyelets about every 50cm. Mesh punches holes in the QR and gloss creates glare.
8. **Website consent and privacy (website chat, before distribution).**
   - Replace the required "I'm happy to be contacted…" box with the runbook §1.7 notice plus an optional, unticked marketing box.
   - Deploy only the leaflet branch's `privacy.html`. Origin/main and the hostinger branch still have `info@kirkcaldydentist.co.uk`.
   - Check that every email on the live /privacy.html is @kirkcaldydental.co.uk.
9. **Landing-page logo.** The website zip's `assets/logo-horizontal.svg` is the superseded logo (#C3A363, D dropped about 35%). Use the halfway deep-gold assets from the hostinger branch and confirm /register/ shows them on cream #F6F2EA. Replace `brand/logo/*` and `kirkcaldy-dental-logo-pack.zip` with the halfway versions.

## 4) Nice-to-have

- **Front QR card:** the 33.5mm card with a 1.85mm inset (in the tested values) gives a 4-module white margin and also removes the white nicks in the corners.
- **Back QR caption:** sits 4 modules below the code in the tested layout (it was 3).
- **Banner QR margin:** leave it at 3 modules. There is no room to enlarge the tile once the URL grows, and it decodes cleanly.
- **Optional:** regenerate both QRs at error-correction level Q (same URLs, still 29×29), then re-test.
- **Numerals:** add `font-variant-numeric:lining-nums` to `.step .n` (done in the test render) and to any Playfair figures that remain.
- **Gold text under 14pt** in `#6B5122` (6.7:1): `.fwhere`, `.lab` and `.bfam` are done in the tested values. Keep `#8A6A2C` for headlines and the strip.
- **Flourishes:** add the small second diamond (about 55% size, like `.dia.o` on the banner) to the leaflet flourishes.
- **Owner's call:**
  - A no-smartphone route: "No smartphone? Email info@kirkcaldydental.co.uk with your name, phone and postcode" (10–11pt), logged as Source = email. Step 1 could read `Scan the code or<br>visit our website` (this fits in the tested layout).
  - A /join or /waitinglist redirect instead of the printed "/register". Change the print and the ads together.
  - "We're aiming to open in [Month]", only if the month is known.
- **If converting to CMYK:** QR modules to 100K, and text under 12pt to black-only.
- **Installer note:** top edge at about 1.9–2.0m where the railings allow, every eyelet tensioned, cable ties or bungees only. Confirm the railings belong to 23–25 Tolbooth Street. If they are on the public footway, or the setting is listed or in a conservation area, check with Fife Council.

## 5) What's good (keep)

- **Wording:** compliant everywhere. Only approved phrases; nothing about accepting, taking on or registering patients; no scarcity claims; no NHS logo; no phone number or Dentally placeholder. The full address is on the banner and on both leaflet sides, and the email is correct.
- **Match with the ads:** headline, gold strip, URL, palette (#F6F2EA, #8A6A2C, #30363B, #B8964F, #D9BD82), fonts and the halfway all-gold logo (#8E6B2E, D drop about 4.5%) all match.
- **Banner at distance:** the headline, "Opening Soon!" and "BE FIRST IN LINE" have 58–61mm letters and read from about 20–24m. It passes the 3-second test. The 264mm QR scans from up to about 3.5m.
- **Production:**
  - The bleed is a true extension, not a rescale.
  - Fonts are embedded.
  - The banner is fully vector and the leaflet photo is 322ppi.
  - Eyelet and hem clearances are 45mm or more.
  - Contrast is at least 4.5:1 everywhere.
  - All QR codes decode to the right short links: /b on the banner, /l on the leaflet.

---

I test-rendered every change above. The edits are saved as patches against `origin/claude/brave-allen-i14xnx` (they apply cleanly):
- `print-review/patches/banner-A-no-mixed-line.patch` (banner, no NHS & private line)
- `print-review/patches/banner-B-with-nhs-private-line.patch` (banner, with the line)
- `print-review/patches/leaflet.patch`

The leaflet patch includes the mixed-practice sentence and the family line. Remove either if the owner does not confirm it.

**Git side effect in `/home/user/Dental`:** while checking that the patches apply, I briefly changed that repo's git index and then reset it to HEAD. No files on disk changed. Anything that had been staged there is now unstaged; `BROWSER-CLAUDE-LAUNCH.md`, `HANDOFF.md` and `leads/README.md` show as modified but unstaged.