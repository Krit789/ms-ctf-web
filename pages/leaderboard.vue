<script setup lang="ts">
const data = [
  { id: '65070001', score: 100 },
  { id: '66070002', score: 90 },
]
</script>

<template>
  <div class="flex flex-col gap-2">
    <NuxtLink to="/" class="underline">Back</NuxtLink>

    <Table class="text-2xl">
      <TableHeader>
        <TableRow>
          <TableHead>Student ID</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="student in data">
          <TableCell>{{ student.id }}</TableCell>
          <TableCell>{{ student.score }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>