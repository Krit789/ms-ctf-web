<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'

const route = useRoute()

const cookieToken = useCookie('access_token')
const question_id = route.params.qid
const question = ref()
const questionSubmission = ref()
const isQuestionLoading = ref(true)



const fetchQuestion = () => {
  $fetch<{
    message: string;
    question: {
      question_id: number;
      question_title: string;
      question_description: string;
    },
    submissions: {
      student_id: number;
      submission_id: number;
      created_on: string;
      student_firstname: string;
      student_lastname: string;
    }
  }>(`/api/flag/submitted/${question_id}`, {
    headers: {
      Authorization: `Bearer ${cookieToken.value}`
    }
  }).then((res) => {
    question.value = res.question
    questionSubmission.value = res.submissions
  }).finally(() => {
    isQuestionLoading.value = false
  })
}

fetchQuestion()

</script>

<template>
  <div class="flex flex-col">
    <div
      class="flex md:flex-row flex-col justify-between rounded-lg outline-1 outline-zinc-600 p-8 w-full drop-shadow-2xl bg-gradient-to-tr from-cyan-100 to-cyan-400 gap-y-4 mt-4 relative">
      <div
        class="font-bold text-5xl absolute -top-5 -left-5 rounded-lg drop-shadow-xl text-white bg-gradient-to-tr from-blue-400 to-blue-800 size-16 grid place-items-center">
        {{ question?.question_id }}</div>
      <div class="mt-2 w-full">
        <h3 class="text-4xl font-bold" v-if="!isQuestionLoading">{{ question?.question_title }}</h3>
        <Skeleton class="w-64 h-8 mt-2 rounded-full" v-else />
        <p class="text-lg leading-snug mt-2" v-if="!isQuestionLoading">{{ question?.question_description }}</p>
        <div class="flex flex-col w-full" v-else>
          <Skeleton class="w-full h-4 mt-2 rounded-full" />
          <Skeleton class="w-full h-4 mt-2 rounded-full" />
        </div>
      </div>
    </div>
    <Table class="text-2xl mt-8">
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Student ID</TableHead>
          <TableHead>Firstname</TableHead>
          <TableHead>Lastname</TableHead>
          <TableHead>Submitted On</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="questionSubmission && questionSubmission.length > 0">
        <TableRow v-for="(submission, indx) in questionSubmission">
          <TableCell>{{ indx + 1 }}</TableCell>
          <TableCell>
            <NuxtLink :to="`/profile/${submission.student_id}`" class="underline hover:text-cyan-600 transition-all">
              {{ submission.student_id }}</NuxtLink>
          </TableCell>
          <TableCell>{{ submission.firstname }}</TableCell>
          <TableCell>{{ submission.lastname }}</TableCell>
          <TableCell>{{ new Date(submission.created_on).toLocaleString('th', {
            dateStyle: 'short',
            timeStyle: 'medium'
          }) }}</TableCell>
        </TableRow>
      </TableBody>
      <TableBody v-else>
        <TableRow>
          <TableCell colspan="5" class="text-center">No submission yet</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
