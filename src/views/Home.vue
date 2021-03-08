<template>
  <div id="app">
    <h1>Hello {{ name }}!!</h1>
    <button @click="signOut">Sign out</button>
  </div>
</template>

<script>
import firebase from "firebase"

export default {
  name: "App",
  data() {
    return {
      name: firebase.auth().currentUser.email,
    }
  },
  methods: {
    signOut: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/signin")
        })
    },
  },
}
</script>

<style>
#app {
  color: #2c3e50;
  margin: 30px;
  display: flex;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}
</style>
