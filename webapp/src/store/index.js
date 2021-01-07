import Vue from 'vue'
import Vuex from 'vuex'
import { get, post, patch, getCurTerm, socketReconnect } from '@/utils/utils'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    error: '',
    info: '',

    authUser: null,

    term: '',
    terms: [],
    assignments: [],
    publicAssignments: [],
    classes: [],

    emojis: [
      require('@/assets/crying.png'),
      require('@/assets/sad.png'),
      require('@/assets/tired.png'),
      require('@/assets/smiling.png'),
      require('@/assets/sunglasses.png'),
    ],
    friends: [
      {firstName: 'Jill', lastName: 'Smith', emojiIndex: 1},
      {firstName: 'Leonardo', lastName: 'DiCaprio', emojiIndex: 0},
      {firstName: 'Carol', lastName: 'Johnson', emojiIndex: 3},
      {firstName: 'Jacob', lastName: 'Chen', emojiIndex: 2},
      {firstName: 'Kevin', lastName: 'Hunter', emojiIndex: 4},
    ],
  }
}

export default new Vuex.Store({
  state: getDefaultState(),
  getters: {
    termClasses(state) {
      return state.classes.filter(c => c.term === state.term)
    },
    numPublicAssignments(state) {
      return state.publicAssignments.length
    } 
  },
  mutations: {
    resetState(state) {
      Object.assign(state, getDefaultState())
    },

    setError(state, error) {
      state.error = error
    },
    setInfo(state, info) {
      state.info = info
    },

    setAuthUser(state, authUser) {
      state.authUser = authUser
    },

    setTerms(state, terms) {
      state.terms = terms
    },
    setTerm(state, term) {
      state.term = term
    },
    setClasses(state, classes) {
      state.classes = classes
    },
    setAssignments(state, assignments) {
      state.assignments = assignments
    },
    toggleAssignment(state, assignmentId) {
      const index = state.assignments.findIndex(a => a._id === assignmentId)
      state.assignments[index].done = !state.assignments[index].done 
    },
    setPublicAssignments(state, publicAssignments) {
      state.publicAssignments = publicAssignments
    },
    addAssignmentFromPublic(state, assignmentId) {
      const index = state.publicAssignments.findIndex(a => a._id === assignmentId)
      const assignment = state.publicAssignments.splice(index, 1)[0]
      assignment.done = false
      state.assignments.push(assignment)
    },

    SOCKET_addAssignment(state, assignment) {
      state.assignments.push(assignment)
      //console.log('assignments UPDATED: ', state.assignments)
    },
    SOCKET_addClass(state, c) {
      state.classes.push(c)
    }, 
  },
  actions: {
    showError({ commit }, error) {
      commit('setError', '')
      setTimeout(() => commit('setError', error), 0)
    },
    showInfo({ commit }, info) {
      commit('setInfo', '')
      setTimeout(() => commit('setInfo', info), 0)
    },

    signInGoogle({ commit, dispatch }) {
      return Vue.gAuth.getAuthCode().then(authCode => {
        return post('/auth/sign-in', { authCode })
      }).then(() => {
        return get('/auth/profile')
      }).then(authUser => {
        socketReconnect()
        commit('setAuthUser', authUser)
      }).catch((err) => {
        dispatch('showError', 'There was an error trying to sign in! Please try again later.')
      })
    },
    signOut({ commit, dispatch }) {
      return post('/auth/sign-out').then(() => {
        socketReconnect()
        commit('resetState')
      }).catch((err) => {
        dispatch('showError', 'There was an error trying to sign out! Please try again later.')
      })
    },

    async changeTerm({ commit, dispatch }, term) {
      commit('setTerm', term)
      await Promise.all([ dispatch('getAssignments'), dispatch('getPublicAssignments') ])
    }, 
    async populateData({ dispatch }) {
      await Promise.all([ dispatch('getClasses'), dispatch('getTerms') ])
    },
    getTerms({ commit, dispatch }) {
      return get('/usc/terms').then(terms => {
        commit('setTerms', terms)
        return dispatch('changeTerm', getCurTerm())
      }).catch(err => {
        dispatch('showError', 'There was an error fetching your school\'s terms! Please try again later.')
      })
    },
    getClasses({ commit }) {
      return get(`/usc/my-classes`).then(classes => {
        commit('setClasses', classes)
      }).catch(err => {
        dispatch('showError', 'There was an error fetching your classes! Please try again later.')
      })
    },
    getAssignments({ state, commit }) {
      commit('setAssignments', [])
      return get(`/assignments/mine?term=${state.term}`).then(assignments => {
        commit('setAssignments', assignments)
      }).catch(err => {
        dispatch('showError', 'There was an error fetching your assignments! Please try again later.')
      })
    },
    getPublicAssignments({ state, commit }) {
      commit('setPublicAssignments', [])
      return get(`/assignments/public?term=${state.term}`).then(publicAssignments => {
        commit('setPublicAssignments', publicAssignments)
      }).catch(err => {
        dispatch('showError', 'There was an error fetching public assignments! Please try again later.')
      })
    },
    toggleAssignment({ commit }, assignmentId) {
      commit('toggleAssignment', assignmentId)
      return patch(`/assignments/${assignmentId}/toggle`).catch(err => {
        // Toggle back to original state if error
        commit('toggleAssignment', assignmentId)
      })
    },
    addAssignmentFromPublic({ state, commit }, assignmentId) {
      const origAssignments = [...state.assignments]
      const origPublicAssignments = [...state.publicAssignments]
      commit('addAssignmentFromPublic', assignmentId)
      return post('/assignments/add', { assignmentId }).catch(err => {
        // Revert back to original arrays if error
        commit('setAssignments', origAssignments)
        commit('setPublicAssignments', origPublicAssignments)
      })
    },
  },
  modules: {
  }
})
