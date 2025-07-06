<template>
  <default-layout>
    <template v-slot:Titulo>
      <h2 class="font-semibold text-2xl">Modulo de configuracion</h2>
    </template>

    <template v-slot:subtitulo>
      En este modulo se podra realizar configuracion de datos, valores..etc
    </template>

    <template v-slot:cuerpo>
      <menu-config></menu-config>
    </template>
  </default-layout>
</template>

<script setup>
import defaultLayout from "../../components/layouts/defaultLayout.vue";
import menuConfig from "./components/menuConfig.vue";
</script>

<style>
</style>