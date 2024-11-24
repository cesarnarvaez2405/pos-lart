<template>
  <div
    class="font-poppins h-screen"
    :class="{
      'bg-white': estaViendoHistorico,
    }"
  >
    <div class="px-20">
      <div class="grid grid-cols-4 gap-5 pb-10">
        <div class="border rounded-lg">
          <div class="px-3 py-2 flex justify-start items-center gap-5">
            <div class="flex bg-blue-950 px-2 py-1 rounded-lg">
              <circle-stack-icon class="size-9 text-white" />
            </div>
            <div>
              <h1 class="font-poppins font-semibold text-xl">
                {{ totalMesasAbiertas }}
              </h1>
              <h2 class="font-poppins text-sm">Total mesas abiertas</h2>
            </div>
          </div>
        </div>

        <div class="border rounded-lg">
          <div class="px-3 py-2 flex justify-start items-center gap-5">
            <div class="flex bg-blue-950 px-2 py-1 rounded-lg">
              <document-check-icon class="size-9 text-white" />
            </div>
            <div>
              <h1 class="font-poppins font-semibold text-xl">
                {{ totalMesasFacturadas }}
              </h1>
              <h2 class="font-poppins text-sm">Total mesas facturadas</h2>
            </div>
          </div>
        </div>

        <div class="border rounded-lg">
          <div class="px-3 py-2 flex justify-start items-center gap-5">
            <div class="flex bg-blue-950 px-2 py-1 rounded-lg">
              <clipboard-document-check-icon class="size-9 text-white" />
            </div>
            <div>
              <h1 class="font-poppins font-semibold text-xl">
                {{ mesas.length }}
              </h1>
              <h2 class="font-poppins text-sm">Total mesas</h2>
            </div>
          </div>
        </div>

        <div class="border rounded-lg">
          <div class="px-3 py-2 flex justify-start items-center gap-5">
            <div class="flex bg-blue-950 px-2 py-1 rounded-lg">
              <currency-dollar-icon class="size-9 text-white" />
            </div>
            <div>
              <h1 class="font-poppins font-semibold text-xl">
                {{ formatCurrency(totalCarrito) }}
              </h1>
              <h2 class="font-poppins text-sm">Total facturado</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-b"></div>

    <div class="bg-gray-200 px-10 py-10 shadow-inner h-screen">
      <div class="bg-white py-5 rounded-lg shadow-lg">
        <div class="px-10 flex justify-between">
          <div>
            <Button
              v-if="!estaViendoHistorico"
              @click="abrirModalCrearModal()"
              class="ml-auto bg-green-200 text-green-900 border-green-300 shadow-lg"
              label="Abrir mesa"
              rounded
            />
            <Button
              v-else
              @click="volverDelHistorico()"
              class="ml-auto bg-blue-950 border-0"
              label="Volver"
              rounded
            />
          </div>

          <div>
            <Button
              v-if="!estaViendoHistorico"
              @click="confirmarCerrar()"
              class="ml-auto bg-red-200 border-red-300 text-red-900 shadow-lg"
              label="Cerrar caja"
              rounded
            />
          </div>
        </div>

        <div
          class="px-10 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
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

            <div class="flex gap-2 pt-2 items-center">
              <pencil-square-icon
                v-if="mesa.estaAbierto && !estaViendoHistorico"
                @click="abrirModalCrearModal(true, mesa, false)"
                class="size-5 cursor-pointer"
              />
              <Button
                @click="abrirModalCrearModal(true, mesa, true)"
                v-if="mesa.estaAbierto && !estaViendoHistorico"
                class="ml-auto text-sm"
                label="Cerrar mesa"
                severity="danger"
                raised
                rounded
              />
            </div>
          </div>
        </div>

        <div class="h-screen" v-if="mesas.length <= 0">
          <div class="h-1/4 flex justify-center items-center">
            <h2>No hay mesas creadas para esta caja</h2>
          </div>
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import {
  PrinterIcon,
  PencilSquareIcon,
  CircleStackIcon,
  DocumentCheckIcon,
  ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
} from "@heroicons/vue/24/outline";
import mesaServices from "../../../services/mesaServices";
import itemsServices from "../../../services/itemsServices";
import crearMesa from "../components/crearMesa.vue";
import Swal from "sweetalert2";
import cajaServices from "../../../services/cajaServices";

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
  estaViendoHistorico: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["get-cajas-abiertas", "get-cajas", "volver"]);

const totalCarrito = computed(() => {
  return mesas.value.reduce((total, mesa) => total + parseFloat(mesa.saldo), 0);
});

const totalMesasFacturadas = computed(() =>
  mesas.value.reduce(
    (contador, mesa) => contador + (!mesa.estaAbierto ? 1 : 0),
    0
  )
);

const totalMesasAbiertas = computed(() =>
  mesas.value.reduce(
    (contador, mesa) => contador + (mesa.estaAbierto ? 1 : 0),
    0
  )
);

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

const abrirModalCrearModal = (estaEditando, data, estaCerrando) => {
  crearMesaRef.value.abrirModal(estaEditando, data, estaCerrando);
};

const confirmarCerrar = () => {
  Swal.fire({
    title: `¡Advertencia!`,
    text: `¿Estás seguro de cerrar la caja ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#06B357",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await cerrarCaja();
    }
  });
};

const cerrarCaja = async () => {
  let saldo = 0;
  const tieneMesaAbierta = mesas.value.find((mesa) => mesa.estaAbierto == true);

  if (tieneMesaAbierta) {
    Swal.fire({
      title: `¡Advertencia!`,
      text: `No puedes cerrar la caja porque tienes mesas abiertas`,
      icon: "error",
    });
    return;
  }

  mesas.value.map((mesa) => {
    saldo += parseFloat(mesa.saldo);
  });

  await cajaServices.actualizarCaja(props.idCaja, {
    estaAbierto: false,
    totalCaja: saldo,
    totalMesas: mesas.value.length,
  });

  emit("get-cajas-abiertas");
  emit("get-cajas");
};

const volverDelHistorico = () => {
  emit("volver");
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