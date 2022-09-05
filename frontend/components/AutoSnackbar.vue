<!-- Snackbar that shows when the text changes -->
<template>
  <v-snackbar
    v-model="show"
    location="top"
    :color="color"
  >
    <span class="tw-text-sm tw-mr-2">{{ text }}</span>

    <template v-slot:actions>
      <v-btn
        icon
        variant="text"
        @click="show = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    
  </v-snackbar>
</template>

<script>
export default {
  name: 'AutoSnackbar',
  
  props: {
    text: {type: String, default: ''},
    color: {type: String, default: ''}
  },

  data() {
    return {
      show: false,
    }
  },

  created() {},

  watch: {
    text: {
      immediate: true,
      handler(text) {
        if (text) {
          this.show = true
        } else
          this.show = false
      },
    },
  },
}
</script>