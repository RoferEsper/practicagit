import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../endpoints/api.js";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),
  loading: false,
  error: null,

  // ✅ LOGIN
  login: async (cuenta, password) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post(`${API_URL}/login`, { cuenta, password });

      // Guardamos token y datos del usuario que vienen del backend
      const { token, cuenta: nombre, id_role, nombre_role } = res.data;

      const userData = { cuenta: nombre, id_role, nombre_role };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      set({ user: userData, token, loading: false });
    } catch (err) {
      console.error("❌ Error en login:", err);
      set({ error: "Credenciales inválidas", loading: false });
    }
  },

  // ✅ LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  // ✅ FETCH USER (para mantener el perfil sincronizado)
  fetchUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data.user || res.data; // según tu backend
      localStorage.setItem("user", JSON.stringify(userData));

      set({ user: userData });
    } catch (err) {
      console.error("❌ Error al obtener usuario:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ error: "Token inválido o expirado", user: null, token: null });
    }
  },
}));
