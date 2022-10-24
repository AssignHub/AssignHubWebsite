import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import { socketURL, handleCredentialResponse } from '@/utils'
import VDragged from 'v-dragged'
import 'intro.js/introjs.css';
import './assets/tailwind.css'
import wb from "./registerServiceWorker";
Vue.prototype.$workbox = wb;

Vue.config.productionTip = false

// Google sign in
google.accounts.id.initialize({
  client_id: '844813140506-upjq868ckcms47783pmelqtgqs2s1ft4.apps.googleusercontent.com',
  callback: handleCredentialResponse,
})

// Socket.io
export const socket = SocketIO(socketURL, { path: '/sockets', withCredentials: true })

Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV === 'development',
  connection: socket,
  vuex: {
    store,
    mutationPrefix: 'SOCKET_',
  },
}))

// VDragged
Vue.use(VDragged)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
