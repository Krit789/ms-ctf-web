<script setup lang="ts">

const tournaments_res = ref()
const tokenCookie = useCookie('access_token')

const fetchTournaments = () => {
  $fetch('/api/tournaments', {
    headers: {
      Authorization: `Bearer ${tokenCookie.value}`
    },
  })
    .then((res) => {
      tournaments_res.value = res
    })
    .catch((err) => {
      console.error(err)
    })
}

fetchTournaments()

</script>
<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-left mt-2 scroll-m-20 pb-2 text-4xl font-bold tracking-tight transition-colors first:mt-0">
          Tournaments
        </h2>
        <p class="text-2xl">CTF.IT</p>
      </div>
      <div class="text-right">
      </div>
    </div>
    <Table class="text-2xl">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Begin</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="tournaments_res">
        <TableRow v-for="(t, indx) in tournaments_res.tournament">
          <TableCell>{{ t.name }}</TableCell>
          <TableCell>{{ t.begin_time ? new Date(t.begin_time).toLocaleString('th') : "Before Mankind" }}</TableCell>
          <TableCell>{{ t.end_time ? new Date(t.end_time).toLocaleString('th') : "Future Life" }}</TableCell>
          <TableCell>
            <NuxtLink :to="`/tournaments/${t.t_id}`"><Button class="bg-emerald-400">Enter</Button>
            </NuxtLink>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>