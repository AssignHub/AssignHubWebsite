import { defineStore } from 'pinia'
import { post, get } from '~~/utils'
import { User } from '~~/types'

export const useAuthUserStore = defineStore('authUser', {
  state: () => ({
    user: null as User,
    isNewUser: false as Boolean,
  }),
  actions: {
    async signInGoogle(credential: string) {
      try {
        const { isNewUser } = await post('/auth/sign-in', {
          credential,
          timezoneOffset: new Date().getTimezoneOffset()
        })
        this.isNewUser = isNewUser

        const authUser = await get('/auth/profile')
        this.user = authUser

        //socketReconnect()
      } catch (err) {
        if (err === 'email-not-allowed') {
          // showError('Could not sign in using that email address! Make sure you are using your school email address to sign in.')
        } else {
          // if (err === false) {
          //   setTimeout(() => , 100)
          // } else {
            // showError('There was an problem trying to sign in! Please try again later.')
          // }
        } 
      }
    },
    async signOut() {
      try {
        await post('/auth/sign-out')
        //socketReconnect()
        //resetState()
        this.user = null
        google.accounts.id.disableAutoSelect()
      } catch (err) {
        // showError('There was a problem trying to sign out! Please try again later')
      }
    },
  },
})