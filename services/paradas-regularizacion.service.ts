import api from "@/lib/api";
import type {
  ParadasRegularizacion,
  ParadaRegularizacionCreate,
  ParadaRegularizacionUpdate,
  ParadasRegularizacionStats,
} from "@/types/index-paradas-regularizacion";

export const paradasRegularizacionService = {
  getAll: async (): Promise<ParadasRegularizacion[]> => {
    const response = await api.get<ParadasRegularizacion[]>(
      "/paradas-regularizacion",
    );
    return response.data;
  },

  getStats: async (): Promise<ParadasRegularizacionStats> => {
    const response = await api.get<ParadasRegularizacionStats>(
      "/paradas-regularizacion/stats",
    );
    return response.data;
  },

  create: async (
    data: ParadaRegularizacionCreate,
  ): Promise<ParadasRegularizacion> => {
    const response = await api.post<ParadasRegularizacion>(
      "/paradas-regularizacion",
      data,
    );
    return response.data;
  },

  update: async (
    id: number,
    data: ParadaRegularizacionUpdate,
  ): Promise<ParadasRegularizacion> => {
    const response = await api.patch<ParadasRegularizacion>(
      `/paradas-regularizacion/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/paradas-regularizacion/${id}`);
  },

  search: async (query: string): Promise<ParadasRegularizacion[]> => {
    const response = await api.get<ParadasRegularizacion[]>(
      `/paradas-regularizacion/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },
};
