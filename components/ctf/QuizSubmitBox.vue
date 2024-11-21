<script setup lang="ts">
import { toast, type ToastOptions } from 'vue3-toastify';

const props = defineProps({
  question_id: {
    type: Number,
    required: true,
  },
  question_title: {
    type: String,
    required: true,
  },
  question_description: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  created_on: {
    type: String,
    required: true,
  },
  refreshQuestion: {
    type: Function,
    required: true,
  },
  submission: {
    type: Object, // You might want to define a more specific type for submission if possible
    required: true,
    validator: (value) => { 
      // Add more specific validation for the submission object if needed
      return typeof value === 'object' && 
             value !== null && 'correct' in value && typeof value.correct === 'boolean' &&
             'created_on' in value && typeof value.created_on === 'string' &&
             'submission_order' in value && typeof value.submission_order === 'number';
    }
  }
});

const userState = useUserState()
const flag = ref('')
const tokenCookie = useCookie('access_token')

const submitFlag = async () => {
  await $fetch<{message: string, correct?: boolean, submission_order?: number}>('/api/flag/submit', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenCookie.value}`
    },
    body: JSON.stringify({
      question_id: props.question_id,
      flag: flag.value
    }),
  }).then(async (res) => {
    const toastHTML = `<strong>Flag Submitted</strong>\n${res.message}`;
    toast(toastHTML, {
      type: res.correct ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
      transition: toast.TRANSITIONS.SLIDE,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      closeOnClick: true,
      dangerouslyHTMLString: true,
    });
    props.submission.correct = res.correct;
  }).catch((err) => {
    const toastHTML = `<strong>Flag Submission Failure</strong>\n${err.message}`;
    console.error(err);
    toast.error(toastHTML, {
      transition: toast.TRANSITIONS.SLIDE,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      closeOnClick: true,
      dangerouslyHTMLString: true,
    });
  }).finally(() => {
    flag.value = ''
  });
};
</script>

<template>
  <div class="flex flex-col gap-2 bg-white border-zinc-200 border-2 p-6 shadow-xl rounded-md">
    <h3 class="text-2xl font-semibold">{{ question_title }}</h3>
    <p class="text-lg">{{ question_description }}</p>
    <hr />
    <div class="grid items-center w-full gap-1.5">
      <form @submit.prevent="submitFlag" class="flex flex-col gap-4  bg-zinc-100/50 rounded-md">
        <Label for="flag" v-show="!submission?.correct">Flag<span class="text-red-500" >*</span></Label>
        <Input v-model="flag" id="flag" required v-show="!submission?.correct" />
        <Button type="submit" v-if="!submission?.correct" :disabled="!flag">Submit</Button>
        <Button class="bg-emerald-500" v-else disabled>Passed ✅</Button>
      </form>
    </div>
  </div>
</template>