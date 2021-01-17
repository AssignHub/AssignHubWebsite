<template>
  <v-card>
    <v-card-title>
      <span class="text-h3 mr-4">{{ monthHeader }}</span>
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
          <div class="assignment-container" style="height: 200px; overflow-y: auto;" @scroll="hideContextMenu">
            <AssignmentCard
              v-for="(a, i) in getAssignmentsForDate(day.date)" 
              :key="i"
              class="mb-2 mx-2"
              :assignment="a"
              :disabled="a.done"
              @click="toggleAssignment(a._id)"
              @mousedown="(e) => {if (e.which === 3) hideContextMenu()}"
              @contextmenu="(e) => showAssignmentMenu(e, a._id)"
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

.assignment-container {
  scrollbar-width: thin;
}

.assignment-container::-webkit-scrollbar {
  width: 6px;
}

.assignment-container::-webkit-scrollbar-track {
  background: #f1f1f1; 
}

.assignment-container::-webkit-scrollbar-thumb {
  background: #CCC; 
}

.assignment-container::-webkit-scrollbar-thumb:hover {
  background: #888; 
}
</style>

<script>
import AssignmentCard from '@/components/AssignmentCard'
import { compareDateDay } from '@/utils/utils.js'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { CONTEXT_MENU_TYPES } from '@/constants'

export default {
  name: 'Calendar',

  components: {
    AssignmentCard,
  },

  data() {
    return {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      dayLength: 24 * 60 * 60 * 1000,
      weekOffset: 0,
      curDate: new Date(),
    }
  },

  computed: {
    ...mapState([ 'assignments' ]),
    ...mapGetters({ classes: 'termClasses', numPendingAssignments: 'numPublicAssignments' }),
    monthHeader() {
      const begMonth = this.months[this.daysOfWeek[0].date.getMonth()]
      const begYear = this.daysOfWeek[0].date.getFullYear()
      const endMonth = this.months[this.daysOfWeek[this.daysOfWeek.length-1].date.getMonth()]
      const endYear = this.daysOfWeek[this.daysOfWeek.length-1].date.getFullYear()

      if (begMonth !== endMonth) {
        return `${begMonth} ${begYear} - ${endMonth} ${endYear}`
      }
      return `${begMonth} ${begYear}`
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
    ...mapMutations([ 'hideContextMenu', 'showContextMenu' ]),
    ...mapActions([ 'toggleAssignment' ]),
    getDateWithOffset(offset) {
      return new Date(this.curDate.getTime() + offset*this.dayLength)
    },
    getAssignmentsForDate(date) {
      let assignments = this.assignments.filter(a => {
        return compareDateDay(a.dueDate, date) === 0
      }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
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
    showAssignmentMenu(e, id) {
      e.preventDefault()
      this.showContextMenu({
        type: CONTEXT_MENU_TYPES.assignment,
        data: { assignmentId: id },
        mouseEvent: e,
      })
    },
  },
}
</script>