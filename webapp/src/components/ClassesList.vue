<template>
  <v-card>
    <v-card-title class="pb-0">My Classes</v-card-title>
    <v-select
      :items="terms"
      dense
      outlined
      item-text="text"
      item-value="term"
      :value="term"
      @input="(term) => changeTerm(term)"
      hide-details
      class="mx-2"
    ></v-select>
    <v-list dense>
      <v-list-item
        v-for="(c, i) in classes"
        :key="i"
      >
        <v-list-item-content class="pa-0">
          <v-col cols="auto" class="pa-0">
            <v-menu
              transition="slide-x-transition"
              right
              offset-x
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-chip 
                  :color="c.color"
                  v-bind="attrs"
                  v-on="on"
                >{{ c.courseId }}</v-chip>
              </template>
              <v-card>
                <v-card-title>{{ c.courseId }} <v-chip class="ml-2">42 classmates</v-chip></v-card-title>
                <v-card-subtitle>
                  <div>Section {{ c.sectionId }}</div>
                  <div>Instructor: {{ c.instructor.firstName + ' ' + c.instructor.lastName }}</div>
                  <div>{{ blocksString(c) }}</div>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text>Close</v-btn>
                  <v-btn text class="red--text">Remove</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    
    <AddClassMenu />
  </v-card>
</template>

<script>
import AddClassMenu from '@/components/AddClassMenu'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ClassesList',

  components: {
    AddClassMenu,
  },

  computed: {
    ...mapState([ 'term', 'terms' ]),
    ...mapGetters({ classes: 'termClasses' }),
  },

  methods: {
    ...mapActions([ 'changeTerm' ]),
    dayOfWeekFromAbbr(abbr) {
      return ({
        M: 'Monday',
        T: 'Tuesday',
        W: 'Wednesday',
        H: 'Thursday',
        F: 'Friday',
      })[abbr]
    },
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
    blocksString(_class) {
      const daysString = _class.blocks.map(block => {
        return block.day === 'H' ? 'TH' : block.day
        //return this.dayOfWeekFromAbbr(block.day)
      }).join('/')
      const { start, end } = _class.blocks[0]
      const timeString = this.to12Hr(start) + ' - ' + this.to12Hr(end)
      return daysString + ' | ' + timeString
    },
  },
}
</script>