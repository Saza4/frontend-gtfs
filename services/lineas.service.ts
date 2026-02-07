import api from "@/lib/api";
import type {
  Linea,
  LineaCreate,
  LineaUpdate,
  LineaStats,
  ImportResponse,
} from "@/types/index-lineas";

/**
 * Servicio para consumir la API de Líneas
 * Backend: http://localhost:4000/api/lineas
 */
export const lineasService = {
  /**
   * GET /api/lineas
   * Obtener todas las líneas
   */
  getAll: async (): Promise<Linea[]> => {
    const response = await api.get<Linea[]>("/lineas");
    return response.data;
  },

  /**
   * GET /api/lineas/:id
   * Obtener una línea por ID
   */
  getById: async (id: number): Promise<Linea> => {
    const response = await api.get<Linea>(`/lineas/${id}`);
    return response.data;
  },

  /**
   * POST /api/lineas
   * Crear una nueva línea
   */
  create: async (data: LineaCreate): Promise<Linea> => {
    const response = await api.post<Linea>("/lineas", data);
    return response.data;
  },

  /**
   * PATCH /api/lineas/:id
   * Actualizar una línea existente
   */
  update: async (id: number, data: LineaUpdate): Promise<Linea> => {
    const response = await api.patch<Linea>(`/lineas/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /api/lineas/:id
   * Eliminar una línea
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/lineas/${id}`);
    return response.data;
  },

  /**
   * GET /api/lineas/search?q=query
   * Buscar líneas por descripción o código
   */
  search: async (query: string): Promise<Linea[]> => {
    const response = await api.get<Linea[]>(
      `/lineas/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  /**
   * GET /api/lineas/stats
   * Obtener estadísticas de líneas
   */
  getStats: async (): Promise<LineaStats> => {
    const response = await api.get<LineaStats>("/lineas/stats");
    return response.data;
  },

  /**
   * POST /api/lineas/import
   * Importar múltiples líneas
   */
  importMany: async (lineas: LineaCreate[]): Promise<ImportResponse> => {
    const response = await api.post<ImportResponse>("/lineas/import", lineas);
    return response.data;
  },
};
