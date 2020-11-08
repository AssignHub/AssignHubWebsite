<template>
  <v-container fluid>
    <CheckIn :firstName="firstName" :emojis="emojis" />

    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="12" md="2" class="py-0">
          <v-row>
            <v-col cols="12">
              <ClassesList :classes="classes" :terms="terms" />
            </v-col>
            <v-col cols="12">
              <FriendsList :friends="friends" :emojis="emojis" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3" md="2">
          <Todo style="height: 100%;" :assignments="assignments" :classes="classes" :curDate="curDate" @toggleAssignment="(uid) => toggleAssignment(uid)"/>
        </v-col>
        <v-col class="py-0">
          <v-row>
            <v-col cols="12">
              <Calendar class="mb-1" :assignments="assignments" :classes="classes" :curDate="curDate" :numPendingAssignments="assignmentsToAdd.length" @toggleAssignment="(uid) => toggleAssignment(uid)" />
            </v-col>
            <v-col>
              <InputAssignment :classes="classes" @createAssignment="a => createAssignment(a)" />
            </v-col>
            <v-col>
              <AddAssignment :assignmentsToAdd="assignmentsToAdd" :classes="classes" @addAssignment="(uid) => addAssignment(uid)"/>
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

import { get } from '@/utils/util.js'

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

  data() {
    return {
      firstName: 'Jonathan',
      lastName: 'Liu',
      terms: [],
      classes: [
        {uid: 'BUAD-304', text: 'BUAD 304', color: 'green lighten-2'},
        {uid: 'CSCI-103', text: 'CSCI 103', color: 'orange lighten-2'},
        {uid: 'MATH-225', text: 'MATH 225', color: 'blue lighten-2'},
        {uid: 'ENGR-102', text: 'ENGR 102', color: 'pink lighten-2'},
      ],
      emojis: [
        require('@/assets/crying.png'),
        require('@/assets/sad.png'),
        require('@/assets/tired.png'),
        require('@/assets/smiling.png'),
        require('@/assets/sunglasses.png'),
      ],
      friends: [
        {firstName: 'Jill', lastName: 'Smith', emojiIndex: 1},
        {firstName: 'Leonardo', lastName: 'DiCaprio', emojiIndex: 0},
        {firstName: 'Carol', lastName: 'Johnson', emojiIndex: 3},
        {firstName: 'Jacob', lastName: 'Chen', emojiIndex: 2},
        {firstName: 'Kevin', lastName: 'Hunter', emojiIndex: 4},
      ],
      curDate: new Date(),
      assignments: [
        {uid: '0', classUid: 'CSCI-103', name: 'Quiz 4', dueDate: new Date(), done: false},
        {uid: '1', classUid: 'MATH-225', name: 'Homework 5', dueDate: new Date().getTime() + 1*(24 * 60 * 60 * 1000), done: false},
        {uid: '2', classUid: 'BUAD-304', name: 'Thomas Green Case Study', dueDate: new Date().getTime() + 2*(24 * 60 * 60 * 1000), done: false},
        {uid: '3', classUid: 'ENGR-102', name: 'Class Presentation', dueDate: new Date().getTime() + 3*(24 * 60 * 60 * 1000), done: false},
      ],
      assignmentsToAdd: [
        {uid: '4', classUid: 'MATH-225', name: 'Homework 6', dueDate: new Date().getTime() + 2*(24 * 60 * 60 * 1000)},
        {uid: '5', classUid: 'ENGR-102', name: 'Pitch Presentation', dueDate: new Date().getTime() + 1*(24 * 60 * 60 * 1000)},
        {uid: '6', classUid: 'CSCI-103', name: 'Recursion Lab', dueDate: new Date().getTime() + 4*(24 * 60 * 60 * 1000)},
        {uid: '7', classUid: 'CSCI-103', name: 'Algorithm Lab', dueDate: new Date().getTime() + 3*(24 * 60 * 60 * 1000)},
      ],
    }
  },

  async mounted() {
    this.terms = await get('/usc/terms')
  },

  methods: {
    toggleAssignment(uid) {
      let index = this.assignments.findIndex(a => a.uid === uid)
      this.$set(this.assignments[index], 'done', !this.assignments[index].done)
    },
    addAssignment(uid) {
      let index = this.assignmentsToAdd.findIndex(a => a.uid === uid)
      let assignment = this.assignmentsToAdd.splice(index, 1)[0]
      this.$set(assignment, 'done', false)
      this.assignments.push(assignment)
    },
    createAssignment(assignment) {
      this.$set(assignment, 'done', false)
      this.assignments.push(assignment)
    }
  },
}
</script>
