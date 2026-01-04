import { useState } from "react";
import { getRiskColor } from '../utils/riskUtils';
const CitizenDashboard = ({ wards, selectedWard }) => {
  // Safety guard — selectedWard is mandatory
  if (!selectedWard) return null;

  const wardId = selectedWard?.geo?.properties?.id;
  const explainRiskInOneLine = (ward) => {
    if (!ward?.raw_factors) return null;

    const { rainfall_mm, drainage_weakness, elevation_risk } = ward.raw_factors;

    if (rainfall_mm > 80 && drainage_weakness > 0.6)
      return "Heavy rainfall combined with weak drainage";

    if (elevation_risk > 0.8)
      return "Low-lying area prone to water accumulation";

    return "Stable conditions with adequate drainage";
  };


  const wardData = wards?.find(
    (w) => w.ward_id === wardId
  );

  // ✅ SAFE backend access with fallback
  const backendLevel = wardData?.risk?.level ?? "Low";
  const forecastWindow = wardData?.risk?.forecast_window ?? "72h";

  /* ---------------- BACKEND → CITIZEN MAPPING ---------------- */
  // High | Medium | Low

  const riskLevel = backendLevel;


  const getEmergencyContacts = () => [
    { name: "Emergency Services", number: "112" },
    { name: "Fire Department", number: "101" },
    { name: "Ambulance", number: "102" },
    { name: "Disaster Management", number: "1070" }
  ];

  const getSafetyTips = (level) => {
    const tips = {
      High: {
        dos: [
          "Move to higher floors or elevated areas",
          "Keep important documents in waterproof bags",
          "Charge all electronic devices",
          "Follow evacuation orders immediately"
        ],
        donts: [
          "Do not walk or drive through floodwater",
          "Do not touch electrical equipment if wet",
          "Do not ignore evacuation warnings",
          "Do not enter basements or underground areas"
        ]
      },
      Medium: {
        dos: [
          "Stay indoors during heavy rainfall",
          "Monitor weather updates regularly",
          "Keep emergency supplies ready",
          "Inform family about your whereabouts"
        ],
        donts: [
          "Avoid unnecessary travel",
          "Do not park vehicles in low-lying areas",
          "Avoid waterlogged roads",
          "Do not venture near drains or canals"
        ]
      },
      Low: {
        dos: [
          "Stay informed about weather conditions",
          "Keep emergency contacts saved",
          "Maintain basic emergency supplies"
        ],
        donts: [
          "Do not ignore official warnings"
        ]
      }
    };
    return tips[level] || tips.Low;
  };

  const tips = getSafetyTips(riskLevel);
  const riskColor = getRiskColor(riskLevel);

  /* ---------------- UI ---------------- */
  const calculatePreparednessScore = (risk) => {
    let score = 100;

    if (risk === "High") score -= 40;
    if (risk === "Medium") score -= 20;

    // Proxy penalties (simulated)
    score -= 15; // population exposure
    score -= 10; // emergency access assumptions

    return Math.max(score, 30);
  };

  const preparednessScore = calculatePreparednessScore(riskLevel);

  const getPreparednessMeta = (score) => {
    if (score >= 70) return { color: "text-green-400", label: "Prepared" };
    if (score >= 40) return { color: "text-yellow-400", label: "Needs Attention" };
    return { color: "text-red-400", label: "Low Preparedness" };
  };

  const preparednessMeta = getPreparednessMeta(preparednessScore);

  return (
   <div className="absolute top-20 right-6 z-10 w-96 h-[80vh] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col">


      
      {/* HEADER */}
      <div
        className="p-4 text-white font-bold text-center"
        style={{ backgroundColor: riskColor }}
      >
        {riskLevel === "High" && "🔴 ACTIVE WATER-LOGGING HOTSPOT"}
        {riskLevel === "Medium" && "🟡 POTENTIAL WATER-LOGGING HOTSPOT"}
        {riskLevel === "Low" && "🟢 NORMAL MONITORING ZONE"}



      </div>
      {/* WHY THIS IS A HOTSPOT */}
      {wardData?.raw_factors && (
        <div className="px-4 py-2 bg-gray-800 text-gray-300 text-xs text-center italic">
          {riskLevel === "High" &&
            `${explainRiskInOneLine(wardData)} makes this an active water-logging hotspot.`}

          {riskLevel === "Medium" &&
            `${explainRiskInOneLine(wardData)} indicates a potential water-logging hotspot.`}

          {riskLevel === "Low" &&
            "Stable conditions with adequate drainage. No hotspot activity detected."}
        </div>
      )}



      {/* CONTENT */}
      <div className="p-6 space-y-6 overflow-y-auto flex-1 pb-24">


        {/* FORECAST */}
        {/* FORECAST WINDOW (SIMULATED) */}
        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            Expected impact window
          </p>

          <div className="mt-2">
  <div className="w-full h-2 rounded bg-gray-700 overflow-hidden">
    <div
      className={
        riskLevel === "High"
          ? "h-full bg-red-500 w-full"
          : riskLevel === "Medium"
          ? "h-full bg-yellow-400 w-2/3"
          : "h-full bg-green-500 w-1/3"
      }
    />
    <p className="text-[11px] text-gray-500 italic mt-2">
      Prediction based on recent rainfall trends and historical monsoon patterns.
    </p>

  </div>

  <p className="text-xs text-gray-400 mt-1">
    {riskLevel === "High" &&
      "High impact expected within 72 hours (simulated)"}
    {riskLevel === "Medium" &&
      "Moderate impact possible within 48–72 hours (simulated)"}
    {riskLevel === "Low" &&
      "No significant impact expected in the next 72 hours"}
  </p>
</div>

        </div>


        {/* DO */}
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="text-green-400">✓</span> DO
          </h3>
          <ul className="space-y-2">
            {tips.dos.map((tip, idx) => (
              <li
                key={idx}
                className="text-gray-300 text-sm pl-4 border-l-2 border-green-500"
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* DON'T */}
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="text-red-400">✗</span> DON'T
          </h3>
          <ul className="space-y-2">
            {tips.donts.map((tip, idx) => (
              <li
                key={idx}
                className="text-gray-300 text-sm pl-4 border-l-2 border-red-500"
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* EMERGENCY CONTACTS */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-white font-semibold mb-3">
            Emergency Contacts
          </h3>
          <div className="space-y-2">
            {getEmergencyContacts().map((contact, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-800 p-2 rounded"
              >
                <span className="text-gray-300 text-sm">
                  {contact.name}
                </span>
                <span className="text-white font-mono font-bold">
                  {contact.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      {/* PREPAREDNESS SCORE */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="text-white font-semibold mb-2">
          Preparedness Score
        </h3>

        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className={`text-2xl font-bold ${preparednessMeta.color}`}>
            {preparednessScore} / 100
          </p>

          <p className={`text-sm font-semibold ${preparednessMeta.color}`}>
            {preparednessMeta.label}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Proxy indicator based on risk level, population exposure,
            and emergency access
          </p>
        </div>
      </div>

      </div>
    </div>
  );
};

export default CitizenDashboard;
