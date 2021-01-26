<template>
  <v-card ref="friendsListCard">
    <!--<v-card-title class="pb-0">My Friends</v-card-title>-->
    <v-expansion-panels 
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
        <v-expansion-panel-content class="grey lighten-5 inner-shadow" :style="expansionContentStyle">
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
        <v-expansion-panel-header disable-icon-rotate class="text-subtitle-2 px-4 py-4">
          Outgoing friend requests
          <template v-slot:actions>
            <v-chip small>{{ friendRequests.outgoing.length }}</v-chip>    
          </template>  
        </v-expansion-panel-header>
        <v-expansion-panel-content class="grey lighten-5 inner-shadow" :style="expansionContentStyle">
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
          ref="friendsListHeader"
          :style="{ cursor: onlyFriendsPanel ? 'default' : 'pointer' }" 
          class="text-subtitle-2 px-4 py-4" 
          disable-icon-rotate 
          :hide-actions="sortedFriends.length === 0"
        >
          My friends
          <template v-slot:actions>
            <v-chip v-if="sortedFriends.length > 0" small :style="{ cursor: onlyFriendsPanel ? 'default' : 'pointer' }">{{ sortedFriends.length }}</v-chip>    
          </template>  
        </v-expansion-panel-header>
        <v-expansion-panel-content class="grey lighten-5 inner-shadow" :style="expansionContentStyle">
          <v-list v-if="sortedFriends.length > 0" dense class="grey lighten-5 mx-n4 mt-2 mb-n2 overflow-y-auto">
            <UserListItem
              v-for="f in sortedFriends" 
              :key="f._id"
              :user="f"
              remove-friend-menu
            />
          </v-list>
          <div v-else class="text-center text-caption pt-8">
            You have no friends :(
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

  mounted() {
    this.recalculateExpansionContentHeight()
  },

  watch: {
    friendRequests: {
      deep: true,
      handler() {
        this.recalculateExpansionContentHeight()
      },
    },
    '$refs.friendsListCard.$el.clientHeight': {
      handler() {
        // TODO: this doesn't work atm
        console.log('change')
      },
    }
  },

  data() {
    return {
      expansionContentHeight: '0px',
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
    expansionContentStyle() {
      return { height: this.expansionContentHeight }
    },
  },

  methods: {
    recalculateExpansionContentHeight() {
      let headerCount = 1
      if (this.friendRequests.incoming.length > 0) headerCount++
      if (this.friendRequests.outgoing.length > 0) headerCount++

      const cardHeight = this.$refs.friendsListCard.$el.clientHeight 
      const headerHeight = this.$refs.friendsListHeader.$el.clientHeight
      const btnHeight = 36 // TODO: replace this with not hardcoded value

      this.expansionContentHeight = (cardHeight - headerCount * headerHeight - btnHeight) + 'px'
    }
  },
}
</script>