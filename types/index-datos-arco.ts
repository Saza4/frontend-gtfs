// ============================================
// TIPOS PARA DATOS DEL ARCO
// ============================================

export interface DatosArco {
  id_datos_arco: number;
  id_arco: number;
  desc_arco: string;
  origen: string;
  destino: string;
  fecha_validez: string; // "YYYY-MM-DD"
  metros_teoricos: number;
  metros_mapa: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Tipo para crear (sin fechas automáticas y sin ID de datos)
export type DatosArcoCreate = Omit<
  DatosArco,
  "id_datos_arco" | "fecha_creacion" | "fecha_actualizacion"
>;

// Tipo para actualizar (campos opcionales)
export type DatosArcoUpdate = Partial<DatosArcoCreate>;

// Respuesta de estadísticas
export interface DatosArcoStats {
  total: number;
  arcosUnicos: number;
  distanciaTotal: {
    teoricos: number;
    mapa: number;
  };
  promedioDistancias: {
    teorico: number;
    mapa: number;
  };
  arcosMasLargos: DatosArco[];
}

// Detalle de error en importación
export interface ImportErrorDetail {
  datosArco?: DatosArcoCreate;
  fila?: Record<string, string>;
  error: string;
}

// Respuesta de importación
export interface ImportResponse {
  importados: number;
  errores: ImportErrorDetail[];
}

// Utilidad para calcular diferencia porcentual
export interface DiferenciaMetros {
  absoluta: number; // metros_mapa - metros_teoricos
  porcentual: number; // (diferencia / metros_teoricos) * 100
  esMayorMapa: boolean; // metros_mapa > metros_teoricos
} // ============================================
// TIPOS PARA DATOS DEL ARCO
// ============================================

export interface DatosArco {
  id_datos_arco: number;
  id_arco: number;
  desc_arco: string;
  origen: string;
  destino: string;
  fecha_validez: string; // "YYYY-MM-DD"
  metros_teoricos: number;
  metros_mapa: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Tipo para crear (sin fechas automáticas y sin ID de datos)
export type DatosArcoCreate = Omit<
  DatosArco,
  "id_datos_arco" | "fecha_creacion" | "fecha_actualizacion"
>;

// Tipo para actualizar (campos opcionales)
export type DatosArcoUpdate = Partial<DatosArcoCreate>;

// Respuesta de estadísticas
export interface DatosArcoStats {
  total: number;
  arcosUnicos: number;
  distanciaTotal: {
    teoricos: number;
    mapa: number;
  };
  promedioDistancias: {
    teorico: number;
    mapa: number;
  };
  arcosMasLargos: DatosArco[];
}

// Detalle de error en importación
export interface ImportErrorDetail {
  datosArco?: DatosArcoCreate;
  fila?: Record<string, string>;
  error: string;
}

// Respuesta de importación
export interface ImportResponse {
  importados: number;
  errores: ImportErrorDetail[];
}

// Utilidad para calcular diferencia porcentual
export interface DiferenciaMetros {
  absoluta: number; // metros_mapa - metros_teoricos
  porcentual: number; // (diferencia / metros_teoricos) * 100
  esMayorMapa: boolean; // metros_mapa > metros_teoricos
}
