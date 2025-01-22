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
                  <div class="flex justify-center items-center">
                    <h3 class="font-bold">
                      {{ formatCurrency(item.valor * item.cantidad) }}
                    </h3>
                  </div>
                </div>
              </div>

              <div class="border-t border-black pt-2">
                <div class="flex justify-between">
                  <h3 class="font-bold">Total</h3>
                  <h3 class="font-bold bg-red-300 px-2 rounded-md">
                    {{ formatCurrency(totalCarrito) }}
                  </h3>
                </div>
              </div>
              <div class="border-t border-black pt-2">
                <div class="flex justify-between" v-if="estaViendoDetalle">
                  <div class="flex justify-center items-center">
                    <h3 class="font-bold">Tipo de pago</h3>
                  </div>
                  <div class="flex flex-col items-end justify-center font-bold">
                    <h3 v-for="(tipoPago, index) in tiposPagos" :key="index">
                      {{ tipoPago?.tipoPago.nombre }} -
                      {{ formatCurrency(tipoPago.valor) }}
                    </h3>
                  </div>
                </div>
              </div>
              <div class="border-t border-black pt-2">
                <div class="flex justify-between">
                  <h3 class="font-bold">Valor pagado</h3>
                  <h3 class="font-bold bg-green-300 px-2 rounded-md">
                    {{ formatCurrency(valorPagado) }}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2" v-if="!estaViendoDetalle">
            <h2 class="font-bold">Seleccione el tipo de pago</h2>
            <div
              v-for="(cant, index) in cantTiposPagos"
              :key="index"
              class="flex justify-start items-center gap-3"
            >
              <tipo-pago-form
                :ref="(el) => (tipoPagoFormRefs[index] = el)"
                :tiposPagosData="tiposPagosData"
                :total="totalCarrito - valorTotalACerrar"
              />

              <minus-circle-icon
                class="size-5 text-red-600 cursor-pointer"
                v-if="index !== 0"
                @click="eliminaTipoPago()"
              />
            </div>

            <div class="flex gap-3">
              <button class="text-blue-600" @click="agregarTipoPago()">
                ¿Deseas añadir otro tipo de pago?
              </button>
              <span>o</span>
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
        label="Cerrar Mesa"
        class="bg-orange-200 text-orange-900 border-orange-300 shadow-lg font-poppins"
        autofocus
        :disabled="totalCarrito !== valorTotalACerrar"
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
import { computed, ref } from "vue";
import Swal from "sweetalert2";
import { MinusCircleIcon } from "@heroicons/vue/24/outline";

import modalMesaLayout from "../layout/modalMesaLayout.vue";
import tipoPagoForm from "../forms/tipoPagoForm.vue";
import editTable from "../../../components/editTable.vue";
import mesaItemsService from "../../../services/mesaItemsService";

const modalLayoutRef = ref();
const editTableRef = ref();
const quiereDividir = ref(false);
const itemsMesa = ref([]);
const editTableKey = ref(10);
const tipoPagoFormRefs = ref([]);
const noEsValidoCerrarCaja = ref(false);
const cantTiposPagos = ref(1);
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

  tiposPagos: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits([
  "clean-filter",
  "abrir-mesa-dividida",
  "cerrar-mesa",
]);

const valorTotalACerrar = computed(() => {
  const tipoPagosValues = [];
  tipoPagoFormRefs.value.forEach((ref) => {
    if (ref) {
      const form = ref.enviarDato();
      tipoPagosValues.push(form);
    }
  });

  return tipoPagosValues.reduce(
    (total, tipoPago) => total + parseFloat(tipoPago.valorPago),
    0
  );
});

const valorPagado = computed(() => {
  let valorPagado = 0;
  props.tiposPagos.forEach((tipoPago) => {
    valorPagado += tipoPago.valor;
  });
  return valorPagado;
});

const openModal = () => {
  modalLayoutRef.value.openModal();
  itemsMesa.value = JSON.parse(JSON.stringify(props.itemsAGuardar));
};

const cerrarModal = () => {
  modalLayoutRef.value.cerrarModal();
  quiereDividir.value = false;
  cantTiposPagos.value = 1;
  tipoPagoFormRefs.value = [];
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
  const tipoPagoValues = [];

  tipoPagoFormRefs.value.forEach((ref) => {
    if (ref) {
      const form = ref.enviarDato();
      tipoPagoValues.push(form);
    }
  });

  for (const tipoPago of tipoPagoValues) {
    if (!tipoPago?.tipoPago) {
      noEsValidoCerrarCaja.value = true;
      return;
    }

    if (!tipoPago?.valorPago > 0) {
      noEsValidoCerrarCaja.value = true;
      return;
    }
  }

  noEsValidoCerrarCaja.value = false;

  emit("cerrar-mesa", {
    tipoPagoValues,
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

const agregarTipoPago = () => {
  cantTiposPagos.value++;
};

const eliminaTipoPago = () => {
  cantTiposPagos.value--;
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