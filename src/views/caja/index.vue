<template>
  <div class="h-screen">
    <div
      v-if="!estaViendoHistorico"
      class="w-full flex justify-center bg-green-50 items-center py-5 font-poppins font-semibold text-3xl border"
      :class="{
        'bg-red-50': !hayCajaAbierta,
      }"
    >
      <h2>
        Caja -
        {{ hayCajaAbierta ? "Abierta" : "Cerrada" }}
      </h2>
    </div>

    <div
      v-else
      class="w-full flex justify-center bg-blue-950 text-white items-center py-5 font-poppins font-semibold text-3xl border"
    >
      <h2>Historico de la caja {{ idCaja }}</h2>
    </div>

    <div v-if="!hayCajaAbierta">
      <cajas-table
        :hayCajaAbierta="hayCajaAbierta"
        :cajas="cajas"
        @abirCaja="abirCaja"
        @ver-historico="verHistoricoCaja"
      />
    </div>

    <div>
      <gestionar-caja
        v-if="hayCajaAbierta"
        :idCaja="idCaja"
        :estaViendoHistorico="estaViendoHistorico"
        @get-cajas-abiertas="getCajasAbiertas"
        @get-cajas="getCajas"
        @volver="volverDelHistorico"
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
const estaViendoHistorico = ref(false);

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
</script>

<style>
/* Estilos adicionales opcionales */
</style>
