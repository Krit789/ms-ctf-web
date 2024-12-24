<script setup lang="ts">
import { ArrowDownToLine } from 'lucide-vue-next'
const props = defineProps({
  tid: {
    type: String,
    required: true
  }
})

const userState = useUserState()

const data_1 = ref([
  {
    "for_student_id": "66070001",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "b",
      "4": "a",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070006",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "b",
      "4": "a",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070007",
    "answers": {
      "1": "a",
      "2": "a",
      "3": "b",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070014",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070024",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "b",
      "4": "a",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070030",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "b",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070039",
    "answers": {
      "1": "a",
      "2": "a",
      "3": "a",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070041",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "b",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070046",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "b",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070052",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "a",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070055",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "a",
      "4": "a",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070061",
    "answers": {
      "1": "a",
      "2": "a",
      "3": "b",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070069",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "b",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070077",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "b",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070084",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "b",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070091",
    "answers": {
      "1": "a",
      "2": "a",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070100",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070101",
    "answers": {
      "1": "a",
      "2": "a",
      "3": "a",
      "4": "a",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070107",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "a",
      "4": "a",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070108",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070112",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "b",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070118",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070119",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "b",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070124",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070136",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "a",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070138",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "b",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070139",
    "answers": {
      "1": "a",
      "2": "a",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070158",
    "answers": {
      "1": "a",
      "2": "a",
      "3": "b",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070177",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070179",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "a",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070191",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "b",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070193",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "b",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070200",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "b",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070216",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "a",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070217",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "b",
      "4": "a",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070218",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070220",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "a",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070221",
    "answers": {
      "1": "a",
      "2": "a",
      "3": "b",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070225",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070238",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070239",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "a",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070244",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "b",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070246",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "b",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070247",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "a",
      "4": "b",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070273",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "a",
      "4": "a",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070276",
    "answers": {
      "1": "a",
      "2": "a",
      "3": "b",
      "4": "a",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070291",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "b",
      "4": "a",
      "5": "b"
    }
  },
  {
    "for_student_id": "66070305",
    "answers": {
      "1": "b",
      "2": "a",
      "3": "b",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "66070315",
    "answers": {
      "1": "b",
      "2": "b",
      "3": "a",
      "4": "a",
      "5": "a"
    }
  },
  {
    "for_student_id": "61070336",
    "answers": {
      "1": "a",
      "2": "a",
      "3": "a",
      "4": "b",
      "5": "b"
    }
  },
  {
    "for_student_id": "62070206",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "a",
      "4": "a",
      "5": "a"
    }
  },
  ,
  {
    "for_student_id": "65070030",
    "answers": {
      "1": "a",
      "2": "b",
      "3": "a",
      "4": "a",
      "5": "a"
    }
  }
])

const filteredData = ref()

if (props.tid === '1') {
  data_1.value.forEach((i) => {
    if (i.for_student_id === userState.value?.student_id) {
      filteredData.value = i
    }
  })
} else if (props.tid === '2') {
  filteredData.value = 
    {
    "answers": {
      "1": "",
      "2": "",
      "3": "",
    }
  }
}
// data.value.forEach((i) => {
//   if (i.for_student_id === userState.value?.student_id) {
//     filteredData.value = i
//   }
// })
</script>

<template>
<div class="flex flex-col gap-4">
  <h3 class="text-2xl font-bold">Your CTF File</h3>
  <div v-if="filteredData" class="flex flex-wrap gap-4">
    <div v-for="i, index in filteredData.answers" :key="index" class="flex flex-row gap-x-2 border-2 p-4 rounded-md shadow-md">
      Problem {{ index }}
      <NuxtLink :to="`/ctf/ctf0${tid}-${index}${i}.pka`" target="_blank" class="hover:underline text-blue-500" external> 
        <ArrowDownToLine />
      </NuxtLink>
    </div>
  </div>
  <div v-else>
    <p>CTF File not found (for your ID)</p>
  </div>  
</div>
</template>