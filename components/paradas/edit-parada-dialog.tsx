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
import { paradasService } from "@/services/paradas.service";
import { ApiError } from "@/lib/api";
import type { Parada, ParadaUpdate } from "@/types/index-paradas";

interface EditParadaDialogProps {
  parada: Parada | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParadaUpdated: () => void;
}

export function EditParadaDialog({
  parada,
  open,
  onOpenChange,
  onParadaUpdated,
}: EditParadaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ParadaUpdate>({});

  // Cargar datos de la parada cuando se abre el modal
  useEffect(() => {
    if (parada) {
      setFormData({
        id_parada: parada.id_parada,
        desc_parada: parada.desc_parada,
        desc_parada_corta: parada.desc_parada_corta,
        fecha_validez: parada.fecha_validez,
        latitud: parada.latitud,
        longitud: parada.longitud,
      });
    }
  }, [parada]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parada) return;

    setLoading(true);

    try {
      await paradasService.update(parada.id_parada, formData);
      toast.success("Parada actualizada exitosamente");
      onOpenChange(false);
      onParadaUpdated(); // Recargar tabla
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar parada");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!parada) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar parada P-{parada.id_parada}</DialogTitle>
            <DialogDescription>
              Modifica los datos de la parada. Los cambios se guardarán al hacer
              clic en `Guardar cambios`.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* ID Parada (solo lectura) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id_parada" className="text-right">
                ID Parada
              </Label>
              <Input
                id="id_parada"
                type="number"
                value={formData.id_parada || ""}
                className="col-span-3"
                disabled
              />
            </div>

            {/* Descripción */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_parada" className="text-right">
                Descripción *
              </Label>
              <Input
                id="desc_parada"
                value={formData.desc_parada || ""}
                onChange={(e) =>
                  setFormData({ ...formData, desc_parada: e.target.value })
                }
                className="col-span-3"
                maxLength={500}
                required
              />
            </div>

            {/* Descripción Corta */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_parada_corta" className="text-right">
                Desc. Corta *
              </Label>
              <Input
                id="desc_parada_corta"
                value={formData.desc_parada_corta || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    desc_parada_corta: e.target.value,
                  })
                }
                className="col-span-3"
                maxLength={200}
                required
              />
            </div>

            {/* Fecha de Validez */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha_validez" className="text-right">
                Fecha Validez *
              </Label>
              <Input
                id="fecha_validez"
                type="date"
                value={formData.fecha_validez || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_validez: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>

            {/* Latitud y Longitud */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latitud" className="text-right">
                Latitud *
              </Label>
              <Input
                id="latitud"
                type="number"
                step="0.0000001"
                value={formData.latitud || ""}
                onChange={(e) =>
                  setFormData({ ...formData, latitud: Number(e.target.value) })
                }
                className="col-span-3"
                placeholder="Ej: 20.9619947"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longitud" className="text-right">
                Longitud *
              </Label>
              <Input
                id="longitud"
                type="number"
                step="0.0000001"
                value={formData.longitud || ""}
                onChange={(e) =>
                  setFormData({ ...formData, longitud: Number(e.target.value) })
                }
                className="col-span-3"
                placeholder="Ej: -89.6228658"
                required
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
