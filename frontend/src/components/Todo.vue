<template>
  <v-card style="display: flex; flex-flow: column;">
    <div class="text-subtitle-2 pa-4" style="flex: 0 0 auto;">To-do</div>
    <div style="overflow-y: auto; flex: 1 1 auto;" class="inner-shadow grey lighten-5 pt-2">
      <div v-if="listEmpty" class="text-center text-caption pt-6 px-4">
        Your to-do list is empty. Create an assignment to get started!
      </div>
      <div v-else>
        <template v-for="(c, i) in dueCategories">
          <v-expand-transition :key="i">
            <div v-if="c.assignments.length > 0" :key="i">
              <div class="text-overline px-4">
                <v-icon v-if="c.header === 'Overdue'" color="error" small>mdi-clock-alert</v-icon>
                {{ c.header }}
              </div>
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
      </div>
    </div>
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
      return this.sortByDate(arr)
    },
    dueToday() {
      let arr = this.assignments.filter(a => compareDateDay(a.dueDate, this.curDate) === 0)
      return this.sortByDate(arr)
    },
    dueTomorrow() {
      let arr = this.assignments.filter(a => compareDateDay(a.dueDate, this.tomorrowDate) === 0) 
      return this.sortByDate(arr)
    },
    upcoming() {
      let arr = this.assignments.filter(a => compareDateDay(a.dueDate, this.tomorrowDate) > 0) 
      return this.sortByDate(arr)
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
    },
    listEmpty() {
      for (let cat of this.dueCategories) {
        if (cat.assignments.length > 0)
          return false
      }
      return true
    }
  },

  methods: {
    ...mapMutations(['showContextMenu', 'hideContextMenu']),
    ...mapActions([ 'toggleAssignment' ]),
    test() {
      console.log('done')
    },
    sortByDate(arr) {
      return arr.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    },
    sortByDone(arr) {
      return arr.sort((a, b) => {
        if (a.done === b.done)
          return 0
        return a.done ? 1 : -1  
      })
    },
    sortByDateAndDone(arr) {
      return this.sortByDone(this.sortByDate(arr))
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