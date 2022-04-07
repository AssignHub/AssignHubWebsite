<!-- A form to input new assignments -->
<template>
  <v-card flat :width="width">
    <v-card-title v-if="!editing">Input Assignment</v-card-title>
    <v-card-title v-else>Edit Assignment</v-card-title>
    <v-card-text>
      <v-radio-group v-model="assignmentType" row class="mt-0">
        <v-radio label="One-time" value="one-time"></v-radio>
        <v-radio label="Recurring" value="recurring"></v-radio>
      </v-radio-group>
      <v-text-field
        v-model="name"
        label="Assignment name"
        hide-details
        outlined  
        autocomplete="off" 
        counter
        maxlength="50"
        class="mb-4"
        :disabled="loading"
        dense
      ></v-text-field>
      <ClassSelect
        :classes="_classes" 
        v-model="curClass" 
        :disabled="loading"
        class="mb-4"
        dense
      />
      <DaySelect class="mb-4" />
      <DateTimePicker 
        dateLabel="Due date"
        timeLabel="Time"
        :date.sync="date"
        :time.sync="time"
        :is-disabled="loading"
        class="mb-4"
        dense
      />
      <v-checkbox
        v-if="!editing"
        v-model="doPublish"
        label="Publish"
        class="mt-0"
        hint="Let others use this assignment"
        persistent-hint
        :disabled="loading || curClass === 'no-class'"
      >
      </v-checkbox>
      <v-card-actions class="pa-0">
        <v-spacer></v-spacer>
        <v-btn
          @click="submit"
          :disabled="!enableSubmit"
          :loading="loading"
        >{{ editing ? 'Update' : 'Submit'}}</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
import ClassSelect from '@/components/ClassSelect'
import DateTimePicker from '@/components/DateTimePicker'
import DaySelect from '@/components/DaySelect'
import { post, getTimeString, getDateString } from '@/utils'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'InputAssignment',

  props: {
    editing: { type: Boolean, default: false },
    assignment: { type: Object, default: null },
    width: { type: Number, default: undefined },
  },

  components: {
    ClassSelect,
    DateTimePicker,
    DaySelect,
  },

  data() {
    return {
      assignmentType: 'one-time',
      name: '',
      curClass: '',
      date: getDateString(new Date()),
      time: '23:59',
      doPublish: false,
      loading: false,
    }
  },

  mounted() {
    this.$root.$on('addAssignmentOnDate', (data) => {
      this.date = getDateString(data)
    });
  },

  watch: {
    assignment: {
      immediate: true,
      handler() {
        if (this.editing && this.assignment) {
          this.name = this.assignment.name
          this.curClass = this.assignment.class?._id ?? 'no-class'
          
          const date = new Date(this.assignment.dueDate)
          this.date = getDateString(date)
          this.time = getTimeString(date)
        }
      },
    },
  },

  computed: {
    ...mapGetters({ classes: 'termClasses' }),
    enableSubmit() {
      return this.name && this.curClass && this.date && this.time
    },
    _classes() {
      return [
        ...this.classes,
        { _id: 'no-class', color: '#eee', courseId: 'None' }
      ]
    },
  },

  methods: {
    ...mapActions([ 'showError', 'updateAssignment' ]),
    submit() {
      let classId = this.curClass
      let dueDate = Date.parse(this.date + 'T' + this.time)
      
      if (this.editing) {
        let updatedAssignment = {
          assignmentId: this.assignment._id,
          class: classId,
          name: this.name,
          dueDate
        }

        this.loading = true
        this.updateAssignment(updatedAssignment).then(() => {
          this.$emit('doneEditing')
          this.loading = false
        })
      } else { 
        let assignment = {
          classId,
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
      } 
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