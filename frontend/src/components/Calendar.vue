<script lang="ts" setup>
import '@fullcalendar/core/vdom'
import FullCalendar, { type CalendarOptions } from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction'
import { ref, computed } from 'vue'
import { breakpoint } from '@/utils'

const calendarOptions = computed(() => {
  let headerToolbar = {}
  if (breakpoint() === 'xs') {
    headerToolbar = {
      left: 'today',
      center: 'title',
      right: 'dayGridMonth,dayGridThreeDay'
    }
  } else {
    headerToolbar = {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    }
  }

  return {
    plugins: [ dayGridPlugin, interactionPlugin ],
    headerToolbar: headerToolbar,
    initialView: 'dayGridMonth',
    views: {
      dayGridThreeDay: {
        type: 'dayGrid',
        duration: { days: 3 },
        buttonText: '3 day',
      },
    },
    events: [
      { title: 'Homework 1', date: '2022-06-22' },
      { title: 'Homework 2', date: '2022-06-23' },
    ],
    dateClick,
    editable: true,
    eventDurationEditable: false,
  } as CalendarOptions
})

function dateClick(arg: DateClickArg) {
  const calendarApi = arg.view.calendar
  calendarApi.addEvent({
    title: 'Test event!',
    date: arg.date,
    allDay: true,
  })
}
</script>

<template>
  <div class="tw-p-6 tw-flex tw-flex-col tw-h-full">
    <div class="tw-text-xl tw-font-semibold tw-mb-4">Calendar</div>
    <FullCalendar 
      class="tw-flex-1"
      :options="calendarOptions"
    />
  </div>
</template>

<style>
.fc-view-harness {
  height: unset !important;
}
</style>