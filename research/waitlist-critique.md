# Critique of the waiting-list playbook: corrections and additions

**Where the evidence comes from.** I read the primary documents for PCA(D)(2026)1, the GDS Regulations Sch 1 and Sch 5, DMCC Sch 20, the Equality Act Sch 3 para 30A, the SDAI circulars and the GDC advertising guidance. Some pages could not be fetched: NHS inform, NHS Fife and the ICO returned 403 errors, and transform.england.nhs.uk is not on this session's allowed network list. The web-search allowance for this run also ran out before I could check a few points. Each of those is marked "unverified" below.

## (a) Compliance corrections

1. **The published ordering rule conflicts with the owner's wording rule.** "We generally invite people in the order they joined" is first come, first served in all but name, and it encourages people to rush to sign up. Suggested wording: "We invite people in stages as appointments become available, keeping households together. Signing up more than once won't change your place."
2. **E1 links to the group's other Fife practices.** That is promotion inside a service message. Under PECR, a promotional element can turn the whole message into marketing ([ICO Allay Claims MPN, Jan 2026](https://ico.org.uk/action-weve-taken/enforcement/2026/01/allay-claims-ltd-mpn)). Move those links to Stream B. The ICO page can now be cited directly, so the playbook's "could not be read" note can go. The Data (Use and Access) Act's PECR changes started on **5 Feb 2026**: maximum fines rose to £17.5m or 4% of turnover, and the consent rules for a practice like this did not change ([Mishcon](https://www.mishcon.com/news/data-protection-and-electronic-privacy-reform-whats-hot-and-whats-not)).
3. **The urgent-care routes are wrong in places.**
   - Before registration: 111 is the out-of-hours route. In hours, S1 and the call script should give NHS Fife's dental line for unregistered patients. The Courier cites 01592 226555 (unverified; confirm with NHS Fife).
   - After registration: the practice must treat its registered patients' urgent problems in hours, and staff "should not advise patients to wait and call the out of hours service or NHS 24" ([PCA(D)(2026)1 paras 25–27](https://www.publications.scot.nhs.uk/files/pca-d-2026-01.pdf)). Add this to the reception script.
4. **Missed-appointment charges: the "conflict" is overstated.** PCA(D)(2026)1 is a Chief Dental Officer circular dated 4 Feb 2026, and para 15 allows charges for a patient "who has entered into a capitation arrangement". That arrangement starts at acceptance, which is the examination and charting (para 10; [Sch 1 para 5(2)](https://www.legislation.gov.uk/ssi/2010/208/schedule/1/paragraph/5)). So **missing the first exam can never be charged**. That is the legal reason behind the playbook's rule. The 2023 press quote is weaker evidence and should be dropped.
5. **Deposits.** Para 13 allows a reasonable deposit for treatment appointments *after* the exam, but not for patients who are exempt or have their charges remitted (para 14). "Never for NHS care" is a stricter house policy, not the law, and should be labelled that way. E5 says "we never ask for payment or ID", which is too broad. Adults may owe NHS charges for treatment after the exam, and may be asked to show proof of exemption when signing the GP17. Limit the line to "to join the list or book your first examination".
6. **Selection criteria.**
   - The regulations forbid ending a patient's registration for reasons relating to "race, gender, social class, age, religion, sexual orientation, appearance, disability, or medical condition" (PCA para 33). NHS Fife may apply the same test to who gets accepted. That makes **child-first (age) and SIMD priority (social class)** questions for NHS Fife.
   - SIMD is not protected under the Equality Act, so the playbook's Equality Act reason for avoiding SIMD priority is wrong.
   - The age "concessions" exception in [Equality Act Sch 3 para 30A](https://www.legislation.gov.uk/ukpga/2010/15/schedule/3/paragraph/30A) may support child-first. Add it to the Check item.
   - Never use the medical-history form, pain flags or treatment complexity to push anyone down the list.
7. **Wave 0 (staff and family first) breaks the published rule.** Either disclose it or keep it small and log it.
8. **SDAI details** ([PCA(D)(2023)2](https://www.scottishdental.nhs.scot/wp-content/uploads/2023/04/PCAD20232-Revised-Scottish-Dental-Access-Initiative-25-April-2023.pdf)):
   - A "new patient" excludes anyone registered in the last 36 months with a contractor who provides or provided GDS *at this practice*. Glenrothes patients only fail to count if the same dentists bring them across.
   - The conditions last 7 years, require 10 GDS sessions a week, and the grant is clawed back if registrations fall.
   - The 12-month clock starts at the **first grant payment**, so don't draw it before the invitation process is running.
   - Kirkcaldy is confirmed as eligible in [PCA(D)(2025)1](https://www.publications.scot.nhs.uk/files/pca-d-2025-01.pdf) (10 Mar 2025).
9. **GDC rules** ([guidance](https://gdc-uk.org/standards-guidance/standards-and-guidance/gdc-guidance-for-dental-professionals/guidance-on-advertising)):
   - The "may not be appropriate for every patient… conditional on a satisfactory assessment" wording applies to **any treatment promoted on marketing or social media sites**, including Meta ads, not only implants.
   - The website must show each registrant's **qualification and the country it came from**, not just GDC numbers.
   - Implantology is not a GDC specialist list. Never say "implant specialist"; "special interest in implants" is allowed.
   - In ads, the courtesy title "Dr" must be clearly qualified ([ASA](https://www.asa.org.uk/advice-online/use-of-the-term-dr-dentists.html)). This affects B1.
   - The GDC consultation ran from 2 June to 31 Aug 2026 and has closed. The 2013 guidance still applies ([GDC](https://www.gdc-uk.org/news-blogs/news/detail/2026/06/02/gdc-consults-on-replacing-the-'silver-book'-with-new-professionalism-framework)).
10. **Complaints routes are incomplete.** NHS complaints go to the practice's own NHS complaints procedure or to NHS Fife, then to the SPSO (no source checked this run). Private complaints go to the Dental Complaints Service. A data-protection complaints process is now also required: it has applied since 19 June 2026, and complaints must be acknowledged within 30 days ([DLA Piper](https://privacymatters.dlapiper.com/2026/06/uk-new-complaints-handling-rules-under-duaa-take-effect-on-19-june-2026-are-you-ready/)).
11. **PECR and UK GDPR gaps.**
   - The Meta Pixel on the sign-up page needs cookie consent *before* it loads ([PECR reg 6](https://www.legislation.gov.uk/uksi/2003/2426/regulation/6); the new Data (Use and Access) Act exemptions do not cover advertising pixels, unverified this run). Never pass form answers to Meta.
   - Uploading the list to Meta as a Custom Audience must be covered in the privacy notice.
   - Marketing consent must name the channels and the business. Consent given to Kirkcaldy does not cover marketing from the other group practices.
   - If callers raise private treatment themselves, the call becomes a marketing call and the number needs a TPS check ([PECR reg 21](https://www.legislation.gov.uk/uksi/2003/2426/regulation/21)). Keep any mention of private care to answering questions.
12. **Health data in the Sheet.** Access needs, nerves, pain flags and medical forms are special category data. That needs:
   - an Art 9 condition (9(2)(h) plus DPA 2018 Sch 1 para 2);
   - a data protection impact assessment;
   - role-based access for overflow staff;
   - a data-sharing or processor agreement if the other practices are separate companies;
   - a retention schedule, with a minimal suppression list kept for DO NOT CONTACT.

   Medical forms should not be stored in Sheets.
13. **"Free" and scarcity claims in ads.** "Free NHS dentist" is misleading, because adults pay 80% of treatment costs up to £384 ([NSS](https://www.nss.nhs.scot/dental-services/dental-reform/dental-reform-an-overview/); [DMCC Sch 20 para 23](https://www.legislation.gov.uk/ukpga/2024/13/schedule/20)). "Free examination" is fine. Also add Sch 20 para 20, which bans materially inaccurate claims about availability. Until the dentists are on NHS Fife's dental list, NHS wording should say "subject to NHS Fife approval".
14. **The private emergency appointment offer (Section 6, item 8)** contradicts the script ("we can't see people… for urgent problems") and the rule of keeping private care out of the NHS journey. Offer it only when someone asks.

## (b) Claims and sources that need correcting

- **The "empathy" message did not fail in two trials.** It was tested in Trial 2 only, with 10.7% missed appointments against 8.2% for the specific-cost message ([PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0137306)).
- **Read-back on its own cut missed appointments by about 3.5%** ([JRSM](https://pmc.ncbi.nlm.nih.gov/articles/PMC3308641/)). The 31.7% came from read-back combined with written commitments and posters showing how many people attended. A positive message such as "most patients attend" is the version that worked.
- **The Edinburgh figures (55% of clicks between 3pm and 9pm, five in six using the booking page) came from a recall message to lapsed existing patients**, not new sign-ups ([dentistry.co.uk](https://dentistry.co.uk/2026/09/22/nhs-dental-participation-scotland/)).
- **Marshfield is a US rural medical network, not a dental one.** The odds ratio for booking more than 4 weeks ahead is 5.45. "Previous missed appointment" cannot flag a first appointment, so use it only for patients rebooked after a miss ([PMC11149957](https://pmc.ncbi.nlm.nih.gov/articles/PMC11149957/)).
- **The capacity formula overbooks by mistake.** Dividing by the attendance rate books about 25% more people than there are slots, which contradicts the playbook's own "don't overbook yet" rule. Use households = slots ÷ (people per household × booking rate) = 120 ÷ 1.4 ≈ **86 households**.
- **Daily volume is overstated.** 1,200–2,600 sign-ups a month is 40–87 a day over 7 days, or 55–118 per weekday. These are households, not people.
- **Registration rules.** Cite PCA(D)(2026)1 para 10 for when registration happens. The same paragraph says a dental nurse or therapist can accept under-3s, which frees dentist time.
- **Missing citation.** The "25% of freed slots refilled" figure comes from [JMIR 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13395261/): a median fill rate of 25% (IQR 15–34%) across 90 US health systems.
- **Prior-approval tiers.** The tiers depend on how much experience a clinician has in Scottish primary care, and they have applied since 1 Nov 2026. The source does not say "newly listed = Tier 2" ([sdmag](https://www.sdmag.co.uk/2026/02/11/financial-threshold-for-general-dentistry-removed/)).
- **Broken-looking links.** Replace the Europe PMC API links with [PubMed 24310741](https://pubmed.ncbi.nlm.nih.gov/24310741/) (Cochrane) and [PubMed 21968040](https://pubmed.ncbi.nlm.nih.gov/21968040/) (Perry).
- **Claims I checked and found correct:** Aesthetix (the 48.9% figure is "at the median practice"), Lenny Rachitsky (informal poll, sample size unknown), AJMC (54,066 patients, 4.4% vs 5.3–5.8%), the PHS figures (95.1%, 62.1%, 53.4% vs 62.4%), Healthwatch (23%), the £384 cap, and the DMCC paragraph numbers 7, 13, 23 and 28.

## (c) Practical gaps: 2,000+ sign-ups with 2 callers

- **The workload doesn't fit.** My estimate is about 7 minutes of caller time per sign-up across 1–3 attempts. At 2,600 sign-ups that is about 300 hours a month, against roughly 245 productive hours from 2 full-time callers. The 8am–9pm, 7-day window is 91 hours a week, against 75 staffed. That is before re-check calls (25% of a 4,000-person list not replying would mean 1,000 calls per cycle), invitation chasers and reminder calls.
  - **Fix: confirm digitally first.** S1 links to a short household form. Callers phone only people who haven't completed it within 48 hours, plus anyone flagged for pain, access needs or an interpreter, or who asks for a call.
  - **Set a realistic target:** flagged people the same day, everyone else within 3 working days.
  - **Move caller time to booking and attendance.** Here demand already exceeds supply, so the gym and spa "speed to lead" evidence doesn't transfer. The invite → book → attend stage is where calls change outcomes.
  - **Stagger shifts** to cover 3–9pm and Saturdays.
- **Data model.**
  - Use one row per person, linked by a household ID, with a status for each person. GP17s, partial missed appointments and the applicant for each child all work per person.
  - Deduplicate by mobile number, email, and postcode plus surname, and send an automatic "you're already on the list" reply.
  - Use Meta's "higher intent" lead forms and validate phone numbers.
- **Running the Sheet at this scale.**
  - Assign and lock rows so two people don't call the same person.
  - Protect ranges, use dropdowns, and fill timestamps automatically.
  - Google allows about 100 people to edit at once (unverified), which the overflow rota could reach. Plan a move to a CRM or the practice software's waiting-list module.
- **SMS and phone set-up.**
  - Text names like "Kirkcaldy Dental" cannot receive replies. YES, CHANGE and LEAVE need a two-way virtual mobile number and a monitored inbox for free-text replies.
  - Use links on your own domain, never shorteners, so messages don't look like scams.
  - Call from the practice's number through a softphone, not from staff mobiles. This helps answer rates and keeps call data off personal devices.
- **Inbound calls.** Keep inbound separate from outbound, with a phone menu and callbacks. Expect spikes after every send.
- **Honest waiting times.** Expected wait = people ahead ÷ weekly registration capacity. For example, 4,000 people at 87 a week is about 46 weeks; at the Glenrothes peak rate (about 600 a week) it is about 7 weeks. Use this to set "first invitations from [month]" and the point at which you stop advertising (more than 12 weeks). Make S1's "[today / within 2 days]" depend on the current backlog.
- **Email.** Warm up the new domain gradually. Stream B needs a one-click unsubscribe, which Google requires from bulk senders ([Google](https://support.google.com/a/answer/81126)).
- **Household booking.** Many booking tools can't book several patients in one go, so send families to phone booking.
- **Overflow staff.** Train them in data protection, safeguarding, the script and abuse handling, and spot-check calls for quality.