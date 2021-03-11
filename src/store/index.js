import Vue from "vue"
import Vuex from "vuex"
import firebase from "firebase"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    SignsInOrOut: false,
    // user: null,
  },
  mutations: {
    // setSigns2(state, sign) {
    //   state.user = sign
    // },
    setSigns(state, sign) {
      state.SignsInOrOut = sign
    },
  },
  actions: {
    // signin2(context) {
    //   context.commit("setSigns2", true)
    // },
    // signout2(context) {
    //   context.commit("setSigns2", false)
    // },
    signin(context) {
      context.commit("setSigns", true)
    },
    signout(context) {
      context.commit("setSigns", false)
    },
    ConfirmLoginState(context) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          context.dispatch("signin")
        } else {
          context.dispatch("signout")
        }
      })
    },
  },
  modules: {},
})

// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     store.dispatch("signin2")
//   } else {
//     store.dispatch("signout2")
//   }
// })
