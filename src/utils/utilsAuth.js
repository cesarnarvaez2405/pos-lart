export const estaAutenticado = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};
