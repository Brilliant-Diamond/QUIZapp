<template>
  <div>
    <NavBar />
    <router-view />
  </div>
</template>

<script>
// import firebase from "firebase"
import NavBar from "@/components/NavBar.vue"
export default {
  data() {
    return {}
  },
  computed: {},
  components: {
    NavBar,
  },
  methods: {},
  created() {},
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
