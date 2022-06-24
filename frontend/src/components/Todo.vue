<script lang="ts" setup>
import { ref } from 'vue';
import ClassTodos from './ClassTodos.vue'

const classes = ref([
  {
    _id: '1234',
    courseId: 'CSCI-170',
    name: 'Discrete Methods in Computer Science',
    color: '#6b7280',
  },
  {
    _id: '123',
    courseId: 'CSCI-103',
    name: 'Introduction to Programming',
    color: '#ef4444',
  },
  {
    _id: '12',
    courseId: 'BUAD-302',
    name: 'Business Communications',
    color: '#22c55e',
  }
])
</script>

<template>
    <div class="tw-p-6 tw-max-w-full">
        <div class="tw-text-xl tw-font-semibold tw-mb-4">Todo</div>
        <div class="tw-grid tw-grid-cols-2 tw-gap-2">
          <ClassTodos 
            v-for="c in classes"
            :key="c._id"
            :_class="c"
          />
        </div>
    </div>
</template>