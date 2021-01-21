<template>
  <v-card style="overflow-y: scroll">
    <template v-for="(c, i) in dueCategories">
      <v-expand-transition :key="i">
        <div v-if="c.assignments.length > 0" :key="i">
          <v-card-title class="pb-0">
            <v-icon v-if="c.header === 'Overdue'" color="error" class="mr-2">mdi-clock-alert</v-icon>
            {{ c.header }}
          </v-card-title>
          <v-card-text class="pa-0 pb-1">
            <transition-group name="list-fade">
              <div v-for="a in c.assignments" :key="a._id">
              <AssignmentCard
                
                :assignment="a"
                :classes="classes"
                class="mx-2 mb-2"
                show-date
                :disabled="a.done"
                @click="toggleAssignment(a._id)"
                @mousedown="(e) => {if (e.which === 3) hideContextMenu()}"
                @contextmenu="(e) => showAssignmentMenu(e, a._id)"
              />
              </div>
            </transition-group>
          </v-card-text>
        </div>
      </v-expand-transition>
    </template>
  </v-card>
</template>

<style scoped>
.list-fade-enter-active, .list-fade-leave-active {
  transition: opacity .3s ease;
}

.list-fade-enter, .list-fade-leave-to {
  opacity: 0;
}

.list-fade-leave, .list-fade-enter-to {
  opacity: 1;
}
</style>

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
    overdue() {
      let arr = this.assignments.filter(a => compareDateDay(a.dueDate, this.curDate) < 0 && !a.done)
      return this.sortByDateAndDone(arr)
    },
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
      return [
        {header: 'Overdue', assignments: this.overdue},
        {header: 'Due today', assignments: this.dueToday},
        {header: 'Due tomorrow', assignments: this.dueTomorrow},
        {header: 'Upcoming', assignments: this.upcoming},
      ]
    }
  },

  methods: {
    ...mapMutations(['showContextMenu', 'hideContextMenu']),
    ...mapActions([ 'toggleAssignment' ]),
    test() {
      console.log('done')
    },
    sortByDateAndDone(arr) {
      return arr
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
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