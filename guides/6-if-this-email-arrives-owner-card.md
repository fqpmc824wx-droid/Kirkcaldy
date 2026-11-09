**Draft – owner to approve**

# If this email arrives, do this

The scripts email you when something needs a person. Find the email's subject below and do what it says. "…" stands for a number, a name or a time.

**The start of the subject tells you how urgent it is:**
- **[KD-P1]** = urgent. Act now. (If you agree to critical texts, still your decision, these also come as a text, never between 10pm and 7am.)
- **[KD-P2]** = a warning. Deal with it today.
- **[KD-OK] RESOLVED** = fixed by itself. Nothing to do.

"Forward to the ads chat" means paste the email into the Claude chat that set up the ads. "Browser Claude" can change Script Properties for you.

## Texts failing
| Subject | Do this |
|---|---|
| … lead texts failed in the last hour (…) | If it says INSUFFICIENT_CREDIT, top up ClickSend. Otherwise forward to the ads chat. The caller keeps calling from the sheet. |
| Texts are failing (ClickSend) | Log in to ClickSend and check credit and the sender name. Forward to the ads chat if it isn't credit. |
| ClickSend is out of credit - texts are not being sent | Top up ClickSend now (£50), and check auto top-up is on. |
| ClickSend login failed (…) | No texts are going out at all. Forward to the ads chat now. The caller works from the "To call" view. |
| Caller alert not sent (…) / Caller alert not delivered (…) / A new-lead alert to the callers failed | Phone the caller. Ask them to ring the newest rows with a blank Status. |
| … Facebook lead(s) got no thank-you text | Usually an odd phone format. The caller rings them; nothing else needed today. |
| Text limit reached - texts paused | Real people signing up? Follow the "Surge plan", step 3. Junk sign-ups? Forward to the ads chat. |

## ClickSend credit low
| Subject | Do this |
|---|---|
| ClickSend credit is low (£…) | Top up today and check auto top-up is still on. |
| ClickSend credit £… - texts stop soon | Top up now. Auto top-up may have failed, so check the card. |

## An ad rejected
| Subject | Do this |
|---|---|
| A Facebook ad needs attention: … (DISAPPROVED) or (WITH_ISSUES) | Don't edit the ad. Forward to the ads chat. The other ad keeps running. |
| A Facebook ad needs attention: … (PENDING_BILLING_INFO) | Ads Manager → Billing & payments: fix the card or add the backup card. |
| A Facebook ad has been in review for over a day: … | Wait. If it's still in review after 2 days, forward to the ads chat. |

## Cost per lead
**About £5 a lead is what we expect.** Nothing happens at £5 or less.

| Subject | Do this |
|---|---|
| Cost per lead is high: £… | Only matters if it's above £5 (3-day average). Don't add money. Forward to the ads chat for a fresher ad or form. The ads keep running. |
| PAUSE the ads: cost per lead over £8 (…) | Ads Manager → campaign → Off today. Ask browser Claude to set ADS_PAUSED_UNTIL. Forward to the ads chat. |
| (no email) under £4 a lead for 3 days | Good news. On Monday, raise the budget 20% if there are enough callers and no "leads waiting" emails. |

Our rule: a warning above £5, a pause only above £8 (both over the last 3 days, once at least £30 has been spent).

## Facebook leads missing from the sheet
| Subject | Do this |
|---|---|
| Meta counts … leads …, the sheet has … | Real people are missing. Start the "Launch-day fallback card" now. Forward to the ads chat. |
| A Facebook lead is not in the Waiting list / … Facebook leads are not in the Waiting list | Add each person from the email (or the "Failed leads" tab) to the Waiting list. The caller rings them first. |
| … Facebook leads from yesterday are missing from the sheet | Download them from Leads Center and add them (fallback card, step 3). Forward to the ads chat. |
| Facebook lead checker stopped (last good run …) | Start the fallback card. Forward to the ads chat. |
| New Facebook form '…' is live but not read | Ask browser Claude to add the form's ID to META_FORM_IDS today. |

## Leads waiting over an hour / add a caller
| Subject | Do this |
|---|---|
| … leads waiting over 1h, oldest … | Add a caller today ("Adding a caller – checklist"). Callers ring the oldest first. Lower the budget only if nobody at all can call. |
| No calls logged … and … leads waiting | Phone the caller. If they're off, move the alerts to the backup caller. |
| … overnight lead(s) still not called at 10am (or 12pm) | Check the caller has started. If not, move the alerts to the backup. |
| Add a caller: … sign-ups yesterday for … caller(s) | More than 25 sign-ups a day per caller. Add a caller this week. |

## Meta error 190 (the Facebook key has stopped working)
| Subject | Do this |
|---|---|
| Meta lead token rejected (error 190) since … | Ask browser Claude to make a new System User token (runbook Step 5.2) and paste it into META_PAGE_TOKEN. Use the fallback card until it's done. |
| Ad results can't be read from Meta (…) | If a "token rejected" email came at the same time, it's the same fix. Otherwise forward to the ads chat. |
| Meta refused the lead checker (error …) | Forward to the ads chat now and start the fallback card. |

## Ads not spending
| Subject | Do this |
|---|---|
| Facebook ads have spent £0 today (by …) | Ads Manager: look for a rejected ad, a payment problem or a campaign that's off. |
| The ads are hardly running today / Ads spent under half the budget 2 days running | The same checks. If nothing is wrong, forward to the ads chat. |
| No Facebook campaign running since … | Paused on purpose? Ask browser Claude to set ADS_PAUSED_UNTIL. Switched off by the daily-leads rule? Switch it back on at 8am once the overnight leads are called. |
| Meta ad account problem (status …) | Billing & payments (pay or add the backup card) or Account quality (request a review). Never open a new ad account. |

## Spending but no leads
| Subject | Do this |
|---|---|
| No Facebook leads for … while the ads spent £… today | Usually chance. Check today's lead count in Ads Manager. If Meta shows leads the sheet doesn't have, start the fallback card. |
| … (and other lead checks are failing) | Start the fallback card now. Forward to the ads chat. |
| Fewer than 3 Facebook sign-ups a day for 3 days | Do the mystery-shopper test today. Forward the result to the ads chat. |

## Ads seen too often / a tired ad
| Subject | Do this |
|---|---|
| Ads are being seen too often (frequency …) | Ask the ads chat for 1 or 2 fresh versions of the best ad. |
| An ad is getting tired: … | Ask the ads chat for a fresh version of that ad. |

## Daily email limit
| Subject | Do this |
|---|---|
| Daily email limit nearly used up / Google email allowance low (… left today) | Confirmation emails pause until tomorrow; texts still go. Look for a sudden burst of sign-ups: if it's junk, forward to the ads chat. |

## Other emails
| Subject | Do this |
|---|---|
| Ads spent £… today on a £… budget / Unknown Facebook campaign in the ad account: … | Possible hack. Ads Manager → Activity history now. Switch off anything that isn't ours and change the Facebook password. |
| Ad budget is £…/day, not the agreed £… | Changed it on purpose? Ask browser Claude to update ADS_EXPECTED_BUDGET. If not, change it back. |
| Ad account spending limit nearly reached (£… left) | Raise the limit in Billing & payments if you're happy with the spend. |
| NEW LEAD (…) - call now: … | Your copy of a caller alert. Nothing to do. |
| Today: … new waiting-list sign-ups – Kirkcaldy Dental | The 9pm summary. Read it. |
