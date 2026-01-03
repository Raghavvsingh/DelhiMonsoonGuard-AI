export const getRiskColor = (riskLevel) => {
  if (riskLevel === "High") return "#dc2626";    // red
  if (riskLevel === "Medium") return "#f59e0b"; // amber
  return "#16a34a";                             // green
};
