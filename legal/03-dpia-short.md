# Short DPIA (data protection impact assessment) – pre-opening waiting list

**Draft – not legal advice, owner to approve**
Kirkcaldy Dental & Implant Clinic · Version 1 · 8 November 2026

A DPIA is a short check of the risks to people's privacy, and what we do to reduce them. We are doing one because the list may hold health-related details and children's details, and because we use outside companies, one of them outside the UK.

## 1. What we are doing

Before the practice opens, people join a waiting list. Later we invite them to register.

**Where sign-ups come from:** Facebook/Instagram lead forms, kirkcaldydental.co.uk/register, and QR codes on the banner and leaflets.

**What the forms ask:** full name (required), phone (required), email (optional), and one optional **unticked** box for news and offers.

**What callers ask later:** household size, postcode, current dentist. Some callers may also note household members, access needs, preferred times, and whether someone is in pain (only to signpost them to urgent care).

**Where it goes:** a private Google Sheet (Google Workspace, info@kirkcaldydental.co.uk). An instant text goes to the person through ClickSend. One caller gets an alert text. The owner gets an email copy.

## 2. Our legal reasons (the "Article 6 / Article 9 record")

| What | Legal reason | Notes |
|---|---|---|
| Keeping the waiting list, the instant "thank you" text, the confirmation call, and later the invitation to register | **Legitimate interests** (UK GDPR Art. 6(1)(f)) | The person asked to join. See the check in section 3. |
| News and offers by text or email | **Consent** (Art. 6(1)(a)) and PECR reg. 22 | Only people who ticked the box. Keep the date, the form wording version and how it was given. |
| "Current dentist", pain flag, access needs, children's details | Possibly **health data** (special category). Condition: Art. 9(2)(h) health care, with DPA 2018 Sched. 1 para. 2 | Collected only by trained staff under a duty of confidence. Keep to the minimum. |
| Do-not-contact list | Legitimate interests (so we never contact someone again by mistake) | Smallest record possible. |

## 3. Legitimate-interests check (for the waiting list and update messages)

- **Purpose:** to keep a fair list of people who asked for a place, and to tell them about the list and the invitation to register.
- **Is it necessary?** Yes. We cannot invite people without their name and phone number.
- **Balance:** people expect to hear back after signing up. Messages are about the list only, with no offers or promotion. Anyone can say "stop" at any time.
- **Result:** legitimate interests is fine for **service messages only**. If a message includes any offer, promotion, or other practices in the group, it is marketing and needs consent.

## 4. Who can see the data

- The sheet is private. Today it is shared with info@ only.
- Each caller should get their **own** login (for example caller@) with edit access only to "Status" and "Call outcome". No one shares the info@ password.
- AI tools only ever see a counts-only "Stats" tab, never names or numbers.
- Never download the sheet to a personal laptop or phone. Never upload it to ClickSend or Meta.
- Two-step sign-in (2FA) is switched on for every account.

## 5. Risky columns and how we handle them

| Column / question | Risk | What we do |
|---|---|---|
| **Private interest** | Could become a record of who to sell private treatment to. Turns calls into marketing. | Only fill it if the person raises it. Never use it for marketing unless they ticked the box. |
| **Current practice** | May reveal health or registration history. | Record the practice name only, or "none". No reasons. |
| **Notes** (free text) | Staff may type health details or personal opinions. | Rule: facts only, no health details, nothing you would not want the person to read. Check it monthly. |
| **Household members and children** | Children's data. Collected from a parent. | Only names and dates of birth needed for registration, given by the parent. No other details about the child. |
| **Pain question** | Health data. Could look like a promise of care. | Ask only "Is anyone in pain now?" If yes, give the urgent-care number and write "signposted (date)". Do not record what the problem is. |
| **Consent to news and offers** | Wrong records lead to illegal marketing. | Stored per person with date and form version. Bulk messages only go to "Yes" rows. |

## 6. Outside companies (processors)

Google Workspace, ClickSend (Australia), Meta (Facebook/Instagram lead forms) and Hostinger (website). See the processor agreements list. ClickSend is in Australia, so we need the UK International Data Transfer Addendum, and a short note on why the transfer is safe.

## 7. Breach plan (72 hours)

A breach is any time personal data is lost, seen by the wrong person, or changed by mistake.

**Examples:** a caller loses their phone; the sheet is shared with the wrong person or "anyone with the link"; an email goes to many people with everyone's address visible; a text goes to the wrong number.

**Do this:**
1. **Right away – contain it.**
   - *Lost or stolen caller phone:* sign that account out everywhere (Google Admin → Devices), change its password, delete the alert texts if the phone is found, rotate any keys on it.
   - *Sheet shared by mistake:* remove the sharing at once, check the sheet's "Manage access", check the activity and version history to see who opened it.
   - *Wrong email or text:* ask the receiver to delete it, and note that you asked.
2. **Same day – write it down** in the **Breach log** tab: date and time, what happened, how many people, what data, what you did.
3. **Within 72 hours of finding out – decide on the ICO.** If it is likely to put people at risk (for example names and phone numbers of many people seen by a stranger), report it at ico.org.uk/report-a-breach or call 0303 123 1113. If unsure, report it. If there is no likely risk, write down why you did not report.
4. **Tell the people affected** without delay if the risk to them is high.
5. **Afterwards:** fix the cause and note the lesson in the log.

**Breach lead:** ______________________ **Backup:** ______________________

## 8. Risk summary

| Risk | Likelihood | Harm | After our steps |
|---|---|---|---|
| Wrong person sees the sheet | Medium | High | Low |
| Marketing sent without consent | Medium | Medium | Low |
| Health details over-collected | Medium | Medium | Low |
| Data kept too long | High | Low | Low (retention schedule) |
| Transfer to Australia (ClickSend) | Low | Medium | Low (IDTA Addendum) |

**Conclusion:** the risks are acceptable once the steps above are done. No need to consult the ICO before starting.

## 9. Review

Review this DPIA before opening, before any bulk message, and whenever we add a new tool or a new question.

Approved by (owner): ______________________ Date: ____________
