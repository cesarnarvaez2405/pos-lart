<template>
  <modal-mesa-layout ref="modalLayoutRef" :widthModal="'60rem'">
    <template v-slot:titulo>
      <div class="inline-flex items-center justify-center gap-2">
        <h2 class="font-bold whitespace-nowrap text-xl">
          Resumen de {{ referencia }}
        </h2>
      </div>
    </template>

    <template v-slot:cuerpo>
      <div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col">
            <div class="flex flex-col gap-2 p-4 bg-gray-200 rounded-md">
              <h2>Detalle de cuenta</h2>
            </div>
          </div>
        </div>
        <!-- <div class="pb-4">
          <label class="font-semibold">Productos</label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(item, index) in itemsAGuardar"
            :key="index"
            class="p-4 border rounded-lg shadow-lg flex flex-col gap-2"
          >
            <div>
              <h3 class="text-2xl font-semibold">{{ item.nombre }}</h3>
              <p class="text-sm font-bold text-gray-400 mb-2">
                {{ formatCurrency(item.valor) }}
              </p>
            </div>

            <div class="flex gap-2">
              <span class="font-quicksand">Cantidad: </span>
              <span class="font-semibold">{{ item.cantidad }}</span>
            </div>
          </div>
        </div>

        <div class="pt-4" v-if="!estaViendoDetalle">
          <label class="font-semibold">Tipo de pago</label>
        </div>

        <div class="pt-4" v-if="estaCerrando && !estaViendoDetalle">
          <tipo-pago-form :tiposPagosData="tiposPagosData" />
        </div>

        <div class="pt-4">
          <label class="font-semibold">Total: </label>
          <p class="text-lg font-bold text-red-500">
            {{ formatCurrency(totalCarrito) }}
          </p>
        </div> -->
      </div>
    </template>

    <template v-slot:footer>
      <Button
        label="Cancelar"
        text
        severity="danger"
        class="font-poppins"
        autofocus
      />

      <Button
        label="Imprimir"
        class="bg-yellow-200 text-yellow-900 border-yellow-300 shadow-lg font-poppins"
        autofocus
      />

      <Button
        label="Cerrar Caja"
        class="bg-orange-200 text-orange-900 border-orange-300 shadow-lg font-poppins"
        autofocus
      />
    </template>
  </modal-mesa-layout>
</template>

<script setup>
import modalMesaLayout from "../layout/modalMesaLayout.vue";
import tipoPagoForm from "../forms/tipoPagoForm.vue";
import { ref } from "vue";

const modalLayoutRef = ref();

const props = defineProps({
  referencia: {
    type: String,
    required: true,
  },

  itemsAGuardar: {
    type: Array,
    required: true,
  },

  estaViendoDetalle: {
    type: Boolean,
    required: true,
    default: false,
  },

  totalCarrito: {
    type: Number,
    required: true,
  },

  estaCerrando: {
    type: Boolean,
    default: false,
  },

  tiposPagosData: {
    type: Array,
    default: [],
    required: true,
  },
});

const openModal = () => {
  modalLayoutRef.value.openModal();
};

const cerrarModal = () => {
  modalLayoutRef.value.cerrarModal();
};

const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });
};

defineExpose({
  openModal,
  cerrarModal,
});
</script>

<style>
</style>