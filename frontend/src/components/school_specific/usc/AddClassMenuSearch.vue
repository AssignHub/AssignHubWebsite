<!-- Dialog to search for USC classes -->
<!-- TODO: to avoid the issue of 2 primary buttons, after search succeeds, only show courseId instead of entire search bar -->

<template>
  <v-card color="grey lighten-3">
    <v-expand-transition>
      <v-card-text v-if="sections.length === 0">
        <v-text-field
          id="search-class-text-field"
          v-model="courseId"
          placeholder="Course ID (e.g. MATH-125)"
          prepend-inner-icon="mdi-magnify"
          autofocus
          solo
          dense
          hide-details
          autocomplete="off"
          class="mb-2"
          @keydown.enter="getSections"
          :disabled="loading"
        />
        <div class="d-flex">
          <v-spacer />
          <v-btn text class="mr-2" @click="$emit('close')">Close</v-btn>
          <v-btn color="primary" :disabled="!courseId" :loading="loading" @click="getSections">Search</v-btn>
        </div>
        
      </v-card-text>
    </v-expand-transition>
    <v-expand-transition>
      <v-card-title v-if="sections.length > 0" id="course-id-header">
        <v-btn icon @click="reset" class="mr-2">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        {{ courseId }}
        
      </v-card-title>
    </v-expand-transition>

    <v-list v-if="true" class="overflow-y-auto" dense style="height: 400px">
      <template v-for="type in ORDER">
        <template v-if="filteredSections[type] && filteredSections[type].length > 0">
          <v-subheader :key="`${type}-header`">{{ type }}</v-subheader>
          
          <span
            v-for="({ 
              courseId, 
              sectionId,
              blocks, 
              type, 
              instructors 
            }, i) in filteredSections[type]" 
            
            :key="`${type}-${sectionId}`"
          >
            <v-divider v-if="i !== 0"/>
            <v-list-item @click="select(sectionId)">
              <v-list-item-content>
                <v-list-item-title>{{ `${sectionId} | ${type}` }}</v-list-item-title>
                <v-list-item-subtitle v-if="instructors.length > 0">{{ instructorNames({ instructors }) }}</v-list-item-subtitle>
                <v-list-item-subtitle v-if="blocks.length > 0">{{ blocksString({ blocks }) }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox
                  v-model="checked"
                  :value="sectionId"
                  hide-details
                  @click.stop
                  @mousedown.stop 
                  @touchstart.native.stop
                />
              </v-list-item-action>
            </v-list-item>
          </span>
        </template>
      </template>
    </v-list>
    
    <v-expand-transition>
      <v-card-actions v-if="sections.length > 0">
        <v-spacer />
        <v-btn :style="{visibility: checked.length > 0 ? 'visible' : 'hidden'}" color="primary">Add {{ checked.length }} sections</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-expand-transition>
  </v-card>
</template>

<style>
  #search-class-text-field, #course-id-header {
    text-transform: uppercase;
  }
</style>

<script>
import { get, blocksString, instructorNames } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'UscAddClassMenuSearch',

  emits: ['input'],

  props: {
    menu: { type: Boolean, required: true }, // Whether menu is shown or not
    colors: { type: Array, required: true }, // Array of available colors to set classes to
  },

  watch: {
    menu() {
      if (!this.menu) this.reset()
    },
  },

  data() {
    return {
      ORDER: ['Lecture', 'Discussion', 'Lab', 'Quiz'],

      courseId: '',
      sections: [],
      checked: [],
      loading: false,
    }
  },

  computed: {
    ...mapState([ 'term' ]),
    filteredSections() { 
      /* Organizes the sections by type */
      const filtered = {}
      for (const section of this.sections) {
        if (filtered[section.type])
          filtered[section.type].push(section)
        else
          filtered[section.type] = [ section ]
      }
      
      return filtered
    }
  },

  methods: {
    ...mapActions([ 'showError' ]),
    instructorNames, blocksString,
    getSections() {
      /* Fetches all the sections for the given courseId and stores them in this.sections */
      this.loading = true
      get(`/classes/search?courseId=${this.courseId.toUpperCase()}&term=${this.term}`).then(sections => {
        this.sections = sections
        this.checked = []
        this.loading = false
      }).catch(err => {
        this.sections = []
        this.checked = []
        this.loading = false
      })
    },
    select(sectionId) {
      /* Add sectionId to the array of selected sections */
      const index = this.checked.indexOf(sectionId)
      if (index !== -1) {
        this.checked.splice(index, 1)
      } else {
        this.checked.push(sectionId)
      }
    },
    reset() {
      /* Resets the dialog to its initial state */
      this.sections = []
      this.checked = []
      this.courseId = ''
    }
  }
}
</script>
