<template>
  <div class="bg-slate-50 font-poppins">
    <div class="py-10 px-10 grid grid-cols-3">
      <div>
        <h1 class="text-xl">Caja N-{{ idCaja }}</h1>
      </div>

      <div class="text-center">
        <h1 class="text-2xl pb-2">{{ currentDate }}</h1>
        <p>{{ currentTime }}</p>
      </div>

      <div class="flex justify-center items-center">
        <Button class="ml-auto" label="Cerrar caja" severity="danger" rounded />
      </div>
    </div>

    <div class="px-10">
      <Button
        @click="abrirModalCrearModal()"
        class="ml-auto"
        label="Abrir mesa"
        severity="sucess"
        rounded
      />
    </div>

    <div
      class="px-10 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="mesa in mesas"
        :key="mesa.id"
        class="p-4 rounded-lg shadow-md flex flex-col justify-between"
        :class="
          mesa.estaAbierto
            ? 'bg-green-100 font-semibold'
            : 'bg-red-100 font-semibold'
        "
      >
        <div>
          <!-- Referencia de la mesa -->
          <h2 class="text-lg font-semibold">{{ mesa.referencias }}</h2>
          <!-- Saldo -->
          <div class="flex gap-2 text-center items-center">
            <p>Subtotal:</p>
            <p
              :class="
                mesa.estaAbierto
                  ? 'text-red-500 text-lg font-bold'
                  : 'text-lg font-bold  text-green-500'
              "
              class=""
            >
              {{ formatCurrency(mesa.saldo) }}
            </p>
          </div>
        </div>
        <div>
          <p
            :class="
              mesa.estaAbierto
                ? 'text-green-500 font-semibold'
                : 'text-red-500 font-semibold'
            "
          >
            {{ mesa.estaAbierto ? "Abierto" : "Cerrado" }}
          </p>
        </div>

        <p class="text-sm text-gray-600">
          Creado: {{ formatDate(mesa.fechaCreacion) }}
        </p>

        <div class="flex gap-2 pt-2">
          <printer-icon class="size-5 cursor-pointer" />
          <pencil-square-icon
            @click="abrirModalCrearModal(true, mesa)"
            class="size-5 cursor-pointer"
          />
        </div>
      </div>
    </div>

    <crear-mesa
      :idCaja="idCaja"
      :items="items"
      @obtenerMesasPorCaja="obtenerMesasPorCaja"
      ref="crearMesaRef"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { PrinterIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import mesaServices from "../../../services/mesaServices";
import itemsServices from "../../../services/itemsServices";
import crearMesa from "../components/crearMesa.vue";

const currentTime = ref("");
const currentDate = ref("");
const mesas = ref([]);
const items = ref([]);
const crearMesaRef = ref(null);

const props = defineProps({
  idCaja: {
    type: Number,
    required: true,
  },
});

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

const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });
};

const obtenerMesasPorCaja = async () => {
  mesas.value = await mesaServices.getMesaPorCaja(props.idCaja);
};

const obtenerItems = async () => {
  items.value = await itemsServices.getItems();
};

const abrirModalCrearModal = (estaEditando, data) => {
  crearMesaRef.value.abrirModal(estaEditando, data);
};

// Función para formatear fecha y hora de creación
const formatDate = (dateString) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(dateString).toLocaleString("es-ES", options);
};

onMounted(async () => {
  // Llama a updateCurrentTime cada segundo
  updateCurrentTime(); // Actualiza la hora inmediatamente
  updateCurrentDate();
  await obtenerMesasPorCaja();
  await obtenerItems();
  const interval = setInterval(updateCurrentTime, 1000);

  // Limpia el intervalo al desmontar el componente
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<style>
</style>