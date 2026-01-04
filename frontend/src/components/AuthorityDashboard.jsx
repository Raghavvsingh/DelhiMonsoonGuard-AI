// import { useState } from "react";

// const AuthorityDashboard = ({ wards, selectedWard }) => {
//   const [showReport, setShowReport] = useState(false);

//   if (!wards || wards.length === 0) return null;

//   /* ---------------- STATS ---------------- */
//   const totalWards = wards.length;
//   const activeHotspots = wards.filter(w => w.risk.level === "High").length;
//   const potentialHotspots = wards.filter(w => w.risk.level === "Medium").length;
//   const totalAlerts = wards.filter(w => w.priority?.action_required).length;

//   const StatCard = ({ title, value, color, subtitle }) => (
//     <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
//       <p className="text-gray-400 text-sm mb-1">{title}</p>
//       <p className={`text-3xl font-bold ${color}`}>{value}</p>
//       {subtitle && (
//         <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
//       )}
//     </div>
//   );

//   /* ---------------- SELECTED WARD ---------------- */
//   const selectedWardData = selectedWard?.data || null;
//   const raw = selectedWardData?.raw_factors;

//   /* ---------------- AI-LIKE CRITICAL FACTORS ---------------- */
//   const generateCriticalRiskFactors = (ward) => {
//     if (!ward?.raw_factors || !ward?.risk) return [];

//     const factors = [];
//     const { rainfall_mm, drainage_weakness, elevation_risk, past_incidents } =
//       ward.raw_factors;

//     if (rainfall_mm > 80) {
//       factors.push(
//         "Heavy rainfall in the last 24 hours has significantly increased surface water accumulation."
//       );
//     }

//     if (drainage_weakness > 0.6) {
//       factors.push(
//         "Weak drainage infrastructure is restricting runoff, increasing water-logging risk."
//       );
//     }

//     if (elevation_risk > 0.7) {
//       factors.push(
//         "Low-lying terrain makes this ward prone to prolonged water retention during rainfall."
//       );
//     }

//     if (past_incidents >= 5) {
//       factors.push(
//         "Multiple historical water-logging incidents indicate recurring flood vulnerability."
//       );
//     }

//     if (factors.length === 0) {
//       factors.push(
//         "Combined environmental and infrastructure conditions contribute to the current risk profile."
//       );
//     }

//     return factors;
//   };

//   const handleViewReport = () => {
//     if (!selectedWardData) return;
//     setShowReport(true);
//   };

//   return (
//     <div className="absolute top-20 right-6 z-10 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-6">
//       <h2 className="text-xl font-bold text-white mb-4">
//         Authority Dashboard
//       </h2>

//       {/* ---------------- STATS ---------------- */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <StatCard title="Total Wards" value={totalWards} color="text-blue-400" />
//         <StatCard title="Active Alerts" value={totalAlerts} color="text-red-400" />
//         <StatCard
//           title="Active Water-Logging Hotspots"
//           value={activeHotspots}
//           color="text-red-500"
//           subtitle="Immediate attention"
//         />
//         <StatCard
//           title="Potential Hotspots"
//           value={potentialHotspots}
//           color="text-yellow-400"
//           subtitle="Monitor closely"
//         />
//       </div>

//       {/* ---------------- ACTIONS ---------------- */}
//       {selectedWardData ? (
//         <div className="border-t border-gray-700 pt-4">
//           <h3 className="text-white font-semibold mb-3">
//             Selected Ward Actions
//           </h3>

//           <p className="text-sm text-gray-400 mb-2">
//             Ward {selectedWardData.ward_id} — {selectedWardData.risk.level} Risk
//           </p>

//           <div className="space-y-2">
//             {selectedWardData.priority?.action_required && (
//               <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm">
//                 Deploy Response Team
//               </button>
//             )}

//             <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded text-sm">
//               {selectedWardData.risk.level === "High"
//                 ? "Send Emergency Alert"
//                 : "Send Advisory Notice"}
//             </button>

//             <button
//               onClick={handleViewReport}
//               className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm"
//             >
//               View Detailed Report
//             </button>
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-400 text-sm text-center border-t border-gray-700 pt-4">
//           Select a ward to view actions
//         </p>
//       )}

//       {/* ---------------- DETAILED REPORT MODAL ---------------- */}
//       {showReport && selectedWardData && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-[420px] text-white">
//             <h3 className="text-lg font-semibold mb-4">
//               📊 Detailed Ward Report
//             </h3>

//             <div className="space-y-2 text-sm">
//               <p><strong>Ward:</strong> {selectedWardData.ward_name}</p>
//               <p><strong>Risk Level:</strong> {selectedWardData.risk.level}</p>
//               <p><strong>Risk Score:</strong> {selectedWardData.risk.score.toFixed(2)}</p>

//               <hr className="border-gray-700 my-2" />

//               <p className="font-semibold">Current Conditions</p>

//               {raw ? (
//                 <>
//                   <p>🌧 Rainfall (24h): {raw.rainfall_mm.toFixed(1)} mm</p>
//                   <p>🚰 Drainage Weakness: {(raw.drainage_weakness * 100).toFixed(0)}%</p>
//                   <p>🏔 Elevation Risk: {raw.elevation_risk.toFixed(1)}</p>
//                   <p>📍 Past Incidents: {raw.past_incidents}</p>
//                 </>
//               ) : (
//                 <p className="text-gray-400 italic">
//                   Sensor-level data not available.
//                 </p>
//               )}

//               <hr className="border-gray-700 my-2" />

//               <p className="font-semibold">Critical Risk Factors</p>

//               <ul className="mt-2 space-y-2">
//                 {generateCriticalRiskFactors(selectedWardData).map((factor, idx) => (
//                   <li key={idx} className="flex items-start gap-2">
//                     <span className="text-red-400 font-bold">•</span>
//                     <span className="text-gray-200">{factor}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <button
//               onClick={() => setShowReport(false)}
//               className="mt-5 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
//             >
//               Close Report
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuthorityDashboard;

import { useState } from "react";

const AuthorityDashboard = ({ wards, selectedWard }) => {
  const [showReport, setShowReport] = useState(false);

  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [alertLog, setAlertLog] = useState([]);
  const [alertSentForWard, setAlertSentForWard] = useState({});

  const [showConfirmDeploy, setShowConfirmDeploy] = useState(false);
  const [deployments, setDeployments] = useState({});
  const [deploymentLog, setDeploymentLog] = useState([]);

  if (!wards || wards.length === 0) return null;

  /* ---------------- STATS ---------------- */
  const totalWards = wards.length;
  const activeHotspots = wards.filter(w => w.risk.level === "High").length;
  const potentialHotspots = wards.filter(w => w.risk.level === "Medium").length;
  const totalAlerts = wards.filter(w => w.priority?.action_required).length;

  const StatCard = ({ title, value, color, subtitle }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );

  /* ---------------- SELECTED WARD ---------------- */
  const selectedWardData = selectedWard?.data || null;
  const raw = selectedWardData?.raw_factors;

  /* ---------------- CRITICAL FACTORS ---------------- */
  const generateCriticalRiskFactors = (ward) => {
    if (!ward?.raw_factors) return [];

    const factors = [];
    const { rainfall_mm, drainage_weakness, elevation_risk, past_incidents } =
      ward.raw_factors;

    if (rainfall_mm > 80)
      factors.push("Heavy rainfall has caused rapid surface water accumulation.");

    if (drainage_weakness > 0.6)
      factors.push("Weak drainage infrastructure is limiting runoff.");

    if (elevation_risk > 0.7)
      factors.push("Low-lying terrain increases flood retention risk.");

    if (past_incidents >= 5)
      factors.push("Repeated historical incidents show recurring vulnerability.");

    if (factors.length === 0)
      factors.push("Environmental and infrastructure factors collectively elevate risk.");

    return factors;
  };

  /* ---------------- EMERGENCY ALERT ---------------- */
  const handleConfirmSendAlert = () => {
    const timestamp = new Date().toLocaleTimeString();

    setAlertLog(prev => [
      {
        time: timestamp,
        message: `Emergency alert issued for ${selectedWardData.ward_name}`,
      },
      ...prev,
    ]);

    setAlertSentForWard(prev => ({
      ...prev,
      [selectedWardData.ward_id]: true,
    }));

    setShowConfirmAlert(false);
  };

  /* ---------------- DEPLOY RESPONSE TEAM ---------------- */
  const handleConfirmDeploy = () => {
    const timestamp = new Date().toLocaleTimeString();
    const eta = Math.floor(Math.random() * 10) + 10;

    const deployment = {
      team: "Rapid Response Unit – Zone A",
      eta,
      time: timestamp,
    };

    setDeployments(prev => ({
      ...prev,
      [selectedWardData.ward_id]: deployment,
    }));

    setDeploymentLog(prev => [
      {
        ward: selectedWardData.ward_name,
        ...deployment,
      },
      ...prev,
    ]);

    setShowConfirmDeploy(false);
  };

  const isAlertSent =
    selectedWardData && alertSentForWard[selectedWardData.ward_id];

  const isDeployed =
    selectedWardData && deployments[selectedWardData.ward_id];

  return (
    <div className="absolute top-20 right-6 z-10 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Authority Dashboard
      </h2>

      {/* ---------------- STATS ---------------- */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard title="Total Wards" value={totalWards} color="text-blue-400" />
        <StatCard title="Active Alerts" value={totalAlerts} color="text-red-400" />
        <StatCard
          title="Active Water-Logging Hotspots"
          value={activeHotspots}
          color="text-red-500"
          subtitle="Immediate attention"
        />
        <StatCard
          title="Potential Hotspots"
          value={potentialHotspots}
          color="text-yellow-400"
          subtitle="Monitor closely"
        />
      </div>

      {/* ---------------- ACTIONS ---------------- */}
      {selectedWardData ? (
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-white font-semibold mb-3">
            Selected Ward Actions
          </h3>

          <p className="text-sm text-gray-400 mb-2">
            Ward {selectedWardData.ward_id} — {selectedWardData.risk.level} Risk
          </p>

          <div className="space-y-2">
            {/* DEPLOY RESPONSE TEAM */}
            {selectedWardData.priority?.action_required && (
              <button
                disabled={isDeployed}
                onClick={() => setShowConfirmDeploy(true)}
                className={`w-full py-2 rounded text-sm ${
                  isDeployed
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isDeployed ? "Response Team Deployed" : "Deploy Response Team"}
              </button>
            )}

            {/* EMERGENCY ALERT */}
            <button
              disabled={isAlertSent}
              onClick={() => setShowConfirmAlert(true)}
              className={`w-full py-2 rounded text-sm ${
                isAlertSent
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
            >
              {isAlertSent ? "Alert Dispatched" : "Send Emergency Alert"}
            </button>

            <button
              onClick={() => setShowReport(true)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm"
            >
              View Detailed Report
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm text-center border-t border-gray-700 pt-4">
          Select a ward to view actions
        </p>
      )}

      {/* ---------------- DEPLOYMENT LOG ---------------- */}
      {deploymentLog.length > 0 && (
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h3 className="text-white font-semibold mb-2">
            Deployment Log
          </h3>
          <ul className="text-sm text-gray-300 space-y-1">
            {deploymentLog.slice(0, 5).map((d, i) => (
              <li key={i}>
                🚑 {d.team} → {d.ward} (ETA {d.eta} min)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------- ALERT LOG ---------------- */}
      {alertLog.length > 0 && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h3 className="text-white font-semibold mb-2">
            Alert Activity Log
          </h3>
          <ul className="text-sm text-gray-300 space-y-1">
            {alertLog.slice(0, 5).map((a, i) => (
              <li key={i}>
                ⏰ [{a.time}] {a.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------- CONFIRM DEPLOY MODAL ---------------- */}
      {showConfirmDeploy && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-[360px] text-white">
            <h3 className="text-lg font-semibold mb-3">
              🚑 Confirm Deployment
            </h3>
            <p className="text-sm mb-4">
              Deploy response team to{" "}
              <strong>{selectedWardData.ward_name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmDeploy}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded"
              >
                Deploy
              </button>
              <button
                onClick={() => setShowConfirmDeploy(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CONFIRM ALERT MODAL ---------------- */}
      {showConfirmAlert && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-[360px] text-white">
            <h3 className="text-lg font-semibold mb-3">
              🚨 Confirm Emergency Alert
            </h3>
            <p className="text-sm mb-4">
              Send emergency alert for{" "}
              <strong>{selectedWardData.ward_name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmSendAlert}
                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
              >
                Send Alert
              </button>
              <button
                onClick={() => setShowConfirmAlert(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- REPORT MODAL ---------------- */}
      {showReport && selectedWardData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-[420px] text-white">
            <h3 className="text-lg font-semibold mb-4">
              📊 Detailed Ward Report
            </h3>

            <p><strong>Ward:</strong> {selectedWardData.ward_name}</p>
            <p><strong>Risk Level:</strong> {selectedWardData.risk.level}</p>
            <p><strong>Risk Score:</strong> {selectedWardData.risk.score.toFixed(2)}</p>

            <hr className="border-gray-700 my-3" />

            <p className="font-semibold mb-2">Critical Risk Factors</p>
            <ul className="space-y-2 text-sm">
              {generateCriticalRiskFactors(selectedWardData).map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowReport(false)}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
            >
              Close Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorityDashboard;

