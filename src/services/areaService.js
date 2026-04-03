import { api, extractData } from "./api";
import { buildAreaPayload, normalizeArea } from "../utils/apiMappers";

export const areaService = {
  async getAll() {
    const response = await api.get("/areas");
    const areas = extractData(response);
    return (Array.isArray(areas) ? areas : []).map(normalizeArea);
  },

  async getById(id) {
    const response = await api.get(`/areas/${id}`);
    return normalizeArea(extractData(response));
  },

  async create(payload) {
    const response = await api.post("/areas", buildAreaPayload(payload));
    return normalizeArea(extractData(response));
  },

  async getBySucursal(id) {
    const response = await api.get(`/areas/sucursal/${id}`);
    const areas = extractData(response);
    return (Array.isArray(areas) ? areas : []).map(normalizeArea);
  },

  async update(id, payload) {
    const nameResponse = await api.put(`/areas/${id}`, null, {
      params: { nuevoNombre: payload.nombreArea },
    });

    if (payload.sucursalId) {
      const branchResponse = await api.put(`/areas/${id}/sucursal`, {
        sucursalId: Number(payload.sucursalId),
      });
      return normalizeArea(extractData(branchResponse));
    }

    return normalizeArea(extractData(nameResponse));
  },

  async deactivate(id) {
    const response = await api.put(`/areas/${id}/desactivar`);
    return normalizeArea(extractData(response));
  },

  async activate(id) {
    const response = await api.put(`/areas/${id}/activar`);
    return normalizeArea(extractData(response));
  },
};
