"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { get } from "@/lib/api";
import {
  Search,
  Loader2,
  BusFront,
  AlertCircle,
  Map as MapIcon,
  X,
  Navigation,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Interfaces
interface LineaBase {
  id_linea: number;
  desc_linea: string;
  desc_trayecto_corta: string;
  color: string;
  tipo_viaje: string;
  desc_trayecto: string;
}

interface ShapeData {
  id_arco: number;
  secuencia: number;
  origen: string;
  destino: string;
  latitud: number;
  longitud: number;
  metros_mapa: number;
}

interface ParadaData {
  id_parada: number;
  desc_parada: string;
  desc_parada_corta: string;
  latitud: number;
  longitud: number;
}

interface ApiResponse {
  linea: LineaBase;
  arcos: any[]; // Mantener para info, pero no usar para trazar
  paradas: ParadaData[];
  shapes: ShapeData[]; // NUEVO: Geometría de la ruta
}

const MapaTiempoReal = dynamic(
  () => import("@/components/mapa/mapa-tiempo-real"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted/50 animate-pulse flex items-center justify-center text-muted-foreground">
        Inicializando motor de mapas...
      </div>
    ),
  },
);

export default function MapaPage() {
  const [searchResults, setSearchResults] = useState<LineaBase[]>([]);
  const [mapData, setMapData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await get<LineaBase[]>(`/lineas/search?q=${query}`);
      setSearchResults(results);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    } finally {
      setSearching(false);
    }
  };

  const selectRoute = useCallback(async (linea: LineaBase) => {
    setLoading(true);
    setSearchResults([]);
    setSearchTerm(linea.desc_trayecto);
    try {
      const data = await get<ApiResponse>(
        `/lineas/${linea.id_linea}/detalle-completo`,
      );
      setMapData(data);
      console.log("📊 Datos recibidos:");
      console.log("  - Shapes:", data.shapes?.length || 0);
      console.log("  - Paradas:", data.paradas?.length || 0);
      console.log("  - Arcos:", data.arcos?.length || 0);
    } catch (error) {
      console.error("Error al cargar detalle:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ USAR SHAPES EN LUGAR DE ARCOS
  const coords: [number, number][] = mapData?.shapes
    ? mapData.shapes
        .sort((a, b) => a.secuencia - b.secuencia) // Ordenar por secuencia
        .map((s): [number, number] => [s.latitud, s.longitud])
        .filter((c) => !isNaN(c[0]) && !isNaN(c[1]))
    : [];

  console.log(`🗺️ Coordenadas para trazar: ${coords.length} puntos`);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* PANEL LATERAL */}
      <aside className="w-80 border-r bg-card flex flex-col z-20 shadow-sm">
        <div className="p-4 border-b space-y-4 bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-aty-cadmium rounded-lg">
              <BusFront className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-none">Visor de Rutas</h2>
              <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">
                Sistema GTFS Mérida
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar línea o trayecto..."
              className="pl-9 bg-background shadow-none border-muted-foreground/20"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-aty-cadmium" />
            )}
          </div>
        </div>

        {/* LISTA DE RESULTADOS */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-2">
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((linea) => (
                  <button
                    key={linea.id_linea}
                    onClick={() => selectRoute(linea)}
                    className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors border border-transparent hover:border-border group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1.5 h-8 rounded-full shrink-0"
                        style={{
                          backgroundColor: `#${linea.color.substring(2)}`,
                        }}
                      />
                      <div className="overflow-hidden flex-1">
                        <p className="font-semibold text-sm truncate group-hover:text-aty-cadmium transition-colors">
                          {linea.desc_trayecto}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">
                          {linea.desc_trayecto_corta}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchTerm.length > 2 && !searching ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground italic">
                  No se encontraron rutas con esa descripción
                </p>
              </div>
            ) : !mapData ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-60">
                <div className="p-4 bg-muted rounded-full">
                  <MapIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Utiliza el buscador para visualizar
                  <br />
                  la trayectoria de la red **Va y Ven**
                </p>
              </div>
            ) : null}
          </div>

          {/* INFO CARD RUTA SELECCIONADA */}
          {mapData && (
            <div className="p-4 border-t bg-muted/20">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge
                      variant="outline"
                      className="text-[9px] font-bold uppercase tracking-tighter border-aty-cadmium/30 text-aty-cadmium bg-aty-cadmium/5"
                    >
                      {mapData.linea.tipo_viaje}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setMapData(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-snug">
                      {mapData.linea.desc_trayecto}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1 italic">
                      {mapData.linea.desc_linea}
                    </p>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" /> {coords.length} Puntos
                    </span>
                    <span className="flex items-center gap-1">
                      <MapIcon className="h-3 w-3" /> {mapData.paradas.length}{" "}
                      Paradas
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </aside>

      {/* ÁREA DEL MAPA */}
      <main className="flex-1 relative bg-slate-50">
        {loading && (
          <div className="absolute inset-0 z-30 bg-background/20 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-card px-4 py-3 rounded-full shadow-lg border flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <Loader2 className="h-4 w-4 animate-spin text-aty-cadmium" />
              <span className="font-bold text-xs tracking-tight">
                Sincronizando coordenadas...
              </span>
            </div>
          </div>
        )}

        <MapaTiempoReal
          routeCoords={coords}
          stops={mapData?.paradas || []}
          routeColor={mapData?.linea?.color || "#03603a"}
        />
      </main>
    </div>
  );
}
