<template>
  <v-card flat>
    <v-card-title>
      <v-row no-gutters>
        <v-col>
          Add Crowdsourced Assignment
        </v-col>
        <v-col cols="auto">
          <v-btn
            icon
            @click="getPublicAssignments"
          >
            <v-icon>mdi-sync</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <ClassSelect
        label="Sort by class"
        :classes="classes" 
        v-model="curClasses" 
        clearable
        multiple
        class="mb-4"
        dense
      />
      <v-select
        label="Filter by"
        v-model="filterBy"
        :items="filterByItems"
        outlined
        hide-details
        class="mb-4"
        dense
      ></v-select>

      <v-card class="grey lighten-5 inner-shadow" style="height: 300px; overflow-y: auto;">
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
                to-add
                show-date
                show-creator
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else class="text-center" style="position: absolute; top: 50%; transform: translate(0%, -50%);">
          <v-progress-circular
            v-if="loading.publicAssignments"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <span v-else>
            No assignments to show!
          </span>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import AssignmentCard from '@/components/AssignmentCard'
import ClassSelect from '@/components/ClassSelect'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'AddAssignment',

  components: {
    AssignmentCard,
    ClassSelect,
  },

  data() {
    return {
      curClasses: [],
      filterBy: 'instructor',
      filterByItems: [
        { text: 'None', value: 'none' },
        { text: 'Same instructor', value: 'instructor' }, 
        { text: 'Same section', value: 'section' },
      ],
    }
  },

  computed: {
    ...mapState([ 'publicAssignments', 'loading' ]),
    ...mapGetters({ classes: 'termClasses' }),
    curCourseIds() {
      return this.curClasses.map(classId => {
        return this.classes.find(c => c._id === classId).courseId
      })
    },
    filteredAssignments() {
      const filtered = this.publicAssignments.filter(a => {
        if (this.curCourseIds.length > 0) {
          if (this.curCourseIds.every(courseId => a.class.courseId !== courseId)) {
            return false
          }
        }

        if (this.filterBy === 'none') return true
        
        let matchingClasses = this.classes.filter(c => c.courseId === a.class.courseId)
        for (let _class of matchingClasses) {
          if (this.filterBy === 'section' && a.class.sectionId === _class.sectionId) {
            return true
          } else if (this.filterBy === 'instructor' && this.sameInstructors(a.class.instructors, _class.instructors)) {
            return true
          }  
        }
        return false
      }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

      this.setNumPendingAssignments(filtered.length)
      return filtered
    },
  },

  methods: {
    ...mapActions([ 'addAssignmentFromPublic', 'hidePublicAssignment', 'getPublicAssignments' ]),
    ...mapMutations([ 'setNumPendingAssignments' ]),
    sameInstructors(i1, i2) {
      if (i1.length !== i2.length) {
        return false
      } else {
        for (let i = 0; i < i1.length; i++) {
          if (i1[i].firstName !== i2[i].firstName || i1[i].lastName !== i2[i].lastName) {
            return false
          }
        }
        return true
      }
    },
  },
}
</script>