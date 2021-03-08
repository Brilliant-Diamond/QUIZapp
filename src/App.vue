<template>
  <div>
    <NavBar v-on:display-post="displayPost" />
    <router-view />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue"
export default {
  data() {
    return {
      isPostHiding: true,
    }
  },
  components: {
    NavBar,
  },
  methods: {
    displayPost() {
      this.isPostHiding = false
    },
    hidePost() {
      this.isPostHiding = true
    },
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
