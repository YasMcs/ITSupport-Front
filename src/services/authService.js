import axios from "axios";
import dummiesData from "../utils/dummies.json";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const USE_DUMMIES = import.meta.env.DEV && import.meta.env.VITE_USE_DUMMIES !== "false";

/**
 * Busca un usuario en los datos dummy por email y password
 */
function findDummyUser(email, password) {
  const user = dummiesData.users.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    // Simular delay de red
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: user.user,
          token: `dummy-token-${user.user.id}`,
        });
      }, 500);
    });
  }
  return Promise.reject(new Error("Credenciales inválidas"));
}

export const authService = {
  async login(credentials) {
    // En desarrollo, usar datos dummy si están habilitados
    if (USE_DUMMIES) {
      try {
        return await findDummyUser(credentials.email, credentials.password);
      } catch (error) {
        // Si no se encuentra en dummies, intentar con el backend
        // Solo si el backend está disponible
      }
    }

    // Llamada al backend real
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
      return data;
    } catch (error) {
      // Si falla el backend y estamos en desarrollo, intentar con dummies como fallback
      if (import.meta.env.DEV) {
        try {
          return await findDummyUser(credentials.email, credentials.password);
        } catch (dummyError) {
          // Si tampoco está en dummies, lanzar el error original del backend
          throw error;
        }
      }
      throw error;
    }
  },
  async logout() {
    // Implementar según backend
  },
};
