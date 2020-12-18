<template>
  <v-container fluid class="px-0 px-sm-4 fill-height gradient-background">
    <v-row justify="center" class="fill-height">
      <v-col cols="12" sm="auto" class="top-center">
        <v-img src="@/assets/logo.png" width="300px" contain class="mx-auto"></v-img>
        <v-card color="">
          <v-card-title>Sign In</v-card-title>
          <v-card-text class="text-center">
            <ButtonWithImage 
              :src="require('@/assets/google_logo.svg')"
              text="Continue with Google"
              class="mb-2"
              @click="signInGoogle"
            />
            <div class="text-caption">
              Make sure to use your USC email address to sign in!
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
  background: radial-gradient(#c7ddff, #5e9cff);
}
</style>

<script>
import ButtonWithImage from '@/components/ButtonWithImage'
import { signInGoogle } from '@/utils/utils' 

export default {
  name: 'SignIn',

  components: {
    ButtonWithImage
  },

  methods: {
    signInGoogle,
  }
}
</script>