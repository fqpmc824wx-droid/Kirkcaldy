# Kirkcaldy Dental – shared brand & wording (single source of truth)

All Claude chats read this AND OWNER-DECISIONS.md before changing anything. If you change wording, colours or the logo,
update THIS file first, commit to `main`, and send the other chat a message.

## Who owns what
| Area | Owner chat | Files |
|---|---|---|
| Meta ads (images + videos), Meta launch, lead form, HANDOFF.md | **Ads chat** (`claude/determined-heisenberg-d02bac`, session_013umgPt6TGNXXMN4VEpExxU) | `ads/`, `HANDOFF.md` |
| Leaflet, banner, Apps Script, trackers & sheets | **Leaflet chat** (`claude/brave-allen-i14xnx`, session_013umgPubjfb3bgTfLwUbuPv) | `leaflet/`, `banner/`, trackers |
| Website: Hostinger deploy, SSL, DNS, sign-up/register page | **Website chat** "Hostinger plugin installation" (session_013umgPu69C1HEnqqdhNQd6i) | `site/` |
| Logo | Leaflet chat (ads chat reuses its files) | `brand/` |
| Forecast, KPIs, daily/weekly numbers, Monday report | **Metrics chat** "Kirkcaldy – Forecast & Metrics" (`claude/metrics-forecast`, session_013umgPtRRXmqe1Tgbo6z6iR) | `research/forecast-*.md`, Drive "7. Numbers & Reports" |
| Waiting-list staff guide: call script, message templates, comment replies, invitation plan | **Waiting-list chat** "Kirkcaldy – Waiting list playbook & staff guide" (`claude/waitlist-playbook`, session_013umgPvjqMZ5rf1rX1yivSk) | `research/waitlist-*.md`, `staff-guide/`, Drive "8. Waiting list – staff guide" |
| Lead-form specs (Facebook + website), master launch to-do list | **To-do chat** "Kirkcaldy – Lead forms & launch to-do list" (`claude/launch-todo`, session_013umgPtRsZRQgHTJCJcCnv8) | `research/FORMS-*.md`, `research/TODO-*`, Drive "9. Launch to-do list" |
| Launch safety plan: pre-mortem, risk register, fire drill, outside watchers (code stays with the ads chat) | **Launch-safety chat** "Kirkcaldy – Launch safety & monitoring" (`claude/launch-safety`, session_013umgPw55Fb4EnC1PLR1FFW) | `research/premortem-*.md`, Drive "10. Launch safety" |
Don't edit the other chat's folders – message them instead.

## Google Drive – "Kirkcaldy Dental – Print files & marketing"
Upload into the right subfolder and **trash the old version** (no "FINAL v2/v3" copies):
1. Meta Ads · 2. Banner 180x60cm · 3. Leaflet A5 · 4. Logo & Brand · 5. Website · 6. Sheets & Trackers · 7. Numbers & Reports · 8. Waiting list – staff guide · 9. Launch to-do list · 10. Launch safety
**Owner rule (8 Nov):** once all reviews, agents and fixes are finished, each chat bins every old version in ITS OWN folder(s) and leaves only the final files, neatly organised.

## Approved wording (owner Nas)
- Headline: **NEW NHS DENTAL PRACTICE** / *Opening Soon!* (gold italic, diamond flourishes)
- Strip: **BE FIRST IN LINE** / JOIN OUR WAITING LIST
- Location line: full address everywhere: **23–25 Tolbooth Street, Kirkcaldy KY1 1RW** (owner wants the full address, not just "Tolbooth Street")
- CTA: Join waiting list · kirkcaldydental.co.uk/register · info@kirkcaldydental.co.uk
- Family line (Ad B / leaflet): For Kirkcaldy families · "Adults, children and families can all join"
- NOT allowed: "taking on / accepting / registering NHS patients", "limited places", "first come first served", "free NHS dentist", "guaranteed", NHS logo.

## Look
- Cream `#F6F2EA` · deep gold `#8A6A2C` / `#8E6B2E` · light gold `#B8964F` / `#D9BD82` · charcoal `#30363B` · ink `#262B30`
- Fonts: Playfair Display 800/900 (headlines, uppercase), Playfair Display 800 italic (*Opening Soon!*), Inter 700–900 (body, buttons)
- Logo: ALL GOLD (no two-tone), same fonts; the K sits on the D: K arm tip meets the D stem, the K foot rests on the D bottom serif, thin cut-out in the D where the K crosses. Print/light: brand/logo/logo-{stacked,horizontal}-deepgold.svg (#8E6B2E); lighter gold: logo-{stacked,horizontal}.svg (#C3A363). Generator brand/source/makelogo.py (params in its docstring).
