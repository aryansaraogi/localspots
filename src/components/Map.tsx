import React, { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import type { Location } from '../types/location';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  locations: Location[];
  center: [number, number];
  zoom: number;
  onMapClick: (latlng: [number, number]) => void;
  onViewChange: (center: [number, number], zoom: number) => void;
}

function MapEvents({ 
  onMapClick,
  onViewChange,
}: { 
  onMapClick: (latlng: [number, number]) => void;
  onViewChange: (center: [number, number], zoom: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
    moveend() {
      const center = map.getCenter();
      onViewChange([center.lat, center.lng], map.getZoom());
    },
    zoomend() {
      const center = map.getCenter();
      onViewChange([center.lat, center.lng], map.getZoom());
    },
  });
  return null;
}

function MapCenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const initializedRef = useRef(false);
  const prevCenter = useRef(center);
  const prevZoom = useRef(zoom);

  useEffect(() => {
    // Only update if the center or zoom has actually changed
    if (
      !initializedRef.current ||
      prevCenter.current[0] !== center[0] ||
      prevCenter.current[1] !== center[1] ||
      prevZoom.current !== zoom
    ) {
      map.setView(center, zoom, { animate: true });
      prevCenter.current = center;
      prevZoom.current = zoom;
      initializedRef.current = true;
    }
  }, [center, zoom, map]);

  return null;
}

export function Map({ locations, center, zoom, onMapClick, onViewChange }: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      style={{ height: '100vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMapClick={onMapClick} onViewChange={onViewChange} />
      <MapCenter center={center} zoom={zoom} />
      {locations.map((location) => (
        <Marker key={location.id} position={location.position}>
          <Popup>
            <div>
              <h3 className="font-semibold">{location.name}</h3>
              <p className="text-sm">{location.notes}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}