<template>
  <div>
    <Card>
      <template #title>
        <h2 class="text-sm">
          Por favor, selecciona los items para seguir con el proceso
        </h2>
      </template>
      <template #content>
        <DataTable
          :value="itemsValue"
          editMode="cell"
          :key="keyTable"
          @cell-edit-complete="onCellEditComplete"
          v-model:selection="selectedProduct"
          :pt="{
            table: { style: 'min-width: 30rem' },
            column: {
              bodycell: ({ state }) => ({
                class: [{ '!py-0': state['d_editing'] }],
              }),
            },
          }"
        >
          <Column selectionMode="multiple"></Column>
          <Column
            v-for="col in columns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            style="width: 25%"
          >
            <template #body="{ data, field }">
              <template v-if="field === 'valor'">
                {{ formatCurrency(data[field]) }}
              </template>

              <template v-else>
                {{ data[field] }}
              </template>
            </template>
            <template #editor="{ data, field }">
              <template v-if="field === 'cantidad'">
                <input
                  class="border rounded-md bg-gray-100 px-2"
                  v-model="data[field]"
                  autofocus
                  fluid
                />
              </template>

              <template v-else>
                {{
                  field === "valor" ? formatCurrency(data[field]) : data[field]
                }}
              </template>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },

  originalItems: {
    type: Array,
    required: true,
  },

  columns: {
    type: Array,
    required: true,
  },

  keyTable: {
    type: Number,
    required: true,
  },
});

const selectedProduct = ref();
const itemsValue = ref([...props.items]);

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;

  switch (field) {
    case "id":
    case "cantidad":
      if (isPositiveInteger(newValue)) data[field] = newValue;
      else event.preventDefault();
      break;

    default:
      if (newValue.trim().length > 0) data[field] = newValue;
      else event.preventDefault();
      break;
  }
};

const isPositiveInteger = (val) => {
  let str = String(val);

  str = str.trim();

  if (!str) {
    return false;
  }

  str = str.replace(/^0+/, "") || "0";
  var n = Math.floor(Number(str));

  return n !== Infinity && String(n) === str && n >= 0;
};

const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });
};

const resetData = () => {
  itemsValue.value = [...props.items];
};

onBeforeUnmount(() => {
  resetData();
});

defineExpose({
  selectedProduct,
});
</script>

<style>
</style>