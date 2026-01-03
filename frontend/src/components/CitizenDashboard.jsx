import { getRiskColor } from '../utils/riskUtils';
const CitizenDashboard = ({ wards, selectedWard }) => {
  // Safety guard — selectedWard is mandatory
  if (!selectedWard) return null;

  const wardId = selectedWard.properties?.id;

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

  return (
   <div className="absolute top-20 right-6 z-10 w-96 max-h-[80vh] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl">


      
      {/* HEADER */}
      <div
        className="p-4 text-white font-bold text-center"
        style={{ backgroundColor: riskColor }}
      >
        {riskLevel === "High" && "⚠️ HIGH FLOOD RISK"}
        {riskLevel === "Medium" && "⚠️ MEDIUM FLOOD RISK"}
        {riskLevel === "Low" && "✓ LOW RISK — STAY ALERT"}

      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-64px)]">


        {/* FORECAST */}
        <div className="text-sm text-gray-300">
          Expected impact window:{" "}
          <span className="font-semibold">
            {forecastWindow}
          </span>
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

      </div>
    </div>
  );
};

export default CitizenDashboard;
