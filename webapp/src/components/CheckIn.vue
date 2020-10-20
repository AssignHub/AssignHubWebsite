<template>
  <v-container style="height: 150px;">
    <v-row justify="center">
      <v-col cols="12">
        <div class="text-center text-h3">How are you doing today, {{ firstName }}?</div>
      </v-col>
      <!-- Icons are from here: https://icons8.com/icon/set/face/emoji -->
      <div class="emoji-container">
        <v-row>
          <v-col v-for="(src, i) in emojis" :key="i" cols="auto">
            <img class="emoji" :src="src" draggable="false" @click="emojiClicked(i)">
          </v-col>
        </v-row>
      </div>
    </v-row>
  </v-container>
</template>

<style scoped>
.emoji-container {
  position: absolute;
  top: 8%;
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
</style>

<script>
export default {
  name: 'CheckIn',

  props: {
    firstName: { type: String, required: true },
    emojis: { type: Array, required: true },
  },

  methods: {
    emojiClicked(i) {
    }
  },
}
</script>