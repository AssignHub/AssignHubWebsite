<template>
  <v-menu
    v-model="show"
    transition="slide-x-transition"
    right
    offset-x
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-chip 
        :color="_class.color"
        v-bind="attrs"
        v-on="on"
      >{{ _class.courseId }}</v-chip>
    </template>
    <v-card style="width: 300px;">
      <v-expand-transition>
        <div v-if="!showMembers">
          <v-card-title>
            <v-row no-gutters>
              <v-col class="mr-2">
                <div>{{ _class.courseId }}</div>
                <div class="grey--text text-subtitle-2">Section {{ _class.sectionId }}</div>
              </v-col>
              <v-col align-self="center" cols="auto">
                <v-chip @click="showMembers = true; getMembers()">{{ _class.numMembers }} members</v-chip>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <div><v-icon class="mr-1">mdi-clipboard-account</v-icon>{{ instructorNames }}</div>
            <div><v-icon class="mr-1">mdi-clock</v-icon>{{ blocksString }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="show = false">Close</v-btn>
            <v-dialog
              v-model="removeDialog"
              width="400"
              persistent
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn 
                  text 
                  class="red--text" 
                  v-bind="attrs"
                  v-on="on"
                >Remove class</v-btn>
              </template>
              <v-card>
                <v-card-title>Are you sure?</v-card-title>
                <v-card-text>Are you sure you want to remove "{{ _class.courseId }}" and all its assignments?</v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text @click="removeDialog = false">Cancel</v-btn>
                  <v-btn text color="error" @click="removeClass(_class._id)">I'm sure</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </div>
      </v-expand-transition>
      <v-expand-transition>
        <div 
          v-if="showMembers"
          class="transition-fast-in-fast-out"
        >
          <v-card-title>
            <v-row no-gutters>
              <v-col>Class members</v-col>
              <v-col cols="auto"><v-btn text @click="showMembers = false">Back</v-btn></v-col>
            </v-row>  
          </v-card-title>
          <v-divider/>
          <v-card-text class="pa-0">
            <v-list
              dense
              class="pa-0 overflow-y-auto"
              style="height: 300px;"
            >
              <UserListItem 
                v-for="member in members" 
                :key="member._id" 
                :user="member"
                :btn-types="['add-friend']"
              />
            </v-list>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-menu>
</template>

<script>
import UserListItem from '@/components/UserListItem'
import { mapState, mapActions } from 'vuex'
import { get, _delete } from '@/utils/utils'

export default {
  name: 'ClassInfoMenu',

  props: {
    _class: { type: Object, required: true },
  },

  components: {
    UserListItem,
  },

  watch: {
    show() {
      if (!this.show)
        this.showMembers = false
    },
  },

  data() {
    return {
      show: false,
      showMembers: false,
      removeDialog: false,
      members: [],
      gotMembers: false
    }
  },

  computed: {
    ...mapState([ 'authUser' ]),
    blocksString() {
      if (!this._class.blocks)
        return 'N/A'
      if (this._class.asynchronous)
        return 'Asynchronous'

      const daysString = this._class.blocks.map(block => {
        return block.day === 'H' ? 'TH' : block.day
        //return this.dayOfWeekFromAbbr(block.day)
      }).join('/')
      const { start, end } = this._class.blocks[0]
      const timeString = this.to12Hr(start) + ' - ' + this.to12Hr(end)
      return daysString + ' | ' + timeString
    },
    instructorNames() {
      if (!this._class.instructors || this._class.instructors.length === 0)
        return 'N/A'
      return this._class.instructors.map(({ firstName, lastName }) => `${firstName} ${lastName}`).join(', ')
    },
  },

  methods: {
    ...mapActions([ 'showError', 'getAssignments', 'getPublicAssignments' ]),
    to12Hr(time) {
      const [ hour, min ] = time.split(':')
      let newHour;
      if (parseInt(hour) <= 11) {
        return time + ' AM'
      } else if (parseInt(hour) === 12) {
        newHour = parseInt(hour)
      } else {
        newHour = parseInt(hour) - 12
      }
      return newHour + ':' + min + ' PM'
    },
    getMembers() {
      if (!this.gotMembers) {
        this.gotMembers = true
        get(`/classes/${this._class._id}/members`).then(members => {
          this.members = members
        })
      }
    },
    removeClass(classId) {
      _delete(`/classes/${classId}?term=${this.term}`).then(() => {
        this.getAssignments()
        this.getPublicAssignments()
      }).catch(err => {
        this.showError('There was a problem removing that class! Please try again later.')
      })
    },
  },
}
</script>