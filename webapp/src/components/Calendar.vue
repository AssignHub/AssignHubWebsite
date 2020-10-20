<template>
  <v-card>
    <v-card-title>
      <span class="text-h3 mr-4">{{ month }} {{ year }}</span>
      <v-chip>4 pending assignments</v-chip>
      <v-spacer></v-spacer>
      <v-btn text>Week</v-btn>
      <v-btn text>Month</v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
        <div class="col-day" v-for="(day, i) in daysOfWeek" :key="i" style="height: 200px;" :style="i !== 0 && 'border-left: solid; border-width: 1px;'">
          <div class="text-center text-h5 mb-n2">{{ day.name }}</div>
          <div class="text-center text-h7">{{ day.date.getDate() }}</div>
          <AssignmentCard
            v-for="(a, i) in getAssignmentsForDate(day.date)" 
            :key="i"
            class="mb-2 mx-2"
            :assignment="a"
            :classes="classes"
            @click="test"
          />
        </div>
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

export default {
  name: 'Calendar',

  props: {
    assignments: {type: Array, required: true},
    classes: {type: Array, required: true},
    curDate: {type: Date, required: true},
  },

  components: {
    AssignmentCard,
  },

  data() {
    return {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      dayLength: 24 * 60 * 60 * 1000,
    }
  },

  computed: {
    month() {
      return this.months[this.curDate.getMonth()]
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
        daysOfWeek.push({
          name: days[i],
          date: this.getDateWithOffset(i - curDayNum),
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
      return this.assignments.filter(a => {
        return new Date(a.dueDate).getDate() === date.getDate()
      }).sort((a, b) => a.dueDate - b.dueDate)
    },
    test() {
      console.log('wow!')
    }, 
  },
}
</script>