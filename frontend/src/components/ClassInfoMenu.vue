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
            
            <v-menu
              top
              right
              :close-on-content-click="false"
              transition="slide-y-transition"
              id="classMenu"
              @close="console.log('awef')"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list align="center" justify="center">
                
                <span v-if="shareLink">
                  <input
                    id="linkToCopy"
                    class="mx-2 my-0"
                    v-model="link"
                  >
                  <br>
                </span>
                <v-btn 
                  text
                  small
                  class="blue--text"
                  v-if="!copyingLink"
                  @click="shareLinkClick()"
                >Share link</v-btn>
                <v-btn 
                  text
                  small
                  class="blue--text mt-1"
                  @click="copyLink()"
                  v-if="shareLink && copyingLink"
                >Copy link</v-btn>
                <br>
                <v-dialog
                  v-model="removeDialog"
                  width="400"
                  persistent
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                      text 
                      small
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
              </v-list>
            </v-menu>
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

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}

#linkToCopy {
  outline: none;
  border: 1px solid #d1d1d1;
  border-radius: 3px;
  padding: 2px;
}
</style>

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
      gotMembers: false,
      shareLink: false,
      copyingLink: false,
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
    link() {
      // returns the join class link
      let origin = window.location.origin

      // Add hash if in development mode
      if (process.env.NODE_ENV === 'development') origin += '/#'
      
      return `${origin}/join/${this._class._id}`
    }
  },

  methods: {
    ...mapActions([ 'showError', 'getAssignments', 'getPublicAssignments', 'showInfo' ]),
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
    copyLink() {
      let codeToCopy = document.querySelector('#linkToCopy')
      codeToCopy.setAttribute('type', 'text')
      codeToCopy.select()
      try {
        var successful = document.execCommand('copy')
        this.showInfo('Room link copied to clipboard')
      } catch (err) {
        this.showError('There was an error copying the link')
      }
    },
    shareLinkClick() {
      this.shareLink=true
      this.copyingLink=true
    }
  },
}
</script>