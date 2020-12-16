import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// Google OAuth 2
import GAuth from 'vue-google-oauth2'
const gauthOptions = {
  clientId: '844813140506-upjq868ckcms47783pmelqtgqs2s1ft4.apps.googleusercontent.com',
  prompt: 'consent',
}
Vue.use(GAuth, gauthOptions)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
