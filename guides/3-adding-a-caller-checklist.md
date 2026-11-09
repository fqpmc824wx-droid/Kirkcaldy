**Draft – owner to approve**

# Adding a caller – checklist

**When:** sign-ups go above about 20 to 25 a day per caller, the "Add a caller" or "leads waiting over 1h" email arrives, or before a budget rise. Callers are not a limit: add one the same day.

**Who does it:** the owner (or the deputy), with browser Claude for the settings.

Tick each line. Don't switch the alerts to the new caller until steps 1 to 5 are ticked.

## Before their first shift
1. **Training done.** The new caller has had the 30 to 45 minute session from Drive folder "8. Waiting list – staff guide" (call script, a practice call, logging a call on the phone, data rules). They have signed the one-page confidentiality note.
2. **Own Google login.** They use their own Google account, never info@.
3. **Sheet access by name.** Waiting List sheet → Share → add their Google account by name as **Editor**. Never "anyone with the link". Install the Google Sheets app on their phone and show them the **"To call"** filter view. They change one Call outcome on a test row from their phone, and the Status fills in by itself. Then delete the test row.
4. **Work phone.** They call from the clinic's one work number (or the calling app on their phone), not their personal number. Screen lock on. Meta Business Suite app installed, with Leads notifications on (a free backup alert).
5. **Rota.** Add them to the rota with their days and hours, inside 8am to 9pm. Nobody calls after 9pm. If the calling hours change for everyone, update CALLER_SHIFT and CALLER_DAYS in Script Properties.

## Switch the alerts on (Apps Script → Project Settings → Script Properties)
6. **ONCALL_MOBILE** = the mobiles of **every caller on shift**, UK mobiles only (07… or +447…), comma-separated, for example `+447700900111,+447700900222`. Each lead alert goes to ONE caller. If someone is off for a day, take their number out for that day, or ask browser Claude to set ONCALL_MOBILE_UNTIL for a temporary change. **Never leave ONCALL_MOBILE blank:** a blank number stops every alert without any warning text.
7. **ALERT_MODE** = `rotate` (always, even with one caller, so adding a second caller can never double-alert). Each lead goes to the next caller in turn, so no two people ring the same person.
8. **BACKLOG_ALERT** = `15` (two or more callers).
9. **OWNER_MOBILE** stays empty. The owner gets email copies, not texts.

## Raise the safety rule in Ads Manager
10. Ads Manager → Rules → the daily-leads rule → change the number to **25 × the callers on shift** (1 caller = 25, 2 = 50, 3 = 75, 4 = 100). The rule turns the campaign off if more leads arrive in a day than the callers can ring. Check it still runs every 30 minutes.

## Test it
11. In calling hours, do one website sign-up with the owner's details. With rotate, alerts take turns, so do a second one if the new caller didn't get the first. The new caller should get "NEW LEAD … call now".
12. Delete the test rows the same day, before 11:30pm (the nightly backup), so the nightly check doesn't report missing rows.
13. Write the change in the **Change log** tab: date, caller's first name, new ONCALL_MOBILE count, new rule number.

## Rules the caller follows every day
- Ring the oldest first: "Call 8am" rows, then blank rows, then call-backs that are due.
- Pick a **Call outcome** after every call. Notes go in Notes, never in Call outcome.
- **Delete each alert text after calling.** No screenshots, no forwarding (WhatsApp or anything else).
- A lost or stolen phone: tell the owner the same day.

## When a caller leaves
- Take their number out of ONCALL_MOBILE, remove their sheet access, and lower the Ads Manager rule number (25 × the callers left).
- If only one caller is left: ALERT_MODE can stay `rotate`; set BACKLOG_ALERT back to `10`.
