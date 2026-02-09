export interface ArcosLinea {
  id_arco_linea: number;
  desc_linea_corta: string;
  desc_trayecto_corta: string;
  sentido: number; // 0 = ida, 1 = regreso (GTFS)
  fecha_validez: string;
  secuencia: number;
  code_arco: number;
  origen: string;
  destino: string;
  metros_reales: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export type ArcosLineaCreate = Omit<
  ArcosLinea,
  "id_arco_linea" | "fecha_creacion" | "fecha_actualizacion"
>;

export type ArcosLineaUpdate = Partial<ArcosLineaCreate>;

export interface ArcosLineaStats {
  total: number;
  trayectosUnicos: number;
  lineasUnicas: number;
  distanciaPorSentido: Array<{
    sentido: number;
    total_metros: string;
    cantidad_arcos: string;
  }>;
  trayectosConMasArcos: Array<{
    trayecto: string;
    sentido: number;
    cantidad: string;
    distancia_total: string;
  }>;
}
