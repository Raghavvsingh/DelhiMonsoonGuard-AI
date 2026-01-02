from .data_integrity import load_normalized_data #dev3 integration
from .risk_score import calculate_risk_score

FORECAST_WINDOWS = [24, 48, 72]

def generate_forecasts():
    base_df = load_normalized_data()
    forecasts = {}

    for window in FORECAST_WINDOWS:
        df = base_df.copy()

        # simulate rainfall increase
        multiplier = 1 + (window / 100)
        df["simulated_rainfall"] = df["rainfall_mm"] * multiplier

        df["forecast_risk_score"] = df.apply(
            lambda row: calculate_risk_score(
                rainfall=row["simulated_rainfall"],
                elevation=row["elevation_m"],
                drainage=row["drainage_score"],
                incidents=row["incident_count"]
            ),
            axis=1
        )

        forecasts[f"{window}h"] = df[[
            "ward_id",
            "forecast_risk_score"
        ]].to_dict(orient="records")

    return forecasts
