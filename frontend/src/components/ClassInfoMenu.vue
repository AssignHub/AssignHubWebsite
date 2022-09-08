<template>
  <v-card
    :style="{
      width: '300px',
      borderRadius: '10px',
      borderTop: '20px ' + _class.color + ' solid'
    }"
    outlined
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
  
    <v-expand-transition>
      <div>
        
        
        <v-row
          class="d-flex flex-row-reverse"
          style="position: absolute; right: 15px; top: -15px;"
        >
          <v-menu
            bottom
            right
            :close-on-content-click="false"
            transition="slide-y-transition"
            id="classMenu"
            @input="(open) => {if (open) {copyingLink = false; shareLink = false;}}"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn plain icon v-bind="attrs" v-on="on">
                <v-fade-transition>
                  <v-icon v-if="hover" large>mdi-dots-horizontal</v-icon>
                </v-fade-transition>
              </v-btn>
            </template>

            <v-list align="center" justify="center">
              <v-btn
                text
                small
                block
                @click="edit"
              >
                Edit
              </v-btn>

              <!-- <span v-if="shareLink">
                <input id="linkToCopy" class="mx-2 my-0" v-model="link" />
                <br />
              </span>
              <v-btn
                block
                text
                small
                class="blue--text"
                v-if="!copyingLink"
                @click="shareLinkClick()"
              >
                Share link
              </v-btn>
              <v-btn
                block
                text
                small
                class="blue--text mt-1"
                @click="copyLink()"
                v-if="shareLink && copyingLink"
              >
                Copy <v-icon>mdi-link</v-icon>
              </v-btn> -->

              <v-dialog v-model="removeDialog" width="400" persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text small class="red--text" v-bind="attrs" v-on="on"
                    >Remove class</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>Are you sure?</v-card-title>
                  <v-card-text
                    >Are you sure you want to remove "{{ _class.courseId }}" and
                    all its assignments?</v-card-text
                  >
                  <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="removeDialog = false">Cancel</v-btn>
                    <v-btn text color="error" @click="removeClass(_class._id)"
                      >I'm sure</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-list>
          </v-menu></v-row
        >
        <v-card-title style="marginTop: -10px;">
          
          <v-row no-gutters>
            <v-col class="mr-2">
              <div>{{ _class.courseId }}</div>
              <div class="grey--text text-subtitle-2">
                Section {{ _class.sectionId }}
              </div>
            </v-col>
            <!-- <v-col align-self="center" cols="auto">
              <v-menu
                transition="slide-x-transition"
                right
                offset-x
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-chip v-bind="attrs" v-on="on" @click="getMembers()"
                    >{{ _class.numMembers }}
                    <v-icon class="ml-1 mb-1">mdi-account-group</v-icon></v-chip
                  >
                </template>
                <div class="transition-fast-in-fast-out">
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
              </v-menu>
            </v-col> -->
          </v-row>
        </v-card-title>
        <v-card-text>
          <div>
            <v-icon class="mr-1">mdi-clipboard-account</v-icon
            >{{ instructorNames }}
          </div>
          <div><v-icon class="mr-1">mdi-clock</v-icon>{{ blocksString }}</div>
          <div v-if="_class.blocks.length > 0 && _class.blocks[0].location"><v-icon class="mr-1">mdi-map-marker</v-icon>{{ _class.blocks[0].location }}</div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import UserListItem from '@/components/UserListItem'
import { mapState, mapActions } from 'vuex'
import { get, _delete, blocksString, instructorNames } from '@/utils'

export default {
  name: 'ClassInfoMenu',

  props: {
    _class: { type: Object, required: true },
  },

  components: {
    UserListItem,
  },

  watch: {
    menuActive(val) {
      console.log(val)
    },
  },

  data() {
    return {
      removeDialog: false,
      members: [],
      gotMembers: false,
      shareLink: false,
      copyingLink: false,
      hover: false,
    }
  },

  computed: {
    ...mapState(['authUser']),
    blocksString() {
      return blocksString(this._class)
    },
    instructorNames() {
      return instructorNames(this._class)
    },
    link() {
      // returns the join class link
      let origin = window.location.origin

      // Add hash if in development mode
      //if (process.env.NODE_ENV === 'development') origin += '/#'

      return `${origin}/join/${this._class._id}`
    },
  },

  methods: {
    ...mapActions([
      'showError',
      'getAssignments',
      'getPublicAssignments',
      'showInfo',
    ]),
    edit() {
      this.$root.$emit('searchClass', this._class.courseId)
    },
    getMembers() {
      if (!this.gotMembers) {
        this.gotMembers = true
        get(`/classes/${this._class._id}/members`).then((members) => {
          this.members = members
        })
      }
    },
    removeClass(classId) {
      _delete(`/classes/${classId}?term=${this.term}`)
        .then(() => {
          this.getAssignments()
          this.getPublicAssignments()
        })
        .catch((err) => {
          this.showError(
            'There was a problem removing that class! Please try again later.'
          )
        })
    },
    copyLink() {
      let codeToCopy = document.querySelector('#linkToCopy')
      codeToCopy.setAttribute('type', 'text')
      codeToCopy.select()
      try {
        var successful = document.execCommand('copy')
        this.showInfo('Class link copied to clipboard')
      } catch (err) {
        this.showError('There was an error copying the link')
      }
    },
    shareLinkClick() {
      this.shareLink = true
      this.copyingLink = true
    },
  },
}
</script>
