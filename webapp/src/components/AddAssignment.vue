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
        class="mb-4"
      />

      <v-card class="grey lighten-5 inner-shadow">
        <v-card-text v-if="filteredAssignments.length > 0" class="pt-2 pb-0 px-1">
          <v-row no-gutters>
            <v-col 
              v-for="(a, i) in filteredAssignments" 
              :key="i"
              cols="12"
              :md="6"
              :lg="6"
            >
              <AssignmentCard
                class="mx-1 mb-2"
                :assignment="a"
                @add="addAssignmentFromPublic(a._id)"
                @remove="hidePublicAssignment(a._id)"
                toAdd
                showDate
                showCreator
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
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'AddAssignment',

  components: {
    AssignmentCard,
    ClassSelect,
  },

  data() {
    return {
      curClasses: [],
    }
  },

  computed: {
    ...mapState([ 'publicAssignments' ]),
    ...mapGetters({ classes: 'termClasses' }),
    filteredAssignments() {
      if (this.curClasses.length === 0)
        return this.publicAssignments.sort((a, b) => a.dueDate - b.dueDate)

      let filteredAssignments = this.curClasses.map(courseObjectId => {
        return this.publicAssignments.filter(a => a.course._id === courseObjectId)
      }).flat().sort((a, b) => a.dueDate - b.dueDate)
      return filteredAssignments
    },
  },

  methods: {
    ...mapActions([ 'addAssignmentFromPublic', 'hidePublicAssignment' ]),
  },
}
</script>