<template>
  <PhoneWarning v-if="isPhone() && !dismissed" @dismiss="dismiss" />
  <v-container v-else fluid class="px-0 px-sm-4 fill-height gradient-background">
    <v-row justify="center" class="fill-height">
      <v-col cols="12" sm="auto" class="top-center">
        <v-card color="" class="px-16 pb-4 pt-10">
          <v-card-text class="text-center">
            <div class="tw-relative">
              <v-img src="@/assets/logo.png" width="300px" transition="scale-transition" contain class="mx-auto mb-10"></v-img>
              <v-chip 
                class="tw-absolute tw-bottom-4 -tw-right-4 tw-font-semibold"
                label
                color="primary"
              >BETA</v-chip>
            </div>
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

<script>
import ButtonWithImage from '@/components/ButtonWithImage'
import { mapActions } from 'vuex'
import { isPhone } from '@/utils'
import PhoneWarning from '../components/PhoneWarning.vue'

export default {
  name: 'SignIn',

  components: {
    ButtonWithImage,
    PhoneWarning
  },

  data() {
    return {
      dismissed: false,
    }
  },

  mounted() {
    this.loadSignInBtn()
  },

  methods: {
    ...mapActions([ 'signInGoogle' ]),
    isPhone() {
      return isPhone(this.$vuetify)
    },
    loadSignInBtn() {
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
    dismiss() {
      this.dismissed = true
      this.$nextTick(() => this.loadSignInBtn())
    },
  }
}
</script>