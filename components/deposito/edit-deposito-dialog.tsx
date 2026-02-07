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
import { depositoService } from "@/services/deposito.service";
import { ApiError } from "@/lib/api";
import type { Deposito, DepositoUpdate } from "@/types/index-deposito";

interface EditDepositoDialogProps {
  deposito: Deposito | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDepositoUpdated: () => void;
}

export function EditDepositoDialog({
  deposito,
  open,
  onOpenChange,
  onDepositoUpdated,
}: EditDepositoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DepositoUpdate>({});

  // Cargar datos del depósito cuando se abre el modal
  useEffect(() => {
    if (deposito) {
      setFormData({
        desc_parada: deposito.desc_parada,
        desc_parada_corta: deposito.desc_parada_corta,
        fecha_validez: deposito.fecha_validez,
        servicios_llegan: deposito.servicios_llegan,
        servicios_salen: deposito.servicios_salen,
        costo_relevo_obj: deposito.costo_relevo_obj,
        costo_relevo_real: deposito.costo_relevo_real,
      });
    }
  }, [deposito]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deposito) return;

    setLoading(true);

    try {
      await depositoService.update(deposito.id_deposito, formData);
      toast.success("Depósito actualizado exitosamente");
      onOpenChange(false);
      onDepositoUpdated();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar depósito");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!deposito) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Editar depósito {deposito.desc_parada_corta}
            </DialogTitle>
            <DialogDescription>
              Modifica los datos del depósito. Los cambios se guardarán al hacer
              clic en `Guardar cambios`.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Descripción de la parada */}
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

            {/* Descripción corta (solo lectura) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_parada_corta" className="text-right">
                Desc. Corta
              </Label>
              <Input
                id="desc_parada_corta"
                value={formData.desc_parada_corta || ""}
                className="col-span-3"
                disabled
              />
            </div>

            {/* Fecha de validez */}
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

            {/* Servicios que llegan */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="servicios_llegan" className="text-right">
                Servicios Llegan *
              </Label>
              <Input
                id="servicios_llegan"
                type="number"
                min="0"
                value={formData.servicios_llegan || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    servicios_llegan: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                required
              />
            </div>

            {/* Servicios que salen */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="servicios_salen" className="text-right">
                Servicios Salen *
              </Label>
              <Input
                id="servicios_salen"
                type="number"
                min="0"
                value={formData.servicios_salen || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    servicios_salen: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                required
              />
            </div>

            {/* Costo relevo objetivo */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costo_relevo_obj" className="text-right">
                Costo Relevo Obj *
              </Label>
              <Input
                id="costo_relevo_obj"
                type="number"
                min="0"
                step="0.01"
                value={formData.costo_relevo_obj || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    costo_relevo_obj: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                required
              />
            </div>

            {/* Costo relevo real */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costo_relevo_real" className="text-right">
                Costo Relevo Real *
              </Label>
              <Input
                id="costo_relevo_real"
                type="number"
                min="0"
                step="0.01"
                value={formData.costo_relevo_real || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    costo_relevo_real: parseFloat(e.target.value) || 0,
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
