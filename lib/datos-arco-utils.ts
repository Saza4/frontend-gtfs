import type { DiferenciaMetros } from "@/types/index-datos-arco";

/**
 * Calcular diferencia entre metros teóricos y metros de mapa
 */
export function calcularDiferencia(
  metros_teoricos: number,
  metros_mapa: number,
): DiferenciaMetros {
  const absoluta = metros_mapa - metros_teoricos;
  const porcentual =
    metros_teoricos > 0 ? (absoluta / metros_teoricos) * 100 : 0;
  const esMayorMapa = metros_mapa > metros_teoricos;

  return {
    absoluta,
    porcentual,
    esMayorMapa,
  };
}

/**
 * Formatear diferencia para mostrar en UI
 */
export function formatearDiferencia(diferencia: DiferenciaMetros): string {
  const signo = diferencia.absoluta >= 0 ? "+" : "";
  return `${signo}${diferencia.absoluta.toFixed(2)}m (${signo}${diferencia.porcentual.toFixed(1)}%)`;
}

/**
 * Obtener variant de badge según diferencia porcentual
 */
export function getBadgeVariantDiferencia(
  diferenciaPorcentual: number,
): "default" | "secondary" | "destructive" | "outline" {
  const abs = Math.abs(diferenciaPorcentual);

  if (abs === 0) return "outline"; // Sin diferencia
  if (abs < 5) return "secondary"; // Diferencia pequeña
  if (abs < 15) return "default"; // Diferencia moderada
  return "destructive"; // Diferencia grande (>15%)
}

/**
 * Formatear distancia en metros
 */
export function formatearDistancia(metros: number | string): string {
  // Convertimos a número por si acaso llega como string desde la API
  const valorNumerico =
    typeof metros === "string" ? parseFloat(metros) : metros;

  // Manejo de casos nulos o inválidos
  if (isNaN(valorNumerico)) return "0.00 m";

  if (valorNumerico >= 1000) {
    return `${(valorNumerico / 1000).toFixed(2)} km`;
  }

  return `${valorNumerico.toFixed(2)} m`;
}
