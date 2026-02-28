import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const sucursalService = {
  async getAll() {
    const { data } = await axios.get(`${API_URL}/sucursales`);
    return data;
  },
};
