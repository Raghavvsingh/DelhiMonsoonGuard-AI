from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from risk_engine.risk_score import compute_risk
from risk_engine.explainability import explain
import pandas as pd
import random

app = FastAPI(title="DelhiMonsoonGuard Risk API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def estimate_population(zone):
    """Proxy population estimates based on zone"""
    zone_populations = {
        "Narela": 45000,
        "Civil Line": 52000,
        "Najafgarh Zone": 48000,
        "South Zone": 55000,
        "Central Zone": 62000,
        "West Zone": 58000,
        "East Zone": 51000,
        "North Zone": 49000,
        "Rohini Zone": 67000,
        "Shahdara North Zone": 54000,
        "Shahdara South Zone": 53000,
        "Karol Bagh Zone": 71000,
        "City Zone": 64000,
    }
    
    base = zone_populations.get(zone, 50000)
    variance = random.randint(-15, 15) / 100
    return int(base * (1 + variance))


@app.get("/risk-data")
def get_risk_data():
    df = compute_risk()
    
    try:
        wards_meta = pd.read_csv("data/wards.csv")
        
        # ✅ FIXED: Load actual CSV data
        rainfall_data = pd.read_csv("data/rainfall.csv")
        drainage_data = pd.read_csv("data/drainage.csv")
        elevation_data = pd.read_csv("data/elevation.csv")
        incidents_data = pd.read_csv("data/incidents.csv")
        
        # Merge everything
        df = df.merge(wards_meta, on="ward_id", how="left")
        df = df.merge(rainfall_data[["ward_id", "rainfall_mm", "forecast_window"]], on="ward_id", how="left", suffixes=('', '_csv'))
        df = df.merge(drainage_data[["ward_id", "drainage_weakness"]], on="ward_id", how="left", suffixes=('', '_csv'))
        df = df.merge(elevation_data[["ward_id", "elevation_m", "elevation_risk"]], on="ward_id", how="left", suffixes=('', '_csv'))
        df = df.merge(incidents_data[["ward_id", "past_incidents"]], on="ward_id", how="left", suffixes=('', '_csv'))
        
        # Use CSV values if they exist
        if "rainfall_mm_csv" in df.columns:
            df["rainfall_mm"] = df["rainfall_mm_csv"].fillna(df["rainfall_mm"])
        if "forecast_window_csv" in df.columns:
            df["forecast_window"] = df["forecast_window_csv"].fillna(df["forecast_window"])
        if "drainage_weakness_csv" in df.columns:
            df["drainage_weakness"] = df["drainage_weakness_csv"].fillna(df["drainage_weakness"])
        if "elevation_risk_csv" in df.columns:
            df["elevation_risk"] = df["elevation_risk_csv"].fillna(df["elevation_risk"])
        if "past_incidents_csv" in df.columns:
            df["past_incidents"] = df["past_incidents_csv"].fillna(df["past_incidents"])
            
        print(f"✅ Loaded {len(wards_meta)} wards from wards.csv")
        print(f"✅ Merged columns: {df.columns.tolist()}")
    except Exception as e:
        print(f"⚠️ Could not load wards.csv: {e}")

    # Sort by highest risk first
    df = df.sort_values("risk_score", ascending=False)

    wards = []

    for rank, (_, row) in enumerate(df.iterrows(), start=1):
        ward_obj = {
            "ward_id": row["ward_id"],

            "risk": {
                "score": row["risk_score"],
                "level": row["risk_level"],
                "forecast_window": row["forecast_window"]
            },

            "explainability": explain(row),

            "raw_factors": {
                "rainfall_mm": row["rainfall_mm"],
                "elevation_risk": row["elevation_risk"],
                "elevation_m": row.get("elevation_m", 0),  # ✅ Added elevation_m
                "drainage_weakness": row["drainage_weakness"],
                "past_incidents": row["past_incidents"]
            },

            "priority": {
                "rank": rank,
                "action_required": row["risk_level"] == "High"
            }
        }
        
        if "ward_name" in row and pd.notna(row["ward_name"]):
            ward_obj["ward_name"] = str(row["ward_name"])
        
        if "ward_no" in row and pd.notna(row["ward_no"]):
            ward_obj["ward_no"] = int(row["ward_no"])
            
        if "zone" in row and pd.notna(row["zone"]):
            ward_obj["zone"] = str(row["zone"])
            ward_obj["population"] = estimate_population(row["zone"])
        
        wards.append(ward_obj)

    print(f"✅ Returning {len(wards)} wards with keys: {list(wards[0].keys())}")

    return {
        "city": "Delhi",
        "model": "Proxy-based Risk Engine v1",
        "generated_at": datetime.now().isoformat(),
        "wards": wards
    }