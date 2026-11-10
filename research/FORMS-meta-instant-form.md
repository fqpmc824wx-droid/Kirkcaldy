## Meta Instant Form: final spec (v1)

Build it in **Ads Manager**, during ad creation: Destination → Instant form → Create form. Do not use Business Suite. **Save as DRAFT.** Show the owner the phone preview and publish only after a clear "yes". A published form can't be edited, only duplicated, and the copy gets a new Form ID.

**Do not publish until all three are true:**
1. NHS Fife's written confirmation is in hand (the NHS wording can't be changed later).
2. https://kirkcaldydental.co.uk/privacy.html loads on mobile data and already shows the updated text (see the website spec, privacy section).
3. The owner has said "yes" to the draft preview.

### Form type
- Form name: `KDIC waiting list v1 – Nov 2026`
- Form type: **More volume** (the default).
- **Flexible form delivery** (if shown, at the bottom of Form type): **Off.** Don't let Meta skip or reorder parts of the form.

### Intro
- Background image: **Use the image from your ad.**
- Greeting: **On.**
- Headline (49 of 60 characters): **Join our waiting list – opening soon in Kirkcaldy**
- Description (Paragraph): **"Kirkcaldy Dental & Implant Clinic is a new NHS dental practice, also offering private treatments, opening soon at 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. It's free to join our waiting list, and one sign-up covers your whole household. We'll keep you updated about your place and our opening. Joining doesn't register you with the practice yet, and doesn't guarantee an appointment or a place on our patient list. Please sign up here rather than calling in at the practice."**
  - If the editor says the text is too long, delete the last sentence only.

### Questions
- Custom questions: **none.** Conditional logic: **Off.**
  - Fallback, only if Meta refuses to save without a custom question: add ONE **optional** multiple-choice question, copied word for word: "How many people would you like to add to the waiting list?" with answers 1 / 2 / 3 / 4+. The script already maps it to No. of People.
- Description box (how the information is used): **"We'll use these details to add you to our waiting list, confirm it by text (and by email, if you give one), call you about it between 8am and 9pm, and contact you about your place on the list and our opening."**
- Contact information (+ Add category). Use exactly these three fields, in this order:

| # | Field (Meta prefill) | Label people see | Setting | Why |
|---|---|---|---|---|
| 1 | User information → **Full name** | Meta's own "Full name" | **Required** | The caller greets them by name, the text uses the first name, and NHS registration needs it. Use one Full name field, not First + Last. |
| 2 | Contact fields → **Phone number** (never "Work phone number") | Meta's own "Phone number" | **Required.** If the editor shows it as "optional", switch that off. | Every text, caller alert, call and repeat check depends on it. Required is what makes the text-code check available. |
| 3 | Contact fields → **Email** | Meta's own "Email" | **Required** (owner decision 9 Nov). Leave "Collect work email address" **off**. | For the confirmation email and as a backup contact. Meta fills it in for most people. |

- **Do NOT add:** Post code, First/Last name, "How many people", "Who is this for?", "Are you currently registered…", or anything else. The caller collects all of those on the call.
- Settings → **Field names: leave the defaults** (full_name, phone_number, email). The script finds the fields by these names.

### Privacy policy
- Link text: **Privacy policy**
- URL: **https://kirkcaldydental.co.uk/privacy.html**

### Custom disclaimer
- Title: **How we'll contact you**
- Text: **"By tapping Submit, you're asking Kirkcaldy Dental & Implant Clinic to add you to our waiting list. Joining doesn't register you with the practice yet. We'll text you a confirmation shortly (and email you, if you gave your email), call you about your request between 8am and 9pm, and contact you about your place on the list and our opening. We won't send you marketing unless you tick the box below. Our privacy policy explains how we use your details and how to complain."**
- **+ Add new consent, ONE box only:** "Yes, also send me news and offers from Kirkcaldy Dental by text and email. I can opt out at any time."
  - Click **Optional.** Meta makes a box required unless you do.
  - It is not pre-ticked.
  - Add no other box and no "I agree" box: Meta already makes people accept the disclaimer before they can submit.

### Ending (Message for leads)
- Headline (35 of 60 characters): **Thanks – you're on the waiting list**
- Description: **"We'll text you a confirmation shortly. Our team will call you between 8am and 9pm to confirm your details. One sign-up covers your whole household, so there's no need to sign up again – we'll take their details when we call. Need urgent dental care now? Contact your current dentist, or NHS 24 on 111 out of hours."**
- Call to action: **Go to website / View website** → **https://kirkcaldydental.co.uk/?src=fb-form-done**. Button text: "View website".
  - Never "Call business".
  - Never /waiting-list/: that page doesn't exist on any branch, and the form can't be changed later.
- **Chat on WhatsApp:** unticked. Meta can tick it automatically if the Page is linked to WhatsApp.
- **Start a conversation on Messenger:** unticked.

### Settings on EVERY ad (Ad A, Ad B and any ad added later)
- **Destination:** this form. Tick **"Require SMS verification to submit form"**, and pick **Required** if Meta offers Required/Optional.
  - If the box is greyed out, Phone number isn't set to Required.
  - With More volume, this setting is per ad, not in the form editor.
- **Lead nurturing → Follow-up channels:** untick Chat on Messenger, Chat on Instagram and Chat on WhatsApp. Nobody watches those inboxes, and people may post health details there.
- **Lead capture AI agent / AI chat** (if shown): **Off.**

### What people see
Ad → Sign up → intro screen → contact screen (name, phone and email already filled in) with the notice, disclaimer and box → Submit → enter the text code → thank-you screen.
- In the UK, Meta sends the code by SMS. Someone who has verified isn't asked again for 180 days.
- Landlines can't verify. Those people use the website form, which accepts landlines.
- Text-code ads show only on mobile Facebook and Instagram placements, Stories and Reels included.

### After publishing
- Copy the Form ID into Script Property **META_FORM_IDS** (comma-separated; keep any old ID until its ads have stopped).
- Wording check: "waiting list" only. No "accepting / taking on / registering NHS patients", "first come first served", "limited places", "free NHS dentist" or "guaranteed".

### Tests (Lead Ads Testing Tool → Preview form, with the owner's REAL mobile)
Press "Delete lead" before each test.
1. Email blank, box unticked. Expect:
   - a row with Source facebook;
   - **Phone shows the real +447… number**;
   - Email and Email status blank;
   - **Marketing consent = No**;
   - Postcode, No. of People, Adult/Child/Family and Currently Registered? blank;
   - the thank-you text arrives, plus the caller alert if it's 8am–9pm.
   - If Submit won't work without the box ticked, the box is wrongly Required. Fix it before publishing.
2. Box ticked. Expect **Marketing consent = Yes**.
3. On a phone, use the ad preview to check the text-code step and that the completion button opens the home page.