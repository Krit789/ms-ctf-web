<script setup lang="ts">
import { LineChart } from '@/components/ui/chart-line'

const data = [
  {
    'time': new Date().getTime(),
    '65070171': 0,
    '65070012': 1,
  },
  {
    'time': new Date().getTime() + 1000 * 60 * 60 * 24,
    '65070171': 1,
    '65070012': 3,
  },
]

const username = ['65070171', '65070012']
</script>

<template>
  <NuxtLink to="/" class="underline">Back</NuxtLink>

  <LineChart :data="data" index="year" :categories="username" :y-formatter="(tick, i) => {
    return tick
  }" />
</template>