# Weekly patient trackers

Two separate Google Sheets, both owned by info@kirkcaldydental.co.uk:

| Sheet | What it tracks |
|---|---|
| [Kirkcaldy Launch – Weekly Tracker](https://docs.google.com/spreadsheets/d/1-_AM6p8uJ7a1XZ5kiynb0ybLSL0ZIXvAFHUPtQc_W5M/edit) | Kirkcaldy only: new patients, active patients, new patients with a Kirkcaldy postcode, archived, and waiting-list sign-ups (filled in by hand) |
| [Fife Practices – Weekly Patient Tracker](https://docs.google.com/spreadsheets/d/11aytDFVx5jvz-3uJY8Q8ppTAy0ynB3RTEsloMkZYDUw/edit) | Glenrothes Dental House, Kingdom Dental Glenrothes, Leven and Cupar: new and active patients, Kirkcaldy-postcode patients they hold, transfers out |

- **Updates:** every Monday about 07:30 UK time, a scheduled Claude routine runs `weekly_counts.py` for the week just ended (Monday to Sunday) and appends the rows to both sheets.
- **Privacy:** the script returns totals only. No names, contact details or full postcodes are stored.
- **Run by hand:** `python3 tracker/weekly_counts.py 2026-11-15` (the date is the Sunday the week ends on).
