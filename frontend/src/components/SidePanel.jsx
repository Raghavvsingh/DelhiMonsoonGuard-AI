import { motion, AnimatePresence } from 'framer-motion';
import { getRiskColor } from '../data/mockWards';

const SidePanel = ({ selectedWard, mode }) => {
  if (!selectedWard) {
    return (
      <div className="absolute top-20 left-6 z-10 w-80 bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-2xl">
        <p className="text-gray-400 text-sm">Click on a ward to view details</p>
      </div>
    );
  }

  const { name, riskLevel, waterLevel, alerts, population } = selectedWard.properties;
  const riskColor = getRiskColor(riskLevel);

  const getSafetyMessage = (level) => {
    const messages = {
      critical: "IMMEDIATE ACTION REQUIRED - Evacuate to higher ground if advised by authorities.",
      high: "STAY ALERT - Avoid unnecessary travel and monitor weather updates closely.",
      moderate: "CAUTION ADVISED - Stay indoors during heavy rainfall.",
      low: "NORMAL CONDITIONS - Remain aware of weather forecasts."
    };
    return messages[level] || "";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -320, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-20 left-6 z-10 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
      >
        {mode === 'authority' ? (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">{name}</h2>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: riskColor }}
                />
                <span className="text-white font-semibold uppercase">{riskLevel} Risk</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Water Level</p>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${waterLevel}%`,
                      backgroundColor: riskColor
                    }}
                  />
                </div>
                <p className="text-white text-lg font-bold mt-1">{waterLevel}%</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Population</p>
                <p className="text-white text-lg font-semibold">{population.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Active Alerts</p>
                {alerts.length > 0 ? (
                  <div className="space-y-2">
                    {alerts.map((alert, idx) => (
                      <div key={idx} className="bg-red-950 border border-red-800 rounded p-2">
                        <p className="text-red-200 text-sm">{alert}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-400 text-sm">No active alerts</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">{name}</h2>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: riskColor }}
                />
                <span className="text-white font-semibold uppercase">{riskLevel} Risk</span>
              </div>
            </div>

            <div
              className="border-l-4 p-4 mb-4 rounded"
              style={{
                borderColor: riskColor,
                backgroundColor: `${riskColor}22`
              }}
            >
              <p className="text-white text-sm font-medium">
                {getSafetyMessage(riskLevel)}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Safety Guidelines</p>
                {riskLevel === 'critical' || riskLevel === 'high' ? (
                  <ul className="space-y-1 text-sm">
                    <li className="text-red-300">✗ Do not venture into waterlogged areas</li>
                    <li className="text-red-300">✗ Avoid driving through flooded streets</li>
                    <li className="text-green-300">✓ Keep emergency contacts handy</li>
                    <li className="text-green-300">✓ Store drinking water and essentials</li>
                  </ul>
                ) : (
                  <ul className="space-y-1 text-sm">
                    <li className="text-green-300">✓ Stay updated on weather forecasts</li>
                    <li className="text-green-300">✓ Keep emergency kit ready</li>
                    <li className="text-yellow-300">⚠ Avoid low-lying areas during rain</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SidePanel;