-<template>
  <modal-mesa-layout
    ref="modalLayoutRef"
    :widthModal="estaViendoDetalle ? '50rem' : '70rem'"
  >
    <template v-slot:titulo>
      <div class="inline-flex items-center justify-center gap-2">
        <h2 class="font-bold whitespace-nowrap text-xl">
          Resumen de {{ referencia }}
        </h2>
      </div>
    </template>

    <template v-slot:cuerpo>
      <div v-if="!quiereDividir">
        <div
          :class="
            estaViendoDetalle
              ? 'grid grid-cols-1 gap-4'
              : 'grid grid-cols-2 gap-4'
          "
        >
          <div class="flex flex-col">
            <div class="flex flex-col gap-4 p-4 bg-gray-200 rounded-md">
              <h2>Detalle de cuenta</h2>
              <div v-for="(item, index) in itemsAGuardar" :key="index">
                <div class="flex justify-between">
                  <div class="flex flex-col gap-1">
                    <h3 class="font-bold">{{ item.nombre }}</h3>
                    <h3>{{ formatCurrency(item.valor) }}</h3>
                  </div>
                  <div class="flex justify-center items-center">
                    <h3 class="font-bold">x {{ item.cantidad }}</h3>
                  </div>
                </div>
              </div>

              <div class="border-t border-black pt-2">
                <div class="flex justify-between pb-2">
                  <h3 class="font-bold">Total</h3>
                  <h3 class="font-bold">{{ formatCurrency(totalCarrito) }}</h3>
                </div>
                <div class="flex justify-between">
                  <h3 class="font-bold">Tipo de pago</h3>
                  <h3 class="font-bold">{{ tipoPago }}</h3>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2" v-if="!estaViendoDetalle">
            <div>
              <h2 class="font-bold">Seleccione el tipo de pago</h2>
              <tipo-pago-form
                ref="tipoPagoFormRef"
                :tiposPagosData="tiposPagosData"
                :total="totalCarrito"
              />
            </div>

            <div>
              <button class="text-blue-600" @click="ingresarPestanaDividir()">
                ¿Deseas dividir la cuenta?
              </button>
            </div>

            <Message
              v-if="noEsValidoCerrarCaja"
              class="mt-4 bg-blue-200 text-blue-900 border-blue-300 shadow-lg text-sm"
            >
              Tienes que seleccionar algun tipo de pago para poder cerrar la
              caja</Message
            >
          </div>
        </div>
      </div>

      <div v-else>
        <div class="flex flex-col gap-2">
          <Button
            @click="regresarPestaña()"
            class="mr-auto bg-blue-950 border-0"
            label="Volver"
            rounded
          />
          <edit-table
            ref="editTableRef"
            :keyTable="editTableKey"
            :items="itemsMesa"
            :originalItems="itemsAGuardar"
            :columns="columns"
          />
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <Button
        label="Cancelar"
        text
        severity="danger"
        class="font-poppins"
        autofocus
        @click="emit('clean-filter')"
      />

      <Button
        label="Cerrar Caja"
        class="bg-orange-200 text-orange-900 border-orange-300 shadow-lg font-poppins"
        autofocus
        v-if="!quiereDividir && !estaViendoDetalle"
        @click="cerrarMesa()"
      />
      <Button
        v-if="quiereDividir && !estaViendoDetalle"
        label="Dividir"
        class="bg-yellow-200 text-yellow-900 border-yellow-300 shadow-lg font-poppins"
        autofocus
        @click="dividirMesa()"
      />
    </template>
  </modal-mesa-layout>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";

import modalMesaLayout from "../layout/modalMesaLayout.vue";
import tipoPagoForm from "../forms/tipoPagoForm.vue";
import editTable from "../../../components/editTable.vue";
import mesaItemsService from "../../../services/mesaItemsService";

const modalLayoutRef = ref();
const editTableRef = ref();
const quiereDividir = ref(false);
const itemsMesa = ref([]);
const editTableKey = ref(10);
const tipoPagoFormRef = ref();
const noEsValidoCerrarCaja = ref(false);
const columns = ref([
  {
    field: "id",
    header: "id",
  },
  {
    field: "nombre",
    header: "Item",
  },
  {
    field: "valor",
    header: "Valor Item",
  },
  {
    field: "cantidad",
    header: "Cantidad",
  },
]);

const props = defineProps({
  referencia: {
    type: String,
    required: true,
  },

  itemsAGuardar: {
    type: Array,
    required: true,
  },

  estaViendoDetalle: {
    type: Boolean,
    required: true,
    default: false,
  },

  totalCarrito: {
    type: Number,
    required: true,
  },

  estaCerrando: {
    type: Boolean,
    default: false,
  },

  tiposPagosData: {
    type: Array,
    default: [],
    required: true,
  },

  idMesa: {
    type: Number,
    required: true,
  },

  idCaja: {
    type: Number,
    required: true,
  },

  tipoPago: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "clean-filter",
  "abrir-mesa-dividida",
  "cerrar-mesa",
]);

const openModal = () => {
  modalLayoutRef.value.openModal();
  itemsMesa.value = JSON.parse(JSON.stringify(props.itemsAGuardar));
};

const cerrarModal = () => {
  modalLayoutRef.value.cerrarModal();
  quiereDividir.value = false;
};

const ingresarPestanaDividir = () => {
  quiereDividir.value = true;
  editTableKey.value += 10;
};

const regresarPestaña = () => {
  quiereDividir.value = false;
  itemsMesa.value = JSON.parse(JSON.stringify(props.itemsAGuardar));
};

const cerrarMesa = () => {
  const form = tipoPagoFormRef.value.enviarDato();

  if (!form?.tipoPago) {
    noEsValidoCerrarCaja.value = true;
    return;
  }

  noEsValidoCerrarCaja.value = false;

  emit("cerrar-mesa", {
    ...form,
    idMesa: props.idMesa,
  });
};

const dividirMesa = async () => {
  if (!editTableRef.value.selectedProduct) {
    return;
  }

  const itemsSelected = JSON.parse(
    JSON.stringify(editTableRef.value.selectedProduct)
  );

  const itemsADividir = itemsSelected.map((item) => {
    return {
      ...item,
      cantidad: parseInt(item.cantidad, 10),
    };
  });

  if (!validarCantidadItems(itemsADividir, props.itemsAGuardar).resultado) {
    Swal.fire({
      title: `¡Advertencia!`,
      text: `La cantidad del item "${
        validarCantidadItems(itemsADividir, props.itemsAGuardar).item
      }" es mayor al guardado. `,
      icon: "error",
    });
    return;
  }

  const itemsFiltrados = props.itemsAGuardar.filter((itemOriginal) =>
    itemsADividir.some((itemDividir) => itemDividir.id === itemOriginal.id)
  );

  const itemsFiltradosFormated = JSON.parse(JSON.stringify(itemsFiltrados));

  const itemsRestados = itemsFiltradosFormated.map((itemOriginal) => {
    const itemDividir = itemsADividir.find(
      (item) => item.id === itemOriginal.id
    );

    if (itemDividir) {
      return {
        ...itemOriginal,
        cantidad: itemOriginal.cantidad - itemDividir.cantidad,
      };
    }
    return itemOriginal;
  });

  let saldoCajaNueva = 0;

  for (const item of itemsADividir) {
    const valorItem = parseInt(item.valor) * item.cantidad;
    saldoCajaNueva += valorItem;
  }

  const itemsAEliminar = itemsRestados.filter(
    (itemRestado) => itemRestado.cantidad == 0
  );

  const mesasItemEliminar = itemsAEliminar.map((item) => item.idMesaItem);
  const itemsRestadosFilter = itemsRestados.filter(
    (itemRestado) => itemRestado.cantidad != 0
  );

  const mesaItemEditar = itemsRestadosFilter.map((item) => {
    return {
      idMesaItem: item.idMesaItem,
      cantidad: item.cantidad,
    };
  });

  const items = itemsADividir.map((item) => {
    return {
      itemId: item.id,
      mesaId: 1,
      cantidad: item.cantidad,
    };
  });

  const queryData = {
    mesaItemEditar: mesaItemEditar.length >= 0 ? mesaItemEditar : null,
    mesasItemEliminar: mesasItemEliminar.length >= 0 ? mesasItemEliminar : null,
    items,
    referencias: `Division de mesa ${props.idMesa}`,
    saldo: saldoCajaNueva,
    cajaId: props.idCaja,
    estaAbierto: true,
    ultimaMesaId: props.idMesa,
  };

  const mesaCreada = await mesaItemsService.dividirMesa(queryData);
  emit("clean-filter");
  abrirMesaDividida(mesaCreada);
};

const abrirMesaDividida = (data) => {
  emit("abrir-mesa-dividida", data);
};

const validarCantidadItems = (itemsADividir, itemsAGuardar) => {
  for (const itemDividir of itemsADividir) {
    const itemOriginal = itemsAGuardar.find(
      (item) => item.id === itemDividir.id
    );

    if (itemOriginal && itemDividir.cantidad > itemOriginal.cantidad) {
      return {
        item: itemDividir.nombre,
        resultado: false,
      };
    }
  }
  return {
    item: null,
    resultado: true,
  };
};

const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });
};

defineExpose({
  openModal,
  cerrarModal,
});
</script>

<style>
.swal2-container {
  z-index: 2000;
}
</style>