<script setup lang="ts">
import { Flag, Crown, Logs } from 'lucide-vue-next';
definePageMeta({
  layout: 'landing',
})
</script>

<template>
  <InspiraAuroraBackground>
    <div v-motion :initial="{ opacity: 0, y: 40 }" :visible="{
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.8,
        ease: 'easeInOut',
      },
    }" class="relative flex flex-col items-center justify-center gap-4 px-4">
      <div class="text-center text-5xl font-bold md:text-8xl dark:text-white font-mono">
        CTF.IT
      </div>
      <div class="py-4 text-base text-center font-extralight md:text-3xl dark:text-neutral-200 font-mono">
        Capture the Flag for the Network Track, Capture the Flag for everyone.
      </div>
      <NuxtLink to="/login">
      <Button class="w-fit font-[sans-serif]">
        Begin now
      </Button>
    </NuxtLink>
    </div>
  </InspiraAuroraBackground>
  <div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-content-center gap-4 mx-auto max-w-screen-2xl mt-16">
    <!-- <div class="bg-gradient-to-tr from-red-400 to bg-red-100 h-48 p-4 rounded-lg  hover:scale-105 transition-transform">
      <NuxtLink class="underline" to="/leaderboard">
        <h2
          class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0 h-48 relative">
          Leaderboard
          <Crown class="absolute bottom-8 right-0 text-white opacity-50" :size="64" />
        </h2>
      </NuxtLink>
    </div>
    <div
      class="bg-gradient-to-tr from-emerald-400 to bg-emerald-100 h-48 p-4 rounded-lg  hover:scale-105 transition-transform">
      <NuxtLink class="underline" to="/livelog">
        <h2
          class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0 h-48 relative">
          Live Log
          <Logs class="absolute bottom-8 right-0 text-white opacity-50" :size="64" />
        </h2>
      </NuxtLink>
    </div>
    <div
      class="bg-gradient-to-tr from-cyan-400 to bg-cyan-100 h-48 p-4 rounded-lg hover:scale-105 transition-transform">
      <NuxtLink class="underline" to="/submit">
        <h2
          class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0 h-48 relative">
          Submit Flag
          <Flag class="absolute bottom-8 right-0 text-white opacity-50" :size="64" />
        </h2>
      </NuxtLink>
    </div> -->
  </div>

</template>