# Browser Claude – jobs to do NOW (9 Nov), before setup night

Owner: Nas. Read OWNER-DECISIONS.md and BRAND.md first. You have the owner's **full permission**: don't ask for approval, just do it and report. **Never type or ask for passwords**: if a login is needed, ask the owner to log in, then carry on.
Wording rules: "waiting list" only. Never write "accepting / taking on / registering NHS patients", "first come first served", "limited places", "free NHS dentist" or "guaranteed". **No phone number anywhere yet** (never the Dentally placeholder).

Images are in Google Drive → "Kirkcaldy Dental – Print files & marketing" → **"4. Logo & Brand"**:
- `Facebook profile picture (1080x1080).png`
- `Facebook cover (1640x624).png`

## 1. Facebook Page (the existing Page "KirkcaldyDental", ID 1421462957723791; do NOT create a new one)
1. **Name:** change it to **Kirkcaldy Dental & Implant Clinic** (Settings → Page setup → Name). Meta may review the new name; that's fine.
2. **Profile picture:** upload the profile picture PNG. Check it looks right in the circle.
3. **Cover photo:** upload the cover PNG. Check nothing important is cut off on a phone.
4. **Category:** Dentist & Dental Office.
5. **Intro/Bio:** "New NHS dental practice opening soon at 23–25 Tolbooth Street, Kirkcaldy. NHS & private dental care. Join our waiting list."
6. **Contact:**
   - Address: 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.
   - Email: info@kirkcaldydental.co.uk.
   - Website: `https://kirkcaldydental.co.uk/?src=fb-page`.
   - Phone: leave EMPTY.
   - Hours: "Opening soon", or no hours.
7. **Action button:** "Sign up" → `https://kirkcaldydental.co.uk/register/?src=fb-page`. If the website isn't live yet, add the button later and note it.
8. **Admins:** check who has access (Settings → Page access). Write down the names. Add a second trusted admin if the owner names one.
9. **Messaging:** turn on an instant reply: "Thanks for your message! We're a new NHS dental practice opening soon at 23–25 Tolbooth Street, Kirkcaldy. You can join our waiting list at kirkcaldydental.co.uk/register and we'll be in touch before we open. Please don't send health details here."
10. Don't post anything and don't boost anything yet. Ads are set up on setup night, from BROWSER-CLAUDE-LAUNCH.md.

## 2. Instagram
1. If the clinic has an Instagram account, open it. If not, create one with info@kirkcaldydental.co.uk. Ask the owner to log in or type any code.
2. **Username:** `@kirkcaldydental` (if it's taken, try `@kirkcaldydentalclinic` and tell the owner). **Name:** Kirkcaldy Dental & Implant Clinic.
3. **Profile picture:** the same profile picture PNG.
4. **Bio** (under 150 characters):
   "New NHS dental practice opening soon 🦷 23–25 Tolbooth St, Kirkcaldy · NHS & private dental care · Join our waiting list 👇"
5. **Link:** `https://kirkcaldydental.co.uk/register/?src=ig-bio`. If the website isn't live yet, add it later.
6. Switch to a **Business** account, category Dentist. Contact: email info@kirkcaldydental.co.uk, no phone, and the address above.
7. **Link it to the Facebook Page** (Meta Business Suite → Settings → Instagram accounts → Connect). Ads need this.
8. Don't post yet.

## 3. The SIM / phone service the owner just paid for
- The owner has logged in. **Don't change anything; just check:**
  - the plan is active and paid;
  - the number assigned (write it down for the owner, and tell the ads chat; it's NOT going on ads or print until the owner says so);
  - whether it can receive texts;
  - voicemail;
  - caller ID shows the number;
  - whether calls and texts can be made from the caller's work phone.
- Report anything not set up.

## 4. Save the receipt / invoice
1. In **info@kirkcaldydental.co.uk** Gmail, find the invoice or receipt email for what the owner just paid for (the SIM/phone service, plus any others from this week: ClickSend, Hostinger and so on).
2. Download each PDF, or print the email to PDF, and upload it to Google Drive → "Kirkcaldy Dental – Print files & marketing" → **"12. Receipts & invoices"** (create the folder if it doesn't exist).
3. Name each file `YYYY-MM-DD – Supplier – £amount.pdf`.
4. Add a row to the Waiting List sheet's **"Costs"** tab if it exists: Date / Channel / Item / Cost ex VAT / VAT / Total / Invoice ref. If the tab doesn't exist, leave it and tell the owner; the leaflet chat creates it.

## 5. Safety settings (from the Launch-safety chat; full detail in SAFETY-PLAN.md parts 4 and 6)
1. **Two-step login** with an authenticator app (not SMS only) on:
   - Facebook (the owner's account);
   - the Business portfolio: switch on "Require 2FA for everyone";
   - Google Workspace info@;
   - ClickSend, GitHub and Hostinger.
   The owner prints the backup codes for the clinic safe. Never put codes or passwords in the sheet or the chat.
2. **A second admin** with full control on the Page, the Business portfolio and the ad account. Ask the owner for a name; if there isn't one yet, leave it and note it.
3. **Meta billing:** add a backup payment method, and set the ad account **spending limit to about £900**.
4. **healthchecks.io** (the owner's PERSONAL email):
   - Project "Kirkcaldy Dental" with 3 checks:
     - **poller:** period 5 min, grace 15 min;
     - **daily:** period 1 day, grace 2 h;
     - **backup:** period 1 day, grace 3 h.
   - Add email plus one phone-push integration (Telegram is easiest).
   - Save the 3 ping URLs for setup night (Script Properties HEALTH_PING_POLLER / _DAILY / _BACKUP). They'll show "new/down" until the scripts run, which is expected.
5. **UptimeRobot** (owner's personal email): create the account, install the phone app and add alert contacts.
   - Check the terms allow business use; if not, pick the cheapest paid plan.
   - **Don't add website monitors until Hostinger is live.**
6. **Gmail filter in info@:** mail from `apps-scripts-notifications@google.com` → forward to the owner's personal email. Confirm the forwarding address first.
7. Store the new logins in the owner's password manager. Write down (no secrets) who the admins are and where the backup codes are kept.

## 6. Legal paperwork (from the Legal chat)
The owner signs in and clicks every Accept or Pay button themselves. Save each item as a dated PDF or screenshot in Drive **"11. Legal & compliance"**. The details are in that folder's docs 5 and 6.
1. **Google Admin** (as info@): Account → Account settings → Legal and compliance → **Cloud Data Processing Addendum**. Add info@ as the data-protection contact, the owner accepts, then screenshot "Accepted".
2. **ClickSend:** find the DPA (under Account/Legal, or on ClickSend's legal pages) and save the PDF. If there's no UK IDTA Addendum, draft a support message asking for "your DPA with the UK International Data Transfer Addendum". Don't send it until the owner says OK.
3. **Meta:**
   - Go to facebook.com/ads/leadgen/tos and screenshot the accepted Lead Ads Terms (accept them for the clinic Page if they aren't accepted yet).
   - Save the Meta Data Processing Terms page as a PDF.
4. **Hostinger:** save its Data Processing Agreement page as a PDF.

## 7. When the website is live (later)
Follow BROWSER-CLAUDE-LAUNCH.md §1. Then go back to step 1.7 (Sign-up button) and step 2.5 (Instagram link) if they were skipped.

## Report back
Send the owner a short list:
- done;
- not done, and why;
- the new phone number;
- the Instagram username;
- the Page admins.
The owner passes it to the ads chat.
