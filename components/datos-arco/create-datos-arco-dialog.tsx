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
import { datosArcoService } from "@/services/datos-arco.service";
import { ApiError } from "@/lib/api";
import type { DatosArcoCreate } from "@/types/index-datos-arco";

interface CreateDatosArcoDialogProps {
  onDatoCreated: () => void;
}

export function CreateDatosArcoDialog({
  onDatoCreated,
}: CreateDatosArcoDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DatosArcoCreate>({
    id_arco: 0,
    desc_arco: "",
    origen: "",
    destino: "",
    fecha_validez: new Date().toISOString().split("T")[0],
    metros_teoricos: 0,
    metros_mapa: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await datosArcoService.create(formData);
      toast.success("Dato de arco creado exitosamente");
      setOpen(false);
      onDatoCreated();
      setFormData({
        id_arco: 0,
        desc_arco: "",
        origen: "",
        destino: "",
        fecha_validez: new Date().toISOString().split("T")[0],
        metros_teoricos: 0,
        metros_mapa: 0,
      });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Error al crear";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nuevo arco
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nuevo dato de arco</DialogTitle>
            <DialogDescription>
              Ingrese los detalles del segmento de ruta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id_arco" className="text-right">
                ID Arco *
              </Label>
              <Input
                id="id_arco"
                type="number"
                value={formData.id_arco}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_arco: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_arco" className="text-right">
                Descripción *
              </Label>
              <Input
                id="desc_arco"
                value={formData.desc_arco}
                onChange={(e) =>
                  setFormData({ ...formData, desc_arco: e.target.value })
                }
                className="col-span-3"
                maxLength={255}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metros_teoricos" className="text-right">
                M. Teóricos *
              </Label>
              <Input
                id="metros_teoricos"
                type="number"
                step="0.01"
                value={formData.metros_teoricos}
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
              <Label htmlFor="metros_mapa" className="text-right">
                M. Mapa *
              </Label>
              <Input
                id="metros_mapa"
                type="number"
                step="0.01"
                value={formData.metros_mapa}
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
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear arco"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
