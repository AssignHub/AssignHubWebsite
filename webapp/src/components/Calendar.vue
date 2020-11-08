<template>
  <v-card>
    <v-card-title>
      <span class="text-h3 mr-4">{{ month }} {{ year }}</span>
      <v-chip v-if="numPendingAssignments > 0">{{ numPendingAssignments }} pending assignments</v-chip>
      <v-spacer></v-spacer>
      <v-btn text>Week</v-btn>
      <v-btn text>Month</v-btn>
    </v-card-title>
    <v-card-text class="pb-0">
      <v-row>
        <div class="col-day" v-for="(day, i) in daysOfWeek" :key="i" style="" :style="i !== 0 && 'border-left: solid; border-width: 1px;'">
          <div class="text-center text-h5 mb-n2" :class="getClassFromOffset(day.offset)">{{ day.name }}</div>
          <div class="text-center text-h7" :class="getClassFromOffset(day.offset)">{{ day.date.getDate() }}</div>
          <div style="height: 200px; overflow-y: auto;">
            <AssignmentCard
              v-for="(a, i) in getAssignmentsForDate(day.date)" 
              :key="i"
              class="mb-2 mx-2"
              :assignment="a"
              :classes="classes"
              :disabled="a.done"
              @click="toggleAssignment(a.uid)"
            />
          </div>
        </div>
      </v-row>
      <v-row style="position: relative; height: 50px;">
        <v-btn 
          icon
          style="position: absolute; z-index: 5; left: 10px; top:50%; transform: translateY(-50%);"
          @click="prevWeek"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn 
          icon
          style="position: absolute; z-index: 5; right: 10px; top:50%; transform: translateY(-50%);"
          @click="nextWeek"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.col-day {
  width: 14.28% !important;
}
</style>

<script>
import AssignmentCard from '@/components/AssignmentCard'
import { compareDateDay } from '@/utils/util.js'

export default {
  name: 'Calendar',

  props: {
    assignments: {type: Array, required: true},
    classes: {type: Array, required: true},
    curDate: {type: Date, required: true},
    numPendingAssignments: {type: Number, required: true},
  },

  components: {
    AssignmentCard,
  },

  data() {
    return {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      dayLength: 24 * 60 * 60 * 1000,
      weekOffset: 0,
    }
  },

  computed: {
    month() {
      return this.months[this.daysOfWeek[0].date.getMonth()]
    },
    year() {
      return this.curDate.getFullYear()
    },
    daysOfWeek() {
      let curDateNum = this.curDate.getDate()
      let curDayNum = this.curDate.getDay()
      let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      let daysOfWeek = []

      for (let i = 0; i < days.length; i++) {
        let curDayOffset = (this.weekOffset*7 + i) - curDayNum
        daysOfWeek.push({
          name: days[i],
          date: this.getDateWithOffset(curDayOffset),
          offset: curDayOffset,
        })
      }

      return daysOfWeek
    },
  },

  methods: {
    getDateWithOffset(offset) {
      return new Date(this.curDate.getTime() + offset*this.dayLength)
    },
    getAssignmentsForDate(date) {
      let assignments = this.assignments.filter(a => {
        return compareDateDay(a.dueDate, date) === 0
      }).sort((a, b) => a.dueDate - b.dueDate)
      return assignments
    },
    getClassFromOffset(offset) {
      if (offset === 0)
        return 'primary--text'
      else if (offset > 0)
        return 'text--primary'
      return ''
    },
    nextWeek() {
      this.weekOffset++
    },
    prevWeek() {
      this.weekOffset--
    },
    toggleAssignment(uid) {
      this.$emit('toggleAssignment', uid)
    }, 
  },
}
</script>