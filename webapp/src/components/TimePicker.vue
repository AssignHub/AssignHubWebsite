<template>
  <v-text-field
    :label="label"
    type="time"
    prepend-inner-icon="mdi-clock-outline"
    hide-details
    outlined
    autocomplete="off"
    :disabled="disabled"
    :value="value"
    @input="(value) => $emit('input', value)"
  ></v-text-field>
</template>

<style> 
input[type="time"]::-webkit-calendar-picker-indicator {
  display: none;
}
</style>

<script>
import { inRange, stringReplaceByIndex } from '@/utils/utils.js'

export default {
  name: 'TimePicker',

  props: {
    label: {type: String, default: 'Pick time'},
    disabled: {type: Boolean, default: false},
    value: {type: String},
  },
}
</script>