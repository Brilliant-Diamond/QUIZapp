<template>
  <div id="app">
    <Quiz
      v-for="(quiz, index) in quizs"
      v-bind:key="index"
      v-bind:quiz="quiz"
    />
  </div>
</template>

<script>
import Quiz from "@/components/Quiz.vue"
import firebase from "firebase"

export default {
  name: "App",
  components: {
    Quiz,
  },
  data() {
    return {
      quizs: [],
      unsubscribe: null,
    }
  },
  methods: {},
  created() {
    const ref = firebase
      .firestore()
      .collection("quizs")
      .orderBy("createdAt")

    this.unsubscribe = ref.onSnapshot((snapshot) => {
      let quizs = []
      snapshot.forEach((doc) => {
        quizs.push(doc.data())
      })
      this.quizs = quizs
    })
  },
}
</script>

<style>
#app {
  color: #2c3e50;
  margin: 30px;
  display: flex;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}
</style>
