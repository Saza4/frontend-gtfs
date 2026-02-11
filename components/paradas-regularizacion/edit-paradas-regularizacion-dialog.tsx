"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Checkbox } from "@/components/ui/checkbox";
import { paradasRegularizacionService } from "@/services/paradas-regularizacion.service";
import { ApiError } from "@/lib/api";
import type {
  ParadasRegularizacion,
  ParadaRegularizacionUpdate,
} from "@/types/index-paradas-regularizacion";

interface Props {
  parada: ParadasRegularizacion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditParadasRegularizacionDialog({
  parada,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ParadaRegularizacionUpdate>({});

  // Sincronizar datos cuando se selecciona una parada para editar
  useEffect(() => {
    if (parada) {
      setFormData({
        desc_trayecto_corta: parada.desc_trayecto_corta,
        sentido: parada.sentido === 0 ? 1 : 2, // Convertimos GTFS a visual ATY
        fecha_validez: parada.fecha_validez,
        periodicidad: parada.periodicidad,
        desc_parada: parada.desc_parada,
        regula: parada.regula,
        releva: parada.releva,
        entran: parada.entran,
        salen: parada.salen,
        descansa: parada.descansa,
        informes: parada.informes,
        relevante: parada.relevante,
      });
    }
  }, [parada]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parada) return;

    setLoading(true);
    try {
      await paradasRegularizacionService.update(
        parada.id_parada_regularizacion,
        formData,
      );
      toast.success("Registro actualizado correctamente");
      onOpenChange(false);
      onUpdated();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar la parada");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleField = (field: keyof ParadaRegularizacionUpdate) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 text-foreground">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Parada de Regularización</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trayecto</Label>
                <Input
                  value={formData.desc_trayecto_corta || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      desc_trayecto_corta: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Sentido (ATY)</Label>
                <Select
                  value={formData.sentido?.toString()}
                  onValueChange={(v) =>
                    setFormData({ ...formData, sentido: Number(v) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ida (1)</SelectItem>
                    <SelectItem value="2">Regreso (2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción Parada</Label>
              <Input
                value={formData.desc_parada || ""}
                onChange={(e) =>
                  setFormData({ ...formData, desc_parada: e.target.value })
                }
                required
              />
            </div>

            <Label className="text-xs font-bold uppercase text-muted-foreground mt-2">
              Funciones de Operación
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg border">
              {[
                "regula",
                "releva",
                "entran",
                "salen",
                "descansa",
                "informes",
                "relevante",
              ].map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${field}`}
                    checked={
                      !!formData[field as keyof ParadaRegularizacionUpdate]
                    }
                    onCheckedChange={() =>
                      toggleField(field as keyof ParadaRegularizacionUpdate)
                    }
                  />
                  <Label
                    htmlFor={`edit-${field}`}
                    className="text-xs capitalize cursor-pointer font-medium"
                  >
                    {field}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Actualizar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
