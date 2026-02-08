import api from "@/lib/api";
import type {
  PuntoCarga,
  PuntoCargaCreate,
  PuntoCargaUpdate,
  PuntoCargaStats,
  HorarioDisponible,
  ImportResponse,
} from "@/types/index-puntos-carga";

/**
 * Servicio para consumir la API de Puntos de Carga
 * Backend: http://localhost:4000/api/puntos-carga
 */
export const puntosCargaService = {
  /**
   * GET /api/puntos-carga
   * Obtener todos los puntos de carga
   */
  getAll: async (): Promise<PuntoCarga[]> => {
    const response = await api.get<PuntoCarga[]>("/puntos-carga");
    return response.data;
  },

  /**
   * GET /api/puntos-carga/:id
   * Obtener un punto de carga por ID
   */
  getById: async (id: number): Promise<PuntoCarga> => {
    const response = await api.get<PuntoCarga>(`/puntos-carga/${id}`);
    return response.data;
  },

  /**
   * POST /api/puntos-carga
   * Crear un nuevo punto de carga
   */
  create: async (data: PuntoCargaCreate): Promise<PuntoCarga> => {
    const response = await api.post<PuntoCarga>("/puntos-carga", data);
    return response.data;
  },

  /**
   * PATCH /api/puntos-carga/:id
   * Actualizar un punto de carga existente
   */
  update: async (id: number, data: PuntoCargaUpdate): Promise<PuntoCarga> => {
    const response = await api.patch<PuntoCarga>(`/puntos-carga/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /api/puntos-carga/:id
   * Eliminar un punto de carga
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/puntos-carga/${id}`,
    );
    return response.data;
  },

  /**
   * GET /api/puntos-carga/search?q=query
   * Buscar puntos de carga
   */
  search: async (query: string): Promise<PuntoCarga[]> => {
    const response = await api.get<PuntoCarga[]>(
      `/puntos-carga/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  /**
   * GET /api/puntos-carga/stats
   * Obtener estadísticas de puntos de carga
   */
  getStats: async (): Promise<PuntoCargaStats> => {
    const response = await api.get<PuntoCargaStats>("/puntos-carga/stats");
    return response.data;
  },

  /**
   * GET /api/puntos-carga/by-punto-recarga/:id
   * Obtener puntos por ID de punto de recarga
   */
  getByPuntoRecarga: async (id: number): Promise<PuntoCarga[]> => {
    const response = await api.get<PuntoCarga[]>(
      `/puntos-carga/by-punto-recarga/${id}`,
    );
    return response.data;
  },

  /**
   * GET /api/puntos-carga/horarios/:id
   * Obtener horarios disponibles para un punto de recarga
   */
  getHorarios: async (id: number): Promise<HorarioDisponible[]> => {
    const response = await api.get<HorarioDisponible[]>(
      `/puntos-carga/horarios/${id}`,
    );
    return response.data;
  },

  /**
   * GET /api/puntos-carga/by-tipo-bus?tipo=IETRAM
   * Obtener puntos por tipo de autobús
   */
  getByTipoBus: async (tipo: string): Promise<PuntoCarga[]> => {
    const response = await api.get<PuntoCarga[]>(
      `/puntos-carga/by-tipo-bus?tipo=${encodeURIComponent(tipo)}`,
    );
    return response.data;
  },

  /**
   * GET /api/puntos-carga/by-carga?min=80&max=100
   * Obtener puntos por rango de carga máxima
   */
  getByCargaMaxima: async (min: number, max: number): Promise<PuntoCarga[]> => {
    const response = await api.get<PuntoCarga[]>(
      `/puntos-carga/by-carga?min=${min}&max=${max}`,
    );
    return response.data;
  },

  /**
   * POST /api/puntos-carga/import
   * Importar múltiples puntos de carga
   */
  importMany: async (
    puntosCarga: PuntoCargaCreate[],
  ): Promise<ImportResponse> => {
    const response = await api.post<ImportResponse>(
      "/puntos-carga/import",
      puntosCarga,
    );
    return response.data;
  },
};
