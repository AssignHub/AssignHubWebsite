<template>
  <v-card style="display: flex; flex-flow: column;">
    <!--<v-card-title class="pb-0">My Friends</v-card-title>-->
    <v-expansion-panels 
      accordion
      mandatory
      flat
      v-model="panel"
    >
      <v-expansion-panel v-if="friendRequests.incoming.length > 0">
        <v-expansion-panel-header disable-icon-rotate class="text-subtitle-2 pa-4">
          Incoming friend requests
          <template v-slot:actions>
            <v-chip small>{{ friendRequests.incoming.length }}</v-chip>  
          </template>  
        </v-expansion-panel-header>
        <v-expansion-panel-content class="grey lighten-5 inner-shadow">
          <v-list dense class="grey lighten-5 mx-n4 mt-2 mb-n2 overflow-y-auto">
            <UserListItem 
              v-for="request in friendRequests.incoming"
              :key="request._id"
              :user="request.from"
              :friend-request-id="request._id"
              :btn-types="['accept-friend-request', 'reject-friend-request']"
            />
          </v-list>
        </v-expansion-panel-content>
        <v-divider />
      </v-expansion-panel>
      
      <v-expansion-panel v-if="friendRequests.outgoing.length > 0">
        <v-expansion-panel-header disable-icon-rotate class="text-subtitle-2 pa-4">
          Outgoing friend requests
          <template v-slot:actions>
            <v-chip small>{{ friendRequests.outgoing.length }}</v-chip>    
          </template>  
        </v-expansion-panel-header>
        <v-expansion-panel-content class="grey lighten-5 inner-shadow">
          <v-list dense class="grey lighten-5 mx-n4 mt-2 mb-n2 overflow-y-auto">
            <UserListItem 
              v-for="request in friendRequests.outgoing"
              :key="request._id"
              :user="request.to"
              :friend-request-id="request._id"
              :btn-types="['cancel-friend-request']"
            />
          </v-list>
        </v-expansion-panel-content>
        <v-divider />
      </v-expansion-panel>
      
      <v-expansion-panel>
        <v-expansion-panel-header
          :style="{ cursor: onlyFriendsPanel ? 'default' : 'pointer' }" 
          class="text-subtitle-2 pa-4" 
          disable-icon-rotate 
          :hide-actions="sortedFriends.length === 0"
        >
          <div>
            <v-expand-transition>
              <div v-if="!showSearch" style="display: flex; align-items: center;">
                <div class="mr-1">
                My friends
                </div>
                <v-btn
                  icon
                  small
                  @click="showSearch = true"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </div>
            </v-expand-transition>
            <v-expand-transition>
              <div
                v-if="showSearch"
                class="transition-fast-in-fast-out"
              >
                <v-text-field
                  autofocus
                  style="font-weight: normal;"
                  v-model="query"
                  solo
                  dense
                  hide-details
                  placeholder="Search friend"
                  clearable
                  @click:clear="query = ''; showSearch = false;"
                ></v-text-field>
              </div>
            </v-expand-transition>
          </div>
          
          <template v-slot:actions>
            <v-chip v-if="!showSearch && sortedFriends.length > 0" small :style="{ cursor: onlyFriendsPanel ? 'default' : 'pointer' }">{{ sortedFriends.length }}</v-chip>
            <div v-else></div>    
          </template>  
        </v-expansion-panel-header>
        <v-expansion-panel-content class="grey lighten-5 inner-shadow">
          <v-list v-if="sortedFriends.length > 0" dense class="grey lighten-5 mx-n4 mt-2 mb-n2 overflow-y-auto">
            <ScheduleDialog
              v-for="f in sortedFriends" 
              :key="f._id"
              :friend="f"
            >
              <template v-slot:activator="{ on, attrs }">
                <UserListItem
                  v-on="on"
                  v-bind="attrs"
                  :user="f"
                  remove-friend-menu
                />
              </template>
            </ScheduleDialog>
          </v-list>
          <div v-else class="text-center text-caption pt-8">
            <span v-if="friends.length > 0">
              No friends found.
            </span>
            <span v-else>
              You have no friends :(
            </span>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <AddFriendMenu btn-style="flex: 0 0 auto;" />
  </v-card>
</template>

<style scoped>
.v-chip {
  cursor: pointer;
}

.inner-shadow {
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.25) !important;
}

.v-item--active {
  flex: 1 1 auto !important;
}

.v-expansion-panels {
  flex: 1 1 auto; 
  display: flex; 
  flex-flow: column; 
  min-height: 0;
}

.v-expansion-panel {
  flex: 0 0 auto;
  display: flex;
  flex-flow: column;
  min-height: 0;
}

.v-expansion-panel-header {
  min-height: unset !important;
  flex: 0 0 auto;
}

.v-expansion-panel-content {
  flex: 1 1 auto;
  min-height: 0;
}

.v-list {
  max-height: 100%;
}
</style>

<script>
import AddFriendMenu from '@/components/AddFriendMenu'
import ScheduleDialog from '@/components/ScheduleDialog'
import UserListItem from '@/components/UserListItem'
import { mapState } from 'vuex'

export default {
  name: 'FriendsList',

  components: {
    AddFriendMenu,
    ScheduleDialog,
    UserListItem,
  },

  data() {
    return {
      query: '',
      showSearch: false,
      panel: 0, // Which panel is currently open
    }
  },

  created() {
    this.setDefaultPanelOpen()
  },

  computed: {
    ...mapState([ 'friends', 'friendRequests' ]),
    onlyFriendsPanel() {
      return this.friendRequests.incoming.length === 0 && this.friendRequests.outgoing.length === 0
    },
    sortedFriends() {
      return this.friends.sort((a, b) => {
        // Place people who have a mood selected before those who don't
        if (a.mood && !b.mood) return -1
        if (!a.mood && b.mood) return 1

        // Sort by last name first, then first name
        const compareLastName = a.lastName.localeCompare(b.lastName)
        const compareFirstName = a.firstName.localeCompare(b.firstName)
        const compareEmail = a.email.localeCompare(b.email)

        if (compareLastName === 0 && compareFirstName === 0) {
          return compareEmail
        } else if (compareFirstName === 0) {
          return compareLastName
        } else {
          return compareFirstName
        }
      }).filter(({ firstName, lastName, email }) => {
        // Combine first name, last name, and email into a single string for searching 
        const s = `${firstName} ${lastName} ${email}`

        // Filter using search query
        return s.toLowerCase().includes(this.query.toLowerCase())
      })
    },
  },

  methods: {
    setDefaultPanelOpen() {
      // Opens the "my friends" panel by default
      this.panel = 0
      if (this.friendRequests.incoming.length > 0) this.panel++
      if (this.friendRequests.outgoing.length > 0) this.panel++
    },
  },
}
</script>