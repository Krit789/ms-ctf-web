<script setup lang="ts">
const route = useRoute()

const cookieToken = useCookie('access_token')
const question_id = route.params.qid
const question = ref()
const questionSubmission = ref()


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
  })
}

fetchQuestion()

</script>

<template>
  <div class="flex flex-col">
    <div
      class="flex md:flex-row flex-col justify-between rounded-lg outline-1 outline-zinc-600 p-8 w-full drop-shadow-2xl bg-gradient-to-tr from-cyan-100 to-cyan-400 gap-y-4">
      <div v-if="question">
        <div class="font-bold text-5xl">{{ question?.question_id }}</div>
        <div class="text-4xl mt-2">{{ question?.question_title }}<br/><span class="text-lg">{{ question?.question_description }}</span></div>
      </div>
      <div v-else></div>
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
          <TableCell>{{ submission.student_firstname }}</TableCell>
          <TableCell>{{ submission.student_lastname }}</TableCell>
          <TableCell>{{ new Date(submission.created_on).toLocaleString('en-US', {
            dateStyle: 'short',
            timeStyle: 'short'
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
