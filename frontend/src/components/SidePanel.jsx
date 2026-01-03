import { motion, AnimatePresence } from "framer-motion";
import { getRiskColor } from '../utils/riskUtils';

const SidePanel = ({ wards, selectedWard, mode }) => {
  if (!selectedWard) {
    return (
      <div className="absolute top-20 left-6 z-10 w-80 bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-2xl">
        <p className="text-gray-400 text-sm">
          Click on a ward to view details
        </p>
      </div>
    );
  }

  // GeoJSON (always exists)
  const {
  id,
  name,
  riskLevel,
  waterLevel,
  population
} = selectedWard.geo.properties;


  // Backend ward (may or may not exist)
  const backendWard = wards?.find((w) => w.ward_id === id);

  // Prefer backend risk if present
  const finalRiskLevel = backendWard?.risk.level || riskLevel;
  const riskColor = getRiskColor(finalRiskLevel);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -320, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-20 left-6 z-10 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {name}
          </h2>

          {/* Risk */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: riskColor }}
            />
            <span className="text-white font-semibold uppercase">
              {finalRiskLevel} Risk
            </span>
          </div>

          {/* Water Level (UI preserved) */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-1">Water Level</p>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${waterLevel}%`,
                  backgroundColor: riskColor
                }}
              />
            </div>
            <p className="text-white font-bold mt-1">{waterLevel}%</p>
          </div>

          {/* Population */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-1">Population</p>
            <p className="text-white font-semibold">
              {population.toLocaleString()}
            </p>
          </div>

          {/* Backend alert (if exists) */}
          {backendWard?.priority?.action_required && (
            <div className="bg-red-900/60 p-2 rounded text-sm text-red-200">
              ⚠️ Immediate action required
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SidePanel;
