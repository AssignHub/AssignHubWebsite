<!-- Allows user to change the syllabus parsing status for a given class -->
<template>
  <v-card width="400" class="tw-flex tw-flex-col">
    <v-card-title>Update Syllabus Status</v-card-title>
    <v-card-text class="tw-flex-1 tw-flex tw-flex-col tw-justify-between">
      <v-text-field
        v-model="classId"
        label="Class ID"
        hide-details
        outlined
        autocomplete="off"
        dense
        class="tw-mb-2"
        :disabled="loading"
      />
      <div class="tw-flex">
        <v-spacer/>
        <v-btn
          @click="searchClass"
          class="tw-mb-4"
        >
          Search
        </v-btn>
      </div>
      <v-select
        v-model="status"
        label="Syllabus status"
        :disabled="!selectEnabled()"
        :items="statuses"
        outlined
        hide-details
        dense
        class="tw-mb-2"
      />
      <div class="tw-flex">
        <v-spacer/>
        <v-btn
          @click="updateStatus"
          :disabled="!selectEnabled()"
          color="primary"
          class="tw-mb-4"
        >
          Update
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { SYLLABUS_STATUS } from '@/constants'
import { get, patch } from '@/utils'
import { mapActions } from 'vuex'

export default {
  name: 'SP_SyllabusStatus',

  data() {
    return {
      classId: '',
      _class: null,
      status: '',
      statuses: Object.values(SYLLABUS_STATUS),

      loading: false,
    }
  },

  methods: {
    ...mapActions([ 'showInfo', 'showError' ]),
    searchClass() {
      get(`/classes/${this.classId}`).then(_class => {
        this._class = _class
        this.status = this._class.syllabusStatus 
      }).catch(err => {
        console.error(err)
        this.showError(`error: ${err}`)
      })
    },
    updateStatus() {
      patch(`/classes/dev/${this.classId}`, {
        syllabusStatus: this.status,
      }).then(() => {
        this.showInfo(`Changed status to '${this.status}'`)
      }).catch(err => {
        console.error(err)
        this.showError(`error: ${err}`)
      })
    },
    selectEnabled() {
      return this._class != null
    },
  },
}
</script>