<!-- This component displays a text input without the border -->
<template>
  <input v-model="text">
</template>

<style scoped>
  input {
    border-width: 0;
    width: 100%;
  }

  input:focus {
    outline: none;
  }
</style>

<script>
export default {
  name: 'TextEdit',

  emits: ['input'],

  props: {
    value: { type: String },
  },

  created() {
    console.log('wat', this.value)
  },

  data() {
    return {
      text: '',
    }
  },

  watch: {
    text(t) {
      this.$emit('input', t)
    },
    value: {
      immediate: true,
      handler(value) {
        if (this.text !== value) {
          this.text = value
        }
      },
    },
  },
}
</script>