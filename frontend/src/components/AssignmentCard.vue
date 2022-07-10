<script lang="ts" setup>
import type { Assignment, Class } from '@/types'
import { computed } from 'vue';
import { useClassesStore } from '@/stores/classes'

const props = defineProps({
  assignment: { type: Object as () => Assignment, required: true },
  noClass: { type: Boolean, default: false },
  noPadding: { type: Boolean, default: false },
})
const classes = useClassesStore() // For some reason this causes a pinia warning??

const _class = computed((): Class => {
  // Get the class object from classId
  return classes.byId.get(props.assignment.classId) as Class
}) 
</script>

<template>
  <div class="tw-rounded tw-text-white" :style="{ backgroundColor: _class.color }">
    <div 
      v-if="!noClass" 
      class="tw-rounded-t tw-text-xs tw-font-light tw-w-full tw-bg-[#55555588]"
      :class="{ 'tw-p-1': !noPadding }"  
    >{{ _class.courseId }}</div>
    <div :class="{ 'tw-p-1': !noPadding, 'tw-line-through': !assignment.done }">
      {{ props.assignment.title }}
    </div>
  </div>
</template>