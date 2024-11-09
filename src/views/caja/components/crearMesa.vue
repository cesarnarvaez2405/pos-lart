
<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Edit Profile"
    :style="{ width: '40rem' }"
  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <h2 class="font-bold whitespace-nowrap text-xl">Crear mesa</h2>
      </div>
    </template>
    <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Digite la siguiente informacion</span
    >
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">Mesa N°</label>
      <InputText id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex items-center gap-4 mb-2">
      <label for="email" class="font-semibold w-24">Email</label>
      <InputText id="email" class="flex-auto" autocomplete="off" />
    </div>
    <template #footer>
      <Button
        label="Cancel"
        text
        severity="secondary"
        @click="visible = false"
        autofocus
      />
      <Button
        label="Save"
        outlined
        severity="secondary"
        @click="visible = false"
        autofocus
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);

const abrirModal = () => {
  visible.value = true;
};

defineExpose({
  abrirModal,
});
</script>


<style>
</style>