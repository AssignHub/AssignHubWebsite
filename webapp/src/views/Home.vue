<template>
  <v-container fluid>
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

    <CheckIn />

    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="12" md="2" class="py-0">
          <v-row>
            <v-col cols="12">
              <ClassesList />
            </v-col>
            <v-col cols="12">
              <FriendsList />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3" md="2" class="py-0">
          <Todo style="height: 100%;" />
        </v-col>
        <v-col class="py-0">
          <v-row>
            <v-col cols="12">
              <Calendar class="mb-1" />
            </v-col>
            <v-col>
              <InputAssignment />
            </v-col>
            <v-col>
              <AddAssignment />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import CheckIn from '@/components/CheckIn'
import ClassesList from '@/components/ClassesList'
import FriendsList from '@/components/FriendsList'
import Calendar from '@/components/Calendar'
import InputAssignment from '@/components/InputAssignment'
import AddAssignment from '@/components/AddAssignment'
import Todo from '@/components/Todo'

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
    InputAssignment,
    AddAssignment,
    Todo,
  },

  mounted() {
    this.populateData()
  },

  data() {
    return {
      CONTEXT_MENU_TYPES,
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
