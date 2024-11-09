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

    <!-- Grid de tarjetas de mesas -->
    <div
      class="px-10 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="mesa in mesas"
        :key="mesa.id"
        class="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between"
      >
        <div>
          <!-- Referencia de la mesa -->
          <h2 class="text-lg font-semibold">{{ mesa.referencias }}</h2>
          <!-- Saldo -->
          <p class="text-base font-medium">Saldo: {{ mesa.saldo }}</p>
        </div>

        <!-- Fecha de creación formateada -->

        <!-- Estado de la mesa -->
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

        <div class="pt-2">
          <printer-icon
            class="size-5 cursor-pointer"
            @click="printInvoice(mesa)"
          />
        </div>
      </div>
    </div>

    <crear-mesa ref="crearMesaRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { PrinterIcon } from "@heroicons/vue/24/outline";
import mesaServices from "../../../services/mesaServices";
import crearMesa from "../components/crearMesa.vue";

const currentTime = ref("");
const currentDate = ref("");
const mesas = ref([]);
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

const obtenerMesasPorCaja = async () => {
  mesas.value = await mesaServices.getMesaPorCaja(props.idCaja);
};

const abrirModalCrearModal = () => {
  crearMesaRef.value.abrirModal();
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

const generateTextFile = (data) => {
  // Formatear los datos de la factura para que se adapten a 58mm
  const textContent = `
    =======================
    Factura de Venta
    -----------------------
    Fecha: ${formatDate(data.fechaCreacion)}
    
    Artículos:
    ${data.items.map((item) => `${item.nombre} `).join("\n")}
    
    Total: ${data.saldo}
    =======================
  `;

  // Crear un archivo Blob y descargarlo
  const blob = new Blob([textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "factura.txt";
  link.click();
  URL.revokeObjectURL(url);
};

const printInvoice = (data) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Factura de Venta</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; width: 58mm; }
          .content { text-align: left; margin: 0; }
          .separator { border-top: 1px dashed #000; margin: 5px 0; }
        </style>
      </head>
      <body onload="window.print();window.close()">
        <div class="content">
          <p>========================</p>
          <p>Factura de Venta</p>
          <p>------------------------</p>
          <p>Fecha: ${formatDate(data.fechaCreacion)}</p>
          <p>Cliente: ${data.client}</p>
          <div class="separator"></div>
          ${data.items.map((item) => `<p>${item.nombre} x 0 </p>`).join("")}
          <div class="separator"></div>
          <p>Total: ${data.saldo}</p>
          <p>========================</p>
        </div>
      </body>
    </html>
  `);
};

onMounted(async () => {
  // Llama a updateCurrentTime cada segundo
  updateCurrentTime(); // Actualiza la hora inmediatamente
  updateCurrentDate();
  await obtenerMesasPorCaja();
  const interval = setInterval(updateCurrentTime, 1000);

  // Limpia el intervalo al desmontar el componente
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<style>
</style>