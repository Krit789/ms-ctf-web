<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

const leaderboard = ref();
const lastUpdated = ref(Date.now());
const isLoading = ref(false);
const flashRows = ref<number[]>([]); // Array to store row indices to flash
const cookieToken = useCookie('access_token');

const fetchLeaderboard = () => {
  isLoading.value = true;
  $fetch<{
    message: string;
    rankings: {
      student_id: number;
      firstname: string;
      lastname: string;
      totalPoints: number;
    }[];
  }>('/api/leaderboard', {
    headers: {
      Authorization: `Bearer ${cookieToken.value}`,
    },  
  })
    .then((res) => {
      const newFlashRows: number[] = [];
      if (leaderboard.value) {
        // Compare old and new data to find changed rows
        res.rankings.forEach((student, index) => {
          const oldStudent = leaderboard.value.rankings.find(
            (s) => s.student_id === student.student_id
          );
          if (
            !oldStudent ||
            oldStudent.totalPoints !== student.totalPoints
          ) {
            newFlashRows.push(index);
          }
        });
      }
      leaderboard.value = res;
      flashRows.value = newFlashRows;
      lastUpdated.value = Date.now();

      // Remove flash after a short delay
      setTimeout(() => {
        flashRows.value = [];
      }, 1000); // Adjust the delay as needed
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

fetchLeaderboard();
let interval = setInterval(fetchLeaderboard, 5000);

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <div>
        <h2
          class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0"
        >
          Leaderboard
        </h2>
        <p class="text-2xl">Bootcamp CTF Alpha</p>
      </div>
      <div class="text-right">
        <span class="animate-pulse" v-if="isLoading">Updating...</span>
        <span v-else>Up-to-date</span>
        <br />
        Last Updated: {{ new Date(lastUpdated).toLocaleString() }}
      </div>
    </div>
    <Table class="text-2xl">
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Student ID</TableHead>
          <TableHead>Firsname</TableHead>
          <TableHead>Lastname</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="leaderboard">
        <TableRow
          v-for="(student, indx) in leaderboard.rankings"
          :class="{ 'flash-row': flashRows.includes(indx) }"
        >
          <TableCell>{{ indx + 1 }}</TableCell>
          <TableCell><NuxtLink :to="`/profile/${student.student_id}`" class="underline hover:text-cyan-600 transition-all">{{ student.student_id }}</NuxtLink></TableCell>
          <TableCell>{{ student.firstname }}</TableCell>
          <TableCell>{{ student.lastname }}</TableCell>
          <TableCell>{{ student.totalPoints }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style>
.flash-row {
  animation: flash 1.5s 3;
}

@keyframes flash {
  0%,
  50%,
  100% {
    opacity: 1;
    background-color: #4ade80;
  }
  25%,
  75% {
    opacity: 0.5;
    background-color: transparent;
  }
}
</style>