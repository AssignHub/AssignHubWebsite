<template>
  <v-app v-if="loaded">
    <v-app-bar
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

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html {
  overflow-y: auto !important;
}
</style>

<script>
import { get } from '@/utils/utils'
import { mapState } from 'vuex'
import UserAvatarContent from '@/components/UserAvatarContent'

export default {
  name: 'App',

  components: {
    UserAvatarContent
  },

  async created() {
    await get('/auth/profile').then(authUser => {
      this.$store.commit('setAuthUser', authUser)
    }).catch(err => {
      // Forbidden, user not signed in
      console.log(err)
      this.$store.commit('setAuthUser', null)
    })
    
    this.loaded = true
  },

  watch: {
    authUser: {
      immediate: false,
      handler() {
        this.redirectAuthUser()
      }
    },
    $route: {
      immediate: false,
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
    ...mapState(['authUser'])
  },

  methods: {
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
    signOut() {
      // TODO: implement
    },
  },
}
</script>
