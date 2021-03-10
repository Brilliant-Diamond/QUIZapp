<template>
  <div>
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import firebase from "firebase"
import NavBar from "@/components/NavBar.vue"
export default {
  data() {
    return {
      // SignsInOrOut: null,
    }
  },
  computed: {
    SignsInOrOut() {
      return this.$store.state.SignsInOrOut
    },
  },
  components: {
    NavBar,
  },
  methods: {
    signin() {
      this.$store.dispatch("signin")
    },
    signout() {
      this.$store.dispatch("signout")
    },
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.signin()
      } else {
        this.signout()
      }
    })
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
