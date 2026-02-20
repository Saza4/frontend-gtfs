"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
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
        sentido: parada.sentido === 0 ? 1 : 2, // GTFS (0/1) → ATY (1/2)
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
      toast.success("Parada actualizada correctamente");
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

  if (!parada) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Editar Parada de Regularización
              <Badge variant="secondary">
                ID: {parada.id_parada_regularizacion}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Modifica los datos de la parada de control. El ID no puede ser
              modificado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* ✅ ID REMOVIDO - No editable */}

            {/* Trayecto y Sentido */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_desc_trayecto_corta">Trayecto *</Label>
                <Input
                  id="edit_desc_trayecto_corta"
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
              <div className="space-y-2">
                <Label htmlFor="edit_sentido">Sentido (ATY) *</Label>
                <Select
                  value={formData.sentido?.toString()}
                  onValueChange={(v) =>
                    setFormData({ ...formData, sentido: Number(v) })
                  }
                >
                  <SelectTrigger id="edit_sentido">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ida (1)</SelectItem>
                    <SelectItem value="2">Regreso (2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fecha de Validez y Periodicidad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_fecha_validez">Fecha Validez *</Label>
                <Input
                  id="edit_fecha_validez"
                  type="date"
                  value={formData.fecha_validez || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_validez: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_periodicidad">Periodicidad *</Label>
                <Select
                  value={formData.periodicidad || ""}
                  onValueChange={(v) =>
                    setFormData({ ...formData, periodicidad: v })
                  }
                >
                  <SelectTrigger id="edit_periodicidad">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diario">Diario</SelectItem>
                    <SelectItem value="Conciertos">Conciertos</SelectItem>
                    <SelectItem value="Eventos">Eventos</SelectItem>
                    <SelectItem value="Fines de Semana">
                      Fines de Semana
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descripción Parada */}
            <div className="space-y-2">
              <Label htmlFor="edit_desc_parada">Descripción Parada *</Label>
              <Input
                id="edit_desc_parada"
                value={formData.desc_parada || ""}
                onChange={(e) =>
                  setFormData({ ...formData, desc_parada: e.target.value })
                }
                maxLength={500}
                required
              />
            </div>

            {/* Funciones de Operación */}
            <Label className="text-xs font-bold uppercase text-muted-foreground mt-2">
              Funciones de Operación
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg border">
              {[
                { key: "regula", label: "Regula" },
                { key: "releva", label: "Releva" },
                { key: "entran", label: "Entran" },
                { key: "salen", label: "Salen" },
                { key: "descansa", label: "Descansa" },
                { key: "informes", label: "Informes" },
                { key: "relevante", label: "Relevante" },
              ].map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${field.key}`}
                    checked={
                      !!formData[field.key as keyof ParadaRegularizacionUpdate]
                    }
                    onCheckedChange={() =>
                      toggleField(field.key as keyof ParadaRegularizacionUpdate)
                    }
                  />
                  <Label
                    htmlFor={`edit-${field.key}`}
                    className="text-xs cursor-pointer font-medium"
                  >
                    {field.label}
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
