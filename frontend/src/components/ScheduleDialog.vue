<template>
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
      />
    </v-card>
  </v-dialog>
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

<script>
import UserListItem from '@/components/UserListItem'
import { get, getDateString } from '@/utils/utils'
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
    UserListItem,
  },

  data() {
    return {
      show: false,
      classes: null,
      events: [],
      today: getDateString(new Date()),

      dayMapping: Object.freeze({
        'M': 1,
        'T': 2,
        'W': 3,
        'H': 4,
        'F': 5,
      })
    }  
  },

  computed: {
    ...mapState([ 'term', 'authUser' ]),
    ...mapGetters({ authUserClasses: 'termClasses' }),
    startDate() {
      // Get the date object for Monday of this week
      return this.getDateFromDay(1)
    },
    endDate() {
      // Get the date object for Friday of this week
      return this.getDateFromDay(5)
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
      return this.getDateFromDay(this.dayMapping[dayString])
    },
    setEvents() {
      // Adds events to the calendar based on this.classes
      for (let _class of this.classes) {
        for (let block of _class.blocks) {
          const curDate = getDateString(this.getDateFromDayString(block.day))
          const event = {
            name: _class.courseId,
            start: `${curDate} ${block.start}`,
            end: `${curDate} ${block.end}`,
            color: _class.color,
          }
          this.events.push(event)
        }
      }
    },
  },

  watch: {
    show: {
      immediate: true,
      handler() {
        if (this.show) {
          // Scroll calendar to a reasonable time, setTimeout ensures calendar has been mounted
          setTimeout(() => this.$refs.calendar.scrollToTime('08:00'))

          if (!this.classes) {
            if (this.friend) {
              // Get friend's classes
              get(`/friends/${this.friend._id}/classes?term=${this.term}`).then(c => {
                // Set classes
                this.classes = c
              }).catch(err => {
                console.log(err)
                this.showError('Something went wrong fetching this friend\'s schedule. Please try again later.')
              })
            } else {
              // Set classes to authUser's classes
              this.classes = this.authUserClasses
            }

            // Structure events array
            this.setEvents();
          }
        }
      },
    },
  },
}
</script>