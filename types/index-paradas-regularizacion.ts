export interface ParadasRegularizacion {
  id_parada_regularizacion: number;
  desc_trayecto_corta: string;
  sentido: number; // 0 = ida, 1 = regreso
  fecha_validez: string;
  periodicidad: string;
  desc_parada: string;
  regula: boolean;
  releva: boolean;
  entran: boolean;
  salen: boolean;
  descansa: boolean;
  informes: boolean;
  relevante: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export type ParadaRegularizacionCreate = Omit<
  ParadasRegularizacion,
  "id_parada_regularizacion" | "fecha_creacion" | "fecha_actualizacion"
>;

export type ParadaRegularizacionUpdate = Partial<ParadaRegularizacionCreate>;

export interface ParadasRegularizacionStats {
  total: number;
  funcionesPorTipo: {
    regula: number;
    releva: number;
    entran: number;
    salen: number;
    descansa: number;
    informes: number;
    relevante: number;
  };
  porPeriodicidad: Array<{
    periodicidad: string;
    cantidad: string;
  }>;
}
