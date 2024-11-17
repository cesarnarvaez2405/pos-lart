<template>
  <div class="py-5 px-20">
    <div class="flex justify-center items-center"></div>
    <DataTable
      :value="cajas"
      showGridlines
      size="small"
      tableStyle="min-width: 30rem"
      resizableColumns
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
    >
      <template #header>
        <div class="flex items-center justify-between py-3">
          <h1 class="font-poppins font-semibold pl-5">Listado de cajas</h1>
          <Button
            v-if="!hayCajaAbierta"
            @click="abrirCaja()"
            class="font-poppins bg-blue-950 border-0"
            label="Abrir caja"
            severity="info"
            rounded
            raised
          />
        </div>
      </template>
      <Column field="id" header="Id"></Column>
      <Column sortable field="fechaCreacion" header="Fecha">
        <template #body="slotProps">
          {{ updateCurrentDate(slotProps.data.fechaCreacion) }}
        </template>
      </Column>
      <Column field="referencias" header="Referencia"></Column>
      <Column field="totalCaja">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.totalCaja) }}
        </template>
      </Column>
      <Column field="totalMesas" header="Mesas"></Column>
      <Column header="Opciones" class="w-24">
        <template #body="{ data }">
          <magnifying-glass-circle-icon
            class="mt-2 size-6 cursor-pointer"
            @click="verHistorico(data.id)"
          />
        </template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column
            :class="'bg-slate-200 '"
            footer="Total:"
            :colspan="3"
            footerStyle="text-align:center"
          />
          <Column :class="'bg-green-200'" :footer="totalVenta">
            <template #body="slotProps">
              {{ slotProps.data.totalVenta }}
            </template>
          </Column>
          <Column :footer="totalMesas" :class="'bg-yellow-200 '" />
        </Row>
      </ColumnGroup>
    </DataTable>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { MagnifyingGlassCircleIcon } from "@heroicons/vue/24/outline";

const totalMesas = ref(0);

const props = defineProps({
  cajas: {
    type: Array,
    required: true,
  },
  hayCajaAbierta: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["abirCaja", "ver-historico"]);

const totalVenta = computed(() => {
  let total = 0;
  let totalMesa = 0;
  for (const caja of props.cajas) {
    total += parseFloat(caja.totalCaja);
    totalMesa += parseInt(caja.totalMesas);
  }
  totalMesas.value = totalMesa;
  return formatCurrency(total);
});

const abrirCaja = () => {
  emit("abirCaja");
};

const verHistorico = (id) => {
  emit("ver-historico", id);
};

const updateCurrentDate = (date) => {
  const now = new Date(date);
  return now.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });
};
</script>

<style>
</style>