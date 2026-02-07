/**
 * Cliente HTTP para consumir la API del backend GTFS
 *
 * Características:
 * - Interceptores de request/response
 * - Manejo automático de errores
 * - Timeout configurado
 * - Logging en desarrollo
 * - Tipos TypeScript completos
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { parseApiError } from "./api-errors";

/**
 * Configuración del cliente API
 */
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  timeout: 30000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Crear instancia de Axios
 */
const api: AxiosInstance = axios.create(API_CONFIG);

/**
 * INTERCEPTOR DE REQUEST
 * Se ejecuta antes de cada petición
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Logging en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log("API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
        params: config.params,
      });
    }

    // Aquí puedes agregar tokens de autenticación si los necesitas
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

/**
 * INTERCEPTOR DE RESPONSE
 * Se ejecuta después de cada respuesta
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Logging en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log("API Response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        url: response.config.url,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Parsear error y convertirlo a ApiError
    const apiError = parseApiError(error);

    // Logging detallado del error
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", {
        message: apiError.message,
        statusCode: apiError.statusCode,
        url: error.config?.url,
        method: error.config?.method,
        details: apiError.details,
      });
    }

    // Logging en producción (menos detallado)
    if (process.env.NODE_ENV === "production") {
      console.error("API Error:", apiError.message);
    }

    // Rechazar con el error parseado
    return Promise.reject(apiError);
  },
);

/**
 * HELPERS PARA PETICIONES TIPADAS
 */

/**
 * GET request
 */
export async function get<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<T> {
  try {
    const response = await api.get<T>(url, { params });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * POST request
 */
export async function post<T>(url: string, data?: unknown): Promise<T> {
  try {
    const response = await api.post<T>(url, data);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * PUT request
 */
export async function put<T>(url: string, data?: unknown): Promise<T> {
  try {
    const response = await api.put<T>(url, data);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * PATCH request
 */
export async function patch<T>(url: string, data?: unknown): Promise<T> {
  try {
    const response = await api.patch<T>(url, data);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * DELETE request
 */
export async function del<T>(url: string): Promise<T> {
  try {
    const response = await api.delete<T>(url);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * Verificar si el backend está disponible
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await api.get("/health", { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
}

// Exportar instancia principal
export default api;

// Exportar helpers
export { ApiError } from "./api-errors";
export type { ApiErrorResponse } from "./api-errors";
