<script lang="ts" setup>
import ClassCard from './ClassCard.vue';
import { useClassesStore } from '@/stores/classes';

const classes = useClassesStore()
</script>

<template>
  <div class="tw-p-4 tw-max-w-xs">
    <div class="tw-text-xl tw-font-semibold tw-mb-4">Classes</div>
    <ClassCard 
      class="tw-mb-2"
      v-for="c in classes.array"
      :key="c._id"
      :_class="c"
    />
    <v-btn text flat class="tw-text-gray-400" block>
      + Add class
    </v-btn>
  </div>
</template>