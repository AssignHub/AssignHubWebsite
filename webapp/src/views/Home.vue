<template>
  <v-container fluid>
    <CheckIn :firstName="firstName" :emojis="emojis" />

    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="2">
          <ClassesList :classes="classes" class="mb-4" />
          <FriendsList :friends="friends" :emojis="emojis" />
        </v-col>
        <v-col>
          <Calendar :assignments="assignments" :curDate="curDate" />
          <v-row>
            <v-col>
              <InputAssignments :classes="classes" />
            </v-col>
            <v-col>
              <v-card>
                <v-card-title>Add Crowdsourced Assignment</v-card-title>
                <v-card-text>

                </v-card-text>
              </v-card>
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
import InputAssignments from '@/components/InputAssignments'

export default {
  name: 'Home',
  
  components: {
    CheckIn,
    ClassesList,
    FriendsList,
    Calendar,
    InputAssignments,
  },

  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      classes: [
        {text: 'BUAD 304', color: 'green lighten-2'},
        {text: 'CSCI 103', color: 'orange lighten-2'},
        {text: 'MATH 225', color: 'blue lighten-2'},
        {text: 'ENGR 102', color: 'pink lighten-2'},
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
        {name: 'Thomas Green Case Study', dueDate: new Date().getTime() + 3*(24 * 60 * 60 * 1000)}
      ],
    }
  },

  computed: {
  },
}
</script>
