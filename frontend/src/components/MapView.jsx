import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { delhiBoundary } from "../data/delhiBoundary";
import { mockWards } from "../data/mockWards";

// 🔴🟡🟢 Marker icons (Vite-safe imports)
import redPin from "../assets/markers/marker-red.png";
import yellowPin from "../assets/markers/marker-yellow.png";
import greenPin from "../assets/markers/marker-green.png";
const pinIcons = {
  red: redPin,
  yellow: yellowPin,
  green: greenPin,
};


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
  const createPinIcon = (color, isSelected = false) =>
    new L.Icon({
      iconUrl: pinIcons[color],
      iconRetinaUrl: pinIcons[color],
      shadowUrl: null, // disable Leaflet default shadow
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
          const isSelected =
                selectedWard?.geo?.properties?.id === feature.properties.id;
          return (
            <Marker
              key={feature.properties.id}
              position={[
                feature.geometry.coordinates[0][0][1], // lat
                feature.geometry.coordinates[0][0][0], // lng
              ]}
              icon={createPinIcon(getPinColor(riskLevel), isSelected)}
              eventHandlers={{
                click: () => {
                  const backendWard = riskByWardId[feature.properties.id];
                  onWardClick({
                    geo: feature,
                    data: backendWard
                  });
                }
              }}
            >
              <Popup>
                <strong>Ward:</strong> {feature.properties.id}<br />
                <strong>Risk:</strong> {riskLevel}
              </Popup>
            </Marker>

          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
