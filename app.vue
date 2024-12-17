<script setup lang="ts">
import '@fontsource/bai-jamjuree'
import 'vue3-toastify/dist/index.css';

useSeoMeta({
        title: 'CTF.IT',
        ogTitle: 'CTF.IT',
        description:
            'CTF Bootcamp for IT Infrastructure Students',
        ogDescription:
            'CTF Bootcamp for IT Infrastructure Students',
    })
</script>
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
@media screen and (min-width: 640px) {
  .Toastify__toast-container--top-right {
    margin-top: 96px !important;
  }
}
</style>