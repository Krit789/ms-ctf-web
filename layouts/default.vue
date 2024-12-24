<script setup lang="ts">
import { Flag } from 'lucide-vue-next';

</script>

<template>
<NavigationBar />
  <div class="mx-auto max-w-screen-xl pt-28 2xl:px-0 px-8 min-h-[84vh]">
    <slot></slot>
  </div>
  <div class="w-full flex justify-center items-center p-8 bg-cyan-200 mt-16 text-center">
    Made with 🩸 by @Krit789, @phatsanphonna and @OatChayanont
  </div>
</template>