"use client";

import { useState, useEffect } from "react";
import { LineasTable } from "@/components/lineas/lineas-table";
import { lineasService } from "@/services/lineas.service";

export default function LineasPage() {
  const [totalLineas, setTotalLineas] = useState<number | null>(null);

  useEffect(() => {
    // Cargar total de líneas
    const loadTotal = async () => {
      try {
        const data = await lineasService.getAll();
        setTotalLineas(data.length);
      } catch (error) {
        console.error("Error al cargar total de líneas:", error);
      }
    };

    loadTotal();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Líneas</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona las líneas de transporte público ATY Mérida.{" "}
          {totalLineas !== null && (
            <span className="text-sm">
              Total de líneas en el sistema:{" "}
              {totalLineas.toLocaleString("es-MX")}
            </span>
          )}
        </p>
      </div>

      {/* Tabla */}
      <LineasTable />
    </div>
  );
}
