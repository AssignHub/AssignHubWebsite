<!-- This component displays a text input without the border -->
<template>
  <textarea
    v-if="type === 'textarea'"
    v-model="text"
    @click="click"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @blur="blur"
    @focus="focus"
    :style="style"
  />
  <input
    v-else-if="type === 'input'" 
    v-model="text"
    @click="click"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @blur="blur"
    @focus="focus"
    :style="style"
  />
  <div
    v-else
    @click="click"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    :style="style"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
  input, textarea, div {
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
  name: 'InputItem',

  emits: ['input', 'focus', 'click'],

  props: {
    value: { type: String },
    cursor: { type: String },
    showBorderOnEdit: { type: Boolean, default: false },
    showHover: { type: Boolean, default: false },
    type: { type: String, default: 'input' },
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
      console.log('cool')
      this.isMouseOver = true
    },
    mouseleave() {
      this.isMouseOver = false
    },
  }
}
</script>