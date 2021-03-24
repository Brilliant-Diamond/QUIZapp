<template>
  <div class="collection-container">
    <router-link
      v-if="autherId && userId !== autherId"
      :to="{ name: 'Others', params: { id: autherId } }"
      >{{ autherName }}</router-link
    >
    <div v-else>{{ autherName }}</div>
    <h4 class="head">{{ collection.title }}</h4>
    <div>
      <i class="fas fa-check"></i> {{ this.collectionRate * 100 }}%
      <i class="fas fa-eye"></i> {{ this.collection.tryCount }}
    </div>
    <div></div>
    <!-- <vue-star v-bind:heart="collection.heart"></vue-star> -->

    <div
      class="categorry-box"
      v-for="(categoryItem, index) in collection.category"
      v-bind:key="`first-${index}`"
    >
      <div v-if="categoryItem">カテゴリー：{{ categoryItem }}</div>
      <div v-else>カテゴリー：無し</div>
    </div>

    <div
      class="tag-box"
      v-for="(tagItem, index) in collection.tag"
      v-bind:key="`second-${index}`"
    >
      #{{ tagItem.text }}
    </div>
    <button v-if="isQuizHiding" v-on:click="displayQuiz">
      問題を解く
    </button>
    <button v-else v-on:click="hideQuiz">
      閉じる
    </button>

    <quiz
      v-for="(quiz, index) in collection.quizs"
      v-bind:key="index"
      v-bind:quiz="quiz"
      v-bind:quizIndex="index"
      v-bind:class="{ hide: isQuizHiding }"
      @reportAns="makeRate"
    ></quiz>
    <div v-if="rate">
      <div>
        <i class="fas fa-check"></i>{{ score }}/{{ collection.quizs.length }}
      </div>
      <div>{{ feedback }}</div>
    </div>
    <div>
      <span
        v-if="isFaved"
        v-on:click="disFav"
        class="fa fa-heart red pointer"
      ></span>
      <span v-else v-on:click="fav" class="fa fa-heart pointer"></span>
      <span> {{ howManyFaved }}</span>
    </div>
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
          let rateAverage = 0
          querySnapshot.forEach((doc) => {
            rateAverage += doc.data().rate
            this.tryCount++
          })
          if (this.tryCount != 0) {
            rateAverage = rateAverage / this.tryCount
            this.collectionRate = Math.floor(rateAverage * 100) / 100
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
        let rateAverage = 0
        querySnapshot.forEach((doc) => {
          rateAverage += doc.data().rate
          this.tryCount++
        })
        if (this.tryCount != 0) {
          rateAverage = rateAverage / this.tryCount
          this.collectionRate = Math.floor(rateAverage * 100) / 100
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
  color: #5f6c7b;
}
.hide {
  display: none;
}
.red {
  color: red;
}
.btn,
a.btn,
button.btn {
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1;
  position: relative;
  display: inline-block;
  padding: 1rem 2rem;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  text-align: center;
  vertical-align: middle;
  text-decoration: none;
  letter-spacing: 0.1em;
  color: #fffffe;
  border-radius: 0.5rem;
  background-color: #3da9fc;
}
button.btn--red.btn--cubic {
  border-bottom: 4px solid #9f000c;
}

button.btn--red.btn--cubic:hover {
  margin-top: 2px;
  border-bottom: 2px solid #9f000c;
}

button.btn--radius {
  border-radius: 100vh;
}

.fa-position-right {
  position: absolute;
  top: calc(50% - 0.5em);
  right: 1rem;
}
.head {
  color: #094067;
}
button {
  background-color: #3da9fc;
  color: #fffffe;
  border-radius: 0.5rem;
  padding: 8px;
}
.pointer {
  cursor: pointer;
}
</style>
