import Vue from 'vue'
import Vuex from 'vuex'
import { get, post, patch, _delete, getCurTerm, socketReconnect } from '@/utils/utils'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    error: '',
    info: '',

    contextMenu: {
      show: false,
      type: -1,
      data: null,
      x: 0,
      y: 0,
    },

    authUser: null,

    term: '',
    terms: [],
    assignments: [],
    publicAssignments: [],
    classes: [],

    // Friends
    friends: [
      /*
      {"mood":"","_id":"5ffcebd22c510123949ba4f6","firstName":"Agnes","lastName":"McCarthy","email":"js@gmail.com","pic":"https://lh3.googleusercontent.com/a-/AOh14GhxBdUGuOzoLbuYEJnjWV-7I4g7L8B7jGy9Jdw=s96-c"},
      {"mood":"sad","_id":"5ffcebd22c510123949ba4f6","firstName":"Jake","lastName":"Chen","email":"jchen@gmail.com","pic":"https://lh3.googleusercontent.com/a-/AOh14GhxBdUGuOzoLbuYEJnjWV-7I4g7L8B7jGy9Jdw=s96-c"},
      {"mood":"tired","_id":"5ffcebd22c510123949ba4f6","firstName":"Mr.","lastName":"Mundy","email":"mundy@gmail.com","pic":"https://lh3.googleusercontent.com/a-/AOh14GhxBdUGuOzoLbuYEJnjWV-7I4g7L8B7jGy9Jdw=s96-c"},
      {"mood":"smiling","_id":"5ffcebd22c510123949ba4f6","firstName":"John","lastName":"Brook","email":"brookj@gmail.com","pic":"https://lh3.googleusercontent.com/a-/AOh14GhxBdUGuOzoLbuYEJnjWV-7I4g7L8B7jGy9Jdw=s96-c"},
      {"mood":"sunglasses","_id":"5ffcebd22c510123949ba4f6","firstName":"Susan","lastName":"Clifford","email":"scliff@gmail.com","pic":"https://lh3.googleusercontent.com/a-/AOh14GhxBdUGuOzoLbuYEJnjWV-7I4g7L8B7jGy9Jdw=s96-c"},
      {"mood":"sad","_id":"5ffcebd22c510123949ba4f6","firstName":"Agnes","lastName":"McCarthy","email":"mccag@gmail.com","pic":"https://lh3.googleusercontent.com/a-/AOh14GhxBdUGuOzoLbuYEJnjWV-7I4g7L8B7jGy9Jdw=s96-c"},
      */
    ],
    friendRequests: {
      incoming: [],
      outgoing: [],
    },
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

    showContextMenu(state, payload) {
      const { type, data, mouseEvent } = payload
      state.contextMenu.type = type
      state.contextMenu.data = data
      state.contextMenu.x = mouseEvent.clientX
      state.contextMenu.y = mouseEvent.clientY

      if (!state.contextMenu.show)
        state.contextMenu.show = true
    },
    hideContextMenu(state) {
      if (state.contextMenu.show)
        state.contextMenu.show = false
    },

    setAuthUser(state, authUser) {
      state.authUser = authUser
    },
    setMood(state, mood) {
      state.authUser.mood = mood
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
    insertAssignment(state, data) {
      const { index, assignment, isPublic } = data
      if (isPublic)
        state.publicAssignments.splice(index, 0, assignment)
      else
        state.assignments.splice(index, 0, assignment)
    },
    removeAssignment(state, data) {
      const { assignmentId, isPublic } = data
      const arr = isPublic ? state.publicAssignments : state.assignments
      const index = arr.findIndex(a => a._id === assignmentId)
      arr.splice(index, 1)
    },

    // Friends
    setFriends(state, friends) {
      state.friends = friends
    },
    setFriendRequests(state, friendRequests) {
      state.friendRequests = friendRequests
    },

    // Websockets
    SOCKET_addAssignment(state, assignment) {
      state.assignments.push(assignment)
    },
    SOCKET_removeAssignment(state, assignmentId) {
      state.assignments = state.assignments.filter(a => a._id !== assignmentId)
    },
    SOCKET_addClass(state, _class) {
      state.classes.push(_class)
    }, 
    SOCKET_removeClass(state, courseObjectId) {
      state.classes = state.classes.filter(c => c._id !== courseObjectId)
    },
    SOCKET_addFriendRequest(state, friendRequest) {
      if (friendRequest.type === 'outgoing') 
        state.friendRequests.outgoing.push(friendRequest.request)
      if (friendRequest.type === 'incoming') 
        state.friendRequests.incoming.push(friendRequest.request)
    },
    SOCKET_removeFriendRequest(state, friendRequestId) {
      state.friendRequests.outgoing = state.friendRequests.outgoing.filter(req => req._id !== friendRequestId)
      state.friendRequests.incoming = state.friendRequests.incoming.filter(req => req._id !== friendRequestId)
    },
    SOCKET_addFriend(state, user) {
      state.friends.push(user)
    },
    SOCKET_removeFriend(state, friendId) {
      state.friends = state.friends.filter(f => f._id !== friendId)
    },
    SOCKET_setFriendMood(state, data) {
      const { mood, friendId } = data
      state.friends.find(f => f._id === friendId).mood = mood
    },
  },
  actions: {
    // Error & info
    showError({ commit }, error) {
      commit('setError', '')
      setTimeout(() => commit('setError', error), 0)
    },
    showInfo({ commit }, info) {
      commit('setInfo', '')
      setTimeout(() => commit('setInfo', info), 0)
    },

    // Auth
    signInGoogle({ commit, dispatch }) {
      return Vue.gAuth.getAuthCode().then(authCode => {
        return post('/auth/sign-in', { authCode, timezoneOffset: new Date().getTimezoneOffset() })
      }).then(() => {
        return get(`/auth/profile`)
      }).then(authUser => {
        socketReconnect()
        commit('setAuthUser', authUser)
      }).catch((err) => {
        dispatch('showError', 'There was an problem trying to sign in! Please try again later.')
      })
    },
    signOut({ commit, dispatch }) {
      return post('/auth/sign-out').then(() => {
        socketReconnect()
        commit('resetState')
      }).catch((err) => {
        dispatch('showError', 'There was an problem trying to sign out! Please try again later.')
      })
    },

    // Mood
    changeMood({ state, commit, dispatch }, mood) {
      const oldMood = state.authUser.mood
      commit('setMood', mood)
      return patch('/general/mood', { mood }).catch(err => {
        commit('setMood', oldMood)
        dispatch('showError', 'There was a problem changing your mood! Please try again later.')
      })
    },

    // Populate data
    async populateData({ dispatch }) {
      await Promise.all([ dispatch('getClasses'), dispatch('getTerms'), dispatch('getFriends'), dispatch('getFriendRequests') ])
    },

    // Terms
    async changeTerm({ commit, dispatch }, term) {
      commit('setTerm', term)
      await Promise.all([ dispatch('getAssignments'), dispatch('getPublicAssignments') ])
    }, 
    getTerms({ commit, dispatch }) {
      return get('/usc/terms').then(terms => {
        commit('setTerms', terms)
        return dispatch('changeTerm', getCurTerm())
      }).catch(err => {
        dispatch('showError', 'There was an problem fetching your school\'s terms!')
      })
    },

    // Classes
    getClasses({ commit, dispatch }) {
      return get(`/usc/my-classes`).then(classes => {
        commit('setClasses', classes)
      }).catch(err => {
        dispatch('showError', 'There was an problem fetching your classes!')
      })
    },

    // Assignments
    getAssignments({ state, commit, dispatch }) {
      commit('setAssignments', [])
      return get(`/assignments/mine?term=${state.term}`).then(assignments => {
        commit('setAssignments', assignments)
      }).catch(err => {
        dispatch('showError', 'There was an problem fetching your assignments!')
      })
    },
    getPublicAssignments({ state, commit, dispatch }) {
      commit('setPublicAssignments', [])
      return get(`/assignments/public?term=${state.term}`).then(publicAssignments => {
        commit('setPublicAssignments', publicAssignments)
      }).catch(err => {
        dispatch('showError', 'There was an problem fetching public assignments!')
      })
    },
    toggleAssignment({ commit, dispatch }, assignmentId) {
      commit('toggleAssignment', assignmentId)
      return patch(`/assignments/${assignmentId}/toggle`).catch(err => {
        // Toggle back to original state if error
        commit('toggleAssignment', assignmentId)
        dispatch('showError', 'There was an problem toggling that assignment! Please try again later.')
      })
    },
    addAssignmentFromPublic({ state, commit, dispatch }, assignmentId) {
      const origIndex = state.publicAssignments.findIndex(a => a._id === assignmentId)
      const origAssignment = state.publicAssignments[origIndex]
      commit('addAssignmentFromPublic', assignmentId)
      return post('/assignments/add', { assignmentId }).catch(err => {
        // Revert back to original arrays if error
        commit('removeAssignment', { assignmentId, isPublic: false })
        commit('insertAssignment', { index: origIndex, assignment: origAssignment, isPublic: true })
        dispatch('showError', 'There was an problem adding that assignment! Please try again later.')
      })
    },
    hidePublicAssignment({ state, commit, dispatch }, assignmentId) {
      const origIndex = state.publicAssignments.findIndex(a => a._id === assignmentId)
      const origAssignment = state.publicAssignments[origIndex]
      commit('removeAssignment', { assignmentId, isPublic: true })
      return post(`/assignments/public/${assignmentId}/hide`).catch(err => {
        commit('insertAssignment', { index: origIndex, assignment: origAssignment, isPublic: true }) // TODO: implement
        dispatch('showError', 'There was an problem hiding that assignment! Please try again later.')
      })
    },

    // Friends
    getFriends({ commit, dispatch }) {
      return get('/friends/mine').then(friends => {
        commit('setFriends', friends)
      }).catch(err => {
        dispatch('showError', 'There was a problem fetching your friends!')
      })
    },
    getFriendRequests({ commit, dispatch }) {
      return get('/friends/requests').then(requests => {
        commit('setFriendRequests', requests)
      }).catch(err => {
        dispatch('showError', 'There was a problem fetching your friend requests!')
      })
    }, 
  },
  modules: {
  }
})
