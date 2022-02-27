<template>
  <v-list-item 
    two-line
    v-on="_vOn"
    v-bind="{ ...$attrs }"
  >
    <v-list-item-avatar size="32" color="primary" class="text-center">
      <img referrerpolicy="no-referrer" width="32px" cover :src="user.pic" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
      <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if="showBtn" style="flex-direction: row;">
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
          v-if="type === 'accept-friend-request'"
          :key="i"
          icon
          @click="acceptFriendRequest"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn 
          v-if="type === 'reject-friend-request'"
          :key="i"
          icon
          @click="rejectFriendRequest"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn 
          v-if="type === 'cancel-friend-request'"
          :key="i"
          icon
          @click="cancelFriendRequest"
        >
          <v-icon>mdi-account-cancel</v-icon>
        </v-btn>
        <v-btn 
          v-if="type === 'request-sent'"
          :key="i"
          icon
          disabled
        >
          <v-icon>mdi-account-arrow-left</v-icon>
        </v-btn>
        <v-btn 
          v-if="type === 'already-friend'"
          :key="i"
          icon
          disabled
        >
          <v-icon>mdi-account-check</v-icon>
        </v-btn>
      </template>
    </v-list-item-action>
    <v-list-item-action v-else-if="user.mood">
      <v-img :src="EMOJIS[user.mood]" width="30px" contain />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
// TODO: show a remove friend btn if already friends with this user
import { mapState, mapMutations, mapActions } from 'vuex'
import { post, _delete } from '@/utils'
import { EMOJIS, CONTEXT_MENU_TYPES } from '@/constants'

export default {
  name: 'UserListItem',

  props: {
    user: { type: Object, required: true },
    btnTypes: { type: Array, default: () => [] },
    friendRequestId: { type: String, default: '' },
    removeFriendMenu: { type: Boolean, default: false },
  },

  data() {
    return {
      EMOJIS,
      BTN_TYPES: ['add-friend', 'remove-friend', 'accept-friend-request', 'reject-friend-request', 'cancel-friend-request', 'request-sent'],
    }
  },

  computed: {
    ...mapState([ 'authUser', 'friendRequests', 'friends' ]),
    showBtn() {
      return this.btnTypes.length > 0 && this.user._id !== this.authUser._id
    },
    btnTypesComputed() {
      // replaces certain button types based on whether friend request has already been sent
      return this.btnTypes.map(type => {
        if (type === 'add-friend') {
          if (this.friendRequests.outgoing.find(req => req.to && req.to._id === this.user._id)) {
            return 'request-sent'
          } else if (this.friends.find(f => f._id === this.user._id)) {
            return 'already-friend'
          }
        }
        return type
      }).flat()
    },
    _vOn() {
      if (!this.removeFriendMenu) return {}
      return {
        click: (e) => {this.$emit('click', e)},
        mousedown: (e) => {if (e.which === 3) this.hideContextMenu()},
        contextmenu: (e) => this.showRemoveFriendMenu(e),
      }
    },
  },

  methods: {
    ...mapMutations([ 'showContextMenu', 'hideContextMenu' ]),
    ...mapActions([ 'showError', 'showInfo' ]),
    sendFriendRequest() {
      post(`/friends/create-request`, { userId: this.user._id }).then(() => {
        //this.showInfo('Friend request sent!')
      }).catch(err => {
        this.showError('There was a problem sending that friend request. Please try again later.')
      })
    },
    cancelFriendRequest() {
      _delete(`/friends/cancel-request`, { friendRequestId: this.friendRequestId }).then(() => {
        //this.showInfo('Friend request cancelled!')
      }).catch(err => {
        this.showError('There was a problem cancelling that friend request. Please try again later.')
      })
    },
    acceptFriendRequest() {
      post('/friends/accept-request', { friendRequestId: this.friendRequestId }).then(() => {
        //this.showInfo('Friend request accepted!')
      }).catch(err => {
        this.showError('There was a problem accepting that friend request. Please try again later.')
      })
    },
    rejectFriendRequest() {
      _delete('/friends/reject-request', { friendRequestId: this.friendRequestId }).then(() => {
        //this.showInfo('Friend request rejected!')
      }).catch(err => {
        this.showError('There was a problem rejecting that friend request. Please try again later.')
      })
    },
    showRemoveFriendMenu(e) {
      e.preventDefault()
      this.showContextMenu({
        type: CONTEXT_MENU_TYPES.removeFriend,
        data: { friendId: this.user._id },
        mouseEvent: e,
      })
    }
  },
}
</script>