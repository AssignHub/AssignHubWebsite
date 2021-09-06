<template>
  <v-menu
    offset-y
    :close-on-content-click="false"
    max-width="290"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }"></slot>
    </template>
    <v-card>
      <v-card-text class="pa-0 pb-2">
        <v-date-picker
          :value="date"
          :min-date="minDate"
          no-title
          @input="(date) => $emit('update:date', date)"
        ></v-date-picker>
        <TimePicker
          class="mx-2 mt-2"
          dense
          :value="time"
          @input="(time) => $emit('update:time', time)"
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import TimePicker from '@/components/TimePicker'
import { setNumDigits } from '@/utils/utils'

export default {
  name: 'DateTimePickerDialog',

  components: {
    TimePicker,
  },

  props: {
    date: { type: String },
    time: { type: String },
  },

  computed: {
    minDate() {
      let minDateSplit = new Date().toLocaleDateString().split('/')
      minDateSplit = [minDateSplit[2], setNumDigits(minDateSplit[0], 2), setNumDigits(minDateSplit[1], 2)]
      const minDate = minDateSplit.join('-')
      return minDate
    },
  }
}
</script>