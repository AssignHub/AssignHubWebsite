<template>
  <v-menu
    v-model="show"
    transition="slide-y-transition"
    bottom
    offset-x
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <AssignmentCard
        class="mx-2 mb-2" 
        v-bind="{ ...$props, ...$attrs, ...attrs }"
        v-on="on"
      />
    </template>
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
    </v-card>
  </v-menu>
</template>

<script>
import { mapActions } from 'vuex'
import AssignmentCard from '@/components/AssignmentCard'
import { DAYS_OF_WEEK, MONTHS } from '@/constants'

export default {
  name: 'AssignmentMenu',

  components: {
    AssignmentCard
  },

  props: {
    assignment: {type: Object, required: true},
  },

  data() {
    return {
      show: false,
    }
  },

  computed: {
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