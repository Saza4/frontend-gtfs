import api from "@/lib/api";
import type {
  ArcosLinea,
  ArcosLineaCreate,
  ArcosLineaUpdate,
  ArcosLineaStats,
} from "@/types/index-arcos-linea";

export const arcosLineaService = {
  getAll: async (): Promise<ArcosLinea[]> => {
    const response = await api.get<ArcosLinea[]>("/arcos-linea");
    return response.data;
  },

  getStats: async (): Promise<ArcosLineaStats> => {
    // URL corregida según tu backend: /api/arcos-linea/stats
    const response = await api.get<ArcosLineaStats>("/arcos-linea/stats");
    return response.data;
  },

  create: async (data: ArcosLineaCreate): Promise<ArcosLinea> => {
    const response = await api.post<ArcosLinea>("/arcos-linea", data);
    return response.data;
  },

  update: async (id: number, data: ArcosLineaUpdate): Promise<ArcosLinea> => {
    const response = await api.patch<ArcosLinea>(`/arcos-linea/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/arcos-linea/${id}`,
    );
    return response.data;
  },

  search: async (query: string): Promise<ArcosLinea[]> => {
    const response = await api.get<ArcosLinea[]>(
      `/arcos-linea/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },
};
