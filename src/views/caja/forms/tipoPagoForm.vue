<template>
  <Form>
    <div class="flex flex-row gap-2">
      <div>
        <Select
          name="tipoPago"
          v-model="tipoPago"
          :options="tiposPagosData"
          optionLabel="nombre"
          placeholder="Seleccione el tipo de pago"
          class="w-full md:w-56"
          rules="required"
        />
        <error-alert :name="'tipoPago'" />
      </div>

      <div class="flex gap-2">
        <div class="flex flex-col bg-gray-300 px-4 justify-center rounded-md">
          <h3 class="font-bold">{{ formatCurrency(valorPago) }}</h3>
        </div>
      </div>
    </div>
  </Form>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import { PlusIcon } from "@heroicons/vue/24/outline";
import errorAlert from "../../../components/errorAlert.vue";

const tipoPago = ref(null);
const valorPago = ref(0);

const props = defineProps({
  tiposPagosData: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const enviarDato = () => {
  return {
    tipoPago: tipoPago.value,
    valorPago: valorPago.value,
  };
};

const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });
};

onMounted(() => {
  valorPago.value = props.total;
});

defineExpose({
  enviarDato,
});
</script>

<style></style>
