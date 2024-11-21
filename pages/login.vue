<script lang="ts" setup>
const username = ref('')
const password = ref('')
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid items-center w-full gap-1.5">
      <Label for="username">Username<span class="text-red-500">*</span></Label>
      <Input v-model="username" id="username" required />
    </div>

    <div class="grid items-center w-full gap-1.5">
      <Label for="password">Password<span class="text-red-500">*</span></Label>
      <Input v-model="password" id="password" required />
    </div>
    <Button>Login</Button>
  </div>
</template>
