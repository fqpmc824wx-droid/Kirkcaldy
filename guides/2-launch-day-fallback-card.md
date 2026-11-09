**Draft – owner to approve**

# Launch-day fallback card

**Use this card when our script can't read Facebook leads**, for example:
- Meta hasn't approved the app yet, or the real-lead test failed;
- an email arrives saying "Meta lead token rejected", "Facebook lead checker stopped", "Meta counts … leads, the sheet has …" or "Facebook leads are not in the Waiting list".

People still fill in the form, and Meta keeps every lead. Nobody is lost if we follow these five steps until the ads chat says it's fixed.

## 1. Turn the ads down to £5 a day
- Ads Manager → the campaign → Budget → **£5.00** daily → Publish.
- Set the Script Property ADS_EXPECTED_BUDGET to 5, so the "budget changed" email doesn't fire.
- Fewer leads come in while we work by hand. Don't switch the ads off unless nobody can do step 3.

## 2. Turn on lead alerts on the caller's phone
- Install **Meta Business Suite** on the caller's work phone. Log in with the caller's own Facebook account, which needs access to the Page and to leads.
- Settings → Notifications → turn on **Leads** (and Messages).
- Test it: send one test lead with the owner's details (Lead Ads Testing Tool). If no alert appears on the phone, rely on step 3. Not every phone or account shows lead alerts.

## 3. Every hour, 8am to 9pm: download new leads and add them to the sheet
1. On a computer, open **business.facebook.com → Leads Center** (if it's not in the menu: All tools → Leads Center).
2. Filter to today, then **Download → CSV**. Meta only keeps leads for download for about 90 days, so never leave it longer.
3. Open the Waiting List sheet → **Waiting list** tab. For each person who isn't there yet, add a row at the bottom:

| Column | What to put |
|---|---|
| Signup Time | the date and time from the download (a real date, not text) |
| Name | full name |
| Phone | the number, starting 07 or +447 (delete any "p:" in front of it) |
| Email | if they gave one |
| Source | **facebook** (or **instagram** if the download says Instagram) |
| Lead ID | the lead's ID from the download (it may start "l:"; paste it as it is) |
| Notes | **added by hand – no auto text** |

4. Leave Status blank. The caller rings these people first, oldest first, and picks a Call outcome after each call.
5. Put a mark next to the last person you added in your download, so the next hour you start after them.

## 4. Send the thank-you text by hand only if needed
- Only between 8am and 9pm, one person at a time, from the ClickSend dashboard with sender name **KirkDental**.
- Use **only** this approved text, with their first name:
  > Hi Sarah, thank you for joining the Kirkcaldy Dental waiting list! Our team will call you to confirm your details. We can't wait to welcome you!
- Never send any other wording, and never upload a list. Skip anyone whose row says DO NOT CONTACT.
- If the caller reaches them within the hour, the text isn't needed.

## 5. Tell the ads chat
- Forward the alert email (or say "the real-lead test failed") to the **ads chat** (the Claude chat that set up the Meta ads) and say when you started the fallback.
- When the ads chat says it's fixed: put the budget back to the agreed amount (and ADS_EXPECTED_BUDGET to match), stop the hourly downloads, and check that one new lead arrives in the sheet by itself.
- The script then catches up on its own and recognises the people you added by phone number. If it catches up within 24 hours of their sign-up, their new row is marked "Duplicate" and they get no second text. After that they may get one "you're already on the list" text. Don't delete your hand-added rows.

**Never:** create a new Page, form or ad account; blank ONCALL_MOBILE or CLICKSEND_KEY; call anyone after 9pm.
