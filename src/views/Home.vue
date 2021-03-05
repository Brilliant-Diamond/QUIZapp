<template>
  <div id="app">
    <div class="container">
      <Quiz
        v-for="(quiz, index) in quizs"
        v-bind:key="index"
        v-bind:quiz="quiz"
      />
    </div>
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  flex-wrap: wrap;
}
.container {
  padding: 10px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}
.choice-input {
  margin: 10px;
}
</style>
