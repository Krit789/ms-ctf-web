<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast, type ToastOptions } from 'vue3-toastify';

const tokenCookie = useCookie('access_token')
const userState = useUserState()
const isSubmitting = ref(false)

const data = ref({
  name: '',
  description: '',
  begin_time: '',
  end_time: '',
})

const submitCreate = async () => {
  isSubmitting.value = true;

  const adjustedData = { ...data.value };
  if (adjustedData.begin_time) {
    adjustedData.begin_time = new Date(adjustedData.begin_time).toISOString();
  }
  if (adjustedData.end_time) {
    adjustedData.end_time = new Date(adjustedData.end_time).toISOString();
  }

  if (Date.parse(adjustedData.begin_time) && Date.parse(adjustedData.end_time) && adjustedData.begin_time >= adjustedData.end_time) {
    const toastHTML = `<strong>Creation Failure</strong>\nEnd time must be after begin time`;
    toast.error(toastHTML, {
      transition: toast.TRANSITIONS.SLIDE,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      closeOnClick: true,
      dangerouslyHTMLString: true,
    });
    isSubmitting.value = false;
    return;
  }

  try {
    const res = await $fetch<{ message: string, t_id: number }>('/api/tournaments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      },
      body: JSON.stringify(adjustedData),
    }).then(res => {
      navigateTo(`/tournaments/${res.t_id}`, { replace: true })
    })

  } catch (error: any) {
    const toastHTML = `<strong>Creation Failure</strong>\n${(error?.data as { message?: string })?.message || error?.message || "Unknown error"}`;
    console.error(error);
    toast.error(toastHTML, {
      transition: toast.TRANSITIONS.SLIDE,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      closeOnClick: true,
      dangerouslyHTMLString: true,
    });
  } finally {
    isSubmitting.value = false;
  }
};

</script>
<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0">
          Create a new tournament
        </h2>
        <p class="text-2xl">CTF.IT</p>
      </div>
      <div class="text-right">
      </div>
    </div>
    <form class="flex flex-col gap-2" @submit.prevent="submitCreate">
      <Label>Tournament Name</Label>
      <Input v-model="data.name" label="Name" placeholder="Name of the tournament" />
      <Label>Tournament Description</Label>
      <Textarea v-model="data.description" label="Description" placeholder="Description of the tournament" />
      <div class="flex md:flex-row flex-col gap-2 w-full">
        <div class="w-full">
          <Label>Start Time</Label>
          <Input v-model="data.begin_time" label="Begin Time" type="datetime-local" />
        </div>
        <div class="w-full">
          <Label>End Time</Label>
          <Input v-model="data.end_time" label="End Time" type="datetime-local" />
        </div>
      </div>
      <Button class="mt-4" :disabled="isSubmitting">Create</Button>
    </form>
  </div>
</template>