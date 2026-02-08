"use client";

import { useState, useEffect } from "react";
import { PuntosCargaTable } from "@/components/puntos-carga/puntos-carga-table";
import { puntosCargaService } from "@/services/puntos-carga.service";

export default function PuntosCargaPage() {
  const [totalPuntos, setTotalPuntos] = useState<number | null>(null);

  useEffect(() => {
    // Cargar total de puntos de carga
    const loadTotal = async () => {
      try {
        const data = await puntosCargaService.getAll();
        setTotalPuntos(data.length);
      } catch (error) {
        console.error("Error al cargar total de puntos de carga:", error);
      }
    };

    loadTotal();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Puntos de Carga</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona los puntos de recarga para autobuses eléctricos del sistema
          ATY Mérida.{" "}
          {totalPuntos !== null && (
            <span className="text-sm">
              Total de puntos de carga en el sistema:{" "}
              {totalPuntos.toLocaleString("es-MX")}
            </span>
          )}
        </p>
      </div>

      {/* Tabla */}
      <PuntosCargaTable />
    </div>
  );
}
