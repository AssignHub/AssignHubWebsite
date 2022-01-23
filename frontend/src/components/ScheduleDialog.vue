<template>
  <span>
    <v-dialog
      v-model="show"
      width="600"
      content-class="schedule-dialog__dialog"
    >
      <template v-slot:activator="{ on, attrs }">
        <slot name="activator" :on="on" :attrs="attrs" />
      </template>
      <v-card>
        <UserListItem
          :user="friend ? friend : authUser"
        />
        <v-calendar
          class="schedule-dialog__calendar"
          ref="calendar"
          :max-days="5"
          :weekdays="[1,2,3,4,5]"
          :events="events"
          :event-color="(event) => event.color"
          color="primary"
          type="custom-daily"
          :start="startDate"
          :end="endDate"

          v-on="vOn"
        >
          <template v-slot:event="{ event, timed, timeSummary, eventSummary }">
            <!--<div
              class="v-event"
              v-html="eventSummary()"
            >
            </div>-->
            <div
              class="v-event"
            >
              <div><b>{{ event.name }}</b></div>
              <div>{{ event.type }}</div>
              <div class="time-text" v-html="timeSummary()"></div>
            </div>
            <div
              v-if="!friend && event.editable && timed"
              class="v-event-drag-bottom"
              @mousedown.stop="extendBottom(event)"
            ></div>
          </template>
        </v-calendar>
      </v-card>
    </v-dialog>
    <ScheduleEventMenu
      v-model="eventMenu.show"
      :event="eventMenu.event"
      :position-x="eventMenu.x"
      :position-y="eventMenu.y"
      :close-on-content-click="false"
      :transition="false"
      absolute
    />
  </span>
</template>

<style>
.schedule-dialog__calendar {
  max-height: 500px;
}

.schedule-dialog__calendar .v-calendar-daily_head-day-label {
  display: none;
}

.schedule-dialog__dialog {
  /* 
  TODO: this is a little hacky at the current moment, 
  think of a better way to prevent the double scrollbar 
  */
  overflow: hidden;
}
</style>

<style scoped lang="scss">
.time-text {
  font-size: 0.6rem;
}

.v-event {
  padding-left: 6px;
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: '';
  }

  &:hover::after {
    display: block;
  }
}
</style>

<script>
import ScheduleEventMenu from '@/components/ScheduleEventMenu'
import UserListItem from '@/components/UserListItem'
import { get, getDateString, getClassColor } from '@/utils'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ScheduleDialog',

  props: {
    /* The friend who we want to see the schedule for
     * If it is null, then show the current user's schedule
     */
    friend: { type: Object, default: null },
  },

  components: {
    ScheduleEventMenu,
    UserListItem,
  },

  data() {
    return {
      show: false,
      eventMenu: {
        show: false,
        x: 0,
        y: 0,
        event: null,
      },
      classes: null,
      events: [],
      today: getDateString(new Date()),

      dayMapping: Object.freeze({
        'M': 1,
        'T': 2,
        'W': 3,
        'H': 4,
        'F': 5,
      }),

      // Event drag variables
      dragEvent: null,
      dragStart: null,
      createEvent: null,
      createStart: null,
      extendOriginal: null,
    }  
  },

  computed: {
    ...mapState([ 'term', 'authUser' ]),
    ...mapGetters({ authUserClasses: 'termClasses', authUserNonLectureSections: 'termNonLectureSections' }),
    startDate() {
      // Get the date object for Monday of this week
      return this.getDateFromDay(1)
    },
    endDate() {
      // Get the date object for Friday of this week
      return this.getDateFromDay(5)
    },
    vOn() {
      // Only return drag events if this is authUser's schedule 
      if (true || this.friend) return {}
      return {
        'click:event': this.eventClicked,
        'mousedown:event': this.startDrag,
        'mousedown:time': this.startTime,
        'mousemove:time': this.mouseMove,
        'mouseup:time': this.endDrag,
        'mouseleave.native': this.cancelDrag,
      }
    },
  },

  methods: {
    ...mapActions([ 'showError' ]),
    getDateFromDay(day) {
      // Returns a date object given the day represented by a number (0-6)
      const curDate = new Date()
      const curDay = curDate.getDay()
      const date = new Date(curDate.getTime() - 1000*60*60*24*(curDay - day))
      return date
    },
    getDateFromDayString(dayString) {
      // Returns date object given a string representing the day ('M'-'F')
      return this.getDateFromDay(this.dayMapping[dayString])
    },
    setEvents() {
      // Adds events to the calendar based on this.classes
      this.events = []
      for (let _class of this.classes) {
        for (let block of _class.blocks) {
          const curDate = getDateString(this.getDateFromDayString(block.day))
          
          const event = {
            name: _class.courseId,
            type: _class.type,
            start: new Date(`${curDate} ${block.start}`).getTime(),
            end: new Date(`${curDate} ${block.end}`).getTime(),
            color: _class.color ?? getClassColor(_class.courseId, this.classes),
            timed: true,
            editable: false,
          }
          this.events.push(event)
        }
      }
    },
    eventClicked({ event, nativeEvent: { target, clientY } }) {
      // Show edit event menu
      if (event.editable) {
        const { right } = target.getBoundingClientRect()

        // Show event menu on a timeout so that it doesn't disappear as when switching from one event to another
        setTimeout(() => {
          // Show event menu at the right side of the event and at mouse click Y
          this.eventMenu = {
            event,
            show: true,
            x: right,
            y: clientY,
          }
        })
      }
    },

    // Event drag functionality (most of this is copied and pasted from the vuetify calendar example)
    startDrag ({ event, timed }) {
      if (event && timed) {
        this.dragEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
    },
    startTime(tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start

        this.dragTime = mouse - start
      } else {
        this.createStart = this.roundTime(mouse)
        this.createEvent = {
          name: 'Untitled event',
          color: 'grey darken-2',
          start: this.createStart,
          end: this.createStart,
          timed: true,
          editable: true,
        }

        this.events.push(this.createEvent)
      }
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime !== null) {
        if (this.dragEvent.editable) {
          // Only perform drag if editable
          const start = this.dragEvent.start
          const end = this.dragEvent.end
          const duration = end - start
          const newStartTime = mouse - this.dragTime
          const newStart = this.roundTime(newStartTime)
          const newEnd = newStart + duration

          this.dragEvent.start = newStart
          this.dragEvent.end = newEnd
        }
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false)
        const min = Math.min(mouseRounded, this.createStart)
        const max = Math.max(mouseRounded, this.createStart)

        this.createEvent.start = min
        this.createEvent.end = max
      }
    },
    endDrag() {
      this.dragTime = null
      this.dragEvent = null
      this.createEvent = null
      this.createStart = null
      this.extendOriginal = null
    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal
        } else {
          const i = this.events.indexOf(this.createEvent)
          if (i !== -1) {
            this.events.splice(i, 1)
          }
        }
      }

      this.createEvent = null
      this.createStart = null
      this.dragTime = null
      this.dragEvent = null
    },
    extendBottom (event) {
      this.createEvent = event
      this.createStart = event.start
      this.extendOriginal = event.end
    },
    
    // Helper functions
    toTime (tms) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    },
    roundTime (time, down = true) {
      const roundTo = 15 // minutes
      const roundDownTime = roundTo * 60 * 1000

      return down
        ? time - time % roundDownTime
        : time + (roundDownTime - (time % roundDownTime))
    },
  },

  watch: {
    show: {
      immediate: true,
      async handler() {
        if (this.show) {
          // Scroll calendar to a reasonable time, setTimeout ensures calendar has been mounted
          setTimeout(() => this.$refs.calendar.scrollToTime('08:00'))

          if (this.friend) {
            if (!this.classes) {
              // Get friend's classes if haven't already loaded
              try {
                this.classes = await get(`/friends/${this.friend._id}/classes?term=${this.term}`)
              } catch(err) {
                this.showError('Something went wrong fetching this friend\'s schedule. Please try again later.')
              }
            }
          } else {
            // Set classes to authUser's classes
            this.classes = [...this.authUserClasses, ...this.authUserNonLectureSections]
          }

          // Structure events array
          this.setEvents()
        } else {
          this.eventMenu.show = false
        }
      },
    },
  },
}
</script>