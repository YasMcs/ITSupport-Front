import axios from "axios";

const DEFAULT_API_URL = "https://exquisite-creativity-production.up.railway.app/api";
const API_URL = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;
const TOKEN_KEY = "itsupport.auth.token";
const authFailureListeners = new Set();

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem(TOKEN_KEY);
  const requestUrl = String(config.url || "");
  const isPublicAuthRoute =
    requestUrl === "/auth/login" ||
    requestUrl === "/usuarios/registro";

  if (token && !isPublicAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url || "");
    const isPublicAuthRoute =
      requestUrl === "/auth/login" ||
      requestUrl === "/usuarios/registro";

    // 403 Forbidden: Puede ser parámetro inválido (ej: null ID), solo advertencia
    if (status === 403) {
      console.warn(`[API] 403 Forbidden - ${requestUrl}. Posible parámetro inválido (ej: ID nulo).`);
      return Promise.reject(error);
    }

    // 401 Unauthorized: Autenticación fallida, limpiar sesión
    if (status === 401 && !isPublicAuthRoute) {
      authFailureListeners.forEach((listener) =>
        listener({
          status,
          url: requestUrl,
        })
      );
    }

    return Promise.reject(error);
  }
);

export function extractData(response) {
  const payload = response?.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.content)) return payload.content;

  return payload;
}

export function setAuthToken(token) {
  if (!token) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    return;
  }

  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  window.sessionStorage.removeItem(TOKEN_KEY);
}

export function getAuthToken() {
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function subscribeToAuthFailures(listener) {
  authFailureListeners.add(listener);
  return () => {
    authFailureListeners.delete(listener);
  };
}
