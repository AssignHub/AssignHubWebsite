<script lang="ts" setup>
import { ref } from 'vue'

// Components
import Classes from '@/components/Classes.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
import Calendar from '@/components/Calendar.vue';
import Todo from '@/components/Todo.vue';
import type { NavbarItemData } from '@/types';

const tabs = ref([
  {
    name: 'classes',
    icon: 'mdi-school-outline',
    iconSelected: 'mdi-school',
    onClick: () => {},
  },
  {
    name: 'calendar',
    icon: 'mdi-calendar-outline',
    iconSelected: 'mdi-calendar',
    onClick: () => {},
  },
  {
    name: 'todo',
    icon: 'mdi-clipboard-list-outline',
    iconSelected: 'mdi-clipboard-list',
    onClick: () => {},
  },
] as NavbarItemData[])
const tab = ref(1)
</script>

<template>
  <div class="tw-flex tw-flex-col tw-h-screen">
    <div class="tw-flex-1 tw-pb-14" style="overscroll-behavior: auto;">
      <Classes v-if="tabs[tab].name === 'classes'" />
      <Calendar v-if="tabs[tab].name === 'calendar'" />
      <Todo v-if="tabs[tab].name === 'todo'" />
    </div>

    <BottomNavbar :tabs="tabs" v-model="tab"/>
  </div>
</template>
