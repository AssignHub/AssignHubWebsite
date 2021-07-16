<template>
  <v-container fluid class="px-0 px-sm-4 fill-height gradient-background">
    <v-row justify="center" class="fill-height">
      <v-col cols="12" sm="auto" class="top-center">
        <v-card color="" class="px-16 pb-4 pt-10">
          <v-card-text class="text-center">
            <v-img src="@/assets/logo.png" width="300px" transition="scale-transition" contain class="mx-auto mb-10"></v-img>
            <ButtonWithImage 
              :src="require('@/assets/google_logo_white.svg')"
              text="Continue with Google"
              class="mb-2"
              dark
              color="#5D75BC"
              @click="signInGoogle"
            />
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

<script>
import ButtonWithImage from '@/components/ButtonWithImage'
import { mapActions } from 'vuex'

export default {
  name: 'SignIn',

  components: {
    ButtonWithImage
  },

  methods: {
    ...mapActions([ 'signInGoogle' ]),
  }
}
</script>