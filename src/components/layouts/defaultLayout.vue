<template>
  <div>
    <div class="font-poppins py-10 flex justify-between items-end px-20">
      <div class="flex flex-col gap-3">
        <slot name="Titulo"></slot>
        <div class="flex flex-row">
          <slot name="subtitulo"></slot>
        </div>
      </div>

      <div>
        <div class="px-4 py-2 rounded-lg font flex gap-3">
          <slot name="watch"></slot>
        </div>
      </div>
    </div>

    <div>
      <slot name="cuerpo"></slot>
    </div>
  </div>
</template>
  
  <script setup>
</script>
  
  <style>
</style>