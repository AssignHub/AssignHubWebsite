<template>
  <v-container class="px-0">
    <v-row>
      <v-col cols="12" md="6" class="pt-0 pb-4 pb-md-0">
        <DatePicker 
          :label="dateLabel"
          :disabled="isDisabled"
          :dense="dense"
          :value="date"
          @input="(date) => $emit('update:date', date)"
        />
      </v-col>
      <v-col cols="12" md="6" class="py-0 pl-md-0">
        <TimePicker 
          :label="timeLabel"
          :disabled="isDisabled"
          :dense="dense"
          :value="time"
          @input="(time) => $emit('update:time', time)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TimePicker from '@/components/TimePicker'
import DatePicker from '@/components/DatePicker'

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
    DatePicker,
    TimePicker,
  },
}
</script>