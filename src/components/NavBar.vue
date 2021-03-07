<template>
  <div class="nav__bar">
    <router-link to="/" class="nav__logo nav__link">QUIZapp</router-link>
    <div class="nav__items">
      <router-link to="/signup" class="nav__item nav__link"
        >ユーザー登録</router-link
      >
      <router-link to="/signin" class="nav__item nav__link"
        >サインイン</router-link
      >
      <router-link to="/about" class="nav__item nav__link"
        >マイページ</router-link
      >
      <!-- <button class="nav__item nav__link" v-on:click="displayPost">投稿</button> -->
      <router-link to="/quizpost" class="nav__item nav__link">投稿</router-link>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    displayPost() {
      this.$emit("display-post")
    },
  },
}
</script>

<style scoped>
.nav__bar {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  background-color: black;
}
.nav__link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #eee;
  text-decoration: none;
}
.nav__link:visited {
  color: #eee;
}
.nav__link:hover {
  font-weight: bold;
  color: #fff;
}
.nav__logo {
  width: 130px;
}
.nav__items {
  display: flex;
}
.nav__item {
  width: 100px;
  border-left: 1px solid #eee;
}
button {
  background-color: black;
}
</style>
