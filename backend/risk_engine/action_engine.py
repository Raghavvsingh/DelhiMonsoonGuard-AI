def get_actions(score): #dev3 integration  
    if score >= 80:
        return [
            "Deploy water pumps",
            "Clear storm drains",
            "Traffic diversion",
            "Emergency teams on standby"
        ]
    elif score >= 50:
        return [
            "Drain inspection",
            "Monitor rainfall",
            "Response teams alerted"
        ]
    else:
        return ["Routine monitoring"]


def attach_actions(forecast_list):
    for ward in forecast_list:
        ward["actions"] = get_actions(ward["forecast_risk_score"])
    return forecast_list
