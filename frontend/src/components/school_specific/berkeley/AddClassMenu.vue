<template>
  <v-card color="grey lighten-3">
    <v-card-title>{{ state === states.CREATE_CLASS ? 'Create class' : 'Add class' }}</v-card-title>
    <v-card-text class="px-2">
      <v-text-field
        label="Class #"
        type="number"
        placeholder="eg. 12345"
        v-model="sectionId"
        autocomplete="off"
        outlined
        dense
        class="white mb-2"
        hide-details
        :disabled="loading"
      ></v-text-field>

      <v-expand-transition>
        <div v-if="state === states.CREATE_CLASS">
          <v-text-field
            label="Course Code"
            placeholder="eg. CS61B"
            v-model="courseId"
            autocomplete="off"
            outlined
            dense
            class="white mb-2"
            hide-details
            :disabled="loading"
          ></v-text-field>

          <v-text-field
            label="Instructor"
            v-model="instructor"
            autocomplete="off"
            outlined
            dense
            class="white mb-2"
            hide-details
            :disabled="loading"
          ></v-text-field>

          <v-container class="pa-0">
            <v-row>
              <v-col cols="6" class="pr-1">
                <TimePicker
                  label="Start time"
                  v-model="startTime"
                  class="white mb-2"
                  dense
                />
              </v-col>
              <v-col cols="6" class="pl-1">
                <TimePicker
                  label="End time"
                  v-model="endTime"
                  class="white mb-2"
                  dense
                />
              </v-col>
            </v-row>
          </v-container>

          <v-checkbox
            v-model="days"
            label="Monday"
            value="M"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="days"
            label="Tuesday"
            value="T"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="days"
            label="Wednesday"
            value="W"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="days"
            label="Thursday"
            value="H"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="days"
            label="Friday"
            value="F"
            hide-details
            class="mb-4"
          ></v-checkbox>
        </div>
      </v-expand-transition>

      <ColorSelect class="white" v-model="color" :colors="colors" />

      <v-expand-transition>
        <div 
          v-if="state === states.CLASS_DOES_NOT_EXIST" 
          class="px-2"
        >
          No class exists for that course number. Would you like to <a @click="showCreateClassMenu">create one</a>?
        </div>
      </v-expand-transition>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
        text
        @click="$emit('close'); resetForm()"
      >Close</v-btn>
      <v-btn
        :disabled="!enableAdd"
        color="primary"
        :loading="loading"
        @click="submit"
      >{{ state === states.CREATE_CLASS ? 'Create' : 'Add' }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  .v-input--checkbox {
    margin-top: 0px;
  }
</style>

<script>
import { post } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'

import ColorSelect from '@/components/ColorSelect'
import TimePicker from '@/components/TimePicker'

export default {
  name: 'BerkeleyAddClassMenu',

  created() {
    this.states = {
      ADD_CLASS: 'add-class',
      CLASS_DOES_NOT_EXIST: 'no-class',
      CREATE_CLASS: 'create-class',
    }
    this.state = this.states.ADD_CLASS
  },

  props: {
    colors: { type: Array, required: true },
  },

  components: {
    ColorSelect,
    TimePicker,
  },

  watch: {
    colors: {
      immediate: true,
      handler() { this.color = this.colors[Math.floor(Math.random() * this.colors.length)] },
    }
  },

  data() {
    return {
      sectionId: '',
      courseId: '',
      instructor: '',
      days: [],
      startTime: '',
      endTime: '',
      color: '',

      state: '',
      loading: false,
    }
  },

  computed: {
    ...mapState([ 'term' ]),
    enableAdd() {
      if (this.state === this.states.ADD_CLASS || this.state === this.states.CLASS_DOES_NOT_EXIST) {
        return this.sectionId && this.color
      } else if (this.state === this.states.CREATE_CLASS) {
        return this.sectionId && this.color && this.instructor && this.days.length > 0 && this.startTime && this.endTime && this.color 
      }
    },
  },
  
  methods: {
    ...mapActions([ 'showInfo', 'showError' ]),
    addClass() {
      this.loading = true
      
      post(`/classes/add?term=${this.term}`, {
        sectionId: this.sectionId,
        color: this.color,
      }).then(data => {
        this.showInfo(`Successfully added "${data.courseId}"`)
        this.resetForm()
        this.loading = false
      }).catch(err => {
        this.handleErrors(err)
        this.loading = false
      })
    },
    createClass() {
      //this.loading = true
      const blocks = this.getBlocksFormatted()
      const instructors = [this.getInstructorFormatted()]
      post(`/classes/add?term=${this.term}`, {
        sectionId: this.sectionId,
        courseId: this.courseId,
        blocks,
        instructors,
        color: this.color,
      }).then(data => {
        this.showInfo(`Successfully added "${data.courseId}"`)
        this.resetForm()
        this.loading = false
        this.state = this.states.ADD_CLASS
      }).catch(err => {
        this.handleErrros(err)
        this.loading = false
      })
      
    },
    getBlocksFormatted() {
      return this.days.map(day => {
        return {
          day,
          start: this.startTime,
          end: this.endTime,
        }
      })
    },
    getInstructorFormatted() {
      const splitPoint = this.instructor.lastIndexOf(' ')
      if (splitPoint === -1) {
        this.showError('Please enter your instructor\'s first and last name')
        return null
      } else {
        const firstName = this.instructor.substring(0, splitPoint)
        const lastName = this.instructor.substring(splitPoint+1)
        return { firstName, lastName }
      }
    },
    handleErrors(err) {
      if (err === 'class-not-found') {
        this.state = this.states.CLASS_DOES_NOT_EXIST
      } else if (err === 'already-in-class') {
        this.showError('You are already in that class!')
      } else if (err === 'same-course-id') {
        this.showError(`You are already enrolled in another section of the requested class!`)
      } else {
        this.showError('Something went wrong when trying to add that class. Please try again later.')
      }
    },
    resetForm() {
      this.sectionId = ''
      this.courseId = ''
      this.instructor = ''
      this.days = []
      this.startTime = ''
      this.endTime = ''

      this.state = this.states.ADD_CLASS
    },
    showCreateClassMenu() {
      this.state = this.states.CREATE_CLASS
    },
    submit() {
      if (this.state === this.states.ADD_CLASS || this.state === this.states.CLASS_DOES_NOT_EXIST) {
        this.addClass()
      } else if (this.state === this.states.CREATE_CLASS) {
        this.createClass()
      }
    },
  }
}
</script>