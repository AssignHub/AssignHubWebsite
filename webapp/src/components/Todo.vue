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
          show-date
          :disabled="a.done"
          @click="toggleAssignment(a._id)"
          @mousedown="(e) => {if (e.which === 3) hideContextMenu()}"
          @contextmenu="(e) => showAssignmentMenu(e, a._id)"
        />
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import AssignmentCard from '@/components/AssignmentCard'
import { compareDateDay } from '@/utils/utils.js'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { CONTEXT_MENU_TYPES } from '@/constants'

export default {
  name: 'Todo',

  components: {
    AssignmentCard,
  },

  data() {
    return {
      dayLength: 24 * 60 * 60 * 1000,
      curDate: new Date(),
    }
  },

  computed: {
    ...mapState([ 'assignments' ]),
    ...mapGetters({ classes: 'termClasses' }),
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
    ...mapMutations(['showContextMenu', 'hideContextMenu']),
    ...mapActions([ 'toggleAssignment' ]),
    sortByDateAndDone(arr) {
      return arr
        .sort((a, b) => a.dueDate - b.dueDate)
        .sort((a, b) => {
          if (a.done === b.done)
            return 0
          return a.done ? 1 : -1  
        })
    },
    timeString(a) {
      return new Date(a.dueDate).toLocaleTimeString([], {timeStyle: 'short'})
    },
    showAssignmentMenu(e, id) {
      e.preventDefault()
      this.showContextMenu({
        type: CONTEXT_MENU_TYPES.assignment,
        data: { assignmentId: id },
        mouseEvent: e,
      })
    },
  }
}
</script>