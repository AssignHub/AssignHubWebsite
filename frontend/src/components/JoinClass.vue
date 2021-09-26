<template>
    <v-card>
        <v-card-title>
            <v-row no-gutters>
              <v-col class="mr-2">
                <div>{{ course.courseId }}</div>
                <div class="grey--text text-subtitle-2">Section {{ course.sectionId }}</div>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <div><v-icon class="mr-1">mdi-clipboard-account</v-icon>{{ instructorNames }}</div>
            <div><v-icon class="mr-1 mb-2">mdi-clock</v-icon>{{ blocksString }}</div>
            <ColorSelect class="white mt-2" v-model="color" :colors="colors" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="addClass()"
          >
            Join
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="cancel()"
          >
            Cancel
          </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { get, post } from '@/utils/utils.js'
import { mapState, mapGetters, mapActions } from 'vuex'
import { CLASS_COLORS } from '@/constants'

import ColorSelect from '@/components/ColorSelect'


export default {
  name: 'JoinClass',

  props: {
      classId: { type: String },
  },

  components: {
      ColorSelect
  },

  mounted() {
  },

  watch: {
    colors: {
        immediate: true,
        handler() { this.color = this.colors[Math.floor(Math.random() * this.colors.length)] },
    },
    term() {
      get(`/classes/get/${this.classId}?term=${this.term}`).then(data => {
          this.course = data
      }).catch(err => {
          this.handleErrors(err)
      })
    }
  },

  data() {
    return {
        color: '',
        loading: false,
        course: '',
    }
  },

  computed: {
    ...mapState([ 'term' ]),
    ...mapGetters({ classes: 'termClasses' }),
    colors() {
      let colors = [...CLASS_COLORS]
      for (let c of this.classes) {
        let i = colors.indexOf(c.color)
        if (i > -1) colors.splice(i, 1)
      }
      return colors
    },
    blocksString() {
      if (!this.course.blocks)
        return 'N/A'
      if (this.course.asynchronous)
        return 'Asynchronous'

      const daysString = this.course.blocks.map(block => {
        return block.day === 'H' ? 'TH' : block.day
        //return this.dayOfWeekFromAbbr(block.day)
      }).join('/')
      const { start, end } = this.course.blocks[0]
      const timeString = this.to12Hr(start) + ' - ' + this.to12Hr(end)
      return daysString + ' | ' + timeString
    },
    instructorNames() {
      if (!this.course.instructors || this.course.instructors.length === 0)
        return 'N/A'
      return this.course.instructors.map(({ firstName, lastName }) => `${firstName} ${lastName}`).join(', ')
    },
  },

  methods: {
    ...mapActions([ 'showInfo', 'showError' ]),
    addClass() {
        this.loading = true
        
        post(`/classes/add?term=${this.term}`, {
          sectionId: this.course.sectionId,
          color: this.color,
        }).then(data => {
          console.log(data.courseId)
          this.showInfo(`Successfully added "${data.courseId}"`)
          this.loading = false
        }).catch(err => {
          console.log("Encountered an error")
          this.handleErrors(err)
          this.loading = false
        })

        this.$router.push("/")

        this.$emit('doneJoining')
    },
    handleErrors(err) {
      if (err === 'class-not-found') {
        //There is no class
      } else if (err === 'already-in-class') {
        this.showError('You are already in that class!')
      } else if (err === 'same-course-id') {
        this.showError(`You are already enrolled in another section of the requested class!`)
      } else {
        this.showError('Something went wrong when trying to add that class. Please try again later.')
      }
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
    cancel() {
      this.$router.push("/")
      this.$emit('doneJoining')
    }
  },
}
</script>