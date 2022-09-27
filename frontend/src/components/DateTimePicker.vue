<template>
  <div class="tw-flex tw-gap-2">
    <div class="tw-flex-1">
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
            :label="dateLabel"
            prepend-inner-icon="mdi-calendar"
            readonly
            hide-details
            outlined
            v-bind="attrs"
            v-on="on"
            :disabled="isDisabled"
            :dense="dense"
            :value="dateString"
          >
          </v-text-field>
        </template>
        <v-date-picker
          no-title
          :value="date"
          :min="minDate"
          @input="(date) => {$emit('update:date', date); menu=false}"
        ></v-date-picker>
      </v-menu>
    </div>
    <div class="tw-flex-1">
      <TimePicker 
        :label="timeLabel"
        :disabled="isDisabled"
        :dense="dense"
        :value="time"
        @input="(time) => $emit('update:time', time)"
      />
    </div>
  </div>
</template>

<script>
import TimePicker from '@/components/TimePicker'
import { setNumDigits, getDateString } from '@/utils'

export default {
  name: 'DateTimePicker',

  props: {
    dateLabel: {type: String, default: 'Pick date'},
    timeLabel: {type: String, default: 'Pick time'},
    isDisabled: {type: Boolean, default: false},
    dense: {type: Boolean, default: false},
    date: {type: String},
    time: {type: String}
  },

  components: {
    TimePicker,
  },

  data() {
    return {
      menu: false,
      minDate: getDateString(new Date()),
    }
  },

  computed: {
    dateString() {
      if (!this.date)
        return ''
      let s = (this.date ? this.date : '')
      const [year, month, day] = this.date.split('-')
      return month + '/' + day + '/' + year.substring(2)
    },
  },
}
</script>