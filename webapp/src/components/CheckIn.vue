<!-- Icons are from here: https://icons8.com/icon/set/face/emoji -->
<template>
  <v-card class="pa-4">
    <v-expand-transition>
      <div v-if="!emojiSelected">
        <div class="text-center text-h6 mb-2">How are you doing today, {{ authUser.firstName }}?</div>
        <div class="emoji-container" style="height: 50px;">
          <div v-for="(src, mood) in EMOJIS" :key="mood" style="flex: 0 1 auto;">
            <img class="emoji" :src="src" draggable="false" @click="isEditing = false; changeMood(mood)">
          </div>
        </div>
      </div>
    </v-expand-transition>

    <v-expand-transition class="transition-fast-in-fast-out">
      <div v-if="emojiSelected" style="display: flex; align-items: center;">
        <div class="text-h6 mr-2 name-selected">{{ authUser.firstName }} {{ authUser.lastName }}</div>
        <img class="emoji-selected" :src="EMOJIS[authUser.mood]" draggable="false">
        <v-btn 
          absolute icon 
          right 
          class="edit-btn"
          @click="isEditing = true"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>
.emoji-container {
  display: flex;
  justify-content: space-between;
}

.emoji {
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;

  cursor: pointer;
  height: 40px;
  opacity: 0.7;
  transition: height .1s, opacity .1s;
}

.emoji:hover {
  height: 45px;
  opacity: 1;
}

.emoji-selected {
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;

  height: 30px;
}

.name-selected {
  flex: 1 1 auto; 
  text-overflow: ellipsis; 
  overflow: hidden; 
  white-space: nowrap;
}

.edit-btn {
  width: 30px; 
  height: 30px;
  opacity: 0;
}

.edit-btn:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, .5);
}
</style>

<script>
import { mapState, mapActions } from 'vuex'
import { EMOJIS } from '@/constants'

export default {
  name: 'CheckIn',

  data() {
    return {
      EMOJIS,
      isEditing: false,
    }
  },

  computed: {
    ...mapState([ 'authUser' ]),
    emojiSelected() {
      return !this.isEditing && this.authUser.mood
    }
  },

  methods: {
    ...mapActions([ 'changeMood' ]),
  },
}
</script>