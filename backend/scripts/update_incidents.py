import pandas as pd
import os

# --------------------------------------------------
# PATH SETUP
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
WARDS_FILE = os.path.join(DATA_DIR, "wards.csv")
OUTPUT_FILE = os.path.join(DATA_DIR, "incidents.csv")

# --------------------------------------------------
# ZONE-BASED HISTORICAL INCIDENT COUNTS (PROXY)
# --------------------------------------------------
ZONE_INCIDENT_SCORE = {
    "City S.P.Zone": 8,
    "Karolbagh": 7,
    "Central Zone": 6,
    "Civil Line": 5,
    "Shahdara North Zone": 8,
    "Shahdara South Zone": 7,
    "Najafgarh Zone": 8,
    "West Zone": 5,
    "Keshavpuram": 4,
    "Rohini": 3,
    "Narela": 4,
    "South Zone": 2
}

# --------------------------------------------------
# LOAD WARDS
# --------------------------------------------------
wards_df = pd.read_csv(WARDS_FILE)

# --------------------------------------------------
# ASSIGN INCIDENT COUNTS
# --------------------------------------------------
incident_rows = []

for _, row in wards_df.iterrows():
    zone = row["zone"]
    incidents = ZONE_INCIDENT_SCORE.get(zone, 5)

    incident_rows.append({
        "ward_id": row["ward_id"],
        "past_incidents": int(incidents),
        "data_source": "Historical Flooding Proxy (MCD + Media)"
    })

incidents_df = pd.DataFrame(incident_rows)

# --------------------------------------------------
# SAVE CSV
# --------------------------------------------------
incidents_df.to_csv(OUTPUT_FILE, index=False)

print("✅ incidents.csv generated for all wards")
