<template>
  <v-app v-if="loaded">
    <AutoSnackbar color="error" :text="error" />
    <AutoSnackbar color="info" :text="info" />

    <v-app-bar
      v-if="authUser"
      app
      color="white darken-2"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn 
        color="primary"
        class="mr-4"
        text
        target="_blank"
        href="https://forms.gle/g5FqXuCHBEFXsvHu6"
      >
        Give Feedback
      </v-btn>

      <v-menu
        v-if="authUser"
        offset-y
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-avatar>
              <UserAvatarContent :user="authUser" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="py-0">
          <v-list-item>
            <v-list-item-title><strong>{{ `${authUser.firstName} ${authUser.lastName}` }}</strong></v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="signOut">
            <v-list-item-title class="red--text">Sign Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main style="height: 0vh;">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html {
  overflow-y: auto !important;
  
}

.inner-shadow {
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.25) !important;
}

/* Scrollbar stuff */
* {
  scrollbar-width: thin;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1; 
}

::-webkit-scrollbar-thumb {
  background: #CCC; 
}

::-webkit-scrollbar-thumb:hover {
  background: #888; 
}

.scrollbar-hidden {
  overflow-y: scroll;
  scrollbar-color: white white;
}

.scrollbar-hidden::-webkit-scrollbar {
  visibility: hidden !important;
}

.scrollbar-hidden::-webkit-scrollbar-track {
  visibility: hidden !important;
}
</style>

<script>
import { get, post, signOut } from '@/utils/utils'
import { mapState, mapActions } from 'vuex'

import AutoSnackbar from '@/components/AutoSnackbar'
import UserAvatarContent from '@/components/UserAvatarContent'

export default {
  name: 'App',

  components: {
    AutoSnackbar,
    UserAvatarContent,
  },

  async created() {
    // TODO: move this to vuex
    await get(`/auth/profile`).then(authUser => {
      this.$store.commit('setAuthUser', authUser)
    }).catch(err => {
      // Forbidden, user not signed in
      this.$store.commit('setAuthUser', null)
    })
    
    this.loaded = true
  },

  watch: {
    authUser: {
      immediate: true,
      handler() {
        this.redirectAuthUser()
      }
    },
    $route: {
      immediate: true,
      handler() {
        this.redirectAuthUser()
      }
    },
  },

  data() {
    return {
      loaded: false,
    }
  },

  computed: {
    ...mapState(['authUser', 'error', 'info'])
  },

  methods: {
    ...mapActions([ 'signOut' ]),
    redirectAuthUser() {
      let authRoutes = ['Home']
      let noAuthRoutes = ['SignIn']

      if (!this.authUser) {
        if (authRoutes.includes(this.$route.name))
          this.$router.replace({ name: 'SignIn' })
      } else {
        if (noAuthRoutes.includes(this.$route.name))
          this.$router.replace({ name: 'Home' })
      }
    },
  },
}
</script>
