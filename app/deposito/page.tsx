"use client";

import { useState, useEffect } from "react";
import { DepositoTable } from "@/components/deposito/deposito-table";
import { depositoService } from "@/services/deposito.service";

export default function DepositoPage() {
  const [totalDepositos, setTotalDepositos] = useState<number | null>(null);

  useEffect(() => {
    // Cargar total de depósitos
    const loadTotal = async () => {
      try {
        const data = await depositoService.getAll();
        setTotalDepositos(data.length);
      } catch (error) {
        console.error("Error al cargar total de depósitos:", error);
      }
    };

    loadTotal();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Depósitos</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona los depósitos y terminales del sistema de transporte ATY
          Mérida.{" "}
          {totalDepositos !== null && (
            <span className="text-sm">
              Total de depósitos en el sistema:{" "}
              {totalDepositos.toLocaleString("es-MX")}
            </span>
          )}
        </p>
      </div>

      {/* Tabla */}
      <DepositoTable />
    </div>
  );
}
