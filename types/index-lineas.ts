// ============================================
// TIPOS PARA LÍNEAS
// ============================================

export interface Linea {
  id_linea: number;
  desc_linea: string;
  code_trayecto: string;
  desc_trayecto: string;
  desc_trayecto_corta: string;
  tipo_viaje: "ESTANDAR" | "MIXTO" | "ELECTRICO";
  color: string; // Hexadecimal 8 dígitos (AARRGGBB)
  code_trayecto_externo?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Tipo para crear (sin fechas automáticas y sin ID)
export type LineaCreate = Omit<
  Linea,
  "id_linea" | "fecha_creacion" | "fecha_actualizacion"
>;

// Tipo para actualizar (campos opcionales)
export type LineaUpdate = Partial<LineaCreate>;

// Respuesta de estadísticas de líneas
export interface LineaStats {
  total: number;
  porTipoViaje: Array<{
    tipo: string;
    cantidad: string;
  }>;
}

// Detalle de error en importación
export interface ImportErrorDetail {
  linea?: LineaCreate;
  fila?: Record<string, string>;
  error: string;
}

// Respuesta de importación
export interface ImportResponse {
  importadas: number;
  errores: ImportErrorDetail[];
}
