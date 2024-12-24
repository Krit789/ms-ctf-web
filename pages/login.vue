<script lang="ts" setup>
import { toast, type ToastOptions } from 'vue3-toastify';
import type { GetMeResponse } from '~/middleware/authguard.global';

const username = ref('')
const password = ref('')
const tokenCookie = useCookie('access_token')
const userState = useUserState()

const login = (username: string, password: string) => {
  $fetch<{ message: string, access_token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
    .then(async (res) => {
      const toastHTML = `<strong>Login Success</strong>\n${res.messasge}`;
      toast.success(toastHTML, {
        transition: toast.TRANSITIONS.SLIDE,
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
        closeOnClick: true,
        dangerouslyHTMLString: true,
      });
      tokenCookie.value = res.access_token
      await $fetch<GetMeResponse>('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${res.access_token}`
        }
      }).then((userdata) => 
        userState.value = userdata.user
      )
      await navigateTo('/tournaments', { replace: true })
    })
    .catch((err) => {
      const toastHTML = `<strong>Login Failure</strong>\nYour username or password is incorrect. Please try again.`;
      console.error(err);
      toast.error(toastHTML, {
        transition: toast.TRANSITIONS.SLIDE,
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
        closeOnClick: true,
        dangerouslyHTMLString: true,
      });
      tokenCookie.value = null
    })
}


</script>

<template>
  <div
    class="flex md:flex-row flex-col gap-y-16 min-h-[500px] w-full justify-center items-start md:items-center mx-auto">
    <div class="md:w-1/2 pl-8">
      <NuxtLink to="/" class="underline">Back</NuxtLink>
      <h2 class="text-left mt-10 scroll-m-20 pb-2 text-5xl font-bold tracking-tight transition-colors first:mt-0">
        Login
      </h2>
      <p class="text-2xl">Bootcamp CTF Alpha</p>
    </div>
    <form @submit.prevent="login(username, password)"
      class="w-full flex flex-col gap-4 p-8 shadow-xl bg-zinc-100/50 rounded-md max-w-[560px] md:w-[560px]">
      <div class="grid items-center w-full gap-1.5">
        <Label for="username">Username<span class="text-red-500">*</span></Label>
        <Input v-model="username" id="username" required />
      </div>
      <div class="grid items-center w-full gap-1.5 ">
        <Label for="password">Password<span class="text-red-500">*</span></Label>
        <Input v-model="password" type="password" id="password" required />
      </div>
      <Button type="submit">Login</Button>
    </form>
  </div>
</template>
