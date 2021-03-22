<template>
  <div class="collection-container">
    <router-link
      v-if="autherId && userId !== autherId"
      :to="{ name: 'Others', params: { id: autherId } }"
      >{{ autherName }}</router-link
    >
    <div v-else>{{ autherName }}</div>
    <h4>{{ collection.title }}</h4>
    <div>正答率：{{ this.collectionRate * 100 }}%</div>
    <div>回答件数：{{ this.collection.tryCount }}</div>
    <!-- <vue-star v-bind:heart="collection.heart"></vue-star> -->

    <div
      class="categorry-box"
      v-for="(categoryItem, index) in collection.category"
      v-bind:key="`first-${index}`"
    >
      カテゴリー：{{ categoryItem }}
    </div>

    <div
      class="tag-box"
      v-for="(tagItem, index) in collection.tag"
      v-bind:key="`second-${index}`"
    >
      #{{ tagItem.text }}
    </div>

    <quiz
      v-for="(quiz, index) in collection.quizs"
      v-bind:key="index"
      v-bind:quiz="quiz"
      v-bind:quizIndex="index"
      v-bind:class="{ hide: isQuizHiding }"
      @reportAns="makeRate"
    ></quiz>
    <div v-if="rate">
      <div>正答数：{{ score }}/{{ collection.quizs.length }}</div>
      <div>{{ feedback }}</div>
    </div>

    <button v-if="isQuizHiding" v-on:click="displayQuiz">問題を解く</button>
    <button v-else v-on:click="hideQuiz">閉じる</button>
    <div>{{ howManyFaved }}</div>
    <span v-if="isFaved" v-on:click="disFav" class="fa fa-heart red"></span>
    <span v-else v-on:click="fav" class="fa fa-heart"></span>
  </div>
</template>

<script>
import Quiz from "@/components/Quiz.vue"
import firebase from "firebase"

export default {
  components: {
    Quiz,
  },
  data() {
    return {
      isQuizHiding: true,
      isFaved: false,
      favId: "",
      howManyFaved: 0,
      autherName: "ゲスト",
      autherId: "",
      howManySolved: 0,
      score: 0,
      feedback: "",
      rate: null,
      collectionRate: 0,
      tryCount: 0,
    }
  },
  props: {
    collection: {
      type: Object,
      require: true,
    },
    collectionId: {
      type: String,
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
    fav() {
      if (this.isSignedIn) {
        const fav = {
          from: this.userId,
          to: this.collectionId,
        }
        firebase
          .firestore()
          .collection("fav")
          .add(fav)
          .then((docRef) => {
            this.favId = docRef.id
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
        this.isFaved = true
        this.howManyFaved++
      }
    },
    disFav() {
      firebase
        .firestore()
        .collection("fav")
        .doc(this.favId)
        .delete()
        .then(() => {})
        .catch((error) => {
          console.error("Error removing document: ", error)
        })
      this.isFaved = false
      this.howManyFaved--
    },
    makeRate(value) {
      this.howManySolved++
      this.score += value
      if (this.howManySolved == this.collection.quizs.length) {
        console.log("solved!")
        this.rate = this.score / this.collection.quizs.length
        if (this.rate >= 0.5) {
          this.feedback = "すごい！"
        } else {
          this.feedback = "いまいち"
        }
        //solvedコレクションを追加
        const solved = {
          from: this.userId,
          to: this.collectionId,
          rate: this.rate,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
        firebase
          .firestore()
          .collection("solved")
          .add(solved)

        //collectionのtryCountを１増やす
        let tryCount = 1

        if (this.collection.tryCount) {
          console.log("tryCount is existing")
          tryCount = this.collection.tryCount + 1
        }

        this.collection.tryCount = tryCount

        firebase
          .firestore()
          .collection("collections")
          .doc(this.collectionId)
          .set(this.collection)
          .then(function() {
            console.log("Document successfully written!")
          })
          .catch(function(error) {
            console.error("Error writing document: ", error)
          })
      }
    },
  },

  computed: {
    userId() {
      return this.$store.getters.userId
    },
    isSignedIn() {
      return this.$store.getters.isSignedIn
    },
    // autherId() {
    //   return this.$store.state.autherId
    // },
  },
  watch: {
    collection(new_collection) {
      //この投稿をしたユーザーの名前を取得
      firebase
        .firestore()
        .collection("user_profiles")
        .where("email", "==", new_collection.createdBy)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.autherName = doc.data().name || "ゲスト"
            this.autherId = doc.data().id
          })
        })
        .catch((error) => {
          console.log("Error getting documents: ", error)
        })
    },
    collectionId(new_collectionId) {
      //ログインしているユーザーがこのcollectionをいいねしてるかを確認
      firebase
        .firestore()
        .collection("fav")
        .where("from", "==", this.userId)
        .where("to", "==", new_collectionId)
        .get()
        .then((querySnapshot) => {
          let isFaved = false
          let favId = ""
          querySnapshot.forEach((doc) => {
            isFaved = true
            favId = doc.id
          })
          this.isFaved = isFaved
          this.favId = favId
        })
        .catch((error) => {
          console.log("Error getting documents: ", error)
        })
      //このcollectionが何人にいいねされているのかを探索
      firebase
        .firestore()
        .collection("fav")
        .where("to", "==", new_collectionId)
        .get()
        .then((querySnapshot) => {
          this.howManyFaved = querySnapshot.size
        })
        .catch((error) => {
          console.log("Error getting documents: ", error)
        })

      //正答率（collectionRate）の取得
      firebase
        .firestore()
        .collection("solved")
        .where("to", "==", new_collectionId)
        .get()
        .then((querySnapshot) => {
          this.tryCount = 0
          this.collectionRate = 0
          querySnapshot.forEach((doc) => {
            this.collectionRate += doc.data().rate
            this.tryCount++
          })
          if (this.tryCount != 0) {
            this.collectionRate = this.collectionRate / this.tryCount
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error)
        })
    },
  },
  created() {
    //ログインしているユーザーがこのcollectionをいいねしてるかを確認
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        firebase
          .firestore()
          .collection("fav")
          .where("from", "==", user.uid)
          .where("to", "==", this.collectionId)
          .get()
          .then((querySnapshot) => {
            let isFaved = false
            let favId = ""
            querySnapshot.forEach((doc) => {
              isFaved = true
              favId = doc.id
            })
            this.isFaved = isFaved
            this.favId = favId
          })
          .catch((error) => {
            console.log("Error getting documents: ", error)
          })
      } else {
        // No user is signed in.
      }
    })
    //このcollectionが何人にいいねされているのかを探索
    firebase
      .firestore()
      .collection("fav")
      .where("to", "==", this.collectionId)
      .get()
      .then((querySnapshot) => {
        this.howManyFaved = querySnapshot.size
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
      })
    //この投稿をしたユーザーの名前を取得
    firebase
      .firestore()
      .collection("user_profiles")
      .where("email", "==", this.collection.createdBy)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.autherName = doc.data().name || "ゲスト"
          this.autherId = doc.data().id
        })
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
      })
    //正答率（collectionRate）の取得
    firebase
      .firestore()
      .collection("solved")
      .where("to", "==", this.collectionId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.collectionRate += doc.data().rate
          this.tryCount++
        })
        if (this.tryCount != 0) {
          this.collectionRate = this.collectionRate / this.tryCount
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
      })
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
.red {
  color: red;
}
</style>
