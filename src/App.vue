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
    return {}
  },
  computed: {
    SignsInOrOut() {
      return this.$store.state.SignsInOrOut
    },
  },
  components: {
    NavBar,
  },
  methods: {},
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch("signin")
      } else {
        this.$store.dispatch("signout")
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
