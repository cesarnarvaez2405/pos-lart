<template>
  <div>
    <div
      class="w-full flex justify-center bg-green-50 items-center py-5 font-poppins font-semibold text-3xl uppercase border"
      :class="{
        ' bg-red-50': !hayCajaAbierta,
      }"
    >
      <h2>Caja - {{ hayCajaAbierta ? "Abierta" : "Cerrada" }}</h2>
    </div>

    <div>
      <gestionar-caja v-if="hayCajaAbierta" :idCaja="idCaja" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import gestionarCaja from "./sections/gestionarCaja.vue";
import cajaServices from "../../services/cajaServices";

const hayCajaAbierta = ref(false);
const idCaja = ref(null);

onMounted(async () => {
  await getCajasAbiertas();
});

const getCajasAbiertas = async () => {
  const caja = await cajaServices.getCajaQuery({
    estaAbierto: true,
  });
  if (caja.length > 0) {
    hayCajaAbierta.value = true;
    idCaja.value = caja[0].id;
  }
};
</script>

<style>
</style>