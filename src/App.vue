<template>
  <div>
    <NavBar v-on:display-post="displayPost" />
    <router-view />
    <!-- <div v-bind:class="{ hide: isPostHiding }">
      <quiz-post v-on:hide-post="hidePost" />
    </div> -->
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue"
// import QuizPost from "@/components/QuizPost.vue"

export default {
  data() {
    return {
      isPostHiding: true,
    }
  },
  components: {
    NavBar,
    // QuizPost,
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
