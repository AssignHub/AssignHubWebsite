<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="12" md="6" class="pt-0 pb-4 pb-md-0">
        <v-menu 
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="fade-transition"  
          :nudge-right="40"
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
              :value="dateString"
            >
            </v-text-field>
          </template>
          <v-date-picker
            :value="date"
            @input="(date) => {$emit('update:date', date); menu=false}"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="6" class="py-0 pl-md-0">
        <TimePicker 
          :label="timeLabel"
          :value="time"
          @input="(time) => $emit('update:time', time)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TimePicker from '@/components/TimePicker'

export default {
  name: 'DateTimePicker',

  props: {
    dateLabel: {type: String, default: 'Pick date'},
    timeLabel: {type: String, default: 'Pick time'},
    date: {type: String},
    time: {type: String}
  },

  components: {
    TimePicker,
  },

  data() {
    return {
      menu: false,
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