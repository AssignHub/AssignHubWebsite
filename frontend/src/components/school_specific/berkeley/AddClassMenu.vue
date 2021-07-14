<template>
  <v-card color="grey lighten-3">
    <v-card-title>{{ state === states.CREATE_CLASS ? 'Create class' : 'Add class' }}</v-card-title>
    <v-card-text class="px-2">
      <v-text-field
        label="Course Number"
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
            placeholder="eg. cs 160"
            v-model="courseCode"
            autocomplete="off"
            outlined
            dense
            class="white mb-2"
            hide-details
            :disabled="loading"
          ></v-text-field>

          <v-text-field
            label="Instructor"
            v-model="instructor.firstName"
            autocomplete="off"
            outlined
            dense
            class="white mb-2"
            hide-details
            :disabled="loading"
          ></v-text-field>
        </div>
      </v-expand-transition>

      <ColorSelect class="white mb-2" v-model="color" :colors="colors" />

      <v-expand-transition>
        <div 
          v-if="state === states.CLASS_DOES_NOT_EXIST" 
          class="px-2"
        >
          No class exists for that course number. Would you like to <a @click="createClass">create one</a>?
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
        @click="addClass"
      >{{ state === states.CREATE_CLASS ? 'Create' : 'Add' }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { post } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'

import ColorSelect from '@/components/ColorSelect'

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
      courseCode: '',
      instructor: {
        firstName: '',
        lastName: '',
      },
      days: [],
      times: [],
      color: '',

      state: '',
      loading: false,
    }
  },

  computed: {
    ...mapState([ 'term' ]),
    enableAdd() {
      return Boolean(this.sectionId)
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
        if (err === 'class-not-found') {
          this.state = this.states.CLASS_DOES_NOT_EXIST
        } else {
          this.showError('Something went wrong when trying to add that class. Please try again later.')
        }
        this.loading = false
      })
    },
    createClass() {
      console.log('lamo')
      this.state = this.states.CREATE_CLASS
    },
    resetForm() {
      this.sectionId = ''
      this.state = this.states.ADD_CLASS
    },
  }
}
</script>