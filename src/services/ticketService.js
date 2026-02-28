import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const ticketService = {
  async getAll() {
    const { data } = await axios.get(`${API_URL}/tickets`);
    return data;
  },
  async getById(id) {
    const { data } = await axios.get(`${API_URL}/tickets/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await axios.post(`${API_URL}/tickets`, payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await axios.put(`${API_URL}/tickets/${id}`, payload);
    return data;
  },
};
