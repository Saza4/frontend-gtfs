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
import { paradasService } from "@/services/paradas.service";
import { ApiError } from "@/lib/api";
import type { Parada, ParadaCreate } from "@/types/index-paradas";

interface CreateParadaDialogProps {
  onParadaCreated: (parada: Parada) => void; // ✅ Ahora devuelve la parada creada
}

export function CreateParadaDialog({
  onParadaCreated,
}: CreateParadaDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ParadaCreate>({
    id_parada: 0,
    desc_parada: "",
    desc_parada_corta: "",
    fecha_validez: new Date().toISOString().split("T")[0],
    latitud: 0,
    longitud: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const nuevaParada = await paradasService.create(formData);

      toast.success("Parada creada exitosamente");
      setOpen(false);

      // ✅ Devuelve la parada creada al componente padre
      onParadaCreated(nuevaParada);

      // Reset form
      setFormData({
        id_parada: 0,
        desc_parada: "",
        desc_parada_corta: "",
        fecha_validez: new Date().toISOString().split("T")[0],
        latitud: 0,
        longitud: 0,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al crear parada");
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
          Nueva parada
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nueva parada</DialogTitle>
            <DialogDescription>
              Completa los datos para crear una nueva parada en el sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Descripción */}
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
                value={formData.desc_parada_corta}
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
                value={formData.fecha_validez}
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
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear parada"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
