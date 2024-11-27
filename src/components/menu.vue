
<template>
  <div
    class="card font-poppins font-semibold shadow-md border-b border-pink-300"
  >
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a
          v-else
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
        >
          <home-icon v-if="item.id == 1" class="size-5" />
          <calculator-icon v-if="item.id == 2" class="size-5" />

          <span>{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
        </a>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <Avatar
            label="V"
            class="mr-2"
            size="large"
            style="background-color: #faa8d2; color: #2a1261"
            shape="circle"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { HomeIcon, CalculatorIcon } from "@heroicons/vue/24/outline";

const router = useRouter();

const items = ref([
  {
    id: 1,
    label: "Inicio",
    command: () => {
      router.push("/");
    },
  },
  {
    id: 2,
    label: "Caja",
    command: () => {
      router.push("/caja");
    },
  },
]);
</script>
