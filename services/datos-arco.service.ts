import api from "@/lib/api";
import type {
  DatosArco,
  DatosArcoCreate,
  DatosArcoUpdate,
  DatosArcoStats,
  ImportResponse,
} from "@/types/index-datos-arco";

/**
 * Servicio para consumir la API de Datos del Arco
 * Backend: http://localhost:4000/api/datos-arco
 */
export const datosArcoService = {
  /**
   * GET /api/datos-arco
   * Obtener todos los datos de arco
   */
  getAll: async (): Promise<DatosArco[]> => {
    const response = await api.get<DatosArco[]>("/datos-arco");
    return response.data;
  },

  /**
   * GET /api/datos-arco/:id
   * Obtener datos de arco por ID
   */
  getById: async (id: number): Promise<DatosArco> => {
    const response = await api.get<DatosArco>(`/datos-arco/${id}`);
    return response.data;
  },

  /**
   * POST /api/datos-arco
   * Crear nuevos datos de arco
   */
  create: async (data: DatosArcoCreate): Promise<DatosArco> => {
    const response = await api.post<DatosArco>("/datos-arco", data);
    return response.data;
  },

  /**
   * PATCH /api/datos-arco/:id
   * Actualizar datos de arco existentes
   */
  update: async (id: number, data: DatosArcoUpdate): Promise<DatosArco> => {
    const response = await api.patch<DatosArco>(`/datos-arco/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /api/datos-arco/:id
   * Eliminar datos de arco
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/datos-arco/${id}`);
    return response.data;
  },

  /**
   * GET /api/datos-arco/search?q=query
   * Buscar datos de arco por descripción, origen o destino
   */
  search: async (query: string): Promise<DatosArco[]> => {
    const response = await api.get<DatosArco[]>(
      `/datos-arco/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  /**
   * GET /api/datos-arco/stats
   * Obtener estadísticas de datos de arco
   */
  getStats: async (): Promise<DatosArcoStats> => {
    const response = await api.get<DatosArcoStats>("/datos-arco/stats");
    return response.data;
  },

  /**
   * GET /api/datos-arco/by-arco/:idArco
   * Obtener todos los registros de un arco específico
   */
  getByIdArco: async (idArco: number): Promise<DatosArco[]> => {
    const response = await api.get<DatosArco[]>(
      `/datos-arco/by-arco/${idArco}`,
    );
    return response.data;
  },

  /**
   * GET /api/datos-arco/by-fecha?fecha=YYYY-MM-DD
   * Obtener datos de arco por fecha de validez
   */
  getByFecha: async (fecha: string): Promise<DatosArco[]> => {
    const response = await api.get<DatosArco[]>(
      `/datos-arco/by-fecha?fecha=${fecha}`,
    );
    return response.data;
  },

  /**
   * GET /api/datos-arco/discrepancias?porcentaje=10
   * Obtener arcos con diferencias entre metros teóricos y mapa
   */
  getDiscrepancias: async (porcentaje: number = 10): Promise<DatosArco[]> => {
    const response = await api.get<DatosArco[]>(
      `/datos-arco/discrepancias?porcentaje=${porcentaje}`,
    );
    return response.data;
  },

  /**
   * POST /api/datos-arco/import
   * Importar múltiples datos de arco
   */
  importMany: async (datosArco: DatosArcoCreate[]): Promise<ImportResponse> => {
    const response = await api.post<ImportResponse>(
      "/datos-arco/import",
      datosArco,
    );
    return response.data;
  },
};
