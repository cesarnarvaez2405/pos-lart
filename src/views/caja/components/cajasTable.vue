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
      :virtualScrollerOptions="{
        lazy: true,
        itemSize: 46,
        delay: 200,
        showLoader: true,
        loading: loading,
        numToleratedItems: 10,
      }"
    >
      <template #header>
        <div class="grid grid-cols-10 px-2 py-2 gap-3">
          <div class="col-start-1">
            <div class="flex justify-start items-center h-full">
              <h1 class="font-poppins font-semibold">Listado de cajas</h1>
            </div>
          </div>

          <div class="col-span-7 h-full">
            <mesa-filters @obtener-caja="obtenerCajas" />
          </div>

          <div class="col-start-9 col-span-2">
            <div class="flex justify-end items-center h-full">
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
          </div>
        </div>
      </template>

      <Column field="id" header="Id">
        <template #loading>
          <div
            class="flex items-center"
            :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
          >
            <Skeleton width="60%" height="1rem" />
          </div> </template
      ></Column>
      <Column sortable field="fechaCreacion" header="Fecha">
        <template #loading>
          <div
            class="flex items-center"
            :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>

        <template #body="slotProps">
          {{ updateCurrentDate(slotProps.data.fechaCreacion) }}
        </template>
      </Column>
      <Column field="referencias" header="Referencia">
        <template #loading>
          <div
            class="flex items-center"
            :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
          >
            <Skeleton width="60%" height="1rem" />
          </div> </template
      ></Column>
      <Column field="totalCaja" header="Venta">
        <template #loading>
          <div
            class="flex items-center"
            :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.totalCaja) }}
        </template>
      </Column>
      <Column field="totalMesas" header="Mesas">
        <template #loading>
          <div
            class="flex items-center"
            :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
          >
            <Skeleton width="60%" height="1rem" />
          </div> </template
      ></Column>
      <Column header="Opciones" class="w-24">
        <template #loading>
          <div
            class="flex items-center"
            :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }"
          >
            <Skeleton width="60%" height="1rem" />
          </div>
        </template>
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
            <template #loading>
              <div
                class="flex items-center"
                :style="{
                  height: '17px',
                  'flex-grow': '1',
                  overflow: 'hidden',
                }"
              >
                <Skeleton width="60%" height="1rem" />
              </div>
            </template>
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

import mesaFilters from "./mesaFilters.vue";

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
  loading: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const emit = defineEmits(["abirCaja", "ver-historico", "obtener-caja"]);

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

const obtenerCajas = (filters) => {
  emit("obtener-caja", filters);
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