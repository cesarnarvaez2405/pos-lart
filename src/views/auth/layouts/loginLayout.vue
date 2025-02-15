<template>
  <div class="w-full">
    <div class="grid grid-cols-2 divide-x-2 divide-pink-300">
      <div class="w-full h-full">
        <slot name="firstPage"></slot>
      </div>
      <div class="w-full">
        <slot name="secondPage"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style>
</style>