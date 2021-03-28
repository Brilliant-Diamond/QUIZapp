<template>
  <div class="nav__bar">
    <router-link to="/" class="nav__logo nav__link"
      >Brilli<i class="far fa-gem fa-xs red"></i>nt<span style="color:#3DA9FC;"
        >Q</span
      >uiz</router-link
    >
    <div class="nav__items">
      <router-link to="/challengequiz" class="nav__item nav__link"
        >クイズに挑戦</router-link
      >
      <router-link to="/quizpost" class="nav__item nav__link">投稿</router-link>
      <div v-if="isSignedIn" class="nav__items">
        <button class="nav__item nav__link nav-btn" @click="signOut">
          サインアウト
        </button>
      </div>
      <div v-else class="nav__items">
        <router-link to="/signin" class="nav__item nav__link"
          >サインイン</router-link
        >
      </div>
      <router-link to="/mypage" class="nav__item nav__link"
        >マイページ</router-link
      >
    </div>
    <div class="menu-icon  nav__link">
      <i class="fas fa-bars" @click="displayMenuItems"></i>
    </div>
    <div
      class="menu-items-container"
      v-bind:class="{ hide: isMenuItemsHiding }"
    >
      <div class="menu-items">
        <i class="fas fa-times menu-item" @click="displayMenuItems"></i>
        <router-link to="/challengequiz" class="menu-item"
          >クイズに挑戦</router-link
        >
        <router-link to="/quizpost" class="menu-item">投稿</router-link>
        <div v-if="isSignedIn" class="menu-item">
          <button @click="signOut" class="menu-item menu-btn">
            サインアウト
          </button>
        </div>
        <div v-else class="menu-item">
          <router-link to="/signin" class="menu-item">サインイン</router-link>
        </div>
        <router-link to="/mypage" class="menu-item">マイページ</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {
      isMenuItemsHiding: true,
    }
  },
  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn
    },
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/signin")
        })
    },
    displayMenuItems() {
      if (this.isMenuItemsHiding) {
        this.isMenuItemsHiding = false
      } else {
        this.isMenuItemsHiding = true
      }
    },
  },
  created() {},
}
</script>

<style scoped>
body {
  margin: 0;
}
.nav__bar {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  background-color: #094067;
}
.nav__link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #fffffe;
  text-decoration: none;
}
.red {
  color: #ef4565;
}
.nav__link:visited {
  color: #fffffe;
}
.nav__link:hover {
  font-weight: bold;
  color: #3da9fc;
}
.nav__logo {
  width: 140px;
  font-family: "Cherry Swash", cursive;
  font-size: 20px;
  margin-left: 20px;
}
.nav__items {
  display: flex;
}
.nav__item {
  width: 110px;
  border-left: 1px solid #fffffe;
}
button {
  background-color: #094067;
}
.menu-icon {
  display: none;
  font-size: 20px;
  width: 100px;
}
.hide {
  display: none;
}
.menu-item {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  height: 100px;
  border-bottom: solid 1px white;
}
.fa-times {
  font-size: 20px;
}
.menu-item:visited {
  color: #fffffe;
}
.menu-item:hover {
  font-weight: bold;
  color: #3da9fc;
}
.menu-btn {
  border: none;
  font-size: 16px;
  cursor: pointer;
}
.nav-btn {
  border: none;
  border-left: 1px solid #fffffe;
  font-size: 16px;
  cursor: pointer;
}
@media all and (max-width: 670px) {
  .nav__items {
    display: none;
  }
  .menu-icon {
    display: flex;
  }
  .menu-items-container {
    position: absolute;
    /* width: 200px; */
  }
  .menu-items {
    position: fixed;
    top: 0;
    right: 0;
    width: 150px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #094067;
    -webkit-transition: 0.53s transform;
    transition: 0.53s transform;
    -webkit-transition-timing-function: cubic-bezier(0.38, 0.52, 0.23, 0.99);
    transition-timing-function: cubic-bezier(0.38, 0.52, 0.23, 0.99);
    z-index: 100;
  }
}
@media all and (min-width: 670px) {
  .menu-items-container {
    display: none;
  }
}
</style>
