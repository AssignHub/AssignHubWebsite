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
        <v-col v-for="(day, i) in daysOfWeek" :key="i" style="height: 200px;" :style="i !== 0 && 'border-left: solid; border-width: 1px;'">
          <div class="text-center text-h5 mb-n2">{{ day.name }}</div>
          <div class="text-center text-h7">{{ day.date.getDate() }}</div>
          <v-list>
            <v-list-item v-for="(a, i) in getAssignmentsForDate(day.date)" :key="i">
              <v-list-item-title>{{ a.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ new Date(a.dueDate).toLocaleTimeString() }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Calendar',

  props: {
    assignments: {type: Array, required: true},
    curDate: {type: Date, required: true},
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
      })
    }
  },
}
</script>