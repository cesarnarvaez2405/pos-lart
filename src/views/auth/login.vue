<template>
  <login-layout>
    <template v-slot:firstPage>
      <div
        class="bg-fixed bg-cover bg-center justify-center items-center imagenLogin sm:h-full xl:h-screen"
      ></div>
    </template>

    <template v-slot:secondPage>
      <div
        class="w-full px-10 py-20 2xl:py-40 flex flex-col justify-center items-center shadow-gray-600 gap-4 font-quicksand"
      >
        <img
          src="https://www.vibraniumco.com/logo_lart.png"
          class="w-24"
          alt=""
        />
        <h1 class="text-3xl">¡Hola Artista!</h1>
        <span class="text-gray-500"
          >Ingresa y tienes una infinidad de herramientas para ayudarte</span
        >
        <Form class="w-full" @submit="logearse" v-slot="{ errors }">
          <div
            class="py-4 w-full flex flex-col justify-center items-center gap-3"
          >
            <div class="flex flex-col items-end gap-3 w-1/2">
              <!-- <user-circle-icon class="size-8" /> -->
              <Field
                name="email"
                placeholder="Email"
                class="w-full text-black border-b-2 border-black p-2 focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                type="text"
                rules="required"
                v-model="form.email"
                :class="{
                  ' border-b-red-600 ': errors.email,
                }"
              />
              <error-alert :name="'email'" />
            </div>

            <div class="flex flex-col items-end gap-3 w-1/2">
              <!-- <user-circle-icon class="size-8" /> -->
              <Field
                name="password"
                placeholder="Password"
                class="w-full text-black border-b-2 border-black p-2 focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                type="password"
                rules="required"
                v-model="form.password"
                :class="{
                  ' border-b-red-600 ': errors.password,
                }"
              />
              <error-alert :name="'password'" />
            </div>

            <button
              class="w-1/2 flex justify-center items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
              type="submit"
            >
              <p>Ingresar</p>
              <!-- <spinner-loading v-else /> -->
            </button>
          </div>
        </Form>
      </div>
    </template>
  </login-layout>
</template>

<script setup>
import { reactive } from "vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import { UserCircleIcon } from "@heroicons/vue/24/outline";

import loginLayout from "./layouts/loginLayout.vue";
import errorAlert from "../../components/errorAlert.vue";
import { useAuthStore } from "../../store/auth";
import router from "../../router/index";

const store = useAuthStore();
const form = reactive({
  email: null,
  password: null,
});

const logearse = async () => {
  const usuarioLogueado = await store.login(form);
  if (!usuarioLogueado) {
    limpiar();
  }
  router.push({ name: "inicio" });
};

const limpiar = () => {
  form.email = null;
  form.password = null;
};
</script>

<style scoped>
.imagenLogin {
  background-image: url("https://www.vibraniumco.com/FondoWeb.png");
}
</style>