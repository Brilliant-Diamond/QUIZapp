<template>
  <div id="app">
    <div class="category-search">
      <input
        type="radio"
        name="follow_range"
        value="1"
        v-model="follow_range"
      />すべて
      <input
        type="radio"
        name="follow_range"
        value="2"
        v-model="follow_range"
      />フォロー中のみ
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

      <button @click="followerSearch">フォロワー検索</button>
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
      chosen_categoryBox: ["食べ物", "動物", "ゲーム", "アニメ", "アイドル"],
      follow_range: "1",
      collections: [],
      collectionIds: [],
      // quizs: [],
      // unsubscribe1: null,
      unsubscribe2: null,
      followingByIdList: [],
      followingByEmail: [],
    }
  },
  computed: {
    userId() {
      return this.$store.getters.userId
    },
  },
  methods: {
    Search() {
      const ref2 = firebase
        .firestore()
        .collection("collections")
        .orderBy("createdAt")

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
          }
        })
        this.collections = collections
        this.collectionIds = collectionIds
      })
    },
    followerSearch() {
      if (this.follow_range === "1") {
        //すべて
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
      } else if (this.follow_range === "2") {
        this.collections = []
        this.collectionIds = []
        //フォロー中のみ
        for (let k = 0; k < this.followingByEmail.length; k++) {
          const ref2 = firebase
            .firestore()
            .collection("collections")
            .where("createdBy", "==", this.followingByEmail[k].email)
            .orderBy("createdAt")

          this.unsubscribe2 = ref2.onSnapshot((snapshot) => {
            // let collections = []
            // let collectionIds = []
            snapshot.forEach((doc) => {
              this.collections.push(doc.data())
              this.collectionIds.push(doc.id)
            })
            // this.collections = collections
            // this.collectionIds = collectionIds
          })
        }
      }
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

    //この人が何人をフォローしているのかを探索
    firebase
      .firestore()
      .collection("follow")
      .where("from", "==", this.userId)
      .get()
      .then((querySnapshot) => {
        let followingByIdList = []
        querySnapshot.forEach((doc) => {
          followingByIdList.push(doc.data().to)
        })
        this.followingByIdList = followingByIdList
        for (let i = 0; i < this.followingByIdList.length; i++) {
          firebase
            .firestore()
            .collection("user_profiles")
            .where("id", "==", this.followingByIdList[i])
            .get()
            .then((querySnapshot) => {
              let followingBy = ""
              querySnapshot.forEach((doc) => {
                followingBy = {
                  email: doc.data().email,
                  id: followingByIdList[i],
                }
              })
              this.followingByEmail.push(followingBy)
            })
            .catch((error) => {
              console.log("Error getting documents: ", error)
            })
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
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
