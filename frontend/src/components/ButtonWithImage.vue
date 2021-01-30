<template>
  <v-btn :color="color" @click="onClick" :dark="dark">
    <v-container>
      <v-row
        align="center"
        justify="center"
      >
        <v-col class="pa-0" cols="auto">
          <v-img
            v-if="!isAvatar"
            :src="src"
            contain
            max-height="2em"
            max-width="2em"
            class="btn-img"
            :class="dark ? '' : ''"
            transition="scale-transition"
          ></v-img>
        </v-col>
        <v-col class="text-center">
          <v-avatar v-if="isAvatar" height="2em" width="2em">
            <img :src="src" />
          </v-avatar>
          {{ text }}
        </v-col>
      </v-row>
    </v-container>
  </v-btn>
</template>

<script>
export default {
  name: 'ButtonWithImage',
  props: {
    src: { type: String, required: true },
    text: { type: String, required: true },
    color: { type: String, default: '' },
    dark: { type: Boolean, default: false },
    isAvatar: { type: Boolean, default: false },
  },
  methods: {
    onClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>