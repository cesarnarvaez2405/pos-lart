<template>
  <caja-layout>
    <template v-slot:Titulo>
      <h2 class="font-semibold text-2xl">¡Bienvenido L'art du chat!</h2>
    </template>

    <template v-slot:subtitulo>
      <span class="text-sm">En este momento la caja se encuentra </span>
      <span
        class="text-sm pl-1 text-red-600"
        :class="{
          'text-green-600': hayCajaAbierta,
        }"
      >
        {{ hayCajaAbierta ? "Abierta" : "Cerrada" }}
      </span>
    </template>

    <template v-slot:watch>
      <CalendarDaysIcon class="size-6" />
      <h1>{{ currentDate }}, {{ currentTime }}</h1>
    </template>

    <template v-slot:cuerpo>
      <div v-if="!hayCajaAbierta">
        <cajas-table
          :hayCajaAbierta="hayCajaAbierta"
          :cajas="cajas"
          :loading="loadingTable"
          @abirCaja="abirCaja"
          @ver-historico="verHistoricoCaja"
          @obtener-caja="getCajas"
        />
      </div>

      <div>
        <gestionar-caja
          v-if="hayCajaAbierta"
          :idCaja="idCaja"
          :estaViendoHistorico="estaViendoHistorico"
          :diaActual="currentDate"
          @get-cajas-abiertas="getCajasAbiertas"
          @get-cajas="getCajas"
          @volver="volverDelHistorico"
        />
      </div>
    </template>
  </caja-layout>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import Swal from "sweetalert2";
import { CalendarDaysIcon } from "@heroicons/vue/24/outline";

import cajaLayout from "./layout/cajaLayout.vue";
import gestionarCaja from "./sections/gestionarCaja.vue";
import cajaServices from "../../services/cajaServices";
import cajasTable from "./components/cajasTable.vue";

const hayCajaAbierta = ref(false);
const idCaja = ref(null);
const referenciaCaja = ref(null);
const cajas = ref([]);
const estaViendoHistorico = ref(false);
const currentTime = ref("");
const currentDate = ref("");
const loadingTable = ref(false);

const updateCurrentTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const updateCurrentDate = () => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getCajas = async (filters) => {
  loadingTable.value = true;
  const fechaInicioQuery = filters.fechaInicio
    ? `?fechaInicio=${filters.fechaInicio}`
    : "";

  const fechaFinalQuery = filters.fechaFin
    ? `&fechaFin=${filters.fechaFin}`
    : "";

  const query = `${fechaInicioQuery}${fechaFinalQuery}`;

  cajas.value = await cajaServices.getCajas(query);
  loadingTable.value = false;
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

const verHistoricoCaja = (id) => {
  idCaja.value = id;
  estaViendoHistorico.value = true;
  hayCajaAbierta.value = true;
};

const volverDelHistorico = () => {
  idCaja.value = null;
  estaViendoHistorico.value = false;
  hayCajaAbierta.value = false;
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

onMounted(async () => {
  await getCajasAbiertas();

  // Llama a updateCurrentTime cada segundo
  updateCurrentTime(); // Actualiza la hora inmediatamente
  updateCurrentDate();
  const interval = setInterval(updateCurrentTime, 1000);

  // Limpia el intervalo al desmontar el componente
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<style>
/* Estilos adicionales opcionales */
</style>
