<script setup lang="ts">
import { toast, type ToastOptions } from 'vue3-toastify';
import { Medal, Clock, Tally5 } from 'lucide-vue-next';

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
  beginTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  submission: {
    type: Object, // You might want to define a more specific type for submission if possible
    required: true,
    validator: (value) => {
      // Add more specific validation for the submission object if needed
      return typeof value === 'object' &&
        value !== null && 'correct' in value && typeof value.correct === 'boolean' &&
        'created_on' in value && (typeof value.created_on === 'string' || value.created_on === null) &&
        'submission_rank' in value && typeof value.submission_rank === 'number' && 'points_with_bonus' in value && typeof value.points_with_bonus === 'number';
    }
  }
});

const userState = useUserState()
const flag = ref('')
const tokenCookie = useCookie('access_token')
const isSubmitting = ref(false)
const emit = defineEmits(['refresh-question'])

const submitFlag = async () => {
  isSubmitting.value = true;
  try {
    const res = await $fetch<{ message: string, correct?: boolean, submission_order?: number }>('/api/flag/submit', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      },
      body: JSON.stringify({
        question_id: props.question_id,
        flag: flag.value
      }),
    });

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
    if (res.correct) {
      emit('refresh-question');
    }
  } catch (error) {
    const toastHTML = `<strong>Flag Submission Failure</strong>\n${(error && typeof error === 'object' && "data" in error && error.data && typeof error.data === 'object' && "message" in error.data) ? error.data?.message || error.message : ""}`;
    console.error(error);
    toast.error(toastHTML, {
      transition: toast.TRANSITIONS.SLIDE,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      closeOnClick: true,
      dangerouslyHTMLString: true,
    });
  } finally {
    flag.value = '';
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col justify-between gap-2 bg-white border-zinc-200 border-2 p-6 shadow-xl rounded-md">
    <div>
      <div v-if="endTime && new Date(endTime) < new Date()" class="bg-red-200 p-2 rounded-md text-center font-bold">
        Submission has ended
      </div>
      <div v-else-if="beginTime && new Date() < new Date(beginTime)"
        class="bg-red-200 p-2 rounded-md text-center font-bold">
        Submission has not started yet
      </div>
      <h3 class="text-2xl font-semibold">{{ question_title }}</h3>
      <p class="text-lg break-keep">{{ question_description }}</p>
      <hr />
    </div>
    <div>
      <div class="grid items-center w-full gap-1.5">
        <form @submit.prevent="submitFlag" class="flex flex-col gap-4  bg-zinc-100/50 rounded-md"
          v-if="!submission.correct">
          <Label for="flag">Flag<span class="text-red-500">*</span></Label>
          <Input v-model="flag" id="flag" required />
          <Button type="submit" :disabled="!flag || isSubmitting">{{ isSubmitting ? '⏳ Submitting' : 'Submit'
            }}</Button>
        </form>
        <span v-if="submission.correct">
          <div variant="ghost"
            class="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 bg-gradient-to-tr from-green-300 to-green-600 text-white select-none">
            Passed</div>
          <div class="flex flex-row gap-x-4 text-sm mt-2 justify-center items-center">
            <div class="flex flex-row gap-x-2 text-sm">
              <Clock :size='18' />
              {{ new Date(submission.created_on).toLocaleString('th', {
                dateStyle: 'short',
                timeStyle: 'medium'
              }) }}
            </div>
            <div class="flex flex-row gap-x-2 text-sm">
              <Medal :size='18' />Rank
              {{ submission.submission_rank }}
            </div>
            <div class="flex flex-row gap-x-2 text-sm">
              <Tally5 :size='18' />Score
              {{ submission.points_with_bonus }}
            </div>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>