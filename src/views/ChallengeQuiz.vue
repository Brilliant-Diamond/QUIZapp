<template>
  <div id="app">
    <div class="category-search">
      <div class="category-search-box">
        <input
          type="checkbox"
          name="category"
          value="食べ物"
          v-model="chosen_categoryBox"
        />食べ物
        <input
          type="checkbox"
          name="category"
          value="動物"
          v-model="chosen_categoryBox"
        />動物
        <input
          type="checkbox"
          name="category"
          value="ゲーム"
          v-model="chosen_categoryBox"
        />ゲーム
        <input
          type="checkbox"
          name="category"
          value="アニメ"
          v-model="chosen_categoryBox"
        />アニメ
        <input
          type="checkbox"
          name="category"
          value="アイドル"
          v-model="chosen_categoryBox"
        />アイドル
        <!-- <input type="checkbox" name="category" value="" />
        <input type="checkbox" name="category" value="" />
        <input type="checkbox" name="category" value="" />
        <input type="checkbox" name="category" value="" />
        <input type="checkbox" name="category" value="" />
        <input type="checkbox" name="category" value="" /> -->
      </div>

      <button class="search" @click="Search">
        検索
      </button>
    </div>

    <!-- <quiz
      v-for="(quiz, index) in quizs"
      v-bind:key="index"
      v-bind:quiz="quiz"
    />
    ↑のちのち -->
    <collection
      v-for="(collection, index) in collections"
      v-bind:key="index"
      v-bind:collection="collection"
      v-bind:collectionId="collectionIds[index]"
    />
  </div>
</template>

<script>
// import Quiz from "@/components/Quiz.vue"
import Collection from "@/components/Collection.vue"
import firebase from "firebase"

export default {
  components: {
    // Quiz,
    Collection,
  },
  data() {
    return {
      chosen_categoryBox: ["ゲーム"],
      collections: [],
      collectionIds: [],
      quizs: [],
      unsubscribe1: null,
      unsubscribe2: null,
    }
  },
  methods: {
    // 要らないよね？
    // signOut: function() {
    //   firebase
    //     .auth()
    //     .signOut()
    //     .then(() => {
    //       this.$router.push("/signin")
    //     })
    // },
    Search() {
      const ref2 = firebase
        .firestore()
        .collection("collections")
        .orderBy("createdAt")
      // this.unsubscribe2 = null
      this.unsubscribe2 = ref2.onSnapshot((snapshot) => {
        let collections = []
        let collectionIds = []
        snapshot.forEach((doc) => {
          for (let i = 0; i < doc.data().category.length; i++) {
            for (let j = 0; j < this.chosen_categoryBox.length; j++) {
              if (doc.data().category[i] === this.chosen_categoryBox[j]) {
                collections.push(doc.data())
                collectionIds.push(doc.id)
              }
            }
          } //検索はこんな感じかな、効率悪いか
        })
        this.collections = collections
        this.collectionIds = collectionIds
      })
    },
  },
  created() {
    // const ref1 = firebase //のちのち
    //   .firestore()
    //   .collection("quizs")
    //   .orderBy("createdAt")

    // this.unsubscribe1 = ref1.onSnapshot((snapshot) => {
    //   let quizs = []
    //   snapshot.forEach((doc) => {
    //     quizs.push(doc.data())
    //   })
    //   this.quizs = quizs
    // })

    const ref2 = firebase
      .firestore()
      .collection("collections")
      .orderBy("createdAt")

    this.unsubscribe2 = ref2.onSnapshot((snapshot) => {
      let collections = []
      let collectionIds = []
      snapshot.forEach((doc) => {
        collections.push(doc.data())
        collectionIds.push(doc.id)
      })
      this.collections = collections
      this.collectionIds = collectionIds
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
