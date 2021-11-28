<template>
    <div style="display: flex; flex-flor: row;" class="mr-4">
        <v-card elevation="1" class="pt-2" style="flex: 0 0 50px; min-width: 50px; display: flex; flex-flow: column; align-items: center;">
            <v-btn icon :color="page == 0 ? 'blue' : 'gray'" large v-on:click="handleChangePage(0)" v-intro="'Click here to see all your assignments'" v-intro-position="'right'" v-intro-tooltip-class="'toolTip'">
              <v-icon>mdi-clipboard-check</v-icon>
            </v-btn>
            <v-btn icon :color="page == 1 ? 'blue' : 'gray'" large v-on:click="handleChangePage(1)" v-intro="'Add a class by finding your Class # (<a href=\'https://classes.berkeley.edu/\' target=\'_blank\'>classes.berkeley.edu</a>)'" v-intro-position="'right'" v-intro-tooltip-class="'toolTip'">
              <v-icon>mdi-school</v-icon>
            </v-btn>
            <v-btn icon :color="page == 2 ? 'blue' : 'gray'" large v-on:click="handleChangePage(2)" v-intro="'View all your friends and their schedules here'" v-intro-position="'right'" v-intro-tooltip-class="'toolTip'">
              <v-icon>mdi-account-group</v-icon>
            </v-btn>
        </v-card>
        <v-expand-x-transition>
          <div v-if="page == 0">
                <Todo class="display-item"/>
          </div>
        </v-expand-x-transition>
        <v-expand-x-transition>
          <div v-if="page == 1">
                <ClassesList class="display-item"/>
          </div>
        </v-expand-x-transition>

        <v-expand-x-transition>
          <div v-if="page == 2">
                <FriendsList class="display-item"/>
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
        page: -1,
    }
  },

  mounted() {    
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