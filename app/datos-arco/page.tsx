"use client";

import { useState, useEffect } from "react";
import { DatosArcoTable } from "@/components/datos-arco/datos-arco-table";
import { datosArcoService } from "@/services/datos-arco.service";
import { MapPin } from "lucide-react";

export default function DatosArcoPage() {
  const [totalArcos, setTotalArcos] = useState<number | null>(null);

  useEffect(() => {
    const loadTotal = async () => {
      try {
        const stats = await datosArcoService.getStats();
        setTotalArcos(stats.total);
      } catch (error) {
        console.error("Error al cargar total de arcos:", error);
      }
    };
    loadTotal();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Datos de Arco
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestione los segmentos y distancias entre paradas de Mérida.{" "}
          {totalArcos !== null && (
            <span className="text-sm font-medium">
              Total de registros: {totalArcos.toLocaleString("es-MX")}
            </span>
          )}
        </p>
      </div>
      <DatosArcoTable />
    </div>
  );
}
