<!-- Displays assignments in a calendar view -->
<template>
  <div
    id="tut-calendar"
    class="outer-container"
  >
    <v-card>
      <div class="calendar-header pa-2">
        <v-btn icon small class="ml-2" @click="prevWeek">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon small class="mr-2" @click="nextWeek">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>

        <v-expand-x-transition mode="out-in">
          <div :key="headerKey" style="white-space: nowrap;">
            <template v-for="(item, i) in monthHeader">
              <span :key="`dash-${i}`" v-if="i !== 0" class="mr-4 text-h4"
                >-</span
              >
              <span :key="`month-${i}`" class="month-text text-h3 mr-4"
                ><b>{{ item.month }}</b></span
              >
              <span
                :key="`year-${i}`"
                v-if="item.year"
                class="year-text text-h4 mr-4"
                >{{ item.year }}</span
              >
            </template>
          </div>
        </v-expand-x-transition>

        <!--<v-chip v-if="numPendingAssignments > 0">{{ numPendingAssignments }} pending assignments</v-chip>-->

        <ProgressBar
          class="flex mr-4"
          :assignments-for-week="assignmentsByDay"
        />

        <AuthUserMenu />
      </div>
      <div
        style="overflow-x: auto; flex: 1 1 auto; display: flex; flex-flow: column;"
      >
        <div
          class="calendar-middle d-flex"
          :class="scrollAmt > 0 && 'bottom-shadow'"
          style="flex: 0 0 auto;"
        >
          <div
            class="col-day"
            :class="i !== 0 && 'left-border'"
            v-for="(day, i) in daysOfWeek"
            :key="i"
          >
            <div class="top-border pa-2">
              <div
                class="text-center text-h5 mb-n2"
                :class="getClassFromOffset(day.offset)"
              >
                {{ day.name }}
              </div>
              <div
                class="text-center text-h7"
                :class="getClassFromOffset(day.offset)"
              >
                {{ day.date.getDate() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>
    <div class="d-flex mt-2" style="overflow: auto;">
      <div
        class="col-day pb-1"
        v-for="(day, i) in daysOfWeek"
        :key="i"
        style="overflow: auto;"
      >
        <v-card
          class="pa-2 mx-1"
          v-if="assignmentsByDay[i].length > 0"
          style="overflow: auto; max-height: 100%;"
        >
          <AssignmentCard
            v-for="(a, j) in assignmentsByDaySeparated[i].todo"
            :key="`todo-${a._id}`"
            :class="j !== 0 && 'mt-2'"
            :assignment="a"
            :disabled="a.done"
            @click="_toggleAssignment(a._id)"
            @mousedown="
              (e) => {
                if (e.which === 3) hideContextMenu()
              }
            "
            @contextmenu="(e) => showAssignmentMenu(e, a._id)"
          />

          <v-btn
            v-show="assignmentsByDaySeparated[i].done.length > 0"
            @click="$set(completed, i, !completed[i])"
            plain
            block
            text
            class="pa-1"
            :class="assignmentsByDaySeparated[i].todo.length > 0 && 'mt-2'"
          >
            <div
              class="text-caption"
              style="display: flex; align-items: center; width: 100%; text-align:left;"
            >
              <div style="flex: 1">completed</div>
              <v-icon v-if="completed[i]">mdi-chevron-up</v-icon>
              <v-icon v-else>mdi-chevron-down</v-icon>
            </div>
          </v-btn>

          <v-expand-transition>
            <div v-if="completed[i]">
              <AssignmentCard
                v-for="(a, j) in assignmentsByDaySeparated[i].done"
                :key="`done-${a._id}`"
                :class="'mt-2'"
                :assignment="a"
                :disabled="a.done"
                @click="_toggleAssignment(a._id)"
                @mousedown="
                  (e) => {
                    if (e.which === 3) hideContextMenu()
                  }
                "
                @contextmenu="(e) => showAssignmentMenu(e, a._id)"
              />
            </div>
          </v-expand-transition>
        </v-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outer-container {
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow-x: auto;
}

.calendar-header {
  flex: 0 1 auto;
  display: flex;
  align-items: center;
}

.year-text {
  align-self: flex-end;
  color: lightgray;
}

.calendar-middle {
  min-width: 600px;
}

.left-border {
  box-shadow: -1px 0px 0px 0px lightgray;
}

.top-border {
  box-shadow: inset 0px 1px 0px 0px lightgray;
}

.bottom-shadow {
  box-shadow: 0px 5px 5px -5px gray;
  z-index: 3;
}

.col-day {
  width: 14.28% !important;
}
</style>

<script>
import AssignmentCard from '@/components/AssignmentCard'
import AuthUserMenu from '@/components/AuthUserMenu'
import ProgressBar from '@/components/ProgressBar'
import { compareDateDay, partition } from '@/utils/utils.js'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { CONTEXT_MENU_TYPES } from '@/constants'

export default {
  name: 'Calendar',

  components: {
    AssignmentCard,
    AuthUserMenu,
    ProgressBar,
  },

  created() {
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowRight') this.nextWeek()
      else if (e.key === 'ArrowLeft') this.prevWeek()
    })
  },

  data() {
    return {
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      dayLength: 24 * 60 * 60 * 1000,
      weekOffset: 0,
      curDate: new Date(),
      scrollAmt: 0,
      completed: [false, false, false, false, false, false, false],
    }
  },

  computed: {
    ...mapState(['assignments', 'numPendingAssignments']),
    ...mapGetters({ classes: 'termClasses' }),
    curMonthYear() {
      /*
       * Returns an object containing the beginning/ending month for the currently
       * selected week
       */
      const begMonth = this.months[this.daysOfWeek[0].date.getMonth()]
      const begYear = this.daysOfWeek[0].date.getFullYear()
      const endMonth = this.months[
        this.daysOfWeek[this.daysOfWeek.length - 1].date.getMonth()
      ]
      const endYear = this.daysOfWeek[
        this.daysOfWeek.length - 1
      ].date.getFullYear()
      return { begMonth, begYear, endMonth, endYear }
    },
    monthHeader() {
      /*
       * Returns an array containing the current month and year
       * If the current week spans two different months, there will be two elements in array
       * Otherwise, there will be one element
       */
      let { begMonth, begYear, endMonth, endYear } = this.curMonthYear

      // Return array based on if months and years are the same
      if (begMonth !== endMonth) {
        begMonth = begMonth.substring(0, 3)
        endMonth = endMonth.substring(0, 3)
        if (begYear === endYear)
          return [
            { month: begMonth, year: '' },
            { month: endMonth, year: endYear },
          ]
        return [
          { month: begMonth, year: begYear },
          { month: endMonth, year: endYear },
        ]
      }
      return [{ month: begMonth, year: begYear }]
    },
    headerKey() {
      /* Calculate and returns the header key based on months and years (used to animate text transition) */
      let { begMonth, begYear, endMonth, endYear } = this.curMonthYear
      return begMonth + begYear + endMonth + endYear
    },
    daysOfWeek() {
      /* Returns an array containing information for the days of the current week */
      const curDayNum = this.curDate.getDay()
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const daysOfWeek = []

      for (let i = 0; i < days.length; i++) {
        const curDayOffset = this.weekOffset * 7 + i - curDayNum
        daysOfWeek.push({
          name: days[i],
          date: this.getDateWithOffset(curDayOffset),
          offset: curDayOffset,
        })
      }

      return daysOfWeek
    },
    assignmentsByDaySeparated() {
      /* returns array containing the assignments for the week by day, separated by done and todo */
      let arr = []
      for (let day of this.daysOfWeek) {
        arr.push(this.getAssignmentsForDate(day.date))
      }
      return arr
    },
    assignmentsByDay() {
      /* returns array containing the assignments for the week by day */
      return this.assignmentsByDaySeparated.map((a) => [...a.done, ...a.todo])
    },
  },

  methods: {
    ...mapMutations(['hideContextMenu', 'showContextMenu']),
    ...mapActions(['toggleAssignment']),
    getDateWithOffset(offset) {
      return new Date(this.curDate.getTime() + offset * this.dayLength)
    },
    getAssignmentsForDate(date) {
      const allAssignments = this.assignments
        .filter((a) => {
          return compareDateDay(a.dueDate, date) === 0 //&& !a.done
        })
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )
      const [done, todo] = partition(allAssignments, (a) => a.done)
      return { done, todo }
    },
    getClassFromOffset(offset) {
      if (offset === 0) return 'primary--text'
      else if (offset > 0) return 'text--primary'
      return 'grey--text'
    },
    nextWeek() {
      this.weekOffset++
      this.resetCompleted()
    },
    prevWeek() {
      this.weekOffset--
      this.resetCompleted()
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
    _toggleAssignment(...args) {
      setTimeout(() => this.toggleAssignment(...args), 100)
    },
    resetCompleted() {
      this.completed = [false, false, false, false, false, false, false]
    },
  },
}
</script>
