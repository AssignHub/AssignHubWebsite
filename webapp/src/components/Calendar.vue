<template>
  <v-card>
    <div class="outer-container">
      <v-card-title style="flex: 0 1 auto;">
        <span class="text-h3 mr-4">{{ monthHeader }}</span>
        <v-chip v-if="numPendingAssignments > 0">{{ numPendingAssignments }} pending assignments</v-chip>
      </v-card-title>
      <div class="d-flex scrollbar-hidden" :class="scrollAmt > 0 && 'bottom-shadow'" style="flex: 0 0 auto; overflow-y: scroll">
        <div class="col-day" :class="i !== 0 && 'left-border'" v-for="(day, i) in daysOfWeek" :key="i">
          <div class="text-center text-h5 mb-n2" :class="getClassFromOffset(day.offset)">{{ day.name }}</div>
          <div class="text-center text-h7" :class="getClassFromOffset(day.offset)">{{ day.date.getDate() }}</div>
        </div>
      </div>
      <div v-scroll.self="onScroll" style="flex: 1 1 auto; overflow-y: scroll;" @scroll="hideContextMenu">
        <div class="d-flex" style="min-height: 100%;">
          <div class="col-day" :class="i !== 0 && 'left-border'" v-for="(day, i) in daysOfWeek" :key="i">
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
      </div>
      <div class="btn-row">
        <v-btn 
          icon
          class="ml-2"
          style="align-self: center;"
          @click="prevWeek"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer />
        <v-btn 
          icon
          class="mr-2"
          style="align-self: center;"
          @click="nextWeek"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.outer-container {
  display: flex;
  flex-flow: column;
  height: 100%;
}

.left-border {
  box-shadow: -1px 0px 0px 0px black;
}

.bottom-shadow {
  box-shadow: 0px 5px 5px -5px gray;
  z-index: 3;
}

.btn-row {
  flex: 0 0 50px;
  display: flex; 
}

.col-day {
  width: 14.28% !important;
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
      scrollAmt: 0,
    }
  },

  computed: {
    ...mapState([ 'assignments', 'numPendingAssignments' ]),
    ...mapGetters({ classes: 'termClasses' }),
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
    onScroll(e) {
      this.scrollAmt = e.target.scrollTop
    },
  },
}
</script>