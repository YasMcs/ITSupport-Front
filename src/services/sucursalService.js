import { api, extractData } from "./api";
import { buildSucursalPayload, normalizeSucursal } from "../utils/apiMappers";

export const sucursalService = {
  async getAll() {
    const response = await api.get("/sucursales");
    const sucursales = extractData(response);
    return (Array.isArray(sucursales) ? sucursales : []).map(normalizeSucursal);
  },

  async getActive() {
    const response = await api.get("/sucursales/activas");
    const sucursales = extractData(response);
    return (Array.isArray(sucursales) ? sucursales : []).map(normalizeSucursal);
  },

  async getById(id) {
    const response = await api.get(`/sucursales/${id}`);
    return normalizeSucursal(extractData(response));
  },

  async create(payload) {
    const response = await api.post("/sucursales", buildSucursalPayload(payload));
    return normalizeSucursal(extractData(response));
  },

  async update(id, payload) {
    const response = await api.put(`/sucursales/${id}`, buildSucursalPayload(payload));
    return normalizeSucursal(extractData(response));
  },

  async activate(id) {
    const response = await api.put(`/sucursales/${id}/activar`);
    return normalizeSucursal(extractData(response));
  },

  async deactivate(id) {
    const response = await api.put(`/sucursales/${id}/desactivar`);
    return normalizeSucursal(extractData(response));
  },
};
