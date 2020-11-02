<template>
  <v-menu 
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"  
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        hide-details
        filled
        v-on="on"
        :value="dateTimeString"
      >
        {{ /*date ? date : '' + time ? ' @ ' + time : ''*/ 'wat' }}
      </v-text-field>
    </template>
    <v-date-picker
      v-if="!showTime"
      :value="date"
      @input="(date) => $emit('update:date', date)"
    >
      <v-btn
        text
        @click="menu = false"
      >Cancel</v-btn>
      <v-btn
        text
        color="primary"
        @click="showTime = true"
      >Next</v-btn>
    </v-date-picker>
    <v-time-picker
      :value="time"
      @input="(time) => $emit('update:time', time)"
      format="ampm"
      v-else
    >
      <v-btn
        text
        @click="showTime = false"
      >Back</v-btn>
      <v-btn
        text
        color="primary"
        @click="menu = false"
      >Done</v-btn>
    </v-time-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'DateTimePicker',

  props: {
    label: {type: String, default: 'Pick Date/Time'},
    date: {type: String},
    time: {type: String}
  },

  data() {
    return {
      menu: false,
      showTime: false,
    }
  },

  computed: {
    dateTimeString() {
      let s = (this.date ? this.date : '') + (this.time ? ' @ ' + this.time : '')
      return s
    }
  },
}
</script>