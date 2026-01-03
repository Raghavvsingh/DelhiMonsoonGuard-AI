const RiskLegend = () => {
  return (
    <div className="absolute bottom-6 left-6 z-10 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-2xl">
      <h3 className="text-white text-sm font-semibold mb-3">
        Risk Level
      </h3>

      <div className="space-y-2 text-sm text-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-600" />
          <span>High</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-amber-500" />
          <span>Medium</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-600" />
          <span>Low</span>
        </div>
      </div>
    </div>
  );
};

export default RiskLegend;
