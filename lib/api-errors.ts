/**
 * Sistema de manejo de errores de API
 * Cubre todos los posibles errores HTTP y de red
 */

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  details?: unknown;
}

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Mensajes de error en español según código HTTP
 */
export const ERROR_MESSAGES: Record<number, string> = {
  // 400 - Errores del cliente
  400: "Solicitud incorrecta. Verifica los datos enviados.",
  401: "No autorizado. Debes iniciar sesión.",
  403: "Acceso prohibido. No tienes permisos para realizar esta acción.",
  404: "Recurso no encontrado.",
  405: "Método no permitido.",
  406: "Formato no aceptable.",
  408: "Tiempo de espera agotado.",
  409: "Conflicto. El recurso ya existe o hay un conflicto de datos.",
  410: "Recurso ya no disponible.",
  413: "Archivo demasiado grande.",
  414: "URL demasiado larga.",
  415: "Tipo de medio no soportado.",
  422: "Entidad no procesable. Verifica los datos enviados.",
  429: "Demasiadas solicitudes. Intenta de nuevo más tarde.",

  // 500 - Errores del servidor
  500: "Error interno del servidor. Intenta de nuevo más tarde.",
  501: "Funcionalidad no implementada.",
  502: "Error de puerta de enlace.",
  503: "Servicio no disponible. Intenta de nuevo más tarde.",
  504: "Tiempo de espera agotado en el servidor.",
  505: "Versión HTTP no soportada.",
  507: "Almacenamiento insuficiente.",
  511: "Se requiere autenticación de red.",
};

/**
 * Obtener mensaje de error apropiado
 */
export function getErrorMessage(
  statusCode: number,
  defaultMessage?: string,
): string {
  return (
    ERROR_MESSAGES[statusCode] ||
    defaultMessage ||
    "Error desconocido. Intenta de nuevo."
  );
}

/**
 * Determinar si el error es de red
 */
export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === "object") {
    const err = error as { code?: string; message?: string };
    return (
      err.code === "ECONNABORTED" ||
      err.code === "ENOTFOUND" ||
      err.code === "ENETUNREACH" ||
      err.code === "ETIMEDOUT" ||
      (err.message?.includes("Network Error") ?? false) ||
      (err.message?.includes("network") ?? false)
    );
  }
  return false;
}

/**
 * Parsear error de respuesta de API
 */
export function parseApiError(error: unknown): ApiError {
  // Error de red
  if (isNetworkError(error)) {
    return new ApiError(
      "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      0,
      error,
    );
  }

  // Error de Axios con respuesta
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        status: number;
        data?: {
          message?: string;
          error?: string;
          statusCode?: number;
        };
      };
      message?: string;
    };

    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data;

    // Mensaje del backend o mensaje por defecto
    const message = data?.message || data?.error || getErrorMessage(status);

    return new ApiError(message, status, data);
  }

  // Error genérico
  if (error instanceof Error) {
    return new ApiError(error.message, 500, error);
  }

  // Error desconocido
  return new ApiError("Error desconocido. Intenta de nuevo.", 500, error);
}
