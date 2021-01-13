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
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            icon
            v-bind="attrs"
            v-on="on"
            @click="addFriend(user._id)"
          >
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <span>Add friend</span>
      </v-tooltip>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
// TODO: show a remove friend btn if already friends with this user
import { mapState, mapActions } from 'vuex'

export default {
  name: 'UserListItem',

  props: {
    user: { type: Object, required: true },
    showAddFriendBtn: { type: Boolean, default: false },
  },

  computed: {
    ...mapState([ 'authUser' ]),
    showBtn() {
      return this.showAddFriendBtn && this.user._id !== this.authUser._id
    },
  },

  methods: {
    ...mapActions([ 'addFriend' ]),
  },
}
</script>