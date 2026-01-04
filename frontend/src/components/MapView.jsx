import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import wardsGeoJSONRaw from "../data/Delhi_Wards.geojson?raw";
import wardMappingRaw from "../data/ward_mapping.json?raw";

import redPin from "../assets/markers/marker-red.png";
import yellowPin from "../assets/markers/marker-yellow.png";
import greenPin from "../assets/markers/marker-green.png";

const wardsGeoJSON = JSON.parse(wardsGeoJSONRaw);
const wardMapping = JSON.parse(wardMappingRaw);

const pinIcons = {
  red: redPin,
  yellow: yellowPin,
  green: greenPin,
};

const getWardColor = (riskLevel) => {
  if (riskLevel === "High") return "#ef4444";
  if (riskLevel === "Medium") return "#facc15";
  return "#22c55e";
};

const MapView = ({ wards, onWardClick, selectedWard }) => {
  
  // Create lookup: backend ward_id → ward data
  const wardsById = Object.fromEntries(
    (wards || []).map((w) => [w.ward_id, w])
  );

  // IMPROVED: Get backend ward data for a GeoJSON feature
  const getBackendWard = (geoFeature) => {
    const geoWardNo = String(geoFeature?.properties?.Ward_No || '');
    
    // Method 1: Check mapping file (primary method)
    const mapping = wardMapping.geo_to_backend[geoWardNo];
    if (mapping) {
      const ward = wardsById[mapping.backend_id];
      if (ward) {
        console.log(`✅ Matched GeoJSON ward ${geoWardNo} → ${mapping.backend_id} (${ward.ward_name})`);
        return ward;
      }
    }
    
    // Method 2: Try direct numeric match (fallback for unmapped wards)
    if (!isNaN(geoWardNo) && geoWardNo !== '') {
      const numericMatch = wards.find(w => w.ward_no === parseInt(geoWardNo));
      if (numericMatch) {
        console.log(`✅ Direct numeric match: ward_no ${geoWardNo} → ${numericMatch.ward_id}`);
        return numericMatch;
      }
    }
    
    // No match found
    console.warn(`❌ No match for GeoJSON ward ${geoWardNo} (${geoFeature?.properties?.Ward_Name})`);
    return null;
  };

  // Check if ward is special (CANT/NDMC)
  const isSpecialWard = (geoWardNo) => {
    const wardNoStr = String(geoWardNo || '');
    return wardNoStr.startsWith('CANT') || wardNoStr.startsWith('NDMC');
  };

  // Style function for ward polygons
  const wardStyle = (feature) => {
    const geoWardNo = feature?.properties?.Ward_No;
    
    // Special wards (CANT/NDMC) - gray with low opacity
    if (isSpecialWard(geoWardNo)) {
      return {
        fillColor: "#6b7280",
        weight: 1,
        color: "#4b5563",
        fillOpacity: 0.3,
      };
    }

    // Get backend data
    const backendWard = getBackendWard(feature);

    // If no backend data (unmatched ward) - darker gray
    if (!backendWard) {
      return {
        fillColor: "#374151",
        weight: 1,
        color: "#4b5563",
        fillOpacity: 0.4,
      };
    }

    // Matched ward - color by risk level
    return {
      fillColor: getWardColor(backendWard.risk.level),
      weight: 1,
      color: "#38bdf8",
      fillOpacity: 0.7,
    };
  };

  // Event handlers for ward polygons
  const onEachWard = (feature, layer) => {
    const geoWardNo = feature?.properties?.Ward_No;
    const geoWardName = feature?.properties?.Ward_Name;
    
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#60a5fa',
          fillOpacity: 0.85
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(wardStyle(feature));
      },
      click: () => {
        const backendWard = getBackendWard(feature);
        const isSpecial = isSpecialWard(geoWardNo);

        onWardClick({
          geo: {
            ...feature,
            properties: {
              ...feature.properties,
              id: backendWard?.ward_id || geoWardNo,
              name: geoWardName,
              Ward_No: geoWardNo,
            },
          },
          data: backendWard,
          isSpecialWard: isSpecial,
          isUnmatched: !backendWard && !isSpecial,
        });
      },
    });
  };

  // Filter wards for pin markers - only top risk wards with backend data
  const visibleWards = (() => {
    if (!wards || wards.length === 0) return [];

    // Only include wards that have mapping
    const mappedWards = wards.filter(w => 
      Object.values(wardMapping.backend_to_geo).some(m => m.backend_name === w.ward_name)
    );

    // Sort by risk score
    const sorted = [...mappedWards].sort(
      (a, b) => b.risk.score - a.risk.score
    );

    // Get top wards by risk level
    const topHigh = sorted
      .filter(w => w.risk.level === "High")
      .slice(0, 8);

    const topMedium = sorted
      .filter(w => w.risk.level === "Medium")
      .slice(0, 5);

    const topLow = sorted
      .filter(w => w.risk.level === "Low")
      .slice(0, 3);

    return [...topHigh, ...topMedium, ...topLow];
  })();

  // Get GeoJSON feature for a backend ward
  const getGeoFeature = (backendWardId) => {
    const mapping = wardMapping.backend_to_geo[backendWardId];
    if (!mapping) return null;

    // Find the feature in GeoJSON
    return wardsGeoJSON.features.find(
      f => String(f.properties.Ward_No) === String(mapping.geo_no)
    );
  };

  // Calculate centroid of a polygon
  const getPolygonCenter = (coordinates) => {
    // For MultiPolygon or Polygon, take the first ring
    const ring = Array.isArray(coordinates[0][0][0]) 
      ? coordinates[0][0]  // MultiPolygon
      : coordinates[0];     // Polygon

    // Calculate average lat/lng
    const sum = ring.reduce((acc, coord) => {
      return [acc[0] + coord[0], acc[1] + coord[1]];
    }, [0, 0]);

    return [sum[1] / ring.length, sum[0] / ring.length]; // [lat, lng]
  };

  // Create icon for pins
  const createPinIcon = (color, isSelected = false) =>
    new L.Icon({
      iconUrl: pinIcons[color],
      iconRetinaUrl: pinIcons[color],
      shadowUrl: null,
      iconSize: isSelected ? [36, 54] : [30, 45],
      iconAnchor: isSelected ? [18, 54] : [15, 45],
      popupAnchor: [0, -40],
    });

  const getPinColor = (risk) => {
    if (risk === "High") return "red";
    if (risk === "Medium") return "yellow";
    return "green";
  };

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={11}
        minZoom={10}
        maxZoom={15}
        maxBounds={[
          [28.4, 76.8],
          [28.9, 77.5]
        ]}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap & CARTO"
        />

        {/* Render all ward polygons */}
        <GeoJSON
          data={wardsGeoJSON}
          style={wardStyle}
          onEachFeature={onEachWard}
        />

        {/* Render pin markers for top-risk wards */}
        {visibleWards.map((ward) => {
          const geoFeature = getGeoFeature(ward.ward_id);
          if (!geoFeature) return null;

          const isSelected =
            selectedWard?.data?.ward_id === ward.ward_id;

          const center = getPolygonCenter(geoFeature.geometry.coordinates);

          return (
            <Marker
              key={ward.ward_id}
              position={center}
              icon={createPinIcon(getPinColor(ward.risk.level), isSelected)}
              eventHandlers={{
                click: () => {
                  onWardClick({
                    geo: {
                      ...geoFeature,
                      properties: {
                        ...geoFeature.properties,
                        id: ward.ward_id,
                        name: geoFeature.properties.Ward_Name,
                      },
                    },
                    data: ward,
                    isSpecialWard: false,
                    isUnmatched: false,
                  });
                },
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Ward:</strong> {geoFeature.properties.Ward_Name}<br />
                  <strong>Backend:</strong> {ward.ward_name}<br />
                  <strong>Risk:</strong> {ward.risk.level}<br />
                  <strong>Score:</strong> {ward.risk.score.toFixed(2)}<br />
                  <strong>Population:</strong> {ward.population?.toLocaleString() || 'N/A'}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;