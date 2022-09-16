<!-- Displays assignments in a calendar view -->
<template>
  <div
    id="tut-calendar"
    class="outer-container"
    style="position: relative;"
  >
    <v-card>
      <div class="calendar-header pa-2">
        <v-btn icon small class="ml-2" @click="prevWeek">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon small class="mr-2" @click="nextWeek">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>

        <v-btn
          class="mr-2"
          outlined
          @click="weekOffset = 0"
        >Today</v-btn>

        <v-expand-x-transition mode="out-in">
          <div :key="headerKey" style="white-space: nowrap;">
            <template v-for="(item, i) in monthHeader">
              <span :key="`dash-${i}`" v-if="i !== 0" class="mr-4 text-h4 text-unselectable"
                >-</span
              >
              <span :key="`month-${i}`" class="month-text text-h3 mr-4 text-unselectable"
                ><b>{{ item.month }}</b></span
              >
              <span
                :key="`year-${i}`"
                v-if="item.year"
                class="year-text text-h4 mr-4 text-unselectable"
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

        <v-btn 
          color="primary"
          class="mr-4"
          text
          target="_blank"
          href="https://forms.gle/g5FqXuCHBEFXsvHu6"
        >
          Feedback
        </v-btn>

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
            class="col-day day-header clickable"
            :class="i !== 0 && 'left-border'"
            v-for="(day, i) in daysOfWeek"
            :key="i"
            @click="$root.$emit('addAssignmentOnDate', day.date)"
          >
            <div class="top-border pa-2">
              <div
                class="text-center text-h5 mb-n2 text-unselectable"
                :class="getClassFromOffset(day.offset)"
              >
                {{ day.name }}
              </div>
              <div
                class="text-center text-h7 text-unselectable"
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
            v-dragged="(e) => drag(e, a._id)"
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
                v-for="(a) in assignmentsByDaySeparated[i].done"
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

.clickable:hover {
  cursor: pointer;
}
</style>

<script>
import AssignmentCard from '@/components/AssignmentCard'
import AuthUserMenu from '@/components/AuthUserMenu'
import ProgressBar from '@/components/ProgressBar'
import { compareDateDay, partition, sortAssignments, getDateInfo } from '@/utils'
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
    /*window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowRight') this.nextWeek()
      else if (e.key === 'ArrowLeft') this.prevWeek()
    })*/
  },

  mounted() {
    this.setDayBoundaries()
    window.addEventListener('resize', this.setDayBoundaries)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.setDayBoundaries)
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
      scrollAmt: 0,
      completed: [false, false, false, false, false, false, false], // Whether completed drop down is open
      
      dragEl: null, // The element currently being dragged,
      startDrag: { x: null, y: null }, // Start location of drag
      dragThreshold: 20, // Amount of distance we must drag assignment before actually drags (instead of toggling)
      dragTimeout: null, // Timeout for when assignment dragged to the edge of the screen (to switch weeks)
      dragInterval: 1000, // Interval to wait between calls of dragTimeout

      dayBoundaries: [], // x value boundaries of calendar columns
    }
  },

  computed: {
    ...mapState(['assignments', 'numPendingAssignments', 'mouseButtons']),
    ...mapGetters({ classes: 'termClasses', assignmentById: 'assignmentById'  }),
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
      let curDayNum = new Date().getDay()
      // if (curDayNum === 0) curDayNum = 7  // Make sunday the last day instead of the first day

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']//, 'Sun']
      const daysOfWeek = []

      for (let i = 0 /*1*/; i < days.length; i++) {
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
    ...mapMutations({ updateAssignmentFrontend: 'updateAssignment' }),
    ...mapActions(['toggleAssignment', 'updateAssignment']),
    setDayBoundaries() {
      /* Sets array containing the x value boundaries of calendar columns */
      const boundaries = []
      const headers = document.getElementsByClassName('day-header')
      for (const header of headers) {
        const { left } = header.getBoundingClientRect()
        boundaries.push(left)
      }
      boundaries.sort((a, b) => a-b).splice(0, 1)
      this.dayBoundaries = boundaries
    },
    drag({ el, deltaX, deltaY, clientX, clientY, offsetX, offsetY, first, last }, assignmentId) {
      /* Drag event for when assignment is dragged */

      if (first && this.mouseButtons === 1) {
        // Set start drag position
        this.startDrag = { x: clientX, y: clientY }

        // Create a new absolutely positioned element to drag around
        this.dragEl = el.cloneNode(true)
        const calendarEl = document.getElementById('tut-calendar')
        calendarEl.appendChild(this.dragEl)

        // Get values to use later in determining element style
        const { left: calendarX, top: calendarY } = calendarEl.getBoundingClientRect()
        const { width: origWidth, left: origX, top: origY } = el.getBoundingClientRect() 

        // Set styles of new element
        this.dragEl.style.width = origWidth + 'px'
        this.dragEl.style.position = 'absolute'
        this.dragEl.style.left = clientX-calendarX + origX-clientX + 'px' 
        this.dragEl.style.top = clientY-calendarY + origY-clientY + 'px'
        this.dragEl.style.opacity = 0.5
        return 
      }

      // Null check
      if (!this.dragEl) return

      if (last) {
        // Clear drag timeout
        clearTimeout(this.dragTimeout)
        this.dragTimeout = null

        // Get new date that we have dragged to 
        const { left, width } = this.dragEl.getBoundingClientRect()
        const newDay = this.getDayFromX(left + width/2)
        const newDate = this.daysOfWeek[newDay].date
        const { dueDate: oldDate } = this.assignmentById(assignmentId)

        const isSameDay = compareDateDay(oldDate, newDate) === 0

        // Check if diff is lower than drag threshold, and toggle assignment
        const diffX = this.startDrag.x - clientX
        const diffY = this.startDrag.y - clientY
        if (isSameDay && Math.abs(diffX) < this.dragThreshold && Math.abs(diffY) < this.dragThreshold) {
          this._toggleAssignment(assignmentId)
        } else {
          // Move assignment to a new day when dragged to a new day 
          if (!isSameDay) {
            // Use the hours/minutes from the old date and the date/month/year from the new date
            const { hours, minutes } = getDateInfo(oldDate)
            const { date, month, year } = getDateInfo(newDate)
            const dueDate = new Date(year, month, date, hours, minutes)
            
            this.updateAssignment({
              assignmentId, dueDate,
            })
          }
        }
        
        // Remove dragEl
        this.dragEl.remove()
        this.dragEl = null
        return
      }

      // Drag element to mouse position
      const dragElLeft = +window.getComputedStyle(this.dragEl)['left'].slice(0, -2) || 0
      const dragElTop = +window.getComputedStyle(this.dragEl)['top'].slice(0, -2) || 0
      this.dragEl.style.left = dragElLeft + deltaX + 'px'
      this.dragEl.style.top = dragElTop + deltaY + 'px'

      // Start drag timer when dragging assignment to edge of calendar 
      const { left, width } = this.dragEl.getBoundingClientRect()
      const curDay = this.getDayFromX(left + width/2)
      if (curDay === 0 || curDay === 6) {
        if (!this.dragTimeout)
          this.dragTimeout = setTimeout(this.dragEdge, this.dragInterval)
      } else {
        clearTimeout(this.dragTimeout)
        this.dragTimeout = null
      }
    },
    dragEdge() {
      /* Moves to the prev/next week based on where the dragged assignment is currently.
       * Called on a timeout.
       */
      const { left, width } = this.dragEl.getBoundingClientRect()
      const curDay = this.getDayFromX(left + width/2)
      if (curDay === 0) {
        this.prevWeek()
        this.dragTimeout = setTimeout(this.dragEdge, this.dragInterval)
      } else if (curDay === 6) {
        this.nextWeek()
        this.dragTimeout = setTimeout(this.dragEdge, this.dragInterval)
      }
    },
    getDayFromX(xPos) {
      /* Returns an integer representing the day column associated with the given x position 
       * 0 = monday, 6 = sunday
       */

      for (let i = 0; i < this.dayBoundaries.length; i++) {
        if (xPos < this.dayBoundaries[i]) {
          return i
        }
      }
      return this.dayBoundaries.length
    },
    getDateWithOffset(offset) {
      return new Date(new Date().getTime() + offset * this.dayLength)
    },
    getAssignmentsForDate(date) {
      // TODO: make this more efficient instead of iterating through all the assignments for every day
      const allAssignments = this.assignments
        .filter((a) => {
          return compareDateDay(a.dueDate, date) === 0 //&& !a.done
        })
        .sort(sortAssignments)
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
