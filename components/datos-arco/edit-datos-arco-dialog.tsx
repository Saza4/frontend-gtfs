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
import { datosArcoService } from "@/services/datos-arco.service";
import { ApiError } from "@/lib/api";
import type { DatosArco, DatosArcoUpdate } from "@/types/index-datos-arco";

interface EditDatosArcoDialogProps {
  dato: DatosArco | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDatoUpdated: () => void;
}

export function EditDatosArcoDialog({
  dato,
  open,
  onOpenChange,
  onDatoUpdated,
}: EditDatosArcoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DatosArcoUpdate>({});

  useEffect(() => {
    if (dato) {
      setFormData({
        id_arco: dato.id_arco,
        desc_arco: dato.desc_arco,
        origen: dato.origen,
        destino: dato.destino,
        fecha_validez: dato.fecha_validez,
        metros_teoricos: dato.metros_teoricos,
        metros_mapa: dato.metros_mapa,
      });
    }
  }, [dato]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dato) return;
    setLoading(true);
    try {
      await datosArcoService.update(dato.id_datos_arco, formData);
      toast.success("Dato de arco actualizado exitosamente");
      onOpenChange(false);
      onDatoUpdated();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Error al actualizar";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!dato) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar arco {dato.id_arco}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_desc" className="text-right">
                Descripción *
              </Label>
              <Input
                id="edit_desc"
                value={formData.desc_arco || ""}
                onChange={(e) =>
                  setFormData({ ...formData, desc_arco: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_teorico" className="text-right">
                M. Teóricos *
              </Label>
              <Input
                id="edit_teorico"
                type="number"
                step="0.01"
                value={formData.metros_teoricos || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metros_teoricos: parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_mapa" className="text-right">
                M. Mapa *
              </Label>
              <Input
                id="edit_mapa"
                type="number"
                step="0.01"
                value={formData.metros_mapa || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metros_mapa: parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
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
