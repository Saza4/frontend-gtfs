"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      toast.success("Actualizado");
      onOpenChange(false);
      onUpdated();
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Segmento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Origen</Label>
            <Input
              value={formData.origen || ""}
              onChange={(e) =>
                setFormData({ ...formData, origen: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Destino</Label>
            <Input
              value={formData.destino || ""}
              onChange={(e) =>
                setFormData({ ...formData, destino: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
