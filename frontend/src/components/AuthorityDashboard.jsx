import { mockWards } from '../data/mockWards';

const AuthorityDashboard = ({ selectedWard }) => {
  // Calculate summary statistics
  const totalWards = mockWards.features.length;
  const criticalWards = mockWards.features.filter(w => w.properties.riskLevel === 'critical').length;
  const highRiskWards = mockWards.features.filter(w => w.properties.riskLevel === 'high').length;
  const totalAlerts = mockWards.features.reduce((sum, w) => sum + w.properties.alerts.length, 0);

  const StatCard = ({ title, value, color, subtitle }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="absolute top-20 right-6 z-10 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Authority Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          title="Total Wards"
          value={totalWards}
          color="text-blue-400"
        />
        <StatCard
          title="Active Alerts"
          value={totalAlerts}
          color="text-red-400"
        />
        <StatCard
          title="Critical Wards"
          value={criticalWards}
          color="text-red-500"
          subtitle="Immediate attention"
        />
        <StatCard
          title="High Risk Wards"
          value={highRiskWards}
          color="text-orange-500"
          subtitle="Monitor closely"
        />
      </div>

      {selectedWard && (
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-white font-semibold mb-3">Selected Ward Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition-colors">
              Deploy Response Team
            </button>
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded text-sm transition-colors">
              Send Alert to Residents
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm transition-colors">
              View Detailed Report
            </button>
          </div>
        </div>
      )}

      {!selectedWard && (
        <div className="border-t border-gray-700 pt-4">
          <p className="text-gray-400 text-sm text-center">
            Select a ward to view actions
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthorityDashboard;