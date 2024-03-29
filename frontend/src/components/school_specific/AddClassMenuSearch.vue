<!-- Dialog to search for classes -->
<!-- TODO: have a search bar where you can search by section number or professor name -->

<template>
  <v-card color="grey lighten-3" >

    <!-- Term header -->
    <div
      :class="!showSections && 'grey'"
      :style="showSections && { backgroundColor: color }"
    >
      <div class="d-flex" style="align-items: center;" :style="showSections && { backgroundColor: 'rgba(120, 120, 120, 0.4)' }">
        <div 
          class="px-2 white--text text-overline"
        >{{ termText }}</div>
        <v-spacer />
        <v-btn @click="hide" icon small color="white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Search class text field -->
    <v-expand-transition>
      <div v-if="!showSections">
        <v-card-text>
          <v-text-field
            id="search-class-text-field"
            v-model="courseId"
            :placeholder="searchPlaceholder"
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
            <v-btn block color="primary" :disabled="!courseId" :loading="loading" @click="getSections">Search</v-btn>
          </div>
          
        </v-card-text>
      </div>
    </v-expand-transition>

    <!-- CourseId header (shown after searching) -->
    <v-expand-transition>
      <div v-if="showSections" id="course-id-header" :style="{ backgroundColor: color }">
        <v-card-text>
          <div class="d-flex" style="align-items: center;">
            <v-btn icon @click="reset" class="mr-2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <span class="text-h6">{{ sections[0].courseId }}</span>
            
            <v-spacer />

            <ColorSelect v-if="enrolled.length === 0" class="white" v-model="color" :colors="colors" no-label />
          </div>

          <!--<v-text-field
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            :model="query"
            autofocus
            solo
            dense
            hide-details
            autocomplete="off"
          />-->
        </v-card-text>
      </div>
    </v-expand-transition>

    <!-- "No classes found" message -->
    <div v-if="!showSections && searchResults.length === 0" class="pa-2 white" style="height: 400px">
      <v-fade-transition hide-on-leave>
        <div v-if="!loading" class="mt-4" style="text-align: center;">
          {{ !sections ? 'No classes found.' : 'No sections found for the given class.' }}</div>
        <v-skeleton-loader v-else type="list-item-three-line@4" />
      </v-fade-transition>
    </div>

    <!-- Search results -->
    <v-list v-else-if="!showSections && searchResults.length > 0" class="overflow-y-auto" style="height: 400px">
      <span v-for="(curCourseId, i) in searchResults" :key="curCourseId">
        <v-divider v-if="i !== 0"/>
        <v-list-item @click="search(curCourseId)">
          <v-list-item-title>{{ curCourseId }}</v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </span>
    </v-list>

    <!-- List of sections -->
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
            <v-list-item @click="select(sectionId)" :style="{ backgroundColor: enrolled.includes(sectionId) ? color : 'unset' }">
              <v-list-item-content>
                <v-list-item-title>{{ `${sectionId} | ${type}` }}</v-list-item-title>
                <v-list-item-subtitle v-if="instructors.length > 0" class="font-weight-regular list-row">
                  <v-icon small class="mr-1">mdi-clipboard-account</v-icon> 
                  <div>{{ instructorNames({ instructors }) }}</div>
                </v-list-item-subtitle>
                <v-list-item-subtitle v-if="blocks.length > 0" class="font-weight-regular list-row">
                  <v-icon small class="mr-1">mdi-clock</v-icon>
                  <div>{{ blocksString({ blocks }) }}</div>
                </v-list-item-subtitle>
                <v-list-item-subtitle v-if="blocks.length > 0 && blocks[0].location" class="font-weight-regular list-row">
                  <v-icon small class="mr-1">mdi-map-marker</v-icon>
                  <div>{{ blocks[0].location }}</div>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox
                  v-model="checked"
                  :value="sectionId"
                  :color="enrolled.includes(sectionId) ? 'white' : ''"
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
    
    <!-- Section for Add/Update button -->
    <v-expand-transition>
      <div v-if="showSections">
        <v-card-actions>
          <v-spacer />
          <v-btn 
            :style="{opacity: hasChanged ? 1 : 0}" 
            color="primary" 
            :loading="loading"
            @click="addSections"
          >
            {{ enrolled.length === 0 ? 'Add' : 'Update' }}
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
  .list-row {
    display: flex;
    align-items: center;
  }
</style>

<script>
import { get, post, blocksString, instructorNames } from '@/utils'
import { mapState, mapGetters, mapActions } from 'vuex'

import ColorSelect from '@/components/ColorSelect'

export default {
  name: 'UscAddClassMenuSearch',

  emits: ['input', 'hide', 'show'],

  props: {
    menu: { type: Boolean, required: true }, // Whether menu is shown or not
  },

  components: {
    ColorSelect,
  },

  created() {
    this.$root.$on('searchClass', (courseId) => {
      this.show()
      this.search(courseId)
    })
  },

  watch: {
    menu() {
      // Reset component if menu is closed
      if (!this.menu) this.reset()
    },
    term() {
      // Close menu if term has been changed
      this.$emit('hide')
    },
  },

  data() {
    return {
      ORDER: ['Lecture', 'Discussion', 'Lab', 'Quiz'],

      courseId: '',
      query: '', // The search query to search for a specific section
      color: '',
      sections: null, // null means class does not exist, empty array means no sections for the given class
      enrolled: [], // Contains the already enrolled section ids for the given course id
      checked: [], // Contains the currently checked section ids
      searchResults: [], // Contains results from search, if courseId did not match exactly
      loading: false,
    }
  },

  computed: {
    ...mapState([ 'authUser', 'term', 'terms' ]),
    ...mapGetters({ colors: 'availableColors' }),
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
    change() {
      /* Returns the difference between the enrolled and checked arrays,
       * i.e. which sections have been added/removed from the enrolled array 
       */
      const change = {
        added: [],
        removed: [],
      }

      const checkedTmp = [...this.checked]
      
      // Search for removed sections, and remove them from checkedTmp if they exist
      for (let sectionId of this.enrolled) {
        const index = checkedTmp.indexOf(sectionId)
        if (index === -1) {
          change.removed.push(sectionId)
        } else {
          checkedTmp.splice(index, 1)
        }
      }

      // The sections left over in checkedTmp are the newly added sections
      change.added = [...checkedTmp]

      return change
    },
    hasChanged() {
      /* Returns whether checked has changed from enrolled */
      return this.change.added.length > 0 || this.change.removed.length > 0
    },
    searchPlaceholder() {
      /* returns the placeholder to put in the main class search bar */
      switch (this.authUser.school) {
        case 'usc':
          return 'Course ID (e.g. "MATH-125")'
        case 'berkeley':
          return 'Course ID (e.g. "EECS 126")'
        default:
          return ''
      }
    },
    showSections() {
      /* Returns whether to show the sections for a given class */
      return this.sections && this.sections.length > 0
    },
    termText() {
      return this.terms.find(t => t.term === this.term).text
    },
  },

  methods: {
    ...mapActions([ 'showInfo', 'showError' ]),
    instructorNames, blocksString,
    async addSections() {
      // Get the section objects to add or to remove
      const addedSections = this.getSectionsFromIds(this.change.added)
      const removedSections = this.getSectionsFromIds(this.change.removed).map(s => {
        const copy = {...s}
        delete copy.blocks
        delete copy.instructors
        return copy
      })

      // Display lecture error (if any)
      if (this.checkLectureError()) {
        return
      }

      /* Remove and then add the specified sections
       * NOTE: the order is important so that graphically, a lecture section is removed before a new one is added (if there was a lecture section change)
       */ 
      this.loading = true
      try {
        await post(`/classes/remove-sections`, {
          sections: removedSections
        })
        await post(`/classes/add-sections`, {
          sections: addedSections,
          color: this.color,
        })
      
        this.showInfo(`Successfully ${this.enrolled.length === 0 ? 'added' : 'updated'} "${this.courseId.toUpperCase()}"`)
        this.reset()
        this.loading = false
      } catch (err) {
        this.showError('Something went wrong when trying to add that class. Please try again later.')
        this.loading = false
      }
    },
    checkLectureError() {
      /* Shows a message if incorrect # of lectures selected and returns true, otherwise returns false */
      let numLectures = 0
      for (const section of this.filteredSections['Lecture']) {
        if (this.checked.includes(section.sectionId)) {
          numLectures++
        }
      }

      if (numLectures === 0) {
        this.showError(`Please select a lecture section for ${this.courseId.toUpperCase()}`)
        return true
      } else if (numLectures > 1) {
        this.showError(`You can only enroll in 1 lecture section for ${this.courseId.toUpperCase()}`)
        return true
      }

      return false
    },
    async getSections() {
      /* Fetches all the sections for the given courseId and stores them in this.sections */
      this.loading = true
      this.searchResults = []
      
      try {
        const { sections, enrolledSectionIds, color } = await get(`/classes/sections?courseId=${this.courseId.toUpperCase()}&term=${this.term}`)

        // courseId matched exactly, show course
        this.sections = sections
        this.enrolled = [...enrolledSectionIds]
        this.checked = [...enrolledSectionIds]
        this.searchResults = []

        if (color) 
          this.color = color
        else
          this.setRandomColor()

        this.loading = false
      } catch (err) {
        this.sections = null
        this.enrolled = []
        this.checked = []
        this.searchResults = []

        // courseId not found, perform a search
        try {
          const results = await get(`/classes/search?query=${this.courseId.toUpperCase()}&term=${this.term}`)
          this.searchResults = results
          this.loading = false
        } catch (err) {
          this.showError('Something went wrong when trying to search for that class! Please try again later.')
          this.loading = false
        }
      }
    },
    getSectionsFromIds(selection) {
      /* Returns an array of the sections given an array of sectionIds */
      return selection.map(sectionId => {
        return this.sections.find(s => s.sectionId === sectionId)
      })
    },
    reset() {
      /* Resets the dialog to its initial state */
      this.sections = null
      this.checked = []
      this.enrolled = []
      this.searchResults = []
      this.courseId = ''
      this.loading = false
    },
    search(courseId) {
      /* Programmatically searches for the given courseId */
      this.courseId = courseId
      this.getSections()
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
    setRandomColor() {
      /* Sets this.color to a random color based on the available colors */
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    },
    show() {
      this.$emit('show')
    },
    hide() {
      this.$emit('hide')
    },
  }
}
</script>
