import pandas as pd
import json
import random
import os

# --------------------------------------------------
# PATH SETUP (ROBUST)
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

WARDS_CSV = os.path.join(DATA_DIR, "wards.csv")
FRONTEND_GEOJSON = os.path.join(
    BASE_DIR, "..", "frontend", "src", "data", "wards.geojson"
)

# --------------------------------------------------
# LOAD WARDS CSV
# --------------------------------------------------
wards = pd.read_csv(WARDS_CSV)

# 🔍 EXPECTED COLUMNS (adjust only if names differ)
# ward_id | ward_name | zone

# --------------------------------------------------
# GENERATE DUMMY GEOMETRY (PROTOTYPE)
# --------------------------------------------------
features = []

BASE_LAT = 28.60
BASE_LON = 77.10

for _, row in wards.iterrows():
    # Random but stable-ish spread around Delhi
    lat = BASE_LAT + random.uniform(-0.15, 0.15)
    lon = BASE_LON + random.uniform(-0.15, 0.15)

    size = 0.004  # polygon size

    polygon = [
        [lon, lat],
        [lon + size, lat],
        [lon + size, lat + size],
        [lon, lat + size],
        [lon, lat]
    ]

    features.append({
        "type": "Feature",
        "properties": {
            "id": str(row["ward_id"]),
            "name": row["ward_name"],          # ✅ REAL WARD NAME
            "zone": row.get("zone", "Unknown")
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [polygon]
        }
    })

# --------------------------------------------------
# FINAL GEOJSON
# --------------------------------------------------
geojson = {
    "type": "FeatureCollection",
    "features": features
}

# --------------------------------------------------
# WRITE FILE
# --------------------------------------------------
os.makedirs(os.path.dirname(FRONTEND_GEOJSON), exist_ok=True)

with open(FRONTEND_GEOJSON, "w", encoding="utf-8") as f:
    json.dump(geojson, f, indent=2)

print("✅ wards.geojson generated with REAL ward names")
print(f"📍 Output: {FRONTEND_GEOJSON}")
