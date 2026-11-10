# Script changes

### 1. `leaflet/apps-script.gs` (leaflet chat, branch claude/brave-allen-i14xnx). MUST be done before leaflets go out.
- **Line 36.** Today every sign-up without an email is thrown away, and the old page still says "Thank you".
  - Replace `if (!p.name || !p.email) return out("missing");`
  - with `if (!p.name || String(p.phone || "").replace(/\D/g, "").length < 10) return out("missing");`
- **Line 86.** Today MailApp fails on an empty address, so every no-email row reads "Failed: …", and tracking.gs counts those as failed emails.
  - Replace `if (SEND_EMAIL && !blocked && !repeat) values["Email status"] = websiteConfirmEmail(p.email, first);`
  - with `if (SEND_EMAIL && !blocked && !repeat && p.email) values["Email status"] = websiteConfirmEmail(p.email, first);`
  - Email status then stays blank when there's no email, the same as Meta rows.
- **Redeploy:** Deploy → Manage deployments → pencil → Version: New version → Deploy. The /exec URL stays the same.
- **Optional (helps callers).** After line 85 add `if (!r && !blocked && !repeat && !/^\+447\d{9}$/.test(ukMobile(p.phone))) values["SMS status"] = "Not sent: not a mobile";`
- **No change needed for:**
  - `source`, `marketing`, `heard` and `visit`: already read.
  - `logVisit` already writes Visit ID (commit 2441aab).
  - `doPost` already returns plain `ok` via ContentService. The new page relies on this.
  - The page no longer sends postcode, people, registered, who or consent, so doPost writes blanks for those.

### 2. `leads/meta-leads.gs` (Ads chat): no change required.
- `field(l, ["full_name","name"])`, `field(l, ["phone"])` and `field(l, ["email"])` match Meta's default keys full_name, phone_number and email.
- Postcode, No. of People, Currently Registered? and Adult/Child/Family are written blank. That's harmless.
- A blank email is handled: line 288 `if (email && …)`, and the repeat check matches on phone.
- Line 247 (consent) matches Meta's documented format (`is_checked` "1" or ""), and there's only one box.
- Optional, cheap guards:
  - In `field()` (line 216), after `var n = …` add `if (n.indexOf("verified") !== -1) continue;`. Then a possible `phone_number_verified` field can never be read as the phone number. Meta doesn't document one in field_data, but OTP is on.
  - Line 277 `sh.getLastRow()` can point at a website row if doPost saves without the lock at the same moment. Writing SMS/Email status into `values` before `appendRow`, as doPost does, removes the risk.
- Script Property **META_FORM_IDS** = the new form's ID after it's published.

### 3. Google Sheet "Kirkcaldy Dental – Waiting List" (leaflet chat). Checked read-only today.
- **Lead analysis K2** (blank postcodes are counted as "Invalid" today):
  `=ARRAYFORMULA(LET(s,UPPER(REGEXREPLACE(TO_TEXT('Waiting list'!E2:E),"\s","")),IF(A2:A="",,IF(s="","Not yet asked",IF(REGEXMATCH(s,"^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$"),REGEXEXTRACT(s,"^([A-Z]{1,2}\d[A-Z\d]?)\d[A-Z]{2}$"),IF(REGEXMATCH(s,"^[A-Z]{1,2}\d[A-Z\d]?$"),s,"Invalid"))))))`
- **Lead analysis L2** (without this, "Not yet asked" would fall through to "Outside"):
  `=ARRAYFORMULA(IF(A2:A="",,IF(K2:K="Not yet asked","Not yet asked",IF(REGEXMATCH(K2:K,"^KY[12]$"),"Core",IF(REGEXMATCH(K2:K,"^KY[345]$"),"Near",IF(REGEXMATCH(K2:K,"^KY[678]$"),"Own-practice area",IF(K2:K="Invalid","Invalid","Outside")))))))`
  - S11/M49 shares are worked out only from rows whose Tier isn't "Not yet asked".
- **Dashboard C5** ("People on the list"; today a blank No. of People counts as 0, so the total would show about 0):
  `=SUMPRODUCT(ARRAYFORMULA(('Waiting list'!$B$2:$B<>"")*IF('Waiting list'!$F$2:$F="",1,IFERROR(VALUE(SUBSTITUTE('Waiting list'!$F$2:$F,"+","")),1))))`
  - Rename C4 to "People on the list (each sign-up counts as 1 until we call)".
- **Dashboard E9** (copy down to E14; each row uses its own $A):
  `=SUMPRODUCT(ARRAYFORMULA(('Waiting list'!$I$2:$I=LOWER($A9))*IF('Waiting list'!$F$2:$F="",1,IFERROR(VALUE(SUBSTITUTE('Waiting list'!$F$2:$F,"+","")),1))))`
- **Dashboard G4 / G5 (new):** label "People per sign-up (from calls)", formula `=IFERROR(SUMPRODUCT(ARRAYFORMULA(IFERROR(VALUE(SUBSTITUTE('Waiting list'!$F$2:$F,"+","")),0)))/COUNTIF('Waiting list'!$F$2:$F,"<>"),"–")`
  - Use this figure, not the total, for the "below 1.6 = family ad underperforming" rule (forecast line 188) and M53.
  - Rename E4 to "No dentist at the moment (from calls)".
- **Waiting list tab:** Postcode (E), No. of People (F), Currently Registered? (G), Adult/Child/Family (H) and How heard (U) are now filled in by the callers.
  - Use "Show a warning" only, never "Reject".
  - G must be Yes / No / Not sure, and H must be Adult / Child / Family, exactly as the Dashboard counts them.
  - In F, type the number of people (e.g. 3; "4+" also works).
- **Change log tab:** add one row, "8 Nov 2026 – form wording v1". Paste the exact notice, disclaimer and tick-box text for both forms. This is the record of what people agreed to (PECR/UK GDPR).

### 4. Callers and call script (waiting-list chat)
- After each call where the person is reached, fill in Postcode, No. of People, Adult/Child/Family and Currently Registered?.
- For rows with Source = website, also ask "How did you hear about us?" and pick How heard (Facebook or Instagram ad / Leaflet through the door / Banner on Tolbooth Street / Friend or family / Google search / Other).

### 5. Metrics plan (metrics chat), notes only
- M52 "more than 5% blank" alarm: count only rows that were reached.
- M53 people per lead: count only rows where F is filled in.
- S11: leave "Not yet asked" out.
- Line 19 "a blank counts as 1" stays right for totals.

### 6. Docs (Ads chat)
- **HANDOFF.md Step 2:** More volume with OTP on each ad; new headline and intro; three contact fields; new disclaimer and completion text; completion button goes to the home page.
- **BROWSER-CLAUDE-LAUNCH.md:**
  - §1.7(a): use the new notice;
  - §4: fields, form type, where OTP is set;
  - §7: tick SMS verification and untick Lead nurturing channels on each ad;
  - §6 test rows: Meta rows now have a blank Postcode and household columns; add the new website tests.
- **Ad B primary text** (HANDOFF line 113, CREATIVE-REVIEW line 223): "and you can tell us how many people in your household would like to join" becomes "and when we call, you can add the rest of your household".
- **leaflet/README.md line 72** (leaflet chat): drop "and a postcode".

# Corrections made by the verifier

**Checked against Meta's own help pages and today's live sheet (read-only)**

**Meta form**
1. **Completion button URL.** No `/waiting-list/` page exists on any branch (main, brave-allen, hostinger). A published form can't be changed, so the button now goes only to `https://kirkcaldydental.co.uk/?src=fb-form-done`.
2. **Purpose notice and disclaimer now cover later contact.** Meta says you "may only use the information you collect for the purposes stated in this notice" ([Create a lead ad with instant form in Meta Ads Manager](https://www.facebook.com/business/help/791294492679966)). The proposed notice covered only the confirmation and the call, which would put later waiting-list invitations outside the stated purposes. Both texts now add "contact you about your place on the list and our opening". That is a neutral service message, not marketing ([ICO: identify direct marketing](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/identify-direct-marketing/)).
3. **New switches.**
   - Each ad's **Lead nurturing → Follow-up channels** (Messenger, Instagram, WhatsApp): off ([Enable lead nurturing](https://www.facebook.com/business/help/650994050545508)).
   - **"Chat on WhatsApp" on the ending screen:** unticked, because Meta can switch it on by itself ([Add a message for leads](https://www.facebook.com/business/help/314132612401196)).
   - Phone number must be set to Required by hand. A June 2026 editor screenshot shows Phone number marked optional ([AdsUploader, 10 Jun 2026](https://adsuploader.com/blog/facebook-instant-form)).
   - "Autofill ON" was dropped: no such switch is documented. "AI agent" and "Flexible form delivery" are kept as "if shown". Flexible delivery is documented only by third parties ([Jon Loomer](https://www.jonloomer.com/11-new-meta-lead-ads-features/), [SwipeInsight](https://web.swipeinsight.app/posts/meta-introduces-flexible-form-delivery-for-personalized-instant-forms-15888)).
4. **"Straight away" became "shortly".** Meta leads arrive 1–2 minutes later, and the website now uses the same words.
5. **Household line added** to the intro and the completion screen. The form no longer asks about the household, and the line stops family members signing up twice.
6. **Fallback added** in case Meta insists on a custom question: one optional "How many people…" question, which the script already maps.
7. **Proposal claims that hold up** (checked through Meta's help-article tool today):
   - Higher intent goes only to mobile Facebook and Instagram Feed and adds a review screen ([About instant form types](https://www.facebook.com/business/help/252352181957512)).
   - For More volume, OTP is set in each ad's Destination. It needs a required Phone number and doesn't work with work phone numbers. Landlines can't verify. Re-verification is every 180 days. OTP ads run only on mobile placements.
   - Codes go by WhatsApp or SMS, and the UK isn't on the WhatsApp list, so UK codes go by SMS ([Enable SMS verification](https://www.facebook.com/business/help/898260175547909)).
   - A checkbox is required unless you click Optional, and people must accept the disclaimer to submit ([Add a custom disclaimer](https://www.facebook.com/business/help/1550411888622740)).
   - The intro headline and the completion headline are limited to 60 characters ([intro section](https://www.facebook.com/business/help/1664458123767694)). Ours are 49 and 35 (the proposal said 48).
   - Meta's lead data gives `is_checked` as "1" or "", with keys like `optional_1`, so meta-leads.gs line 247 already works ([Retrieving leads](https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads/retrieving)). The proposed checkbox_key hardening isn't needed.
8. **Kept** "doesn't guarantee an appointment" (owner-approved HANDOFF wording). It denies a promise rather than making one, so it doesn't break the "guaranteed" rule.

**Website form**
9. **"How did you hear about us?" removed from the form.** The owner wants three fields. The caller can ask it at no cost to the form, and it's one less part to break. The caller asks it for Source = website rows, and doPost still accepts `heard`.
10. **Label changed from "Mobile number" to "Phone number"**, matching Meta and the fact that landlines are accepted. The hint asks for a mobile first.
11. **Intro changed.** It no longer starts with "Be first in line", the same as the Meta form. Owner confirmation is still pending (runbook line 246).
12. **070 and 076 numbers are now rejected.** They aren't mobiles, and 070 is a premium-rate range.
13. **"No email given" dropped.** Blank-email rows leave Email status blank, the same as Meta rows, and tracking.gs only counts "Failed/Bounced" as bad.
14. **Server-side check.** doPost now rejects a phone with fewer than 10 digits, as well as a missing name.
15. **Outdated proposal claim.** "logVisit ignores p.visit" was fixed in commit 2441aab (8 Nov 22:01). No change is needed.
16. **Status line** now says up to 30 seconds, not 20: tryLock alone can wait 20 seconds.
17. **Privacy page fixes added:**
    - Visit ID now links a visit to its sign-up, so "not linked to you" would become false.
    - Household details collected on the call are now listed.
    - The lawful basis no longer says "consent".
    - Complaints come to the clinic first, acknowledged within 30 days, as required since 19 June 2026 ([CMS](https://cms.law/en/gbr/legal-updates/data-use-and-access-act-2025-new-statutory-rules-on-handling-data-protection-complaints-from-19th-june-2026), [DLA Piper](https://privacymatters.dlapiper.com/2026/06/uk-new-complaints-handling-rules-under-duaa-take-effect-on-19-june-2026-are-you-ready/)).

**Where the two proposals disagreed, and how it was settled**
18. **People count.** The website proposal said the Dashboard already counts a blank No. of People as 1. That's wrong: the live Dashboard C5 and E9:E14 count a blank as 0 (only Lead analysis J counts it as 1). The Meta proposal said to work it out from filled rows only. Both are now used: totals count a blank as 1, and the people-per-sign-up figure and its alarms use filled rows only.
19. **Postcodes.** In the live sheet, Lead analysis K turns a blank postcode into "Invalid", so both proposals were right about the false alarm. L also needs a fix, or "Not yet asked" becomes "Outside".

**Still unverified**
- Whether this ad account's editor offers "Optional" on Email. The fallback is Required.
- Whether Meta saves a form with only contact fields. It's very common in practice, and the fallback question covers it.
- Whether the browser can read Apps Script's reply. It's a simple POST answered via a redirect to googleusercontent; community sources only ([DEV](https://dev.to/jpoehnelt/youre-probably-using-curl-wrong-with-your-google-apps-script-web-app-1ed8), [Google Groups](https://groups.google.com/g/google-apps-script-community/c/zJpevovcFLA)). Setup-night tests 6 and 9 check it.
- The lawful-basis wording. Not legal advice: the compliance lead should confirm it.

# Plain summary

- Both forms now ask for the same 3 things only: full name, phone number (both must be filled in) and email (optional). Nothing else.
- Postcode, how many people and who it's for are gone from both forms. Your caller asks these on the call and types them into the sheet.
- Both forms have one tick box for news and offers. It starts unticked and nobody has to tick it. That keeps any later offers legal.
- Facebook form: Facebook texts a code to check every phone number, so fake numbers can't get in. It uses the shorter "More volume" type, which also shows in Stories and Reels. The thank-you button goes to your home page.
- Website form: landlines are accepted (they get a call, not a text). The page only says "thank you" when the sign-up is really saved. If something is broken, it says so and gives your email address.
- Before leaflets go out, the leaflet chat must make 2 small script fixes. Right now the script throws away any website sign-up without an email.
- The sheet's dashboard needs 4 formula fixes. Without them, the people count and postcode checks look wrong while callers are still filling in details.
- The privacy page must be updated before the Facebook form goes live. The form links to it and can't be changed after it's published.