<!-- A form to add assignments from the crowdsourced assignment database -->
<template>
  <v-card flat :width="width">
    <v-card-title>
      <v-row no-gutters>
        <v-col>
          Parse Syllabus
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="tw-relative">
      <div
        class="tw-h-64 tw-bg-very-light-blue tw-border-2 tw-border-blue tw-rounded-lg tw-border-dashed tw-flex tw-justify-center tw-text-blue tw-mb-2 tw-relative tw-cursor-pointer">
        <div class="tw-m-auto tw-flex tw-flex-col tw-items-center">
          <v-icon class="tw-text-5xl">mdi-cloud-upload</v-icon>
          <div>Upload your syllabus
          </div>
          <div>(.pdf, screenshots, etc.)</div>
        </div>
        <input type="file" class="tw-opacity-0 tw-absolute tw-top-0 tw-right-0 tw-w-full tw-h-full" />
      </div>
      <div class="tw-absolute tw-w-full tw-h-full tw-top-0 tw-left-0 tw-flex tw-justify-center" style="background-color: #ddddddaa">
        <div class="tw-text-base tw-mt-4 tw-text-black">
          Syllabus parsing coming soon...
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ParseSyllabus',

  props: {
    width: { type: Number },
  },
}
</script>