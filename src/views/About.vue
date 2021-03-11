<template>
  <div class="my-page">
    <div class="user_name_box">
      <div class="use_name">
        <h1>
          {{ userName }}
        </h1>
        <div v-if="isSignedIn">
          <img
            src="../assets/edit_icon.png"
            alt="editmark"
            class="edit"
            @click="editNameDisplay"
          />
        </div>
      </div>
      <div class="edit_name_display" :class="{ isNone: !edit_name_open }">
        <input type="text" v-model="inputName" />
        <button v-on:click="updateUserName">名前を更新</button>
      </div>
    </div>

    <div class="introduce_box">
      <div class="introduce">
        {{ userIntroText }}
        <div v-if="isSignedIn">
          <img
            src="../assets/edit_icon.png"
            alt="editmark"
            class="edit"
            @click="editIntroDisplay"
          />
        </div>
      </div>
      <div class="edit_intro_display" :class="{ isNone: !edit_intro_open }">
        <textarea cols="30" rows="10" v-model="inputIntroText"></textarea>
        <button v-on:click="updateUserIntroText">自己紹介を更新</button>
      </div>
    </div>

    <div class="work-space" v-if="isSignedIn">
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
      inputName: "",
      inputIntroText: "",
      unsubscribe2: null,
      collections: [],
      edit_name_open: false,
      edit_intro_open: false,
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    isSignedIn() {
      return this.$store.getters.isSignedIn
    },
    userName() {
      return this.$store.getters.userName
    },
    userIntroText() {
      return this.$store.getters.userIntroText
    },
  },
  methods: {
    updateUserName() {
      if (this.inputName === "") {
        // 入力した値が空
      } else if (!this.user) {
        // ログインしていない
      } else {
        this.$store.dispatch("updateUserProfile", { name: this.inputName })
        this.inputName = ""
        this.edit_name_open = false
      }
    },
    updateUserIntroText() {
      if (this.inputIntroText === "") {
        // 入力した値が空
      } else if (!this.user) {
        // ログインしていない
      } else {
        this.$store.dispatch("updateUserProfile", {
          introduce_text: this.inputIntroText,
        })
        this.inputIntroText = ""
        this.edit_intro_open = false
      }
    },
    editNameDisplay() {
      if (this.edit_name_open) {
        this.edit_name_open = false
      } else {
        this.edit_name_open = true
      }
    },
    editIntroDisplay() {
      if (this.edit_name_open) {
        this.edit_intro_open = false
      } else {
        this.edit_intro_open = true
      }
    },
  },
  created() {
    // 更新はうまくいかない、自分の作品のみ
    if (this.isSignedIn) {
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
    }
  },
}
</script>

<style scoped>
.use_name {
  display: flex;
}
.edit {
  width: 20px;
  height: 20px;
}
.isNone {
  display: none;
}
</style>
