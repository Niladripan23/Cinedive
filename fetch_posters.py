"""
Cinedive — TMDB Poster Fetcher
Run this once locally to update data.json with real poster paths.

Requirements: pip install requests
Usage:        python fetch_posters.py
"""

import json
import time
import requests

API_KEY = "d2c069361eb58ac9b3fcfaeb997a0105"  # your existing key
BASE   = "https://api.themoviedb.org/3"

with open("data.json", encoding="utf-8") as f:
    data = json.load(f)

updated, failed = 0, []

for item in data:
    item_id = item.get("id")
    ty      = item.get("ty")   # 51=Movie, 52=Series, 53=Documentary
    title   = item.get("t", "?")

    endpoint = f"{BASE}/tv/{item_id}" if ty == 52 else f"{BASE}/movie/{item_id}"

    try:
        r = requests.get(endpoint, params={"api_key": API_KEY}, timeout=8)

        if r.status_code == 200:
            d       = r.json()
            poster  = d.get("poster_path")
            backdrop = d.get("backdrop_path")

            if poster:
                item["p"]   = poster
                item["bgp"] = backdrop or item.get("bgp", "")
                updated += 1
                print(f"  ✓  {title}")
            else:
                failed.append(title)
                print(f"  –  no poster: {title}")
        else:
            failed.append(title)
            print(f"  ✗  {r.status_code}: {title}")

    except Exception as e:
        failed.append(title)
        print(f"  ✗  error ({title}): {e}")

    time.sleep(0.15)   # stay well under TMDB rate limit (40 req/s)

print(f"\n{'─'*40}")
print(f"Updated : {updated}/{len(data)}")
if failed:
    print(f"Failed  : {', '.join(failed)}")

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved   : data.json")
