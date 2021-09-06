<!-- This component displays a text input without the border -->
<template>
  <textarea
    v-if="textarea"
    v-model="text"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @blur="blur"
    @focus="focus"
    :style="style"
  />
  <input
    v-else 
    @click="click"
    v-model="text"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @blur="blur"
    @focus="focus"
    :style="style"
  />
</template>

<style scoped>
  input, textarea {
    border-width: 1px;
    border-color: white;
    border-style: solid;
    border-radius: 5px;
    width: 100%;
    margin: -1px; /* to account for the border width */
  }

  input:focus, textarea:focus {
    outline: none;
  }

  input:focus::placeholder, textarea:focus::placeholder {
    color: transparent;
  }

  textarea {
    resize: none;
  }
</style>

<script>
export default {
  name: 'TextEdit',

  emits: ['input', 'focus', 'click'],

  props: {
    value: { type: String },
    cursor: { type: String },
    showBorderOnEdit: { type: Boolean, default: false },
    showHover: { type: Boolean, default: false },
    textarea: { type: Boolean, default: false },
  },

  data() {
    return {
      text: '',
      focused: false,
      isMouseOver: false,
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
      let style = { cursor: this.cursor ? this.cursor : 'auto' }
      const border = { borderStyle: 'solid', borderColor: 'lightgray', boxShadow: '0 3px 10px lightgray' }
      const hover = { backgroundColor: '#EEEEEE' }
      
      if (this.focused && this.showBorderOnEdit) style = { ...style, ...border }
      if (this.showHover && this.isMouseOver && !this.focused) style = { ...style, ...hover }

      return style
    },
  },

  methods: {
    blur() {
      this.focused = false
    },
    click(e) {
      this.$emit('click', e)
    },
    focus(e) {
      this.focused = true
      this.$emit('focus', e)
    },
    mouseover() {
      this.isMouseOver = true
    },
    mouseleave() {
      this.isMouseOver = false
    },
  }
}
</script>