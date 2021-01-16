<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <div class="text-center text-h3">How are you doing today, {{ authUser.firstName }}?</div>
      </v-col>
      <!-- Icons are from here: https://icons8.com/icon/set/face/emoji -->
      <v-col cols="12" style="position: relative; height: 90px;">
        <div class="emoji-container">
          <v-row>
            <v-col v-if="!isEditing && authUser.mood" cols="auto" class="py-0" style="position: relative;">
              <img class="emoji-selected" :src="EMOJIS[authUser.mood]" draggable="false">
              <v-btn 
                class="grey lighten-2" 
                color="grey darken-3"
                icon 
                small
                absolute
                style="right: 10px; bottom: 10px;"
                @click="isEditing = true"
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col v-else v-for="(src, mood) in EMOJIS" :key="mood" cols="auto" class="py-0">
              <img class="emoji" :src="src" draggable="false" @click="isEditing = false; changeMood(mood)">
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.emoji-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.emoji {
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;

  cursor: pointer;
  height: 64px;
  opacity: 0.7;
  transition: height .1s, opacity .1s;
}

.emoji:hover {
  height: 70px;
  opacity: 1;
}

.emoji-selected {
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;

  height: 70px;
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
    ...mapState([ 'authUser' ])
  },

  methods: {
    ...mapActions([ 'changeMood' ]),
  },
}
</script>