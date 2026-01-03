import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import SidePanel from './components/SidePanel';
import AuthorityDashboard from './components/AuthorityDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import RiskLegend from './components/RiskLegend';
import { fetchRiskData } from './services/riskServices' // ✅ NEW

function App() {
  const [mode, setMode] = useState('authority');
  const [selectedWard, setSelectedWard] = useState(null);

  // ✅ NEW: backend data state
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
 
  // ✅ NEW: fetch backend data once
  useEffect(() => {
    fetchRiskData()
      .then((data) => {
        setWards(data.wards); // 🔑 ONLY wards go to UI
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">
        Loading Delhi Monsoon Guard…
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      
      {/* MAP BASE LAYER */}
      <div className="absolute inset-0 z-0">
        <MapView
          wards={wards}                 // ✅ NEW
          selectedWard={selectedWard}
          onWardClick={setSelectedWard}
        />
      </div>

      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-4 bg-slate-900/60 backdrop-blur border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            Delhi Monsoon Guard
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setMode('authority')}
              className={`px-3 py-1 rounded text-sm ${
                mode === 'authority'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Authority
            </button>

            <button
              onClick={() => setMode('citizen')}
              className={`px-3 py-1 rounded text-sm ${
                mode === 'citizen'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Citizen
            </button>
          </div>
        </div>
      </header>

      {/* LEFT SIDE PANEL */}
      <SidePanel
        wards={wards}                   // ✅ NEW
        selectedWard={selectedWard}
        mode={mode}
      />

      {/* RIGHT DASHBOARD */}
      {mode === 'authority' ? (
        <AuthorityDashboard
          wards={wards}                 // ✅ NEW
          selectedWard={selectedWard}
        />
      ) : (
        <CitizenDashboard
          wards={wards}                 // ✅ NEW
          selectedWard={selectedWard}
        />
      )}

      {/* LEGEND */}
      <RiskLegend />
    </div>
  );
}

export default App;
