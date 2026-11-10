[
 {
  "issue": "Page sizes are slightly off spec and the PDFs have no separate trim box. On the leaflet, the background stops short of the page edge, leaving unprinted white slivers at the outer bleed edge; the banner has matching cream slivers.",
  "reason": "These hold for the review copies (437.04x612.96pt, TrimBox = MediaBox, white slivers at the right and bottom bleed edges) but are already fixed in commit 5ee5ba2 on origin/claude/brave-allen-i14xnx. Checked: the leaflet is 436.535x612.283pt with TrimBox 8.50/9.18\u2013428.03/604.46 and cream to the edge, and the banner has TrimBox 28.35/28.87\u20135130.71/1729.65 with charcoal to the right edge. Covered by #45 (send the newer files)."
 },
 {
  "issue": "The footer address/email line is slightly inside the 8mm safe margin in the brief.",
  "reason": "Measured: the footer bbox bottom is about 7.25mm above trim and the baseline about 7.9mm. That is well inside printers' 3\u20135mm safe zone, and the issue says itself there is no cutting risk. The '8mm rule' does not appear in any project doc or source. There is no practical defect. Any footer rework is covered by #16 and #17."
 },
 {
  "issue": "Neither QR code nor the printed URL reaches a sign-up form yet. The whole domain shows the Squarespace parking page.",
  "reason": "duplicate of #0"
 },
 {
  "issue": "The URL and address are too small for anyone more than about 4m away. The URL is the only route in for people who won't scan.",
  "reason": "duplicate of #3"
 },
 {
  "issue": "The QR quiet zone is narrower than the standard asks for: about 3 modules instead of 4, with dark charcoal right outside it.",
  "reason": "duplicate of #9"
 },
 {
  "issue": "The QR quiet zone is only about 2.5 modules before the gold border, and the border is mid-tone.",
  "reason": "duplicate of #1"
 },
 {
  "issue": "Playfair's very thin strokes fade beyond about 7-10m, so the key word 'NHS' smears at 20m.",
  "reason": "Doesn't hold up. In banner-print-small-1.png (the roughly 20m view) 'NEW NHS DENTAL PRACTICE' reads clearly. The issue itself says real viewing distances are mostly under 15m and the word shapes stay recognisable. Adding an outline would also drift from the ads' typography. This is taste."
 },
 {
  "issue": "There is a hairline of the wrong colour at the very outer edge of the bleed. It is harmless.",
  "reason": "The cream hairline at the bleed edge exists in the review copy but is fixed in the 5ee5ba2 export (checked: charcoal to the right edge, gold at the bottom). It sits 10mm outside trim either way. Covered by #45 and duplicates #6."
 },
 {
  "issue": "Every URL printed on the banner and leaflet (both QR targets and the typed URL) currently opens a 'Coming Soon / under construction' page. A resident who scans or types it today hits a dead end and can't join.",
  "reason": "duplicate of #0"
 },
 {
  "issue": "On the front, the typed URL is the main alternative for anyone who doesn't scan, but it's set too small for older readers.",
  "reason": "duplicate of #17 (front URL size). The 'No smartphone?' suggestion is covered by #26."
 },
 {
  "issue": "Passers-by beyond a few metres get the message but nothing to act on. The URL and address are too small to read from the far pavement or a car, and the QR only scans close up. 'DENTAL & IMPLANT CLINIC' is also unreadable beyond about 5 m.",
  "reason": "duplicate of #3"
 },
 {
  "issue": "The QR quiet zones are thinner than the 4-module spec. The leaflet front has 2.5 modules inside a mid-tone gold border. The banner has about 3.1 modules, bounded by the dark charcoal panel. Both decoded in every test, so the risk is low, but older phones and low light are less forgiving.",
  "reason": "duplicate of #1 (leaflet front) and #9 (banner)"
 },
 {
  "issue": "There's no trust signal about who is behind the new clinic, even though the owner runs established practices nearby that about 2,445 Kirkcaldy patients already attend.",
  "reason": "A marketing suggestion, not a defect. Naming the other practices also risks inviting questions about patient transfers, which interacts with the unresolved priority rule in #25."
 },
 {
  "issue": "Cosmetic: the four inner corners of the front QR card show small square notches where the white square of the QR image clips the rounded gold border.",
  "reason": "duplicate of #7"
 },
 {
  "issue": "The thin decorative gold arc passes about 3 mm from the end of the email address, crowding the one offline contact route.",
  "reason": "duplicate of #16"
 },
 {
  "issue": "The QR codes and printed URLs currently open a parked page, not the sign-up form. The register page in the repo would also tell people they are on the list even when nothing was saved.",
  "reason": "duplicate of #0. I confirmed its extra points (ENDPOINT placeholder at line 110, no-cors fetch showing thanks on any response, Hostinger as the intended host) and folded them into #0's fix."
 },
 {
  "issue": "\"in 30 seconds\" is a measurable claim with no evidence behind it. It appears twice: front \"to join in 30 seconds\" and the back headline \"Join our waiting list / in 30 seconds\".",
  "reason": "duplicate of #30"
 },
 {
  "issue": "The NHS claim needs evidence, and the GDC requires publicity to say whether the practice is NHS, mixed or wholly private. The name 'Dental & Implant Clinic' suggests some private treatment.",
  "reason": "duplicate of #32 (mixed-practice line) and #25 (NHS Fife evidence)"
 },
 {
  "issue": "Key contact text is printed too small: the full address and the only contact method (email) on the back, and the fallback URL on the front.",
  "reason": "duplicate of #17"
 },
 {
  "issue": "The printed URL and address on the banner can only be read up close. The address is a required element, and the URL is the only route for people who don't scan.",
  "reason": "duplicate of #3"
 },
 {
  "issue": "There is no privacy pointer near the QR or in the footer. It is not legally required, because the notice is given on the form, but it would build trust.",
  "reason": "The issue itself says it is not required: the privacy notice belongs on the form, which links it. Taste. It also adds clutter to an already small footer (#17)."
 },
 {
  "issue": "The printed path \"/register\" sits next to \"NEW NHS DENTAL PRACTICE\", and in Scotland patients 'register' with a dentist. It brushes against the rule never to imply 'registering NHS patients'.",
  "reason": "duplicate of #29"
 },
 {
  "issue": "Small white squares from the QR's background stick into the rounded gold frame at its top corners.",
  "reason": "duplicate of #7 (corner notches) and #1 (quiet zone)"
 },
 {
  "issue": "The print PDFs with bleed have no separate trim box (TrimBox = BleedBox = MediaBox), so the printer's software cannot tell where the bleed ends. This is outside my lens, but I measured it.",
  "reason": "duplicate of #6. Already fixed in 5ee5ba2 (TrimBox set); covered by #45."
 },
 {
  "issue": "The headline styling differs slightly from the ads: \"BE FIRST IN LINE\" uses Playfair Black (900) where the ads use ExtraBold (800), and \"Opening Soon!\" is larger relative to the caps line.",
  "reason": "The weight and ratio differences are real but invisible to a passer-by. The lockup is clearly the same, and the issue itself says it is fine to keep. Taste."
 },
 {
  "issue": "\"30\" is set in Playfair's default old-style figures, so it reads as \"3o\" (the 0 looks like a lowercase o and the 3 drops below the line). This happens in the back headline and in the front \"to join in 30 seconds\". The step numbers 1, 2, 3 are old-style too.",
  "reason": "duplicate of #21"
 },
 {
  "issue": "The leaflet adds a time claim, \"in 30 seconds\", that is not in the ads or in the approved wording in BRAND.md. It appears twice (front and back headline).",
  "reason": "duplicate of #30"
 },
 {
  "issue": "The address kicker uses the strip gold #8A6A2C, while the ads use the darker kicker gold #6B5122.",
  "reason": "duplicate of #47 (confirmed: ad.html .kicker is #6B5122, leaflet kicker #8A6A2C)"
 }
]