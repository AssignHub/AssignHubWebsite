<template>
  <v-container>
    <CheckIn :firstName="firstName" :emojis="emojis" />

    <v-container fluid class="fill-height">
      <ClassesList :classes="classes" />
      <FriendsList :friends="friends" :emojis="emojis" />
    </v-container>
  </v-container>
</template>

<script>
import CheckIn from '@/components/CheckIn'
import ClassesList from '@/components/ClassesList'
import FriendsList from '@/components/FriendsList'

export default {
  name: 'Home',
  
  components: {
    CheckIn,
    ClassesList,
    FriendsList,
  },

  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      classes: [
        {name: 'BUAD 304', color: 'green lighten-2'},
        {name: 'CSCI 103', color: 'orange lighten-2'},
        {name: 'MATH 225', color: 'blue lighten-2'},
        {name: 'ENGR 102', color: 'pink lighten-2'},
      ],
      emojis: [
        require('@/assets/smiling.png'),
        require('@/assets/sunglasses.png'),
        require('@/assets/tired.png'),
        require('@/assets/sad.png'),
        require('@/assets/crying.png'),
      ],
      friends: [
        {firstName: 'Jill', lastName: 'Smith', emojiIndex: 1},
        {firstName: 'Leonardo', lastName: 'DiCaprio', emojiIndex: 0},
        {firstName: 'Carol', lastName: 'Johnson', emojiIndex: 3},
        {firstName: 'Jacob', lastName: 'Chen', emojiIndex: 2},
        {firstName: 'Kevin', lastName: 'Hunter', emojiIndex: 4},
      ],
    }
  },


}
</script>
