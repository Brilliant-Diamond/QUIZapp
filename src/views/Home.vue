<template>
  <div id="app">
    <h2>このサイトの紹介</h2>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  name: "App",
  data() {
    return {}
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
  created() {},
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
