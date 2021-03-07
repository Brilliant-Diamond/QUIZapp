<template>
  <div>
    <h4>{{ collection.title }}</h4>
    <Quiz
      v-for="(quiz, index) in collection.quizs"
      v-bind:key="index"
      v-bind:quiz="quiz"
    />
  </div>
</template>

<script>
import Quiz from "@/components/Quiz.vue"
export default {
  components: {
    Quiz,
  },
  data() {
    return {}
  },
  props: {
    collection: {
      type: Object,
      require: true,
    },
  },
}
</script>

<style scoped></style>
