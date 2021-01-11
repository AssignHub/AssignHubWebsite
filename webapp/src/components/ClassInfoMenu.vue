<template>
  <v-menu
    v-model="show"
    transition="slide-x-transition"
    right
    offset-x
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-chip 
        :color="_class.color"
        v-bind="attrs"
        v-on="on"
      >{{ _class.courseId }}</v-chip>
    </template>
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <v-col class="mr-2">
            <div>{{ _class.courseId }}</div>
            <div class="grey--text text-subtitle-2">Section {{ _class.sectionId }}</div>
          </v-col>
          <v-col align-self="center">
            <v-chip class="ml-2" @click="showMembers = !showMembers">42 members</v-chip>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <div><v-icon class="mr-1">mdi-clipboard-account</v-icon>{{ _class.instructor.firstName + ' ' + _class.instructor.lastName }}</div>
        <div><v-icon class="mr-1">mdi-clock</v-icon>{{ blocksString }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="show = false">Close</v-btn>
        <v-btn text class="red--text" @click="removeClass(_class._id)">Remove class</v-btn>
      </v-card-actions>

      <v-expand-transition>
        <v-card 
          v-show="showMembers"
          class="transition-fast-in-fast-out v-card--reveal"
          style="height: 100%;"
        >
          <v-card-title>Class members</v-card-title>
          <v-card-text>
          <v-list
            dense
            class="pa-0 overflow-y-auto"
            style="max-height: 200px;"
          >
            <v-list-item two-line>
              <v-list-item-avatar color="primary" class="text-center">
                <span class="white--text headline">J</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Jimothy McCarthy</v-list-item-title>
                <v-list-item-subtitle>jmcc@usc.edu</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="showMembers = false">Back</v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-card>
  </v-menu>
</template>

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ClassInfoMenu',

  props: {
    _class: { type: Object, required: true },
  },

  data() {
    return {
      show: false,
      showMembers: false,
    }
  },

  computed: {
    blocksString() {
      const daysString = this._class.blocks.map(block => {
        return block.day === 'H' ? 'TH' : block.day
        //return this.dayOfWeekFromAbbr(block.day)
      }).join('/')
      const { start, end } = this._class.blocks[0]
      const timeString = this.to12Hr(start) + ' - ' + this.to12Hr(end)
      return daysString + ' | ' + timeString
    },
  },

  methods: {
    ...mapActions([ 'removeClass' ]),
    to12Hr(time) {
      const [ hour, min ] = time.split(':')
      let newHour;
      if (parseInt(hour) <= 11) {
        return time + ' AM'
      } else if (parseInt(hour) === 12) {
        newHour = parseInt(hour)
      } else {
        newHour = parseInt(hour) - 12
      }
      return newHour + ':' + min + ' PM'
    },
  },
}
</script>