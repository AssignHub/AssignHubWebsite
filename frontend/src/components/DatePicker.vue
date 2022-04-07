<template>
  <v-menu 
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="fade-transition"
    offset-y
    top
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :label="label"
        prepend-inner-icon="mdi-calendar"
        readonly
        hide-details
        outlined
        v-bind="attrs"
        v-on="on"
        :disabled="disabled"
        :dense="dense"
        :value="dateString"
      >
      </v-text-field>
    </template>
    <v-date-picker
      no-title
      :value="value"
      :min="minDate"
      @input="(date) => {$emit('input', date); menu=false}"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { getDateString } from '@/utils'

export default {
  name: 'DatePicker',

  props: {
    label: {type: String, default: 'Pick time'},
    disabled: {type: Boolean, default: false},
    dense: {type: Boolean, default: false},
    value: {type: String},
  },

  data() {
    return {
      menu: false,
      minDate: getDateString(new Date()),
    }
  },

  computed: {
    dateString() {
      if (!this.value)
        return ''
      let s = (this.value ? this.value : '')
      const [year, month, day] = this.value.split('-')
      return month + '/' + day + '/' + year.substring(2)
    },
  },
}
</script>