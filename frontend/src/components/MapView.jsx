import { MapContainer, TileLayer, GeoJSON, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { delhiBoundary } from "../data/delhiBoundary";
import { mockWards } from "../data/mockWards";
import { getRiskColor } from "../utils/riskUtils";

const MapView = ({ wards, onWardClick, selectedWard }) => {
  // Delhi bounding box
  const delhiBounds = [
    [28.40, 76.80],
    [28.90, 77.50],
  ];

  // 🔑 Backend lookup (THIS WAS MISSING BEFORE)
  const riskByWardId = Object.fromEntries(
    (wards || []).map((w) => [w.ward_id, w])
  );

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        bounds={delhiBounds}
        maxBounds={delhiBounds}
        maxBoundsViscosity={1.0}
        minZoom={10}
        maxZoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl
      >
        {/* BASE MAP */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap & CARTO'
        />

        {/* DELHI OUTLINE */}
        <GeoJSON
          data={delhiBoundary}
          style={{
            fillOpacity: 0,
            color: "#38bdf8",
            weight: 2,
            dashArray: "6,4",
            opacity: 0.8,
          }}
          interactive={false}
        />

        {/* 🔥 WARD MARKERS (BACKEND-DRIVEN) */}
        {mockWards.features.map((feature) => {
          const backendWard = riskByWardId[feature.properties.id];
          const riskLevel = backendWard?.risk?.level ?? "Low";

          return (
            <CircleMarker
              key={feature.properties.id}
              center={[
                feature.geometry.coordinates[0][0][1], // lat
                feature.geometry.coordinates[0][0][0], // lng
              ]}
              radius={14} // 👈 bigger, visible
              pathOptions={{
                fillColor: getRiskColor(riskLevel),
                color: "#ffffff",
                weight:
                  selectedWard?.properties?.id === feature.properties.id
                    ? 3
                    : 1,
                fillOpacity: 0.85,
              }}
              eventHandlers={{
                click: () => onWardClick(feature),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
