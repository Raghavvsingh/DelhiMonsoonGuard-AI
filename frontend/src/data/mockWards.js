// Mock Delhi wards data
// GeoJSON format: coordinates are [longitude, latitude]
// Delhi approximate bounds: 76.8°E to 77.5°E, 28.4°N to 28.9°N

export const mockWards = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "ward_1",
        name: "Civil Lines",
        riskLevel: "critical",
        waterLevel: 92,
        alerts: ["Flash flood warning", "Drain overflow"],
        population: 45000
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.20, 28.72],
          [77.25, 28.72],
          [77.25, 28.68],
          [77.20, 28.68],
          [77.20, 28.72]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "ward_2",
        name: "Karol Bagh",
        riskLevel: "high",
        waterLevel: 78,
        alerts: ["Water accumulation reported"],
        population: 62000
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.16, 28.68],
          [77.20, 28.68],
          [77.20, 28.64],
          [77.16, 28.64],
          [77.16, 28.68]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "ward_3",
        name: "Rohini",
        riskLevel: "moderate",
        waterLevel: 52,
        alerts: [],
        population: 78000
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.08, 28.76],
          [77.12, 28.76],
          [77.12, 28.72],
          [77.08, 28.72],
          [77.08, 28.76]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "ward_4",
        name: "Dwarka",
        riskLevel: "low",
        waterLevel: 28,
        alerts: [],
        population: 85000
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.00, 28.60],
          [77.04, 28.60],
          [77.04, 28.56],
          [77.00, 28.56],
          [77.00, 28.60]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "ward_5",
        name: "Connaught Place",
        riskLevel: "high",
        waterLevel: 74,
        alerts: ["Traffic disruption expected"],
        population: 38000
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.20, 28.64],
          [77.24, 28.64],
          [77.24, 28.60],
          [77.20, 28.60],
          [77.20, 28.64]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "ward_6",
        name: "Saket",
        riskLevel: "moderate",
        waterLevel: 48,
        alerts: [],
        population: 52000
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.20, 28.56],
          [77.24, 28.56],
          [77.24, 28.52],
          [77.20, 28.52],
          [77.20, 28.56]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "ward_7",
        name: "Mayur Vihar",
        riskLevel: "critical",
        waterLevel: 88,
        alerts: ["Evacuation advisory", "Power outage risk"],
        population: 71000
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.28, 28.64],
          [77.32, 28.64],
          [77.32, 28.60],
          [77.28, 28.60],
          [77.28, 28.64]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "ward_8",
        name: "Vasant Kunj",
        riskLevel: "low",
        waterLevel: 32,
        alerts: [],
        population: 48000
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.12, 28.56],
          [77.16, 28.56],
          [77.16, 28.52],
          [77.12, 28.52],
          [77.12, 28.56]
        ]]
      }
    }
  ]
};

// Helper function to get risk color
export const getRiskColor = (riskLevel) => {
  const colors = {
    critical: '#ef4444',
    high: '#f97316',
    moderate: '#eab308',
    low: '#22c55e'
  };
  return colors[riskLevel] || '#6b7280';
};