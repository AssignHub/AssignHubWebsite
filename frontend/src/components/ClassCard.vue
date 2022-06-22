<script lang="ts" setup>
import { computed } from 'vue';
import type { Class } from '@/types'

const props = defineProps({
  _class: { type: Object as () => Class, required: true }
})

const style = computed(() => {
  return { backgroundColor: props._class.color }
})
</script>

<template>
  <div class="tw-flex tw-items-center tw-w-full tw-text-white tw-p-2 tw-rounded-lg" :style="style">
    <div class="tw-ml-2">{{ props._class.courseId }}</div>
    <v-spacer />
    <v-btn flat icon size="small">
      <v-icon>mdi-dots-vertical</v-icon>

      <v-menu activator="parent" location="start">
        <v-list>
          <v-list-item @click="">
            <v-list-item-title>Edit color</v-list-item-title>
          </v-list-item>
          <v-list-item @click="" class="tw-text-red-500">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </div>
</template>