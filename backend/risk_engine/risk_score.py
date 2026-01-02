"""
DelhiMonsoonGuard Risk Engine
----------------------------
Predicts ward-level water-logging risk using proxy data.
"""

import os
import pandas as pd

# ---------------------------
# CONFIGURABLE WEIGHTS
# ---------------------------
WEIGHTS = {
    "rainfall": 0.4,
    "elevation": 0.2,
    "drainage": 0.25,
    "history": 0.15
}

# ---------------------------
# PATH SETUP (IMPORTANT FIX)
# ---------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

# ---------------------------
# UTILITY FUNCTIONS
# ---------------------------
def normalize(series):
    return (series - series.min()) / (series.max() - series.min() + 1e-6)

def risk_level(score):
    if score >= 70:
        return "High"
    elif score >= 40:
        return "Medium"
    return "Low"

def forecast_window(score):
    if score >= 70:
        return "24h"
    elif score >= 40:
        return "48h"
    return "72h"

# ---------------------------
# CORE ENGINE
# ---------------------------
def compute_risk():
    rainfall = pd.read_csv(os.path.join(DATA_DIR, "rainfall.csv"))
    elevation = pd.read_csv(os.path.join(DATA_DIR, "elevation.csv"))
    drainage = pd.read_csv(os.path.join(DATA_DIR, "drainage.csv"))
    incidents = pd.read_csv(os.path.join(DATA_DIR, "incidents.csv"))

    df = rainfall.merge(elevation, on="ward_id") \
                 .merge(drainage, on="ward_id") \
                 .merge(incidents, on="ward_id")

    df["rainfall_norm"] = normalize(df["rainfall_mm"])
    df["history_norm"] = normalize(df["past_incidents"])

    df["risk_score"] = (
        df["rainfall_norm"] * WEIGHTS["rainfall"] +
        df["elevation_risk"] * WEIGHTS["elevation"] +
        df["drainage_weakness"] * WEIGHTS["drainage"] +
        df["history_norm"] * WEIGHTS["history"]
    ) * 100

    df["risk_score"] = df["risk_score"].round(2)
    df["risk_level"] = df["risk_score"].apply(risk_level)
    df["forecast_window"] = df["risk_score"].apply(forecast_window)

    return df
