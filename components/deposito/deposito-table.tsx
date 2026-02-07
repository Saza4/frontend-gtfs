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
import { depositoService } from "@/services/deposito.service";
import { ApiError } from "@/lib/api";
import type { Deposito } from "@/types/index-deposito";
import { CreateDepositoDialog } from "./create-deposito-dialog";
import { EditDepositoDialog } from "./edit-deposito-dialog";

export function DepositoTable() {
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estado para modales
  const [editDeposito, setEditDeposito] = useState<Deposito | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Estado para Alert Dialog de eliminación
  const [deleteDepositoId, setDeleteDepositoId] = useState<number | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    loadDepositos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Cargar todos los depósitos del backend
   */
  const loadDepositos = async () => {
    try {
      setLoading(true);
      const data = await depositoService.getAll();
      setDepositos(data);
      toast.success(`${data.length} depósitos cargados exitosamente`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al cargar depósitos");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrar depósitos según búsqueda
   */
  const filteredDepositos = depositos.filter((deposito) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      deposito.desc_parada.toLowerCase().includes(searchLower) ||
      deposito.desc_parada_corta.toLowerCase().includes(searchLower)
    );
  });

  /**
   * Paginación
   */
  const totalPages = Math.ceil(filteredDepositos.length / itemsPerPage);
  const paginatedDepositos = filteredDepositos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /**
   * Manejar edición de depósito
   */
  const handleEdit = (deposito: Deposito) => {
    setEditDeposito(deposito);
    setEditDialogOpen(true);
  };

  /**
   * Abrir Alert Dialog para confirmar eliminación
   */
  const handleDeleteClick = (id: number) => {
    setDeleteDepositoId(id);
    setDeleteAlertOpen(true);
  };

  /**
   * Confirmar eliminación de depósito
   */
  const confirmDelete = async () => {
    if (deleteDepositoId === null) return;

    try {
      await depositoService.delete(deleteDepositoId);
      setDepositos(depositos.filter((d) => d.id_deposito !== deleteDepositoId));
      toast.success("Depósito eliminado exitosamente");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al eliminar depósito");
      }
    } finally {
      setDeleteAlertOpen(false);
      setDeleteDepositoId(null);
    }
  };

  /**
   * Formatear fecha
   */
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-MX");
  };

  /**
   * Formatear moneda
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  /**
   * Pantalla de carga
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cargando depósitos...</p>
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
                placeholder="Buscar por descripción..."
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
              onClick={loadDepositos}
              title="Recargar datos"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Botón Crear Nuevo Depósito */}
          <CreateDepositoDialog onDepositoCreated={loadDepositos} />
        </div>

        {/* TABLA - ORDEN DE LA BASE DE DATOS */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {/* 1. id_deposito */}
                <TableHead className="w-[100px]">ID Depósito</TableHead>

                {/* 2. desc_parada */}
                <TableHead>Descripción Parada</TableHead>

                {/* 3. desc_parada_corta */}
                <TableHead className="w-[150px]">Desc. Parada Corta</TableHead>

                {/* 4. fecha_validez */}
                <TableHead className="w-[120px]">Fecha Validez</TableHead>

                {/* 5. servicios_llegan */}
                <TableHead className="w-[120px] text-right">
                  Serv. Llegan
                </TableHead>

                {/* 6. servicios_salen */}
                <TableHead className="w-[120px] text-right">
                  Serv. Salen
                </TableHead>

                {/* 7. costo_relevo_obj */}
                <TableHead className="w-[130px] text-right">
                  Costo Relevo Obj
                </TableHead>

                {/* 8. costo_relevo_real */}
                <TableHead className="w-[130px] text-right">
                  Costo Relevo Real
                </TableHead>

                {/* Acciones */}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDepositos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchQuery
                      ? "No se encontraron registros con los filtros aplicados"
                      : "No hay depósitos registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDepositos.map((deposito) => (
                  <TableRow key={deposito.id_deposito}>
                    {/* 1. id_deposito */}
                    <TableCell className="font-medium">
                      <Badge variant="outline">{deposito.id_deposito}</Badge>
                    </TableCell>

                    {/* 2. desc_parada */}
                    <TableCell
                      className="max-w-[250px] truncate"
                      title={deposito.desc_parada}
                    >
                      {deposito.desc_parada}
                    </TableCell>

                    {/* 3. desc_parada_corta */}
                    <TableCell className="font-medium">
                      {deposito.desc_parada_corta}
                    </TableCell>

                    {/* 4. fecha_validez */}
                    <TableCell>
                      <Badge variant="secondary">
                        {formatFecha(deposito.fecha_validez)}
                      </Badge>
                    </TableCell>

                    {/* 5. servicios_llegan */}
                    <TableCell className="text-right font-mono">
                      {deposito.servicios_llegan.toLocaleString("es-MX")}
                    </TableCell>

                    {/* 6. servicios_salen */}
                    <TableCell className="text-right font-mono">
                      {deposito.servicios_salen.toLocaleString("es-MX")}
                    </TableCell>

                    {/* 7. costo_relevo_obj */}
                    <TableCell className="text-right font-mono text-sm">
                      {formatCurrency(deposito.costo_relevo_obj)}
                    </TableCell>

                    {/* 8. costo_relevo_real */}
                    <TableCell className="text-right font-mono text-sm">
                      {formatCurrency(deposito.costo_relevo_real)}
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
                          <DropdownMenuItem
                            onClick={() => handleEdit(deposito)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteClick(deposito.id_deposito)
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
            {filteredDepositos.length === 0
              ? "0 of 0 row(s) selected."
              : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredDepositos.length,
                )} de ${filteredDepositos.length} registro(s)`}
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
      <EditDepositoDialog
        deposito={editDeposito}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onDepositoUpdated={loadDepositos}
      />

      {/* ALERT DIALOG DE ELIMINACIÓN */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar depósito?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el depósito del sistema.
              Esta acción no se puede deshacer.
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
