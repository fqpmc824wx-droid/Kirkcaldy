**Draft – owner to approve**

# Meta App Review pack

**For:** browser Claude, on the Meta pre-work day (2 to 5 days before setup night).

**Goal:** make sure our own script can read real Facebook and Instagram leads on launch day. If Meta wants a review, submit it on the pre-work day, because a review can take several days.

**Plain summary for the owner.** Our script reads people's sign-ups from our own Facebook form and puts them into our Waiting List sheet. Meta asks some apps to pass a check ("App Review") before they can do that. Meta's own pages disagree about whether a small business reading its own form needs the check. So we check on the pre-work day, and if there's any doubt, we apply. It costs nothing. If the check isn't finished by launch day, the "Launch-day fallback card" keeps every lead safe.

## 1. What our app does (the facts reviewers need)

- **Business:** Kirkcaldy Dental & Implant Clinic, 23–25 Tolbooth Street, Kirkcaldy KY1 1RW. A new dental practice opening soon, collecting a waiting list.
- **Page:** our existing Page "KirkcaldyDental" (ID 1421462957723791), being renamed "Kirkcaldy Dental & Implant Clinic".
- **App:** a Business-type app owned by the clinic's own Business portfolio. Nobody outside the clinic uses it. There is no public login and no public website for the app.
- **How it runs:** a Google Apps Script project owned by info@kirkcaldydental.co.uk. Every minute it asks Meta for new leads from our own lead form, using a System User token ("Lead script") from our own Business portfolio.
- **What it does with a lead:** adds a row to our private Waiting List sheet, sends the person one thank-you text, and texts one of our callers so they can phone the person between 8am and 9pm.
- **It only reads.** The scripts never create, edit, pause or delete ads, posts, forms or Page settings. Every call to Meta is a read (leads, form list, ad results).
- **Privacy policy:** https://kirkcaldydental.co.uk/privacy.html
- **Data deletion instructions:** https://kirkcaldydental.co.uk/privacy.html#delete-your-data (the website chat is adding this section; check it loads before you submit).

## 2. What Meta's own pages say (checked 8 Nov 2026)

| Meta page | What it says |
|---|---|
| Lead ads guide: https://developers.facebook.com/docs/marketing-api/guides/lead-ads/ | "To retrieve lead data, your app must undergo App Review. You must include the leads_retrieval and pages_manage_ads permissions in your submission." "After approval, you will be asked to complete Business Verification." "You can't retrieve leads if your app is in Development mode." |
| App Review overview: https://developers.facebook.com/docs/app-review/ | "If your app will only be used by app users who have a role on the app itself, App Review is not required." |
| Access levels: https://developers.facebook.com/docs/graph-api/overview/access-levels/ | Business apps get Standard Access automatically. "Permissions with Standard Access can only be requested from app users who have a role on the requesting app." "Business Verification is required to get Advanced Access." |
| Marketing API authorization: https://developers.facebook.com/docs/marketing-api/get-started/authorization/ | "If your app is only managing your ad account, standard access to the ads_read and ads_management permissions are sufficient." |
| Retrieving leads: https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving | Lists leads_retrieval, pages_show_list, pages_read_engagement, pages_manage_ads (and ads_management) for reading leads. pages_manage_metadata is needed only "if using webhooks". Checkbox answers are not in field_data; ask for custom_disclaimer_responses. |
| Permissions reference: https://developers.facebook.com/docs/permissions/ | The description and allowed use of each permission (quoted in section 4). It lists these as needed alongside leads_retrieval: Ads Management Standard Access, ads_management, ads_read, business_management, pages_manage_ads, pages_read_engagement and pages_show_list. |

**What this means for us.** Our only app user is our own System User, which has a role through our Business portfolio. By the App Review overview, Standard access could be enough. By the lead ads guide, it isn't. Nobody can be sure from the pages alone, so the real-lead test decides (section 3, step 6). Plan to submit leads_retrieval and pages_manage_ads for review on the pre-work day anyway.

## 3. Pre-work day steps (in this order)

1. **Create the app** (runbook §5.1): developers.facebook.com → My Apps → Create app → type **Business** → owned by the clinic's Business portfolio. Add the Marketing API / Facebook Login for Business product.
2. **Fill App settings → Basic before Live mode:** the Privacy policy URL and Data deletion instructions URL (section 1), category Business, and a 1024 × 1024 app icon made from brand/logo/logo-icon.svg in deep gold. Complete the **Data Use Checkup** if the dashboard shows it.
3. **Add the second admin** to the app (App roles → Administrators) and turn on two-step verification for both admins.
4. **Record the access level** of each permission. Open App Dashboard → **App Review → Permissions and features**. In some newer dashboards the same list sits under **Use cases → Customise → Permissions**. Fill in the table in section 4 ("What the dashboard says"): Standard, Advanced, or "Request advanced access" button shown. Take a screenshot and save it in Drive "11. Legal & compliance".
5. **Start Business Verification**: Business settings → Security Centre → Start verification. Meta needs it for Advanced access, and it can take a few days. The owner needs the company's legal name, registered address and a document showing them.
6. **The deciding test (real lead from someone with no role).** Switch the app to **Live**. Someone with no role on the Page, app or Business portfolio (for example a family member) submits our form from their own phone. If their lead reaches the Waiting List sheet with Lead ID and Ad ID filled, Standard access is enough and no review is needed. If the admin's test lead arrives but theirs doesn't, we need Advanced access: submit the review (section 5) the same day. On the pre-work day this test can't run yet (the form is published on setup night), so submit leads_retrieval + pages_manage_ads anyway. Run the test on setup night (runbook §6 gate).
7. **Submit if any of these is true:** the dashboard shows a "Request advanced access" button for leads_retrieval or pages_manage_ads; the real-lead test fails; or the test can't be run before setup night. Request **leads_retrieval** and **pages_manage_ads** together. Add any other permission the dashboard says they depend on (section 4).
8. **Tell the owner** in one line: "Submitted on [date], Meta usually answers within a few days. Until it's approved we use the fallback card." Log the date in the Change log tab and HANDOFF.md.

## 4. Each permission: what it's for, the access we expect, and text to paste

Paste the "Use-case text" into the App Review form box "How will your app use this permission?". It is written in our own words and stays within our wording rules ("waiting list" only).

### leads_retrieval
- **Meta's description:** "allows your app to retrieve and read all information captured by a lead ads form". Allowed use: reaching out to people who filled in a lead ad form asking for more information.
- **What we use it for:** reading each new sign-up (full name, phone number, optional email, and the optional news-and-offers tick) from our own Page's lead form.
- **Access we expect:** probably **Advanced** (the lead ads guide says App Review is required). The real-lead test decides.
- **What the dashboard says:** ______
- **Use-case text:**
  > Kirkcaldy Dental & Implant Clinic is a new dental practice opening soon in Kirkcaldy, Scotland. We run lead ads from our own Facebook Page so local people can join our waiting list. Our app is an internal tool used only by our own business, with a System User token from our own Business portfolio. Every minute it reads new leads from our own lead form and adds each person to our private waiting-list spreadsheet. We then send them one thank-you text and a member of our team phones them between 8am and 9pm to confirm their details, which is what they asked for when they submitted the form. We read only the fields on our form (name, phone number, optional email, and an optional marketing tick box). We never sell or share the data, and access is limited to named staff.

### pages_manage_ads
- **Meta's description:** "allows your app to manage ads associated with the Page". Meta requires it with leads_retrieval to read leads.
- **What we use it for:** together with leads_retrieval, reading the leads from the lead forms attached to our own Page's ads. It also lets the script list our Page's lead forms, so we're warned if a new form goes live that the script isn't reading yet. We never create or change ads through the app; we build and change ads by hand in Ads Manager.
- **Access we expect:** same as leads_retrieval (submit both together).
- **What the dashboard says:** ______
- **Use-case text:**
  > Meta's lead ads guide asks us to include this permission with leads_retrieval. Our app uses it only to read the leads collected by the lead forms on our own Page's ads, and to list our own Page's lead forms so we notice if a new form is live but not yet being read. Our app never creates, edits, pauses or deletes ads: our staff do that by hand in Ads Manager.

### pages_read_engagement
- **Meta's description:** "allows your app to read content (posts, photos, videos, events) posted by the Page", plus follower data and Page metadata.
- **What we use it for:** reading our own Page's name and follower count once a day for our results sheet, and the Page details needed to read its lead forms. Meta lists it as needed alongside leads_retrieval.
- **Access we expect:** **Standard**. Request Advanced only if the dashboard says leads_retrieval needs it.
- **What the dashboard says:** ______
- **Use-case text (only if asked):**
  > We read our own Page's basic details (name and follower count) once a day for our internal results sheet, and the Page details needed to read leads from our own lead form. We don't read posts, comments or people's profiles.

### pages_show_list
- **Meta's description:** "allows your app to access the list of Pages a person manages".
- **What we use it for:** finding our own Page among the Pages our System User manages, so the script can read that Page's lead forms. Meta lists it as needed with the other Page permissions.
- **Access we expect:** **Standard**. Request Advanced only if the dashboard says leads_retrieval needs it.
- **What the dashboard says:** ______
- **Use-case text (only if asked):**
  > Our System User manages one Page, our own clinic Page. The app uses this permission to find that Page so it can read the leads from its lead form.

### pages_manage_metadata
- **Meta's description:** "allows your app to subscribe and receive webhooks about activity on the Page, and to update settings on the Page".
- **What we use it for:** nothing at the moment. Meta says it's needed only "if using webhooks". Our script checks for leads every minute instead and never changes Page settings.
- **Access we expect:** **Standard**. Leave it out of the review. If the token was already made with it ticked (runbook §5.2), that does no harm.
- **What the dashboard says:** ______
- **Use-case text (only if Meta insists):**
  > We may later receive a webhook when a new lead is submitted on our own Page, so we can add the person to our waiting list a little faster. We don't change any Page settings.

### business_management
- **Meta's description:** "allows your app to read and write with the Business Manager API". Allowed use: managing business assets such as ad accounts.
- **What we use it for:** our token comes from a System User in our own Business portfolio, which is assigned our Page, our app and our ad account. Meta lists this permission as needed alongside leads_retrieval. The scripts don't call the Business Manager API directly.
- **Access we expect:** **Standard**. Request Advanced only if the dashboard says leads_retrieval needs it.
- **What the dashboard says:** ______
- **Use-case text (only if asked):**
  > Our app uses a System User from our own Business portfolio. The System User is assigned only our own Page, our own app and our own ad account. We need this permission so the System User's token can reach those assets to read our leads. We don't manage any other business's assets.

### ads_read
- **Meta's description:** "allows your app to access the Ads Insights API to pull Ads report information".
- **What we use it for:** once a day (and a short check every hour) the script reads our own ad account's results: spend, number of leads, cost per lead, how often people see the ads, and whether an ad was rejected. These go into the "Ads" tab and send the owner a warning email if something is wrong.
- **Access we expect:** **Standard is enough.** Meta: "If your app is only managing your ad account, standard access to the ads_read and ads_management permissions are sufficient." Meta's default "Limited" Marketing API tier is rate-limited, but we make only a few calls a day. If Meta ever returns rate-limit errors on the ad results, ask the ads chat before requesting more.
- **What the dashboard says:** ______
- **Use-case text (only if asked):**
  > We read our own ad account's daily results (spend, leads, cost per lead, frequency and ad review status) into our own internal spreadsheet, so the owner is warned if an ad is rejected, stops spending or costs too much per lead. We don't read any other advertiser's data.

### If the dashboard asks for ads_management
Meta's permissions reference lists ads_management (and "Ads Management Standard Access") as needed with leads_retrieval, but our token list in runbook §5.2 doesn't include it. If the review form won't let you submit leads_retrieval without it, tick it and use this text, then tell the ads chat so it updates the runbook:
> Meta lists this permission as needed with leads_retrieval. Our app only reads our own leads and our own ad results. It doesn't create or change ads; our staff manage ads by hand in Ads Manager.

## 5. Screen recording script (shows a test lead reaching the Waiting List sheet)

**Meta's rules for recordings** (https://developers.facebook.com/docs/app-review/submission-guide/screen-recordings): show how to test every permission you request; set the interface to English; record the login from logged out to logged in; show the permission being granted; show the data being used; 1080p or better with the screen 1440 pixels wide or less; **no audio** (reviewers don't listen); add captions to explain each step.

**Before recording**
- Use a test lead with the **owner's own** name, mobile and email. Never show a real patient's details.
- Set ONCALL_MOBILE to the owner's mobile for the recording, so no caller is texted. Put it back afterwards.
- Never show a token, an API key or a full phone number on screen. Blur the phone number in the edit.
- Tools: QuickTime or OBS to record, then a free editor (for example iMovie) for captions and blurring.

| # | Show on screen | Caption to add |
|---|---|---|
| 1 | A title card | "Kirkcaldy Dental & Implant Clinic: internal lead script. Reads leads from our own Page's lead form into our own private spreadsheet. Used only by our business." |
| 2 | A private browser window, logged out. Log in at business.facebook.com as the clinic admin. | "Logging in as our business admin." |
| 3 | Business settings → Users → System users → "Lead script" → Assigned assets: our Page, our app, our ad account. | "Our System User is assigned only our own Page, app and ad account (business_management)." |
| 4 | "Generate new token" → pick our app → the permission list with the requested permissions ticked. Stop before the token appears, or blur it. | "We grant the app leads_retrieval, pages_manage_ads, pages_show_list, pages_read_engagement and ads_read." |
| 5 | Business settings → Integrations → Leads access → our Page → our app and "Lead script" are listed. | "Our app is allowed to read our own Page's leads." |
| 6 | developers.facebook.com/tools/lead-ads-testing → pick our Page and form → Preview form → submit the owner's details. | "A test person joins our waiting list on our own lead form." |
| 7 | Apps Script → Executions: the next pollMetaLeads run finishes without errors. | "Within a minute our script reads the new lead (leads_retrieval with pages_manage_ads, pages_show_list and pages_read_engagement)." |
| 8 | The Waiting List sheet, Waiting list tab: the new row with Name, Source "facebook", Lead ID, Form ID and Marketing consent "No". Blur the phone. | "The person is added to our private waiting-list sheet. Only named staff can open it." |
| 9 | The owner's phone: the thank-you text from "KirkDental". Blur the number. | "They get one thank-you text, and a member of our team phones them between 8am and 9pm." |
| 10 | The sheet's "Ads" tab with yesterday's spend, leads and cost per lead (or the adsPullInsights run in Executions). | "ads_read: we read our own ad account's daily results to keep the cost per lead in check." |
| 11 | Delete the test lead in the Lead Ads Testing Tool, then delete the test row in the sheet. | "We delete test data afterwards." |

Keep it to about 2 to 4 minutes. Make one recording that covers every permission you submit. If you also submit ads_management, add a caption on step 10: "We only read results; ads are made by hand in Ads Manager."

## 6. Reviewer instructions (paste into "Testing instructions")

> 1. This is an internal, server-to-server tool for our own business. It has no public login and no user interface outside our business. It runs every minute in our own Google Apps Script project with a System User token from our own Business portfolio.
> 2. It reads leads only from our own Facebook Page (Page ID 1421462957723791) and its lead form "KDIC waiting list v1 – Nov 2026", and our own ad account's results.
> 3. It only reads data. It never creates, edits or deletes ads, posts, forms or Page settings.
> 4. The screen recording shows every step: granting the permissions, submitting a test lead with the Lead Ads Testing Tool, the lead arriving in our private spreadsheet, and the thank-you text.
> 5. We can't give reviewers access to the spreadsheet because it holds the personal details of real people who joined our waiting list. If you need more evidence, please tell us what to record and we will send a new recording.
> 6. Privacy policy: https://kirkcaldydental.co.uk/privacy.html. Data deletion: https://kirkcaldydental.co.uk/privacy.html#delete-your-data. Contact: info@kirkcaldydental.co.uk.

## 7. After Meta answers

- **Approved:** finish Business Verification if Meta asks. Run the real-lead test again (runbook Step 6 gate). Log the approval date.
- **Rejected:** don't resubmit straight away. Forward Meta's reason to the ads chat. Common reasons are a recording that doesn't show a permission being used, or a privacy page that doesn't load. Fix exactly what Meta names, then resubmit.
- **Still waiting on launch day:** use the "Launch-day fallback card".

## Not yet checked
- Whether a System User token on a Live app with only Standard access can read leads from people with no role. Meta's pages disagree, so the real-lead test is the only proof.
- The exact menu path in the current App Dashboard (App Review → Permissions and features, or Use cases → Customise).
- Whether Meta will make ads_management a required part of a leads_retrieval submission.
- How long review and Business Verification take at the moment. Meta doesn't publish a time.
