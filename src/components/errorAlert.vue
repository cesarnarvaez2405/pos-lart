
<template>
  <div class="text-red-500 font-semibold text-sm">
    <ErrorMessage :name="name" />
  </div>
</template>
  
  <script setup>
import { ErrorMessage } from "vee-validate";

defineProps({
  name: { type: String },
});
</script>
  
  <style>
</style>