<template>
  <v-card>
    <!--<v-card-title class="pb-0">My Friends</v-card-title>-->
    <v-expansion-panels 
      v-model="expansionItem"
      accordion
      mandatory
      flat
    >
      <v-expansion-panel v-if="friendRequests.incoming.length > 0">
        <v-expansion-panel-header disable-icon-rotate class="text-subtitle-2 px-4 py-4">
          Incoming friend requests
          <template v-slot:actions>
            <v-chip small>{{ friendRequests.incoming.length }}</v-chip>  
          </template>  
        </v-expansion-panel-header>
        <v-expansion-panel-content class="grey lighten-5 inner-shadow">
          <v-list dense style="max-height: 400px;" class="grey lighten-5 mx-n4 mt-2 mb-n2 overflow-y-auto">
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
        <v-expansion-panel-header disable-icon-rotate class="text-subtitle-2 px-4 py-4">
          Outgoing friend requests
          <template v-slot:actions>
            <v-chip small>{{ friendRequests.outgoing.length }}</v-chip>    
          </template>  
        </v-expansion-panel-header>
        <v-expansion-panel-content class="grey lighten-5 inner-shadow">
          <v-list dense style="max-height: 400px;" class="grey lighten-5 mx-n4 mt-2 mb-n2 overflow-y-auto">
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
        <v-expansion-panel-header :style="{ cursor: onlyFriendsPanel ? 'default' : 'pointer' }" class="text-subtitle-2 px-4 py-4" disable-icon-rotate :hide-actions="sortedFriends.length === 0">
          My friends
          <template v-slot:actions>
            <v-chip v-if="sortedFriends.length > 0" small :style="{ cursor: onlyFriendsPanel ? 'default' : 'pointer' }">{{ sortedFriends.length }}</v-chip>    
          </template>  
        </v-expansion-panel-header>
        <v-expansion-panel-content class="grey lighten-5 inner-shadow">
          <v-list v-if="sortedFriends.length > 0" style="max-height: 400px;" dense class="grey lighten-5 mx-n4 mt-2 mb-n2 overflow-y-auto">
            <UserListItem
              v-for="f in sortedFriends" 
              :key="f._id"
              :user="f"
              remove-friend-menu
            />
          </v-list>
          <div v-else class="text-center text-caption pt-4">
            You have no friends :(
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <AddFriendMenu />
  </v-card>
</template>

<style scoped>
.v-chip {
  cursor: pointer;
}

.inner-shadow {
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.25) !important;
}

.v-expansion-panel-header {
  min-height: unset !important;
}
</style>

<script>
import AddFriendMenu from '@/components/AddFriendMenu'
import UserListItem from '@/components/UserListItem'
import { mapState } from 'vuex'

export default {
  name: 'FriendsList',

  components: {
    AddFriendMenu,
    UserListItem
  },

  data() {
    return {
      expansionItem: 2,
    }
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
        } else if (compareLastName === 0) {
          return compareFirstName
        } else {
          return compareLastName
        }
      })
    },
  },
}
</script>