<script setup lang="ts">
import {
  Button,
} from '@/components/ui/button'

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'

interface StudentData {
  question_points: number;
  question_question_title: string;
  question_question_id: number;
  student_firstname: string;
  student_lastname: string;
  student_id: number;
  created_on: string; // Consider using Date if you need to manipulate it as a date object
  correct: boolean;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface DataResponse {
  data: StudentData[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const LiveLog = ref<DataResponse>()
const currentPage = ref(1)

const lastUpdated = ref(Date.now())
const isLoading = ref(false)
const tokenCookie = useCookie('access_token')
const fetchLiveLog = (page: number) => {
  if (!page) {
    page = currentPage.value
  } else {
    currentPage.value = page
  }
  isLoading.value = true
  $fetch<DataResponse>('/api/livelog',
    {
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      },
      params: {
        page: page,
        limit: 10
      }
    }
  )
    .then((res) => {
      LiveLog.value = res
      lastUpdated.value = Date.now()
    }).catch((err) => {
      console.error(err)
    }).finally(() => {
      isLoading.value = false
    })
}

fetchLiveLog(currentPage.value)
let interval = setInterval(fetchLiveLog, 5000)

onUnmounted(() => {
  clearInterval(interval)
})

</script>

<template>
  <div class="flex flex-col gap-2 ">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0">
          Submission Log</h2>
        <p class="text-2xl">Bootcamp CTF Alpha</p>
      </div>
      <div class="text-right">
        <span class="animate-pulse" v-if="isLoading">Updating...</span>
        <span v-else>Up-to-date</span>
        <br>
        Last Updated: {{ new Date(lastUpdated).toLocaleString() }}
      </div>
    </div>
    <div class="min-h-[700px]">
      <Table class="text-2xl">
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Firstname</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Verdict</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody v-if="LiveLog">
          <TableRow v-for="submission, indx in LiveLog.data">
            <TableCell>
              <NuxtLink :to="`/profile/${submission.student_id}`" class="underline hover:text-cyan-600 transition-all">
                {{ submission.student_id }}</NuxtLink>
            </TableCell>
            <TableCell>{{ submission.student_firstname }}</TableCell>
            <TableCell>
            <NuxtLink :to="`/question/${submission.question_question_id }`"
              class="underline hover:text-cyan-600 transition-all">
              {{ submission.question_question_title }}</NuxtLink>
          </TableCell>
            <TableCell :class="{ 'bg-green-400': submission.correct, 'bg-red-400': !submission.correct }">{{
              submission.correct ? "Correct" : "Wrong" }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div class="flex justify-center">
      <Pagination v-slot="{ page }" :page="LiveLog?.currentPage" @update:page="fetchLiveLog"
        :total="LiveLog?.totalItems" :items-per-page="LiveLog?.itemsPerPage" :sibling-count="1" show-edges
        :default-page="1">
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst />
          <PaginationPrev />

          <template v-for="(item, index) in items">
            <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
              <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext />
          <PaginationLast />
        </PaginationList>
      </Pagination>
    </div>
  </div>
</template>