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
      >+ Add Class</v-btn>
    </template>
    <v-card color="grey lighten-3" style="height: 335px;">
      <v-card-text class="pb-0" style="height: 280px;">
        <v-text-field
          :label="`Search for ${curCatName}`"
          solo
          hide-details
          autocomplete="off" 
          prepend-inner-icon="mdi-magnify"
          v-model="query"
          class="mb-4"
        ></v-text-field>
        <div v-if="menu && categories[curCategoryIndex].items === 'loading'">
          <v-skeleton-loader 
            v-for="i in 3"
            :key="i"
            type="list-item-two-line"
            tile
          ></v-skeleton-loader>
        </div>
        <div v-else-if="filteredItems.length === 0" class="text-center">
          No {{ curCatNamePlural }} to show.
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
              <v-list-item-title>{{ item.value }}</v-list-item-title>
              <v-list-item-subtitle
                v-for="(description, i) in categories[curCategoryIndex].getDescription(item)"
                :key="i"
              >{{ description }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="curCategoryIndex < categories.length-1">
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="curCategoryIndex > 0"
          text
          @click="goBack"
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

      categories: [
        {
          name: 'department',
          namePlural: 'departments',
          items: null,
          curItem: null,
          route: `/usc/depts`,
          getDescription: (item) => [item.description],
        },
        {
          name: 'class',
          namePlural: 'classes',
          items: null,
          curItem: null,
          route: `/usc/depts/##[0]##/courses`, // ##[0]## refers to the curItem of the index 0 category
          getDescription: (item) => [item.description],
        },
        {
          name: 'section',
          namePlural: 'sections',
          items: null,
          curItem: null,
          route: `/usc/courses/##[1]##/sections`,
          getDescription: this.getSectionDescription,
        },
      ],
    }
  },

  computed: {
    curCategoryIndex() {
      if (this.menu) {
        for (let i = 0; i < this.categories.length; i++) {
          if (!this.categories[i].curItem) {
            this.loadCategory(i)
            return i
          }
        }
        // We have reached the end of the categories...Add the class!
        this.$emit('addClass', {
          class: this.categories[1].curItem.value,
          sectionData: this.categories[2].curItem,
        })
        this.menu = false
        this.resetCategories()
      }
      return -1 // -1 means menu isn't shown
    },
    curCatName() {
      return this.menu && this.categories[this.curCategoryIndex].name 
    },
    curCatNamePlural() {
      return this.menu && this.categories[this.curCategoryIndex].namePlural
    },
    filteredItems() {
      if (this.menu) {
        const items = this.categories[this.curCategoryIndex].items
        if (!Array.isArray(items))
          return [] 

        const filteredItems = items.filter(item => {
          return item.value.toUpperCase().includes(this.query.toUpperCase())
        })
        return filteredItems 
      }
      return []
    },
  },

  methods: {
    async loadCategory(index) {
      if (!this.categories[index].items) {
        this.categories[index].items = 'loading' // Prevent running GET request again
        const regex = /##\[([0-9]+)\]##/g
        const route = this.categories[index].route.replace(regex, (match, replaceIndex) => {
          if (this.categories[replaceIndex].curItem.value.includes('/')) {
            alert('h3h3 brilliant hacking skills, my friend...')
            return '<STOP>'
          }
          return this.categories[replaceIndex].curItem.value
        })
        if (!route.includes('<STOP>')) {
          console.log('GET ', route  + `?term=${this.term}`)
          this.categories[index].items = await get(route + `?term=${this.term}`)
        }
      }
    },
    itemClicked(item) {
      this.categories[this.curCategoryIndex].curItem = item
      this.query = ''
    },
    getSectionDescription(item) {
      const instructorString = item.instructor.first_name + ' ' + item.instructor.last_name
      const to12HrTime = (time) => new Date(`0000-01-01T${time}:00`).toLocaleTimeString([], {timeStyle: 'short'})
      const blocks = item.blocks; 
      const blocksString = blocks.map(block => block.day === 'H' ? 'TH' : block.day).join('/') + ', ' + to12HrTime(blocks[0].start) + ' - ' + to12HrTime(blocks[0].end)
      return [instructorString, blocksString]
    },
    goBack() {
      const origIndex = this.curCategoryIndex
      this.categories[origIndex-1].curItem = null
      this.categories[origIndex].items = null
      this.query = ''
    },
    resetCategories() {
      this.query = ''
      for (let i = 0; i < this.categories.length; i++) {
        this.categories[i].curItem = null
        this.categories[i].items = null
      }
    },
  },
}
</script>