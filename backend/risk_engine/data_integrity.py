import pandas as pd  #dev3 integration
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

def load_normalized_data():
    rainfall = pd.read_csv(os.path.join(DATA_DIR, "rainfall.csv"))
    elevation = pd.read_csv(os.path.join(DATA_DIR, "elevation.csv"))
    drainage = pd.read_csv(os.path.join(DATA_DIR, "drainage.csv"))
    incidents = pd.read_csv(os.path.join(DATA_DIR, "incidents.csv"))

    for df in [rainfall, elevation, drainage, incidents]:
        df["ward_id"] = df["ward_id"].astype(str)

    merged = (
        rainfall
        .merge(elevation, on="ward_id", how="left")
        .merge(drainage, on="ward_id", how="left")
        .merge(incidents, on="ward_id", how="left")
    )

    merged.fillna({
        "rainfall_mm": 0,
        "incident_count": 0,
        "elevation_m": merged["elevation_m"].median(),
        "drainage_score": merged["drainage_score"].median()
    }, inplace=True)

    return merged
