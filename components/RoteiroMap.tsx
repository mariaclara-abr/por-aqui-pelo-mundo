"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#C1653A;border:2px solid #FFFFFF;box-shadow:0 1px 4px rgba(43,38,32,0.4)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.fitBounds(points, { padding: [32, 32] });
    }
  }, [map, points]);

  return null;
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5 fill-none stroke-current"
      strokeWidth={1.6}
    >
      <path
        d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5 fill-none stroke-current"
      strokeWidth={1.6}
    >
      <path
        d="M2.5 2.5l15 15M8.3 4.3C8.85 4.1 9.42 4 10 4c5.5 0 8.5 6 8.5 6a15 15 0 0 1-2.6 3.4M11.9 12.1a2.25 2.25 0 0 1-3.1-3.1M5.6 5.9C3.2 7.4 1.5 10 1.5 10s3 6 8.5 6c1 0 1.9-.2 2.7-.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RoteiroMap({
  points,
}: {
  points: { id: string; name: string; order: number; lat: number; lng: number }[];
}) {
  const [showRoute, setShowRoute] = useState(true);

  if (points.length === 0) return null;

  const orderedPoints = [...points].sort((a, b) => a.order - b.order);
  const coords: [number, number][] = orderedPoints.map((p) => [p.lat, p.lng]);

  return (
    <div className="relative">
      <MapContainer
        center={coords[0]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-80 w-full rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showRoute && coords.length > 1 && (
          <Polyline
            positions={coords}
            pathOptions={{
              color: "#C1653A",
              weight: 3,
              opacity: 0.75,
              dashArray: "7 7",
            }}
          />
        )}
        {orderedPoints.map((point) => (
          <Marker key={point.id} position={[point.lat, point.lng]} icon={markerIcon}>
            <Popup>
              {point.order + 1}. {point.name}
            </Popup>
          </Marker>
        ))}
        <FitBounds points={coords} />
      </MapContainer>

      {coords.length > 1 && (
        <button
          type="button"
          onClick={() => setShowRoute((prev) => !prev)}
          className={`absolute right-3 top-3 z-[1001] flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-colors ${
            showRoute
              ? "border-terracota bg-terracota text-white"
              : "border-oliva/30 bg-branco text-oliva hover:border-terracota hover:text-terracota"
          }`}
        >
          {showRoute ? <EyeIcon /> : <EyeOffIcon />}
          {showRoute ? "Ocultar caminho" : "Mostrar caminho"}
        </button>
      )}
    </div>
  );
}
