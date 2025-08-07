<template>
  <TieredMenu :model="modulos" />
</template>

<script setup>
import { ref } from "vue";

const modulos = ref([
  {
    label: "Configuración",
    items: [
      {
        label: "Usuarios",
        icon: "pi pi-users",
        shortcut: "⌘+U",
        key: "200",
      },
      {
        label: "Roles",
        icon: "pi pi-lock",
        shortcut: "⌘+R",
        key: "201",
      },
      {
        label: "Permisos",
        icon: "pi pi-key",
        shortcut: "⌘+P",
        key: "202",
      },
    ],
  },
]);
</script>

<style></style>
