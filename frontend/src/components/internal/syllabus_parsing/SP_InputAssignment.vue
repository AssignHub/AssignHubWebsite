<!-- Input assignment component for manual syllabus parsing -->
<template>
  <div>
    <v-card class="tw-max-w-lg">
      <v-card-title>Input Assignment</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="classId"
          label="Class ID"
          hide-details
          outlined
          autocomplete="off"
          dense
          class="tw-mb-4"
          :disabled="loading"
        />
        <v-text-field
          v-model="assignmentName"
          label="Assignment name"
          hide-details
          outlined
          autocomplete="off"
          dense
          class="tw-mb-4"
          :disabled="loading"
        />
        <DateTimePicker
          :date.sync="date"
          :time.sync="time"
          dense
          class="tw-mb-4"
          :is-disabled="loading"
        />
        <v-card-actions class="tw-p-0">
          <v-spacer />
          <v-btn
            @click="submit"
            :disabled="!enableSubmit"
            :loading="loading"
            color="primary"
        >{{ editing ? 'Update' : 'Submit'}}</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import DateTimePicker from '@/components/DateTimePicker.vue';
import { getDateString } from '@/utils';

export default {
  name: 'SP_InputAssignment',

  props: {
    editing: { type: Boolean, default: false },
    assignment: { type: Object, default: null },
  },

  components: {
    DateTimePicker,
  },

  data: () => ({
    classId: '',
    assignmentName: '',
    date: getDateString(new Date()),
    time: '23:59',
    loading: false,
  }),

  computed: {
    enableSubmit() {
      return this.classId && this.assignmentName && this.date && this.time
    },
  },

  methods: {
    submit() {
      // Add a public assignment to the given class
      if (this.editing) {
        this.$emit('doneEditing')
      } else {

      }
    },
  },
}
</script>