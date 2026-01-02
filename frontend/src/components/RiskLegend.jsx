import { getRiskColor } from '../data/mockWards';

const RiskLegend = () => {
  const riskLevels = [
    { level: 'critical', label: 'Critical' },
    { level: 'high', label: 'High' },
    { level: 'moderate', label: 'Moderate' },
    { level: 'low', label: 'Low' }
  ];

  return (
    <div className="absolute bottom-6 left-6 z-10 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-2xl">
      <h3 className="text-white text-sm font-semibold mb-2">Risk Level</h3>
      <div className="space-y-2">
        {riskLevels.map(({ level, label }) => (
          <div key={level} className="flex items-center gap-2">
            <div
              className="w-6 h-4 rounded"
              style={{ backgroundColor: getRiskColor(level) }}
            />
            <span className="text-gray-300 text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskLegend;