**Draft – owner to approve**

# Weekly mystery-shopper test

**Why:** some failures are silent. The sheet looks fine, but a real person gets no text or no call. Once a week, two real sign-ups check the whole journey the way a member of the public sees it.

**When:** once a week on a weekday, between 10am and 4pm, so the hour for the call ends well before 9pm. Pick a different day each week.

**Who:** someone the caller doesn't expect (a family member or a member of staff from another practice), using their **own phone** and their own Facebook account. That account must have **no role** on the Page, the app or the Business portfolio. Only the owner knows the test is happening.

They use their real name and number, so the caller treats it like any other lead.

## Test A: the Facebook form
1. Find our ad on Facebook or Instagram and tap **Sign up**. If it doesn't show up within a few minutes of scrolling, the owner sends them the ad's preview link (Ads Manager → the ad → Preview → Share).
2. Check the form: name and phone already filled in, email as the form shows it, the news-and-offers box **not** ticked. Leave it unticked.
3. Submit and enter the code sent by text.
4. Thank-you screen: tap **View website**. It should open the clinic's home page.

## Test B: the leaflet QR code
1. Scan the QR code on a printed leaflet (or the leaflet on a screen) with the phone camera.
2. It should open the sign-up page. Fill it in with a different email from Test A (or no email), box unticked, and press the button.
3. The page should say thank you only after it has saved. If it shows an error, write down the exact words.

## Check each sign-up (tester and owner)

| Check | Expect | Facebook | Leaflet |
|---|---|---|---|
| Thank-you text | from "KirkDental" within about 2 minutes, using their first name | | |
| Confirmation email | within about 5 minutes, if they gave an email (check the spam folder too) | | |
| Sheet row | a new row in the Waiting list tab. Source **facebook** (Lead ID and Ad ID filled) or **leaflet**. Marketing consent **No** | | |
| Owner's copy | the "NEW LEAD … call now" email in info@ | | |
| Call | the caller phones within the hour. Write down the time | | |
| Call logged | the caller picked a Call outcome, and the Status and Call log updated by themselves | | |

At the end of the call, the tester tells the caller it was the weekly test and thanks them. They never give health details.

## Afterwards (the owner, the same day)
1. Write the results in the **Daily checks** tab: date, pass or fail for each line, and the time from sign-up to call.
2. Mark both rows as tests: in Notes, write **TEST – mystery shopper [date]**.
3. Delete both rows from the Waiting list tab (and the leaflet visit from the Visits tab). Delete them **before 11:30pm**, when the nightly backup runs.
4. Then ask browser Claude to run **healthSetBaseline()** in Apps Script. Without it, the hourly check sees a Facebook lead that isn't in the sheet and sends a critical alert.
5. **Any line failed?** Forward the results to the ads chat the same day. A missing text or a row that never arrived is urgent: check the alert emails and use the "Launch-day fallback card" if Facebook leads aren't arriving.
