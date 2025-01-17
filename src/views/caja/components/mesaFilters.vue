<template>
  <div
    class="h-full flex justify-start items-center border px-2 rounded-md shadow-inner gap-4"
  >
    <FunnelIcon class="size-5" />
    <div class="py-2 flex flex-row justify-center items-center gap-4">
      <div>
        <IftaLabel>
          <DatePicker
            v-model="fechaInicio"
            size="small"
            inputId="date"
            showIcon
            iconDisplay="input"
            variant="filled"
            class="h-10"
          />
          <label for="date">Fecha inicio</label>
        </IftaLabel>
      </div>

      <h2 class="font-bold">-</h2>

      <div>
        <IftaLabel>
          <DatePicker
            v-model="fechaFin"
            size="small"
            inputId="date"
            showIcon
            iconDisplay="input"
            variant="filled"
            class="h-10"
          />
          <label for="date">Fecha fin</label>
        </IftaLabel>
      </div>

      <div>
        <Button
          class="font-poppins bg-blue-950 border-0"
          label="Aplicar"
          severity="info"
          raised
          @click="aplicarFiltros()"
        />
      </div>

      <div>
        <trash-icon
          class="size-5 hover:text-black cursor-pointer transition-all ease-in-out"
          @click="borrarFiltros()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { FunnelIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";

const fechaInicio = ref(null);
const fechaFin = ref(null);

const emit = defineEmits(["obtener-caja"]);

const aplicarFiltros = () => {
  const query = {
    fechaInicio: fechaInicio.value?.toISOString().split("T")[0],
    fechaFin: fechaFin.value?.toISOString().split("T")[0],
  };

  emit("obtener-caja", query);
};

const borrarFiltros = () => {
  fechaInicio.value = null;
  fechaFin.value = null;

  aplicarFiltros();
};

onMounted(() => {
  const currentYear = new Date().getFullYear();
  fechaInicio.value = new Date(currentYear, 0, 1);
  fechaFin.value = new Date(currentYear, 11, 31);

  aplicarFiltros();
});
</script>

<style>
</style>