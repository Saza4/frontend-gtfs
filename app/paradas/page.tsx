import { ParadasTable } from "@/components/paradas/paradas-table";

export default function ParadasPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Paradas</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona las paradas del sistema de transporte público ATY Mérida.{" "}
          <span className="text-sm">Total de paradas en el sistema: 3,389</span>
        </p>
      </div>

      {/* Tabla */}
      <ParadasTable />
    </div>
  );
}
