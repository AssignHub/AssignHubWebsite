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
        <v-expansion-panel-header disable-icon-rotate class="text-subtitle-2">
          Incoming friend requests
          <template v-slot:actions>
            <v-chip>{{ friendRequests.incoming.length }}</v-chip>  
          </template>  
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list dense class="mx-n4">
            <UserListItem 
              v-for="request in friendRequests.incoming"
              :key="request._id"
              :user="request.from"
              :friendRequestId="request._id"
              :btnTypes="['accept-friend-request', 'reject-friend-request']"
            />
          </v-list>
        </v-expansion-panel-content>
        <v-divider />
      </v-expansion-panel>
      
      <v-expansion-panel v-if="friendRequests.outgoing.length > 0">
        <v-expansion-panel-header disable-icon-rotate class="text-subtitle-2">
          Outgoing friend requests
          <template v-slot:actions>
            <v-chip>{{ friendRequests.outgoing.length }}</v-chip>    
          </template>  
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list dense class="mx-n4">
            <UserListItem 
              v-for="request in friendRequests.outgoing"
              :key="request._id"
              :user="request.to"
              :friendRequestId="request._id"
              :btnTypes="['cancel-friend-request']"
            />
          </v-list>
        </v-expansion-panel-content>
        <v-divider />
      </v-expansion-panel>
      
      <v-expansion-panel>
        <v-expansion-panel-header :style="{ cursor: onlyFriendsPanel ? 'default' : 'pointer' }" class="text-subtitle-2" hide-actions>My friends</v-expansion-panel-header>
        <v-expansion-panel-content class="px-0">
          <v-list dense class="mx-n4">
            <v-list-item v-for="(f, i) in friends" :key="i">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-content
                    v-bind="attrs" 
                    v-on="on"
                    style="display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
                  >
                    {{ f.firstName }} {{ f.lastName }}
                  </v-list-item-content>
                </template>
                <span>{{ f.firstName }} {{ f.lastName }}</span>
              </v-tooltip>
              <v-list-item-icon>
                <img :src="emojis[f.emojiIndex]" style="height: 30px;">
              </v-list-item-icon>
            </v-list-item>
          </v-list>
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
    ...mapState([ 'friends', 'emojis', 'friendRequests' ]),
    onlyFriendsPanel() {
      return this.friendRequests.incoming.length === 0 && this.friendRequests.outgoing.length === 0
    },
  },
}
</script>