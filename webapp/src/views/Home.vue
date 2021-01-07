<template>
  <v-container fluid>
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
        <v-col cols="3" md="2">
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

import { get, post, patch, getCurTerm } from '@/utils/utils'
import { mapActions } from 'vuex'

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

  methods: {
    ...mapActions([ 'populateData' ]),
  },
}
</script>
