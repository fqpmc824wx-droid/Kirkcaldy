# Kirkcaldy launch – weekly patient tracker

- **Google Sheet:** https://docs.google.com/spreadsheets/d/11aytDFVx5jvz-3uJY8Q8ppTAy0ynB3RTEsloMkZYDUw/edit (owned by info@kirkcaldydental.co.uk)
- **Updates:** every Monday about 07:30 UK time, a scheduled Claude routine runs `weekly_counts.py` for the week just ended (Monday to Sunday) and adds one row per Fife practice to the **Weekly log** tab. The **Summary** tab updates by itself.
- **Privacy:** the script returns totals only. No names, contact details or full postcodes are stored.
- **Run by hand:** `python3 tracker/weekly_counts.py 2026-11-15` (the date is the Sunday the week ends on).
