<template>
  <v-container fluid>
    <CheckIn :firstName="authUser.firstName" :emojis="emojis" />

    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="12" md="2" class="py-0">
          <v-row>
            <v-col cols="12">
              <ClassesList 
                :classes="termClasses" 
                :terms="terms" 
                :term.sync="term" 
                @error="error => $emit('error', error)" 
                @info="info => $emit('info', info)" 
                @addedClass="getClasses"  
              />
            </v-col>
            <v-col cols="12">
              <FriendsList :friends="friends" :emojis="emojis" @error="error => $emit('error', error)" @info="info => $emit('info', info)" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3" md="2">
          <Todo 
            style="height: 100%;" 
            :assignments="assignments" 
            :classes="termClasses" 
            :curDate="curDate" 
            @toggleAssignment="(id) => toggleAssignment(id)" 
            @error="error => $emit('error', error)" 
            @info="info => $emit('info', info)"
          />
        </v-col>
        <v-col class="py-0">
          <v-row>
            <v-col cols="12">
              <Calendar 
                class="mb-1" 
                :assignments="assignments" 
                :classes="termClasses" 
                :curDate="curDate" 
                :numPendingAssignments="assignmentsToAdd.length" 
                @toggleAssignment="(id) => toggleAssignment(id)" 
                @error="error => $emit('error', error)" 
                @info="info => $emit('info', info)"
              />
            </v-col>
            <v-col>
              <InputAssignment 
                :classes="termClasses" 
                @createdAssignment="getAssignments"
                @error="error => $emit('error', error)" 
                @info="info => $emit('info', info)"
              />
            </v-col>
            <v-col>
              <AddAssignment 
                :assignmentsToAdd="assignmentsToAdd" 
                :classes="termClasses" 
                @addAssignment="(uid) => addAssignment(uid)"
                @error="error => $emit('error', error)" 
                @info="info => $emit('info', info)"
              />
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
import { mapState } from 'vuex'

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
      // Variables
      terms: [],
      term: '',
      classes: [
        /*{uid: 'BUAD-304', text: 'BUAD 304', color: 'green lighten-2'},
        {uid: 'CSCI-103', text: 'CSCI 103', color: 'orange lighten-2'},
        {uid: 'MATH-225', text: 'MATH 225', color: 'blue lighten-2'},
        {uid: 'ENGR-102', text: 'ENGR 102', color: 'pink lighten-2'},*/
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
        /*{uid: '0', classUid: 'CSCI-103', name: 'Quiz 4', dueDate: new Date(), done: false},
        {uid: '1', classUid: 'MATH-225', name: 'Homework 5', dueDate: new Date().getTime() + 1*(24 * 60 * 60 * 1000), done: false},
        {uid: '2', classUid: 'BUAD-304', name: 'Thomas Green Case Study', dueDate: new Date().getTime() + 2*(24 * 60 * 60 * 1000), done: false},
        {uid: '3', classUid: 'ENGR-102', name: 'Class Presentation', dueDate: new Date().getTime() + 3*(24 * 60 * 60 * 1000), done: false},*/
      ],
      assignmentsToAdd: [
        /*{uid: '4', classUid: 'MATH-225', name: 'Homework 6', dueDate: new Date().getTime() + 2*(24 * 60 * 60 * 1000)},
        {uid: '5', classUid: 'ENGR-102', name: 'Pitch Presentation', dueDate: new Date().getTime() + 1*(24 * 60 * 60 * 1000)},
        {uid: '6', classUid: 'CSCI-103', name: 'Recursion Lab', dueDate: new Date().getTime() + 4*(24 * 60 * 60 * 1000)},
        {uid: '7', classUid: 'CSCI-103', name: 'Algorithm Lab', dueDate: new Date().getTime() + 3*(24 * 60 * 60 * 1000)},*/
      ],
    }
  },

  computed: {
    ...mapState(['authUser']),
    termClasses() {
      return this.classes.filter(c => c.term === this.term)
    },
  },

  watch: {
    term() {
      this.getAssignments()
    },
  },

  async mounted() {
    this.terms = await get('/usc/terms')
    this.term = getCurTerm()
    await Promise.all([this.getClasses()])
  },

  methods: {
    toggleAssignment(id) {
      let index = this.assignments.findIndex(a => a._id === id)
      this.$set(this.assignments[index], 'done', !this.assignments[index].done)
      patch(`/assignments/toggle/${id}`).catch(err => this.$emit('error', 'There was a problem toggling that assignment!'))
    },
    addAssignment(uid) {
      let index = this.assignmentsToAdd.findIndex(a => a.uid === uid)
      let assignment = this.assignmentsToAdd.splice(index, 1)[0]
      this.$set(assignment, 'done', false)
      this.assignments.push(assignment)
    },
    getAssignments() {
      this.assignments = []
      get(`/assignments/mine?term=${this.term}`).then(data => {
        this.assignments = data
        console.log('assignments: ', this.assignments)
      })
    },
    getClasses() {
      get(`/usc/my-classes`).then(data => {
        this.classes = data
        console.log('classes: ', this.classes)
      })
    },
  },
}
</script>
