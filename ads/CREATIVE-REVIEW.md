# Kirkcaldy Dental & Implant Clinic: Meta ad creative improvement plan (final)

*For the clinic owner and for the designer working in `/home/user/Dental/ads/source/ad.html`. Prepared 8 November 2026.*

---

## 1) Verdict

**The ads work. Keep both, and keep the button and the URL.** On a phone the offer reads in under a second. The gold "JOIN WAITING LIST →" button is the strongest thing on the image. Because the ads match the street banner and leaflet, people who walk down Tolbooth Street see the clinic a second time. The feed images are good. The Story images and videos lose the most.

**Reviewers' average scores (out of 10):**

| Asset | Performance | Local patient | Design | Compliance | Meta 2026 | **Average** |
|---|---|---|---|---|---|---|
| Ad A feed 4:5 (woman in chair) | 6 | 6 | 7.5 | 7 | 6.5 | **6.6** |
| Ad B feed 4:5 (mum + daughter) | 7 | 7 | 6.5 | 6 | 6.5 | **6.6** |
| Ad A Story 9:16 | 5 | 5 | 6 | 7 | 5 | **5.6** |
| Ad B Story 9:16 | 6 | 6 | 5.5 | 6 | 5 | **5.7** |
| Videos (A + B) | 4 | 4 | 5 | 7 | 3.5 | **4.7** |

A and B score the same overall. B does better with the performance and local-patient reviewers, and A does better on design and compliance. "Ad B is the stronger hook" is a guess to test, not a result. Meta's spending will show which one wins.

**What is costing results, most important first:**

1. **Hard launch blocker.** On 8 Nov 2026, `kirkcaldydental.co.uk/register/` and `/privacy.html` both still showed the "Coming Soon / under construction" page. Every ad prints that URL, and the lead form needs a privacy link that works. **No ad goes live until both pages work.**
2. **The videos open on an almost empty template.** "NHS" can't be read until about 1.3s, the button arrives at 3.4s and the URL at 3.9s. The near-empty first frame is also the default thumbnail.
3. **In the 9:16 files, the button, URL and address sit where Reels covers them.** The button is at y 1362–1470. In Reels, the caption and the Sign up bar cover everything below about y 1250. The owner insisted on that button, and Reels hides it.
4. **The copy has compliance gaps.** Ad B opens with "Looking for an NHS dentist…?", which comes close to the banned "taking on patients". Neither ad says the practice will offer both NHS and private care, which the GDC requires.

**At £20/day, speed matters more than polish.** Demand is extreme and the real limit is one caller ringing leads within the hour, so cost per lead will probably be low with any honest ad. The plan is in launch order:
- clear the blockers;
- do one re-render of the current ads;
- launch;
- add the real shopfront ad;
- add other new ads only when the data calls for them.

**Decisions only you (the owner) can make:**
1. Get written confirmation from NHS Fife that the practice's NHS listing/approval at 23–25 Tolbooth Street is granted or formally agreed. **This gates launch.**
2. Confirm in writing that the practice is mixed (NHS and private), and whether NHS registration will be offered to **adults as well as children**.
3. Sign a one-line rule saying waiting-list members get priority (see change 2).
4. Find proof of the licence or model release for both photos.
5. Approve the single re-render. One sign-off covers everything in changes 4–8.
6. Choose whether to keep the old "Looking for an NHS dentist?" opening. It is probably a strong hook, but we recommend dropping it for compliance reasons (section 6).
7. Optional: if you know the opening month, we can add "We're aiming to open in [month]" to the text. "Opening Soon!" stays on the image.

---

## 2) Changes to make now (priority order)

### Stage 1: launch gates (nothing goes live until 1–3 are done)

**1. Get the website and privacy pages working** (send one request to the Website chat, which owns `site/`)
- Point DNS to Hostinger and deploy the newer site from `origin/claude/brave-allen-i14xnx`. It has `register/` with the Apps Script endpoint, and a `privacy.html` that uses @kirkcaldydental.co.uk.
- Rebuild or replace `/home/user/Dental/kirkcaldy-dental-website.zip`. The old zip has no `register/` folder and uses the wrong address, info@kirkcaldy**dentist**.co.uk, so nobody should be able to upload it.
- Changes to `privacy.html`:
  - Remove Zapier.
  - List Meta, Google Sheets/Apps Script/Gmail, ClickSend and Hostinger.
  - Add "We will text and call you about your request between 8am and 9pm."
  - Use info@kirkcaldydental.co.uk throughout.
  - Replace "register your interest" and "the number of people you are registering" with "join our waiting list" and "the number of people on the waiting list".
  - Keep the "no tracking cookies" statement true by not adding the Meta Pixel now (see 12).
- The `/register` page H1 and button say **"Join our waiting list"**, never "Register".
- Changes to the web form:
  - Remove "Are you currently registered with a dentist?" (it moves to the welcome call).
  - Replace the *required* consent checkbox with a plain notice: "We'll text, call and email you about your waiting-list request, 8am–9pm."
  - Add an **optional, unticked** marketing checkbox that matches the Instant Form. Consent can't be a condition of joining (UK GDPR Art. 7(4)).
- Minor, same request: run the GDC advertising checklist on `index.html` and `/register`. It covers practice name and geographic address, contact details, date last updated, NHS/mixed status, the complaints route (NHS Fife for NHS care, Dental Complaints Service for private), and the GDC number, qualification and country of qualification for anyone named.
- Done when:
  - both URLs load on mobile data;
  - `/b` and `/l` forward to `/register/?src=banner` and `?src=leaflet`;
  - a test sign-up creates a sheet row with Source = website.

**2. Evidence file and owner sign-offs**
- **NHS Fife confirmation is a hard gate.** No written confirmation of the listing/GDS approval at 23–25 Tolbooth Street means no ads. CAP 3.7 requires proof to be held *before* "NEW NHS DENTAL PRACTICE" is published, and the owner can't waive that.
- **Mixed-practice and NHS scope:** the owner confirms in writing that the clinic will offer NHS and private care, and whether NHS places are for adults and children. If NHS is children-only or limited, the copy must say so, and the family line ("Adults, children and families can all join") stays out.
- **Priority rule.** The owner signs: *"Waiting-list members get opening news and the chance to join our patient list before any public announcement or transfer of patients from our other practices."* About 2,445 Kirkcaldy patients already attend the Leven, Glenrothes and Cupar practices. If the owner won't commit to priority over those transfers, **stop using "Be first in line"**, on the image too. Never add "in the order you joined".
- **Photo rights.** File the stock licence or the AI tool's commercial-use terms for both photos, with a model release that covers health advertising and, for Ad B, a child model release. If either photo is AI-generated, **leave its metadata in and accept Meta's "AI info" label**, or replace it with licensed stock or a real photo before launch. Never caption the photos as patients, the surgery or results.

**3. Switch off Meta's automatic creative changes** (every ad, including duplicates)
In Ads Manager → Advantage+ creative, switch OFF:
- text generation/improvements;
- add overlays;
- Enhance CTA;
- relevant comments;
- image generation/expansion/background;
- visual touch-ups;
- automatic music.

Meta's automatic text can write things like "Now accepting new patients" or "Limited spaces". Re-check these switches every time an ad is duplicated, because they can switch back on. Adding your own text options and choosing a Sound Collection track yourself is fine.

### Stage 2: one re-render of the current ads, then launch

Everything in 4–8 goes into **one** edit of `ad.html`, followed by `node render.js` and `node render-video.js`, with one owner sign-off. Then replace the files in Drive "1. Meta Ads" and in Ads Manager. A tested prototype of these edits (layout numbers, crops, timing) is at `/tmp/claude-0/-home-user/f778202c-7a7e-561e-ac12-c600a726fed0/scratchpad/proto/ad.html`. It is a reference only; the real file has not been changed.

**4. Video timing: the message on frame 0, motion only to catch the eye**

Replace `window.setTime` with the code below (tested):
- headline, kicker, logo, flourishes, URL and address show at full opacity from frame 0;
- the strip slides in over 0–0.35s with its text already showing;
- the button pops in at 0.4s and is at full opacity by 0.55s;
- the button pulses every 1.5s from 1.5s;
- the photo push-in goes up to 1.10.

```js
window.setTime=t=>{
  const set=(id,o,ty,sc)=>{const e=$(id);e.style.opacity=o;e.style.transform=(id==='btn'?'translateX(-50%) ':'')+`translateY(${ty||0}px) scale(${sc||1})`;};
  $('photo').style.transform=`scale(${1.0+0.10*Math.min(t/8,1)})`;
  const rise=10*(1-prog(t,0,.3));
  set('logoTile',1); set('kicker',1); set('l1',1,rise); set('l2',1,rise); set('url',1); set('addr',1);
  for(const id of ['dl','dr','dl2','dr2']) $(id).style.opacity=1;   // flourish lines fl/fr stay at full width
  $('strip').style.transform=`translateX(${-1080*(1-prog(t,0,.35))}px)`;
  set('st1',1); set('st2',1);
  const k=(t-.4)/.35, pop=k<=0?.85:k<.6?.85+.21*(k/.6):k<1?1.06-.06*((k-.6)/.4):1;
  const ph=(t-1.5)%1.5, pulse=(t>=1.5&&ph<.6)?1+.05*Math.sin(ph*Math.PI/.6):1;
  set('btn',Math.min(1,Math.max(0,(t-.4)/.15)),0,pop*pulse);
};
```
In Ads Manager, set each video's **custom thumbnail to the finished frame at about t = 6s**.

**5. One 9:16 layout that is safe in both Stories and Reels** (replaces the current Story layout)
- **Rules:**
  - no text in the top 270px;
  - every key element between y 280 and y 1240;
  - above y 900, text stays inside x 70–1010;
  - from y 900 down, nothing goes into the right-hand 120px (x > 960), where the Reels like/comment/share icons sit.
- **New `L.story`** (measured in the prototype):
  - `H:1920, pT:0, pH:680`, with the fade height 80px (y 600–680);
  - kicker `kT:696` (renders 696–733);
  - headline `hT:735, hMax:80`, with l1 fitted to **940px** (65px; 735–801), so "Opening Soon!" sits at 803–880;
  - strip `sT:916, sH:112`, st1 fitted to 840px at max 60px, st2 to 760px at max 28px;
  - panel `pnT:1028`, **remove `pnB`**, so the charcoal panel runs to 1920, the footer line is gone and nothing below y 1240 has text;
  - button `bT:1046, bW:640, bH:90, bF:40` (x 220–860);
  - URL `uT:1156, uF:30`, fitted to 840px;
  - B address top **1202**, 26px (ends 1233).
- **Photos (9:16):**
  - A: `background-size:148%; background-position:0% 15%`
  - B: `background-size:112%; background-position:50% 88%`
  - Faces land at about y 300–660, and the girl's chin is about 36px above the kicker.
- **Logo:** keep it as the small cream tile:
  - `logoW 240`, tile 288px wide, `border-radius:24px`, padding `24px 24px 20px`;
  - centred (left 396) at **top 1300 in the charcoal panel**, with `z-index` above `#panel`;
  - it shows in Stories, and in Reels it is harmlessly under the caption, where the Page name already shows the brand;
  - do not use the "top ≈ 290" position, because in the test render it covered the girl's forehead (B) and sat next to the woman's mouth (A).
- When `PHONE` is set later, the URL line must still fit 840px.
- Check both ads with the Safe Zone overlay in the Ads Manager preview.

**6. New Meta copy:** replace the primary text, headline and description with section 3.

**7. Instant Form**
- Higher-intent form. Contact fields Full name, Phone and Email prefilled. **Post code stays a required standard field**, because it screens out people beyond the 10-mile radius.
- Exactly two questions:
  1. "How many people would you like to add to the waiting list?" 1 / 2 / 3 / 4+
  2. "Who is this for?" Adult / Child / Family
- **Remove "Are you currently registered with a dentist?"** (health/special-category data, and Meta's lead-ads policy) and ask it on the welcome call. Keep the sheet column "Currently Registered?" for callers to fill in, and check the lead automation still maps every field correctly.
- **Intro:** "Kirkcaldy Dental & Implant Clinic is a new NHS dental practice, also offering private treatments, opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. Join our waiting list – it's free to join, there's no obligation, and we'll keep you updated with opening news. Joining the waiting list doesn't guarantee an appointment or a place on our patient list."
- **Thank-you screen** (check the number and hours on nhsfife.org first): "Thanks – you're on our waiting list. We'll be in touch with updates before we open. Not registered with a dentist and need urgent care? Call the NHS Fife Dental Advice Line on 01592 226555 (weekdays) or NHS 24 on 111 out of hours. In an emergency, call 999."
- Keep **unchanged**: the HANDOFF custom disclaimer "How we'll contact you", the **optional, unticked** marketing checkbox, and the privacy link to the updated `privacy.html`.
- Time the Instant Form and the web form on a phone. Use "only takes a minute" only if both really do, and keep a note. Until then, say "quick to join".

**8. Small fixes, in the same render** (no separate review rounds)
- **8a URL line, all assets:** `.url b{color:inherit;font-weight:inherit}`, so the whole URL is white #FFFFFF in one weight. "/register" in gold read as "registering with an NHS dentist". Position unchanged.
- **8b Ad B address (`.addr`):**
  - colour #C9CCD0 → **#E6E2DA**;
  - letter-spacing .12em → **.06em**;
  - size 20px (feed) / 22px (Story) → **26px**;
  - full address on one line, "23–25 TOLBOOTH STREET · KIRKCALDY KY1 1RW" (about 690px wide at 26px).
- **8c Ad A address kicker:**
  - letter-spacing .22em → **.08em**;
  - colour #8A6A2C → **#6B5122** (about 6.7:1 on cream);
  - fit maximum 28 → **32px**;
  - A feed: `pH` 700 → **660**, so the fade (500–660) ends under the kicker;
  - A feed: button `bT` 1092 → **1122** and URL `uT` 1230 → **1260**, so the panel doesn't end in an empty band.
  - **Fix `fit()`.** It measures the 1080px box rather than the text, so the kicker never gets above 0.89× its maximum (it renders at about 24.9px today) and the URL never above 0.91×. Replace it with the version below. Tested: the A kicker becomes 32px on feed and 30.5px on 9:16, and the feed URL its intended 34px.
    ```js
    function fit(el,target,max){el.style.fontSize=px(max);const rg=document.createRange();rg.selectNodeContents(el);const w=rg.getBoundingClientRect().width;if(w>target)el.style.fontSize=px(max*target/w);return parseFloat(el.style.fontSize);}
    ```
- **8d Ad A photo crop:** feed `background-size:148%; background-position:0% 22%`. 9:16 as in step 5. Tested: the dental handpiece cluster on the right is out of frame and her face is intact. The video push-in still works.
- **8e Ad B feed, faces off the kicker:**
  - B feed only: photo box top **−45** (box −45 to 655);
  - `background-position:50% 100%` (keep cover size);
  - fade height **100px** (555–655);
  - Tested: the girl's chin is at about y 608 and the kicker text starts at about y 642, so the kicker no longer sits under her lip. Keep the wording "FOR KIRKCALDY FAMILIES".
- **8f Flourishes and feed logo:**
  - `.flour{height:3px;opacity:.9}` (was 2px / .7);
  - feed `logoW` 300 → **330**, with A `logoX` 720 → **690** so the tile keeps its right edge at 1044; B stays at 40.
- **8g Button (optional, show the owner side by side with the current one):**
  - flat `background:#8E6B2E; border:3px solid #D9BD82; box-sizing:border-box`;
  - **keep the white label**, pill shape, wording, arrow and `0 8px 0 #6B5122` shadow;
  - white on the current gradient is only about 2.3–3.5:1, against about 4.9:1 here;
  - if the owner doesn't clearly prefer it, leave the button as it is.

**9. Sound.** All four MP4s are silent. In Ads Manager, pick one calm instrumental yourself from Meta's Sound Collection for both videos. Don't pay for a voiceover on the template videos; the spoken version is new ad 2 in section 4.

**10. Campaign setup**
- 1 Leads campaign (Instant Form) and 1 ad set at £20/day, following the launch doc's weekly table.
- Audience: people living in Kirkcaldy + 10 miles, 18–65+, broad, Advantage+ placements.
- Placement asset customisation:
  - Feeds: 4:5;
  - Stories & Reels: the new 9:16, using the video where Ads Manager allows it;
  - Stories & Reels primary text: the short version in section 3.
- **A and B run as two separate ads**, so the pause rule works, plus at most one new ad at launch (the shopfront ad, if it's ready). No split tests and no extra ad sets.
- Week 1: change nothing for 3–4 days. Treat Meta's own spend split as the main signal, and only judge an ad once it has about 30 leads. After about 7 days, pause the ad whose cost per lead is 30% or more worse.
- Judge on cost per lead **and the share of leads the caller reaches within the hour**, not on click-through rate. If calls fall behind, lower the budget.
- Add the next new ad only when it's ready **and** the leading ad's frequency goes above about 3, or its cost per lead rises.
- Never use personal-health hooks such as "Struggling with toothache?".

### After launch (not blockers)

11. **"/register" path.** Ask the Website chat for `kirkcaldydental.co.uk/waitinglist` with a 301 redirect to `/register/`, so the banner, leaflet and QR codes keep working. Once it is live and the owner signs off (BRAND.md lists /register), swap the path on the ad images only.
12. **Web sign-up tracking.** Count web sign-ups from the sheet's Source column (`?src=` already does this). Leave out the Meta Pixel / Conversions API for now. It wouldn't lower the cost per lead shown for an Instant Form campaign. It would need a cookie-consent banner (PECR) and privacy-notice changes. It may also be restricted for a dental (health) advertiser. If it's ever added, send only the event name plus hashed email and phone, and never form answers.
13. **Build the shopfront ad** (section 4, ad 1) now, so it's ready for launch or early week 2.

---

## 3) New Meta copy

The approved call to action is within the first ~100 characters, before Meta's "…See more" cut. The full address and the GDC-required mixed-practice line ("We'll offer NHS and private dental care") are in every primary text. "Free" is always tied to the waiting list. That mixed-practice line is subject to the owner's confirmation in change 2.

**Ad A primary text** (call to action ends at character 95)
> 🦷 New NHS dental practice – opening soon in Kirkcaldy. Be first in line – join our waiting list. We'll offer NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free and quick to join our waiting list, and we'll keep you updated with opening news.

**Ad B primary text** (call to action ends at about character 102)
> 👩‍👧 Kirkcaldy families: new NHS dental practice opening soon. Be first in line – join our waiting list. We'll offer NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free and quick to join our waiting list, and you can tell us how many people in your household would like to join. We'll keep you updated with opening news.

*Only after the owner confirms NHS places for adults and children,* you may add: "Adults, children and families can all join."

**Headline:** `Free to join our waiting list` (29 characters; tells people something the image doesn't)
**Alternative headline 1:** `New NHS dental practice – opening soon` (38, the current one; keep it in the rotation)
**Alternative headline 2:** `Opening soon on Tolbooth Street` (31)

Load all three as headline options on both ads and let Meta rotate them.

**Link description (all ads):** `NHS & private dental care · 23–25 Tolbooth Street, Kirkcaldy KY1 1RW`
This shows only in some placements, which is why the primary text also carries the disclosure.

**Stories & Reels primary text** (set through placement asset customisation)
> New NHS dental practice opening soon in Kirkcaldy. Be first in line – join our waiting list 👇 NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.

Notes:
- 👩‍👧 replaces 👨‍👩‍👧, because there's no dad in the photo.
- "30 seconds" is gone. "Only takes a minute" may replace "quick" once both forms have been timed.
- The "Spotted our banner?" headline goes on the shopfront ad only (section 4).

---

## 4) New ads to add from week 2

Add these one at a time, in this order, only when the rule in change 10 says so (an ad is ready and the leading ad's frequency is above about 3, or its cost per lead is rising). Every new ad uses the step-5 safe zones, shows its message from frame 0 and keeps the gold button.

### Ad 1: "Spotted our banner?" (real shopfront). Build first; add at launch if ready.
- **Format:**
  - 4:5 static;
  - 9:16 handheld phone clip, 8–10s, of a walk down Tolbooth Street to the banner at 23–25.
- **Design:**
  - The top uses a real photo or clip of the frontage with the banner up, taken this week. The lower half is the current ad design.
  - In the video, "NEW NHS DENTAL PRACTICE / Opening Soon!", the strip, the button and the URL are on screen from frame 0. The walk is only background motion in the photo area.
- **Filming:**
  - film at a quiet time and blur identifiable people and number plates;
  - keep other businesses' NHS signs out of frame.
- **Two versions:**
  - one with the small secondary kicker "SPOTTED OUR BANNER ON TOLBOOTH STREET?";
  - one with the full address as the kicker, for the wider 10-mile audience who haven't seen the banner.
- **When the banner comes down:** retire the "Spotted" version that day (set a reminder).
- **On-image text:** [small kicker] SPOTTED OUR BANNER ON TOLBOOTH STREET? / NEW NHS DENTAL PRACTICE / Opening Soon! / BE FIRST IN LINE · JOIN OUR WAITING LIST / [JOIN WAITING LIST →] / kirkcaldydental.co.uk/register / 23–25 TOLBOOTH STREET · KIRKCALDY KY1 1RW
- **Primary text:** "👀 Spotted our banner? New NHS dental practice, opening soon. Be first in line – join our waiting list. We'll offer NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free and quick to join our waiting list." The address-kicker version uses Ad A's text.
- **Headlines:** "Spotted our banner? That's us" (this ad only) and "Free to join our waiting list".
- **Why:** every reviewer's first choice.
  - It shows a real place instead of stock or AI faces, which removes that trust and compliance risk.
  - It turns every sighting of the banner into recognition.
  - It looks native in Reels.
  - It is different enough that Meta treats it as a separate ad.

### Ad 2: "Meet the team" (to camera). Second new ad; needs a team member willing to appear.
- **Format:** 9:16 Reels/Stories, 12–15s, sound on, word-for-word captions burned in above y 1240. The last 4s show the current design as an end card with the pulsing button.
- **Script** (opens with the offer, not a name): "A new NHS dental practice is opening right here on Tolbooth Street, Kirkcaldy. I'm [Name], [role]. We're not open yet, but you can join our waiting list now – it's free. Be first in line – tap Sign up."
- **On-screen text:**
  - caption "NEW NHS DENTAL PRACTICE · OPENING SOON" from frame 0;
  - name strip "[Name] · Dentist, GDC No. xxxxx" for a GDC registrant, or "[Name] · Practice Manager" for anyone else;
  - end card: NEW NHS DENTAL PRACTICE / Opening Soon! / NHS & private dental care / [JOIN WAITING LIST →] / kirkcaldydental.co.uk/register / 23–25 Tolbooth Street, Kirkcaldy KY1 1RW / GDC No. (if a registrant is named).
- **Titles:** no "specialist" or "implant dentist" title unless the person is on the GDC specialist list.
- **Primary text:** "New NHS dental practice opening soon on Tolbooth Street. Be first in line – join our waiting list. 👋 Meet [Name], [role, GDC No. xxxxx]. We're not open yet, but we'll keep you updated before we open. We'll offer NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free to join our waiting list."
- **Why:**
  - it is a different format (a sound-on talking head);
  - it shows a real local face;
  - the honest "not open yet" builds trust;
  - it reaches the younger Reels audience the current ads miss.

### Ad 3: Kirkcaldy community notice (text only, no photo). Only if a third slot opens.
- **Format:** 4:5 static and a 9:16 kinetic-type video, 8s.
- **Design:**
  - Cream canvas in the Playfair/gold style.
  - The gold strip, button and URL are **fixed in the safe lower area from frame 0**. Only the upper text animates:
    - 0–2.5s: "NEW NHS DENTAL PRACTICE";
    - 2.5–5s: "Opening Soon!" with the diamonds;
    - 5–8s: the address with a drawn gold map pin.
  - The NHS headline leads, not a giant "KIRKCALDY", so Glenrothes and Burntisland viewers don't think "not for me".
- **On-image text:** NEW NHS DENTAL PRACTICE / Opening Soon! / [pin] 23–25 Tolbooth Street, Kirkcaldy KY1 1RW / BE FIRST IN LINE · JOIN OUR WAITING LIST / [JOIN WAITING LIST →] / kirkcaldydental.co.uk/register
- **Primary text:** "📍 New NHS dental practice opening soon in Kirkcaldy. Be first in line – join our waiting list. We'll offer NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free to join our waiting list, and we'll keep you updated before we open."
- **Why:**
  - it's the cheapest ad to build from the existing template;
  - it breaks the run of photo ads;
  - it tests whether the stock photos help or hurt.

### Ad 4: "How our waiting list works" carousel. Not before the first creative refresh.
- **Format:** lead-ad carousel, **3 cards**, 1080×1080 or 4:5.
- **Cards:**
  1. The current ad image.
  2. A cream-and-gold map of Kirkcaldy town centre with a gold monogram pin on Tolbooth Street. Draw it from scratch, or use OpenStreetMap with its credit line; never trace Google or OS maps. Text: "WHERE? 23–25 Tolbooth Street, Kirkcaldy KY1 1RW".
  3. "FREE TO JOIN OUR WAITING LIST / NHS & private dental care", then the button and URL. Add "Adults, children and families can all join" only after the owner confirms.
- **No "No" card.** The "doesn't guarantee an appointment or a place on our patient list" line stays on the form intro. If a guarantee card is ever added, it must use that same wording.
- **Primary text:** "New NHS dental practice opening soon in Kirkcaldy. Be first in line – join our waiting list. Swipe to see how it works 👉 We'll offer NHS and private dental care at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free to join our waiting list."
- **Why:** a new format, and a new angle ("is it near me, is it free?"), with no people in it, so there are no model or AI questions.

*Spare idea for a later slot:* Ad A with a natural-looking adult aged 55–70 (everyday smile, no chair or equipment). None of the current ads shows anyone over 50 or any man.

---

## 5) What NOT to change, and why

- **The "JOIN WAITING LIST →" button and the URL line, and where they sit.** The owner asked for them specifically ("we needed that little button"), and the stripped-down version did worse with the owner. Only the button's fill may change (8g), and its white label stays.
- **The headline wording and banner styling:** "NEW NHS DENTAL PRACTICE", italic "Opening Soon!" with the line-and-diamond flourishes, the gold strip "BE FIRST IN LINE / JOIN OUR WAITING LIST", cream/gold/charcoal, Playfair Display, and the K-on-D logo on feed. This is the link to the street banner and leaflet that gives locals a second sighting.
- **The full address, "23–25 Tolbooth Street, Kirkcaldy KY1 1RW", everywhere.** Owner rule in BRAND.md. Make it more legible, never shorter.
- **"For Kirkcaldy Families" on Ad B.** Approved wording.
- **"Opening Soon!" on the image,** even if a month is added to the text.
- **No NHS logo, no NHS blue, no blue box.** Plain-text "NHS" only.
- **No scarcity or guarantee language:** no "limited places", "first come first served", "taking on / accepting / registering NHS patients", "in the order you joined", or "Book now".
- **One campaign, one ad set, A and B as separate ads.** At £20/day, Meta learns fastest this way.

---

## 6) Rejected ideas, and why

| Idea | Decision and reason |
|---|---|
| Strip the C2PA/AI metadata from the photos so Meta's "AI info" label doesn't appear | **Rejected (blocked).** It hides where the images came from in a health ad, breaks Meta's rule against getting round its systems, and puts the ad account at risk. Leave the metadata in, or use licensed or real photos. |
| Meta Pixel + Conversions API as part of the launch blocker, "to lower CPL and speed learning" | **Moved to later and optional (12).** It doesn't count toward an Instant Form campaign's results. It needs a PECR consent banner and privacy changes. It may be restricted for dental advertisers. |
| Asking "Are you currently registered with a dentist?" on either form | **Removed.** Health/special-category data and Meta's lead-ads policy. Ask it on the welcome call instead. |
| Making Post code an optional question | **Rejected.** Keep it required. It screens out leads beyond 10 miles, which protects caller time. |
| Gold-only "NHS" in the headline (old C12) | **Dropped.** It would make the key word the *lowest*-contrast word (about 4.5:1 against about 11:1 for the charcoal around it), it can't be tested at this budget, and it departs from the banner. |
| Strip line 2 changed to "FREE TO JOIN · ONLY TAKES A MINUTE" (old C18) | **Dropped.** The strip is the strongest link to the banner, the copy already says "free", and it can't be tested at £20/day. |
| Dark-ink label on a light-gold button (the "preferred" contrast fix) | **Rejected.** It changes the banner's white-label pill. Only the white-text flat-gold option (8g) remains, and it's optional. |
| Paid Fife voiceover on the template videos | **Rejected.** Use a free Sound Collection track. The spoken voice goes into ad 2. |
| Interim "Stories only, untick Reels" step | **Skipped.** Launch is blocked anyway, so go straight to the new safe layout. |
| Deleting the logo from 9:16, or a small tile at top ≈ 290 | **Rejected.** Deleting it risks the owner rejecting the set. The top-290 position covered faces in the test render. The tile goes in the charcoal panel instead (step 5). |
| Merging A and B into one flexible ad, about 5 ads in week 1, or formal A/B tests | **Rejected.** At £20/day the results would be noise, and it conflicts with the launch doc's pause rule. |
| Replacing Ad A's model with an older adult now | **Deferred** to a later slot. Only the free crop (8d) happens now. |
| "Looking for an NHS dentist (for the whole family)?" opening | **Dropped by default: a compliance trade-off and the owner's call.** It's probably a strong scroll-stopper, but a question this practice "answers" suggests "we'll be your NHS dentist". The plan doesn't claim that dropping it improves performance. |
| "30 seconds" or "only takes a minute" as untimed claims | **Rejected until both forms are timed.** Say "quick to join" until then. |
| "Adults, children and families can all join" next to the NHS headline | **On hold** until the owner confirms NHS places for both adults and children. |
| Shortening the address to "Tolbooth Street · Kirkcaldy" | **Rejected.** BRAND.md requires the full address. |
| A giant "KIRKCALDY" hero word, or the button held back until 5s in the text-only ad | **Rejected.** It demotes "NHS" and hides the button. Fixed in ad 3. |
| A 5-card FAQ carousel with a "No" card and a button on every card | **Cut to 3 cards and deferred.** A "No" in an ad puts people off. The guarantee line does its job on the form. |
| "Spotted our banner?" lines in any ad other than the shopfront ad | **Rejected.** Most of the 10-mile audience hasn't seen the banner, and the line becomes false once the banner comes down. |
| Personal-health hooks ("Struggling with toothache?") | **Rejected.** Health-targeting risk under Meta policy. |

*Smaller points already built into the steps above:*
- the headline list is split into proper fields;
- the GDC website checklist (change 1);
- the HANDOFF disclaimer and checkbox kept (change 7);
- the carousel map copyright rule and guarantee wording (ad 4);
- filming privacy for the shopfront clip (ad 1);
- the GDC number and role on the talking-head ad (ad 2);
- the small fixes bundled into one render with one sign-off (8).