import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    SignsInOrOut: false,
  },
  mutations: {
    setSigns(state, sign) {
      state.SignsInOrOut = sign
    },
  },
})
