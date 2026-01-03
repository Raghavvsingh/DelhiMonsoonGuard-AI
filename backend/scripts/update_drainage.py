import pandas as pd
import os

# --------------------------------------------------
# PATH SETUP
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
WARDS_FILE = os.path.join(DATA_DIR, "wards.csv")
OUTPUT_FILE = os.path.join(DATA_DIR, "drainage.csv")

# --------------------------------------------------
# ZONE-BASED DRAINAGE WEAKNESS (PROXY)
# --------------------------------------------------
ZONE_DRAINAGE_WEAKNESS = {
    "City S.P.Zone": 0.85,
    "Karolbagh": 0.75,
    "Central Zone": 0.70,
    "Civil Line": 0.65,
    "Shahdara North Zone": 0.80,
    "Shahdara South Zone": 0.75,
    "Najafgarh Zone": 0.78,
    "West Zone": 0.60,
    "Keshavpuram": 0.55,
    "Rohini": 0.50,
    "Narela": 0.58,
    "South Zone": 0.45
}

# --------------------------------------------------
# LOAD WARDS
# --------------------------------------------------
wards_df = pd.read_csv(WARDS_FILE)

# --------------------------------------------------
# ASSIGN DRAINAGE WEAKNESS
# --------------------------------------------------
drainage_rows = []

for _, row in wards_df.iterrows():
    zone = row["zone"]
    drainage_weakness = ZONE_DRAINAGE_WEAKNESS.get(zone, 0.65)

    drainage_rows.append({
        "ward_id": row["ward_id"],
        "drainage_weakness": round(drainage_weakness, 2),
        "data_source": "Urban Drainage Proxy (OSM + MCD)"
    })

drainage_df = pd.DataFrame(drainage_rows)

# --------------------------------------------------
# SAVE CSV
# --------------------------------------------------
drainage_df.to_csv(OUTPUT_FILE, index=False)

print("✅ drainage.csv generated for all wards")
    