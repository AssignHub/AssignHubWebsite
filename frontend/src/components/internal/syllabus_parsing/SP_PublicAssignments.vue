<template>
  <v-card class="tw-flex tw-flex-col">
    <v-card-title>Public Assignments</v-card-title>
    <v-card-text class="tw-flex tw-flex-col tw-flex-1">
      <div class="tw-flex tw-items-center tw-mb-4">
        <v-text-field
          v-model="classId"
          label="Class ID"
          hide-details
          outlined
          autocomplete="off"
          dense
        />
        <v-btn
          @click="submit"
          :disabled="!enableSubmit"
          :loading="loading"
        >Submit</v-btn>
      </div>
      <div class="tw-flex">
        <v-spacer />
        <v-checkbox
          v-model="afterCurDate"
          label="Only show assignments after current date"
          class="tw-mt-0"
        />
      </div>
      <div class="tw-flex-1 tw-grid tw-grid-cols-5 tw-auto-rows-min">
        <AssignmentCard
          v-for="a in publicAssignments"
          :key="a._id"
          :assignment="a"
          show-date
          show-creator
          @mousedown="
            (e) => {
              if (e.which === 3) hideContextMenu()
            }
          "
          @contextmenu="(e) => showAssignmentMenu(e, a._id)"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import AssignmentCard from '@/components/AssignmentCard'
import { CONTEXT_MENU_TYPES } from '@/constants'

export default {
  name: 'SP_PublicAssignments',

  components: {
    AssignmentCard,
  },

  created() {
    this.populateData()
  },

  data: () => ({
    classId: '',
    afterCurDate: true,
    loading: false,
  }),

  computed: {
    ...mapState([ 'assignments' ]),
    enableSubmit() {
      return Boolean(this.classId)
    },
    publicAssignments() {
      let publicAssignments = this.assignments

      if (this.afterCurDate) {
        publicAssignments = publicAssignments.filter(a => {
          return new Date(a.dueDate).getTime() > new Date().getTime()
        })
      }

      return publicAssignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    },
  },

  methods: {
    ...mapMutations([ 'hideContextMenu', 'showContextMenu' ]),
    ...mapActions([ 'populateData' ]),
    submit() {
      // Search for all the public assignments for the given class
    },
    showAssignmentMenu(e, id) {
      e.preventDefault()
      this.showContextMenu({
        type: CONTEXT_MENU_TYPES.SP_assignment,
        data: { assignmentId: id },
        mouseEvent: e,
      })
    },
  },
}
</script>