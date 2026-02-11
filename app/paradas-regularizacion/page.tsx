"use client";

import { useState, useEffect } from "react";
import { ParadasRegularizacionTable } from "@/components/paradas-regularizacion/paradas-regularizacion-table";
import { paradasRegularizacionService } from "@/services/paradas-regularizacion.service";

export default function ParadasRegularizacionPage() {
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await paradasRegularizacionService.getStats();
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Paradas de Regularización
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Control de puntos de control, relevos y paradas operativas.{" "}
          {totalCount !== null && (
            <span className="text-sm font-bold text-foreground bg-muted px-2 py-1 rounded-md ml-2">
              Total: {totalCount.toLocaleString("es-MX")}
            </span>
          )}
        </p>
      </div>
      <ParadasRegularizacionTable />
    </div>
  );
}
