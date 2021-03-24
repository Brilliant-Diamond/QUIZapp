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
  color: #2c3e50;
  box-sizing: border-box;
  background-color: #fffffe;
}
body {
  margin: 0;
}
.hide {
  display: none;
}
</style>
