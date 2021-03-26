<template>
  <div class="big-container">
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
  /* font-family: Arial, Helvetica, sans-serif; */
  font-family: "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro",
    "Yu Gothic Medium", "游ゴシック Medium", YuGothic, "游ゴシック体",
    "メイリオ", sans-serif;
}
body {
  margin: 0;
}
.hide {
  display: none;
}
.big-container {
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
