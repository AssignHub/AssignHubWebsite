import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import pinia from '@/plugins/pinia'
import { loadFonts } from '@/plugins/webfontloader'
import '@/index.css'

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .mount('#app')
