<template>
  <modal-mesa-layout ref="modalLayoutRef" :widthModal="'45rem'">
    <template v-slot:titulo>
      <div class="inline-flex items-center justify-center gap-2">
        <h2 class="font-bold whitespace-nowrap text-xl">Detalle de la caja</h2>
      </div>
    </template>

    <template v-slot:cuerpo>
      <div class="flex flex-col gap-4 p-4 bg-gray-200 rounded-md">
        <div class="border-b border-black py-2">
          <h2 class="font-bold">Detalle de venta - {{ diaActual }}</h2>
          <div class="flex justify-between">
            <h2>Total mesas</h2>
            <h2 class="font-bold">{{ totalMesas }}</h2>
          </div>
        </div>

        <div class="border-b border-black py-2 flex gap-2 flex-col">
          <h2 class="font-bold">Pagos realizados a cuentas</h2>

          <div
            v-for="(pagos, tipoPagoId) in agrupadosPorTipoPago"
            :key="tipoPagoId"
            class="flex justify-between"
          >
            <h3>{{ obtenerNombreTipoPago(tipoPagoId) }}</h3>
            <h3 class="font-bold">
              {{ formatCurrency(calcularTotalPorTipoPago(pagos)) }}
            </h3>
          </div>
        </div>

        <div class="flex justify-between">
          <h2>Total facturado</h2>
          <h2 class="font-bold">{{ formatCurrency(totalFacturado) }}</h2>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <Button
        label="Cancelar"
        text
        severity="danger"
        class="font-poppins"
        @click="cerrarModal()"
        autofocus
      />

      <Button
        label="Cerrar caja"
        class="bg-green-200 text-green-900 border-green-300 shadow-lg font-poppins"
        autofocus
        @click="emit('cerrar-caja')"
      />
    </template>
  </modal-mesa-layout>
</template>

<script setup>
import { ref } from "vue";
import modalMesaLayout from "../layout/modalMesaLayout.vue";

const modalLayoutRef = ref();
const agrupadosPorTipoPago = ref({});

const props = defineProps({
  totalMesas: {
    type: Number,
    default: 0,
  },
  diaActual: {
    type: String,
    default: "",
  },
  totalFacturado: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["cerrar-caja"]);

const abrirModal = (data) => {
  modalLayoutRef.value.openModal();
  agrupadosPorTipoPago.value = data.reduce((acc, item) => {
    item.tipoPagos.forEach((pago) => {
      const tipoPagoId = pago.tipoPagoId;
      if (!acc[tipoPagoId]) {
        acc[tipoPagoId] = [];
      }
      acc[tipoPagoId].push(pago);
    });
    return acc;
  }, {});
};

const calcularTotalPorTipoPago = (pagos) => {
  return pagos.reduce((total, pago) => total + pago.valor, 0);
};

const obtenerNombreTipoPago = (tipoPagoId) => {
  const pago = agrupadosPorTipoPago.value[tipoPagoId][0];
  return pago.tipoPago.nombre;
};

const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });
};

const cerrarModal = () => {
  modalLayoutRef.value.cerrarModal();
};

defineExpose({
  abrirModal,
});
</script>

<style>
</style>