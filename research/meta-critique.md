## Playbook review: corrections and additions

**Checked and correct, no change needed:**
- The UK 2% location fee did start on 1 Jul 2026 (announced 10 Mar 2026). It is not shown in Ads Manager ([Digital Applied](https://digitalapplied.com/blog/meta-europe-location-fees-july-2026-advertiser-guide); [The Star](https://www.thestar.com.my/tech/tech-news/2026/03/11/meta-to-charge-advertisers-a-fee-to-offset-europe039s-digital-taxes)).
- Marketing API v24.0 is available until 10 Nov 2026, v26.0 came out on 29 Jul and v27.0 on 4 Nov ([changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog)).
- Ofcom's business-SMS rules start on 15 Jul 2027 ([Ofcom](https://www.ofcom.org.uk/phones-and-broadband/scam-calls-and-messages/new-rules-to-protect-people-and--businesses-against-mobile-messaging-scams)).
- The GDC items (registration number, website contents, "specialist") match the [GDC guidance](https://www.gdc-uk.org/standards-guidance/standards-and-guidance/gdc-guidance-for-dental-professionals/guidance-on-advertising).
- The Glenrothes figures do total 4,985, and the SMS is 144 characters.

### (a) Wrong, outdated or overstated
1. **`date_format` and `GET /?ids=` do not "fail on every version since 27 Oct".** Both were deprecated in v26.0. Since 4 Nov 2026, new apps can't use them and existing apps can't add new uses of them. Existing apps can keep their current use on older versions that are still supported. Both stop working for everyone in v28.0. [Meta dev blog](https://developers.facebook.com/blog/post/2026/11/04/introducing-graph-api-v27-and-marketing-api-v27/)
2. **The API deadline only matters if the script is on v24 or earlier.** v25.0 is supported until 23 Feb 2027. Plain Graph API versions last about 2 years (v21.0 is removed on 21 Jan 2027), so it is not certain the leads edge is tied to 10 Nov. Upgrade to v27 anyway, without treating it as an emergency. [changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog); [blog](https://developers.facebook.com/blog/post/2026/11/04/introducing-graph-api-v27-and-marketing-api-v27/)
3. **Provisional listing can last up to 12 months, not "at most 6".** Reg 4A(3) gives six months, and reg 4B(1) allows "a second period of six months". [SSI 2025/380](https://www.legislation.gov.uk/ssi/2025/380/made)
4. **Calling at 8am at weekends is not a breach.**
   - The old DMA wording (9pm–9am at weekends) came with "unless an express invitation to do so is received".
   - The current DMA Code only says to avoid "antisocial" times. It sets no fixed hours.
   - These calls were asked for, and the ICO says solicited calls fall outside most PECR rules. Callers still have to identify themselves and show a number.
   - A 9am weekend start is a choice for the owner, not a legal requirement.
   - [Call Centre Helper](https://www.callcentrehelper.com/regulations-on-outbound-calling-times-207054.htm); [DMA Code](https://dma.org.uk/uploads/misc/the-dma-code.pdf); [ICO](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/)
5. **Auction overlap is described wrongly.** Your own ads don't bid against each other. Meta enters only the ad with the highest total value and the other one loses delivery. Loomer describes this within one ad account; I couldn't verify "even from separate ad accounts" because Meta's page wouldn't load. The fix stays the same: exclude Glenrothes postcodes. [Jon Loomer glossary](https://www.jonloomer.com/glossary/auction-overlap/)
6. **Plan on VAT not being reclaimable.** NHS dental services are VAT-exempt, and VAT on costs that relate to exempt supplies normally can't be recovered. Budget about £24.48 for every £20 rather than leaving it as "check with accountant". [VAT Notice 701/57](https://www.gov.uk/guidance/health-professionals-pharmaceutical-products-and-vat-notice-70157)
7. **The Higher intent form clashes with the 9:16 work.** If Higher intent only delivers to mobile Facebook and Instagram Feed, then the Stories and Reels versions, the Reels safe-zone advice and the "1.75× via Advantage+ placements" inventory assumptions won't apply. Put the creative effort into 4:5 Feed assets and keep 9:16 for the More-volume fallback form. [RelevantAudience](https://www.relevantaudience.com/facebook-ads/facebook-lead-ads-instant-forms-guide/); [AdsUploader](https://adsuploader.com/blog/facebook-instant-form). Meta's own page could not be loaded.
8. **The capacity maths mixes up calls and leads.**
   - The formula uses "80 calls", but the owner's figure is 60–80 *leads* a day.
   - Making 3 attempts per lead means each lead takes about 1.5–3 dials, so base the sizing on dials, not leads.
   - The "≥70 leads" pause rule is above the low end of capacity (60). Set it around 55 unless both callers are working.
9. **The playbook contradicts itself on the number of creatives.** The summary and step 16 say "4–6"; §4 and the Top 10 say "5–6". Pick one number.
10. **Minor: the 125/40/25-character figures are Meta's recommended lengths before text is cut off, not hard limits** (our judgement, not re-checked).

### (b) Missing
1. **A 10-mile pin reaches across the Forth into north Edinburgh.** Straight-line distances from Tolbooth Street: Newhaven 9.1 miles, Leith 9.3, Granton 9.4 (NHS Lothian area). Levenmouth is 8.6 and Glenrothes 5.9. Use postcode districts only (KY1, KY2, and KY3–KY5 if wanted), and never EH, KY6 or KY7. These distances are our own haversine calculation.
2. **In Scotland, joining a new practice takes the patient off their old practice's list.**
   - Registration is "for life unless withdrawn". Registering with a new dentist automatically removes the patient from the old list.
   - This means Kirkcaldy will pull patients away from the owner's Glenrothes list. Callers must tell people this, and the FAQ page should explain it.
   - Consider a Q3 option for the sister practice (our judgement).
   - [NHS inform](https://www.nhsinform.scot/care-support-and-rights/nhs-services/dental/receiving-nhs-dental-treatment-in-scotland); [Citizens Advice Scotland](https://www.citizensadvice.org.uk/scotland/health/nhs-healthcare-s/nhs-dental-treatment-s/)
3. **There is a factual, compliant angle for the FAQ and creative.** NHS dental examinations are free for everyone in Scotland, and under-26s have free NHS dental treatment. Confirm the exact wording first. [NHS inform](https://www.nhsinform.scot/care-support-and-rights/nhs-services/dental/receiving-nhs-dental-treatment-in-scotland); [Scottish Dental](https://scottishdental.nhs.scot/scottish-government-policy-on-nhs-dentistry-for-under-26s)
4. **Use a system user token instead of a personal long-lived Page token.** A personal token stops working if that person changes their password or loses their role. Meta says system user tokens don't expire and are "less likely to be invalidated". Also check how Leads Access Manager is set up. [Meta auth docs](https://developers.facebook.com/docs/marketing-api/get-started/authentication)
5. **A new ad account has a daily spending limit.** Meta doesn't publish it. It rises with good standing and Business Verification, and it could block scaling to £135–£270 a day. [Jon Loomer](https://www.jonloomer.com/glossary/daily-spending-limit/)
6. **Watch the SMS character encoding.** One curly apostrophe (’) or en dash (–) switches the message to Unicode, which allows only 70 characters per part. The 144-character text would then go as 3 parts at 3× the cost. Use straight characters and turn on ClickSend's GSM-only setting. [ClickSend](https://help.clicksend.com/13993-SMS/how-many-characters-can-i-send-in-an-sms)
7. **Overnight caller alerts will ping staff phones all night.** Hold overnight leads and send one 8am summary instead. Any follow-up SMS after missed calls should also go only between 8am and 9pm (our judgement).
8. **Prepare a comment-moderation script.** NHS ads will draw comments asking "are you taking NHS patients?". Replies must avoid "accepting" or "taking on". Hide comments that contain personal data (our judgement).
9. **Meta may flag NHS-themed ads as "social issue" (health) ads.** Keep the copy commercial and say nothing about the shortage of NHS dentists in Fife. If an ad is flagged, appeal rather than going through authorisation. This is unverified, because my search budget ran out.
10. **The website and pixel need attention.**
    - If the FAQ page carries a Meta Pixel, PECR requires consent for advertising cookies ([PECR reg 6](https://www.legislation.gov.uk/uksi/2003/2426/regulation/6)).
    - Meta limits mid- and lower-funnel optimisation for healthcare websites in Europe, but has not restricted on-platform lead forms ([Medico Digital](https://www.medicodigital.co.uk/insights/meta-ad-policy-changes/)).
11. **Before launch:** sign a DPA with ClickSend, which is an Australian provider, so a UK IDTA or Addendum is needed. Also confirm Google Workspace's DPA. Set a retention period for list entries that never register, and plan a re-confirmation SMS if opening slips ([UK GDPR Art 5(1)(e)](https://www.legislation.gov.uk/eur/2016/679/article/5)). Check that the ad account time zone is Europe/London, because the "leads today" rule and the budget day follow it (our judgement).

### (c) Conflicts with the owner's constraints
1. **NHS-only wording vs GDC "mixed" status.** The GDC says practices must "make clear in advertisements and other practice publicity whether the practice is NHS" or mixed or wholly private. If implants are private, "New NHS dental practice opening soon" on its own may not be enough in the ads themselves. The owner has to decide the wording. [GDC](https://www.gdc-uk.org/standards-guidance/standards-and-guidance/gdc-guidance-for-dental-professionals/guidance-on-advertising)
2. **The SMS invites calls the 2 callers can't absorb.** "Questions? 01592 XXXXXX" undoes the reason for using "View website" as the completion CTA. Use one of these instead:
   - an FAQ link on the full domain, not a shortened link;
   - an answerphone number;
   - a ClickSend virtual number that can receive replies, instead of an Alpha Tag.
3. **The disclaimer wording changes the owner's approved hours.** The 9am weekend split and the line about an instant text both change the approved "8am–9pm" wording. They are fine only with the owner's sign-off. The 9am weekend start is optional (see a4).
4. **The banned phrase is most likely to slip into two new pieces.** The carousel card "Who can join" and the unscripted team video are where "accepting/taking on NHS patients" could appear. Script both word for word. The pause notice must not read as "limited places" or "list full – hurry".
5. **"Be first in line" is allowed by the owner but is safe only if calls follow sign-up order.** If calls are reordered by postcode screening or household size, drop the line ([CAP Code s3](https://www.asa.org.uk/type/non_broadcast/code_section/03.html)).
6. **The "5–15 minute" first call can't happen overnight.** With calls only 8am–9pm and 2 callers, overnight leads wait up to 11 hours. No message should promise a quick call. The playbook already removes "very soon"; keep it removed.

I ran out of web searches before checking the social-issue risk (b9), the GDC consultation dates and the ASA Pulse figures, so those are still unverified. Meta Help Centre pages would not load, so a5 and a7 rest on third-party sources.