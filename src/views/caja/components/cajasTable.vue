<template>
  <div class="py-5">
    <DataTable :value="cajas" tableStyle="min-width: 50rem">
      <Column field="code" header="Code"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="quantity" header="Quantity"></Column>
    </DataTable>

    {{ cajas }}
  </div>
</template>

<script setup>
const props = defineProps({
  cajas: {
    type: Array,
    required: true,
  },
});
</script>

<style>
</style>