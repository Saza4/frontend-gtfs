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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { lineasService } from "@/services/lineas.service";
import { ApiError } from "@/lib/api";
import type { Linea, LineaUpdate } from "@/types/index-lineas";

interface EditLineaDialogProps {
  linea: Linea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLineaUpdated: () => void;
}

export function EditLineaDialog({
  linea,
  open,
  onOpenChange,
  onLineaUpdated,
}: EditLineaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LineaUpdate>({});

  // Cargar datos de la línea cuando se abre el modal
  useEffect(() => {
    if (linea) {
      setFormData({
        desc_linea: linea.desc_linea,
        code_trayecto: linea.code_trayecto,
        desc_trayecto: linea.desc_trayecto,
        desc_trayecto_corta: linea.desc_trayecto_corta,
        tipo_viaje: linea.tipo_viaje,
        color: linea.color,
        code_trayecto_externo: linea.code_trayecto_externo,
      });
    }
  }, [linea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linea) return;

    setLoading(true);

    try {
      // Normalizar color
      const colorNormalizado = formData.color?.replace(/^#/, "").toUpperCase();

      const dataToSend = {
        ...formData,
        color: colorNormalizado,
        code_trayecto_externo: formData.code_trayecto_externo || undefined,
      };

      await lineasService.update(linea.id_linea, dataToSend);
      toast.success("Línea actualizada exitosamente");
      onOpenChange(false);
      onLineaUpdated();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar línea");
      }
    } finally {
      setLoading(false);
    }
  };

  // Convertir color hex a formato CSS
  const getColorPreview = (hex: string | undefined) => {
    if (!hex) return "#000000";
    const cleanHex = hex.replace(/^#/, "");
    if (cleanHex.length === 8) {
      return `#${cleanHex.substring(2)}`;
    }
    return `#${cleanHex}`;
  };

  if (!linea) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar línea {linea.code_trayecto}</DialogTitle>
            <DialogDescription>
              Modifica los datos de la línea. Los cambios se guardarán al hacer
              clic en `Guardar cambios`.
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
                value={formData.desc_linea || ""}
                onChange={(e) =>
                  setFormData({ ...formData, desc_linea: e.target.value })
                }
                className="col-span-3"
                maxLength={255}
                required
              />
            </div>

            {/* Código de trayecto (solo lectura) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code_trayecto" className="text-right">
                Código
              </Label>
              <Input
                id="code_trayecto"
                value={formData.code_trayecto || ""}
                className="col-span-3"
                disabled
              />
            </div>

            {/* Descripción del trayecto */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc_trayecto" className="text-right">
                Trayecto *
              </Label>
              <Input
                id="desc_trayecto"
                value={formData.desc_trayecto || ""}
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
                value={formData.desc_trayecto_corta || ""}
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
                  value={formData.color || ""}
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
                value={formData.code_trayecto_externo || ""}
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
