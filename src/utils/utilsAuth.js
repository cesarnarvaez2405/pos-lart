import { useAuthStore } from "../store/auth";

export const estaAutenticado = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};

export const esAdministrador = () => {
  const store = useAuthStore();
  const role = store.rol;
  if (role === "admin") return true;
  return false;
};
