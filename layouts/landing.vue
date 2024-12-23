<script setup lang="ts">
import { Flag } from 'lucide-vue-next';

</script>

<template>
<NavigationBar />
  <div class="mx-auto">
    <slot></slot>
  </div>
  <div class="w-full flex justify-center items-center p-8 bg-cyan-200 mt-16">
    Made with 🩸 by @Krit789, @phatsanphonna and @OatChayanont
  </div>
</template>