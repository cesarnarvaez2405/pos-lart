<template>
  <div class="bg-white">
    <main>
      <menuLart :key="keyMenu" />
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import menuLart from "./components/menu.vue";
import { useAuthStore } from "./store/auth";

const store = useAuthStore();
const keyMenu = ref(0);

onMounted(async () => {
  const isAuthenticated = await store.checkAuthToken();
  if (isAuthenticated) {
    keyMenu.value++;
  }
});

watch(
  () => store.estado,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      keyMenu.value++;
    }
  }
);
</script>

<style>
</style>