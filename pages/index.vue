<script setup lang="ts">

</script>

<template>
  <div class="sm:aspect-[3/1] aspect-[2/1] w-full relative overflow-hidden rounded-lg">
    <div class="absolute z-10 flex w-full h-full justify-center flex-col sm:gap-y-2 text-white">
      <h1 class="sm:text-7xl text-4xl font-bold sm:pl-12 pl-6 drop-shadow-[0_10px_30px_rgba(0,_203,_0,_1)]">
        CTF Bootcamp Alpha</h1>
      <p class="sm:text-3xl text-xl sm:pl-12 pl-6 drop-shadow-[0_10px_30px_rgba(0,_203,_0,_1)]">CTF for Network Track
      </p>
    </div>
    <img src="~/assets/images/hero.jpg" alt="Hero" class="absolute w-full h-full object-cover">
  </div>

  <div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-content-center mt-8 gap-4">
    <div class="bg-gradient-to-tr from-red-400 to bg-red-100 h-48 p-4 rounded-lg  hover:scale-105 transition-transform">
      <NuxtLink class="underline" to="/leaderboard">
        <h2 class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0 h-48">
          Leaderboard
        </h2>
      </NuxtLink>
    </div>
    <div
      class="bg-gradient-to-tr from-emerald-400 to bg-emerald-100 h-48 p-4 rounded-lg  hover:scale-105 transition-transform">
      <NuxtLink class="underline" to="/livelog">
        <h2 class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0 h-48">
          Live Log
        </h2>
      </NuxtLink>
    </div>
    <div
      class="bg-gradient-to-tr from-cyan-400 to bg-cyan-100 h-48 p-4 rounded-lg hover:scale-105 transition-transform">
      <NuxtLink class="underline" to="/submit">
        <h2 class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0 h-48">
          Submit Flag
        </h2>
      </NuxtLink>
    </div>
  </div>

</template>