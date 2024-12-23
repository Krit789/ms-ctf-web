<script lang="ts" setup>
import { Skeleton } from '@/components/ui/skeleton'
import { useWindowFocus } from '@vueuse/core'

const tokenCookie = useCookie('access_token')
const currentRank = ref(0)
const currentScore = ref(0)

const question = ref("1")
const flag = ref('')


const questions = ref()
const isRankLoading = ref(true)
const isQuestionLoading = ref(true)
const t_id = useRoute().params.tid


const fetchUserRank = () => {
  $fetch<{
    message: string;
    data: {
      rank: number;
      totalPoints: number;
      student_id: number;
      firstname: string;
      lastname: string;
      earliestSubmission: string;
    }
  }>('/api/score', {
    headers: {
      Authorization: `Bearer ${tokenCookie.value}`
    },
    query: {
      tid: t_id
    }
  }).then((res) => {
    currentRank.value = res.data.rank
    currentScore.value = res.data.totalPoints
  }).finally(() => {
    isRankLoading.value = false
  })
}

const fetchQuestion = () => {
  $fetch<{
    message: string;
    questionWithSubmission: {
      question_id: number;
      question_title: string;
      question_description: string;
      points: number;
      created_on: string;
      submission: {
        correct: boolean;
        created_on: string;
        submission_order: number;
      }[]
    }[];
  }>('/api/question', {
    headers: {
      Authorization: `Bearer ${tokenCookie.value}`
    },
    query: {
      tid: t_id
    }
  }).then((res) => {
    questions.value = res
  }).then(() => {
    isQuestionLoading.value = false
  })
}

let interval = setInterval(fetchUserRank, 5000)

onUnmounted(() => {
  clearInterval(interval)
})

const focused = useWindowFocus()

watch(focused, (value: boolean) => {
  if (value) {
    fetchUserRank()
    clearInterval(interval)
    interval = setInterval(fetchUserRank, 5000)
  } else {
    clearInterval(interval)
  }
})

const handleEmit = () => {
  fetchQuestion()
}

fetchQuestion()
fetchUserRank()
</script>

<template>
  <div class="flex flex-col w-full gap-2">
    <h2 class="text-left mt-12 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0">
      Submit Flag
    </h2>
    <div class="flex gap-8 justify-center mb-4">
      <div
        class="size-32 shadow-lg outline-1 rounded-md p-4 bg-gradient-to-tr  from-zinc-100 to-emerald-300 outline-zinc-800">
        <span class="font-bold">Your Rank</span><br />
        <span class="text-5xl" v-if="!isRankLoading">{{ currentRank }}</span>
        <Skeleton class="w-full h-12 rounded-full" v-else />
      </div>
      <div class="size-32 shadow-lg outline-1 rounded-md p-4 bg-gradient-to-tr  from-zinc-100 to-orange-300">
        <span class="font-bold">Your Score</span><br />
        <span class="text-5xl" v-if="!isRankLoading">{{ currentScore }}</span>
        <Skeleton class="w-full h-12 rounded-full" v-else />
      </div>
    </div>

    <CtfPacketFile :tid="String(t_id)"></CtfPacketFile>
    <div class="flex flex-col gap-4 w-full">
      <h3 class="text-2xl font-bold mt-4">Your Question</h3>
      <div class="grid lg:grid-cols-2 grid-cols-1 gap-4 w-full" v-if="!isQuestionLoading">
        <CtfQuizSubmitBox v-for="question in questions?.questionWithSubmission" @refresh-question="handleEmit"
          :question_id="question.question_id" :question_title="question.question_title"
          :question_description="question.question_description" :points="question.points"
          :created_on="question.created_on" :submission="question.submission" :begin-time="question.begin_time" :end-time="question.end_time" :refreshQuestion="fetchQuestion">
        </CtfQuizSubmitBox>
      </div>
      <div class="flex flex-col gap-4 max-w-[560px] md:w-[560px] w-full" v-else>
        <div v-for="dummy in ['', '', '']"
          class="flex flex-col gap-2 bg-white border-zinc-200 border-2 p-6 shadow-xl rounded-md">
          <h3 class="text-2xl font-semibold">
            <Skeleton class="w-3/4 h-8 rounded-full" />
            <Skeleton class="w-full h-4 mt-2 rounded-full" />
            <Skeleton class="w-full h-4 mt-2 rounded-full" />
            <Skeleton class="w-full h-4 mt-2 rounded-full" />
            <Skeleton class="w-full h-4 mt-2 rounded-full" />
          </h3>
          <p class="text-lg"></p>
          <hr />
          <div class="grid items-center w-full gap-1.5">
            <form class="flex flex-col gap-4  bg-zinc-100/50 rounded-md">
              <Label for="flag">Flag<span class="text-red-500">*</span></Label>
              <Input readonly />
              <Button disabled>
                <Skeleton class="w-20 h-4 rounded-full" />
              </Button>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>