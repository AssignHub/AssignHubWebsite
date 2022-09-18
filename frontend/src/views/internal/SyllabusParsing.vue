<!-- Internal page used for manual syllabus parsing -->
<template>
  <div class="tw-h-full tw-flex tw-flex-col tw-items-center">
    <InputAssignment class="tw-mb-4" />
    <PublicAssignments class="tw-w-full tw-flex-1" />

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
        @doneEditing="editDialog = false"
        editing
      />
    </v-dialog>
  </div>
</template>

<script>
import InputAssignment from '@/components/internal/syllabus_parsing/SP_InputAssignment'
import PublicAssignments from '@/components/internal/syllabus_parsing/SP_PublicAssignments'

import { mapState, mapGetters, mapMutations } from 'vuex'
import { CONTEXT_MENU_TYPES } from '@/constants'

export default {
  name: 'SyllabusParsing',

  components: {
    InputAssignment,
    PublicAssignments,
  },

  data: () => ({
    editDialog: false,

    CONTEXT_MENU_TYPES,
  }),

  computed: {
    ...mapState([ 'contextMenu' ]),
  },

  methods: {
    ...mapMutations([ 'hideContextMenu' ]),
    removeAssignment(assignmentId) {
      // TODO: remove public assignment

      // _delete(`/assignments/${assignmentId}`).catch(err => {
      //   this.showError('There was a problem removing that assignment! Please try again later.')
      // })
    },
    assignmentById(id) {
      // TODO: get assignment data from public assignment results
    },
  },
}
</script>