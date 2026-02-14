"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  const [formData, setFormData] = useState<ParadaRegularizacionCreate>({
    desc_trayecto_corta: "",
    sentido: 1,
    fecha_validez: new Date().toISOString().split("T")[0],
    periodicidad: "Diario",
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
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleField = (field: keyof ParadaRegularizacionCreate) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nueva Parada
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 text-foreground">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Parada de Regularización</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trayecto</Label>
                <Input
                  value={formData.desc_trayecto_corta}
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
                  value={formData.sentido.toString()}
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
                value={formData.desc_parada}
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
                    id={field}
                    checked={
                      formData[
                        field as keyof ParadaRegularizacionCreate
                      ] as boolean
                    }
                    onCheckedChange={() =>
                      toggleField(field as keyof ParadaRegularizacionCreate)
                    }
                  />
                  <Label
                    htmlFor={field}
                    className="text-xs capitalize cursor-pointer"
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
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
