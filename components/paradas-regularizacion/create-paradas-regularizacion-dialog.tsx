"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";
import { paradasRegularizacionService } from "@/services/paradas-regularizacion.service";
import { ApiError } from "@/lib/api";
import type { ParadaRegularizacionCreate } from "@/types/index-paradas-regularizacion";

export function CreateParadasRegularizacionDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    Omit<ParadaRegularizacionCreate, "id_parada_regularizacion">
  >({
    desc_trayecto_corta: "",
    sentido: 1, // ATY format: 1=Ida, 2=Regreso
    fecha_validez: new Date().toISOString().split("T")[0],
    periodicidad: "Conciertos",
    desc_parada: "",
    regula: false,
    releva: false,
    entran: false,
    salen: false,
    descansa: false,
    informes: false,
    relevante: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await paradasRegularizacionService.create(formData);
      toast.success("Parada creada exitosamente");
      setOpen(false);
      onSuccess();
      // Reset form
      setFormData({
        desc_trayecto_corta: "",
        sentido: 1,
        fecha_validez: new Date().toISOString().split("T")[0],
        periodicidad: "Conciertos",
        desc_parada: "",
        regula: false,
        releva: false,
        entran: false,
        salen: false,
        descansa: false,
        informes: false,
        relevante: false,
      });
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleField = (
    field: keyof Omit<ParadaRegularizacionCreate, "id_parada_regularizacion">,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nueva Parada
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Parada de Regularización</DialogTitle>
            <DialogDescription>
              Completa los datos de la parada de control. El ID se asignará
              automáticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* ✅ ID REMOVIDO - Se autogenera */}

            {/* Trayecto y Sentido */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="desc_trayecto_corta">Trayecto *</Label>
                <Input
                  id="desc_trayecto_corta"
                  value={formData.desc_trayecto_corta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      desc_trayecto_corta: e.target.value,
                    })
                  }
                  placeholder="Ej: R1"
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sentido">Sentido (ATY) *</Label>
                <Select
                  value={formData.sentido.toString()}
                  onValueChange={(v) =>
                    setFormData({ ...formData, sentido: Number(v) })
                  }
                >
                  <SelectTrigger id="sentido">
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
                <Label htmlFor="fecha_validez">Fecha Validez *</Label>
                <Input
                  id="fecha_validez"
                  type="date"
                  value={formData.fecha_validez}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_validez: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodicidad">Periodicidad *</Label>
                <Select
                  value={formData.periodicidad}
                  onValueChange={(v) =>
                    setFormData({ ...formData, periodicidad: v })
                  }
                >
                  <SelectTrigger id="periodicidad">
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
              <Label htmlFor="desc_parada">Descripción Parada *</Label>
              <Input
                id="desc_parada"
                value={formData.desc_parada}
                onChange={(e) =>
                  setFormData({ ...formData, desc_parada: e.target.value })
                }
                placeholder="Ej: R1 C-58 x 69 y 71 Col. Centro_1"
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
                    id={field.key}
                    checked={
                      formData[
                        field.key as keyof Omit<
                          ParadaRegularizacionCreate,
                          "id_parada_regularizacion"
                        >
                      ] as boolean
                    }
                    onCheckedChange={() =>
                      toggleField(
                        field.key as keyof Omit<
                          ParadaRegularizacionCreate,
                          "id_parada_regularizacion"
                        >,
                      )
                    }
                  />
                  <Label htmlFor={field.key} className="text-xs cursor-pointer">
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
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Crear parada"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
