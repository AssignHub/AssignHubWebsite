<!-- 
TODO: add lazy loading when loading ALL departments/classes so it's less "laggy" https://www.codeply.com/p/eOZKk873AJ 
TODO: Add loading indicator when loading classes/depts. usc class api will be slow at times (webreg is slow too sometimes)
TODO: maybe cache the class data on the server and only fetch once per day (so we don't need to contact API every single time)
-->

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
          :label="`Search for ${curCategory}`"
          solo
          hide-details
          autocomplete="off" 
          prepend-inner-icon="mdi-magnify"
          v-model="query"
          class="mb-4"
        ></v-text-field>
        <div v-if="filteredItems.length === 0" class="text-center">
          No {{ curCategoryPlural }} to show.
        </div>
        <v-list 
          v-else
          dense
          class="pa-0 overflow-y-auto"
          style="max-height: 200px;"
        >
          <v-list-item 
            v-for="(item, i) in filteredItems"
            :key="i"
            two-line 
            @click="itemClicked(item)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item }}</v-list-item-title>
              <v-list-item-subtitle>{{ curCategoryDescriptions[item] }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="!curDept">
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="curDept"
          text
          @click="curDept = null; classes = null; query = ''"
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
    curCategory() {
      return !this.curDept ? 'department' : 'class'
    },
    curCategoryPlural() {
      return !this.curDept ? 'departments' : 'classes'
    },
    curCategoryDescriptions() {
      return !this.curDept ? this.depts : this.classes
    },
    filteredItems() {
      if (!this.curDept) {
        if (!this.depts)
          return []
        else if (!this.query)
          return Object.keys(this.depts)
        return this.queryFilter(Object.keys(this.depts))
      } else {
        if (!this.classes)
          return []
        else if (!this.query)
          return Object.keys(this.classes)
        return this.queryFilter(Object.keys(this.classes))
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
    async selectClass(c) {
      console.log('selected class ', c)
      const sections = await get(`/usc/courses/${c}/sections?term=${this.term}`)
      console.log('sections: ', sections)
    },
    queryFilter(arr) {
      return arr.filter(item => {
        return this.matchesQuery(item)
      })
    },
    matchesQuery(item) {
      return item.toUpperCase().includes(this.query.toUpperCase())
    },
    itemClicked(item) {
      if (!this.curDept)
        this.selectDept(item)
      else
        this.selectClass(item)
    },
  },
}
</script>