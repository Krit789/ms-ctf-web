<script setup lang="ts">
const route = useRoute()

const cookieToken = useCookie('access_token')
const student_id = route.params.uid
const studentUser = ref()
const studentSubmission = ref()

const currentRank = ref(0)
const currentScore = ref(0)

const fetchStudent = async () => {
  await $fetch<{
    message: string;
    user: {
      student_id: number;
      firstname: string;
      lastname: string;
    };
    submissions: {
      question_question_title: string;
      question_question_description: string;
      question_points: number;
      question_created_on: string;
    }
  }>(`/api/profile/${student_id}`, {
    headers: {
      Authorization: `Bearer ${cookieToken.value}`,
    },
  })
    .then((res) => {
      studentUser.value = res.user;
      studentSubmission.value = res.submissions;
    })
    .catch((err) => {
      console.error(err);
      navigateTo('/leaderboard', { replace: true });
    });
}

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
    params: {
      student_id: student_id
    },
    headers: {
      Authorization: `Bearer ${cookieToken.value}`
    }
  }).then((res) => {
    currentRank.value = res.data.rank
    currentScore.value = res.data.totalPoints
  })
}

fetchStudent()
fetchUserRank()

</script>

<template>
  <div class="flex flex-col">
    <div
      class="flex md:flex-row flex-col justify-between rounded-lg outline-1 outline-zinc-600 p-8 w-full drop-shadow-2xl bg-gradient-to-tr from-cyan-100 to-cyan-400 gap-y-4">
      <div v-if="studentUser">
        <div class="font-bold text-5xl">{{ studentUser?.student_id }}</div>
        <div class="text-4xl mt-2">{{ studentUser?.firstname }} {{ studentUser?.lastname }}</div>
      </div>
      <div v-else></div>
      <div class="flex gap-x-4">
        <div class="flex flex-col size-32 p-4 bg-gradient-to-br from-cyan-100 to-cyan-400 rounded-md shadow-lg"><span
            class="font-bold text-2xl">Rank</span><span class="text-4xl">{{ currentRank }}</span></div>
        <div class="flex flex-col size-32 p-4 bg-gradient-to-br from-cyan-100 to-cyan-400 rounded-md shadow-lg"><span
            class="font-bold text-2xl">Score</span><span class="text-4xl">{{ currentScore }}</span></div>
      </div>
    </div>
    <Table class="text-2xl mt-8">
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Question Name</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Submitted On</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="studentSubmission && studentSubmission.length > 0">
        <TableRow v-for="(submission, indx) in studentSubmission">
          <TableCell>{{ indx + 1 }}</TableCell>
          <TableCell>
            <NuxtLink :to="`/question/${submission.question_question_id }`"
              class="underline hover:text-cyan-600 transition-all">
              {{ submission.question_question_title }}</NuxtLink>
          </TableCell>
          <TableCell>{{ submission.question_points }}</TableCell>
          <TableCell>{{ new Date(submission.question_created_on).toLocaleString('en-US', {
            dateStyle: 'short',
            timeStyle: 'short'
          }) }}</TableCell>
        </TableRow>
      </TableBody>
      <TableBody v-else>
        <TableRow>
          <TableCell colspan="4" class="text-center">No submission yet</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
