**Draft – owner to approve**

# Surge plan

**What a surge is:** a newspaper story, a radio mention or a viral post brings far more sign-ups than normal. One story can add 500 to 1,000 sign-ups in a day or two. Normal is about 15 Facebook sign-ups a day at £20 a day.

**Signs it's happening:** sign-ups in the sheet jump; emails such as "leads waiting over 1h", "Add a caller", "texts today (normal …)" or "Text limit reached – texts paused"; or the Ads Manager daily-leads rule turns the campaign off.

**The aim:** every sign-up saved, texted and called, with no promises we can't keep. Pausing sign-ups is the last step, not the first.

## Step 1. Check it's real people (10 minutes)
- Look at the newest rows: real-looking names, mostly local numbers and KY postcodes, spread over time, and sources that match the story (for example lots of "website" after a newspaper link).
- If it looks like junk (the same few numbers, nonsense names, hundreds in minutes), it's spam, not a surge. Follow R8 "Form spam" in research/premortem-final.md instead (it sets WEB_SMS_PAUSED) and **don't** raise the text limits.

## Step 2. Call in the standby callers (first hour)
- Keep a **standby list** of 3 to 5 trained people, each already with their own Google login, sheet access and the call card (see "Adding a caller – checklist"). The owner has staff available, so callers are not a limit.
- Rule of thumb: **one caller for every 20 to 25 new sign-ups a day**. 100 sign-ups a day needs 4 to 5 callers; 500 needs 20 to 25.
- Add them to ONCALL_MOBILE (comma-separated), ALERT_MODE `rotate`, BACKLOG_ALERT `15`, and raise the Ads Manager daily-leads rule to 25 × callers on shift.
- Callers ring the oldest first. Calling stays 8am to 9pm only.
- Anyone not reached after 72 hours gets one service text: "Sorry for the wait - you're on our list, no need to do anything. We'll call you between 8am and 9pm." (send by hand from ClickSend only after the ads chat approves the wording; never to DO NOT CONTACT rows)

## Step 3. Raise the text limits (only for real people)
Each sign-up uses about 2 texts: the thank-you text and the caller alert. The normal limits are **SMS_DAILY_MAX 300** (about 150 sign-ups a day) and **SMS_HOURLY_MAX 40** (about 20 sign-ups an hour). When a limit is reached, all texts stop until it resets, including Facebook thank-you texts and caller alerts.

Raise them when **both** are true:
- the sign-ups are real (step 1), and
- the "Text limit reached" email arrives, **or** you can see more than about 100 sign-ups by early afternoon, **or** more than about 15 in one hour.

How:
- First top up ClickSend: about £9 for every 100 extra sign-ups (the runbook's 9p a lead), and check auto top-up is on.
- Script Properties: SMS_DAILY_MAX `600` and SMS_HOURLY_MAX `80`. For a very big day: `1000` and `120`.
- Put them back to `300` and `40` the next morning. Write both changes in the Change log tab.
- The "texts today (normal …)" alarm will fire during a surge. That's expected once you've checked the sign-ups are real.

## Step 4. When to lower the ad budget
Press and word of mouth bring sign-ups for free, so the ads matter less during a surge.
- **Don't** cut the budget only because a story is out. Add callers first.
- **Lower it by half, or switch the campaign off for the rest of the day,** only when all standby callers are already working and the "leads waiting over 1h" email still shows more than 10 waiting, or the oldest has waited over 24 hours. If you switch it off, set ADS_PAUSED_UNTIL so the "no campaign running" alarm stays quiet.
- If the daily-leads rule switches the campaign off, switch it back on at 8am only once the overnight leads have been called.
- **Don't raise** the budget during a surge, even if the cost per lead looks very low.
- Put the budget back after 2 days in a row with fewer than 5 people waiting at 9pm.

## Step 5. Only if calls still can't keep up: pause sign-ups
Use this only if the oldest uncalled sign-up is more than 3 days old and no more callers can be found. It must read as a short break, never as "the list is full" or "hurry".

**Website sign-up page** (the website chat puts this in place of the form):
> Thank you, Kirkcaldy! We're taking a short break from new sign-ups while our team calls everyone who has joined our waiting list. If you've already signed up, you don't need to do anything. Please check back here soon.

**Facebook form:** a published form can't be edited, so switch the ads off instead (Ads Manager → campaign → Off, and set ADS_PAUSED_UNTIL).

**Facebook and Instagram post** (pin it to the top of the Page):
> Thank you, Kirkcaldy! We're taking a short break from new sign-ups to our waiting list while our team calls everyone who has joined. If you've already signed up, there's nothing more you need to do. We'll post here when sign-ups open again.

**Reply to comments and messages:**
> Thanks for your interest! We're taking a short break from new sign-ups while we call everyone who has joined. If you've already signed up, you're on our waiting list and we'll be in touch. Please keep an eye on our Page for when sign-ups open again.

Never say: "list full", "last chance", "hurry", "limited places", "first come first served", "accepting / taking on / registering NHS patients", "free NHS dentist" or "guaranteed". Don't give a reopening time unless the owner has agreed it.

## Step 6. If a journalist calls: holding statement
Only the owner speaks to the press. Say this, or email it, and nothing more:
> Kirkcaldy Dental & Implant Clinic is a new NHS dental practice, also offering private treatment, opening soon at 23–25 Tolbooth Street, Kirkcaldy. We're delighted by the interest from local people. We are keeping a waiting list for the new practice, and our team is contacting everyone who has joined. Joining the waiting list is free and doesn't register anyone with the practice yet. We'll share our opening date once it's confirmed. People can join at kirkcaldydental.co.uk/register. Media enquiries: info@kirkcaldydental.co.uk.

Don't give numbers of places, an opening date, how many people have joined, or anything about other practices or NHS Fife. Tell the ads chat and the waiting-list chat the same day, so the replies on the Page say the same thing.

## After the surge
- Text limits back to 300 and 40, ONCALL_MOBILE back to the normal rota, the Ads Manager rule number back to 25 × callers.
- Note in the Change log what happened, how many signed up, and how long the oldest waited for a call.
