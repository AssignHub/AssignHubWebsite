<!-- A form to parse syllabus -->
<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn @click="" icon variant="text" v-bind="attrs" v-on="on" :disabled="status != 'missing'">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }"> 
            <v-icon class="tw-text-3xl" v-bind="attrs" v-on="on">{{statusIcon}}</v-icon>
          </template>
          <span>Upload syllabus</span>
        </v-tooltip>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="tw-text-white tw-font-light" :style="{backgroundColor: _class.color}">
        {{_class.courseId}}</v-card-title>

      <v-card-text class="tw-text-black">
        <div class="tw-text-3xl tw-font-bold tw-mb-2 tw-mt-2">Parse syllabus</div>
        <div class="tw-mb-2">Upload any and all documents that contain assignment deadlines and exam dates.
        </div>
        <div
          class="tw-h-64 tw-overflow-hidden tw-bg-very-light-blue tw-border-2 tw-border-blue tw-rounded-lg tw-border-dashed tw-flex tw-justify-center tw-text-blue tw-mb-2 tw-relative tw-cursor-pointer">
          <div v-if="files.length == 0" class="tw-m-auto tw-flex tw-flex-col tw-items-center">
            <v-icon class="tw-text-5xl">mdi-cloud-upload</v-icon>
            <div>Upload your syllabus
            </div>
            <div>(.pdf, screenshots, etc.)</div>
          </div>
          <div v-else class="tw-m-auto tw-flex tw-flex-col tw-items-center">
            <div v-for="(file, i) in files" :key="i">
              <v-icon class="tw-mb-1">mdi-file</v-icon>{{file.name}}
            </div>
          </div>
          <input type="file" multiple @change="setFiles"
            class="tw-opacity-0 tw-absolute tw-top-0 tw-right-0 tw-w-full tw-h-full" />
        </div>
        <v-textarea outlined placeholder="Tell us anything special about your syllabus..."></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="tw-text-white tw-bg-blue-400" @click="uploadFiles">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ParseSyllabusDialog',

  props: {
    _class: { type: Object },
  },

  data() {
    return {
      dialog: false,
      files: [],
      status: "uploaded",
    }
  },

  methods: {
    setFiles(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files[i])
      }
    },
    uploadFiles() {
      this.dialog = false
    }
  },

  computed: {
    statusIcon() {
      const map = new Map();
      map.set('uploaded', 'mdi-file-check')
      map.set('parsing', 'mdi-file-sync')
      map.set('missing', 'mdi-file-upload')
      return map.get(this.status)
    }
  },
}
</script>