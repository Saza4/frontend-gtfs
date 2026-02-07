import api from "@/lib/api";
import type {
  Parada,
  ParadaCreate,
  ParadaUpdate,
  ParadaStats,
  ImportResponse,
} from "@/types/index-paradas";

/**
 * Servicio para consumir la API de Paradas
 * Backend: http://localhost:4000/api/paradas
 */
export const paradasService = {
  /**
   * GET /api/paradas
   * Obtener todas las paradas
   */
  getAll: async (): Promise<Parada[]> => {
    const response = await api.get<Parada[]>("/paradas");
    return response.data;
  },

  /**
   * GET /api/paradas/:id
   * Obtener una parada por ID
   */
  getById: async (id: number): Promise<Parada> => {
    const response = await api.get<Parada>(`/paradas/${id}`);
    return response.data;
  },

  /**
   * POST /api/paradas
   * Crear una nueva parada
   */
  create: async (data: ParadaCreate): Promise<Parada> => {
    const response = await api.post<Parada>("/paradas", data);
    return response.data;
  },

  /**
   * PATCH /api/paradas/:id
   * Actualizar una parada existente
   */
  update: async (id: number, data: ParadaUpdate): Promise<Parada> => {
    const response = await api.patch<Parada>(`/paradas/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /api/paradas/:id
   * Eliminar una parada
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/paradas/${id}`);
    return response.data;
  },

  /**
   * GET /api/paradas/search?q=query
   * Buscar paradas por descripción
   */
  search: async (query: string): Promise<Parada[]> => {
    const response = await api.get<Parada[]>(
      `/paradas/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  /**
   * GET /api/paradas/nearby?lat=20.97&lon=-89.62&radius=1
   * Buscar paradas cercanas a una ubicación
   */
  getNearby: async (
    lat: number,
    lon: number,
    radius: number = 1,
  ): Promise<Parada[]> => {
    const response = await api.get<Parada[]>(
      `/paradas/nearby?lat=${lat}&lon=${lon}&radius=${radius}`,
    );
    return response.data;
  },

  /**
   * GET /api/paradas/stats
   * Obtener estadísticas de paradas
   */
  getStats: async (): Promise<ParadaStats> => {
    const response = await api.get<ParadaStats>("/paradas/stats");
    return response.data;
  },

  /**
   * POST /api/paradas/import
   * Importar múltiples paradas
   */
  importMany: async (paradas: ParadaCreate[]): Promise<ImportResponse> => {
    const response = await api.post<ImportResponse>("/paradas/import", paradas);
    return response.data;
  },
};
