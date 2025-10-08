"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix default marker icons in Leaflet with webpack/Next
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon as any;

export default function LiveMap({ position, markers = [] }: { position: { latitude: number; longitude: number } | null, markers?: Array<{ latitude: number; longitude: number; label?: string }> }) {
  useEffect(() => {}, [position]);
  if (!position) return null;
  const center: [number, number] = [position.latitude, position.longitude];
  return (
    <div style={{ height: 320, width: '100%', borderRadius: 12, overflow: 'hidden' }}>
      <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>Your current location</Popup>
        </Marker>
        {markers.map((m, i) => (
          <Marker key={i} position={[m.latitude, m.longitude] as [number, number]}>
            <Popup>{m.label || `Location ${i+1}`}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


