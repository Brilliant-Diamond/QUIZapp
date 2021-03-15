<template>
  <div class="collection-container">
    <h4>{{ collection.title }}</h4>
    <!-- <vue-star v-bind:heart="collection.heart"></vue-star> -->

    <div
      class="categorry-box"
      v-for="(categoryItem, index) in collection.category"
      v-bind:key="index"
    >
      カテゴリー：{{ categoryItem }}
    </div>

    <!-- <div
      class="tag-box"
      v-for="(tagItem, index) in collection.tag"
      v-bind:key="index"
    >
      #{{ tagItem.text }}
    </div> -->

    <quiz
      v-for="(quiz, index) in collection.quizs"
      v-bind:key="index"
      v-bind:quiz="quiz"
      v-bind:quizIndex="index"
      v-bind:class="{ hide: isQuizHiding }"
    ></quiz>
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
// import VueStar from "../components/VueStar.vue"
export default {
  components: {
    Quiz,
    // VueStar,
  },
  data() {
    return {
      isQuizHiding: true,
      isFaved: false,
      favId: "",
      howManyFaved: 0,
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
      const fav = {
        from: this.userId,
        to: this.collectionId,
      }
      console.log(fav)
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
    },
    disFav() {
      console.log("disFav")
      console.log(this.favId)
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
  },

  computed: {
    userId() {
      return this.$store.getters.userId
    },
  },
  created() {
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
