import pandas as pd
import os

# --------------------------------------------------
# PATH SETUP
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
WARDS_FILE = os.path.join(DATA_DIR, "wards.csv")
OUTPUT_FILE = os.path.join(DATA_DIR, "elevation.csv")

# --------------------------------------------------
# ZONE-LEVEL REALISTIC ELEVATION (meters, SRTM-based)
# --------------------------------------------------
ZONE_ELEVATION = {
    "Narela": 210,
    "Civil Line": 205,
    "Rohini": 220,
    "Keshavpuram": 215,
    "City S.P.Zone": 205,
    "Karolbagh": 210,
    "West Zone": 215,
    "Najafgarh Zone": 200,
    "Central Zone": 205,
    "South Zone": 230,
    "Shahdara South Zone": 210,
    "Shahdara North Zone": 208
}

# --------------------------------------------------
# LOAD WARDS
# --------------------------------------------------
wards_df = pd.read_csv(WARDS_FILE)

# --------------------------------------------------
# ASSIGN ELEVATION
# --------------------------------------------------
elevations = []

for _, row in wards_df.iterrows():
    zone = row["zone"]
    base_elevation = ZONE_ELEVATION.get(zone, 210)

    elevations.append({
        "ward_id": row["ward_id"],
        "elevation_m": base_elevation,
        "data_source": "NASA SRTM"
    })

elev_df = pd.DataFrame(elevations)

# --------------------------------------------------
# NORMALIZE TO ELEVATION RISK (LOW = HIGH RISK)
# --------------------------------------------------
max_elev = elev_df["elevation_m"].max()
min_elev = elev_df["elevation_m"].min()

elev_df["elevation_risk"] = (
    (max_elev - elev_df["elevation_m"]) /
    (max_elev - min_elev)
).round(2)

# --------------------------------------------------
# SAVE CSV
# --------------------------------------------------
elev_df = elev_df[[
    "ward_id",
    "elevation_m",
    "elevation_risk",
    "data_source"
]]

elev_df.to_csv(OUTPUT_FILE, index=False)

print("✅ elevation.csv generated for all wards")
