<!-- This component displays a text input without the border -->
<template>
  <component 
    :is="textarea ? 'textarea' : 'input'"
    v-model="text"
    @blur="blur"
    @focus="focus"
    :style="style"
  />
</template>

<style scoped>
  input {
    border-width: 1px;
    border-color: white;
    border-style: solid;
    border-radius: 5px;
    width: 100%;
  }

  input:focus {
    outline: none;
  }

  input:focus::placeholder {
    color: transparent;
  }
</style>

<script>
export default {
  name: 'TextEdit',

  emits: ['input'],

  props: {
    value: { type: String },
    showBorderOnEdit: { type: Boolean, default: false },
    textarea: { type: Boolean, default: false },
  },

  data() {
    return {
      text: '',
      focused: false,
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

  computed: {
    style() {
      if (!this.focused || !this.showBorderOnEdit) return ''
      
      return { borderStyle: 'solid', borderColor: 'lightgray', boxShadow: '0 3px 10px lightgray' }
    },
  },

  methods: {
    blur() {
      this.focused = false
    },
    focus() {
      this.focused = true
    },
  }
}
</script>