<template>
  <div style="display: flex; flex-flor: row;" class="mr-4">
    <v-card
      elevation="1"
      class="py-2"
      style="flex: 0 0 50px; min-width: 50px; display: flex; flex-flow: column; align-items: center;"
    >
      <v-btn
        id="tut-todo-list"
        icon
        :color="page == 0 ? 'blue' : 'gray'"
        large
        v-on:click="handleChangePage(0)"
      >
        <v-icon>mdi-clipboard-check</v-icon>
      </v-btn>
      <v-btn
        id="tut-classes"
        icon
        :color="page == 1 ? 'blue' : 'gray'"
        large
        v-on:click="handleChangePage(1)"
      >
        <v-icon>mdi-school</v-icon>
      </v-btn>
      <v-btn
        id="tut-friends"
        icon
        :color="page == 2 ? 'blue' : 'gray'"
        large
        v-on:click="handleChangePage(2)"
      >
        <v-badge
          overlap
          :content="numIncomingFriendRequestsString"
          :value="numIncomingFriendRequestsString"
          bordered
          style="z-index: 10;"
        >
          <v-icon>mdi-account-group</v-icon>
        </v-badge>
      </v-btn>

      <v-spacer />

      <v-btn
        id="tut-help"
        icon
        large
        v-on:click="showTutorial"
      >
        <v-icon>mdi-help-circle</v-icon>
      </v-btn>
    </v-card>
    <v-expand-x-transition>
      <div v-if="page == 0">
        <Todo class="display-item" />
      </div>
    </v-expand-x-transition>
    <v-expand-x-transition>
      <div v-if="page == 1">
        <ClassesList class="display-item" />
      </div>
    </v-expand-x-transition>

    <v-expand-x-transition>
      <div v-if="page == 2">
        <FriendsList class="display-item" />
      </div>
    </v-expand-x-transition>
  </div>
</template>

<style scoped>
.display-item {
  flex: 0 0 300px;
  height: 100%;
  width: 300px;
  min-width: 300px;
}
</style>

<script>
import CheckIn from '@/components/CheckIn'
import ClassesList from '@/components/ClassesList'
import FriendsList from '@/components/FriendsList'
import Todo from '@/components/Todo'

import { mapState, mapActions } from 'vuex'
import { showTutorial } from '@/utils/utils'

export default {
  name: 'Navigator',

  components: {
    CheckIn,
    ClassesList,
    FriendsList,
    Todo,
  },

  data() {
    return {
      page: -1,
    }
  },

  computed: {
    ...mapState(['authUser', 'friendRequests']),
    numIncomingFriendRequestsString() {
      if (this.friendRequests.incoming.length > 99) {
        return '99+'
      } else if (this.friendRequests.incoming.length === 0) {
        return ''
      }
      return '' + this.friendRequests.incoming.length
    }
  },

  methods: {
    showTutorial,
    handleChangePage(page) {
      if (page != this.page) {
        this.page = page
      } else {
        this.page = -1
      }
    },
  },
}
</script>
