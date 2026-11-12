# HANDOVER – Practice policies

Kirkcaldy Dental & Implant Clinic, 23–25 Tolbooth Street, Kirkcaldy KY1 1RW.
Written 9 November 2026 by the Claude Code chat that wrote the policies (taken over by the Legal & compliance chat).
No passwords, API keys or tokens are in this note.

## Summary
All 40 practice policies are written as **drafts for adoption**. They follow the Scottish Dental Practice Support Manual (PSM)
from SDCEP / NHS Education for Scotland (https://www.psm.sdcep.org.uk), which NHS Fife uses for practice inspections.
Every policy is also a branded Word file (deep-gold logo header, gold headings, A4). There is one combined manual of about 286 pages with a cover page.
Nothing is merged yet. The work is in draft pull request #9.

## 1. Done
| No. | Group | Policies |
|---|---|---|
| 01–08 | Communication | complaints and feedback; Duty of Candour; consent; zero tolerance; NHS registration, deregistration and change of dentist; referrals; raising concerns (whistleblowing); practice information and advertising |
| 09–16 | Disability and ethical practice | disability equality; data protection, confidentiality and cyber security; privacy notices (patients, children, staff); child and adult protection; PVG and safe recruitment; FOI publication scheme; CCTV; ethical practice and GDC standards |
| 17–23 | Health and safety | health and safety; COSHH (incl. mercury); fire; first aid; latex; waste; PPE |
| 24–33 | Infection control | IPC; hand hygiene; decontamination (NHSScotland SHTM 01-05); cleaning; legionella and waterlines; sharps; immunisation; dispatch to labs; procurement; domiciliary visits |
| 34–40 | Clinical governance | medical emergencies; radiation protection; record-keeping; risk and significant events; business continuity; quality improvement; sustainability |

Each policy has: practice details, the PSM section it comes from, procedures, PSM templates to download, an inspection checklist and a staff sign-off table.
`policies/README.md` has the policy list, roles register, before-opening checklist and annual review calendar.

## 2. Pending
- Fill in every `[square bracket]`: names, phone numbers, contractors, dates, practice decisions.
- Practice Owner signs each policy; all staff read and sign the sign-off tables.
- Review and merge draft PR #9.
- Word files are only in GitHub. They are **not** in Google Drive yet.
- Check against the latest Combined Practice Inspection checklist (Scottish Dental website) before the NHS Fife inspection.
- Confirm the items marked "check current guidance", mainly:
  - NHS Fife contacts: complaints, child protection, waste, occupational health
  - Duty of Candour: whether the "responsible person" for NHS patients is the practice or NHS Fife
  - Whether the private services need Healthcare Improvement Scotland registration
  - Clinical waste: NHS Fife collection or a private contractor
  - Sterilizer test schedule against SHTM 01-05 and the manufacturer
  - Emergency numbers in the business continuity plan
- Appoint a Data Protection Officer. NHS practices must have one, and the PSM says it should not be the owner.
- Optional policies (CCTV, domiciliary visits, CBCT, lasers, sedation): mark "not applicable" or delete.

## 3. Links and file locations
- Repository: https://github.com/fqpmc824wx-droid/Kirkcaldy · branch `claude/serene-allen-ykushn`
- Draft PR #9: https://github.com/fqpmc824wx-droid/Kirkcaldy/pull/9
- Policies: `policies/01-…md` to `policies/40-…md`; index `policies/README.md`
- Word: `policies/word/` (40 files) and `policies/word/Kirkcaldy-Dental-Policy-Manual.docx`
- Rebuild Word after any change: `python3 policies/build-word.py` (needs pandoc and python-docx)
- Logos used: `policies/assets/logo-horizontal-deepgold.png`, `policies/assets/logo-stacked-deepgold.png`
- Source: https://www.psm.sdcep.org.uk
- No Google Docs, Sheets or Drive files were created or used by this chat.

## 4. Decisions and rules from Hamza
- Base the policies on the Scottish Dental manual (PSM).
- Make them look good with the logo. Done: deep-gold logo, gold headings and tables, cream accents, page numbers, A4.
- From BRAND.md: name "Kirkcaldy Dental & Implant Clinic"; full address 23–25 Tolbooth Street, Kirkcaldy KY1 1RW; colours deep gold #8E6B2E, light gold #D9BD82, cream #F6F2EA, charcoal #30363B; no NHS logo; owner Nas.
- Word fonts: Georgia (headings) and Calibri (text), so the files look the same on any computer.
- Staff names unknown, so role names with `[Name]` placeholders are used throughout.

## 5. Waiting on Hamza
- **Which email is correct?** The policies use info@kirkcaldydental.co.uk (BRAND.md), but the website footer and privacy page show info@kirkcaldydentist.co.uk.
- Fill in the roles register in `policies/README.md`.
- Review and merge PR #9.
- Hamza wrote "Claude rc". Its meaning wasn't clear (possibly Remote Control to the MacBook). No action was taken.

*Practice templates, not legal advice. Confirm details with the indemnity provider, RPA and NHS Fife.*
