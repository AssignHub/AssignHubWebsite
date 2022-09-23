<!-- A form to parse syllabus -->
<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn @click="" icon variant="text" v-bind="attrs" v-on="on" :disabled="!enableUpload">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }"> 
            <v-icon class="tw-text-3xl" v-bind="attrs" v-on="on">{{statusIcon}}</v-icon>
          </template>
          <span>Upload syllabus</span>
        </v-tooltip>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="tw-text-white tw-font-medium" :style="{backgroundColor: _class.color}">
        {{_class.courseId}}
      </v-card-title>

      <v-card-text class="tw-text-black">
        <div class="tw-text-3xl tw-font-medium tw-mt-4">{{ title }}</div>
        <div class="tw-mb-2 tw-mt-1 tw-text-xs tw-text-gray-500" v-if="extraSubtitle.length > 0">{{ extraSubtitle }}</div>
        <div class="tw-my-2">Upload any and all documents that contain assignment deadlines and exam dates, and we will automatically add those assignments to your calendar.</div>
        <div
          class="tw-h-64 tw-overflow-hidden tw-bg-sky-100 tw-border-2 tw-border-sky-600 tw-rounded-lg tw-border-dashed tw-flex tw-justify-center tw-text-sky-600 tw-mb-2 tw-relative">
          <div v-if="files.length == 0" class="tw-m-auto tw-flex tw-flex-col tw-items-center">
            <v-icon class="tw-text-5xl tw-text-sky-600">mdi-cloud-upload</v-icon>
            <div>Upload your syllabus</div>
            <div>(.pdf, screenshots, etc.)</div>
          </div>
          <div v-else class="tw-m-auto tw-flex tw-flex-col tw-items-center tw-text-gray-500">
            <div v-for="(file, i) in files" :key="i">
              <v-icon class="tw-mb-1">mdi-file</v-icon>{{file.name}}
            </div>
          </div>
          <input 
            id="syllabus-upload"
            type="file" 
            multiple 
            @change="setFiles"
            class="tw-opacity-0 tw-absolute tw-top-0 tw-right-0 tw-w-full tw-h-full tw-cursor-pointer" 
          />
        </div>
        <v-textarea 
          v-model="comment"
          :disabled="loading"
          outlined 
          hide-details 
          placeholder="Tell us anything special about your syllabus..."
          class="tw-mb-2"
        ></v-textarea>
        <div class="tw-flex">
          <v-spacer></v-spacer>
          <v-btn 
            class="tw-text-white tw-bg-blue-400" 
            @click="uploadFiles"
            :loading="loading"
          >Submit</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { serverURL } from '@/utils'
import { mapActions } from 'vuex' 
import { SYLLABUS_STATUS } from '@/constants'

export default {
  name: 'ParseSyllabusDialog',

  props: {
    _class: { type: Object },
  },

  data() {
    return {
      dialog: false,
      comment: '',
      files: [],
      status: this._class.syllabusStatus,
      loading: false,

      statusIconMap: {
        [SYLLABUS_STATUS.NONE] : 'mdi-file-upload',
        [SYLLABUS_STATUS.UPLOADED]: 'mdi-file-sync',
        [SYLLABUS_STATUS.PARSED]: 'mdi-file-check',
      },

      SYLLABUS_STATUS,
    }
  },

  computed: {
    statusIcon() {
      return this.statusIconMap[this.status]
    },
    enableUpload() {
      return this.status === SYLLABUS_STATUS.NONE || this.status === SYLLABUS_STATUS.PARSED
    },
    title() {
      // if (this.status === SYLLABUS_STATUS.PARSED) {
      //   return 'Upload another syllabus'
      // }
      return 'Upload syllabus'
    },
    extraSubtitle() {
      if (this.status === SYLLABUS_STATUS.PARSED)
        return 'Note: A syllabus has already been parsed for this class, but you may upload another one that has more assignments.'
      return ''
    },
  },

  methods: {
    ...mapActions([ 'showInfo', 'showError' ]),
    setFiles(event) {
      /* Update the files array for the UI */
      for (let i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files[i])
      }
    },
    uploadFiles() {
      /* Upload syllabus to server */
      const data = new FormData()
      for (const file of this.files) {
        data.append('file', file)
      }
      data.append('classId', this._class._id)
      data.append('comment', this.comment)

      // Need to fetch manually because post function only accepts json
      this.loading = true
      fetch(`${serverURL}/syllabi/upload`, {
        method: 'POST',
        credentials: 'include',
        body: data,
      }).then(() => {
        this.loading = false
        this.showInfo('Syllabus uploaded for parsing!')
        this.status = SYLLABUS_STATUS.UPLOADED
        this.dialog = false
      }).catch(err => {
        this.loading = false
        this.showError('There was a problem uploading your syllabus, please try again later.')
      })
    },
    clear() {
      /* Clears the files for the file input and the comment */
      const fileInput = document.getElementById('syllabus-upload')
      fileInput.value = ''
      this.files = []
      this.comment = ''
    },
  },

  watch: {
    dialog() {
      if (!this.dialog) {
        this.clear()
      }
    },
  },
}
</script>