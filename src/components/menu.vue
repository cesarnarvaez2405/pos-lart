
<template>
  <div
    class="card font-poppins font-semibold shadow-md border-b border-pink-300"
  >
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <a
          v-if="!item.requireAuth || estaLogueado"
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
        >
          <home-icon v-if="item.id == 1" class="size-5" />
          <calculator-icon v-if="item.id == 2" class="size-5" />
          <cog-6-tooth-icon v-if="item.id == 3" class="size-5" />
          <span>{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
        </a>
      </template>

      <template #end>
        <router-link
          :to="estaLogueado ? '#' : '/auth/login'"
          @click="
            (event) => {
              if (estaLogueado) {
                event.preventDefault();
                toggle(event);
              }
            }
          "
        >
          <Avatar
            :label="primerLetra"
            class="mr-2"
            size="large"
            style="background-color: #faa8d2; color: #2a1261"
            shape="circle"
          />
          <Popover ref="op" v-if="estaLogueado">
            <div class="flex flex-col gap-4">
              <div>
                <ul class="list-none p-0 m-0 flex flex-col">
                  <li
                    class="flex items-center gap-2 px-2 py-3 hover:bg-emphasis cursor-pointer rounded-border"
                    @click="cerrarSeccion(member)"
                  >
                    <div>
                      <span class="font-medium">Cerrar session</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Popover>
        </router-link>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  HomeIcon,
  CalculatorIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/outline";

import { estaAutenticado } from "../utils/utilsAuth";
import { useAuthStore } from "../store/auth";
import routerPage from "../router/index";

const router = useRouter();
const store = useAuthStore();

const op = ref();
const nombre = ref("");
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
  {
    id: 3,
    label: "Configuracion",
    command: () => {
      router.push("/config");
    },
    requireAuth: true,
  },
]);

const estaLogueado = computed(() => {
  return estaAutenticado();
});

const primerLetra = computed(() => {
  return store.nombre ? store.nombre.charAt(0).toUpperCase() : "?";
});

const cerrarSeccion = () => {
  store.cerrarSeccion();
  routerPage.push("/");
};

const toggle = (event) => {
  if (estaAutenticado) {
    op.value.toggle(event);
  }
};
</script>
