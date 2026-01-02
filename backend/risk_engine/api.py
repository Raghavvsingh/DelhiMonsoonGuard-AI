from fastapi import FastAPI
from datetime import datetime
from risk_engine.risk_score import compute_risk
from risk_engine.explainability import explain

app = FastAPI(title="DelhiMonsoonGuard Risk API")

@app.get("/risk-data")
def get_risk_data():
    df = compute_risk()

    # Sort by highest risk first
    df = df.sort_values("risk_score", ascending=False)

    wards = []

    for rank, (_, row) in enumerate(df.iterrows(), start=1):
        wards.append({
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
                "drainage_weakness": row["drainage_weakness"],
                "past_incidents": row["past_incidents"]
            },

            "priority": {
                "rank": rank,
                "action_required": row["risk_level"] == "High"
            }
        })

    return {
        "city": "Delhi",
        "model": "Proxy-based Risk Engine v1",
        "generated_at": datetime.now().isoformat(),
        "wards": wards
    }
