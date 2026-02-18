"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { arcosLineaService } from "@/services/arcos-linea.service";
import { ApiError } from "@/lib/api";
import type { ArcosLinea, ArcosLineaUpdate } from "@/types/index-arcos-linea";

interface Props {
  arco: ArcosLinea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditArcosLineaDialog({
  arco,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ArcosLineaUpdate>({});

  useEffect(() => {
    if (arco) {
      setFormData({
        desc_linea_corta: arco.desc_linea_corta,
        desc_trayecto_corta: arco.desc_trayecto_corta,
        sentido: arco.sentido,
        fecha_validez: arco.fecha_validez,
        secuencia: arco.secuencia,
        code_arco: arco.code_arco,
        origen: arco.origen,
        destino: arco.destino,
        metros_reales: arco.metros_reales,
      });
    }
  }, [arco]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arco) return;

    setLoading(true);
    try {
      await arcosLineaService.update(arco.id_arco_linea, formData);
      toast.success("Arco actualizado exitosamente");
      onOpenChange(false);
      onUpdated();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar el arco");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!arco) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Editar Arco de Línea #{arco.id_arco_linea}
            </DialogTitle>
            <DialogDescription>
              Modifica los datos del arco. Los cambios se guardarán al hacer
              clic en `Guardar cambios`.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Línea y Trayecto */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="desc_linea_corta">Línea Corta</Label>
                <Input
                  id="desc_linea_corta"
                  value={formData.desc_linea_corta || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      desc_linea_corta: e.target.value,
                    })
                  }
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc_trayecto_corta">Trayecto Corto</Label>
                <Input
                  id="desc_trayecto_corta"
                  value={formData.desc_trayecto_corta || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      desc_trayecto_corta: e.target.value,
                    })
                  }
                  maxLength={100}
                  required
                />
              </div>
            </div>

            {/* Sentido, Secuencia, Código Arco */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sentido">Sentido</Label>
                <Select
                  value={formData.sentido?.toString() || "0"}
                  onValueChange={(v) =>
                    setFormData({ ...formData, sentido: Number(v) })
                  }
                >
                  <SelectTrigger id="sentido">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Ida (0)</SelectItem>
                    <SelectItem value="1">Regreso (1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secuencia">Secuencia</Label>
                <Input
                  id="secuencia"
                  type="number"
                  min="1"
                  value={formData.secuencia || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      secuencia: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code_arco">Cód. Arco</Label>
                <Input
                  id="code_arco"
                  type="number"
                  value={formData.code_arco || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code_arco: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Fecha de Validez */}
            <div className="space-y-2">
              <Label htmlFor="fecha_validez">Fecha de Validez</Label>
              <Input
                id="fecha_validez"
                type="date"
                value={formData.fecha_validez || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_validez: e.target.value })
                }
                required
              />
            </div>

            {/* Origen y Destino */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origen">Origen</Label>
                <Input
                  id="origen"
                  value={formData.origen || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, origen: e.target.value })
                  }
                  maxLength={500}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destino">Destino</Label>
                <Input
                  id="destino"
                  value={formData.destino || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, destino: e.target.value })
                  }
                  maxLength={500}
                  required
                />
              </div>
            </div>

            {/* Metros Reales */}
            <div className="space-y-2">
              <Label htmlFor="metros_reales">Metros Reales</Label>
              <Input
                id="metros_reales"
                type="number"
                step="0.01"
                min="0"
                value={formData.metros_reales || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metros_reales: Number(e.target.value),
                  })
                }
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
