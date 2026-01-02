import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { mockWards, getRiskColor } from '../data/mockWards';
import 'leaflet/dist/leaflet.css';
import { delhiBoundary } from '../data/delhiBoundary';

const MapView = ({ onWardClick, selectedWard }) => {
 // Approximate Delhi bounding box
    const delhiBounds = [
    [28.40, 76.80], // South-West
    [28.90, 77.50], // North-East
    ];

  // Style function for GeoJSON features
  const getFeatureStyle = (feature) => {
    const isSelected = selectedWard?.properties.id === feature.properties.id;
    return {
      fillColor: getRiskColor(feature.properties.riskLevel),
      fillOpacity: isSelected ? 0.8 : 0.6,
      color: isSelected ? '#ffffff' : '#555555',
      weight: isSelected ? 3 : 1
    };
  };

  // Event handlers for each feature
  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        onWardClick(feature);
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.8,
          weight: 3,
          color: '#ffffff'
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(getFeatureStyle(feature));
      }
    });

    // Bind popup
    layer.bindPopup(`
      <div style="font-family: sans-serif;">
        <strong style="font-size: 14px;">${feature.properties.name}</strong><br/>
        <span style="color: ${getRiskColor(feature.properties.riskLevel)};">
          ${feature.properties.riskLevel.toUpperCase()} RISK
        </span><br/>
        Water Level: ${feature.properties.waterLevel}%
      </div>
    `);
  };

  return (
    <div className="absolute inset-0 z-0">
     <MapContainer
            bounds={delhiBounds}
            maxBounds={delhiBounds}
            maxBoundsViscosity={1.0}
            minZoom={10}
            maxZoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl
            >

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <GeoJSON
  data={delhiBoundary}
  style={{
    fillOpacity: 0,
    color: '#38bdf8',   // cyan-400
    weight: 2,
    opacity: 0.8,
    dashArray: '6,4'
  }}
  interactive={false}
/>

        <GeoJSON
          data={mockWards}
          style={getFeatureStyle}
          onEachFeature={onEachFeature}
          key={selectedWard?.properties.id || 'default'}
        />
      </MapContainer>
    </div>
  );
};

export default MapView;