#!/usr/bin/env python3
"""Weekly Fife patient counts for the Kirkcaldy launch tracker.

Aggregate-only: reads Dentally patient records through the API and prints
per-site TOTALS as JSON. No names, contact details or full postcodes are
stored or printed.

Usage: python3 weekly_counts.py [WEEK_END as YYYY-MM-DD, a Sunday; default = last Sunday]
Week = Monday 00:00 to Sunday 23:59 (UK time approximated as UTC).
"""
import json, sys, re, datetime as dt, urllib.request, concurrent.futures as cf

SITES = {
    "Kirkcaldy": "13e36edb-a9bd-4844-8312-9a222246441a",
    "Glenrothes Dental House": "0c135b87-0a89-45fd-83d0-3bf4a82f797e",
    "Kingdom Dental Glenrothes": "ac21baa5-b1d5-43bc-a8d8-820a0806c2fe",
    "Leven": "ba2869fa-f63e-43b5-82ed-2ba706de4de7",
    "Cupar": "0c347160-752e-4ad4-943a-966579fe4408",
}
H = {"Authorization": "Bearer x", "User-Agent": "KirkcaldyDental"}  # proxy injects the real token

def get(url):
    for _ in range(5):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=90))
        except Exception as e:
            err = e
    raise err

def main():
    if len(sys.argv) > 1:
        end = dt.date.fromisoformat(sys.argv[1])
    else:
        t = dt.date.today(); end = t - dt.timedelta(days=(t.weekday() + 1) % 7 or 7)
    start = end - dt.timedelta(days=6)
    s, e = start.isoformat(), (end + dt.timedelta(days=1)).isoformat()
    inweek = lambda ts: bool(ts) and s <= ts[:10] < e
    out = {"week_start": s, "week_end": end.isoformat(), "sites": {}}
    for name, sid in SITES.items():
        total = get(f"https://api.dentally.co/v1/patients?per_page=1&site_id={sid}")["meta"]["total"]
        def page(p):
            c = dict(active=0, new=0, new_ky=0, active_ky=0, archived=0, transferred=0, transferred_ky=0)
            for x in get(f"https://api.dentally.co/v1/patients?per_page=100&page={p}&site_id={sid}")["patients"]:
                ky = bool(re.match(r"^KY[12]\d[A-Z]{2}$", (x.get("postcode") or "").upper().replace(" ", "")))
                act = bool(x.get("active"))
                c["active"] += act; c["active_ky"] += act and ky
                if inweek(x.get("created_at")):
                    c["new"] += 1; c["new_ky"] += ky
                if not act and inweek(x.get("updated_at")):
                    c["archived"] += 1
                    if x.get("archived_reason") == "transferred_to_another_provider":
                        c["transferred"] += 1; c["transferred_ky"] += ky
            return c
        tot = dict(active=0, new=0, new_ky=0, active_ky=0, archived=0, transferred=0, transferred_ky=0)
        if total:
            with cf.ThreadPoolExecutor(8) as ex:
                for c in ex.map(page, range(1, (total + 99) // 100 + 1)):
                    for k in tot: tot[k] += c[k]
        out["sites"][name] = tot
    print(json.dumps(out, indent=1))

if __name__ == "__main__":
    main()
