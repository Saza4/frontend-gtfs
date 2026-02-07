"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
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
import { lineasService } from "@/services/lineas.service";
import { ApiError } from "@/lib/api";
import type { Linea } from "@/types/index-lineas";
import { CreateLineaDialog } from "./create-linea-dialog";
import { EditLineaDialog } from "./edit-linea-dialog";

export function LineasTable() {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estado para modales
  const [editLinea, setEditLinea] = useState<Linea | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Estado para Alert Dialog de eliminación
  const [deleteLineaId, setDeleteLineaId] = useState<number | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    loadLineas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Cargar todas las líneas del backend
   */
  const loadLineas = async () => {
    try {
      setLoading(true);
      const data = await lineasService.getAll();
      setLineas(data);
      toast.success(`${data.length} líneas cargadas exitosamente`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al cargar líneas");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrar líneas según búsqueda
   */
  const filteredLineas = lineas.filter((linea) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      linea.desc_linea.toLowerCase().includes(searchLower) ||
      linea.code_trayecto.toLowerCase().includes(searchLower) ||
      linea.desc_trayecto.toLowerCase().includes(searchLower) ||
      linea.desc_trayecto_corta.toLowerCase().includes(searchLower)
    );
  });

  /**
   * Paginación
   */
  const totalPages = Math.ceil(filteredLineas.length / itemsPerPage);
  const paginatedLineas = filteredLineas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /**
   * Manejar edición de línea
   */
  const handleEdit = (linea: Linea) => {
    setEditLinea(linea);
    setEditDialogOpen(true);
  };

  /**
   * Abrir Alert Dialog para confirmar eliminación
   */
  const handleDeleteClick = (id: number) => {
    setDeleteLineaId(id);
    setDeleteAlertOpen(true);
  };

  /**
   * Confirmar eliminación de línea
   */
  const confirmDelete = async () => {
    if (deleteLineaId === null) return;

    try {
      await lineasService.delete(deleteLineaId);
      setLineas(lineas.filter((l) => l.id_linea !== deleteLineaId));
      toast.success("Línea eliminada exitosamente");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al eliminar línea");
      }
    } finally {
      setDeleteAlertOpen(false);
      setDeleteLineaId(null);
    }
  };

  /**
   * Convertir color hex AARRGGBB a #RRGGBB para CSS
   */
  const getColorCSS = (hex: string) => {
    const cleanHex = hex.replace(/^#/, "");
    if (cleanHex.length === 8) {
      // AARRGGBB -> #RRGGBB (ignorar alpha)
      return `#${cleanHex.substring(2)}`;
    }
    return `#${cleanHex}`;
  };

  /**
   * Obtener badge variant según tipo de viaje
   */
  const getTipoViajeBadge = (tipo: string) => {
    switch (tipo) {
      case "ELECTRICO":
        return "default";
      case "MIXTO":
        return "secondary";
      default:
        return "outline";
    }
  };

  /**
   * Pantalla de carga
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cargando líneas...</p>
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
                placeholder="Buscar por código, descripción..."
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
              onClick={loadLineas}
              title="Recargar datos"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Botón Crear Nueva Línea */}
          <CreateLineaDialog onLineaCreated={loadLineas} />
        </div>

        {/* TABLA - ORDEN DE LA BASE DE DATOS */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {/* 1. id_linea */}
                <TableHead className="w-[100px]">ID Línea</TableHead>

                {/* 2. desc_linea */}
                <TableHead>Descripción Línea</TableHead>

                {/* 3. code_trayecto */}
                <TableHead className="w-[120px]">Código Trayecto</TableHead>

                {/* 4. desc_trayecto */}
                <TableHead>Descripción Trayecto</TableHead>

                {/* 5. desc_trayecto_corta */}
                <TableHead className="w-[150px]">
                  Desc. Trayecto Corta
                </TableHead>

                {/* 6. tipo_viaje */}
                <TableHead className="w-[120px]">Tipo Viaje</TableHead>

                {/* 7. color */}
                <TableHead className="w-[120px]">Color</TableHead>

                {/* 8. code_trayecto_externo */}
                <TableHead className="w-[150px]">
                  Code Trayecto Externo
                </TableHead>

                {/* Acciones */}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLineas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchQuery
                      ? "No se encontraron registros con los filtros aplicados"
                      : "No hay líneas registradas"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLineas.map((linea) => (
                  <TableRow key={linea.id_linea}>
                    {/* 1. id_linea */}
                    <TableCell className="font-medium">
                      <Badge variant="outline">{linea.id_linea}</Badge>
                    </TableCell>

                    {/* 2. desc_linea */}
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={linea.desc_linea}
                    >
                      {linea.desc_linea}
                    </TableCell>

                    {/* 3. code_trayecto */}
                    <TableCell className="font-mono text-sm">
                      {linea.code_trayecto}
                    </TableCell>

                    {/* 4. desc_trayecto */}
                    <TableCell
                      className="max-w-[250px] truncate"
                      title={linea.desc_trayecto}
                    >
                      {linea.desc_trayecto}
                    </TableCell>

                    {/* 5. desc_trayecto_corta */}
                    <TableCell className="font-medium">
                      {linea.desc_trayecto_corta}
                    </TableCell>

                    {/* 6. tipo_viaje */}
                    <TableCell>
                      <Badge variant={getTipoViajeBadge(linea.tipo_viaje)}>
                        {linea.tipo_viaje}
                      </Badge>
                    </TableCell>

                    {/* 7. color */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: getColorCSS(linea.color) }}
                          title={linea.color}
                        />
                        <span className="text-xs font-mono">{linea.color}</span>
                      </div>
                    </TableCell>

                    {/* 8. code_trayecto_externo */}
                    <TableCell className="text-center">
                      {linea.code_trayecto_externo || (
                        <span className="text-muted-foreground">—</span>
                      )}
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
                          <DropdownMenuItem onClick={() => handleEdit(linea)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(linea.id_linea)}
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
            {filteredLineas.length === 0
              ? "0 of 0 row(s) selected."
              : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredLineas.length,
                )} de ${filteredLineas.length} registro(s)`}
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
      <EditLineaDialog
        linea={editLinea}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onLineaUpdated={loadLineas}
      />

      {/* ALERT DIALOG DE ELIMINACIÓN */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar línea?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la línea del sistema. Esta
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
