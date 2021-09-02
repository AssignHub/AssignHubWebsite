<template>
  <v-dialog
    v-model="show"
    transition="fade-transition"
    bottom
    offset-x
    width="500"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <AssignmentCard
        class="mx-2 mb-2" 
        v-bind="{ ...$props, ...$attrs, ...attrs }"
        v-on="on"
      />
    </template>
    <v-card style="width: 500px;">
      <v-card-title>
        <TextEdit v-model="tempAssignmentData.name" class="text-h6"/>
      </v-card-title>
      <v-card-text>
        <table>
          <tr>
            <td>Class</td>
            <td class="pa-2">
              <v-chip small :color="classColor">
                {{ tempAssignmentData.class.courseId }}
              </v-chip>
            </td>
          </tr>
          <tr>
            <td>Due</td>
            <td class="black--text pa-2">{{ `${dateString} at ${timeString}` }}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>
              <TextEdit 
                v-model="tempAssignmentData.description" 
                class="pa-2"
                placeholder="Empty" 
                showBorderOnEdit
              />
            </td>
          </tr>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="error"
        >Delete</v-btn>
        <v-btn
          color="primary"
        >Mark as done</v-btn>
      </v-card-actions>
    </v-card>
    <!--
    <v-card style="width: 300px;">
      <v-card-title>
        <v-row no-gutters>
          <v-col class="mr-2">
            <div>{{ assignment.name }}</div>
          </v-col>
          <v-col align-self="center" cols="auto">
            <v-btn icon @click="">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <div class="black--text"><v-icon class="mr-1">mdi-clock</v-icon>{{ `${dateString} at ${timeString}` }}</div>
        <div v-if="assignment.proofUrl">
          <v-icon class="mr-1">mdi-clipboard-check</v-icon>
          <a :href="assignment.proofUrl" target="_blank">Proof</a>
        </div>
        <div v-if="assignment.submissionUrl">
          <v-icon class="mr-1">mdi-file-upload</v-icon>
          <a :href="assignment.submissionUrl" target="_blank">Submit here</a>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="show = false">Close</v-btn>
        <v-btn :color="assignment.done ? '' : 'primary'" @click="toggle">{{ assignment.done ? 'Unmark as done' : 'Mark as done' }}</v-btn>
      </v-card-actions>
    </v-card>-->
  </v-dialog>
</template>

<style scoped>
  table {
    border-spacing: 20px 0px;
    margin: 0px -20px;
  }

  td {
    white-space: nowrap;
  }

  td:nth-child(1) {
    text-align: right;
  }
  
  td:last-child {
    width: 100%;
  }
</style>

<script>
import { mapGetters, mapActions } from 'vuex'
import AssignmentCard from '@/components/AssignmentCard'
import InputAssignment from '@/components/InputAssignment'
import TextEdit from '@/components/TextEdit'
import { DAYS_OF_WEEK, MONTHS } from '@/constants'

export default {
  name: 'AssignmentMenu',

  components: {
    AssignmentCard,
    InputAssignment,
    TextEdit,
  },

  props: {
    assignment: {type: Object, required: true},
  },

  created() {
    console.log(this.assignment)
    this.tempAssignmentData = { ...this.assignment }
  },

  watch: {
    show: {
      immediate: true,
      handler(show) {
        if (show) {
          this.tempAssignmentData = { ...this.assignment }
        }
      },
    },
  },

  data() {
    return {
      show: false,
      tempAssignmentData: null,
    }
  },

  computed: {
    ...mapGetters(['classColorById']),
    classColor() {
      return this.classColorById(this.tempAssignmentData.class._id)
    },
    dueDate() {
      return new Date(this.assignment.dueDate)
    },
    dateString() {
      return `${DAYS_OF_WEEK[this.dueDate.getDay()]}, ${MONTHS[this.dueDate.getMonth()]} ${this.dueDate.getDate()}`
    },
    timeString() {
      return this.dueDate.toLocaleTimeString([], {timeStyle: 'short'})
    },
  },

  methods: {
    ...mapActions([ 'toggleAssignment' ]),
    toggle() {
      this.show = false
      this.toggleAssignment(this.assignment._id)
    },
  },
}
</script>