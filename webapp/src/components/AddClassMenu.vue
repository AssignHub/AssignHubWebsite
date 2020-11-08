<template>
  <v-menu
    transition="slide-x-transition"
    top
    right
    offset-x
    :close-on-content-click="false"
    :close-on-click="false"
    v-model="menu"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        block
        class="grey lighten-2 add-btn"
        v-bind="attrs"
        v-on="on"
        @click="loadDepts"
      >+ Add Class</v-btn>
    </template>
    <v-card color="grey lighten-3" style="height: 335px;">
      <v-card-text class="pb-0" style="height: 280px;">
        <v-text-field
          :label="`Search for ${curItem}`"
          solo
          hide-details
          autocomplete="off" 
          prepend-inner-icon="mdi-magnify"
          v-model="query"
          class="mb-4"
        ></v-text-field>
        <div v-if="noItems" class="text-center">
          No {{ curItemPlural }} to show.
        </div>
        <v-list 
          v-else
          dense
          class="pa-0 overflow-y-auto"
          style="max-height: 200px;"
        >
          <template v-if="!curDept">
            <v-list-item 
              v-for="(dept, i) in queryDepts"
              :key="i"
              two-line 
              @click="selectDept(dept)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ dept }}</v-list-item-title>
                <v-list-item-subtitle>{{ depts[dept] }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-chevron-right</v-icon>
              </v-list-item-action>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item 
              v-for="(c, i) in queryClasses"
              :key="i"
              two-line 
              @click=""
            >
              <v-list-item-content>
                <v-list-item-title>{{ c }}</v-list-item-title>
                <v-list-item-subtitle>{{ queryClasses[c] }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="curDept"
          text
          @click="curDept = null; query = ''"
        >Back</v-btn>
        <v-btn
          text
          @click="menu = false; query = ''"
        >Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<style scoped>
  .add-btn {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>

<script>
import { get } from '@/utils/util.js'
import '@/utils/object_utils.js'

export default {
  name: 'AddClassMenu',

  props: {
    term: {type: String, required: true},
  },

  data() {
    return {
      menu: false,
      query: '',
      
      depts: null,
      queryDepts: [],
      curDept: '',

      classes: null,
      queryClasses: [],
    }
  },

  computed: {
    noItems() {
      if (!this.curDept)
        return this.queryDepts.length === 0
      else
        return this.queryClasses.length === 0
    },
    curItem() {
      if (!this.curDept)
        return 'department'
      else
        return 'class'
    },
    curItemPlural() {
      if (!this.curDept)
        return 'departments'
      else
        return 'classes'
    },
  },

  watch: {
    async query() {
      if (!this.curDept) {
        if (this.depts) {
          if (!this.query) 
            this.queryDepts = Object.keys(this.depts)
          else
            this.queryDepts = this.queryFilter(Object.keys(this.depts))
        }
      } else {
        if (this.classes) {
          if (!this.query)
            this.queryClasses = Object.keys(this.classes)
          else
            this.queryClasses = this.queryFilter(Object.keys(this.classes))
        }
      }
    },
  },

  methods: {
    async loadDepts() {
      if (!this.depts) {
        this.depts = true // Prevent running GET request again
        this.depts = await get(`/usc/depts?term=${this.term}`)
        this.queryDepts = Object.keys(this.depts)
      }
    },
    async selectDept(dept) {
      this.curDept = dept
      this.query = ''
      this.classes = await get(`/usc/depts/${this.curDept}/courses?term=${this.term}`)
      this.queryClasses = Object.keys(this.classes)
    },
    queryFilter(arr) {
      return arr.filter(item => {
        return this.matchesQuery(item)
      })
    },
    matchesQuery(item) {
      return item.toUpperCase().includes(this.query.toUpperCase())
    }
  },
}
</script>