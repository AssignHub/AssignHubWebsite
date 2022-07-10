<script lang="ts" setup>
import '@fullcalendar/core/vdom'
import FullCalendar, { type CalendarOptions, type Calendar, type EventInput, type EventClickArg } from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction'
import { ref, computed, onMounted, watch, toRefs } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useAssignmentsStore } from '@/stores/assignments'
import AssignmentCard from '@/components/AssignmentCard.vue'
import type { Assignment } from '@/types'

// Calendar api to access full calendar methods
const fullCalendar = ref()
const calendarApi = ref<Calendar>()

// Vuetify breakpoints
const display = useDisplay()
const breakpoint = computed(() => display.name.value)

// Assignments
const assignments = useAssignmentsStore()
const events = computed((): EventInput[] => {
  return assignments.array.map(a => ({
    title: a.title,
    date: a.dueDate,
    allDay: true,
    extendedProps: a,
  }))
})

// Calendar options for FullCalendar
const calendarOptions = computed((): CalendarOptions => {
  let initialView = ''
  if (isMonthView.value) {
    initialView = 'dayGridMonth'
  } else {
    if (breakpoint.value === 'xs') {
      initialView = 'dayGridThreeDay'
    } else {
      initialView = 'dayGridWeek'
    }
  }

  return {
    plugins: [ dayGridPlugin, interactionPlugin ],
    headerToolbar: false,
    initialView,
    views: {
      dayGridThreeDay: {
        type: 'dayGrid',
        duration: { days: 3 },
        buttonText: '3 day',
      },
    },
    events: events.value,
    dateClick,
    eventClick,
    eventStartEditable: true,
    eventClassNames: 'tw-border-none tw-bg-transparent',
    eventOrder: function(a: any, b: any): number {
      return a.extendedProps?.classId.localeCompare(b.extendedProps?.classId)
    },
    eventOrderStrict: true,
  }
})

function dateClick(arg: DateClickArg) {
  /* Creates a new assignment when date is clicked */
  // const calendarApi = arg.view.calendar
  // calendarApi.addEvent({
  //   title: 'Test event!',
  //   date: arg.date,
  //   allDay: true,
  // })
}

function eventClick(arg: EventClickArg) {
  assignments.toggle(arg.event.extendedProps._id)
}

/* Week / Month view stuff */ 
const isMonthView = ref(false)
const weekBtnClass = computed((): string => {
  if (!isMonthView.value) {
    return 'tw-font-semibold'
  } else {
    return 'tw-font-normal tw-text-gray-400'
  }
})
const monthBtnClass = computed((): string => {
  if (isMonthView.value) {
    return 'tw-font-semibold'
  } else {
    return 'tw-font-normal tw-text-gray-400'
  }
})

function setWeekView() {
  /* Sets the calendar to week view */
  isMonthView.value = false
  if (breakpoint.value === 'xs')
    calendarApi.value?.changeView('dayGridThreeDay')
  else
    calendarApi.value?.changeView('dayGridWeek')
}

function setMonthView() {
  /* Sets the calendar to month view */
  isMonthView.value = true
  calendarApi.value?.changeView('dayGridMonth')
}

function wrap(el: Node, wrapper: Node) {
  el.parentNode?.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

/* Lifecycle hooks */
onMounted(() => {
  calendarApi.value = fullCalendar.value.getApi()

  // for (const node of document.getElementsByClassName('fc-daygrid-day')) {
  //   console.log(node) 
  //   //wrap(node, document.createElement('div'))
  // }
})
</script>

<template>
  <div class="tw-flex tw-flex-col tw-h-full">

    <!-- Calendar header -->
    <div class="tw-flex tw-py-4 tw-items-center">
      <v-btn icon flat size="x-small" @click="calendarApi?.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon flat size="x-small" @click="calendarApi?.next()" class="tw-mr-2">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-btn variant="outlined" @click="calendarApi!.today()">Today</v-btn>
      <v-spacer />
      <v-btn variant="flat" @click="setWeekView" :class="weekBtnClass">Week</v-btn>
      <v-btn variant="flat" @click="setMonthView" :class="monthBtnClass">Month</v-btn>
    </div>

    <!-- Calendar -->
    <div class="tw-flex-1 tw-overflow-auto">
      <div class="tw-w-full tw-h-full"> <!-- change the width of this to have a scrolling calendar view-->
        <FullCalendar 
          ref="fullCalendar"
          class="tw-w-full tw-h-full"
          :options="calendarOptions"
        >
          <template v-slot:dayHeaderContent="{ date, text }">
            <div v-if="text.split(' ').length <= 1" class="tw-text-base sm:tw-text-lg">{{ text }}</div>
            <div v-else>
              <div class="tw-text-base sm:tw-text-lg">{{ text.split(' ')[0] }}</div>
              <div class="tw-font-normal tw-text-sm">{{ text.split(' ')[1] }}</div>
            </div>
          </template>

          <template v-slot:eventContent="{ event }">
            <AssignmentCard :assignment="event.extendedProps" :noClass="isMonthView" :noPadding="isMonthView"/>
          </template>
        </FullCalendar>
      </div>
    </div>
  </div>
</template>

<style>
.fc-view-harness {
  height: unset !important;
}
</style>