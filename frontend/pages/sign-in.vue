<script setup lang="ts">import { useAuthUserStore } from '~~/stores/authUser';

  useHead({
    title: 'Sign in',
    script: [
      {
        src: 'https://accounts.google.com/gsi/client',
        body: true,
      },
    ],
  })

  onMounted(() => {
    initSignInBtn()
  })

  const authUser = useAuthUserStore()

  function initSignInBtn() {
    // TODO: bug where sign in button doesn't show if you sign in and then sign out?? maybe because it's 
    // already initialized and we try to initialize again

    if (!(window as any).google) {
      // Need to do this or else sign in button won't show on first load because google might not have been initialized yet
      setTimeout(initSignInBtn, 100)
      return
    }

    google.accounts.id.initialize({
      client_id: '844813140506-upjq868ckcms47783pmelqtgqs2s1ft4.apps.googleusercontent.com',
      callback: ({ credential }) => authUser.signInGoogle(credential),
    })
    // Create the google sign in button
    google.accounts.id.renderButton(
      document.getElementById('sign-in-btn'),
      {
        type: 'standard',
        theme: 'filled_blue',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
      }
    ) 
  }
</script>

<template>
  <v-container fluid class="px-0 px-sm-4 fill-height gradient-background">
    <v-row justify="center" class="fill-height">
      <v-col cols="12" sm="auto" class="top-center">
        <v-card color="" class="px-16 pb-4 pt-10">
          <v-card-text class="text-center">
            <img src="/img/logo.png" contain style="width: 300px;" class="mx-auto mb-10">
            <!-- <v-img src="/img/logo.png" width="300px" transition="scale-transition" contain class="mx-auto mb-10"></v-img> -->
            <div id="sign-in-btn" style="display: inline-block;"></div>
            <div class="text-caption">
              Make sure to use your school email address to sign in!
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.top-center {
  margin-top: 20vh;
}

.gradient-background {
  background: radial-gradient(#fff, #cfcfcf);
}
</style>

<!-- <script lang="ts">
export default {
  name: 'SignIn',

  mounted() {
    // Create the google sign in button
    google.accounts.id.renderButton(
      document.getElementById('sign-in-btn'),
      {
        type: 'standard',
        theme: 'filled_blue',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
      }
    )
  },

  methods: {
    signInGoogle() {

    },
  }
}
</script> -->