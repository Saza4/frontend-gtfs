"use client";

import { useState, useEffect } from "react";
import { ParadasTable } from "@/components/paradas/paradas-table";
import { paradasService } from "@/services/paradas.service";

export default function ParadasPage() {
  const [totalParadas, setTotalParadas] = useState<number | null>(null);

  useEffect(() => {
    // Cargar total de paradas
    const loadTotal = async () => {
      try {
        const data = await paradasService.getAll();
        setTotalParadas(data.length);
      } catch (error) {
        console.error("Error al cargar total de paradas:", error);
      }
    };

    loadTotal();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Paradas</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona las paradas del sistema de transporte público ATY Mérida.{" "}
          {totalParadas !== null && (
            <span className="text-sm">
              Total de paradas en el sistema:{" "}
              {totalParadas.toLocaleString("es-MX")}
            </span>
          )}
        </p>
      </div>

      {/* Tabla */}
      <ParadasTable />
    </div>
  );
}
