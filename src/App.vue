<template>
  <div>
    <NavBar />
    <router-view />
    <!-- <NavBar :SignsInOrOut="SignsInOrOut" @signout="signOut" />
    <router-view @signin="signIn" /> -->
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
      return this.$store.getters.SignsInOrOut
    },
  },
  components: {
    NavBar,
  },
  methods: {
    // signIn() {
    //   // this.SignsInOrOut = true
    //   this.$store.commit("setSigns", true)
    // },
    // signOut() {
    //   // this.SignsInOrOut = false
    //   this.$store.commit("setSigns", false)
    // },
  },
  created() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // console.log("true")
        // this.SignsInOrOut = true
        // console.log(this.SignsInOrOut)
        this.$store.commit("setSigns", true)
      } else {
        // console.log("false")
        // this.SignsInOrOut = false
        // console.log(this.SignsInOrOut)
        this.$store.commit("setSigns", false)
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
