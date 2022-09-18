<!-- Internal page used for manual syllabus parsing -->
<template>
  <div class="tw-h-full tw-flex tw-flex-col tw-items-center">
    <InputAssignment class="tw-mb-4" />
    <PublicAssignments class="tw-w-full tw-flex-1" />
  </div>
</template>

<script>
import InputAssignment from '@/components/internal/syllabus_parsing/SP_InputAssignment'
import PublicAssignments from '@/components/internal/syllabus_parsing/SP_PublicAssignments'

export default {
  name: 'SyllabusParsing',

  components: {
    InputAssignment,
    PublicAssignments,
  },

  data: () => ({
  }),

  computed: {
  },
}
</script>