<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Edit Profile"
    :style="{ width: '45rem' }"
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
  estaAbierto: {
    type: Boolean,
    required: true,
    default: false,
  },
});

watch(props.estaAbierto, (newValue, oldValue) => {
  if (!newValue) {
    return;
  }

  visible.value = props.estaAbierto;
});
</script>

<style>
</style>