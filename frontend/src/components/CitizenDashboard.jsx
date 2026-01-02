import { getRiskColor } from '../data/mockWards';

const CitizenDashboard = ({ selectedWard }) => {
  const getEmergencyContacts = () => [
    { name: "Emergency Services", number: "112" },
    { name: "Fire Department", number: "101" },
    { name: "Ambulance", number: "102" },
    { name: "Disaster Management", number: "1070" }
  ];

  const getSafetyTips = (riskLevel) => {
    const tips = {
      critical: {
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
      high: {
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
      moderate: {
        dos: [
          "Check weather forecasts before going out",
          "Keep raincoat and umbrella handy",
          "Store some drinking water",
          "Know your nearest safe shelter"
        ],
        donts: [
          "Avoid low-lying areas during rain",
          "Do not ignore weather warnings",
          "Avoid driving at high speeds in rain"
        ]
      },
      low: {
        dos: [
          "Stay informed about weather conditions",
          "Keep emergency contacts saved",
          "Maintain basic emergency supplies"
        ],
        donts: [
          "Do not be complacent about warnings"
        ]
      }
    };
    return tips[riskLevel] || tips.low;
  };

  const riskLevel = selectedWard?.properties.riskLevel || 'low';
  const tips = getSafetyTips(riskLevel);
  const riskColor = getRiskColor(riskLevel);

  return (
    <div className="absolute top-20 right-6 z-10 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
      <div
        className="p-4 text-white font-bold text-center"
        style={{ backgroundColor: riskColor }}
      >
        {riskLevel === 'critical' && "⚠️ CRITICAL FLOOD ALERT"}
        {riskLevel === 'high' && "⚠️ HIGH RISK AREA"}
        {riskLevel === 'moderate' && "⚠️ MODERATE RISK"}
        {riskLevel === 'low' && "✓ LOW RISK - STAY ALERT"}
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="text-green-400">✓</span> DO
          </h3>
          <ul className="space-y-2">
            {tips.dos.map((tip, idx) => (
              <li key={idx} className="text-gray-300 text-sm pl-4 border-l-2 border-green-500">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="text-red-400">✗</span> DON'T
          </h3>
          <ul className="space-y-2">
            {tips.donts.map((tip, idx) => (
              <li key={idx} className="text-gray-300 text-sm pl-4 border-l-2 border-red-500">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-white font-semibold mb-3">Emergency Contacts</h3>
          <div className="space-y-2">
            {getEmergencyContacts().map((contact, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-800 p-2 rounded"
              >
                <span className="text-gray-300 text-sm">{contact.name}</span>
                <span className="text-white font-mono font-bold">{contact.number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;