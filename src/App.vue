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
      SignsInOrOut: false,
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
    if (firebase.auth().currentUser) {
      this.SignsInOrOut = true
    } else {
      this.SignsInOrOut = false
    }
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
