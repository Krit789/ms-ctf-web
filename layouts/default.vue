<script setup lang="ts">
const userData = useUserState()



const logout = () => {
  useCookie('access_token').value = null
  userData.value = null
  navigateTo('/', { replace: true })
}
</script>

<template>
  <div class="fixed w-full h-20 z-[100]">
    <div class="flex justify-center items-center pt-8 px-4">
      <div
        class="bg-zinc-700/70 backdrop-blur-md drop-shadow-xl rounded-full w-full max-w-screen-xl h-16 flex justify-between items-center px-8">
        <NuxtLink to="/">
          <h1 class="text-white text-2xl font-bold text-center">CTF Bootcamp</h1>
        </NuxtLink>
        <div class="flex gap-x-4 items-center">
          <NuxtLink v-if="userData" to="/" class="text-white md:block hidden">Home</NuxtLink>
          <NuxtLink v-if="userData" to="/leaderboard" class="text-white md:block hidden">Leaderboard</NuxtLink>
          <NuxtLink v-if="userData" to="/livelog" class="text-white md:block hidden">Live Log</NuxtLink>
          <NuxtLink v-if="userData" to="/submit" class="text-white md:block hidden">Submit</NuxtLink>
          <span v-if="!userData">
            <NuxtLink to="/login"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 font-bold rounded-xl outline-[1px] bg-white text-zinc-800 py-2 px-2">
              Login</NuxtLink>
          </span>
          <span class="flex items-center gap-x-2 bg-zinc-300/50 pl-2 rounded-xl" v-else>
            <span>{{ userData.student_id }}</span>
            <Button variant="ghost" @click="logout"
              class="font-bold rounded-xl outline-[1px] bg-white text-zinc-800 py-2 px-2">Logout</Button>
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="max-w-screen-xl mx-auto pt-28 xl:px-0 px-8">
    <slot></slot>
  </div>
  <div class="w-full flex justify-center items-center p-8 bg-cyan-200 mt-16">
    Made with 🩸 by @Krit789, @phatsanphonna and @OatChayanont
  </div>
</template>