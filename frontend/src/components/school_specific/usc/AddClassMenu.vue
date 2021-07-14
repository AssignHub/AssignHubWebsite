<template>
  <v-card color="grey lighten-3">
    <v-card-title>Add class</v-card-title>
    <v-card-text class="px-2">
      <v-text-field
        id="dept-text-field"
        label="Department"
        placeholder="eg. BUAD, CSCI"
        v-model="dept"
        autocomplete="off"
        outlined
        dense
        class="white mb-2"
        hide-details
        onkeypress="return /[a-z]/i.test(event.key)"
        :disabled="loading"
      ></v-text-field>
    
      <v-text-field
        label="Course Number"
        placeholder="eg. 101, 304"
        v-model="courseNum"
        autocomplete="off"
        outlined
        dense
        class="white mb-2"
        hide-details
        :disabled="loading"
      ></v-text-field>

      <v-text-field
        label="Section"
        placeholder="eg. 12345"
        v-model="sectionId"
        type="number"
        autocomplete="off"
        outlined
        dense
        class="white mb-2"
        hide-details
        :disabled="loading"
      ></v-text-field>

      <ColorSelect class="white" v-model="color" :colors="colors" />
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
      >Add</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style>
  #dept-text-field {
    text-transform: uppercase;
  }
</style>

<script>
import { post } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'

import ColorSelect from '@/components/ColorSelect'

export default {
  name: 'UscAddClassMenu',

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
      dept: '',
      courseNum: '',
      sectionId: '',
      color: '',
      loading: false,
    }
  },

  computed: {
    ...mapState([ 'term' ]),
    enableAdd() {
      return this.dept && this.courseNum && this.sectionId
    },
    courseId() {
      return this.dept.toUpperCase() + '-' + this.courseNum.toUpperCase()
    },
  },
  
  methods: {
    ...mapActions([ 'showInfo', 'showError' ]),
    addClass() {
      this.loading = true
      
      post(`/classes/add?term=${this.term}`, {
        courseId: this.courseId,
        sectionId: this.sectionId,
        color: this.color,
      }).then(data => {
        this.showInfo(`Successfully added "${data.courseId}"`)
        this.resetForm()
        this.loading = false
      }).catch(err => {
        if (err === 'class-not-found') {
          this.showError('The class you tried to add does not exist!')
        } else if (err === 'class-not-lec') {
          this.showError('The class you tried to add is not a Lecture section. Please try again.')
        } else if (err === 'already-in-class') {
          this.showError('You are already in that class!')
        } else if (err === 'same-course-id') {
          this.showError(`You are already enrolled in another section for "${this.courseId}"!`)
        } else {
          this.showError('Something went wrong when trying to add that class. Please try again later.')
        }
        this.loading = false
      })
    },
    resetForm() {
      this.dept = ''
      this.courseNum = ''
      this.sectionId = ''
    },
  }
}
</script>