import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authUser: null,
  },
  mutations: {
    setAuthUser(state, authUser) {
      state.authUser = authUser
    }
  },
  actions: {
  },
  modules: {
  }
})
