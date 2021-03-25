<template>
  <div id="app">
    <h2 class="heading">クイズに挑戦</h2>
    <div class="search">
      <div class="follower-search">
        <input
          type="radio"
          name="follow_range"
          value="1"
          v-model="follow_range"
        />全員
        <input
          type="radio"
          name="follow_range"
          value="2"
          v-model="follow_range"
        />フォロー中のみ
        <button @click="Search" class="search-btn">
          絞り込む<i class="fas fa-search"></i>
        </button>
      </div>
      <div class="category-search">
        <input
          type="checkbox"
          name="category"
          value="なんでも雑学"
          v-model="chosen_categoryBox"
        />なんでも雑学
        <input
          type="checkbox"
          name="category"
          value="ライフスタイル"
          v-model="chosen_categoryBox"
        />ライフスタイル
        <input
          type="checkbox"
          name="category"
          value="スポーツ"
          v-model="chosen_categoryBox"
        />スポーツ
        <input
          type="checkbox"
          name="category"
          value="アニメ＆ゲーム"
          v-model="chosen_categoryBox"
        />アニメ＆ゲーム
        <input
          type="checkbox"
          name="category"
          value="芸能"
          v-model="chosen_categoryBox"
        />芸能
        <input
          type="checkbox"
          name="category"
          value="文系学問"
          v-model="chosen_categoryBox"
        />文系学問
        <input
          type="checkbox"
          name="category"
          value="理系学問"
          v-model="chosen_categoryBox"
        />理系学問
        <input
          type="checkbox"
          name="category"
          value=""
          v-model="chosen_categoryBox"
        />カテゴリー無し
        <button @click="Allcheck">
          <i class="far fa-check-square"></i>
        </button>
        <button @click="Removecheck">
          <i class="far fa-square"></i>
        </button>
      </div>
    </div>

    <!-- <quiz
      v-for="(quiz, index) in quizs"
      v-bind:key="index"
      v-bind:quiz="quiz"
    />
    ↑のちのち -->
    <div class="collection">
      <collection
        v-for="(collection, index) in collections"
        v-bind:key="index"
        v-bind:collection="collection"
        v-bind:collectionId="collectionIds[index]"
      />
    </div>
    <router-link to="/quizpost" class="fix-link"
      ><i class="fas fa-pen"></i
    ></router-link>
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
      chosen_categoryBox: [],
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
      if (this.follow_range === "1") {
        this.collections = []
        this.collectionIds = []
        //すべて
        const ref2 = firebase
          .firestore()
          .collection("collections")
          .orderBy("createdAt")

        this.unsubscribe2 = ref2.onSnapshot((snapshot) => {
          // let collections = []
          // let collectionIds = []
          snapshot.forEach((doc) => {
            for (let i = 0; i < doc.data().category.length; i++) {
              for (let j = 0; j < this.chosen_categoryBox.length; j++) {
                if (doc.data().category[i] === this.chosen_categoryBox[j]) {
                  this.collections.push(doc.data())
                  this.collectionIds.push(doc.id)
                }
              }
            }
          })
          // this.collections = collections
          // this.collectionIds = collectionIds
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
              // this.collections.push(doc.data())
              // this.collectionIds.push(doc.id)
              for (let i = 0; i < doc.data().category.length; i++) {
                for (let j = 0; j < this.chosen_categoryBox.length; j++) {
                  if (doc.data().category[i] === this.chosen_categoryBox[j]) {
                    this.collections.push(doc.data())
                    this.collectionIds.push(doc.id)
                  }
                }
              }
            })
            // this.collections = collections
            // this.collectionIds = collectionIds
          })
        }
      }
    },
    Allcheck() {
      this.chosen_categoryBox = [
        "なんでも雑学",
        "ライフスタイル",
        "スポーツ",
        "アニメ＆ゲーム",
        "芸能",
        "文系学問",
        "理系学問",
        "",
      ]
    },
    Removecheck() {
      this.chosen_categoryBox = []
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
    }) //

    //createdでvuexのstoreを使うとstoreが生成される前に処理が行われるためエラーが出るので修正しましたby谷

    //この人が何人をフォローしているのかを探索
    // firebase
    //   .firestore()
    //   .collection("follow")
    //   .where("from", "==", this.userId)
    //   .get()
    //   .then((querySnapshot) => {
    //     let followingByIdList = []
    //     querySnapshot.forEach((doc) => {
    //       followingByIdList.push(doc.data().to)
    //     })
    //     this.followingByIdList = followingByIdList
    //     for (let i = 0; i < this.followingByIdList.length; i++) {
    //       firebase
    //         .firestore()
    //         .collection("user_profiles")
    //         .where("id", "==", this.followingByIdList[i])
    //         .get()
    //         .then((querySnapshot) => {
    //           let followingBy = ""
    //           querySnapshot.forEach((doc) => {
    //             followingBy = {
    //               email: doc.data().email,
    //               id: followingByIdList[i],
    //             }
    //           })
    //           this.followingByEmail.push(followingBy)
    //         })
    //         .catch((error) => {
    //           console.log("Error getting documents: ", error)
    //         })
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("Error getting documents: ", error)
    //   })

    //上の内容を修正しただけ。storeを使わずにuser情報をとってきている。
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        firebase
          .firestore()
          .collection("follow")
          .where("from", "==", user.uid)
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
      } else {
        // No user is signed in.
      }
    })
  },
}
</script>

<style>
#app {
  color: #2c3e50;
  margin: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* display: flex;
  flex-direction: column-reverse; */
}
.heading {
  color: #094067;
}
.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
}
.search button i {
  margin-left: 3px;
}
.collection {
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  align-items: center;
  margin: 30px;
}
.search-btn {
  background-color: #ef4565;
  color: #fffffe;
  border-radius: 0.5rem;
  padding: 8px;
  border: none;
  cursor: pointer;
  margin: 5px;
}
.fix-link {
  position: fixed;
  bottom: 5%;
  right: 5%;
  display: inline-block;
  background-color: #3da9fc;
  color: #fffffe;
  border-radius: 50%;
  /* padding: 30px; */
  border: none;
  /* margin: 10px; */
  cursor: pointer !important;
  text-decoration: none;
  /* font-size: 20px; */
  /* max-width: 300px; */
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 25px;
}
.fix-link:hover {
  background-color: #0990f7;
}
</style>
