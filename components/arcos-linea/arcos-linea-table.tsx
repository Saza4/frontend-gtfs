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
import { toast } from "sonner";
import { arcosLineaService } from "@/services/arcos-linea.service";
import { ApiError } from "@/lib/api";
import type { ArcosLinea } from "@/types/index-arcos-linea";
import { EditArcosLineaDialog } from "./edit-arcos-linea-dialog";
import { CreateArcosLineaDialog } from "./create-arcos-linea-dialog";

export function ArcosLineaTable() {
  const [arcos, setArcos] = useState<ArcosLinea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedArco, setSelectedArco] = useState<ArcosLinea | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const loadArcos = async () => {
    setLoading(true);
    try {
      const data = await arcosLineaService.getAll();
      setArcos(data || []);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Error al cargar los arcos de línea");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArcos();
  }, []);

  const filteredData = arcos.filter(
    (item) =>
      item.id_arco_linea.toString().includes(searchTerm) ||
      item.desc_linea_corta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc_trayecto_corta
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.code_arco.toString().includes(searchTerm) ||
      item.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destino.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleDeleteClick = (id: number) => {
    setIdToDelete(id);
    setDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (idToDelete === null) return;
    try {
      await arcosLineaService.delete(idToDelete);
      toast.success("Registro eliminado correctamente");
      loadArcos();
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setDeleteAlertOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            {/* Buscador */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar registros..."
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
              onClick={loadArcos}
              title="Recargar datos"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Botón Crear */}
          <CreateArcosLineaDialog onSuccess={loadArcos} />
        </div>

        {/* Eliminamos 'bg-white' para que use el fondo del tema (card/background) */}
        <div className="rounded-md border shadow-sm overflow-x-auto">
          <Table>
            {/* Cambiamos 'bg-slate-50/50' por 'bg-muted/50' para compatibilidad con modo oscuro */}
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Línea</TableHead>
                <TableHead className="font-semibold">Trayecto</TableHead>
                <TableHead className="font-semibold">Sentido</TableHead>
                <TableHead className="font-semibold">Secuencia</TableHead>
                <TableHead className="font-semibold">Cód. Arco</TableHead>
                <TableHead className="font-semibold">Validez</TableHead>
                <TableHead className="font-semibold">Origen</TableHead>
                <TableHead className="font-semibold">Destino</TableHead>
                <TableHead className="font-semibold text-right">
                  Metros
                </TableHead>
                {/* Cambiado w-[70px] por w-17.5 según sugerencia de Tailwind */}
                <TableHead className="w-17.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    Cargando registros...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  // Cambiado bg-slate-50/50 por bg-muted/30 para el hover
                  <TableRow
                    key={item.id_arco_linea}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {item.id_arco_linea}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.desc_linea_corta}
                    </TableCell>
                    <TableCell>{item.desc_trayecto_corta}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.sentido === 0 ? "default" : "secondary"}
                      >
                        {item.sentido === 0 ? "Ida" : "Regreso"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.secuencia}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.code_arco}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {item.fecha_validez}
                    </TableCell>
                    {/* Cambiado max-w-[150px] por max-w-37.5 */}
                    <TableCell
                      className="max-w-37.5 truncate text-xs"
                      title={item.origen}
                    >
                      {item.origen}
                    </TableCell>
                    {/* Cambiado max-w-[150px] por max-w-37.5 */}
                    <TableCell
                      className="max-w-37.5 truncate text-xs"
                      title={item.destino}
                    >
                      {item.destino}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {Number(item.metros_reales).toLocaleString()}m
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedArco(item);
                              setEditOpen(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() =>
                              handleDeleteClick(item.id_arco_linea)
                            }
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
          <div className="text-sm text-muted-foreground font-medium">
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
            <div className="text-sm font-semibold px-2">
              Página {currentPage} de {totalPages || 1}
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
      </div>

      <EditArcosLineaDialog
        arco={selectedArco}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={loadArcos}
      />

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el arco #{idToDelete} de la
              base de datos.
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
