<script setup lang="ts">
  import { useAssignmentsStore } from '~~/stores/assignments';
  import { Assignment } from '~~/types';
  import { compareDateDay, getDayString } from '~~/utils';

  // Stores
  const assignments = useAssignmentsStore()
  
  // Constants
  const curDate: Date = new Date()

  // The current month / year of the currently selected week
  const month = computed((): string => {
    return offsetDate.value.toLocaleString('default', { month: 'long' })
  })
  const year = computed((): number => {
    return offsetDate.value.getFullYear()
  })

  // Week offset functions to change the currently selected week
  const weekOffset = ref(0)
  function nextWeek(): void {
    weekOffset.value++
  }
  function prevWeek(): void {
    weekOffset.value--
  }
  function resetWeek(): void {
    weekOffset.value = 0
  }

  // `offsetDate` is the date of the Sunday of the currently selected week
  const offsetDate = computed((): Date => {
    const offsetDate: Date = new Date(curDate)
    offsetDate.setDate(curDate.getDate() + 7*weekOffset.value - curDate.getDay())
    return offsetDate
  })

  type Day = {
    dateObject: Date,
    date: number,
    text: string,
    assignments: Assignment[],
  }
  // `days` is an array of all the currently visible days based on the weekOffset
  const days = computed((): Day[] => {
    const days: Day[] = []

    for (let i = 0; i < 7; ++i) {
      const day: Date = new Date(offsetDate.value)
      day.setDate(offsetDate.value.getDate() + i)
      days.push({
        dateObject: day,
        date: day.getDate(),
        text: day.toLocaleString('default', { weekday: 'short' }),
        assignments: assignments.byDay.get(getDayString(day)),
      })
    }
    
    return days
  })

  // Return a class determining the color of the day text depending on where the
  // day is in relation to the curDate
  function dayTextClass(day: Date): string {
    const compare: number = compareDateDay(day, curDate)
    if (compare < 0) {
      return 'tw-text-gray'
    } else if (compare > 0) {
      return 'tw-text-black'
    } else {
      return 'tw-text-blue'
    }
  }
</script>

<template>
  <div class="tw-max-w-7xl">
    <!-- Calendar Header -->
    <div class="tw-flex tw-items-center tw-p-4">
      <v-btn @click="prevWeek" icon variant="text" size="small">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn @click="nextWeek" icon variant="text" size="small" class="tw-mr-4">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-btn @click="resetWeek" variant="outlined" size="small" class="tw-mr-4">Today</v-btn>
      <div class="tw-text-2xl tw-font-bold tw-mr-1">{{ month }}</div>
      <div class="tw-pt-1 tw-text-lg tw-text-gray tw-mr-4">{{ year }}</div>
      <div class="tw-flex-1 tw-mr-4">
        <ProgressBar :assignmentsForWeek="[]"/>
      </div>
      <v-btn variant="text" class="tw-p-2 tw-font-bold">Week</v-btn>
      <v-btn variant="text" class="tw-p-2 tw-text-gray">Month</v-btn>
    </div>

    <!-- Calendar Days -->
    <div class="tw-flex">
      <div 
        v-for="day in days" 
        :key="day.dateObject.toISOString()"
        class="tw-flex-1 tw-flex tw-flex-col tw-items-center"
        :class="dayTextClass(day.dateObject)"
      >
        <div class="tw-font-semibold tw-text-lg">{{ day.text }}</div>
        <div class="tw-font-light">{{ day.date }}</div>
      </div>
    </div>

    <v-divider class="tw-mt-4"/>

    <div class="tw-flex">
      <div 
        v-for="day in days"
        :key="day.dateObject.toISOString()"
        class="tw-flex-1 tw-space-y-1 tw-py-3 tw-px-1"
      >
        <AssignmentCard 
          v-for="assignment in day.assignments"
          :key="assignment._id"
          :assignment="assignment"
        />
        <v-btn variant="text" class="tw-p-2 tw-text-gray tw-font-medium tw-w-full" block>+ Add</v-btn>
      </div>
    </div>
  </div>
</template>