<template>
  <div class="my-page">
    <h1>{{ currentUser }}</h1>
    <!-- ↑ページ更新のときに表示されなくなる -->
    <div class="introduce">
      ここで自己紹介
      {{ e_intro_text }}
    </div>

    <div class="introduce_edit">
      <textarea cols="30" rows="10" v-model="e_intro_text"></textarea>
    </div>

    <div class="work-space">
      ここに過去の作品を表示
      <collection
        v-for="(collection, index) in collections"
        v-bind:key="index"
        v-bind:collection="collection"
      />
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
import Collection from "@/components/Collection.vue"
export default {
  components: {
    Collection,
  },
  data() {
    return {
      intro_text: "",
      e_intro_text: "",
      unsubscribe2: null,
      collections: [],
      currentUser: "ログインしてください",
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = firebase.auth().currentUser.email
        const ref2 = firebase
          .firestore()
          .collection("collections")
          .orderBy("createdAt")
        this.unsubscribe2 = ref2.onSnapshot((snapshot) => {
          let collections = []
          snapshot.forEach((doc) => {
            if (doc.data().createdBy === this.currentUser) {
              collections.push(doc.data())
            }
          })
          this.collections = collections
        })
      } else {
        this.currentUser = "ログインしてください"
      }
    })
  },
}
</script>
