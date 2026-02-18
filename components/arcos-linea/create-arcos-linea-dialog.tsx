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
import { arcosLineaService } from "@/services/arcos-linea.service";
import { ApiError } from "@/lib/api";
import type { ArcosLineaCreate } from "@/types/index-arcos-linea";

export function CreateArcosLineaDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ArcosLineaCreate>({
    desc_linea_corta: "",
    desc_trayecto_corta: "",
    sentido: 1,
    fecha_validez: new Date().toISOString().split("T")[0],
    secuencia: 1,
    code_arco: 0,
    origen: "",
    destino: "",
    metros_reales: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await arcosLineaService.create(formData);
      toast.success("Arco creado exitosamente");
      setOpen(false);
      onSuccess();

      // Reset form
      setFormData({
        desc_linea_corta: "",
        desc_trayecto_corta: "",
        sentido: 1,
        fecha_validez: new Date().toISOString().split("T")[0],
        secuencia: 1,
        code_arco: 0,
        origen: "",
        destino: "",
        metros_reales: 0,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al crear el arco");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Arco
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Arco de Línea</DialogTitle>
            <DialogDescription>
              Completa los datos para crear un nuevo arco de línea en el
              sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Línea y Trayecto */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="desc_linea_corta">Línea Corta *</Label>
                <Input
                  id="desc_linea_corta"
                  value={formData.desc_linea_corta}
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
                  maxLength={100}
                  required
                />
              </div>
            </div>

            {/* Sentido, Secuencia, Código Arco */}
            <div className="grid grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="secuencia">Secuencia *</Label>
                <Input
                  id="secuencia"
                  type="number"
                  min="1"
                  value={formData.secuencia}
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
                <Label htmlFor="code_arco">Cód. Arco *</Label>
                <Input
                  id="code_arco"
                  type="number"
                  value={formData.code_arco}
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
              <Label htmlFor="fecha_validez">Fecha de Validez *</Label>
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

            {/* Origen y Destino */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origen">Origen *</Label>
                <Input
                  id="origen"
                  value={formData.origen}
                  onChange={(e) =>
                    setFormData({ ...formData, origen: e.target.value })
                  }
                  maxLength={500}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destino">Destino *</Label>
                <Input
                  id="destino"
                  value={formData.destino}
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
              <Label htmlFor="metros_reales">Metros Reales *</Label>
              <Input
                id="metros_reales"
                type="number"
                step="0.01"
                min="0"
                value={formData.metros_reales}
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
