<template>
  <div class="collection-container">
    <h4>{{ collection.title }}</h4>
    <quiz
      v-for="(quiz, index) in collection.quizs"
      v-bind:key="index"
      v-bind:quiz="quiz"
      v-bind:quizIndex="index"
      v-bind:class="{ hide: isQuizHiding }"
    ></quiz>
    <button v-if="isQuizHiding" v-on:click="displayQuiz">問題を解く</button>
    <button v-else v-on:click="hideQuiz">閉じる</button>
  </div>
</template>

<script>
import Quiz from "@/components/Quiz.vue"
export default {
  components: {
    Quiz,
  },
  data() {
    return {
      isQuizHiding: true,
    }
  },
  props: {
    collection: {
      type: Object,
      require: true,
    },
  },
  methods: {
    displayQuiz() {
      this.isQuizHiding = false
    },
    hideQuiz() {
      this.isQuizHiding = true
    },
  },
}
</script>

<style scoped>
.collection-container {
  display: flex;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 800px;
  border: solid 1px;
  border-radius: 10px;
  margin: 10px;
}
.hide {
  display: none;
}
</style>
