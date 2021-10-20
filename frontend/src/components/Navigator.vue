<template>
    <div style="display: flex; flex-flor: row;" class="mr-4">
        <v-card class="pt-2" style="flex: 0 0 50px; min-width: 50px; display: flex; flex-flow: column; align-items: center;">
            <v-btn icon :color="page == 0 ? 'blue' : 'gray'" large v-on:click="handleChangePage(0)">
              <v-icon>mdi-clipboard-check</v-icon>
            </v-btn>
            <v-btn icon :color="page == 1 ? 'blue' : 'gray'" large v-on:click="handleChangePage(1)">
              <v-icon>mdi-school</v-icon>
            </v-btn>
            <v-btn icon :color="page == 2 ? 'blue' : 'gray'" large v-on:click="handleChangePage(2)">
              <v-icon>mdi-account-group</v-icon>
            </v-btn>
        </v-card>
        <v-card v-if="page >= 0" style="flex: 1 0 200px; min-width: 250px; min-height: 100%; display: flex; flex-flow: column">
            <!--<CheckIn class="mb-4" style="flex: 0 1 auto;"/> Reactions taken out for now-->
            <Todo v-if="page == 0" class="display-item"/>
            <ClassesList v-if="page == 1" class="display-item"/>
            <FriendsList v-if="page == 2" class="display-item"/>
        </v-card>
    </div>
</template>

<style scoped>

.display-item {
    flex: 0 0 250px; 
    min-height: 100%; 
    width: 250px;
}

</style>

<script>
import CheckIn from '@/components/CheckIn'
import ClassesList from '@/components/ClassesList'
import FriendsList from '@/components/FriendsList'
import Todo from '@/components/Todo'

import { mapState, mapActions } from 'vuex'

export default {
  name: 'Navigator',

  components: {
    CheckIn,
    ClassesList,
    FriendsList,
    Todo
  },

  data() {
    return {
        page: 1,
    }
  },

  computed: {
    ...mapState([ 'authUser' ]),
  },

  methods: {
      handleChangePage(page) {
          if (page != this.page) {
              this.page = page;
          } else {
              this.page = -1;
          }
      }
  },
}
</script>