import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import SignIn from '@/views/SignIn'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn,
  }
]

const router = new VueRouter({
  mode: process.env.NODE_ENV === 'development' ? 'hash' : 'history',
  routes
})

export default router
