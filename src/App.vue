<template>
  <div>
    <NavBar v-on:display-post="displayPost" />
    <div v-if="currentUser !== null">{{ currentUser.email }}</div>
    <router-view />
    <div v-bind:class="{ hide: isPostHiding }">
      <quiz-post v-on:hide-post="hidePost" />
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue"
import QuizPost from "@/components/QuizPost.vue"
import firebase from "firebase"

export default {
  data() {
    return {
      isPostHiding: true,
      currentUser: firebase.auth().currentUser,
    }
  },
  components: {
    NavBar,
    QuizPost,
  },
  methods: {
    displayPost() {
      this.isPostHiding = false
    },
    hidePost() {
      this.isPostHiding = true
    },
  },
  watch: {
    // 算出 getter 関数
    returnCurrentUser: function() {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          this.currentUser = user
        } else {
          // No user is signed in.
        }
      })
      // `this` は vm インスタンスを指します
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
.hide {
  display: none;
}
</style>
