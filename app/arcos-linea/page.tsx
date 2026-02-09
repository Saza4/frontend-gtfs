"use client";

import { useState, useEffect } from "react";
import { ArcosLineaTable } from "@/components/arcos-linea/arcos-linea-table";
import { arcosLineaService } from "@/services/arcos-linea.service";

export default function ArcosLineaPage() {
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await arcosLineaService.getStats();
        setTotalCount(stats.total);
      } catch (error) {
        console.error("Error al cargar stats:", error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Arcos de Línea</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona los segmentos de trayecto.{" "}
          {totalCount !== null && (
            <span className="text-sm font-medium text-slate-700">
              Registros totales: {totalCount.toLocaleString("es-MX")}
            </span>
          )}
        </p>
      </div>
      <ArcosLineaTable />
    </div>
  );
}
