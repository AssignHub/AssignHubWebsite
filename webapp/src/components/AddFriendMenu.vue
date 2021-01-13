<template>
  <v-menu
    transition="slide-x-transition"
    top
    right
    offset-x
    :close-on-content-click="false"
    :close-on-click="false"
    v-model="menu"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        block
        class="add-btn grey lighten-2"
        v-bind="attrs"
        v-on="on"
      >+ Add Friend</v-btn>
    </template>
    <v-card color="grey lighten-3" style="width:300px;">
      <v-card-text class="">
        <v-text-field 
          v-model="query"
          label="Search (name, email)"
          solo
          dense
          class="mb-2"
          prepend-inner-icon="mdi-magnify"
          autocomplete="off"
          hide-details
          @keydown.enter="search"
        ></v-text-field>
        <div class="d-flex">
          <v-spacer />
          <v-btn text class="mr-2" @click="menu = false">Close</v-btn>
          <v-btn color="primary" :disabled="!query" :loading="loading" @click="search">Search</v-btn>
        </div>
      </v-card-text>
      <v-list v-if="filteredResults.length > 0" class="overflow-y-auto" style="height: 200px">
        <UserListItem
          v-for="user in filteredResults"
          :key="user._id"
          :user="user"
          showAddFriendBtn
        />
        <v-list-item v-for="n in 12" :key="n">
          wat
        </v-list-item>
      </v-list>
      <div v-else class="text-center pa-4" style="height: 200px; background-color: white;">
        No users found.
      </div>
    </v-card>
  </v-menu>
</template>

<style scoped>
  .add-btn {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>

<script>
import UserListItem from '@/components/UserListItem'
import { get } from '@/utils/utils'
import { mapState } from 'vuex'

export default {
  name: 'AddFriendMenu',

  components: {
    UserListItem,
  },

  watch: {
    menu() {
      if (!this.menu) this.reset()
    },
  },

  data() {
    return {
      menu: false,
      query: '',
      results: [],
      loading: false,
    }
  },

  computed: {
    ...mapState([ 'authUser' ]),
    filteredResults() {
      // Filter out current user and existing friends
      return this.results.filter(user => {
        return user._id !== this.authUser._id // && notinfriendslist
      })
    },
  },

  methods: {
    search() {
      this.loading = true
      get(`/friends/search?query=${this.query}`).then(results => {
        this.loading = false
        this.results = results
      })
    },
    reset() {
      this.query = ''
      this.results = []
    },
  },
}
</script>