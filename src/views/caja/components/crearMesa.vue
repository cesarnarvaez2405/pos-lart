
<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Edit Profile"
    :style="{ width: '45rem' }"
    :closable="false"
  >
    <template #header>
      <div
        class="inline-flex items-center justify-center gap-2"
        v-if="!estaCerrando"
      >
        <h2 class="font-bold whitespace-nowrap text-xl" v-if="estaEditando">
          Editar mesa
        </h2>
        <h2 class="font-bold whitespace-nowrap text-xl" v-else>Crear mesa</h2>
      </div>

      <div class="inline-flex items-center justify-center gap-2" v-else>
        <h2 class="font-bold whitespace-nowrap text-xl">
          Resumen de {{ referencia }}
        </h2>
      </div>
    </template>

    <span
      class="text-surface-500 dark:text-surface-400 block mb-8"
      v-if="!estaCerrando"
      >Digite la siguiente informacion</span
    >
    <div class="flex items-center gap-4 mb-4" v-if="!estaCerrando">
      <label for="username" class="font-semibold w-24" v-if="!estaCerrando"
        >Mesa N°</label
      >
      <InputText
        id="referencia"
        v-model="referencia"
        class="flex-auto"
        autocomplete="off"
        v-if="!estaCerrando"
      />
    </div>

    <div class="flex items-center gap-4 mb-2" v-if="!estaCerrando">
      <label for="username" class="font-semibold w-24" v-if="!estaCerrando"
        >Productos</label
      >
      <Select
        v-if="!estaCerrando"
        v-model="itemSelected"
        :options="items"
        filter
        optionLabel="descripcion"
        placeholder="Selecciona un producto"
        class="w-full"
        :key="selectKey"
        :disabled="eliminoAlgunItem"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center">
            <div>{{ slotProps.value.descripcion }}</div>
          </div>
        </template>
      </Select>
    </div>

    <div class="w-full border mt-8 mb-4" v-if="!estaCerrando"></div>

    <div class="pb-4">
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

        <div v-if="!estaCerrando">
          <InputNumber
            v-model="item.cantidad"
            inputId="horizontal-buttons"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            fluid
            :incrementButtonClass="' rounded-full border-0 ml-1 bg-green-300 text-black border-green-500  '"
            :decrementButtonClass="' rounded-full border-0 mr-1 text-black bg-gray-300 border-red-500 '"
            :inputClass="' py-1 border-0 text-center shadow-none'"
            :min="1"
          >
            <template #incrementbuttonicon>
              <plus-icon class="size-5" />
            </template>
            <template #decrementbuttonicon>
              <minus-icon class="size-5" />
            </template>
          </InputNumber>
        </div>

        <div class="flex gap-2" v-else>
          <span class="font-quicksand">Cantidad: </span>
          <span class="font-semibold">{{ item.cantidad }}</span>
        </div>

        <Button
          v-if="!estaCerrando"
          @click="eliminar(item)"
          class="text-sm bg-red-200 text-red-900 border-red-300 shadow-lg w-full font-poppins py-1"
          label="Eliminar "
          raised
        />
      </div>
    </div>

    <div v-if="eliminoAlgunItem">
      <Message
        class="mt-4 bg-yellow-200 text-yellow-900 border-yellow-300 shadow-lg text-sm"
      >
        ¡Si eliminó algún ítem, es obligatorio darle al botón de editar antes de
        ingresar un nuevo ítem!</Message
      >
    </div>

    <div class="pt-4" v-if="estaCerrando && !estaViendoDetalle">
      <label class="font-semibold">Tipo de pago</label>
    </div>

    <div class="pt-4" v-if="estaCerrando && !estaViendoDetalle">
      <Select
        v-model="tipoPago"
        :options="tiposPagosData"
        optionLabel="nombre"
        placeholder="Seleccione el tipo de pago"
        class="w-full md:w-56"
      />
    </div>

    <div class="pt-4">
      <label class="font-semibold">Total: </label>
      <p class="text-lg font-bold text-red-500">
        {{ formatCurrency(totalCarrito) }}
      </p>
    </div>

    <template #footer>
      <ProgressSpinner
        style="width: 30px; height: 30px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
        v-if="isLoading"
      />

      <printer-icon
        @click="imprimirFactura()"
        class="mt-2 size-7 cursor-pointer"
        v-if="!isLoading && estaCerrando && !estaViendoDetalle"
      />

      <Button
        label="Cancelar"
        text
        severity="danger"
        class="font-poppins"
        @click="cleanFilter()"
        autofocus
        v-if="!isLoading && !estaViendoDetalle"
      />

      <Button
        v-if="!isLoading && !estaCerrando && !estaViendoDetalle"
        :label="estaEditando ? 'Editar' : 'Guardar'"
        class="bg-green-200 text-green-900 border-green-300 shadow-lg font-poppins"
        :disabled="totalCarrito <= 0 && referencia.length <= 0"
        @click="estaEditando ? editar() : guardar()"
        autofocus
      />

      <Button
        v-if="!isLoading && estaCerrando && !estaViendoDetalle"
        label="Cerrar mesa"
        rounded
        class="bg-yellow-200 text-yellow-900 border-yellow-300 shadow-lg font-poppins"
        :disabled="
          (totalCarrito <= 0 && referencia.length <= 0) || tipoPago == null
        "
        @click="cerrarMesa()"
        autofocus
      />

      <Button
        v-if="estaViendoDetalle"
        label="Salir"
        class="bg-yellow-200 text-yellow-900 border-yellow-300 shadow-lg font-poppins"
        rounded
        :disabled="totalCarrito <= 0 && referencia.length <= 0"
        @click="cleanFilter()"
        autofocus
      />
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  PrinterIcon,
} from "@heroicons/vue/24/outline";
import mesaServices from "../../../services/mesaServices";
import mesaItemsService from "../../../services/mesaItemsService";
import facturacionService from "../../../services/facturacionService";
import tiposPagosServices from "../../../services/tiposPagosServices";

const visible = ref(false);
const itemSelected = ref(null);
const itemsGuardados = ref([]);
const itemsAGuardar = ref([]);
const selectKey = ref(1);
const referencia = ref("");
const isLoading = ref(false);
const estaEditando = ref(false);
const idMesaAEditar = ref(null);
const mesaEstaAbierta = ref(true);
const estaCerrando = ref(false);
const estaViendoDetalle = ref(false);
const eliminoAlgunItem = ref(false);
const tiposPagosData = ref([]);
const tipoPago = ref(null);

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  idCaja: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["obtenerMesasPorCaja"]);

const itemTotal = (item) => {
  return item.valor * item.cantidad;
};

const totalCarrito = computed(() => {
  return itemsAGuardar.value.reduce(
    (total, item) => total + itemTotal(item),
    0
  );
});

const abrirModal = async (
  editando,
  data,
  estaCerrandoValue,
  estaViendoDetalleVal
) => {
  visible.value = true;
  if (!editando) {
    return;
  }
  estaViendoDetalle.value = estaViendoDetalleVal;
  mesaEstaAbierta.value = data.estaAbierto;
  idMesaAEditar.value = data.id;
  estaEditando.value = editando;
  referencia.value = data.referencias;
  for (const itemMesa of data.mesaItems) {
    itemsAGuardar.value.push({
      idMesaItem: itemMesa.id,
      id: itemMesa.item.id,
      nombre: itemMesa.item.nombre,
      valor: itemMesa.item.contabilidadItem.valorVenta,
      cantidad: itemMesa.cantidad,
      estaGuardado: true,
    });

    itemsGuardados.value.push({
      idMesaItem: itemMesa.id,
      id: itemMesa.item.id,
      nombre: itemMesa.item.nombre,
      valor: itemMesa.item.contabilidadItem.valorVenta,
      cantidad: itemMesa.cantidad,
      estaGuardado: true,
    });
  }

  if (estaCerrandoValue) {
    estaCerrando.value = estaCerrandoValue;
    await obtenerTiposPagos();
  }
};

const guardar = async () => {
  isLoading.value = true;
  const mesa = await mesaServices.crearMesa({
    referencias: `Mesa ${referencia.value}`,
    estaAbierto: true,
    cajaId: props.idCaja,
    saldo: totalCarrito.value,
  });

  for (const item of itemsAGuardar.value) {
    await crearMesaItem(item, mesa);
  }
  cleanFilter();
  emit("obtenerMesasPorCaja");
};

const editar = async () => {
  const elementosEliminados = itemsGuardados.value.filter(
    (itemGuardado) =>
      !itemsAGuardar.value.some(
        (itemAGuardar) => itemAGuardar.id === itemGuardado.id
      )
  );

  const nuevosElementos = itemsAGuardar.value.filter(
    (itemGuardado) =>
      !itemsGuardados.value.some(
        (itemAGuardar) =>
          itemGuardado.idMesaItem === itemAGuardar.idMesaItem ||
          itemGuardado.id === itemAGuardar.id
      )
  );

  for (const elementoAEliminar of elementosEliminados) {
    await eliminarDeBd(elementoAEliminar);
  }

  for (const nuevoElemento of nuevosElementos) {
    await crearMesaItem(nuevoElemento);
  }

  for (const item of itemsAGuardar.value) {
    if (item.estaGuardado) {
      await editarMesaItem(item.idMesaItem, {
        cantidad: item.cantidad,
      });
    }
  }

  await editarMesa();
  cleanFilter();
  emit("obtenerMesasPorCaja");
};

const eliminar = async (itemMesa) => {
  const index = itemsAGuardar.value.findIndex(
    (item) => item.id === itemMesa.id
  );

  if (index !== -1) {
    eliminoAlgunItem.value = true;
    itemsAGuardar.value.splice(index, 1);
  }
};

const eliminarDeBd = async (data) => {
  await mesaItemsService.eliminarMesaItem(data.idMesaItem);
};

const crearMesaItem = async (data, mesa) => {
  const idMesaCreado = estaEditando.value ? idMesaAEditar.value : mesa.id;
  await mesaItemsService.crearMesaItems({
    itemId: data.id,
    mesaId: idMesaCreado,
    cantidad: data.cantidad,
  });
};

const editarMesa = async () => {
  await mesaServices.editarMesa(idMesaAEditar.value, {
    referencias: referencia.value,
    saldo: totalCarrito.value,
  });
};

const editarMesaItem = async (id, data) => {
  await mesaItemsService.editarMesaItem(id, data);
};

const cerrarMesa = async () => {
  isLoading.value = true;
  await mesaServices.editarMesa(idMesaAEditar.value, {
    tipoPagoId: tipoPago.value.id,
    estaAbierto: false,
  });
  await imprimirFactura();
  isLoading.value = false;
  cleanFilter();
  emit("obtenerMesasPorCaja");
};

const imprimirFactura = async () => {
  isLoading.value = true;
  const fechaActual = updateCurrentDate();
  const data = {
    idMesa: idMesaAEditar.value,
    items: itemsAGuardar.value,
    totalItems: itemsAGuardar.value.length,
    fecha: fechaActual,
  };
  await facturacionService.getImprimirFactura(data);
  isLoading.value = false;
};

const obtenerTiposPagos = async () => {
  tiposPagosData.value = await tiposPagosServices.getTiposPagos();
};

const updateCurrentDate = () => {
  const now = new Date();
  return now.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const cleanFilter = () => {
  visible.value = false;
  itemsAGuardar.value = [];
  itemSelected.value = null;
  referencia.value = "";
  estaEditando.value = false;
  itemsGuardados.value = [];
  isLoading.value = false;
  estaCerrando.value = false;
  eliminoAlgunItem.value = false;
  tiposPagosData.value = [];
  tipoPago.value = null;
  estaViendoDetalle.value = false;
};

const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });
};

watch(itemSelected, (newValue, oldValue) => {
  if (!newValue) {
    return;
  }

  const index = itemsAGuardar.value.findIndex(
    (item) => item.id === newValue.id
  );

  if (index !== -1) {
    itemsAGuardar.value[index].cantidad += 1;
  } else {
    itemsAGuardar.value.push({
      id: newValue.id,
      nombre: newValue.nombre,
      valor: newValue.contabilidadItem.valorVenta,
      cantidad: 1,
      estaGuardado: false,
    });
  }

  itemSelected.value = null;
  selectKey.value += 10;
});

defineExpose({
  abrirModal,
});
</script>


<style>
</style>