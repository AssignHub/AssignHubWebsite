<template>
  <v-card>
    <v-card-title>Add Crowdsourced Assignment</v-card-title>
    <v-card-text>
      <ClassSelect
        label="Sort by class"
        :classes="classes" 
        v-model="curClasses" 
        clearable
        multiple
      />

      <v-card class="grey lighten-5 inner-shadow">
        <v-card-text v-if="filteredAssignments.length > 0" class="py-2">
          <v-row>
            <v-col 
              v-for="(a, i) in filteredAssignments" 
              :key="i"
              cols="4"
              class="pa-0"
            >
              <AssignmentCard
                :assignment="a"
                :classes="classes"
                class="mx-1 mb-2"
                @add="add(a.uid)"
                toAdd
                showDate
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="text-center" v-else>
          No assignments to show!
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.inner-shadow {
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.25) !important;
}
</style>

<script>
import AssignmentCard from '@/components/AssignmentCard'
import ClassSelect from '@/components/ClassSelect'

export default {
  name: 'AddAssignment',

  props: {
    classes: {type: Array, required: true},
    assignmentsToAdd: {type: Array, required: true},
  },

  components: {
    AssignmentCard,
    ClassSelect,
  },

  data() {
    return {
      curClasses: '',
    }
  },

  computed: {
    filteredAssignments() {
      if (this.curClasses.length === 0)
        return this.assignmentsToAdd.sort((a, b) => a.dueDate - b.dueDate)

      let filteredAssignments = this.curClasses.map(classText => {
        let classUid = this.classes.find(c => c.text === classText).uid
        return this.assignmentsToAdd.filter(a => a.classUid === classUid)
      }).flat().sort((a, b) => a.dueDate - b.dueDate)
      return filteredAssignments
    },
  },

  methods: {
    add(uid) {
      this.$emit('addAssignment', uid)
    },
  },
}
</script>