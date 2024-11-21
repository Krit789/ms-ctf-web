<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const studentId = ref('65070111')

const question = ref("1")
const flag = ref('')

const flagValid = computed(() => !!flag.value)

onMounted(() => {
  const localStudentId = localStorage.getItem('studentId')
  if (localStudentId) {
    studentId.value = localStudentId
  }
})
</script>

<template>
  <NuxtLink to="/" class="underline">Back</NuxtLink>
  <div class="grid place-items-center self-center w-full gap-2">
    <h2 class="text-left mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      Submit Flag
    </h2>

    <div class="w-1/2 flex flex-col gap-4">
      <div class="grid items-center w-full gap-1.5">
        <Label for="studentId">Student ID</Label>
        <Input v-model="studentId" id="studentId" readonly disabled />
      </div>

      <div class="grid items-center w-full gap-1.5">
        <Label for="question">Question No.</Label>
        <Select v-model="question" id="question">
          <SelectTrigger>
            <SelectValue placeholder="Question No." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="1">1</SelectItem>
            <SelectItem :value="2">2</SelectItem>
            <SelectItem :value="3">3</SelectItem>
            <SelectItem :value="4">4</SelectItem>
            <SelectItem :value="5">5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="grid items-center w-full gap-1.5">
        <Label for="flag">Flag<span class="text-red-500">*</span></Label>
        <Input v-model="flag" id="flag" required />
      </div>

      <Button :disabled="!flagValid">Submit</Button>
    </div>
  </div>
</template>