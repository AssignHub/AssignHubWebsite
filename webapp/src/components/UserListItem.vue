<template>
  <v-list-item two-line>
    <v-list-item-avatar size="32" color="primary" class="text-center">
      <img :src="user.pic" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
      <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if="showBtn">
      <template v-for="(type, i) in btnTypesComputed" >
        <v-btn 
          v-if="type === 'add-friend'"
          :key="i"
          icon
          @click="sendFriendRequest"
        >
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
        <v-btn 
          v-if="type === 'remove-friend'"
          :key="i"
          icon
          @click=""
        >
          <v-icon>mdi-account-minus</v-icon>
        </v-btn>
        <v-btn 
          v-if="type === 'accept-friend-request'"
          :key="i"
          icon
          @click=""
        >
          <v-icon>mdi-account-check</v-icon>
        </v-btn>
        <v-btn 
          v-if="type === 'reject-friend-request'"
          :key="i"
          icon
          @click=""
        >
          <v-icon>mdi-account-remove</v-icon>
        </v-btn>
        <v-btn 
          v-if="type === 'cancel-friend-request'"
          :key="i"
          icon
          @click="cancelFriendRequest"
        >
          <v-icon>mdi-account-remove</v-icon>
        </v-btn>
        <v-btn 
          v-if="type === 'request-sent'"
          :key="i"
          icon
          disabled
        >
          <v-icon>mdi-account-arrow-left</v-icon>
        </v-btn>
      </template>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
// TODO: show a remove friend btn if already friends with this user
import { mapState, mapActions } from 'vuex'
import { post, _delete } from '@/utils/utils'

export default {
  name: 'UserListItem',

  props: {
    user: { type: Object, required: true },
    btnTypes: { type: Array, default: [] },
    friendRequestId: { type: String, default: '' },
  },

  data() {
    return {
      BTN_TYPES: ['add-friend', 'remove-friend', 'accept-friend-request', 'reject-friend-request', 'cancel-friend-request', 'request-sent'],
    }
  },

  computed: {
    ...mapState([ 'authUser', 'friendRequests' ]),
    showBtn() {
      return this.user._id !== this.authUser._id
    },
    btnTypesComputed() {
      // replaces certain button types based on whether friend request has already been sent
      return this.btnTypes.map(type => {
        if (type === 'add-friend') {
          if (this.friendRequests.outgoing.find(req => req.to._id === this.user._id)) {
            return 'request-sent'
          }
        }
        return type
      }).flat()
    },
  },

  methods: {
    ...mapActions([ 'showError', 'showInfo' ]),
    sendFriendRequest() {
      post(`/friends/create-request`, { userId: this.user._id }).then(() => {
        this.showInfo('Friend request sent!')
      }).catch(err => {
        this.showError('There was a problem sending that friend request. Please try again later.')
      })
    },
    cancelFriendRequest() {
      _delete(`/friends/cancel-request`, { friendRequestId: this.friendRequestId }).then(() => {
        this.showInfo('Friend request cancelled!')
      }).catch(err => {
        this.showError('There was a problem cancelling that friend request. Please try again later.')
      })
    },
  },
}
</script>