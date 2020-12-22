<template>
  <v-menu
    transition="slide-x-transition"
    top
    right
    offset-x
    :close-on-content-click="false"
    :close-on-click="false"
    v-model="menu"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        block
        class="grey lighten-2 add-btn"
        v-bind="attrs"
        v-on="on"
      >+ Add Class</v-btn>
    </template>
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
          type="number"
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
          v-model="sectionNum"
          type="number"
          autocomplete="off"
          outlined
          dense
          class="white"
          hide-details
          :disabled="loading"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          text
          class="mr-2"
          @click="menu = false; dept = ''; courseNum = ''; sectionNum = '';"
        >Close</v-btn>
        <v-btn
          :disabled="!enableAdd"
          color="primary"
          :loading="loading"
          @click="addClass"
        >Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<style scoped>
  .add-btn {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>

<style>
  #dept-text-field {
    text-transform: uppercase;
  }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    display: none; /* TODO: find the equivalent for firefox */
  }
  ::-webkit-input-placeholder { /* WebKit browsers */
    text-transform: none;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    text-transform: none;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    text-transform: none;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    text-transform: none;
  }
  ::placeholder { /* Recent browsers */
    text-transform: none;
  }
</style>

<script>
import { get, post } from '@/utils/utils'

export default {
  name: 'AddClassMenu',

  props: {
    term: {type: String, required: true},
  },

  data() {
    return {
      menu: false,
      dept: '',
      courseNum: '',
      sectionNum: '',
      loading: false,
    }
  },

  computed: {
    enableAdd() {
      return this.dept && this.courseNum && this.sectionNum
    },
    courseId() {
      return this.dept.toUpperCase() + '-' + this.courseNum
    },
  },

  methods: {
    addClass() {
      this.loading = true
      
      post(`/usc/add-class?term=${this.term}`, {
        courseId: this.courseId,
        sectionId: this.sectionNum,
      }).then(data => {
        this.$emit('info', `Successfully added "${this.courseId}"`)
        this.resetForm()
        this.loading = false
      }).catch(err => {
        if (err === 'class-not-found') {
          this.$emit('error', 'The class you tried to add does not exist!')
        } else if (err === 'class-not-lec') {
          this.$emit('error', 'The class you tried to add is not a Lecture section. Please try again.')
        }
        this.loading = false
      })

      get(`/usc/my-classes?term=${this.term}`).then(data => console.log('My classes: ', data))
    },
    resetForm() {
      this.dept = ''
      this.courseNum = ''
      this.sectionNum = ''
    },
  }
}
</script>