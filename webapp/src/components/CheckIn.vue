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
            <v-col v-if="selectedEmoji" cols="auto" class="py-0">
              <img class="emoji-selected" :src="emojis[selectedEmoji]" draggable="false">
            </v-col>
            <v-col v-else v-for="(src, i) in emojis" :key="i" cols="auto" class="py-0">
              <img class="emoji" :src="src" draggable="false" @click="emojiClicked(i)">
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
import { mapState } from 'vuex'

export default {
  name: 'CheckIn',

  data() {
    return {
      selectedEmoji: null,
    }
  },

  computed: {
    ...mapState([ 'authUser', 'emojis' ])
  },

  methods: {
    emojiClicked(i) {
      this.selectedEmoji = i
    }
  },
}
</script>