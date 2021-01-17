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
      <v-select
        label="Filter by"
        v-model="filterBy"
        :items="filterByItems"
        outlined
        hide-details
        class="mb-4"
      ></v-select>

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
                to-add
                show-date
                show-creator
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
      filterBy: 'instructor',
      filterByItems: [
        { text: 'None', value: 'none' },
        { text: 'Same instructor', value: 'instructor' }, 
        { text: 'Same section', value: 'section' },
      ],
    }
  },

  computed: {
    ...mapState([ 'publicAssignments' ]),
    ...mapGetters({ classes: 'termClasses' }),
    curCourseIds() {
      return this.curClasses.map(courseObjectId => {
        return this.classes.find(c => c._id === courseObjectId).courseId
      })
    },
    filteredAssignments() {
      return this.publicAssignments.filter(a => {
        if (this.curCourseIds.length > 0) {
          if (this.curCourseIds.every(courseId => a.course.courseId !== courseId)) {
            return false
          }
        }

        if (this.filterBy === 'none') return true
        
        let matchingClasses = this.classes.filter(c => c.courseId === a.course.courseId)
        for (let _class of matchingClasses) {
          if (this.filterBy === 'section' && a.course.sectionId === _class.sectionId) {
            return true
          } else if (this.filterBy === 'instructor' && this.instructorIsSame(a.course.instructor, _class.instructor)) {
            return true
          }  
        }
        return false
      }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    },
  },

  methods: {
    ...mapActions([ 'addAssignmentFromPublic', 'hidePublicAssignment' ]),
    instructorIsSame(i1, i2) {
      return i1.firstName === i2.firstName && i1.lastName === i2.lastName 
    },
  },
}
</script>