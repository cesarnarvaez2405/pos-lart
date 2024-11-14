
<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Edit Profile"
    :style="{ width: '45rem' }"
    :closable="false"
  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <h2 class="font-bold whitespace-nowrap text-xl" v-if="estaEditando">
          Editar mesa
        </h2>
        <h2 class="font-bold whitespace-nowrap text-xl" v-else>Crear mesa</h2>
      </div>
    </template>

    <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Digite la siguiente informacion</span
    >
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">Mesa N°</label>
      <InputText
        id="referencia"
        v-model="referencia"
        class="flex-auto"
        autocomplete="off"
      />
    </div>

    <div class="flex items-center gap-4 mb-2">
      <label for="username" class="font-semibold w-24">Productos</label>
      <Select
        v-model="itemSelected"
        :options="items"
        filter
        optionLabel="descripcion"
        placeholder="Selecciona un producto"
        class="w-full"
        :key="selectKey"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center">
            <div>{{ slotProps.value.descripcion }}</div>
          </div>
        </template>
      </Select>
    </div>

    <div class="w-full border mt-8 mb-4"></div>

    <div class="pb-4">
      <label class="font-semibold">Productos</label>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(item, index) in itemsAGuardar"
        :key="index"
        class="p-4 border rounded-lg shadow-lg"
      >
        <h3 class="text-xl font-semibold">{{ item.nombre }}</h3>
        <p class="text-lg font-bold text-red-500">
          {{ formatCurrency(item.valor) }}
        </p>
        <p>Cantidad: {{ item.cantidad }}</p>
        <trash-icon
          @click="eliminar(item)"
          class="mt-2 size-5 cursor-pointer"
        />
      </div>
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

      <Button
        label="Cancelar"
        text
        severity="danger"
        @click="cleanFilter()"
        autofocus
        v-if="!isLoading"
      />

      <Button
        v-if="!isLoading"
        :label="estaEditando ? 'Editar' : 'Guardar'"
        severity="success"
        :disabled="totalCarrito <= 0 && referencia.length <= 0"
        @click="estaEditando ? editar() : guardar()"
        autofocus
      />
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/vue/24/outline";
import mesaServices from "../../../services/mesaServices";
import mesaItemsService from "../../../services/mesaItemsService";
import { onMounted } from "vue";

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

const abrirModal = (editando, data) => {
  visible.value = true;
  if (!editando) {
    return;
  }
  console.log(data);
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
        (itemAGuardar) => itemGuardado.idMesaItem === itemAGuardar.idMesaItem
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

const cleanFilter = () => {
  visible.value = false;
  itemsAGuardar.value = [];
  itemSelected.value = null;
  referencia.value = "";
  estaEditando.value = false;
  itemsGuardados.value = [];
  isLoading.value = false;
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