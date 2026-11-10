[
 {
  "item": "both",
  "issue": "Scanning either QR code, or typing the printed URL, lands on a Squarespace 'under construction' page with no sign-up form. The /b and /l redirects to /register/?src=\u2026 do not exist yet, so scans dead-end and the src tracking is lost.",
  "evidence": "QR codes checked on fresh renders: banner decodes to https://kirkcaldydental.co.uk/b, both leaflet codes to https://kirkcaldydental.co.uk/l. curl on 2026-11-08: /b, /l, /register and /register/ all return HTTP 200 with no redirect, the same 3,007-byte page (md5 1227bd08) titled 'Coming Soon', text 'We're under construction. Please check back for an update soon.', served from Squarespace's parking page. A made-up path (/zz-nonexistent-test) returns the identical page, so the whole site is parked. DNS: A records point to Squarespace; MX is smtp.google.com, so mail for the domain works.",
  "severity": "must-fix-before-print",
  "fix": "Follow the runbook rather than Squarespace URL Mappings. (1) In Google Admin > Domains > DNS, point the A record for @ to Hostinger's IP and leave MX alone. (2) Upload the website zip from origin/claude/brave-allen-i14xnx at 5ee5ba2 or later, which already holds b/ and l/, with the halfway logo assets from the hostinger branch (see #53). (3) Paste the Apps Script /exec URL into register/index.html. Ask the website chat to show an error, not the thank-you screen, whenever ENDPOINT does not start with http. (4) On mobile data, scan both codes from the printed proof on one iPhone and one Android phone, submit a test sign-up, and confirm a sheet row with Source = banner or Source = leaflet. The print job can go ahead now. Hang the banner and deliver leaflets only after step 4 passes.",
  "lens": "prepress",
  "why": "Confirmed today: curl -L of /b, /l, /register, /register/ and a made-up path all return 200, 0 redirects, the same 3,007-byte 'Coming Soon' page. Both QR images decode correctly (/b and /l, EC level M, 29x29), so the artwork is fine and the destination is the problem. The suggested fix is wrong, though. The site is meant to run on Hostinger (HANDOFF Step 1, CREATIVE-REVIEW stage 1), not as a published Squarespace site. The /b and /l forwards already exist as b/index.html and l/index.html in the website zip on origin/claude/brave-allen-i14xnx (commit 5ee5ba2). That branch's register/index.html still has ENDPOINT = \"PASTE_APPS_SCRIPT_URL_HERE\", and its no-cors fetch(...).then(show thanks) would show 'Thank you' while saving nothing. Strictly, this blocks hanging the banner and handing out leaflets, not the print order. It is still the top blocker. Merged with #11, #24 and #40."
 },
 {
  "item": "leaflet-front",
  "issue": "The white margin (quiet zone) around the front QR is under the 4 modules the QR standard asks for, and it is closed in by a mid-tone gold border, which makes it harder to scan in poor light or on older phone cameras.",
  "evidence": "Measured on a 300dpi render of the bleed PDF: QR is 29\u00d729 modules (version 3), symbol 25.3mm (above the 20mm minimum), module 0.873mm. White box 29.8\u00d729.8mm, so the quiet zone is 2.2\u20132.5mm, about 2.5 modules; 4 modules would be 3.5mm. Outside the white is a roughly 0.7mm gold #B8964F line, which reads as mid-grey to a scanner. For comparison, the back QR is 43.8mm with a 4.04-module quiet zone. The front code decoded with OpenCV on a clean render, so this is a margin issue, not a failure.",
  "severity": "nice-to-have",
  "fix": "While re-exporting for other fixes, enlarge the white card to about 32.5mm (3.5mm padding) or shrink the symbol to about 23.5mm in the current card. Combine this with #2 and #7.",
  "lens": "prepress",
  "why": "Measured at 600dpi: symbol 25.2mm, module 0.87mm, white margin 2.3mm left and right (about 2.6 modules), then a #B8964F border (2.79:1 on white, so it reads as dark to a scanner). It is below the ISO 4-module spec. My stress test (60\u2013150dpi, blur, 45\u2013100% brightness, noise, 144 trials) decoded 67/144 as printed and 64/144 with a simulated 4-module white margin. The margin makes no measurable difference, because resolution and blur are what limit scanning. Downgraded."
 },
 {
  "item": "leaflet-front",
  "issue": "The QR frame sits too close to the bottom trim: it breaks the 8mm safe margin in the brief and looks unbalanced against the right-hand margin.",
  "evidence": "Trim-relative measurements: the gold frame's outer edge is 4.47mm above the bottom trim, the white box 5.1mm, the QR symbol about 7.7mm. The same frame is 12.06mm from the right trim, and the 'Scan the code / or visit\u2026' text block is 14.3mm from the bottom trim. A \u00b11\u20131.5mm guillotine drift on A5 could leave the frame about 3mm from the edge. Nothing would be cut off, but it would look off.",
  "severity": "nice-to-have",
  "fix": "If the card is enlarged, move the address line, the gold strip and the QR row up 3\u20134mm, using some of the gap below 'Opening Soon!', so the frame sits about 8mm above trim.",
  "lens": "prepress",
  "why": "Measured: the gold frame's outer edge is about 4.7\u20135.0mm above the bottom trim and about 12mm from the right trim. That is inside printers' usual 3\u20135mm safe zone, so nothing gets cut. The '8mm safe margin' rule does not appear in BRAND.md, HANDOFF, the runbook or the source. The imbalance is visible but cosmetic. Moving the row up only becomes necessary if the white card is enlarged for #1."
 },
 {
  "item": "banner",
  "issue": "The web address and the full street address are the smallest elements on the banner. They can only be read from about 2\u20133m and are unreadable at street distance. Passers-by who won't scan have no usable fallback, and the address (a prominent line in the ads) is effectively a footnote.",
  "evidence": "From the PDF text matrix: URL 'kirkcaldydental.co.uk/register' is Inter Bold 45.6pt (cap height about 11.7mm, 238mm wide). Address '23\u201325 Tolbooth Street, Kirkcaldy KY1 1RW' is Inter Bold 33.7pt (cap height about 8.6mm) in light gold #D9BD82 on charcoal. By comparison, 'SCAN TO JOIN' is 87pt and the headline 237pt. In banner-print-small-1.png (the roughly 20m view) both lines are an illegible smudge. The inner width of the gold frame is about 410mm, so the URL could be about 70pt and still fit.",
  "severity": "should-fix",
  "fix": "Do this in the same edit as #52. Set the URL at about 68\u201372pt Inter Bold (about 350\u2013370mm wide, which fits the roughly 410mm frame). Set the address at 42pt or more, or move it into the cream area under 'Opening Soon!' as an uppercase kicker ('23\u201325 TOLBOOTH STREET \u00b7 KIRKCALDY KY1 1RW', 60pt or more, #6B5122 as in the ads). To make room, move the QR tile up about 20mm or trim 'SCAN TO JOIN' to about 75pt. Keep at least a 3\u20134-module white margin around the QR.",
  "lens": "prepress",
  "why": "Confirmed from the PDF. The URL is Inter Bold 45.63pt (cap height 11.7mm) and the address 33.73pt in #D9BD82 (cap height 8.65mm), against 237pt for the headline. In banner-print-small-1.png the headline and strip read clearly, while the URL and address are an illegible smudge. The URL is the only route in for passers-by who won't scan. The address does appear, so the hard constraint is met, but only as a footnote. Merged with #12, #28 and #44."
 },
 {
  "item": "both",
  "issue": "Both PDFs are RGB only (no CMYK, no output intent, not PDF/X). Every printer will convert the colours its own way, so the brand golds will shift, and the banner (large-format inkjet on PVC), the leaflet (litho/digital) and the Meta ads will not match each other.",
  "evidence": "Content streams use only DeviceRGB rg/RG operators: #8A6A2C, #8E6B2E, #B8964F, #D9BD82, #F6F2EA, #30363B, #262B30, #4A5056, #2F2F2F. The photo is RGB with an embedded 536-byte display (mntr) ICC profile. The catalog has no /OutputIntents. Producer is Skia/PDF (Chromium). Instantprint, Solopress and Vistaprint all accept RGB but convert it at the RIP and warn of colour shift. The deep gold #8A6A2C typically prints duller and browner, especially on uncoated stock and solvent/latex PVC.",
  "severity": "should-fix",
  "fix": "On the print order, request a printed or hard proof (or the printer's colour-check option) for both items, ideally from one printer, and compare it against the ad screenshots. If Acrobat Pro or Affinity is available, convert to CMYK PDF/X-4 (FOGRA39 for coated leaflets) and check the deep-gold and cream builds.",
  "lens": "prepress",
  "why": "Confirmed: there are no CMYK operators, about 94 rg/RG operators on the leaflet and 42 on the banner, and no /OutputIntents. The brand colours are all inside the CMYK gamut, so converting them is not a disaster. The real risks are a muddy deep gold on PVC and uncoated stock, and the cream #F6F2EA becoming a 2\u20138% tint that can print near-white or blotchy. That would break the match between the banner, the leaflet and the ads. A hard proof is the practical safeguard. Full PDF/X conversion is optional if the tools are available."
 },
 {
  "item": "both",
  "issue": "The neutral greys used for small text and for the QR modules will be converted to four-ink mixes rather than black ink alone. If the printing plates line up slightly off, 8\u201310pt text and the 0.87mm QR squares get soft, coloured edges.",
  "evidence": "Body text on the leaflet back is #4A5056 at 8.08\u201310.06pt. Headings and step labels are #262B30 at 9.35pt. All QR modules are #2F2F2F, not black. RGB greys come out of ICC conversion as full four-colour mixes, e.g. #2F2F2F \u2248 C70 M62 Y60 K65. Neither PDF sets any overprint (no /OP in ExtGState). The back page also has a live 70%-opacity element (ExtGState ca 0.7) on the thin gold curve, about 0.2mm wide.",
  "severity": "nice-to-have",
  "fix": "If converting to CMYK for #4, map the QR modules to 100K and text under 12pt to black-only tints in the same step. Otherwise no action.",
  "lens": "prepress",
  "why": "Confirmed: QR modules are #2F2F2F (425 paths per page), small text is #4A5056 or #262B30, and there is no overprint. On modern digital presses, the likely route for short-run A5 and PVC, registration does not soften 0.87mm modules or 9\u201310pt text. It matters only for litho runs. One detail is overstated: the 70%-opacity curve is 0.85pt (0.3mm), not 0.2mm, and single-object transparency is routine for current RIPs."
 },
 {
  "item": "leaflet-front",
  "issue": "Tiny white nicks appear in all four corners of the gold frame around the front QR, where the white fill's corner pokes into the gold border.",
  "evidence": "At 1200dpi, each inner corner of the 0.7mm gold border has a square white notch of about 0.4mm, where the white fill's corner radius is smaller than the border's inner radius. Faintly visible in the 150dpi render. The back-page QR frame corners are clean.",
  "severity": "nice-to-have",
  "fix": "Give the white fill a radius equal to the outer radius minus the border width (or use border plus background-clip:padding-box) when re-exporting for #1 and #2.",
  "lens": "prepress",
  "why": "Confirmed at 600dpi: square white notches about 0.3\u20130.4mm where the white fill's corner pokes into the rounded gold border (top-left, top-right and bottom-right are visible). The back QR card is clean. It is barely visible at reading distance. Merged with #38 and #50."
 },
 {
  "item": "banner",
  "issue": "The banner QR's white margin is 3 modules rather than the standard 4, and it is surrounded by charcoal.",
  "evidence": "Symbol 264mm, 29 modules of 9.09mm, white box 319.4mm, so the quiet zone is 27.5mm (3.0 modules), then charcoal #30363B. Decoded fine with OpenCV, and the module size easily supports scanning from 1\u20133m and beyond.",
  "severity": "nice-to-have",
  "fix": "During the #3/#52 rework, enlarge the tile to about 336mm, or keep at least 3\u20134 modules of white around any resized symbol.",
  "lens": "prepress",
  "why": "Confirmed: symbol about 264mm (29 modules of about 9.1mm), 320mm white tile, about 28mm (3.1 modules) of white, then charcoal. It is below the 4-module spec, but 3 modules is ample for phone decoders and it decodes cleanly. Merged with #13."
 },
 {
  "item": "both",
  "issue": "File names don't show which files are for screen and which are for print, and don't carry a version or colour mode. The no-bleed leaflet could be uploaded by mistake.",
  "evidence": "'kirkcaldy-dental-leaflet-A5.pdf' (no bleed, 420\u00d7595.92pt) sits next to the print file, and its name gives no hint that it lacks bleed. None of the four PDFs states a version, date or RGB/CMYK.",
  "severity": "nice-to-have",
  "fix": "On the next re-export, name the files with -PRINT-3mm-bleed-vN / -NO-BLEED-proof-only, and delete superseded copies from print-review and Drive.",
  "lens": "prepress",
  "why": "True: 'kirkcaldy-dental-leaflet-A5.pdf' (no bleed) sits next to the print file with nothing to tell them apart, and no file shows a version. #45 shows the version confusion has already happened."
 },
 {
  "item": "banner",
  "issue": "The material and finish aren't specified. Glossy or mesh PVC would cut contrast and could stop the QR scanning in sun or rain.",
  "evidence": "The contrast ratios are fine when dry: charcoal on cream 12.8:1, gold #8A6A2C on cream 4.5:1, white on gold 5.0:1, cream on gold 4.55:1, light gold #D9BD82 on charcoal 6.7:1. With a 15% veil of glare, as from a wet gloss surface or low sun, the gold pairs drop to about 3.0-3.3:1. A specular hotspot on the white tile would wipe out modules. Mesh banners punch holes through 9mm modules and lower their contrast.",
  "severity": "should-fix",
  "fix": "Order solid (non-mesh) frontlit PVC, 440\u2013510gsm, matt or satin, hemmed with eyelets every 50cm or so. Use more fixings rather than mesh if wind is a worry.",
  "lens": "distance",
  "why": "Valid print-order point. Mesh PVC punches holes through QR modules, and a gloss finish produces glare hotspots on the white tile. Both would undermine the main call to action. Nothing in the files or docs specifies the material. The fix costs nothing."
 },
 {
  "item": "leaflet-back",
  "issue": "In the no-bleed A5 PDF and in leaflet-preview.jpg, the thin gold arc runs through the email address. In the bleed PDF it clears the text by only about 2.5mm.",
  "evidence": "kirkcaldy-dental-leaflet-A5.pdf page 2 rendered at 600dpi: the lighter arc crosses '.co.uk' in 'info@kirkcaldydental.co.uk' (footer line y\u2248203-206mm). The same overlap shows at the bottom right of leaflet-preview.jpg. In the 3mm-bleed print PDF the arc passes about 2.5mm to the right of 'co.uk' (text ends at x\u2248125.3mm, arc at about 127.7mm). The arcs are evidently positioned from the page edge, so they move 3mm between the two exports.",
  "severity": "should-fix",
  "fix": "Put the footer on two lines (address, then email), which also enables #17, and/or position the arcs from the trim edge with at least 5mm clearance. Re-export both PDFs and the preview.",
  "lens": "distance",
  "why": "Confirmed by rendering page 2 of each export at 360dpi. In kirkcaldy-dental-leaflet-A5.pdf (no bleed), in both the old and the 5ee5ba2 versions, the light-gold arc crosses the 'k' of '.co.uk'. In the 3mm-bleed print file it clears the email by only about 3mm. The arcs are positioned from the page edge, so they shift 3mm between exports. The overlapping version is also the one people see in the preview. Merged with #39."
 },
 {
  "item": "leaflet-front",
  "issue": "At arm's length the typed-URL fallback and the footer are small for a broad-age NHS audience.",
  "evidence": "Front: 'or visit kirkcaldydental.co.uk/register' is 9.21pt Inter (x-height about 1.8mm). Back: body copy 10.06pt, step labels 9.35pt, URL 9.64pt, and the footer address, email and 'Adults, children and families can all join' are 8.08pt (x-height about 1.56mm). RNIB clear-print guidance recommends at least 12pt. The contrast itself is fine: body grey #4A5056 on cream is 7.3:1 and gold on cream is 4.5:1.",
  "severity": "should-fix",
  "fix": "Front: set the URL line at 11\u201312pt. Back: set the URL at 11pt and the footer at 9.5\u201310pt or more on two lines (address / email), which also fixes #16. Keep the body at 10\u201311pt.",
  "lens": "distance",
  "why": "Confirmed by PyMuPDF. On the front, 'or visit kirkcaldydental.co.uk/register' is 9.21pt. On the back, the footer address and email (the only non-scan contact) and the family line are 8.08pt, in grey #4A5056 or gold, and the URL is 9.64pt. That is small for a door-drop to a broad-age NHS audience (RNIB recommends at least 12pt). There is space: about 14mm free below the front URL, and about 10mm above the back footer. Merged with #27 and #43."
 },
 {
  "item": "banner",
  "issue": "Mounting height and tension decide whether people can actually scan it.",
  "evidence": "The QR centre is 338mm below the top edge of the finished banner (tile y 178-497.5mm). Phone simulation (1080p preview, about 54\u00b0 field of view, slight blur and noise): OpenCV decodes up to 3.0m straight on; WeChat/zxing up to 4m (also one hit at 5m); at 35\u00b0 off-axis about 3.5m. Beyond about 4.5m it fails without zoom. If the banner is cable-tied with its top at a typical 1.1m railing height, the QR centre sits about 0.76m off the ground.",
  "severity": "nice-to-have",
  "fix": "Give the installer a note: top edge at about 1.9\u20132.0m where the railings allow, and every eyelet tensioned so the QR panel is flat.",
  "lens": "distance",
  "why": "Sensible installation guidance: ripples and a very low QR centre are common scan failures. It is not an artwork defect."
 },
 {
  "item": "banner",
  "issue": "The QR codes use error-correction level M when level Q fits in the same 29x29 grid.",
  "evidence": "Format bits read from qr-banner.png and qr-leaflet.png (both copies agree): level M, mask 5, version 3. The URL 'https://kirkcaldydental.co.uk/b' is 31 bytes. Version 3 holds 42 bytes at M and 32 at Q, so Q needs no bigger grid and no smaller modules.",
  "severity": "nice-to-have",
  "fix": "Optional: regenerate both codes at level Q with the same URLs, check they are still 29x29, and re-test the scan.",
  "lens": "distance",
  "why": "Verified from the format bits of qr-banner.png and qr-leaflet.png: EC level M, mask 5, 29x29 (version 3). The URLs are 31 bytes, and V3-Q holds 32 bytes, so Q fits without a bigger grid. It is a small robustness gain outdoors, and the current codes decode fine."
 },
 {
  "item": "leaflet-front",
  "issue": "Playfair's old-style numerals make '30' look like '3o' in 'to join in 30 seconds', and on the back the step numbers sit at uneven heights.",
  "evidence": "In the 600dpi crop of the front CTA, the '3' drops below the line and the '0' is x-height, so it reads like a lowercase 'o'. The back headline 'in 30 seconds' (26pt) and the step circles 1/2/3 (14.2pt Playfair Black) do the same: the '3' sits lower than the '1' and '2'.",
  "severity": "nice-to-have",
  "fix": "Add font-variant-numeric: lining-nums to Playfair numerals in leaflet.html and re-export.",
  "lens": "distance",
  "why": "Visible in the renders: Playfair's old-style figures make '30' read like '3o' on the front and the back headline, and the step-circle '3' sits lower than the '1' and '2'. If #30 removes '30 seconds', only the step numbers are left. Merged with #58."
 },
 {
  "item": "leaflet-back",
  "issue": "The 'SCAN WITH YOUR PHONE' caption sits slightly inside the QR quiet zone, and the email address hasn't been confirmed.",
  "evidence": "The code is 43.7mm with 1.506mm modules. The gap from the bottom of the code (y=166.6mm) to the top of the caption is 4.5mm, which is 3.0 modules. The other sides are 3.4-4.1 modules. It decoded from 10cm to 60cm in simulation. The domain's MX record is smtp.google.com (Google Workspace), so it takes mail, but the info@ mailbox itself could not be checked.",
  "severity": "nice-to-have",
  "fix": "Optional: move 'SCAN WITH YOUR PHONE' down about 1.5mm in the re-export.",
  "lens": "distance",
  "why": "The measurement holds: the caption is about 3 modules below the back code. The back code is 43.7mm with 1.5mm modules and decodes easily, so this is marginal. The email point is already settled: HANDOFF says info@ is a working Google Workspace mailbox."
 },
 {
  "item": "both",
  "issue": "Print is permanent, so the launch gates in the ads review apply even more strongly here. 'NEW NHS DENTAL PRACTICE' needs written proof on file before it is published. 'BE FIRST IN LINE' needs the owner's signed priority rule.",
  "evidence": "ads/CREATIVE-REVIEW.md, change 2: NHS Fife written confirmation of the listing/GDS approval at 23\u201325 Tolbooth Street is a hard gate (CAP 3.7). If the owner won't commit to waiting-list priority over transfers of the ~2,445 KY1/KY2 patients at the other practices, 'stop using \"Be first in line\", on the image too'. Both phrases are printed at 59 mm cap height on the banner and 35\u201339 pt on the leaflet. They can't be pulled after printing the way an ad can be paused.",
  "severity": "must-fix-before-print",
  "fix": "Before ordering print, file the NHS Fife written confirmation for 23\u201325 Tolbooth Street and the owner-signed priority rule. If both exist, the artwork needs no change. If the priority rule is refused, change the strip to 'JOIN OUR WAITING LIST' only, on both items.",
  "lens": "resident",
  "why": "Confirmed in ads/CREATIVE-REVIEW.md stage-1 launch gates. NHS Fife written confirmation is a hard gate (CAP 3.7: hold proof before publishing 'NEW NHS DENTAL PRACTICE'). If the owner won't sign the priority rule, 'stop using \"Be first in line\", on the image too'. Both phrases are printed large on the banner and leaflet and can't be paused like an ad. #42's NHS-evidence point is merged here."
 },
 {
  "item": "leaflet-back",
  "issue": "There is no visible way to sign up without a smartphone or internet. The 70-year-old persona sees 'Scan the QR code' as step 1, a 9\u201310 pt URL, and the email address only in the 8 pt grey footer. No phone number exists yet, which is correct.",
  "evidence": "pdftotext -bbox: the back footer '23\u201325 Tolbooth Street, Kirkcaldy KY1 1RW \u00b7 info@kirkcaldydental.co.uk' has a 9.8 pt line box, about 8.1 pt Inter, grey on cream, at y 199.6\u2013203.1 mm. The front has no email at all. Step 1 reads 'Scan the QR code'. The info@ mailbox is a working Google Workspace account (HANDOFF.md).",
  "severity": "nice-to-have",
  "fix": "If the owner wants it, add on the back: 'No smartphone? Email info@kirkcaldydental.co.uk with your name, phone and postcode' (10\u201311pt). Change step 1 to 'Scan the QR code or visit our website'. Log email sign-ups with Source = email.",
  "lens": "resident",
  "why": "The email appears only in the 8pt back footer, and step 1 is 'Scan the QR code'. The typed URL still works from any computer or tablet, though, and the email is printed. Adding an email sign-up route also adds manual handling and consent capture. This is a worthwhile improvement and owner's call rather than a defect. Size is handled by #17."
 },
 {
  "item": "both",
  "issue": "'kirkcaldydental.co.uk/register' is the one place 'register' appears on an NHS piece. Residents read it as 'register with this NHS practice', which is exactly the implication the brief bans. This is the last cheap moment to change it.",
  "evidence": "pdftotext shows the URL '/register' on the banner and twice on the leaflet. ads/CREATIVE-REVIEW.md item 11 already proposes /waitinglist with a redirect, but it only swaps the ads because it assumed print was done. The QR codes point at /b and /l, so they don't depend on the visible path.",
  "severity": "nice-to-have",
  "fix": "Owner decision. If wanted, have the website chat add /join (or /waitinglist) as a 301 to /register/?src=print, check it is live, and use it on print and the next ad re-render together.",
  "lens": "resident",
  "why": "'/register' is printed three times next to 'NEW NHS DENTAL PRACTICE', which brushes against the 'registering NHS patients' ban. But BRAND.md lists /register as the approved URL, and the ads print the same URL, so changing it on print alone breaks the match. CREATIVE-REVIEW item 11 already plans /waitinglist via redirect. This is an owner decision, not a defect. Merged with #49."
 },
 {
  "item": "leaflet-front",
  "issue": "'to join in 30 seconds' (front) and 'Join our waiting list in 30 seconds' (back headline) are untimed claims that the ads team has rejected. The form has about 7 fields plus a consent notice, which is unlikely to take 30 seconds for an older resident.",
  "evidence": "pdftotext shows the front line 'to join in 30 seconds' (about 18 pt Playfair italic) and the back headline 'in 30 seconds' (about 26 pt). ads/CREATIVE-REVIEW.md line 348: '\"30 seconds\" or \"only takes a minute\" as untimed claims: Rejected until both forms are timed. Say \"quick to join\" until then.' The sheet columns show the form asks for Name, Phone, Email, Postcode, No. of People, Currently Registered? and Adult/Child/Family.",
  "severity": "should-fix",
  "fix": "Use 'Scan the code / it's free & quick to join' on the front and 'Join our waiting list / it's free & quick' on the back. Or time 5 non-staff on their own phones, keep the record, and set lining numerals (#21).",
  "lens": "resident",
  "why": "Confirmed: front 'to join in 30 seconds' (18.14pt) and back headline 'in 30 seconds' (26.08pt). CREATIVE-REVIEW line 348 rejects '30 seconds' as untimed (CAP 3.7), and the form has 7 questions plus consent. Unlike an ad, print can't be edited later. Merged with #41 and #59."
 },
 {
  "item": "leaflet-back",
  "issue": "The 'what happens next' text doesn't match what actually happens, and it doesn't manage expectations. The leaflet says 'we'll let you know as soon as we open'. In fact the system texts straight away and a team member phones within minutes (8am\u20139pm). An older resident may ignore or distrust an unexpected call. The mum may also read 'Be first in line' as guaranteed registration, and nothing says joining is free or carries no guarantee.",
  "evidence": "Back body text (10 pt): 'Join our waiting list and we'll let you know as soon as we open.' Step 3: 'You're on the list'. In the runbook, the thank-you text reads 'A friendly member of our team will call you very soon', and the form disclosure says 'We'll text and call you about your request, 8am\u20139pm'. The ads' Instant Form intro adds: 'it's free to join, there's no obligation\u2026 Joining the waiting list doesn't guarantee an appointment or a place on our patient list.'",
  "severity": "should-fix",
  "fix": "Change step 3 to 'We'll text to confirm and give you a call'. Change the body to '\u2026Join our waiting list \u2013 it's free and there's no obligation. We'll text to confirm and a member of our team will call you (8am\u20139pm). Joining doesn't guarantee a place on our patient list.' (11pt; the steps move down slightly).",
  "lens": "resident",
  "why": "Confirmed. The leaflet says 'we'll let you know as soon as we open'. In fact the system sends a thank-you text straight away and a caller rings 'within minutes' between 8am and 9pm (HANDOFF line 87, runbook line 183). The ads' form intro carries 'free, no obligation\u2026 doesn't guarantee an appointment or a place on our patient list', which the leaflet lacks next to 'Be first in line'. That matters under the 'no guaranteed registration' constraint."
 },
 {
  "item": "leaflet-back",
  "issue": "There's no mixed-practice line. For a resident, 'Dental & Implant Clinic' next to 'NHS' raises the question 'is this really NHS, or a private clinic?' The ads now carry 'We'll offer NHS and private dental care' as a GDC-required line. The leaflet and banner don't.",
  "evidence": "No 'private' anywhere in pdftotext of either PDF. ads/CREATIVE-REVIEW.md lines 28 and 217 say the mixed-practice line is in every ad's primary text and its link description reads 'NHS & private dental care \u00b7 23\u201325 Tolbooth Street\u2026'. This depends on the owner confirming the practice is mixed (change 2).",
  "severity": "must-fix-before-print",
  "fix": "Get the owner's written confirmation that the practice is mixed. Then add 'NHS & private dental care' to the leaflet back (10pt, above the footer, or in the body), and ideally under the URL on the banner. If the practice is wholly NHS, no change.",
  "lens": "resident",
  "why": "Confirmed: 'private' appears in neither PDF. CREATIVE-REVIEW treats the mixed-practice line as GDC-required (GDC advertising guidance: publicity must say whether the practice is NHS, mixed or private) and puts it in every ad, including the Instant Form intro 'also offering private treatments'. Owner confirmation of mixed status is a stage-1 gate. A 'Dental & Implant Clinic' leaflet that says only 'NHS' is permanent publicity missing it. #42 is merged here."
 },
 {
  "item": "leaflet-back",
  "issue": "The family line 'Adults, children and families can all join' doesn't say what they can join. Next to 'new NHS dental practice' it can be read as 'taking on NHS patients of all ages'. The ads review also says the line must stay out unless NHS places cover adults.",
  "evidence": "Back footer, gold bold, about 8 pt: 'Adults, children and families can all join' (no object). Ad B uses '\u2026can all join our waiting list'. ads/CREATIVE-REVIEW.md line 75: 'If NHS is children-only or limited\u2026 the family line stays out.'",
  "severity": "must-fix-before-print",
  "fix": "Before print: if the owner confirms adult and child NHS places, change it to 'Adults, children and families can all join our waiting list' (10pt or more). If not confirmed, delete the line.",
  "lens": "resident",
  "why": "Confirmed: the back carries 'Adults, children and families can all join' (8.08pt gold, with no object). CREATIVE-REVIEW lines 75 and 349 put that line on hold in the ads until the owner confirms NHS places for adults and children. Next to 'new NHS dental practice' it can read as 'taking on NHS patients of all ages'. Print can't be put on hold."
 },
 {
  "item": "leaflet-front",
  "issue": "The leaflet uses the same mum-and-daughter photo as Ad B. The ads review gates that photo on a licence and model release, including a child release that covers health advertising.",
  "evidence": "Front image is 1955x1370 at 322 ppi and appears to be the same subject as ad-B. ads/CREATIVE-REVIEW.md change 2: 'File the stock licence or the AI tool's commercial-use terms for both photos, with a model release that covers health advertising and, for Ad B, a child model release.'",
  "severity": "must-fix-before-print",
  "fix": "File the licence or AI-tool commercial terms and the releases (child release if it is a real child) before ordering print. Never caption the photo as patients.",
  "lens": "resident",
  "why": "The leaflet uses the mum-and-daughter photo (1955x1370) gated in CREATIVE-REVIEW stage 1 on a stock licence or AI commercial terms plus model and child releases covering health advertising. A door-drop print run is permanent, wide distribution. This is paperwork only, with no artwork change."
 },
 {
  "item": "both",
  "issue": "No opening timeframe. Leaflets sit on fridges and banners stay up for months, and 'Opening Soon!' loses credibility over time. Both the mum and the 70-year-old would ask 'when?'.",
  "evidence": "The only timing anywhere is 'Opening Soon!' (approved headline). ads/CREATIVE-REVIEW.md decision 7 offers 'We're aiming to open in [month]' if the owner knows it.",
  "severity": "nice-to-have",
  "fix": "If the owner knows the month, add 'We're aiming to open in [Month]' to the leaflet back body. Otherwise no action.",
  "lens": "resident",
  "why": "True that 'Opening Soon!' is the only timing, and CREATIVE-REVIEW decision 7 offers a month line if known. It depends on the owner, and no date should be invented."
 },
 {
  "item": "both",
  "issue": "The PDFs in print-review are an older export than the ones committed to the leaflet branch. Make sure the printer gets the newer ones.",
  "evidence": "Review copies: CreationDate 18:48 UTC. Leaflet page is 437.04\u00d7612.96pt (154.2\u00d7216.2mm, slightly off size) with TrimBox equal to the full page. Banner is 5160\u00d71758pt with no TrimBox. origin/claude/brave-allen-i14xnx commit 5ee5ba2 (21:11, \"exact page sizes with TrimBox/BleedBox, no white sliver at the leaflet bleed edge\"): leaflet is 436.535\u00d7612.283pt (exactly 154\u00d7216mm) with TrimBox 8.50/9.18\u2013428.03/604.46. Banner is 5159.06\u00d71757.48pt with TrimBox 28.35/28.87\u20135130.71/1729.65. The MD5 hashes differ, but the extracted text is identical, so every finding here applies to both versions.",
  "severity": "should-fix",
  "fix": "After the fixes, re-export from the branch sources and send only the new PRINT files. Delete the stale copies in /home/user/Dental/print-review and the Drive folders so the 18:48 versions can't reach a printer.",
  "lens": "compliance",
  "why": "Confirmed. The print-review PDFs are dated 18:48 and differ by MD5 from the 5ee5ba2 exports (21:09\u201321:11) on origin/claude/brave-allen-i14xnx. The newer ones have exact sizes (436.535x612.283pt, 5159.06x1757.48pt), proper TrimBoxes and no edge slivers, which resolves #6, #23 and #54. The text is identical. Any re-export for the fixes here will supersede both."
 },
 {
  "item": "both",
  "issue": "The pages the QR codes lead to still have the consent and privacy problems the runbook says must be fixed before leaflets go out. A wrong-email privacy page also still sits on three branches.",
  "evidence": "The register page in the leaflet branch still has a required checkbox: \"I'm happy for Kirkcaldy Dental & Implant Clinic to contact me by text and email with opening news\". Runbook \u00a71.7 requires instead (a) the \"By joining, you're asking\u2026 We won't send you marketing unless you opt in below\" statement and (b) a separate optional, unticked marketing box, and says to fix it \"before leaflets go out\". site/privacy.html on origin/main, the ads branch and origin/claude/hostinger-plugin-install-eyvjb3 contains info@kirkcaldydentist.co.uk 3 times. Only the leaflet branch's privacy.html uses @kirkcaldydental.co.uk, and that is the one the register form links to as ../privacy.html. The print files themselves have the correct email.",
  "severity": "should-fix",
  "fix": "Website chat: replace the required box with the \u00a71.7(a) notice plus an optional, unticked marketing box, and deploy only the leaflet-branch privacy.html with the \u00a71.6 edits. Before distribution, check that every email on the live /privacy.html is @kirkcaldydental.co.uk.",
  "lens": "compliance",
  "why": "Confirmed. The branch register page has a required 'I'm happy\u2026 opening news' checkbox (lines 93\u201394), which runbook \u00a71.7 and CREATIVE-REVIEW say must be replaced 'before leaflets go out' (UK GDPR Art. 7(4)). privacy.html on origin/main, the hostinger branch and the current branch has info@kirkcaldydentist.co.uk (6 times). Only the leaflet branch has @kirkcaldydental. This is a website gate before distribution, not an artwork change."
 },
 {
  "item": "both",
  "issue": "Small gold text sits exactly on the WCAG AA contrast threshold, and the RGB-to-CMYK conversion or uncoated paper could push it below.",
  "evidence": "Measured: #8A6A2C on cream #F6F2EA is 4.50:1, the AA minimum for normal text. It is used for small text: front address caps (9.35pt), back \"Adults, children and families can all join\" (8.08pt), and the gold \"to join in 30 seconds\". The PDFs are RGB exports from Chromium. Large gold headlines such as \"Opening Soon!\" only need 3:1 and are fine.",
  "severity": "nice-to-have",
  "fix": "For gold text under 14pt, use #6B5122 (matches the ad kicker). Keep #8A6A2C for headlines and the strip.",
  "lens": "compliance",
  "why": "Computed: #8A6A2C on #F6F2EA is 4.50:1, exactly at the AA threshold. It is used for 8\u20139pt text (front address kicker, family line, the 'SCAN WITH YOUR PHONE' caption). The ads' kicker uses the darker #6B5122 (6.66:1). Merged with #60."
 },
 {
  "item": "banner",
  "issue": "Check that the banner can legally go up on those railings (advertisement consent, who owns the railings, listed status).",
  "evidence": "Town and Country Planning (Control of Advertisements) (Scotland) Regulations 1984, Schedule 4 Class IV: deemed consent covers business-premises signs referring wholly to the business there, with letters no taller than 0.75m. The banner is 1.08 m\u00b2 and its tallest letters are about 110mm, so it probably qualifies. But that only applies on the business's own wall or forecourt. Public footway railings need Fife Council roads permission. 17 Tolbooth Street nearby is Category B listed, and the street may be in the town-centre conservation area.",
  "severity": "nice-to-have",
  "fix": "Confirm the railings belong to 23\u201325 Tolbooth Street. Use cable ties or bungees, with no drilling into stonework. Email Fife Council planning if unsure.",
  "lens": "compliance",
  "why": "A reasonable pre-install check. A business-premises sign probably has deemed consent, but railings on the public footway or a listed or conservation setting change that. Not an artwork issue."
 },
 {
  "item": "banner",
  "issue": "The URL and address lines under the QR code collide: the descender of the \"g\" in \"register\" touches the cap of the \"K\" in \"KY1\".",
  "evidence": "Measured in the PRINT PDF at 4x. URL ink runs from y=1489.0 to 1533.25pt and address ink from 1531.75 to 1564.25pt, so the lines overlap by 1.5pt. The tightest column (x\u22484640pt) has 0.25pt (0.09 mm) of clearance. Baseline-to-baseline is only 34.5pt under a 45.63pt URL (finished-size PDF: URL baseline 1495.5, address baseline 1530.0). Ad B keeps a clear 28px gap (about 0.4em of URL size) between the same two lines. You can see it in banner-full-1.png at the bottom of the QR panel.",
  "severity": "must-fix-before-print",
  "fix": "Together with #3: give the address its own line at least 0.5em below the URL's descenders (baseline-to-baseline at least 1.1\u20131.2x the URL size), or move the address out of the panel. Re-export both banner PDFs and re-check at 400% zoom.",
  "lens": "brand",
  "why": "Confirmed by rendering the finished-size PDF at 432dpi. The 'g' descender of 'register' is about 0.33pt (0.12mm) above the cap of the 'K' in 'KY1', so the lines visibly touch. The baselines are 1495.5 and 1530.0pt (34.5pt apart under a 45.63pt line). The same collision is in the 5ee5ba2 export. It is a clear typesetting fault on permanent large-format print, seen by everyone close enough to read the URL, and it is trivial to fix."
 },
 {
  "item": "both",
  "issue": "The QR codes open a web page that may show the old logo and old colours. All local web and logo files are the superseded version, not the halfway, deep-gold logo used on the ads and print.",
  "evidence": "site/assets/logo-stacked.svg and logo-horizontal.svg, brand/logo/*.svg and kirkcaldy-dental-logo-pack.zip are all dated 7 Nov 23:54, and site/assets/logo-horizontal.svg has the same md5 as brand/logo/logo-horizontal.svg (21a093d9\u2026). Measured: in these files the D drops 35.3\u201336.2% of the K height (the \"NOW \u2013 D lower\" version), against 4.4\u20134.7% in the ads, banner and leaflet, and the fill is light gold #C3A363. site/index.html uses #c3a363, #f6efe3 and #9a7a3f rather than #F6F2EA / #8A6A2C. The brand/logo/logo-*-deepgold.svg files named in BRAND.md are not in brand/logo. The local website zip has no register/ folder, so the live page may differ.",
  "severity": "should-fix",
  "fix": "When deploying for #0, use the site/assets from origin/claude/hostinger-plugin-install-eyvjb3 (halfway deep-gold logo) and confirm /register/ shows it on cream #F6F2EA. Replace brand/logo/* and the logo-pack zip with the halfway versions.",
  "lens": "brand",
  "why": "Confirmed. assets/logo-horizontal.svg in the website zip on origin/claude/brave-allen-i14xnx (the one with b/ and l/) has the same md5 (21a093d9\u2026) as the superseded brand/logo file, fill #C3A363. The hostinger branch's site/assets has a different, newer logo. So the QR landing page would show the old logo unless the assets are swapped. It is a website item, not artwork."
 },
 {
  "item": "leaflet-front",
  "issue": "The flourishes beside \"Opening Soon!\" have one diamond per side. The ads and the banner use a large diamond plus a small one. The back-page \"in 30 seconds\" flourish has the same simplification.",
  "evidence": "Leaflet page 1 has only two #8A6A2C diamond fills (rects 80,348\u201388,357 and 348,348\u2013357,357), visible in the 6x crop. The banner has the large diamonds (706,959\u2013762,1015 and 2980,959\u20133036,1015) plus the small ones, and ad.html draws .dia (9px) plus .dia.o (5px) on each side.",
  "severity": "nice-to-have",
  "fix": "Add the small diamond (about 55% size) to the front 'Opening Soon!' and back headline flourishes in the re-export.",
  "lens": "brand",
  "why": "Visible in the renders: the leaflet flourishes have a single diamond per side, while the banner and ad.html use a large .dia plus a small .dia.o. A minor brand-detail mismatch."
 },
 {
  "item": "both",
  "issue": "The address appears in two formats. The ads and the leaflet front use the uppercase kicker with a middle dot. The banner and the leaflet back use sentence case with a comma, and the leaflet back body copy says only \"on Tolbooth Street, Kirkcaldy\".",
  "evidence": "Ads and leaflet front: \"23\u201325 TOLBOOTH STREET \u00b7 KIRKCALDY KY1 1RW\". Banner: \"23\u201325 Tolbooth Street, Kirkcaldy KY1 1RW\" (Inter Bold 33.73pt, cap height about 8.6 mm). Leaflet back footer: \"23\u201325 Tolbooth Street, Kirkcaldy KY1 1RW \u00b7 info@\u2026\"; body: \"opening soon on Tolbooth Street, Kirkcaldy\". BRAND.md says the owner wants the full address, not just \"Tolbooth Street\". The full address does appear on every face, so this is not a breach.",
  "severity": "nice-to-have",
  "fix": "Change the body to '\u2026opening soon at 23\u201325 Tolbooth Street, Kirkcaldy KY1 1RW.'",
  "lens": "brand",
  "why": "Confirmed: the leaflet back body says 'opening soon on Tolbooth Street, Kirkcaldy', and BRAND.md line 22 says 'full address everywhere\u2026 not just \"Tolbooth Street\"'. The full address does appear in the footer on the same face, so this is minor. Mixed address formats across faces are fine."
 }
]