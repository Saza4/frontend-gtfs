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
import { depositoService } from "@/services/deposito.service";
import { ApiError } from "@/lib/api";
import type { DepositoCreate } from "@/types/index-deposito";

interface CreateDepositoDialogProps {
  onDepositoCreated: () => void;
}

export function CreateDepositoDialog({
  onDepositoCreated,
}: CreateDepositoDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DepositoCreate>({
    desc_parada: "",
    desc_parada_corta: "",
    fecha_validez: new Date().toISOString().split("T")[0], // Fecha actual
    servicios_llegan: 0,
    servicios_salen: 0,
    costo_relevo_obj: 0,
    costo_relevo_real: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await depositoService.create(formData);
      toast.success("Depósito creado exitosamente");
      setOpen(false);
      onDepositoCreated();

      // Reset form
      setFormData({
        desc_parada: "",
        desc_parada_corta: "",
        fecha_validez: new Date().toISOString().split("T")[0],
        servicios_llegan: 0,
        servicios_salen: 0,
        costo_relevo_obj: 0,
        costo_relevo_real: 0,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al crear depósito");
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
          Nuevo depósito
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nuevo depósito</DialogTitle>
            <DialogDescription>
              Completa los datos para crear un nuevo depósito (terminal) en el
              sistema.
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
                value={formData.desc_parada}
                onChange={(e) =>
                  setFormData({ ...formData, desc_parada: e.target.value })
                }
                className="col-span-3"
                maxLength={500}
                placeholder="DEPOSITO BAU MERIDA"
                required
              />
            </div>

            {/* Descripción corta */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_parada_corta" className="text-right">
                Desc. Corta *
              </Label>
              <Input
                id="desc_parada_corta"
                value={formData.desc_parada_corta}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    desc_parada_corta: e.target.value,
                  })
                }
                className="col-span-3"
                maxLength={200}
                placeholder="DEP BAU M"
                required
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
                value={formData.fecha_validez}
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
                value={formData.servicios_llegan}
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
                value={formData.servicios_salen}
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
                value={formData.costo_relevo_obj}
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
                value={formData.costo_relevo_real}
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
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear depósito"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
