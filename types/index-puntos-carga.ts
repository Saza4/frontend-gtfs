// ============================================
// TIPOS PARA PUNTOS DE CARGA
// ============================================

export interface PuntoCarga {
  id_registro: number;
  id_punto_recarga: number;
  desc_sitio: string;
  desc_sitio_corta: string;
  desc_bus: string;
  desc_bus_corta: string;
  fecha_desde: string; // "HH:MM"
  fecha_hasta: string; // "HH:MM"
  costo_real: number;
  funcion_objetivo: number;
  costo_real_kwh: number;
  funcion_objetivo_kwh: number;
  carga_max_porc: number; // 0-100
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Tipo para crear (sin fechas automáticas y sin ID de registro)
export type PuntoCargaCreate = Omit<
  PuntoCarga,
  "id_registro" | "fecha_creacion" | "fecha_actualizacion"
>;

// Tipo para actualizar (campos opcionales)
export type PuntoCargaUpdate = Partial<PuntoCargaCreate>;

// Respuesta de estadísticas
export interface PuntoCargaStats {
  total: number;
  puntosRecargaUnicos: number;
  tiposBusUnicos: number;
  promedioCargaMaxima: number;
  porTipoBus: Array<{
    tipo_bus: string;
    cantidad: string;
  }>;
  porPuntoRecarga: Array<{
    id_punto: number;
    sitio: string;
    cantidad: string;
  }>;
  distribucionCarga: Array<{
    porcentaje: number;
    cantidad: string;
  }>;
  costosTotales: {
    costoReal: number;
    funcionObjetivo: number;
    costoRealKwh: number;
    funcionObjetivoKwh: number;
  };
}

// Horario disponible
export interface HorarioDisponible {
  id_registro: number;
  desde: string;
  hasta: string;
  bus: string;
  carga_max: number;
}

// Detalle de error en importación
export interface ImportErrorDetail {
  puntoCarga?: PuntoCargaCreate;
  fila?: Record<string, string>;
  error: string;
}

// Respuesta de importación
export interface ImportResponse {
  importados: number;
  omitidos?: number;
  errores: ImportErrorDetail[];
}
