"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { paradasService } from "@/services/paradas.service";
import { ApiError } from "@/lib/api";
import type { Parada } from "@/types/index-paradas";
import { CreateParadaDialog } from "./create-parada-dialog";
import { EditParadaDialog } from "./edit-parada-dialog";

export function ParadasTable() {
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estado para modales
  const [editParada, setEditParada] = useState<Parada | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // ARREGLADO: Estado para Alert Dialog ahora guarda id + fecha
  const [deleteParada, setDeleteParada] = useState<{
    id: number;
    fecha: string;
  } | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    loadParadas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Cargar todas las paradas del backend
   */
  const loadParadas = async () => {
    try {
      setLoading(true);
      const data = await paradasService.getAll();
      setParadas(data);
      toast.success(`${data.length} paradas cargadas exitosamente`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al cargar paradas");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrar paradas según búsqueda
   */
  const filteredParadas = paradas.filter((parada) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      parada.desc_parada.toLowerCase().includes(searchLower) ||
      parada.desc_parada_corta.toLowerCase().includes(searchLower) ||
      parada.id_parada.toString().includes(searchQuery)
    );
  });

  /**
   * Paginación
   */
  const totalPages = Math.ceil(filteredParadas.length / itemsPerPage);
  const paginatedParadas = filteredParadas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /**
   * Manejar edición de parada
   */
  const handleEdit = (parada: Parada) => {
    setEditParada(parada);
    setEditDialogOpen(true);
  };

  /**
   * NUEVO: Callback cuando se actualiza una parada
   * NO recarga todo, solo actualiza el registro específico
   */
  const handleParadaUpdated = (paradaActualizada: Parada) => {
    setParadas((prevParadas) =>
      prevParadas.map((p) =>
        p.id_parada === paradaActualizada.id_parada &&
        p.fecha_validez === paradaActualizada.fecha_validez
          ? paradaActualizada
          : p,
      ),
    );
    toast.success("Parada actualizada en la tabla");
  };

  /**
   * NUEVO: Callback cuando se crea una parada
   * Agrega al estado local en lugar de recargar todo
   */
  const handleParadaCreated = (nuevaParada: Parada) => {
    setParadas((prevParadas) => [nuevaParada, ...prevParadas]);
    toast.success("Parada agregada a la tabla");
  };

  /**
   * ARREGLADO: Abrir Alert Dialog con id + fecha
   */
  const handleDeleteClick = (id: number, fecha: string) => {
    setDeleteParada({ id, fecha });
    setDeleteAlertOpen(true);
  };

  /**
   * ARREGLADO: Confirmar eliminación con clave compuesta
   * NO recarga todo, solo elimina del estado local
   */
  const confirmDelete = async () => {
    if (!deleteParada) return;

    try {
      // Envía id + fecha
      await paradasService.delete(deleteParada.id, deleteParada.fecha);

      // Solo elimina del estado local (sin recarga)
      setParadas((prevParadas) =>
        prevParadas.filter(
          (p) =>
            !(
              p.id_parada === deleteParada.id &&
              p.fecha_validez === deleteParada.fecha
            ),
        ),
      );

      toast.success("Parada eliminada exitosamente");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al eliminar parada");
      }
    } finally {
      setDeleteAlertOpen(false);
      setDeleteParada(null);
    }
  };

  /**
   * Ver parada en Google Maps
   */
  const handleViewOnMap = (parada: Parada) => {
    const url = `https://www.google.com/maps?q=${parada.latitud},${parada.longitud}`;
    window.open(url, "_blank");
    toast.info("Abriendo Google Maps...");
  };

  /**
   * Pantalla de carga
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cargando paradas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-4">
        {/* HEADER: Buscador + Botón Crear */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            {/* Buscador */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, nombre o descripción..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            {/* Botón Recargar */}
            <Button
              variant="outline"
              size="icon"
              onClick={loadParadas}
              title="Recargar datos"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/*  ARREGLADO: Botón Crear usa handleParadaCreated */}
          <CreateParadaDialog onParadaCreated={handleParadaCreated} />
        </div>

        {/* TABLA */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">ID</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Descripción Corta</TableHead>
                <TableHead>Fecha Validez</TableHead>
                <TableHead className="text-right">Latitud</TableHead>
                <TableHead className="text-right">Longitud</TableHead>
                <TableHead className="w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedParadas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchQuery
                      ? "No se encontraron registros con los filtros aplicados"
                      : "No hay paradas registradas"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedParadas.map((parada) => (
                  <TableRow key={`${parada.id_parada}-${parada.fecha_validez}`}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">P-{parada.id_parada}</Badge>
                    </TableCell>
                    <TableCell
                      className="max-w-75 truncate"
                      title={parada.desc_parada}
                    >
                      {parada.desc_parada}
                    </TableCell>
                    <TableCell
                      className="max-w-50 truncate"
                      title={parada.desc_parada_corta}
                    >
                      {parada.desc_parada_corta}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {new Date(
                          parada.fecha_validez + "T00:00:00",
                        ).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {Number(parada.latitud).toFixed(7)}°
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {Number(parada.longitud).toFixed(7)}°
                    </TableCell>
                    <TableCell>
                      {/* MENÚ DE 3 PUNTOS */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(parada)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleViewOnMap(parada)}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            Ver en mapa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteClick(
                                parada.id_parada,
                                parada.fecha_validez,
                              )
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {filteredParadas.length === 0
              ? "0 of 0 row(s) selected."
              : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredParadas.length,
                )} de ${filteredParadas.length} registro(s)`}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rows per page</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-17.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-muted-foreground">
              Page {currentPage} of {totalPages || 1}
            </span>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                ««
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                ›
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                »»
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/*  ARREGLADO: MODAL DE EDICIÓN usa handleParadaUpdated */}
      <EditParadaDialog
        parada={editParada}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onParadaUpdated={handleParadaUpdated}
      />

      {/* ALERT DIALOG DE ELIMINACIÓN */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar parada?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la parada del sistema. Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
