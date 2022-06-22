<script lang="ts" setup>
import { ref } from 'vue'
import Classes from '@/components/Classes.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'

const tabs = ref([
  {
    icon: 'mdi-school-outline',
    iconSelected: 'mdi-school',
    onClick: () => {},
  },
  {
    icon: 'mdi-calendar-outline',
    iconSelected: 'mdi-calendar',
    onClick: () => {},
  },
  {
    icon: 'mdi-clipboard-list-outline',
    iconSelected: 'mdi-clipboard-list',
    onClick: () => {},
  },
])

const tab = ref(0)
</script>

<template>
  <div>
    <Classes />

    <BottomNavbar :tabs="tabs" v-model="tab"/>
  </div>
</template>
