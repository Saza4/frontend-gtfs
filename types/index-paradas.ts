// ============================================
// TIPOS PARA PARADAS
// ============================================

export interface Parada {
  id_parada: number;
  fecha_validez: string; // YYYY-MM-DD
  desc_parada: string;
  desc_parada_corta: string;
  latitud: number;
  longitud: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Tipo para crear (sin fechas automáticas)
export type ParadaCreate = Omit<
  Parada,
  "fecha_creacion" | "fecha_actualizacion"
>;

// Tipo para actualizar (campos opcionales)
export type ParadaUpdate = Partial<ParadaCreate>;

// Respuesta de estadísticas de paradas
export interface ParadaStats {
  total: number;
  porFechaValidez: Array<{
    fecha: string;
    cantidad: string;
  }>;
}

// Detalle de error en importación
export interface ImportErrorDetail {
  parada?: ParadaCreate;
  fila?: Record<string, string>;
  error: string;
}

// Respuesta de importación
export interface ImportResponse {
  importadas: number;
  errores: ImportErrorDetail[];
}

// ============================================
// TIPOS GENÉRICOS PARA APIS
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
