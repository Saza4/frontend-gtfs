"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  const itemsPerPage = 10;

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
      className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${active ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground opacity-40"}`}
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
              placeholder="Buscar por trayecto, parada..."
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

      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50 text-xs uppercase tracking-wider">
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead className="w-25">Trayecto</TableHead>
              <TableHead className="text-center w-20">Sentido</TableHead>
              <TableHead>Descripción Parada</TableHead>
              <TableHead className="w-37.5">
                Funciones (R R E S D I R)
              </TableHead>
              <TableHead className="w-17.5 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center italic">
                  Cargando paradas...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center italic">
                  No hay resultados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow
                  key={item.id_parada_regularizacion}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.id_parada_regularizacion}
                  </TableCell>
                  <TableCell className="font-bold">
                    {item.desc_trayecto_corta}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={item.sentido === 0 ? "default" : "secondary"}
                      className="text-[10px] h-5"
                    >
                      {item.sentido === 0 ? "IDA" : "REG"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="max-w-62.5 truncate text-xs font-medium"
                    title={item.desc_parada}
                  >
                    {item.desc_parada}
                  </TableCell>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedParada(item);
                            setEditOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setIdToDelete(item.id_parada_regularizacion);
                            setDeleteAlertOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
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

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-xs font-bold text-muted-foreground uppercase">
          Mostrando {paginatedData.length} de{" "}
          {filteredData.length.toLocaleString()} registros
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || totalPages === 0}
          >
            ««
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || totalPages === 0}
          >
            Anterior
          </Button>
          <div className="text-sm font-black px-2">
            Página {currentPage} / {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Siguiente
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            »»
          </Button>
        </div>
      </div>

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
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
