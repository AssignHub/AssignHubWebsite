<!-- Internal page used for manual syllabus parsing -->
<template>
  <div class="tw-h-full tw-flex tw-flex-col tw-items-center">
    <div class="tw-flex tw-mb-4 tw-gap-4">
      <InputAssignment />
      <SyllabusStatus />
    </div>
    <PublicAssignments class="tw-w-full tw-flex-1" :assignments.sync="assignments" />

    <v-menu
      v-model="contextMenu.show"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      transition="false"
    >
      <v-list v-if="contextMenu.type === CONTEXT_MENU_TYPES.SP_assignment" class="py-0" dense>
        <v-list-item @click.stop="editDialog = true; hideContextMenu()">
          <v-list-item-title>Edit</v-list-item-title>
        </v-list-item>
        <v-list-item @click="() => removeAssignment(contextMenu.data.assignmentId)">
          <v-list-item-title class="red--text">Remove</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog
      v-if="contextMenu.data"
      v-model="editDialog"
      max-width="400"
    >
      <InputAssignment 
        :assignment="assignmentById(contextMenu.data.assignmentId)"
        @doneEditing="doneEditing"
        editing
      />
    </v-dialog>
  </div>
</template>

<script>
import InputAssignment from '@/components/internal/syllabus_parsing/SP_InputAssignment'
import PublicAssignments from '@/components/internal/syllabus_parsing/SP_PublicAssignments'
import SyllabusStatus from '@/components/internal/syllabus_parsing/SP_SyllabusStatus'

import { mapState, mapMutations, mapActions } from 'vuex'
import { CONTEXT_MENU_TYPES } from '@/constants'
import { _delete } from '@/utils'

export default {
  name: 'SyllabusParsing',

  components: {
    InputAssignment,
    SyllabusStatus,
    PublicAssignments,
  },

  data: () => ({
    editDialog: false,
    assignments: [],

    CONTEXT_MENU_TYPES,
  }),

  computed: {
    ...mapState([ 'contextMenu' ]),
  },

  methods: {
    ...mapMutations([ 'hideContextMenu' ]),
    ...mapActions([ 'showError' ]),
    removeAssignment(assignmentId) {
      _delete(`/assignments/dev/${assignmentId}`).then(() => {
        const index = this.assignments.findIndex(a => a._id === assignmentId)
        this.assignments.splice(index, 1)
      }).catch(err => {
        this.showError(`Error: ${err}`)
      })
    },
    assignmentById(id) {
      const a = this.assignments.find(a => a._id === id)
      return a
    },
    doneEditing({ assignmentId, data }) {
      const index = this.assignments.findIndex(a => a._id === assignmentId)
      const assignment = this.assignments[index]
      this.assignments.splice(index, 1, { ...assignment, ...data })
      this.editDialog = false
    }
  },
}
</script>