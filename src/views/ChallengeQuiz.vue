<template>
  <div id="app">
    <quiz
      v-for="(quiz, index) in quizs"
      v-bind:key="index"
      v-bind:quiz="quiz"
    />
    <!-- ↑ここは何であるの？ -->
    <collection
      v-for="(collection, index) in collections"
      v-bind:key="index"
      v-bind:collection="collection"
    />
  </div>
</template>

<script>
import Quiz from "@/components/Quiz.vue"
import Collection from "@/components/Collection.vue"
import firebase from "firebase"

export default {
  components: {
    Quiz,
    Collection,
  },
  data() {
    return {
      collections: [],
      quizs: [],
      unsubscribe1: null,
      unsubscribe2: null,
    }
  },
  methods: {
    signOut: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/signin")
        })
    },
  },
  created() {
    const ref1 = firebase //ここはなぜ?
      .firestore()
      .collection("quizs")
      .orderBy("createdAt")

    this.unsubscribe1 = ref1.onSnapshot((snapshot) => {
      let quizs = []
      snapshot.forEach((doc) => {
        quizs.push(doc.data())
      })
      this.quizs = quizs
    })

    const ref2 = firebase
      .firestore()
      .collection("collections")
      .orderBy("createdAt")

    this.unsubscribe2 = ref2.onSnapshot((snapshot) => {
      let collections = []
      snapshot.forEach((doc) => {
        collections.push(doc.data())
        // for (let i = 0; i < doc.data().tag.length; i++) {
        //   if (doc.data().tag[i].text === "pokemon") {
        //     collections.push(doc.data())
        //   }
        // } 検索はこんな感じかな、効率悪いか
      })
      this.collections = collections
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
