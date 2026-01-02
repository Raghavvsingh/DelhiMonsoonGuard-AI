import { useState } from 'react';
import MapView from './components/MapView';
import SidePanel from './components/SidePanel';
import AuthorityDashboard from './components/AuthorityDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import RiskLegend from './components/RiskLegend';

function App() {
  const [mode, setMode] = useState('authority');
  const [selectedWard, setSelectedWard] = useState(null);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      
      {/* MAP BASE LAYER */}
      <div className="absolute inset-0 z-0">
        <MapView
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
      <SidePanel selectedWard={selectedWard} mode={mode} />

      {/* RIGHT DASHBOARD */}
      {mode === 'authority' ? (
        <AuthorityDashboard selectedWard={selectedWard} />
      ) : (
        <CitizenDashboard selectedWard={selectedWard} />
      )}

      {/* LEGEND */}
      <RiskLegend />
    </div>
  );
}

export default App;
