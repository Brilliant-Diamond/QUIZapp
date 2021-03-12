import Vue from "vue"
import Vuex from "vuex"
import firebase from "firebase"

Vue.use(Vuex)

const state = {
  // user のプロパティ・メソッド一覧
  // https://firebase.google.com/docs/reference/js/firebase.User
  user: null, // Authentication がもっているユーザー情報
  // user: {
  //   uid,
  //   ...
  // }
  userProfile: null, // Firestore がもっているユーザー情報
  // userProfile: {
  //   id, // user.uid と一緒
  //   name,
  //   email,
  //   intro_text,
  //   ...
  // }
}

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setUserProfile(state, userProfile) {
    state.userProfile = userProfile
  },
}

const actions = {
  // ログイン状態が変化するときに呼び出す
  setUserAndProfile({ commit }, { user, userProfile }) {
    commit("setUser", user)
    commit("setUserProfile", userProfile)
  },
  // ユーザーの情報を更新するときに呼び出す
  updateUserProfile({ state, commit }, userProfileDiff) {
    // Diff = Difference
    const userProfile = {
      ...state.userProfile,
      ...userProfileDiff,
    }
    if (state.user) {
      return firebase
        .firestore()
        .collection("user_profiles")
        .doc(state.user.uid)
        .set(userProfile)
        .then(() => {
          commit("setUserProfile", userProfile)
        })
    }
  },
}

const getters = {
  user(state) {
    return {
      ...state.user,
      ...state.userProfile, // たとえば state.user.photoURL を state.userProfile.photoURL で上書きできる
    }
  },
  userName(state, getters) {
    return getters.user.name || getters.user.email || "ゲスト"
  },
  userIntroText(state, getters) {
    return getters.user.introduce_text
  },
  isSignedIn(state) {
    return !!state.user
  },
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})
export default store

// user のログイン状態が変化したら、store を更新
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const userProfileRef = firebase
      .firestore()
      .collection("user_profiles")
      .doc(user.uid)
    userProfileRef.get().then((doc) => {
      let userProfile = {
        id: user.uid,
        email: user.email,
        introduce_text: "自己紹介を書こう！",
      }
      if (doc.exists) {
        // doc.data() でドキュメントの内容（フィールドの一覧）をとりだせる
        // id は doc.id でとりだして、 userProfile にくっつける
        userProfile = doc.data()
        userProfile.id = doc.id
      } else {
        // はじめてのログインなので、 userProfile を firestore に保存
        userProfileRef.set(userProfile)
      }
      store.dispatch("setUserAndProfile", {
        user,
        userProfile,
      })
    })
  } else {
    store.dispatch("setUserAndProfile", { user: null, userProfile: null })
  }
})
