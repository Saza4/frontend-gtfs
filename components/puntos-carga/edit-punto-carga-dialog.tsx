"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { puntosCargaService } from "@/services/puntos-carga.service";
import { ApiError } from "@/lib/api";
import type { PuntoCarga, PuntoCargaUpdate } from "@/types/index-puntos-carga";

interface EditPuntoCargaDialogProps {
  punto: PuntoCarga | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPuntoUpdated: () => void;
}

export function EditPuntoCargaDialog({
  punto,
  open,
  onOpenChange,
  onPuntoUpdated,
}: EditPuntoCargaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PuntoCargaUpdate>({});

  // Cargar datos del punto cuando se abre el modal
  useEffect(() => {
    if (punto) {
      setFormData({
        id_punto_recarga: punto.id_punto_recarga,
        desc_sitio: punto.desc_sitio,
        desc_sitio_corta: punto.desc_sitio_corta,
        desc_bus: punto.desc_bus,
        desc_bus_corta: punto.desc_bus_corta,
        fecha_desde: punto.fecha_desde,
        fecha_hasta: punto.fecha_hasta,
        costo_real: punto.costo_real,
        funcion_objetivo: punto.funcion_objetivo,
        costo_real_kwh: punto.costo_real_kwh,
        funcion_objetivo_kwh: punto.funcion_objetivo_kwh,
        carga_max_porc: punto.carga_max_porc,
      });
    }
  }, [punto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!punto) return;

    setLoading(true);

    try {
      await puntosCargaService.update(punto.id_registro, formData);
      toast.success("Punto de carga actualizado exitosamente");
      onOpenChange(false);
      onPuntoUpdated();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar punto de carga");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!punto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Editar punto de carga #{punto.id_registro}
            </DialogTitle>
            <DialogDescription>
              Modifica los datos del punto de carga. Los cambios se guardarán al
              hacer clic en `Guardar cambios`.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* ID Punto de Recarga */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id_punto_recarga" className="text-right">
                ID Punto *
              </Label>
              <Input
                id="id_punto_recarga"
                type="number"
                value={formData.id_punto_recarga || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_punto_recarga: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                required
              />
            </div>

            {/* Descripción del Sitio */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_sitio" className="text-right">
                Descripción Sitio *
              </Label>
              <Input
                id="desc_sitio"
                value={formData.desc_sitio || ""}
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
                value={formData.desc_sitio_corta || ""}
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
                value={formData.desc_bus || ""}
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
                value={formData.desc_bus_corta || ""}
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
                  value={formData.fecha_desde || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_desde: e.target.value })
                  }
                  className="flex-1"
                  required
                />
                <span className="text-muted-foreground">→</span>
                <Input
                  type="time"
                  value={formData.fecha_hasta || ""}
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
                value={formData.carga_max_porc || 0}
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

            {/* Costos */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costo_real" className="text-right">
                Costo Real
              </Label>
              <Input
                id="costo_real"
                type="number"
                min="0"
                step="0.000001"
                value={formData.costo_real || 0}
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
                value={formData.funcion_objetivo || 0}
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
                value={formData.costo_real_kwh || 0}
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
                value={formData.funcion_objetivo_kwh || 0}
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
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
