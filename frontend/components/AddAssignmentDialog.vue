<script setup lang="ts">
  import { Class } from '~~/types';
  import { useClassesStore } from '~~/stores/classes';

  const props = defineProps({
    date: { type: Date, default: new Date() },
  })
  const emit = defineEmits(['close'])

  // Stores
  const classes = useClassesStore()

  // Form variables
  const assignmentName = ref('')
  const classId = ref('') 
</script>

<template>
  <div class="tw-bg-off-white tw-rounded-md tw-p-2">
    <v-text-field 
      placeholder="Assignment name..." 

      v-model="assignmentName"

      autofocus
      class="tw-mx-1 custom-placeholder"
      :class="{'tw-font-medium': assignmentName.length > 0}"
      variant="plain" 
      hide-details 
      density="compact" 
    />
    <v-select
      prepend-icon="mdi-school"

      v-model="classId"
      :items="classes.array"
      item-title="courseId"
      item-value="_id"

      menu-icon=""
      class="tw-mb-2"
      variant="plain"
      hide-details
      density="compact"
    >
      <template v-slot:chip="{ props, item }: {props: any, item: any}">
        <v-chip
          v-if="classId.length > 0"
          v-bind="props"
          density="comfortable"
          variant="flat"
          class="tw-cursor-pointer tw-w-full tw-h-full"
          :color="(item.raw as Class).color"
          :text="(item.raw as Class).courseId"
        />
        <div v-else class="tw-text-dark-gray">Class</div>
      </template>
      <template v-slot:item="{ props, item }: {props: any, item: any}">
        <v-list-item v-bind="props" title="">
          <v-chip
            variant="flat"
            class="tw-cursor-pointer tw-text-white"
            :color="(item.raw as Class).color"
            :text="(item.raw as Class).courseId"
          />
        </v-list-item>
      </template>
    </v-select>
    <div class="tw-flex tw-items-center">
      <!-- <v-btn flat class="tw-w-10 tw-rounded-r-none">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn class="tw-flex-1 tw-bg-blue tw-text-white tw-rounded-l-none">Submit</v-btn> -->

      <v-btn class="tw-flex-1 tw-bg-blue tw-text-white tw-rounded-r-none">Submit</v-btn>
      <v-btn @click="emit('close')" flat class="tw-w-10 tw-rounded-l-none">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<style>
  .v-input--horizontal .v-input__prepend {
    margin-right: 8px !important;
  }

  .custom-placeholder input::placeholder {
    color: var(--color-dark-gray);
  }
</style>