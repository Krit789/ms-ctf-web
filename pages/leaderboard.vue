<script setup lang="ts">
const data = [
  { id: 1, score: 100 },
  { id: 2, score: 90 },
  { id: 3, score: 80 },
  { id: 4, score: 70 },
  { id: 5, score: 60 },
  { id: 6, score: 50 },
  { id: 7, score: 40 },
  { id: 8, score: 30 },
  { id: 9, score: 20 },
  { id: 10, score: 10 },
]
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>รหัสนักศึกษา</TableHead>
        <TableHead>คะแนน</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="student in data">
        <TableCell>{{ student.id }}</TableCell>
        <TableCell>{{ student.score }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>