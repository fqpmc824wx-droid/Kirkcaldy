# Kirkcaldy Dental – shared brand & wording (single source of truth)

Both Claude chats read this before changing anything. If you change wording, colours or the logo,
update THIS file first, commit to `main`, and send the other chat a message.

## Who owns what
| Area | Owner chat | Files |
|---|---|---|
| Meta ads (images + videos), Meta launch, lead form, HANDOFF.md | **Ads chat** (`claude/determined-heisenberg-d02bac`, session_013umgPt6TGNXXMN4VEpExxU) | `ads/`, `HANDOFF.md` |
| Leaflet, banner, Apps Script, trackers & sheets | **Leaflet chat** (`claude/brave-allen-i14xnx`, session_013umgPubjfb3bgTfLwUbuPv) | `leaflet/`, `banner/`, trackers |
| Website: Hostinger deploy, SSL, DNS, sign-up/register page | **Website chat** "Hostinger plugin installation" (session_013umgPu69C1HEnqqdhNQd6i) | `site/` |
| Logo | Leaflet chat (ads chat reuses its files) | `brand/` |
Don't edit the other chat's folders – message them instead.

## Google Drive – "Kirkcaldy Dental – Print files & marketing"
Upload into the right subfolder and **trash the old version** (no "FINAL v2/v3" copies):
1. Meta Ads · 2. Banner 180x60cm · 3. Leaflet A5 · 4. Logo & Brand · 5. Website · 6. Sheets & Trackers

## Approved wording (owner Nas)
- Headline: **NEW NHS DENTAL PRACTICE** / *Opening Soon!* (gold italic, diamond flourishes)
- Strip: **REGISTER YOUR INTEREST** / JOIN OUR WAITING LIST (owner 9 Nov ~15:00: same wording everywhere, matches the website; banner v8, leaflet v10)
- Location line: full address everywhere: **23–25 Tolbooth Street, Kirkcaldy KY1 1RW** (owner wants the full address, not just "Tolbooth Street")
- CTA: Join waiting list · kirkcaldydental.co.uk/register · info@kirkcaldydental.co.uk
- Phone: **01592 214225** (ONSIM virtual landline, inbound calls only, diverts to the clinic mobile; NOT textable, so never say "text us"). Printed as "or call 01592 214225" on the banner (banner line below it: "NHS & PRIVATE DENTAL CARE", capitals, owner 9 Nov) and leaflet (front and back).
- Mixed practice (owner, 8 Nov): print carries "NHS & private dental care" (banner panel) / "We’ll offer NHS and private dental care." (leaflet back)
- Family line (Ad B / leaflet): For Kirkcaldy families · "Adults, children and families can all join"
- NOT allowed: "taking on / accepting / registering NHS patients", "limited places", "first come first served", NHS logo.

## Look
- Cream `#F6F2EA` · deep gold `#8A6A2C` / `#8E6B2E` · light gold `#B8964F` / `#D9BD82` · charcoal `#30363B` · ink `#262B30`
- Fonts: Playfair Display 800/900 (headlines, uppercase), Playfair Display 800 italic (*Opening Soon!*), Inter 700–900 (body, buttons)
- Logo: ALL GOLD (no two-tone). Wordmark (owner-approved 9 Nov): KIRKCALDY in Cinzel weight 650, DENTAL & IMPLANT CLINIC in Lato 900 (Black), original sizes and flourish lines; D raised HALFWAY (owner-approved 8 Nov, matches ads/logo-stacked-deepgold-HALFWAY.svg); the K sits on the D: K arm tip meets the D stem, the K foot rests on the D bottom serif, thin cut-out in the D where the K crosses. Print/light: brand/logo/logo-{stacked,horizontal}-deepgold.svg (#8E6B2E); lighter gold: logo-{stacked,horizontal}.svg (#C3A363). Generator brand/source/makelogo.py (params in its docstring).

## QR codes (tracking)
- Banner QR → https://kirkcaldydental.co.uk/b · Leaflet QR → https://kirkcaldydental.co.uk/l
- site/b/ and site/l/ forward to /register/?src=banner|leaflet, so visits (Visits tab) and sign-ups (Source column) are tagged. Hostinger stats show hits to /b/ and /l/ as an independent scan count.
- The printed web address (kirkcaldydental.co.uk/register) counts as Source = website, so typed visits stay separate from scans.
- Never reprint a QR code without re-checking it decodes to these URLs.
