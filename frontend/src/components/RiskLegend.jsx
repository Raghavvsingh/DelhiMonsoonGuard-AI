import { useState } from "react";

const RiskLegend = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-2">
      
      {/* COLLAPSED BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-900 border border-gray-700 text-white text-xs px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition"
        >
          Map Legend ⓘ
        </button>
      )}

      {/* EXPANDED LEGEND */}
      {open && (
        <>
          {/* CLICK-OUTSIDE BACKDROP */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          {/* LEGEND PANEL */}
          <div className="relative z-20 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-2xl w-64">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white text-sm font-semibold">
                Water-Logging Status
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-600" />
                <span>Active Water-Logging Hotspot</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Potential Hotspot</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-green-600" />
                <span>Normal Monitoring Zone</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-700 mt-2">
                <span className="w-3 h-3 rounded bg-gray-600" />
                <span className="text-xs">Unmatched / NDMC</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RiskLegend;
