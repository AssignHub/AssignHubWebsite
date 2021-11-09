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
import { get, post, blocksString, instructorNames } from '@/utils/utils.js'
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
          this.loading = false;
      }).catch(err => {
          this.handleErrors(err)
          this.loading = false
      })
    }
  },

  data() {
    return {
        color: '',
        loading: true,
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
      return blocksString(this.course)
    },
    instructorNames() {
      return instructorNames(this.course)
    },
  },

  methods: {
    ...mapActions([ 'showInfo', 'showError' ]),
    addClass() {
        this.loading = true
        
        post(`/classes/join?term=${this.term}`, {
          classId: this.classId,
          color: this.color,
        }).then(data => {
          this.showInfo(`Successfully added "${data.courseId}"`)
          this.loading = false
        }).catch(err => {
          this.handleErrors(err)
        })

        this.$router.push("/")

        this.$emit('doneJoining')
    },
    handleErrors(err) {
      if (err === 'class-not-found') {
        this.showError('That class doesn\'t exist!')
        this.$router.push("/")
        this.$emit('doneJoining').then(() => {
          this.loading = false
        })
      } else if (err === 'already-in-class') {
        this.showError('You are already in that class!')
      } else if (err === 'same-course-id') {
        this.showError(`You are already enrolled in another section of the requested class!`)
      } else {
        this.showError('Something went wrong when trying to add that class. Please try again later.')
      }
    },
    cancel() {
      this.$router.push("/")
      this.$emit('doneJoining')
    }
  },
}
</script>