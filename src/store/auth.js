import { defineStore } from "pinia";
import authService from "../services/authService";

export const useAuthStore = defineStore("useAuth", {
  state: () => {
    return {
      estado: "Checking",
      rol: "",
      time: "",
    };
  },

  actions: {
    async login(user) {
      const response = await authService.login(user);
      if (!response) {
        return;
      }
      localStorage.setItem("token", response.token);
      this.rol = response.payload.rol;
      this.time = response.payload.time;
      this.estado = "inLogin";
      return response;
    },
    async checkAuthToken() {
      this.estado = "Checking";
      const token = localStorage.getItem("token");

      if (!token) {
        return (this.estado = "no autenticado");
      }

      try {
        const usuarioLogeado = await authService.buscarUsuarioLogueado();
        this.rol = usuarioLogeado.rol;
        this.estado = "inLogin";
      } catch (error) {
        this.estado = "no autenticado";
        localStorage.setItem("token", "");
      }
    },

    async cerrarSeccion() {
      this.estado = "no autenticado";
      localStorage.setItem("token", "");
      this.rol = "";
      this.time = "";
    },
  },
});
