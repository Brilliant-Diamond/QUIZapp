<template>
  <div>
    <NavBar :SignsInOrOut="SignsInOrOut" @signout="signOut" />
    <router-view @signin="signIn" />
  </div>
</template>

<script>
import firebase from "firebase"
import NavBar from "@/components/NavBar.vue"
export default {
  data() {
    return {
      SignsInOrOut: null,
    }
  },
  components: {
    NavBar,
  },
  methods: {
    signIn() {
      this.SignsInOrOut = true
    },
    signOut() {
      this.SignsInOrOut = false
    },
  },
  created() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // console.log("true")
        this.SignsInOrOut = true
        console.log(this.SignsInOrOut)
      } else {
        // console.log("false")
        this.SignsInOrOut = false
        console.log(this.SignsInOrOut)
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
