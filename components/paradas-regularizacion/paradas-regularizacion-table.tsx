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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import { paradasRegularizacionService } from "@/services/paradas-regularizacion.service";
import { ApiError } from "@/lib/api";
import type { ParadasRegularizacion } from "@/types/index-paradas-regularizacion";
import { EditParadasRegularizacionDialog } from "./edit-paradas-regularizacion-dialog";
import { CreateParadasRegularizacionDialog } from "./create-paradas-regularizacion-dialog";

export function ParadasRegularizacionTable() {
  const [data, setData] = useState<ParadasRegularizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedParada, setSelectedParada] =
    useState<ParadasRegularizacion | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await paradasRegularizacionService.getAll();
      setData(res || []);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.desc_trayecto_corta
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.desc_parada.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.periodicidad.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const confirmDelete = async () => {
    if (idToDelete === null) return;
    try {
      await paradasRegularizacionService.delete(idToDelete);
      toast.success("Parada eliminada");
      loadData();
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setDeleteAlertOpen(false);
    }
  };

  // Helper para renderizar los indicadores de función
  const FunctionDot = ({
    active,
    label,
  }: {
    active: boolean;
    label: string;
  }) => (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted text-muted-foreground opacity-40"
      }`}
      title={label}
    >
      {label[0]}
    </span>
  );

  return (
    <div className="space-y-4">
      {/* HEADER: Buscador + Botón Crear */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          {/* Buscador */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por trayecto, parada, periodicidad..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Botón Recargar */}
          <Button
            variant="outline"
            size="icon"
            onClick={loadData}
            disabled={loading}
            title="Recargar datos"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Botón Crear Nueva Parada */}
        <CreateParadasRegularizacionDialog onSuccess={loadData} />
      </div>

      {/* TABLA */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">ID</TableHead>
              <TableHead>Trayecto</TableHead>
              <TableHead className="text-center w-20">Sentido</TableHead>
              <TableHead>Fecha de validez</TableHead>
              <TableHead>Periodicidad</TableHead>
              <TableHead>Descripción Parada</TableHead>
              <TableHead className="w-50">Funciones</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchTerm
                    ? "No se encontraron registros con los filtros aplicados"
                    : "No hay paradas de regularización registradas"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow
                  key={item.id_parada_regularizacion}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* ID */}
                  <TableCell className="font-medium">
                    <Badge variant="outline">
                      PR-{item.id_parada_regularizacion}
                    </Badge>
                  </TableCell>

                  {/* Trayecto */}
                  <TableCell className="font-bold">
                    {item.desc_trayecto_corta}
                  </TableCell>

                  {/* Sentido */}
                  <TableCell className="text-center">
                    <Badge
                      variant={item.sentido === 0 ? "default" : "secondary"}
                      className="text-[10px] h-5"
                    >
                      {item.sentido === 0 ? "IDA" : "REG"}
                    </Badge>
                  </TableCell>

                  {/* Fecha de Validez */}
                  <TableCell>
                    <Badge variant="secondary">
                      {new Date(
                        item.fecha_validez + "T00:00:00",
                      ).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </Badge>
                  </TableCell>

                  {/* Periodicidad */}
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {item.periodicidad}
                    </Badge>
                  </TableCell>

                  {/* Descripción Parada */}
                  <TableCell
                    className="max-w-75 truncate"
                    title={item.desc_parada}
                  >
                    {item.desc_parada}
                  </TableCell>

                  {/* Funciones */}
                  <TableCell>
                    <div className="flex gap-1">
                      <FunctionDot active={item.regula} label="Regula" />
                      <FunctionDot active={item.releva} label="Releva" />
                      <FunctionDot active={item.entran} label="Entran" />
                      <FunctionDot active={item.salen} label="Salen" />
                      <FunctionDot active={item.descansa} label="Descansa" />
                      <FunctionDot active={item.informes} label="Informes" />
                      <FunctionDot active={item.relevante} label="Relevante" />
                    </div>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedParada(item);
                            setEditOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setIdToDelete(item.id_parada_regularizacion);
                            setDeleteAlertOpen(true);
                          }}
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
          {filteredData.length === 0
            ? "0 of 0 row(s) selected."
            : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                filteredData.length,
              )} de ${filteredData.length} registro(s)`}
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

      {/* Dialogs */}
      <EditParadasRegularizacionDialog
        parada={selectedParada}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={loadData}
      />
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La parada de regularización será
              eliminada permanentemente.
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
    </div>
  );
}
