"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, CheckCircle2, Package } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface ExportGtfsButtonProps {
  variant?: "default" | "outline" | "hero";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ExportGtfsButton({
  variant = "default",
  size = "default",
  className = "",
}: ExportGtfsButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    // Toast de inicio
    const loadingToast = toast.loading("Generando archivo GTFS...");

    try {
      const response = await api.get("/gtfs-export/generate", {
        responseType: "blob",
        timeout: 300000, // 5 minutos = 300,000 ms (necesario porque genera archivos grandes)
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "google_transit.zip"; // Nombre permanente (sin fecha)
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Toast de éxito
      toast.success("GTFS exportado exitosamente", {
        id: loadingToast,
        description: "El archivo google_transit.zip se ha descargado",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      console.error("Error al exportar GTFS:", error);

      // Toast de error
      toast.error("Error al exportar GTFS", {
        id: loadingToast,
        description: "Verifica que haya datos en la base de datos",
      });
    } finally {
      setLoading(false);
    }
  };

  // Variante para el hero section
  if (variant === "hero") {
    return (
      <Button
        onClick={handleExport}
        disabled={loading}
        size={size}
        className={`bg-white text-[#59af31] hover:bg-white/90 gap-2 ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Exportar GTFS
          </>
        )}
      </Button>
    );
  }

  // Variante outline
  if (variant === "outline") {
    return (
      <Button
        onClick={handleExport}
        disabled={loading}
        variant="outline"
        size={size}
        className={`gap-2 ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Exportar GTFS
          </>
        )}
      </Button>
    );
  }

  // Variante default
  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      size={size}
      className={`gap-2 bg-[#59af31] hover:bg-[#4a9428] ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generando GTFS...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Exportar GTFS
        </>
      )}
    </Button>
  );
}

/**
 * Card de exportación para usar en el dashboard
 */
export function ExportGtfsCard() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#59af31]/10 flex items-center justify-center flex-shrink-0">
          <Package className="h-6 w-6 text-[#59af31]" />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-lg mb-1">Exportar Feed GTFS</h3>
            <p className="text-sm text-muted-foreground">
              Genera un archivo ZIP compatible con Google Maps y otras
              aplicaciones de tránsito
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded">8 archivos</span>
            <span className="px-2 py-1 bg-muted rounded">Formato estándar</span>
            <span className="px-2 py-1 bg-muted rounded">
              google_transit.zip
            </span>
          </div>

          <ExportGtfsButton variant="default" />
        </div>
      </div>
    </div>
  );
}
