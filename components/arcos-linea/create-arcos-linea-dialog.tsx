"use client";

import { useState } from "react";
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
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Arco de Línea</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Línea Corta</Label>
                <Input
                  value={formData.desc_linea_corta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      desc_linea_corta: e.target.value,
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Origen</Label>
                <Input
                  value={formData.origen}
                  onChange={(e) =>
                    setFormData({ ...formData, origen: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Destino</Label>
                <Input
                  value={formData.destino}
                  onChange={(e) =>
                    setFormData({ ...formData, destino: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
