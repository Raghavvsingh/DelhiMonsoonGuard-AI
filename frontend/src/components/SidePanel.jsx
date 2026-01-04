import { motion, AnimatePresence } from "framer-motion";
import { getRiskColor } from "../utils/riskUtils";

const SidePanel = ({ wards, selectedWard }) => {
  if (!selectedWard) {
    return (
      <div className="absolute top-20 left-6 z-10 w-80 bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-2xl">
        <p className="text-gray-400 text-sm">
          Click on a ward to view details
        </p>
      </div>
    );
  }
const explainRiskInOneLine = (ward) => {
  if (!ward?.raw_factors) return null;

  const { rainfall_mm, drainage_weakness, elevation_risk } = ward.raw_factors;

  if (rainfall_mm > 80 && drainage_weakness > 0.6)
    return "Heavy rainfall combined with weak drainage";

  if (elevation_risk > 0.8)
    return "Low-lying area prone to water accumulation";

  return "Stable conditions with adequate drainage";
};

  /* ---------- Extract ward data ---------- */
  const {
    id,
    name,
    Ward_No,
  } = selectedWard.geo.properties;

  const backendWard = selectedWard.data;
  const isSpecialWard = selectedWard.isSpecialWard;
  const isUnmatched = selectedWard.isUnmatched;

  /* ---------- Safe derived values ---------- */
  const finalRiskLevel = backendWard?.risk?.level ?? "Unknown";
  const finalRiskScore = backendWard?.risk?.score;
  const riskColor = getRiskColor(finalRiskLevel);

  const populationValue =
    typeof backendWard?.population === "number"
      ? backendWard.population
      : null;

  const hasBackendData = !!backendWard;

  /* ---------- UI ---------- */
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -320, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-20 left-6 z-10 w-80 max-h-[calc(100vh-120px)] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-y-auto"
      >
        <div className="p-6">
          {/* Ward Name */}
          <h2 className="text-2xl font-bold text-white mb-2">
            {name || "Unknown Ward"}
          </h2>
          
          {/* Ward Number */}
          <p className="text-gray-400 text-sm mb-1">
            Ward No: {Ward_No}
          </p>

          {/* Backend ID (if available) */}
          {backendWard && (
            <p className="text-gray-400 text-sm mb-4">
              Backend ID: {backendWard.ward_id}
            </p>
          )}

          {/* Special Ward Warning (CANT/NDMC) */}
          {isSpecialWard && (
            <div className="mb-4 p-3 bg-blue-900/40 border border-blue-700 rounded text-blue-200 text-sm">
              ℹ️ This is a {String(Ward_No).startsWith('CANT') ? 'Cantonment' : 'NDMC'} ward. 
              Monitoring data is not available as these areas are not under MCD jurisdiction.
            </div>
          )}

          {/* Unmatched Ward Warning */}
          {isUnmatched && (
            <div className="mb-4 p-3 bg-yellow-900/40 border border-yellow-700 rounded text-yellow-200 text-sm">
              ℹ️ Ward #{Ward_No} could not be matched to backend monitoring data. 
              This may be due to incomplete ward_mapping.json coverage (only 136 of 290 wards mapped).
            </div>
          )}

          {/* Backend Name (if different from geo name) */}
          {backendWard && backendWard.ward_name !== name && (
            <div className="mb-4 p-3 bg-slate-800 rounded text-sm">
              <p className="text-gray-400 mb-1">Backend Monitoring Area:</p>
              <p className="text-white font-semibold">{backendWard.ward_name}</p>
            </div>
          )}

          {/* Risk Level */}
          {hasBackendData && (
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Risk Level</p>
              {/* Risk Level Row */}
<div className="flex items-center gap-3">
  <div
    className="w-4 h-4 rounded-full"
    style={{ backgroundColor: riskColor }}
  />

  <span className="text-white font-semibold uppercase text-lg">
    {finalRiskLevel}
  </span>

  {finalRiskScore !== undefined && (
    <span className="text-gray-400 text-sm ml-auto">
      Water-Logging Risk Index: {finalRiskScore.toFixed(1)} / 100
    </span>
  )}
</div>

{/* Risk Explanation */}
{backendWard?.raw_factors && (
  <p className="text-xs text-gray-400 italic mt-2 leading-snug">
    {finalRiskLevel === "High" &&
      `${explainRiskInOneLine(backendWard)} makes this an active water-logging hotspot.`}
    {finalRiskLevel === "Medium" &&
      `${explainRiskInOneLine(backendWard)} indicates a potential hotspot.`}
    {finalRiskLevel === "Low" &&
      `${explainRiskInOneLine(backendWard)}.`}
  </p>
)}

            </div>
          )}

          {/* Zone */}
          {backendWard?.zone && (
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Zone</p>
              <p className="text-white font-semibold">{backendWard.zone}</p>
            </div>
          )}

          {/* Population */}
          {hasBackendData && (
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Population</p>
              <p className="text-white font-semibold text-xl">
                {populationValue !== null
                  ? populationValue.toLocaleString()
                  : "N/A"}
              </p>
            </div>
          )}

          {/* Priority Rank */}
          {backendWard?.priority && (
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Priority Ranking</p>
              <p className="text-white font-semibold">
                #{backendWard.priority.rank} of 250
              </p>
            </div>
          )}

          {/* FIXED: Current Conditions Section */}
          {/* This section now properly displays all raw_factors from the backend */}
          {hasBackendData && backendWard?.raw_factors && (
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-3 font-semibold">Current Conditions</p>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Rainfall - from backend raw_factors.rainfall_mm */}
                  {backendWard.raw_factors.rainfall_mm !== undefined && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Rainfall (24h)</p>
                      <p className="text-white font-bold text-lg">
                        {backendWard.raw_factors.rainfall_mm.toFixed(1)} mm
                      </p>
                    </div>
                  )}
                  
                  {/* Drainage - from backend raw_factors.drainage_weakness */}
                  {backendWard.raw_factors.drainage_weakness !== undefined && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Drainage Weakness</p>
                      <p className="text-white font-bold text-lg">
                        {(backendWard.raw_factors.drainage_weakness * 100).toFixed(0)}%
                      </p>
                    </div>
                  )}
                  
                  {/* Elevation - from backend raw_factors.elevation_risk */}
                  {backendWard.raw_factors.elevation_risk !== undefined && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Elevation Risk</p>
                      <p className="text-white font-bold text-lg">
                        {backendWard.raw_factors.elevation_risk.toFixed(1)}
                      </p>
                    </div>
                  )}
                  
                  {/* Past Incidents - from backend raw_factors.past_incidents */}
                  {backendWard.raw_factors.past_incidents !== undefined && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Past Incidents</p>
                      <p className="text-white font-bold text-lg">
                        {backendWard.raw_factors.past_incidents}
                      </p>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
          )}

          {/* Critical Factors from explainability */}
          {backendWard?.explainability?.top_factors && backendWard.explainability.top_factors.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Critical Factors</p>
              <ul className="space-y-2">
                {backendWard.explainability.top_factors.slice(0, 3).map((factor, idx) => (
                  <li key={idx} className="text-white text-sm flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <div>
                      <span className="font-semibold">{factor.factor}</span>
                      <span className="text-gray-400 text-xs ml-2">
                        (Impact: {factor.contribution > 0 ? '+' : ''}{factor.contribution?.toFixed(1) ?? 'N/A'}%)
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Required Alert */}
          {backendWard?.priority?.action_required && (
            <div className="bg-red-900/60 border border-red-700 p-3 rounded text-sm text-red-200">
              ⚠️ Immediate action required
            </div>
          )}

          {/* No Data Message */}
          {!hasBackendData && !isSpecialWard && !isUnmatched && (
            <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm">
              ℹ️ Detailed monitoring data not available for this ward
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SidePanel;