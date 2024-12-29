import { defineRule } from "vee-validate";

defineRule("required", (value) => {
  if (!value || !value.length) {
    return "El campo es obligatorio";
  }
  return true;
});

defineRule("email", (value) => {
  if (!value || !value.length) {
    return true;
  }
  if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/.test(value)) {
    return "El campo debe ser un Email";
  }
  return true;
});

defineRule("max-8", (value) => {
  if (value.length < 8) {
    return "El campo debe ser mayor a 8 caracteres";
  }
  return true;
});
