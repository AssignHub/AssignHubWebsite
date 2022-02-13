<template>
  <v-app v-if="loaded">
    <AutoSnackbar color="error" :text="error" />
    <AutoSnackbar color="info" :text="info" />

    <!--<v-app-bar
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
    </v-app-bar>-->

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

.text-unselectable {
  -webkit-user-select: none; /* Safari */        
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
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
import { get, } from '@/utils'
import { mapState, mapMutations } from 'vuex'

import AutoSnackbar from '@/components/AutoSnackbar'

export default {
  name: 'App',

  components: {
    AutoSnackbar,
  },

  async created() {

    // TODO: move this to vuex
    await get(`/auth/profile`).then(authUser => {
      this.setAuthUser(authUser)
    }).catch(err => {
      // Forbidden, user not signed in
      this.setAuthUser(null)
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
    ...mapMutations([ 'setAuthUser' ]),
    redirectAuthUser() {
      let authRoutes = ['Home']
      let noAuthRoutes = ['SignIn']

      if (!this.authUser) {
        if (this.$route.name == 'Join') {
          this.$router.replace({ name: 'SignIn', query: { join: this.$route.params.id } })
        } else if (authRoutes.includes(this.$route.name))
            this.$router.replace({ name: 'SignIn' })
      } else {
        if (this.$route.query.join) {
          this.$router.replace({ path: `join/${this.$route.query.join}` })
        } else if (noAuthRoutes.includes(this.$route.name))
          this.$router.replace({ name: 'Home' })
      }
    },
  },
}
</script>
