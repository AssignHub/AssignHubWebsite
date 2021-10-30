<!-- The main screen containing the calendar, todo list, friends, classes list, etc. -->
<template>
  <div class="outer-container pr-4 pt-4 pb-4 grey lighten-4">
    <v-menu
      v-model="contextMenu.show"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      transition="false"
    >
      <v-list v-if="contextMenu.type === CONTEXT_MENU_TYPES.assignment" class="py-0" dense>
        <v-list-item @click.stop="editDialog = true; hideContextMenu()">
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

    <v-dialog
      v-if="contextMenu.data"
      v-model="editDialog"
      max-width="400"
    >
      <v-card>
        <InputAssignment 
          editing
          :assignment="assignmentById(contextMenu.data.assignmentId)"
          @doneEditing="editDialog = false"
        />
      </v-card>
    </v-dialog>
    
    
    <div class="inner-container">
      <Navigator></Navigator>

      <div style="flex: 10 0 300px; min-width: 0;">
        <Calendar class="mb-4" />
      </div>

    </div>
    
    <AddInputAssignmentDialog 
      v-model="addInputDialog"
    />
  </div>
</template>

<style scoped>
.outer-container {
  display: flex;
  flex-flow: column;
  height: 100%;
  width: 100%;
  overflow: auto;
}

.inner-container {
  flex: 1 1 auto;
  display: flex;
  min-height: 600px;
}
</style>

<script>
import AddInputAssignmentDialog from '@/components/AddInputAssignmentDialog'
import Navigator from '@/components/Navigator'
import Calendar from '@/components/Calendar'
import InputAssignment from '@/components/InputAssignment'

import { _delete } from '@/utils/utils'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { CONTEXT_MENU_TYPES } from '@/constants'

export default {
  name: 'Home',
  
  components: {
    AddInputAssignmentDialog,
    Calendar,
    InputAssignment,
    Navigator,
  },

  mounted() {
    this.populateData()
  },

  data() {
    return {
      CONTEXT_MENU_TYPES,
      tab: 0,
      editDialog: false,
      addInputDialog: false,
    }
  },

  computed: {
    ...mapState([ 'authUser', 'contextMenu' ]),
    ...mapGetters([ 'assignmentById' ]),
  },

  methods: {
    
    ...mapMutations([ 'hideContextMenu' ]),
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
