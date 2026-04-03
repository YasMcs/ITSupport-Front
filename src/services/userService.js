import { api, extractData } from "./api";
import { buildUserPayload, normalizeUser } from "../utils/apiMappers";

export const userService = {
  async getAll() {
    const response = await api.get("/usuarios");
    const users = extractData(response);
    return (Array.isArray(users) ? users : []).map(normalizeUser);
  },

  async getById(id) {
    const response = await api.get(`/usuarios/${id}`);
    return normalizeUser(extractData(response));
  },

  async create(payload) {
    const response = await api.post("/usuarios/registro", buildUserPayload(payload));
    return normalizeUser(extractData(response));
  },

  async getMe() {
    const response = await api.get("/usuarios/me");
    return normalizeUser(extractData(response));
  },

  async updateMe(payload) {
    const response = await api.put("/usuarios/me", {
      nombreUsuario: payload.nombre_usuario,
    });
    return normalizeUser(extractData(response));
  },

  async updateByAdmin(id, payload) {
    const response = await api.put(`/usuarios/admin/${id}`, {
      nombreUsuario: payload.nombre_usuario,
      email: payload.email,
      contrasena: payload.contrasena_hash,
      rol: String(payload.rol || "").toLowerCase(),
    });
    return normalizeUser(extractData(response));
  },

  async suspend(id) {
    const response = await api.put(`/usuarios/${id}/suspender`);
    return normalizeUser(extractData(response));
  },

  async activate(id) {
    const response = await api.put(`/usuarios/${id}/activar`);
    return normalizeUser(extractData(response));
  },

  async getActiveTechnicians() {
    const response = await api.get("/usuarios/tecnicos-activos");
    const users = extractData(response);
    return (Array.isArray(users) ? users : []).map(normalizeUser);
  },
};
