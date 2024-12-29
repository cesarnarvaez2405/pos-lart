<template>
  <Form v-slot="{ errors }">
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
        <div class="flex flex-col">
          <Field
            name="valor"
            placeholder="Valor"
            type="text"
            rules="required"
            v-model="valorPago"
            class="border h-full rounded-md p-1 font-poppins"
            :class="{
              'border-red-500': errors.valor,
            }"
          />
        </div>
        <div>
          <Button
            class="bg-blue-200 text-blue-900 border-blue-300 shadow-lg font-poppins"
            rounded
            autofocus
          >
            <plus-icon class="size-5" />
          </Button>
        </div>
      </div>
    </div>
  </Form>
</template>

<script setup>
import { ref } from "vue";
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
});
</script>

<style></style>
