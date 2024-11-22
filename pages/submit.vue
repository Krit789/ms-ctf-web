<script lang="ts" setup>

const tokenCookie = useCookie('access_token')
const currentRank = ref(0)
const currentScore = ref(0)

const question = ref("1")
const flag = ref('')


const questions = ref()

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
    }
  }).then((res) => {
    currentRank.value = res.data.rank
    currentScore.value = res.data.totalPoints
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
    }
  }).then((res) => {
    questions.value = res
  })
}

let interval = setInterval(fetchUserRank, 5000)

onUnmounted(() => {
  clearInterval(interval)
})

fetchQuestion()
fetchUserRank()
</script>

<template>
  <div class="flex flex-col w-full gap-2">
    <h2 class="text-left mt-12 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0">
      Submit Flag
    </h2>
    <div class="flex gap-8 justify-center mb-4">
      <div class="size-32 shadow-lg outline-1 rounded-md p-4 bg-gradient-to-tr  from-zinc-100 to-emerald-300 outline-zinc-800">
        <span class="font-bold">Your rank</span><br/>
        <span class="text-5xl">{{ currentRank }}</span>
      </div>
      <div class="size-32 shadow-lg outline-1 rounded-md p-4 bg-gradient-to-tr  from-zinc-100 to-orange-300">
        <span class="font-bold">Your Score</span><br/>
        <span class="text-5xl">{{ currentScore }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-4 w-full justify-center items-center">
      <div class="flex flex-col gap-4 max-w-[560px] md:w-[560px] w-full">
        <CtfQuizSubmitBox v-for="question in questions?.questionWithSubmission" :question_id="question.question_id"
          :question_title="question.question_title" :question_description="question.question_description"
          :points="question.points" :created_on="question.created_on" :submission="question.submission"
          :refreshQuestion="fetchQuestion">
        </CtfQuizSubmitBox>
      </div>

    </div>
  </div>
</template>