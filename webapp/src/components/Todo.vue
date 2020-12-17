<template>
  <v-card>
    <template v-for="(c, i) in dueCategories">
      <v-card-title :key="`title-${i}`" class="pb-0">{{ c.header }}</v-card-title>
      <v-card-text :key="i" class="pa-0 pb-1">
        <AssignmentCard 
          v-for="(a, i) in c.assignments" 
          :key="i" 
          :assignment="a"
          :classes="classes"
          class="mx-2 mb-2"  
          showDate
          :disabled="a.done"
          @click="toggleAssignment(a.uid)"
        />
      </v-card-text>
      <!--<v-card-text :key="i" class="pa-0">
        <v-list>
          <v-list-item v-for="(a, i) in c.assignments" :key="i" class="">
            <v-checkbox
              v-model="a.done"
              :label="a.name"
              class="mt-0"
              hide-details
            ></v-checkbox>
          </v-list-item>
        </v-list>
      </v-card-text>-->
    </template>
  </v-card>
</template>

<script>
import AssignmentCard from '@/components/AssignmentCard'
import { compareDateDay } from '@/utils/utils.js'

export default {
  name: 'Todo',

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
      dayLength: 24 * 60 * 60 * 1000,
    }
  },

  computed: {
    dueToday() {
      let arr = this.assignments.filter(a => compareDateDay(a.dueDate, this.curDate) === 0)
      return this.sortByDateAndDone(arr)
    },
    dueTomorrow() {
      let arr = this.assignments.filter(a => compareDateDay(a.dueDate, this.tomorrowDate) === 0) 
      return this.sortByDateAndDone(arr)
    },
    upcoming() {
      let arr = this.assignments.filter(a => compareDateDay(a.dueDate, this.tomorrowDate) > 0) 
      return this.sortByDateAndDone(arr)
    },
    tomorrowDate() {
      return new Date(this.curDate.getTime() + this.dayLength)
    },
    dueCategories() {
      let dueCategories = []
      for (let category of [
        {header: 'Due today', assignments: this.dueToday},
        {header: 'Due tomorrow', assignments: this.dueTomorrow},
        {header: 'Upcoming', assignments: this.upcoming},
      ]) {
        if (category.assignments.length > 0)
          dueCategories.push(category)
      }

      return dueCategories
    }
  },

  methods: {
    toggleAssignment(uid) {
      this.$emit('toggleAssignment', uid)
    },
    sortByDateAndDone(arr) {
      return arr
        .sort((a, b) => a.dueDate - b.dueDate)
        .sort((a, b) => {
          if (a.done === b.done)
            return 0
          return a.done ? 1 : -1  
        })
    },
    getClassColor(classUid) {
      return this.classes.find(c => c.uid === classUid).color
    },
    timeString(a) {
      return new Date(a.dueDate).toLocaleTimeString([], {timeStyle: 'short'})
    },
  }
}
</script>