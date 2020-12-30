import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authUser: null,
    assignments: [],
  },
  mutations: {
    setAuthUser(state, authUser) {
      state.authUser = authUser
    },
    SOCKET_addAssignment(state, assignment) {
      state.assignments.push(assignment)
      console.log('assignments UPDATED: ', state.assignments)
    },
  },
  actions: {
  },
  modules: {
  }
})
