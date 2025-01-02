<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Edit Profile"
    :style="{ width: widthModal }"
    :closable="false"
  >
    <template #header>
      <slot name="titulo"></slot>
    </template>

    <slot name="cuerpo"></slot>

    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const visible = ref(false);

const props = defineProps({
  widthModal: {
    type: String,
    default: "45rem",
    required: true,
  },
});

const openModal = () => {
  visible.value = true;
};

const cerrarModal = () => {
  visible.value = false;
};

defineExpose({
  openModal,
  cerrarModal,
});
</script>

<style>
</style>