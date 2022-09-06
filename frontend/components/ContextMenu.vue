<!-- Shows the correct context menu based on the context menu type -->
<script setup lang="ts">
  import { useAssignmentsStore } from '~~/stores/assignments';
  import { usePageStateStore } from '~~/stores/pageState';
  import { ContextMenuType } from '~~/types';

  const pageState = usePageStateStore()
  const assignments = useAssignmentsStore()

  const style = computed((): string => {
    return `
      left: ${pageState.contextMenu.x}px;
      top: ${pageState.contextMenu.y}px;
      position: absolute;
    `
  })
</script>

<template>
  <v-menu
    v-model="pageState.contextMenu.show"
    :content-props="{ style }"
    transition="false"
  >
    <v-list v-if="pageState.contextMenu.type === ContextMenuType.Assignment">
      <!-- <v-list-item @click="">
        <v-list-item-title>Edit</v-list-item-title>
      </v-list-item> -->
      <v-list-item @click="assignments.remove(pageState.contextMenu.data.assignmentId)">
        <v-list-item-title class="tw-text-red">Remove</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>