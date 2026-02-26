"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSyncExternalStore } from "react";

interface ParadaData {
  id_parada: number;
  desc_parada: string;
  desc_parada_corta: string;
  latitud: number;
  longitud: number;
}

interface MapaTiempoRealProps {
  routeCoords: [number, number][]; // Ya recibe las coordenadas de shapes
  stops: ParadaData[];
  routeColor: string;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const formatHexColor = (atyColor: string) => {
  if (!atyColor) return "#03603a";
  const cleanColor = atyColor.length === 8 ? atyColor.substring(2) : atyColor;
  return `#${cleanColor.replace("#", "")}`;
};

const createStopIcon = (color: string) => {
  return L.divIcon({
    className: "custom-stop",
    html: `<div style="background-color: white; border: 3px solid ${color}; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

export default function MapaTiempoReal({
  routeCoords,
  stops,
  routeColor,
}: MapaTiempoRealProps) {
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const hexColor = formatHexColor(routeColor);

  if (!isClient) {
    return <div className="h-full w-full bg-slate-100 animate-pulse" />;
  }

  // Calcular centro del mapa basado en las coordenadas de la ruta
  const center: [number, number] =
    routeCoords.length > 0
      ? routeCoords[Math.floor(routeCoords.length / 2)] // Punto medio de la ruta
      : [20.9678, -89.6237]; // Centro por defecto (Mérida)

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* POLYLINE DE LA RUTA - Renderiza shapes (500-1000 puntos) */}
      {routeCoords.length > 0 && (
        <Polyline
          positions={routeCoords}
          pathOptions={{
            color: hexColor,
            weight: 6, // Grosor de línea
            opacity: 0.8,
            lineJoin: "round", // Esquinas suaves
            lineCap: "round", // Extremos redondeados
          }}
        />
      )}

      {/* MARCADORES DE PARADAS */}
      {stops.map((stop, index) => (
        <Marker
          key={`stop-${stop.id_parada}-${index}-${Number(stop.latitud).toFixed(4)}`}
          position={[Number(stop.latitud), Number(stop.longitud)]}
          icon={createStopIcon(hexColor)}
        >
          <Popup>
            <div className="text-sm font-sans p-1">
              <p className="font-bold text-[#273147]">
                {stop.desc_parada_corta}
              </p>
              <p className="text-xs text-gray-500">{stop.desc_parada}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
