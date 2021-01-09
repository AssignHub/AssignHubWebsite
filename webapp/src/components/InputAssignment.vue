<template>
  <v-card>
    <v-card-title>Input Assignments</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="name"
        hide-details
        outlined  
        autocomplete="off" 
        label="Assignment name"
        class="mb-4"
        :disabled="loading"
      ></v-text-field>
      <!--<v-textarea
        hide-details
        outlined  
        autocomplete="off" 
        label="Description (optional)"
        class="mb-4"
      ></v-textarea>-->
      <ClassSelect
        :classes="classes" 
        v-model="curClass" 
        :disabled="loading"
      />
      <DateTimePicker 
        dateLabel="Due date"
        timeLabel="Time"
        :date.sync="date"
        :time.sync="time"
        :isDisabled="loading"
        class="mb-4"
      />
      <v-checkbox
        v-model="doPublish"
        label="Publish"
        class="mt-0"
        hint="Let others use this assignment"
        persistent-hint
        :disabled="loading"
      >
      </v-checkbox>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="submit"
          :disabled="!enableSubmit"
          :loading="loading"
        >Submit</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
import ClassSelect from '@/components/ClassSelect'
import DateTimePicker from '@/components/DateTimePicker'
import { get, post, patch } from '@/utils/utils.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'InputAssignment',

  components: {
    ClassSelect,
    DateTimePicker,
  },

  data() {
    return {
      name: '',
      curClass: '',
      date: new Date().toISOString().substr(0, 10),
      time: '23:59',
      doPublish: false,
      loading: false,
    }
  },

  computed: {
    ...mapGetters({ classes: 'termClasses' }),
    enableSubmit() {
      return this.name && this.curClass && this.date && this.time
    },
  },

  methods: {
    ...mapActions([ 'showError' ]),
    submit() {
      let courseObjectId = this.curClass._id
      let dueDate = Date.parse(this.date + 'T' + this.time)
      let assignment = {
        courseObjectId,
        name: this.name,
        dueDate,
        public: this.doPublish,
      }
      
      this.loading = true
      post('/assignments/create', assignment).then(() => {
        this.resetForm()
        this.loading = false
      }).catch(err => {
        this.showError('There was a problem creating that assignment! Please try again later.')
        this.loading = false
      })
    },
    resetForm() {
      this.name = ''
      this.curClass = ''
      //this.date = new Date().toISOString().substr(0, 10)
      //this.time = '23:59'
      this.doPublish = false
    },
  },
}
</script>