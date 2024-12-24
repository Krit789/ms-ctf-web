<script setup lang="ts">
import { toast, type ToastOptions } from 'vue3-toastify';

import { Flag, Crown, Logs } from 'lucide-vue-next';
const t_id = useRoute().params.tid
const tournament_data = ref()
const tokenCookie = useCookie('access_token')
const userState = useUserState()

const fetchTournaments = () => {
  $fetch('/api/tournaments', {
    headers: {
      Authorization: `Bearer ${tokenCookie.value}`
    },
    query: {
      tid: t_id
    }
  })
    .then((res) => {
      tournament_data.value = res.tournament
      if (tournament_data.value.begin_time && new Date(tournament_data.value.begin_time) > new Date()) {
        if (userState.value?.role !== 'ADMIN') {
          toast.info('Tournament has not started yet. ', { autoClose: 5000 })
          navigateTo('/tournaments', { replace: true })
        } else {
            toast.info('Tournament has not started yet. However, as an admin, you can access this page.', { autoClose: 10000 })
        }
      }
    })
    .catch((err) => {
      console.error(err)
      navigateTo('/tournaments', { replace: true })
    })
}

fetchTournaments()

</script>

<template>
  <div class="flex flex-col gap-2 ">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0">
          {{ tournament_data?.name }}
        </h2>
        <div v-if="tournament_data" class="flex flex-row bg-gray-100 p-2 gap-x-4 rounded-md">
          <span>
            <span class="font-bold">Begin Time:</span>
            {{ tournament_data.begin_time ? new Date(tournament_data.begin_time).toLocaleString('th') : "Before Mankind"
            }}
          </span>
          <span>
            <span class="font-bold">End Time:</span>
            {{ tournament_data.end_time ? new Date(tournament_data.end_time).toLocaleString('th') : "Future Life" }}
          </span>
        </div>
        <h4 class="font-bold text-2xl mt-2">Description</h4>
        <p class="text-lg">
          {{ tournament_data?.description ? tournament_data?.description : "Not given" }}
        </p>
      </div>
      <div class="text-right">
        <NuxtLink v-if="userState?.role === 'ADMIN'" :to='`/tournaments/${t_id}/edit`'><Button>Edit</Button></NuxtLink>
      </div>
    </div>


  </div>
  <div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-content-center gap-4 mx-auto max-w-screen-2xl mt-16">
    <div class="bg-gradient-to-tr from-red-400 to bg-red-100 h-48 p-4 rounded-lg  hover:scale-105 transition-transform">
      <NuxtLink class="underline" :to="`${t_id}/leaderboard`">
        <h2
          class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0 h-48 relative">
          Leaderboard
          <Crown class="absolute bottom-8 right-0 text-white opacity-50" :size="64" />
        </h2>
      </NuxtLink>
    </div>
    <div
      class="bg-gradient-to-tr from-emerald-400 to bg-emerald-100 h-48 p-4 rounded-lg  hover:scale-105 transition-transform">
      <NuxtLink class="underline" :to="`${t_id}/livelog`">
        <h2
          class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0 h-48 relative">
          Live Log
          <Logs class="absolute bottom-8 right-0 text-white opacity-50" :size="64" />
        </h2>
      </NuxtLink>
    </div>
    <div
      class="bg-gradient-to-tr from-cyan-400 to bg-cyan-100 h-48 p-4 rounded-lg hover:scale-105 transition-transform">
      <NuxtLink class="underline" :to="`${t_id}/submit`">
        <h2
          class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0 h-48 relative">
          Submit Flag
          <Flag class="absolute bottom-8 right-0 text-white opacity-50" :size="64" />
        </h2>
      </NuxtLink>
    </div>
  </div>

</template>