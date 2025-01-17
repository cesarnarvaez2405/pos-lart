
<template>
  <cerrar-mesas-modal
    ref="modalCerrarMesasRef"
    :referencia="referencia"
    :itemsAGuardar="itemsAGuardar"
    :estaViendoDetalle="estaViendoDetalle"
    :totalCarrito="totalCarrito"
    :estaCerrando="estaCerrando"
    :tiposPagosData="tiposPagosData"
    :idMesa="idMesaAEditar"
    :idCaja="idCaja"
    :tipoPago="tipoPago"
    @clean-filter="cleanFilter"
    @abrir-mesa-dividida="obtenerDataMesa"
    @cerrar-mesa="cerrarMesa"
  />

  <abrir-mesa-modal
    ref="modalAbrirMesasRef"
    :estaEditando="estaEditando"
    :totalCarrito="totalCarrito"
    :itemsAGuardar="itemsAGuardar"
    :itemsGuardados="itemsGuardados"
    :items="items"
    :referencia="referencia"
    :isLoading="isLoading"
    :eliminoAlgunItem="eliminoAlgunItem"
    @adicionar-cantidad="adicionarCantidad"
    @agregar-item="agregarItem"
    @eliminar-item="eliminar"
    @guardar="guardar"
    @editar="editar"
    @clean-filter="cleanFilter"
  />
</template>

<script setup>
import { computed, ref } from "vue";
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  PrinterIcon,
} from "@heroicons/vue/24/outline";
import cerrarMesasModal from "../modals/cerrarMesasModal.vue";
import abrirMesaModal from "../modals/abrirMesaModal.vue";
import mesaServices from "../../../services/mesaServices";
import mesaItemsService from "../../../services/mesaItemsService";
import facturacionService from "../../../services/facturacionService";
import tiposPagosServices from "../../../services/tiposPagosServices";
import mesaContabilidadService from "../../../services/mesaContabilidadService";

const modalCerrarMesasRef = ref();
const modalAbrirMesasRef = ref();

const itemsGuardados = ref([]);
const itemsAGuardar = ref([]);

const referencia = ref("");
const isLoading = ref(false);
const estaEditando = ref(false);
const idMesaAEditar = ref(0);
const mesaEstaAbierta = ref(true);
const estaCerrando = ref(false);
const estaViendoDetalle = ref(false);
const eliminoAlgunItem = ref(false);
const tiposPagosData = ref([]);
const tipoPago = ref("");

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
  if (editando == undefined) {
    modalAbrirMesasRef.value.abrirModal();
    return;
  }

  estaEditando.value = editando;
  estaViendoDetalle.value = estaViendoDetalleVal;
  idMesaAEditar.value = data.id;
  referencia.value = data.referencias;
  tipoPago.value = data.contabilidadMesa?.tipoPago?.nombre;

  mesaEstaAbierta.value = data.estaAbierto;

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

  if (estaEditando.value) {
    modalAbrirMesasRef.value.abrirModal();
    return;
  }

  if (estaCerrandoValue) {
    modalCerrarMesasRef.value.openModal();
    estaCerrando.value = estaCerrandoValue;
    await obtenerTiposPagos();
  }

  if (estaViendoDetalle.value) {
    modalCerrarMesasRef.value.openModal();
  }
};

const adicionarCantidad = (index) => {
  itemsAGuardar.value[index].cantidad += 1;
};

const agregarItem = (id, nombre, valor) => {
  itemsAGuardar.value.push({
    id,
    nombre,
    valor,
    cantidad: 1,
    estaGuardado: false,
  });
};

const guardar = async (referenciaValue) => {
  isLoading.value = true;
  const mesa = await mesaServices.crearMesa({
    referencias: `Mesa ${referenciaValue}`,
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

const editar = async (referencia) => {
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

  await editarMesa(referencia);
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

const editarMesa = async (referencia) => {
  await mesaServices.editarMesa(idMesaAEditar.value, {
    referencias: referencia,
    saldo: totalCarrito.value,
  });
};

const editarMesaItem = async (id, data) => {
  await mesaItemsService.editarMesaItem(id, data);
};

const cerrarMesa = async (mesaContabilidadData) => {
  isLoading.value = true;

  const contabilidadMesa = await crearMesaContabilidad({
    mesaId: mesaContabilidadData.idMesa,
    tipoPagoId: mesaContabilidadData.tipoPago.id,
    valor: mesaContabilidadData.valorPago,
  });

  await mesaServices.editarMesa(idMesaAEditar.value, {
    estaAbierto: false,
    contabilidadMesaId: contabilidadMesa.id,
  });

  isLoading.value = false;
  cleanFilter();
  emit("obtenerMesasPorCaja");
  // await imprimirFactura();
};

const crearMesaContabilidad = async (data) => {
  return await mesaContabilidadService.crearMesaContabilidad(data);
};

const obtenerDataMesa = async (data) => {
  emit("obtenerMesasPorCaja");
  const mesaData = await mesaServices.buscarPorId(data.id);
  await abrirModal(false, mesaData, true, false);
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
  if (estaCerrando.value || estaViendoDetalle.value) {
    modalCerrarMesasRef.value.cerrarModal();
  }

  if (
    (!estaEditando.value && !estaCerrando.value) ||
    estaEditando.value == true
  ) {
    modalAbrirMesasRef.value.cerrarModal();
  }

  itemsAGuardar.value = [];
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

defineExpose({
  abrirModal,
});
</script>


<style>
</style>