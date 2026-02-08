"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
  Zap,
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
import { puntosCargaService } from "@/services/puntos-carga.service";
import { ApiError } from "@/lib/api";
import type { PuntoCarga } from "@/types/index-puntos-carga";
import { CreatePuntoCargaDialog } from "./create-punto-carga-dialog";
import { EditPuntoCargaDialog } from "./edit-punto-carga-dialog";

export function PuntosCargaTable() {
  const [puntosCarga, setPuntosCarga] = useState<PuntoCarga[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estado para modales
  const [editPunto, setEditPunto] = useState<PuntoCarga | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Estado para Alert Dialog de eliminación
  const [deletePuntoId, setDeletePuntoId] = useState<number | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    loadPuntosCarga();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Cargar todos los puntos de carga del backend
   */
  const loadPuntosCarga = async () => {
    try {
      setLoading(true);
      const data = await puntosCargaService.getAll();
      setPuntosCarga(data);
      toast.success(`${data.length} puntos de carga cargados exitosamente`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al cargar puntos de carga");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrar puntos de carga según búsqueda
   */
  const filteredPuntos = puntosCarga.filter((punto) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      punto.desc_sitio.toLowerCase().includes(searchLower) ||
      punto.desc_sitio_corta.toLowerCase().includes(searchLower) ||
      punto.desc_bus.toLowerCase().includes(searchLower) ||
      punto.desc_bus_corta.toLowerCase().includes(searchLower) ||
      punto.id_punto_recarga.toString().includes(searchQuery)
    );
  });

  /**
   * Paginación
   */
  const totalPages = Math.ceil(filteredPuntos.length / itemsPerPage);
  const paginatedPuntos = filteredPuntos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /**
   * Manejar edición de punto de carga
   */
  const handleEdit = (punto: PuntoCarga) => {
    setEditPunto(punto);
    setEditDialogOpen(true);
  };

  /**
   * Abrir Alert Dialog para confirmar eliminación
   */
  const handleDeleteClick = (id: number) => {
    setDeletePuntoId(id);
    setDeleteAlertOpen(true);
  };

  /**
   * Confirmar eliminación de punto de carga
   */
  const confirmDelete = async () => {
    if (deletePuntoId === null) return;

    try {
      await puntosCargaService.delete(deletePuntoId);
      setPuntosCarga(
        puntosCarga.filter((p) => p.id_registro !== deletePuntoId),
      );
      toast.success("Punto de carga eliminado exitosamente");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al eliminar punto de carga");
      }
    } finally {
      setDeleteAlertOpen(false);
      setDeletePuntoId(null);
    }
  };

  /**
   * Obtener badge variant según porcentaje de carga
   */
  const getCargaBadge = (porcentaje: number) => {
    if (porcentaje === 100) return "default"; // Azul
    if (porcentaje >= 90) return "secondary"; // Gris
    return "outline"; // Outline
  };

  /**
   * Obtener color del badge según tipo de autobús
   */
  const getBusBadge = (tipo: string) => {
    if (tipo.includes("IETRAM")) return "default"; // Azul
    if (tipo.includes("BYD")) return "destructive"; // Rojo
    return "secondary"; // Gris
  };

  /**
   * Formatear número decimal
   */
  const formatDecimal = (value: number) => {
    return value.toFixed(6);
  };

  /**
   * Pantalla de carga
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Cargando puntos de carga...
          </p>
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
                placeholder="Buscar por sitio, autobús, ID..."
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
              onClick={loadPuntosCarga}
              title="Recargar datos"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Botón Crear Nuevo Punto */}
          <CreatePuntoCargaDialog onPuntoCreated={loadPuntosCarga} />
        </div>

        {/* TABLA - ORDEN DE LA BASE DE DATOS */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {/* 1. id_registro */}
                <TableHead className="w-[80px]">ID</TableHead>

                {/* 2. id_punto_recarga */}
                <TableHead className="w-[100px]">Punto</TableHead>

                {/* 3. desc_sitio */}
                <TableHead>Descripción Sitio</TableHead>

                {/* 4. desc_sitio_corta */}
                <TableHead className="w-[120px]">Sitio Corto</TableHead>

                {/* 5. desc_bus */}
                <TableHead>Descripción Bus</TableHead>

                {/* 6. desc_bus_corta */}
                <TableHead className="w-[100px]">Bus</TableHead>

                {/* 7. fecha_desde */}
                <TableHead className="w-[80px]">Desde</TableHead>

                {/* 8. fecha_hasta */}
                <TableHead className="w-[80px]">Hasta</TableHead>

                {/* 9. carga_max_porc */}
                <TableHead className="w-[100px] text-center">Carga %</TableHead>

                {/* Acciones */}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPuntos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchQuery
                      ? "No se encontraron registros con los filtros aplicados"
                      : "No hay puntos de carga registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPuntos.map((punto) => (
                  <TableRow key={punto.id_registro}>
                    {/* 1. id_registro */}
                    <TableCell className="font-medium">
                      <Badge variant="outline">{punto.id_registro}</Badge>
                    </TableCell>

                    {/* 2. id_punto_recarga */}
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Zap className="h-3 w-3" />
                        {punto.id_punto_recarga}
                      </Badge>
                    </TableCell>

                    {/* 3. desc_sitio */}
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={punto.desc_sitio}
                    >
                      {punto.desc_sitio}
                    </TableCell>

                    {/* 4. desc_sitio_corta */}
                    <TableCell className="font-medium">
                      {punto.desc_sitio_corta}
                    </TableCell>

                    {/* 5. desc_bus */}
                    <TableCell
                      className="max-w-[150px] truncate"
                      title={punto.desc_bus}
                    >
                      {punto.desc_bus}
                    </TableCell>

                    {/* 6. desc_bus_corta */}
                    <TableCell>
                      <Badge variant={getBusBadge(punto.desc_bus_corta)}>
                        {punto.desc_bus_corta}
                      </Badge>
                    </TableCell>

                    {/* 7. fecha_desde */}
                    <TableCell className="font-mono text-sm">
                      {punto.fecha_desde}
                    </TableCell>

                    {/* 8. fecha_hasta */}
                    <TableCell className="font-mono text-sm">
                      {punto.fecha_hasta}
                    </TableCell>

                    {/* 9. carga_max_porc */}
                    <TableCell className="text-center">
                      <Badge variant={getCargaBadge(punto.carga_max_porc)}>
                        {punto.carga_max_porc}%
                      </Badge>
                    </TableCell>

                    {/* Menú de acciones */}
                    <TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(punto)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(punto.id_registro)}
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
            {filteredPuntos.length === 0
              ? "0 of 0 row(s) selected."
              : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredPuntos.length,
                )} de ${filteredPuntos.length} registro(s)`}
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
              <SelectTrigger className="w-[70px]">
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

      {/* MODAL DE EDICIÓN */}
      <EditPuntoCargaDialog
        punto={editPunto}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onPuntoUpdated={loadPuntosCarga}
      />

      {/* ALERT DIALOG DE ELIMINACIÓN */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar punto de carga?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el punto de carga del
              sistema. Esta acción no se puede deshacer.
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
