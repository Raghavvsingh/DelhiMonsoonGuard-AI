from risk_engine.risk_score import WEIGHTS

def explain(row):
    rainfall = row["rainfall_norm"] * WEIGHTS["rainfall"] * 100
    elevation = row["elevation_risk"] * WEIGHTS["elevation"] * 100
    drainage = row["drainage_weakness"] * WEIGHTS["drainage"] * 100
    history = row["history_norm"] * WEIGHTS["history"] * 100

    total = rainfall + elevation + drainage + history

    return {
        "rainfall": round((rainfall / total) * 100, 2),
        "elevation": round((elevation / total) * 100, 2),
        "drainage": round((drainage / total) * 100, 2),
        "history": round((history / total) * 100, 2)
    }
