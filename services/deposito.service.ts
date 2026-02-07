import api from "@/lib/api";
import type {
  Deposito,
  DepositoCreate,
  DepositoUpdate,
  DepositoStats,
  ImportResponse,
} from "@/types/index-deposito";

/**
 * Servicio para consumir la API de Depósito
 * Backend: http://localhost:4000/api/deposito
 */
export const depositoService = {
  /**
   * GET /api/deposito
   * Obtener todos los depósitos
   */
  getAll: async (): Promise<Deposito[]> => {
    const response = await api.get<Deposito[]>("/deposito");
    return response.data;
  },

  /**
   * GET /api/deposito/:id
   * Obtener un depósito por ID
   */
  getById: async (id: number): Promise<Deposito> => {
    const response = await api.get<Deposito>(`/deposito/${id}`);
    return response.data;
  },

  /**
   * POST /api/deposito
   * Crear un nuevo depósito
   */
  create: async (data: DepositoCreate): Promise<Deposito> => {
    const response = await api.post<Deposito>("/deposito", data);
    return response.data;
  },

  /**
   * PATCH /api/deposito/:id
   * Actualizar un depósito existente
   */
  update: async (id: number, data: DepositoUpdate): Promise<Deposito> => {
    const response = await api.patch<Deposito>(`/deposito/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /api/deposito/:id
   * Eliminar un depósito
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/deposito/${id}`);
    return response.data;
  },

  /**
   * GET /api/deposito/search?q=query
   * Buscar depósitos por descripción
   */
  search: async (query: string): Promise<Deposito[]> => {
    const response = await api.get<Deposito[]>(
      `/deposito/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  /**
   * GET /api/deposito/stats
   * Obtener estadísticas de depósitos
   */
  getStats: async (): Promise<DepositoStats> => {
    const response = await api.get<DepositoStats>("/deposito/stats");
    return response.data;
  },

  /**
   * GET /api/deposito/by-fecha?fecha=YYYY-MM-DD
   * Obtener depósitos por fecha de validez
   */
  getByFecha: async (fecha: string): Promise<Deposito[]> => {
    const response = await api.get<Deposito[]>(
      `/deposito/by-fecha?fecha=${fecha}`,
    );
    return response.data;
  },

  /**
   * POST /api/deposito/import
   * Importar múltiples depósitos
   */
  importMany: async (depositos: DepositoCreate[]): Promise<ImportResponse> => {
    const response = await api.post<ImportResponse>(
      "/deposito/import",
      depositos,
    );
    return response.data;
  },
};
