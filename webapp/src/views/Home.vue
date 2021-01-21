<template>
  <div class="outer-container pa-4 grey lighten-3">
    <v-menu
      v-model="contextMenu.show"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      transition="false"
    >
      <v-list v-if="contextMenu.type === CONTEXT_MENU_TYPES.assignment" class="py-0" dense>
        <v-list-item @click="">
          <v-list-item-title>Edit</v-list-item-title>
        </v-list-item>
        <v-list-item @click="() => removeAssignment(contextMenu.data.assignmentId)">
          <v-list-item-title class="red--text">Remove</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else-if="contextMenu.type === CONTEXT_MENU_TYPES.removeFriend" class="py-0" dense>
        <v-list-item @click="() => removeFriend(contextMenu.data.friendId)">
          <v-list-item-title class="red--text">Remove friend</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!--<CheckIn />-->
    <div class="inner-container">
      <div style="flex: 0 0 300px;" class="mr-4">
        <ClassesList class="mb-4" />
        <FriendsList />
      </div>
        
      <div style="flex: 0 0 300px;" class="mr-4">
        <Todo style="height: 100%;" />
      </div>

      <div style="flex: 1 1 auto; display: flex; flex-flow: column;">
        <Calendar class="mb-4" style="flex: 1 1 auto; min-height: 0" />
        <AddInputAssignment style="flex: 0 0 auto;" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.outer-container {
  display: flex;
  flex-flow: column;
  height: 100%;
  max-height: 100%;
  width: 100%;
  overflow: auto;
}

.inner-container {
  flex: 1 1 auto;
  display: flex;
  min-height: 0;
}
</style>

<script>
import CheckIn from '@/components/CheckIn'
import ClassesList from '@/components/ClassesList'
import FriendsList from '@/components/FriendsList'
import Calendar from '@/components/Calendar'
import Todo from '@/components/Todo'
import AddInputAssignment from '../components/AddInputAssignment.vue'

import { _delete } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'
import { CONTEXT_MENU_TYPES } from '@/constants'

// TODO: socket stuff (add assignments, etc.)
export default {
  name: 'Home',
  
  components: {
    CheckIn,
    ClassesList,
    FriendsList,
    Calendar,
    Todo,
    AddInputAssignment,
  },

  mounted() {
    this.populateData()
  },

  data() {
    return {
      CONTEXT_MENU_TYPES,
      tab: 0,
      showAddAssignment: false,
    }
  },

  computed: {
    ...mapState([ 'contextMenu' ]),
  },

  methods: {
    ...mapActions([ 'populateData', 'showError' ]),
    removeAssignment(assignmentId) {
      _delete(`/assignments/${assignmentId}`).catch(err => {
        this.showError('There was a problem removing that assignment! Please try again later.')
      })
    },
    removeFriend(friendId) {
      _delete(`/friends/${friendId}`).catch(err => {
        this.showError('There was a problem removing that friend! Please try again later.')
      })
    },
  },
}
</script>
