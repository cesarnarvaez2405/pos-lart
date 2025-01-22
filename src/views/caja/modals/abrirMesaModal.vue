<template>
  <modal-mesa-layout ref="modalLayoutRef" :widthModal="'45rem'">
    <template v-slot:titulo>
      <div class="inline-flex items-center justify-center gap-2">
        <h2 class="font-bold whitespace-nowrap text-xl">
          {{ estaEditando ? "Editar mesa" : "Crear mesa" }}
        </h2>
      </div>
    </template>

    <template v-slot:cuerpo>
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
          :disabled="eliminoAlgunItem"
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
          class="p-4 border rounded-lg shadow-lg flex flex-col gap-2"
        >
          <div>
            <h3 class="text-2xl font-semibold">{{ item.nombre }}</h3>
            <p class="text-sm font-bold text-gray-400 mb-2">
              {{ formatCurrency(item.valor) }}
            </p>
          </div>

          <div>
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

          <Button
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
          ¡Si eliminó algún ítem, es obligatorio darle al botón de editar antes
          de ingresar un nuevo ítem!</Message
        >
      </div>

      <div class="pt-5">
        <label class="font-semibold">Total mesa: </label>
        <p class="text-lg font-bold text-red-500">
          {{ formatCurrency(totalCarrito) }}
        </p>
      </div>
    </template>

    <template v-slot:footer>
      <Button
        label="Cancelar"
        text
        severity="danger"
        class="font-poppins"
        @click="emit('clean-filter')"
        autofocus
        v-if="!isLoading"
      />

      <Button
        v-if="!isLoading"
        :label="estaEditando ? 'Editar' : 'Guardar'"
        class="bg-green-200 text-green-900 border-green-300 shadow-lg font-poppins"
        :disabled="totalCarrito <= 0 && referencia.length <= 0"
        @click="estaEditando ? editar() : guardar()"
        autofocus
      />
    </template>
  </modal-mesa-layout>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  PrinterIcon,
} from "@heroicons/vue/24/outline";
import modalMesaLayout from "../layout/modalMesaLayout.vue";

const modalLayoutRef = ref();
const itemSelected = ref(null);
const referencia = ref("");
const selectKey = ref(1);

const props = defineProps({
  estaEditando: {
    type: Boolean,
    default: false,
  },

  totalCarrito: {
    type: Number,
    default: 0,
  },

  itemsAGuardar: {
    type: Array,
    default: [],
  },

  itemsGuardados: {
    type: Array,
    default: [],
  },

  items: {
    type: Array,
    default: [],
    required: true,
  },

  referencia: {
    type: String,
    default: "",
  },

  isLoading: {
    type: Boolean,
    default: false,
  },

  eliminoAlgunItem: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "adicionar-cantidad",
  "agregar-item",
  "eliminar-item",
  "guardar",
  "editar",
  "clean-filter",
]);

const abrirModal = async () => {
  await nextTick();
  modalLayoutRef.value.openModal();

  if (props.estaEditando) {
    referencia.value = props.referencia;
  }
};

const cerrarModal = () => {
  cleanFilter();
  modalLayoutRef.value.cerrarModal();
};

const guardar = () => {
  emit("guardar", referencia.value);
};

const editar = () => {
  emit("editar", referencia.value);
};

const eliminar = (itemMesa) => {
  emit("eliminar-item", itemMesa);
};

const cleanFilter = () => {
  itemSelected.value = null;
  selectKey.value = 1;
  referencia.value = "";
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

  const index = props.itemsAGuardar.findIndex(
    (item) => item.id === newValue.id
  );

  if (index !== -1) {
    emit("adicionar-cantidad", index);
  } else {
    emit(
      "agregar-item",
      newValue.id,
      newValue.nombre,
      newValue.contabilidadItem.valorVenta
    );
  }

  itemSelected.value = null;
  selectKey.value += 10;
});

defineExpose({
  abrirModal,
  cerrarModal,
});
</script>

<style></style>
