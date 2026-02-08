"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
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
import { datosArcoService } from "@/services/datos-arco.service";
import { ApiError } from "@/lib/api";
import type { DatosArco } from "@/types/index-datos-arco";
import {
  calcularDiferencia,
  formatearDiferencia,
  getBadgeVariantDiferencia,
  formatearDistancia,
} from "@/lib/datos-arco-utils";
import { CreateDatosArcoDialog } from "./create-datos-arco-dialog";
import { EditDatosArcoDialog } from "./edit-datos-arco-dialog";

export function DatosArcoTable() {
  const [datosArco, setDatosArco] = useState<DatosArco[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estado para modales
  const [editDato, setEditDato] = useState<DatosArco | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Estado para Alert Dialog de eliminación
  const [deleteDatoId, setDeleteDatoId] = useState<number | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    loadDatosArco();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Cargar todos los datos de arco del backend
   */
  const loadDatosArco = async () => {
    try {
      setLoading(true);
      const data = await datosArcoService.getAll();
      setDatosArco(data);
      toast.success(
        `${data.length.toLocaleString("es-MX")} arcos cargados exitosamente`,
      );
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al cargar datos de arco");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrar datos de arco según búsqueda
   */
  const filteredDatos = datosArco.filter((dato) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      dato.desc_arco.toLowerCase().includes(searchLower) ||
      dato.origen.toLowerCase().includes(searchLower) ||
      dato.destino.toLowerCase().includes(searchLower) ||
      dato.id_arco.toString().includes(searchQuery)
    );
  });

  /**
   * Paginación
   */
  const totalPages = Math.ceil(filteredDatos.length / itemsPerPage);
  const paginatedDatos = filteredDatos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /**
   * Manejar edición de dato de arco
   */
  const handleEdit = (dato: DatosArco) => {
    setEditDato(dato);
    setEditDialogOpen(true);
  };

  /**
   * Abrir Alert Dialog para confirmar eliminación
   */
  const handleDeleteClick = (id: number) => {
    setDeleteDatoId(id);
    setDeleteAlertOpen(true);
  };

  /**
   * Confirmar eliminación de dato de arco
   */
  const confirmDelete = async () => {
    if (deleteDatoId === null) return;

    try {
      await datosArcoService.delete(deleteDatoId);
      setDatosArco(datosArco.filter((d) => d.id_datos_arco !== deleteDatoId));
      toast.success("Datos de arco eliminados exitosamente");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al eliminar datos de arco");
      }
    } finally {
      setDeleteAlertOpen(false);
      setDeleteDatoId(null);
    }
  };

  /**
   * Formatear fecha
   */
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-MX");
  };

  /**
   * Renderizar icono de diferencia
   */
  const renderDiferenciaIcon = (diferencia: number) => {
    if (diferencia > 0)
      return <TrendingUp className="h-3 w-3 text-orange-500" />;
    if (diferencia < 0)
      return <TrendingDown className="h-3 w-3 text-blue-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
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
            Cargando datos de arco...
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
                placeholder="Buscar por descripción, origen, destino, ID..."
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
              onClick={loadDatosArco}
              title="Recargar datos"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Botón Crear Nuevos Datos */}
          <CreateDatosArcoDialog onDatoCreated={loadDatosArco} />
        </div>

        {/* TABLA - ORDEN DE LA BASE DE DATOS */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {/* 1. id_datos_arco */}
                <TableHead className="w-[80px]">ID</TableHead>

                {/* 2. id_arco */}
                <TableHead className="w-[100px]">Arco</TableHead>

                {/* 3. desc_arco */}
                <TableHead>Descripción</TableHead>

                {/* 4. origen */}
                <TableHead>Origen</TableHead>

                {/* 5. destino */}
                <TableHead>Destino</TableHead>

                {/* 6. fecha_validez */}
                <TableHead className="w-[110px]">Fecha Validez</TableHead>

                {/* 7. metros_teoricos */}
                <TableHead className="w-[110px] text-right">
                  M. Teóricos
                </TableHead>

                {/* 8. metros_mapa */}
                <TableHead className="w-[110px] text-right">M. Mapa</TableHead>

                {/* Diferencia */}
                <TableHead className="w-[120px] text-center">
                  Diferencia
                </TableHead>

                {/* Acciones */}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDatos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchQuery
                      ? "No se encontraron registros con los filtros aplicados"
                      : "No hay datos de arco registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDatos.map((dato) => {
                  const diferencia = calcularDiferencia(
                    dato.metros_teoricos,
                    dato.metros_mapa,
                  );

                  return (
                    <TableRow key={dato.id_datos_arco}>
                      {/* 1. id_datos_arco */}
                      <TableCell className="font-medium">
                        <Badge variant="outline">{dato.id_datos_arco}</Badge>
                      </TableCell>

                      {/* 2. id_arco */}
                      <TableCell>
                        <Badge variant="secondary">{dato.id_arco}</Badge>
                      </TableCell>

                      {/* 3. desc_arco */}
                      <TableCell
                        className="max-w-[200px] truncate font-mono text-sm"
                        title={dato.desc_arco}
                      >
                        {dato.desc_arco}
                      </TableCell>

                      {/* 4. origen */}
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={dato.origen}
                      >
                        {dato.origen}
                      </TableCell>

                      {/* 5. destino */}
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={dato.destino}
                      >
                        <div className="flex items-center gap-1">
                          <span className="truncate">{dato.destino}</span>
                        </div>
                      </TableCell>

                      {/* 6. fecha_validez */}
                      <TableCell>
                        <Badge variant="outline">
                          {formatFecha(dato.fecha_validez)}
                        </Badge>
                      </TableCell>

                      {/* 7. metros_teoricos */}
                      <TableCell className="text-right font-mono text-sm">
                        {formatearDistancia(dato.metros_teoricos)}
                      </TableCell>

                      {/* 8. metros_mapa */}
                      <TableCell className="text-right font-mono text-sm">
                        {formatearDistancia(dato.metros_mapa)}
                      </TableCell>

                      {/* Diferencia */}
                      <TableCell className="text-center">
                        <Badge
                          variant={getBadgeVariantDiferencia(
                            diferencia.porcentual,
                          )}
                          className="gap-1 font-mono text-xs"
                        >
                          {renderDiferenciaIcon(diferencia.absoluta)}
                          {formatearDiferencia(diferencia)}
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
                            <DropdownMenuItem onClick={() => handleEdit(dato)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteClick(dato.id_datos_arco)
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {filteredDatos.length === 0
              ? "0 of 0 row(s) selected."
              : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredDatos.length,
                )} de ${filteredDatos.length.toLocaleString("es-MX")} registro(s)`}
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
      <EditDatosArcoDialog
        dato={editDato}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onDatoUpdated={loadDatosArco}
      />

      {/* ALERT DIALOG DE ELIMINACIÓN */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar datos de arco?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente los datos del arco del
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
