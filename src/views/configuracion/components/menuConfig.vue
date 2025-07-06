<template>
  <Menu :model="modulos" class="w-full md:w-60" />
  <!-- <template #submenulabel="{ item }">
      <span class="text-primary font-bold">{{ item.label }}</span>
    </template>
    <template #item="{ item, props }">
      <a v-ripple class="flex items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span>{{ item.label }}</span>
        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
        <span
          v-if="item.shortcut"
          class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
          >{{ item.shortcut }}</span
        >
      </a>
    </template> -->
  <!-- </Menu> -->
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
      },
      {
        label: "Roles",
        icon: "pi pi-lock",
        shortcut: "⌘+R",
      },
      {
        label: "Permisos",
        icon: "pi pi-key",
        shortcut: "⌘+P",
      },
    ],
  },
]);
</script>
  
  <style>
</style>