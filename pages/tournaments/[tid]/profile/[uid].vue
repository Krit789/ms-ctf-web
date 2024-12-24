<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import type { ProfileResponse } from '~/server/api/profile/[userid].get'

const route = useRoute()

const cookieToken = useCookie('access_token')
const student_id = route.params.uid
const t_id = route.params.tid
const studentUser = ref<ProfileResponse['user']>()
const studentSubmission = ref<ProfileResponse['submissions']>()

const currentRank = ref(0)
const currentScore = ref(0)
const isRankLoading = ref(true)
const isProfileLoading = ref(true)


const fetchStudent = async () => {
  await $fetch<ProfileResponse>(`/api/profile/${student_id}`, {
    headers: {
      Authorization: `Bearer ${cookieToken.value}`,
    },
    params: {
      tid: t_id
    }
  })
    .then((res) => {
      studentUser.value = res.user;
      studentSubmission.value = res.submissions;
    })
    .catch((err) => {
      navigateTo(`/tournaments/${t_id}`, { replace: true })
    }).finally(() => {
      isProfileLoading.value = false
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
      student_id: student_id,
      tid: t_id
    },
    headers: {
      Authorization: `Bearer ${cookieToken.value}`
    }
  }).then((res) => {
    currentRank.value = res.data.rank
    currentScore.value = res.data.totalPoints
  }).finally(() => {
    isRankLoading.value = false
  })
}

fetchStudent()
fetchUserRank()

</script>

<template>
  <div class="flex flex-col">
    <div
      class="flex md:flex-row flex-col justify-between rounded-lg outline-1 outline-zinc-600 p-8 w-full drop-shadow-2xl bg-gradient-to-tr from-cyan-100 to-cyan-400 gap-y-4">
      <div>
        <div class="font-bold text-5xl">{{ studentUser?.student_id }}
        </div>
        <div class="text-4xl mt-2" v-if="isProfileLoading">
          <Skeleton class="w-56 h-12 rounded-full" />
        </div>
        <div class="text-4xl mt-2" v-else>{{ studentUser?.firstname }} {{ studentUser?.lastname }}</div>
        <div class="flex flex-row gap-x-4 mt-2" v-if="isProfileLoading">
          <Skeleton class="w-32 h-8 rounded-full" />
          <Skeleton class="w-48 h-8 rounded-full" />
        </div>
      </div>
      <div class="flex gap-x-4">
        <div class="flex flex-col size-32 p-4 bg-gradient-to-br from-cyan-100 to-cyan-400 rounded-md shadow-lg"><span
            class="font-bold text-2xl">Rank</span>
          <span class="text-4xl" v-if="!isRankLoading">{{ currentRank }}</span>
          <Skeleton class="w-full h-12 rounded-full" v-else />
        </div>
        <div class="flex flex-col size-32 p-4 bg-gradient-to-br from-cyan-100 to-cyan-400 rounded-md shadow-lg"><span
            class="font-bold text-2xl">Score</span>
          <span class="text-4xl" v-if="!isRankLoading">{{ currentScore }}</span>
          <Skeleton class="w-full h-12 rounded-full" v-else />
        </div>
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
            <NuxtLink :to="`/tournaments/${t_id}/question/${submission.question_id}`"
              class="underline hover:text-cyan-600 transition-all">
              {{ submission.question_title }}</NuxtLink>
          </TableCell>
          <TableCell>
            <span class="flex gap-x-2">
              {{ submission.points_with_bonus }}
              <span class="text-xs grid place-items-center px-2 text-white bg-red-400 rounded-full"
                v-if="submission.points_with_bonus - (submission.base_points ?? 0) !== 0">{{
                  submission.points_with_bonus - (submission.base_points ?? 0) }}</span>
            </span>
          </TableCell>
          <TableCell>{{ new Date(submission.created_on).toLocaleString('th', {
            dateStyle: 'short',
            timeStyle: 'medium'
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
