<template>
  <div
    class="font-poppins"
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
                {{ mesas.length }}
              </h1>
              <h2 class="font-poppins text-sm">Total mesas</h2>
            </div>
          </div>
        </div>

        <div class="border rounded-lg">
          <div class="px-3 py-2 flex justify-start items-center gap-5">
            <div class="flex bg-blue-950 px-2 py-1 rounded-lg">
              <document-currency-dollar-icon class="size-9 text-white" />
            </div>
            <div>
              <h1 class="font-poppins font-semibold text-xl">
                {{ formatCurrency(totalFacturadoActual) }}
              </h1>
              <h2 class="font-poppins text-sm">Total facturado actual</h2>
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
              <h2 class="font-poppins text-sm">Total saldo esperado</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-b"></div>

    <div class="h-full bg-gray-200 px-10 py-10 shadow-inner">
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
              @click="abrirModalCerrarCaja()"
              class="ml-auto bg-red-200 border-red-300 text-red-900 shadow-lg"
              label="Cerrar caja"
              rounded
            />
          </div>
        </div>

        <div
          class="px-4 sm:px-6 md:px-8 lg:px-10 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
        >
          <div
            v-for="mesa in mesas"
            :key="mesa.id"
            class="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col justify-between"
          >
            <div class="flex flex-col gap-3">
              <div class="flex gap-3 items-center">
                <div class="bg-blue-950 px-3 py-1 sm:px-4 sm:py-2 rounded-lg">
                  <span
                    class="font-poppins text-white text-xs sm:text-sm md:text-base"
                  >
                    {{ mesa.id }}
                  </span>
                </div>

                <div class="w-full flex justify-between items-center">
                  <div class="flex flex-col">
                    <h2 class="font-poppins text-sm sm:text-base md:text-lg">
                      {{ mesa.referencias }}
                    </h2>

                    <div v-if="!mesa.estaAbierto">
                      <span
                        v-for="(tipoPago, index) in mesa.tipoPagos"
                        :key="index"
                        class="pl-1 text-xs sm:text-sm font-quicksand"
                      >
                        {{ `${tipoPago?.tipoPago?.nombre}, ` }}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div
                      class="py-1 px-2 rounded-lg flex gap-2 items-center"
                      :class="mesa.estaAbierto ? 'bg-green-300' : 'bg-red-300'"
                    >
                      <check-circle-icon
                        v-if="mesa.estaAbierto"
                        class="h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <x-circle-icon v-else class="h-4 w-4 sm:h-5 sm:w-5" />
                      <span class="text-xs sm:text-sm">
                        {{ mesa.estaAbierto ? "Abierto" : "Cerrado" }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <span class="text-xs sm:text-sm font-quicksand">{{
                  formatDate(mesa.fechaCreacion)
                }}</span>
              </div>
            </div>

            <div class="border-b-2 mt-5"></div>

            <!-- Mini Tabla -->
            <div class="overflow-x-auto">
              <table class="table-auto w-full text-left mt-5">
                <thead>
                  <tr class="border-b text-xs sm:text-sm text-gray-400">
                    <th class="px-2 py-1">Item</th>
                    <th class="px-2 py-1">Cant</th>
                    <th class="px-2 py-1">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in mesa.mesaItems.slice(0, 3)"
                    :key="item.id"
                    class="border-b text-xs sm:text-sm"
                  >
                    <td class="px-2 py-1">{{ item.item.nombre }}</td>
                    <td class="px-2 py-1">{{ item.cantidad }}</td>
                    <td class="px-2 py-1">
                      {{
                        formatCurrency(
                          item.cantidad *
                            parseFloat(item.item.contabilidadItem.valorVenta)
                        )
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Informativo de más ítems -->
            <div
              v-if="mesa.mesaItems.length > 3"
              class="text-xs sm:text-sm text-gray-500 mt-2 text-center"
            >
              Y {{ mesa.mesaItems.length - 3 }} ítems más...
            </div>

            <div class="border-b-2 mt-3"></div>

            <div class="flex justify-between py-4">
              <h2 class="text-xs sm:text-sm md:text-base">Total</h2>
              <h2 class="text-xs sm:text-sm md:text-base">
                {{ formatCurrency(mesa.saldo) }}
              </h2>
            </div>

            <div class="flex justify-center items-center gap-2">
              <Button
                v-if="!mesa.estaAbierto || estaViendoHistorico"
                @click="abrirModalCrearModal(false, mesa, false, true)"
                class="text-xs sm:text-sm bg-yellow-200 text-yellow-900 border-yellow-300 shadow-lg w-full"
                label="Ver detalle"
                raised
              />
              <Button
                v-if="mesa.estaAbierto && !estaViendoHistorico"
                @click="abrirModalCrearModal(true, mesa, false, false)"
                class="text-xs sm:text-sm bg-yellow-200 text-yellow-900 border-yellow-300 shadow-lg w-1/2"
                label="Editar mesa"
                raised
              />
              <Button
                @click="abrirModalCrearModal(false, mesa, true, false)"
                v-if="mesa.estaAbierto && !estaViendoHistorico"
                class="text-xs sm:text-sm bg-red-200 text-red-900 border-red-300 shadow-lg w-1/2"
                label="Cerrar mesa"
                raised
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

    <cerrar-caja-detalle
      ref="cerrarCajaRef"
      :totalMesas="mesas.length"
      :diaActual="diaActual"
      :totalFacturado="totalFacturadoActual"
      @cerrar-caja="confirmarCerrar()"
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
  CheckCircleIcon,
  XCircleIcon,
  DocumentCurrencyDollarIcon,
} from "@heroicons/vue/24/outline";
import mesaServices from "../../../services/mesaServices";
import itemsServices from "../../../services/itemsServices";
import crearMesa from "../components/crearMesa.vue";
import Swal from "sweetalert2";
import cajaServices from "../../../services/cajaServices";
import mesaContabilidadService from "../../../services/mesaContabilidadService";
import cerrarCajaDetalle from "../modals/cerrarCajaDetalle.vue";

const currentTime = ref("");
const currentDate = ref("");
const mesas = ref([]);
const items = ref([]);
const crearMesaRef = ref(null);
const cerrarCajaRef = ref();

const props = defineProps({
  idCaja: {
    type: Number,
    required: true,
  },
  estaViendoHistorico: {
    type: Boolean,
    required: true,
  },
  diaActual: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["get-cajas-abiertas", "get-cajas", "volver"]);

const totalCarrito = computed(() => {
  return mesas.value.reduce((total, mesa) => total + parseFloat(mesa.saldo), 0);
});

const totalFacturadoActual = computed(() => {
  const mesasAbiertas = mesas.value.filter((mesa) => !mesa.estaAbierto);
  return mesasAbiertas.reduce(
    (total, mesa) => total + parseFloat(mesa.saldo),
    0
  );
});

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
  const todasMesas = await mesaServices.getMesaPorCaja(props.idCaja);

  const mesasIds = todasMesas.map((mesa) => {
    return mesa.id;
  });

  const mesasContabilidad = await mesaContabilidadService.buscarPorIds(
    mesasIds
  );

  mesas.value = todasMesas.map((mesa) => {
    const pagosRelacionados = mesasContabilidad.filter(
      (pago) => pago.mesaId === mesa.id
    );

    return {
      ...mesa,
      tipoPagos: pagosRelacionados,
    };
  });
};

const obtenerItems = async () => {
  items.value = await itemsServices.getItems();
};

const abrirModalCrearModal = (
  estaEditando,
  data,
  estaCerrando,
  estaViendoDetalle
) => {
  crearMesaRef.value.abrirModal(
    estaEditando,
    data,
    estaCerrando,
    estaViendoDetalle
  );
};

const abrirModalCerrarCaja = () => {
  cerrarCajaRef.value.abrirModal(mesas.value);
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
  options.timeZone = "UTC";
  return new Date(dateString).toLocaleString("en-US", options);
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