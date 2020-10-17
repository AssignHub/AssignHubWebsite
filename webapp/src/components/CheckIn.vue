<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <div class="text-center text-h3">How are you doing today, {{ firstName }}?</div>
      </v-col>
      <!-- Icons are from here: https://icons8.com/icon/set/face/emoji -->
      <v-col v-for="(src, i) in emojis" :key="i" cols="auto">
        <img :src="src">
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CheckIn',

  props: {
    firstName: { type: String, required: true },
    emojis: { type: Array, required: true },
  },
}
</script>