<script lang="ts" setup>
import { ref } from 'vue';
import ClassCard from './ClassCard.vue';
import type { Class } from '@/types'

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
] as Class[])
</script>

<template>
  <div class="tw-p-6 tw-max-w-xs">
    <div class="tw-text-xl tw-font-semibold tw-mb-4">Classes</div>
    <ClassCard 
      class="tw-mb-2"
      v-for="c in classes"
      :key="c._id"
      :_class="c"
    />
    <v-btn text flat class="tw-text-gray-400" block>
      + Add class
    </v-btn>
  </div>
</template>