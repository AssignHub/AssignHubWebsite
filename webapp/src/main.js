import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

Vue.config.productionTip = false

// Google OAuth 2
import GAuth from 'vue-google-oauth2'
const gauthOptions = {
  clientId: '844813140506-upjq868ckcms47783pmelqtgqs2s1ft4.apps.googleusercontent.com',
  prompt: 'consent',
}
Vue.use(GAuth, gauthOptions)

// Socket.io
Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO('http://localhost:3000'),
  vuex: {
    store,
    mutationPrefix: 'SOCKET_',
  },
}))

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
