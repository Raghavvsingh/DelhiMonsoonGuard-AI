import requests
import csv
import os
import pandas as pd
from datetime import date, timedelta

# --------------------------------------------------
# PATH SETUP
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_FILE = os.path.join(DATA_DIR, "rainfall.csv")
WARDS_FILE = os.path.join(DATA_DIR, "wards.csv")

# --------------------------------------------------
# CONFIG
# --------------------------------------------------
LAT = 28.6139
LON = 77.2090

TODAY = date.today().isoformat()
TARGET_DATE = (date.today() - timedelta(days=2)).strftime("%Y%m%d")

# Zone-based rainfall multipliers (proxy logic)
ZONE_MULTIPLIER = {
    "Narela": 0.95,
    "Civil Line": 0.98,
    "Rohini": 0.97,
    "Keshavpuram": 0.99,
    "City S.P.Zone": 1.00,
    "Karolbagh": 1.00,
    "West Zone": 0.98,
    "Najafgarh Zone": 1.02,
    "Central Zone": 1.05,
    "South Zone": 1.08,
    "Shahdara South Zone": 1.10,
    "Shahdara North Zone": 1.07
}


# --------------------------------------------------
# HELPERS
# --------------------------------------------------
def validate_rainfall(value):
    return value is not None and 0 <= value <= 350

def clamp(value):
    return round(max(0, min(value, 200)), 1)

# --------------------------------------------------
# FETCH NASA POWER DATA
# --------------------------------------------------
url = (
    "https://power.larc.nasa.gov/api/temporal/daily/point"
    "?parameters=PRECTOTCORR"
    f"&latitude={LAT}"
    f"&longitude={LON}"
    "&community=RE"
    "&format=JSON"
    f"&start={TARGET_DATE}"
    f"&end={TARGET_DATE}"
)

response = requests.get(url)
data = response.json()

rainfall_mm = None
data_source = "NASA POWER"

try:
    rainfall_mm = list(
        data["properties"]["parameter"]["PRECTOTCORR"].values()
    )[0]
except Exception:
    rainfall_mm = None

if not validate_rainfall(rainfall_mm):
    print("⚠️ Invalid or missing NASA rainfall detected")
    rainfall_mm = 80.0
    data_source = "NASA POWER (fallback)"

print(f"🌧️ Base rainfall used: {rainfall_mm} mm")

# --------------------------------------------------
# LOAD WARDS
# --------------------------------------------------
wards_df = pd.read_csv(WARDS_FILE)

# --------------------------------------------------
# WRITE RAINFALL CSV FOR ALL 272 WARDS
# --------------------------------------------------
with open(OUTPUT_FILE, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "ward_id",
        "rainfall_mm",
        "data_source",
        "forecast_window",
        "updated_at"
    ])

    for _, row in wards_df.iterrows():
        zone = row["zone"]
        multiplier = ZONE_MULTIPLIER.get(zone, 1.0)
        rainfall = clamp(rainfall_mm * multiplier)

        writer.writerow([
            row["ward_id"],
            rainfall,
            data_source,
            "24h",
            TODAY
        ])

print("✅ rainfall.csv generated for all wards")