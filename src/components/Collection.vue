<template>
  <div class="display-container">
    <div class="collection-container" v-on:click="displayQuiz">
      <router-link
        v-if="autherId && userId !== autherId"
        :to="{ name: 'Others', params: { id: autherId } }"
        class="auther-name"
        >{{ autherName }}</router-link
      >
      <div v-else class="auther-name">
        {{ autherName }}
      </div>
      <h3 class="collection-title">{{ collection.title }}</h3>
      <div class="categorry-box">
        <span>カテゴリー： </span>
        <div
          v-for="(categoryItem, index) in collection.category"
          v-bind:key="`first-${index}`"
        >
          <span v-if="categoryItem"> {{ categoryItem }},</span>
          <span v-else>無し</span>
        </div>
      </div>
      <!-- <vue-star v-bind:heart="collection.heart"></vue-star> -->
      <div class="tag-box">
        <div
          v-for="(tagItem, index) in collection.tag"
          v-bind:key="`second-${index}`"
        >
          #{{ tagItem.text }},
        </div>
      </div>
      <div class="rate-box">
        <span><i class="fas fa-check"></i> {{ collectionRate }}%</span>
        <span><i class="fas fa-eye"></i> {{ collection.tryCount }}</span>
      </div>
      <quiz
        v-for="(quiz, index) in collection.quizs"
        v-bind:key="index"
        v-bind:quiz="quiz"
        v-bind:quizIndex="index"
        v-bind:class="{ hide: isQuizHiding }"
        @reportAns="makeRate"
      ></quiz>
      <div v-if="rate != null">
        <div>
          <i class="fas fa-check"></i>{{ score }}/{{ collection.quizs.length }}
        </div>
        <div>{{ feedback }}</div>
      </div>
    </div>
    <div class="fav-box">
      <span
        v-if="isFaved"
        v-on:click="disFav"
        class="fa fa-heart red pointer"
      ></span>
      <span v-else v-on:click="fav" class="fa fa-heart pointer"></span>
      <span> {{ howManyFaved }}</span>
      <i
        class="fas fa-trash-alt pointer"
        v-on:click="deleteCollection"
        v-if="collection.createdBy == userEmail"
      ></i>
    </div>
    <button v-if="!isQuizHiding" v-on:click="hideQuiz">
      閉じる
    </button>
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
      if (this.isQuizHiding) {
        this.isQuizHiding = false
      }
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
        if (this.isSignedIn) {
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
      }
    },
    deleteCollection() {
      if (window.confirm("投稿を削除しますか？")) {
        firebase
          .firestore()
          .collection("collections")
          .doc(this.collectionId)
          .delete()
          .then(() => {})
          .catch((error) => {
            console.error("Error removing document: ", error)
          })
        console.log("this quiz is deleted")
      }
    },
  },

  computed: {
    userId() {
      return this.$store.getters.userId
    },
    userEmail() {
      return this.$store.getters.userEmail
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
            this.collectionRate = Math.floor(rateAverage * 100)
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
          this.collectionRate = Math.floor(rateAverage * 100)
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
      })
  },
}
</script>

<style scoped>
.auther-name {
  font-size: 15px;
  font-weight: bold;
  align-self: flex-start;
  margin-left: 15%;
  padding: 20px;
  text-decoration: none;
  color: #094067;
}
.collection-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  color: #5f6c7b;
  flex-wrap: wrap;
  overflow-wrap: break-word;
  word-break: break-all;
}
.display-container:hover {
  background-color: #f5f9fc;
  cursor: pointer;
}
.categorry-box {
  display: flex;
}
.tag-box {
  display: flex;
}
.rate-box span {
  margin: 10px;
}
.hide {
  display: none;
}
.red {
  color: #ef4565;
}

.collection-title {
  color: #094067;
  width: 80%;
  text-align: center;
}
button {
  background-color: #3da9fc;
  color: #fffffe;
  border-radius: 0.5rem;
  padding: 8px;
  border: none;
  cursor: pointer;
  margin: 10px;
}
.pointer {
  cursor: pointer;
}
.display-container {
  width: 80%;
  max-width: 800px;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: solid 1px rgba(59, 87, 85, 0.425);
  border-radius: 5px;
  margin: 15px;
  /* border: none; */
  /* background-color: #d8eefe; */
}
.fa-trash-alt {
  margin-left: 30px;
}
.fav-box {
  color: #5f6c7b;
}
</style>
