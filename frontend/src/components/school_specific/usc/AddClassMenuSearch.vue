<!-- Dialog to search for USC classes -->
<!-- TODO: have a search bar where you can search by section number or professor name -->

<template>
  <v-card color="grey lighten-3">

    <v-expand-transition>
      <div v-if="sections.length === 0">
        <v-card-text>
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
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-if="sections.length > 0" id="course-id-header">
        <v-card-title :style="{ backgroundColor: color }">
          <v-btn icon @click="reset" class="mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          {{ courseId }}
          
          <v-spacer />

          <ColorSelect class="white" v-model="color" :colors="colors" no-label style="width: 10px;" />
        </v-card-title>
      </div>
    </v-expand-transition>

    <div v-if="sections.length === 0" class="pa-2 white" style="height: 400px">
      <v-fade-transition hide-on-leave>
        <div v-if="!loading" class="mt-4" style="text-align: center;">No classes found.</div>
        <v-skeleton-loader v-else type="list-item-three-line@4" />
      </v-fade-transition>
    </div>
    <v-list v-else class="overflow-y-auto" dense style="height: 400px">
      <template v-for="type in ORDER">
        <template v-if="filteredSections[type] && filteredSections[type].length > 0">
          <v-subheader :key="`${type}-header`">{{ type }}</v-subheader>
          
          <span
            v-for="({
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
      <div v-if="sections.length > 0">
        <v-card-actions>
          <v-spacer />
          <v-btn 
            :style="{opacity: checked.length > 0 ? 1 : 0}" 
            color="primary" 
            :loading="loading"
            @click="addSections"
          >
            Add {{ checked.length > 1 ? checked.length : 1 }} section{{ checked.length > 1 ? 's' : '' }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </div>
    </v-expand-transition>

  </v-card>
</template>

<style>
  #search-class-text-field, #course-id-header {
    text-transform: uppercase;
  }
</style>

<style scoped>
  .fade {
    transition: opacity 0.2s;
  }
</style>

<script>
import { get, post, blocksString, instructorNames } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'

import ColorSelect from '@/components/ColorSelect'

export default {
  name: 'UscAddClassMenuSearch',

  emits: ['input'],

  props: {
    menu: { type: Boolean, required: true }, // Whether menu is shown or not
    colors: { type: Array, required: true }, // Array of available colors to set classes to
  },

  components: {
    ColorSelect,
  },

  watch: {
    menu() {
      // Reset component if menu is closed
      if (!this.menu) this.reset()
    },
    term() {
      // Close menu if term has been changed
      this.$emit('close')
    },
    colors: {
      immediate: true,
      handler() { this.color = this.colors[Math.floor(Math.random() * this.colors.length)] },
    }
  },

  data() {
    return {
      ORDER: ['Lecture', 'Discussion', 'Lab', 'Quiz'],

      courseId: '',
      color: '',
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
    },
  },

  methods: {
    ...mapActions([ 'showInfo', 'showError' ]),
    instructorNames, blocksString,
    addSections() {
      const selectedSections = this.getSelectedSections()

      this.loading = true

      post(`/classes/add-multiple`, {
        sections: selectedSections,
        color: this.color,
      }).then(data => {
        this.showInfo(`Successfully added "${data.courseId}"`)
        this.reset()
        this.loading = false
      }).catch(err => {
        if (err === 'already-in-class') {
          // TODO: err.section is undefined because of how the post utils function works
          this.showError(`You are already in ${this.courseId} section ${err.sectionId}!`)
        } else if (err === 'same-course-id') {
          this.showError(`You are already enrolled in another lecture section for "${this.courseId}"!`)
        } else {
          this.showError('Something went wrong when trying to add that class. Please try again later.')
        }
        this.loading = false
      })
    },
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
    getSelectedSections() {
      return this.checked.map(sectionId => {
        return this.sections.find(s => s.sectionId === sectionId)
      })
    },
    reset() {
      /* Resets the dialog to its initial state */
      this.sections = []
      this.checked = []
      this.courseId = ''
      this.loading = false
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
  }
}
</script>
