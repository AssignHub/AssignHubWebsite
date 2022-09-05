<!-- Displays a singular assignment -->
<script setup lang="ts">
  import { useAssignmentsStore } from '~~/stores/assignments';
  import { useClassesStore } from '~~/stores/classes';
  import { Assignment, Class } from '~~/types';

  // Props
  const props = defineProps({
    assignment: { type: Object as () => Assignment, required: true },
  })

  // Stores
  const assignments = useAssignmentsStore()
  const classes = useClassesStore()

  // The class this assignment is associated with
  const _class = computed((): Class => {
    return classes.byId.get(props.assignment.classId)
  })

  function toggle(): void {
    assignments.toggle(props.assignment._id)
  }
</script>

<template>
  <div
    @click="toggle" 
    v-ripple 
    class="tw-rounded-md tw-text-white tw-select-none tw-cursor-pointer" 
    :style="{ backgroundColor: _class.color, opacity: props.assignment.done ? 0.5 : 1 }"
  >
    <v-expand-transition>
      <div v-if="!props.assignment.done">
        <div  class="tw-rounded-t-md tw-text-xs tw-font-light tw-w-full tw-bg-[#E0E0E040] tw-p-1">
          {{ _class.courseId }}
        </div>
      </div>
    </v-expand-transition>
    <div class="tw-p-2 tw-font-medium tw-text-sm" :class="{ 'tw-line-through': props.assignment.done }">
      {{ props.assignment.title }}
    </div>
  </div>
</template>