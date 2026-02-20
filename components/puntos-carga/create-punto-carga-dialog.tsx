"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { puntosCargaService } from "@/services/puntos-carga.service";
import { ApiError } from "@/lib/api";
import type { PuntoCargaCreate } from "@/types/index-puntos-carga";

interface CreatePuntoCargaDialogProps {
  onPuntoCreated: () => void;
}

export function CreatePuntoCargaDialog({
  onPuntoCreated,
}: CreatePuntoCargaDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PuntoCargaCreate>({
    id_punto_recarga: 0,
    desc_sitio: "",
    desc_sitio_corta: "",
    desc_bus: "",
    desc_bus_corta: "",
    fecha_desde: "00:00",
    fecha_hasta: "23:59",
    costo_real: 0,
    funcion_objetivo: 0,
    costo_real_kwh: 0,
    funcion_objetivo_kwh: 0,
    carga_max_porc: 100,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await puntosCargaService.create(formData);
      toast.success("Punto de carga creado exitosamente");
      setOpen(false);
      onPuntoCreated();

      // Reset form
      setFormData({
        id_punto_recarga: 0,
        desc_sitio: "",
        desc_sitio_corta: "",
        desc_bus: "",
        desc_bus_corta: "",
        fecha_desde: "00:00",
        fecha_hasta: "23:59",
        costo_real: 0,
        funcion_objetivo: 0,
        costo_real_kwh: 0,
        funcion_objetivo_kwh: 0,
        carga_max_porc: 100,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al crear punto de carga");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo punto de carga
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nuevo punto de carga</DialogTitle>
            <DialogDescription>
              Completa los datos para crear un nuevo punto de recarga para
              autobuses eléctricos.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Descripción del Sitio */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_sitio" className="text-right">
                Descripción Sitio *
              </Label>
              <Input
                id="desc_sitio"
                value={formData.desc_sitio}
                onChange={(e) =>
                  setFormData({ ...formData, desc_sitio: e.target.value })
                }
                className="col-span-3"
                maxLength={255}
                required
              />
            </div>

            {/* Descripción Corta Sitio */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_sitio_corta" className="text-right">
                Sitio Corto *
              </Label>
              <Input
                id="desc_sitio_corta"
                value={formData.desc_sitio_corta}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    desc_sitio_corta: e.target.value,
                  })
                }
                className="col-span-3"
                maxLength={100}
                required
              />
            </div>

            {/* Descripción del Autobús */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_bus" className="text-right">
                Descripción Bus *
              </Label>
              <Input
                id="desc_bus"
                value={formData.desc_bus}
                onChange={(e) =>
                  setFormData({ ...formData, desc_bus: e.target.value })
                }
                className="col-span-3"
                maxLength={255}
                required
              />
            </div>

            {/* Descripción Corta Bus */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_bus_corta" className="text-right">
                Bus Corto *
              </Label>
              <Input
                id="desc_bus_corta"
                value={formData.desc_bus_corta}
                onChange={(e) =>
                  setFormData({ ...formData, desc_bus_corta: e.target.value })
                }
                className="col-span-3"
                maxLength={100}
                required
              />
            </div>

            {/* Horarios */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Horario *</Label>
              <div className="col-span-3 flex gap-2 items-center">
                <Input
                  type="time"
                  value={formData.fecha_desde}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_desde: e.target.value })
                  }
                  className="flex-1"
                  required
                />
                <span className="text-muted-foreground">→</span>
                <Input
                  type="time"
                  value={formData.fecha_hasta}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_hasta: e.target.value })
                  }
                  className="flex-1"
                  required
                />
              </div>
            </div>

            {/* Carga Máxima */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carga_max_porc" className="text-right">
                Carga Máxima (%) *
              </Label>
              <Input
                id="carga_max_porc"
                type="number"
                min="0"
                max="100"
                value={formData.carga_max_porc}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    carga_max_porc: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                required
              />
            </div>

            {/* Costos (opcionales, valores por defecto en 0) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costo_real" className="text-right">
                Costo Real
              </Label>
              <Input
                id="costo_real"
                type="number"
                min="0"
                step="0.000001"
                value={formData.costo_real}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    costo_real: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="funcion_objetivo" className="text-right">
                Función Objetivo
              </Label>
              <Input
                id="funcion_objetivo"
                type="number"
                min="0"
                step="0.000001"
                value={formData.funcion_objetivo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    funcion_objetivo: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costo_real_kwh" className="text-right">
                Costo Real (kWh)
              </Label>
              <Input
                id="costo_real_kwh"
                type="number"
                min="0"
                step="0.000001"
                value={formData.costo_real_kwh}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    costo_real_kwh: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="funcion_objetivo_kwh" className="text-right">
                Función Obj. (kWh)
              </Label>
              <Input
                id="funcion_objetivo_kwh"
                type="number"
                min="0"
                step="0.000001"
                value={formData.funcion_objetivo_kwh}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    funcion_objetivo_kwh: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear punto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
