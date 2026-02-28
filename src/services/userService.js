import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const userService = {
  async getAll() {
    const { data } = await axios.get(`${API_URL}/users`);
    return data;
  },
  async getById(id) {
    const { data } = await axios.get(`${API_URL}/users/${id}`);
    return data;
  },
};
