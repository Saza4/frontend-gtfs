// ============================================
// TIPOS PARA DEPÓSITO
// ============================================

export interface Deposito {
  id_deposito: number;
  desc_parada: string;
  desc_parada_corta: string;
  fecha_validez: string; // "YYYY-MM-DD"
  servicios_llegan: number;
  servicios_salen: number;
  costo_relevo_obj: number;
  costo_relevo_real: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Tipo para crear (sin fechas automáticas y sin ID)
export type DepositoCreate = Omit<
  Deposito,
  "id_deposito" | "fecha_creacion" | "fecha_actualizacion"
>;

// Tipo para actualizar (campos opcionales)
export type DepositoUpdate = Partial<DepositoCreate>;

// Respuesta de estadísticas
export interface DepositoStats {
  total: number;
  totalServiciosLlegan: number;
  totalServiciosSalen: number;
  depositosConMasServicios: Deposito[];
}

// Detalle de error en importación
export interface ImportErrorDetail {
  deposito?: DepositoCreate;
  fila?: Record<string, string>;
  error: string;
}

// Respuesta de importación
export interface ImportResponse {
  importados: number;
  errores: ImportErrorDetail[];
}
