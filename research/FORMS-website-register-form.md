## /register/ form: final spec (website chat: `site/register/index.html`)

It asks for the same things as the Meta form: **Full name (required), Phone number (required), Email (optional)**, plus the same optional, unticked news-and-offers box. The only planned difference: the website accepts **landlines**, because people with only a landline can't pass Meta's text-code check.

### Page text
- Keep the H1 ("New NHS Dental Practice / Opening in Kirkcaldy") and the "Opening soon" badge.
- Intro (replaces "Be first in line… It takes about 30 seconds."): **"Join our waiting list – it's free, and one sign-up covers your whole household (parents and guardians sign up for children). Joining doesn't register you with the practice yet – we'll contact you before we open."**
  - Put "Be first in line –" in front only once the owner confirms that invitations follow sign-up order, with households kept together.
- Meta description: **"Kirkcaldy Dental & Implant Clinic is a new NHS dental practice opening soon at 23–25 Tolbooth Street, Kirkcaldy. Join our waiting list – it's free."**

### Fields
| Field | HTML | Label / hint | Required? | Validation (on tap of the button) | Error text |
|---|---|---|---|---|---|
| Full name | `id="name" name="name" type="text" autocomplete="name" autocapitalize="words" spellcheck="false" maxlength="100" required` | Label **Full name** | Required | Spaces trimmed; at least 2 characters that aren't digits or spaces | **Enter your full name** |
| Phone | `id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="25" aria-describedby="phone-hint" required` (no input mask) | Label **Phone number**. Hint: **A mobile is best – we'll text you a confirmation. A landline is fine too – we'll call you.** | Required | `ukPhone()` below turns any UK format into **+44…**. It accepts UK mobiles `^\+447[1-57-9]\d{8}$` (texted and called) and UK landlines `^\+44(1\d{8,9}\|[23]\d{9})$` (called only). It rejects foreign, 070/076, 08/09 and malformed numbers. | Empty: **Enter your phone number**. Invalid: **Enter a UK phone number, like 07700 900123. No UK number? Email info@kirkcaldydental.co.uk** |
| Email | `id="email" name="email" type="email" autocomplete="email" autocapitalize="off" spellcheck="false" maxlength="200" aria-describedby="email-hint"` (NOT required) | Label **Email (optional)**. Hint: **For your confirmation and waiting list updates.** | Optional | Checked only if filled in: `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` | **Enter your email like name@example.com, or leave it blank** |
| Marketing box | `id="marketing" name="marketing" type="checkbox" value="yes"`, unticked | **Yes, also send me news and offers from Kirkcaldy Dental by text and email. I can opt out at any time.** (same words as the Meta form) | Optional, never required | Sent only when ticked | n/a |
| Honeypot | `id="website" name="website" type="text" tabindex="-1" autocomplete="off"`, inside `<div class="hp" aria-hidden="true">` (off screen) with label "Leave this empty" | hidden | Must stay empty | The page always sends it. doPost silently drops the sign-up if it's filled. Don't check it in the page. | n/a |
| Hidden: `source` | added by the script | n/a | auto | `?src=` or `?utm_source=`, lower-cased, default `website`. The POST name is **source**, not src. | n/a |
| Hidden: `visit` | added by the script | n/a | auto | `"v"` + 8 random characters per page load, kept in memory with no cookie. Sent with the visit count and with the sign-up. | n/a |

**Dropped from today's page:** postcode, "How many people", "Are you currently registered…", "Who is this for?", the required "I'm happy to be contacted…" box (`consent`), and "It takes about 30 seconds". Also dropped: the proposed "How did you hear about us?". The caller asks it instead for rows with Source = website.

### Order and notice
Order: Full name → Phone number → Email (optional) → honeypot → notice → marketing box → error box → button → status line.

Notice (small text, directly above the box): **"By tapping "Join waiting list", you're asking Kirkcaldy Dental & Implant Clinic to add you to our waiting list. Joining doesn't register you with the practice yet. We'll send you a confirmation shortly (by text to a mobile, and by email if you give one), call you about your request between 8am and 9pm, and contact you about your place on the list and our opening. We won't send you marketing unless you tick the box below. Our [privacy policy](../privacy.html) explains how we use your details and how to complain."**

Button: **Join waiting list**. While sending, it reads "Sending…" and is disabled. The status line (`role="status" aria-live="polite"`) says: **"Saving your details – this can take up to 30 seconds. Please keep this page open."**

### HTML (form part; keep the existing CSS)
Add `.hint`, `.field-error{color:var(--error);font-weight:700}`, `input[aria-invalid=true]{border:2px solid var(--error)}` and `[hidden]{display:none!important}`. Make the tick box at least 22 px.
```html
<form id="reg" novalidate>
 <div class="field"><label for="name">Full name</label>
  <p class="field-error" id="name-error" hidden></p>
  <input id="name" name="name" type="text" autocomplete="name" autocapitalize="words" spellcheck="false" maxlength="100" required></div>
 <div class="field"><label for="phone">Phone number</label>
  <p class="hint" id="phone-hint">A mobile is best – we'll text you a confirmation. A landline is fine too – we'll call you.</p>
  <p class="field-error" id="phone-error" hidden></p>
  <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="25" aria-describedby="phone-hint" required></div>
 <div class="field"><label for="email">Email <span class="opt">(optional)</span></label>
  <p class="hint" id="email-hint">For your confirmation and waiting list updates.</p>
  <p class="field-error" id="email-error" hidden></p>
  <input id="email" name="email" type="email" autocomplete="email" autocapitalize="off" spellcheck="false" maxlength="200" aria-describedby="email-hint"></div>
 <div class="hp" aria-hidden="true"><label for="website">Leave this empty</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
 <p class="notice">By tapping "Join waiting list", you're asking … (notice above) … <a href="../privacy.html">privacy policy</a> …</p>
 <div class="field"><label class="consent" for="marketing"><input id="marketing" name="marketing" type="checkbox" value="yes">
  <span>Yes, also send me news and offers from Kirkcaldy Dental by text and email. I can opt out at any time.</span></label></div>
 <div class="err" id="err" role="alert" hidden></div>
 <button type="submit" id="btn">Join waiting list</button>
 <p id="sending" role="status" aria-live="polite"></p>
</form>
<div class="thanks" id="thanks" hidden><div class="tick" aria-hidden="true">✓</div><h2 id="thanks-title" tabindex="-1"></h2><p id="thanks-text"></p>
 <p>A member of our team will call you between 8am and 9pm to confirm your details. One sign-up covers your whole household, so there's no need to sign up again.</p>
 <p>Joining doesn't register you with the practice yet. We'll contact you before we open.</p>
 <p>Need urgent dental care now? Contact your current dentist, or call NHS 24 on 111 out of hours.</p></div>
<div class="thanks" id="down" role="alert" hidden><h2>Sorry – online sign-up isn't working right now</h2>
 <p>Please email your name and phone number to <a href="mailto:info@kirkcaldydental.co.uk">info@kirkcaldydental.co.uk</a> and we'll add you to our waiting list.</p></div>
```

### Script (ES5: no `\p{}`, no `.finally`, no arrow functions)
```js
(function () {
  var ENDPOINT = "PASTE_APPS_SCRIPT_URL_HERE";
  var READY = /^https:\/\/script\.google\.com\/(macros|a\/macros\/[^\/]+)\/s\/[\w-]+\/exec$/.test(ENDPOINT);
  var $ = function (id) { return document.getElementById(id); };
  var form = $("reg"), btn = $("btn"), sending = $("sending"), err = $("err");
  var q = new URLSearchParams(location.search);
  var source = (q.get("src") || q.get("utm_source") || "website").toLowerCase();
  var visit = "v" + Math.random().toString(36).slice(2, 10);
  if (!READY) { form.hidden = true; $("down").hidden = false; return; }   // placeholder, /dev or half-pasted URL: never show the form
  try { fetch(ENDPOINT, { method: "POST", mode: "no-cors", body: new URLSearchParams({ action: "visit", source: source, visit: visit }) }); } catch (e) {}

  function ukPhone(v) {                       // any UK format -> "+44…", or "" if not a UK mobile/landline
    var d = String(v || "").replace(/[\s().\-]/g, "").replace(/^(\+44|0044)/, "");
    if (/^44\d{10}$/.test(d)) d = d.slice(2);
    d = d.replace(/^0/, "");
    if (!/^\d{9,10}$/.test(d)) return "";
    var n = "+44" + d;
    return /^\+447[1-57-9]\d{8}$/.test(n) || /^\+44(1\d{8,9}|[23]\d{9})$/.test(n) ? n : "";
  }
  // showFieldError(id, msg): fill #id-error, unhide it, set aria-invalid="true" and add "id-error" to aria-describedby; clear it on the field's next "input" event.
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("name").value.replace(/\s+/g, " ").trim(), raw = $("phone").value.trim(), phone = ukPhone(raw), email = $("email").value.trim(), bad = [];
    if (name.replace(/[\d\s]/g, "").length < 2) bad.push(["name", "Enter your full name"]);
    if (!raw) bad.push(["phone", "Enter your phone number"]);
    else if (!phone) bad.push(["phone", "Enter a UK phone number, like 07700 900123. No UK number? Email info@kirkcaldydental.co.uk"]);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) bad.push(["email", "Enter your email like name@example.com, or leave it blank"]);
    if (bad.length) { for (var i = 0; i < bad.length; i++) showFieldError(bad[i][0], bad[i][1]); $(bad[0][0]).focus(); return; }
    var data = new URLSearchParams({ name: name, phone: phone, email: email, source: source, visit: visit, website: $("website").value });
    if ($("marketing").checked) data.append("marketing", "yes");
    err.hidden = true; btn.disabled = true; btn.textContent = "Sending…";
    sending.textContent = "Saving your details – this can take up to 30 seconds. Please keep this page open.";
    var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, 60000);
    fetch(ENDPOINT, { method: "POST", body: data, signal: ctl ? ctl.signal : undefined })   // normal request (NOT no-cors) so the reply can be read
      .then(function (r) { return r.text(); })
      .then(function (t) { if (String(t).trim() !== "ok") throw new Error(t); showThanks(name, phone, email); })
      .catch(function () { err.textContent = "Sorry, we couldn't save your details. Please check your signal and try again. If it still doesn't work, email your name and phone number to info@kirkcaldydental.co.uk."; err.hidden = false; })
      .then(function () { clearTimeout(timer); btn.disabled = false; btn.textContent = "Join waiting list"; sending.textContent = ""; });
  });
  // showThanks: hide the form, unhide #thanks, set the text with textContent (never innerHTML),
  //  heading "Thank you, {first word of name} – you're on our waiting list",
  //  #thanks-text = /^\+447/.test(phone) ? "We'll send you a confirmation text shortly." : "We can't text a landline, so we'll call you instead.",
  //  then add " We'll also email you a confirmation." if an email was given; focus #thanks-title and scroll to the top.
})();
```
Use `getElementById`, not `form.name`. `form.name` is the form's own name attribute.

### Error states (never a thank-you on failure)
- **ENDPOINT missing or invalid at page load:** the form is hidden, the "Sorry – online sign-up isn't working right now" box shows, and no visit is counted.
- **Send failed:** a reply other than exactly `ok` (including `missing`), a network error, Google's error or login page, or no reply after 60 s. The error box above the button shows the send-failed text and the button comes back.
  - If someone retries after the row did save, the repeat rule marks the new row Duplicate and sends no second text.
- **Field errors:** shown under each label, between the label/hint and the input. Focus moves to the first problem field, and each error clears when that field is edited.

### Accessibility
- `<html lang="en-GB">`. A visible `<label for>` on every input; no placeholders used as labels; "(optional)" written in the label.
- Correct `autocomplete` and `inputmode` values (WCAG 2.2 1.3.5). Pasting allowed.
- Tick box at least 22 px, with the whole label tappable (WCAG 2.5.8). Error colour #a8322d on white.

### Privacy page (`site/privacy.html`): must be live BEFORE the Meta form is published
1. **What we collect:**
   - your full name, phone number and (if you give it) email;
   - whether you ticked the optional news-and-offers box;
   - on our call: your postcode and address, who else in your household would like to join (names and ages), and where your current dentist is;
   - when you signed up, and how you found us (for example a leaflet QR code).
   - Remove "whether you are currently registered…" and "the number of people you are registering".
2. **How we use it:** "To add you to our waiting list, confirm it by text and email, call you about it between 8am and 9pm, and contact you about your place on the list and our opening." News and offers only if you ticked the box.
3. **Lawful basis:** replace "your consent, given when you submit the registration form" with: "Joining the waiting list: our legitimate interests in running the waiting list you asked to join. News and offers: only with your consent from the optional tick box, which you can withdraw at any time." The compliance lead should confirm this.
4. **Remove Zapier.**
5. **Visits:** "When you open our waiting-list page we count the visit: the time, where the link came from, and a random code for that page view. No cookies are used. If you then sign up, the code links that visit to your sign-up, so we can see which leaflet or banner worked." The old "This is not linked to you" stops being true once Visit ID is sent.
6. **Complaints about your data:** "Please tell us first at info@kirkcaldydental.co.uk. We'll acknowledge your complaint within 30 days and tell you the outcome." Keep the ICO line. This has been required since 19 June 2026 (DUAA).

### Setup-night tests
1. No email → a row, a text, Email status blank, the thank-you.
2. Landline (01592…) → a row, a caller alert, no text, the landline thank-you.
3. "+44 (0)7700 900123" → Phone saved as +447700900123.
4. A +33 number and a 070 number → the error, no row.
5. Placeholder ENDPOINT → the "isn't working" box.
6. Wrong or deleted /exec URL → the send-failed error, not a thank-you.
7. Box ticked → Marketing consent = Yes.
8. /l → Source leaflet, and /b → Source banner. /register/ typed in directly → Source website.
9. If a test shows the send-failed error but a row DID appear, the browser can't read Google's reply. Stop. Don't hand out leaflets, and tell the website and leaflet chats. Never ship a page that shows an error after a successful save.