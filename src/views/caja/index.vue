<template>
  <div class="h-screen">
    <div
      class="w-full flex justify-center bg-green-50 items-center py-5 font-poppins font-semibold text-3xl uppercase border"
      :class="{
        'bg-red-50': !hayCajaAbierta,
      }"
    >
      <h2>Caja - {{ hayCajaAbierta ? "Abierta" : "Cerrada" }}</h2>
    </div>

    <div class="flex justify-center items-center">
      <Button
        v-if="!hayCajaAbierta"
        @click="abirCaja()"
        class="ml-auto mr-10 mt-10"
        label="Abrir caja"
        severity="success"
        rounded
      />
    </div>

    <div v-if="!hayCajaAbierta">
      <!-- Renderizamos las tarjetas -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 px-6"
      >
        <div
          v-for="caja in cajas"
          :key="caja.id"
          class="bg-white shadow-md rounded-lg p-4 border border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-800">
            Referencia: {{ caja.referencias }}
          </h3>
          <p class="text-sm text-gray-600">
            Fecha: {{ formatFecha(caja.fechaCreacion) }}
          </p>
          <p class="text-sm text-gray-600">
            Total Mesas: {{ caja.totalMesas }}
          </p>
          <p class="text-sm text-gray-600 font-semibold">
            Saldo Total: {{ formatCurrency(caja.totalCaja) }}
          </p>
        </div>
      </div>

      <!-- <cajas-table :cajas="cajas" /> -->
    </div>

    <div>
      <gestionar-caja
        v-if="hayCajaAbierta"
        :idCaja="idCaja"
        @get-cajas-abiertas="getCajasAbiertas"
        @get-cajas="getCajas"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import gestionarCaja from "./sections/gestionarCaja.vue";
import cajaServices from "../../services/cajaServices";
import Swal from "sweetalert2";
import cajasTable from "./components/cajasTable.vue";

const hayCajaAbierta = ref(false);
const idCaja = ref(null);
const referenciaCaja = ref(null);
const cajas = ref([]);

onMounted(async () => {
  await getCajasAbiertas();
  await getCajas();
});

const getCajas = async () => {
  cajas.value = await cajaServices.getCajas();
};

const getCajasAbiertas = async () => {
  const caja = await cajaServices.getCajaQuery({
    estaAbierto: true,
  });
  if (caja.length > 0) {
    hayCajaAbierta.value = true;
    idCaja.value = caja[0].id;
  } else {
    hayCajaAbierta.value = false;
    idCaja.value = null;
  }
};

const abirCaja = async () => {
  const { value: referencia } = await Swal.fire({
    title: "Abrir nueva caja",
    input: "text",
    inputLabel: "Escriba una referencia para la caja",
    inputValue: referenciaCaja.value,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#d33",
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });
  if (referencia) {
    await cajaServices.crearCaja({
      estaAbierto: true,
      referencias: referencia,
    });
  }
  await getCajasAbiertas();
};

// Función para formatear la fecha
const formatFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
/* Estilos adicionales opcionales */
</style>
