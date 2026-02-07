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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { lineasService } from "@/services/lineas.service";
import { ApiError } from "@/lib/api";
import type { LineaCreate } from "@/types/index-lineas";

interface CreateLineaDialogProps {
  onLineaCreated: () => void;
}

export function CreateLineaDialog({ onLineaCreated }: CreateLineaDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LineaCreate>({
    desc_linea: "",
    code_trayecto: "",
    desc_trayecto: "",
    desc_trayecto_corta: "",
    tipo_viaje: "ESTANDAR",
    color: "FF4D2B63", // Color por defecto
    code_trayecto_externo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Asegurar que el color tenga formato correcto (8 dígitos hex)
      const colorNormalizado = formData.color.replace(/^#/, "").toUpperCase();

      const dataToSend = {
        ...formData,
        color: colorNormalizado,
        code_trayecto_externo: formData.code_trayecto_externo || undefined,
      };

      await lineasService.create(dataToSend);
      toast.success("Línea creada exitosamente");
      setOpen(false);
      onLineaCreated();

      // Reset form
      setFormData({
        desc_linea: "",
        code_trayecto: "",
        desc_trayecto: "",
        desc_trayecto_corta: "",
        tipo_viaje: "ESTANDAR",
        color: "FF4D2B63",
        code_trayecto_externo: "",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al crear línea");
      }
    } finally {
      setLoading(false);
    }
  };

  // Convertir color hex a formato CSS
  const getColorPreview = (hex: string) => {
    const cleanHex = hex.replace(/^#/, "");
    if (cleanHex.length === 8) {
      // AARRGGBB -> #RRGGBB (ignorar alpha para preview)
      return `#${cleanHex.substring(2)}`;
    }
    return `#${cleanHex}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva línea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nueva línea</DialogTitle>
            <DialogDescription>
              Completa los datos para crear una nueva línea en el sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Descripción de la línea */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_linea" className="text-right">
                Descripción *
              </Label>
              <Input
                id="desc_linea"
                value={formData.desc_linea}
                onChange={(e) =>
                  setFormData({ ...formData, desc_linea: e.target.value })
                }
                className="col-span-3"
                maxLength={255}
                required
              />
            </div>

            {/* Código de trayecto */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code_trayecto" className="text-right">
                Código *
              </Label>
              <Input
                id="code_trayecto"
                value={formData.code_trayecto}
                onChange={(e) =>
                  setFormData({ ...formData, code_trayecto: e.target.value })
                }
                className="col-span-3"
                maxLength={100}
                required
              />
            </div>

            {/* Descripción del trayecto */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_trayecto" className="text-right">
                Trayecto *
              </Label>
              <Input
                id="desc_trayecto"
                value={formData.desc_trayecto}
                onChange={(e) =>
                  setFormData({ ...formData, desc_trayecto: e.target.value })
                }
                className="col-span-3"
                maxLength={255}
                required
              />
            </div>

            {/* Descripción corta */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_trayecto_corta" className="text-right">
                Trayecto corto *
              </Label>
              <Input
                id="desc_trayecto_corta"
                value={formData.desc_trayecto_corta}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    desc_trayecto_corta: e.target.value,
                  })
                }
                className="col-span-3"
                maxLength={100}
                required
              />
            </div>

            {/* Tipo de viaje */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo_viaje" className="text-right">
                Tipo de viaje *
              </Label>
              <Select
                value={formData.tipo_viaje}
                onValueChange={(value: "ESTANDAR" | "MIXTO" | "ELECTRICO") =>
                  setFormData({ ...formData, tipo_viaje: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ESTANDAR">Estándar</SelectItem>
                  <SelectItem value="MIXTO">Mixto</SelectItem>
                  <SelectItem value="ELECTRICO">Eléctrico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color *
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="FF4D2B63"
                  maxLength={8}
                  required
                  className="flex-1"
                />
                <div
                  className="w-12 h-10 rounded border"
                  style={{ backgroundColor: getColorPreview(formData.color) }}
                  title="Preview del color"
                />
              </div>
            </div>

            {/* Código externo (opcional) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code_trayecto_externo" className="text-right">
                Código externo
              </Label>
              <Input
                id="code_trayecto_externo"
                value={formData.code_trayecto_externo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code_trayecto_externo: e.target.value,
                  })
                }
                className="col-span-3"
                maxLength={100}
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
              {loading ? "Creando..." : "Crear línea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
