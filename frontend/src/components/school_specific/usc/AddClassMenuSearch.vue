<!-- Dialog to search for USC classes -->

<template>
  <v-card color="grey lighten-3">
    <v-card-text>
      <v-text-field
        id="search-class-text-field"
        v-model="courseId"
        placeholder="Course ID (e.g. MATH-101) "
        prepend-inner-icon="mdi-magnify"
        autofocus
        solo
        dense
        hide-details
        autocomplete="off"
        class="mb-2"
        @keydown.enter="getSections"
      />
      <div class="d-flex">
        <v-spacer />
        <v-btn text class="mr-2" @click="$emit('close')">Close</v-btn>
        <v-btn color="primary" :disabled="!courseId" :loading="loading" @click="getSections">Search</v-btn>
      </div>
      
    </v-card-text>

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
                <v-list-item-title>{{ `${sectionId} | ${type} | ${courseId}` }}</v-list-item-title>
                <v-list-item-subtitle>{{ instructorNames({ instructors }) }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ blocksString({ blocks }) }}</v-list-item-subtitle>
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
  </v-card>
</template>

<style>
  #search-class-text-field {
    text-transform: uppercase;
  }
</style>

<script>
import { get, blocksString, instructorNames } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'UscAddClassMenuSearch',

  emits: ['input'],

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
