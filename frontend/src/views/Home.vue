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

    <v-dialog
      v-model="joinDialog"
      max-width="400"
    >
      <JoinClass 
        :classId="id"
         @doneJoining="joinDialog = false"
      />
    </v-dialog>
    
    
    <div class="inner-container">
      <Navigator></Navigator>

      <div style="flex: 10 0 300px; min-width: 0;">
        <Calendar class="mb-4" />
      </div>

    </div>
    
    <AddInputAssignmentDialog 
      id="add-input-assignment-dialog"
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
import InputAssignment from '../components/InputAssignment'
import JoinClass from '../components/JoinClass'

import { _delete, showTutorial, setActive } from '@/utils'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { CONTEXT_MENU_TYPES } from '@/constants'

export default {
  name: 'Home',
  
  components: {
    AddInputAssignmentDialog,
    Calendar,
    InputAssignment,
    Navigator,
    JoinClass
  },

  props: {
    id: { type: String, default: "-1" }
  },

  created() {
    this.populateData()
    setActive()

    // Fetch public assignments on window focus if min amount of time has passed
    window.addEventListener('focus', () => {
      if (this.timeHasPassed(this.MIN_FETCH_INTERVAL, this.lastFetched)) {
        this.getPublicAssignments()
        setActive()
        this.lastFetched = new Date()
      }
    })
  },

  mounted() {
    if (this.isNewUser) {
      this.$nextTick(() => showTutorial(true))
    }

    this.joinDialog = this.id != "-1"
  },

  data() {
    return {
      tab: 0,
      editDialog: false,
      addInputDialog: false,
      joinDialog: false,
      lastFetched: new Date(), // The last time published assignments were fetched
      lastSetActive: new Date(),

      // Constants
      CONTEXT_MENU_TYPES,
      MIN_FETCH_INTERVAL: 60*1000, // This is the minimum time in ms we should wait before fetching again
    }
  },

  computed: {
    ...mapState([ 'authUser', 'contextMenu', 'isNewUser' ]),
    ...mapGetters([ 'assignmentById' ]),
  },

  methods: {
    ...mapMutations([ 'hideContextMenu' ]),
    ...mapActions([ 'populateData', 'getPublicAssignments', 'showError' ]),
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
    timeHasPassed(time, since) {
      /* Returns a boolean indicating whether `time` ms has passsed since date `since` */
      return new Date().getTime() - time > since.getTime()
    },
  },
}
</script>