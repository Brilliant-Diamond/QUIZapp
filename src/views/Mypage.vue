<template>
  <div class="my-page">
    <div class="follower-display">
      <div class="followed">
        {{ howManyFollowed }}
        <h3>フォロワー</h3>
        <div
          class=""
          v-for="(follower, index) in followedByList"
          :key="`first-${index}`"
        >
          <router-link
            v-if="follower.id"
            :to="{
              name: 'Others',
              params: { id: follower.id },
            }"
            >{{ follower.name }}</router-link
          >
        </div>
      </div>

      <div class="following">
        {{ howManyFollowing }}
        <h3>フォロー中</h3>
        <div
          class=""
          v-for="(following, index) in followingByList"
          :key="`second-${index}`"
        >
          <router-link
            v-if="following.id"
            :to="{
              name: 'Others',
              params: { id: following.id },
            }"
            >{{ following.name }}</router-link
          >
        </div>
      </div>
    </div>

    <div class="user_name_box">
      <div class="use_name">
        <h1>
          {{ userName }}
        </h1>
        <div v-if="isSignedIn">
          <!-- <img
            src="../assets/edit_icon.png"
            alt="editmark"
            class="edit"
            @click="editNameDisplay"
          /> -->
          <button @click="editNameDisplay">edit</button>
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
          <!-- <img
            src="../assets/edit_icon.png"
            alt="editmark"
            class="edit"
            @click="editIntroDisplay"
          /> -->
          <button @click="editIntroDisplay">edit</button>
        </div>
      </div>
      <div class="edit_intro_display" :class="{ isNone: !edit_intro_open }">
        <textarea cols="30" rows="10" v-model="inputIntroText"></textarea>
        <button v-on:click="updateUserIntroText">自己紹介を更新</button>
      </div>
    </div>
    <div>ここに過去の作品を表示</div>
    <div class="work-space" v-if="isSignedIn">
      <collection
        v-for="(collection, index) in collections"
        v-bind:key="index"
        v-bind:collection="collection"
        v-bind:collectionId="collectionIds[index]"
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
      collectionIds: [],
      edit_name_open: false,
      edit_intro_open: false,
      howManyFollowed: 0,
      followedByIdList: [],
      followedByList: [],
      followedBy: "",
      howManyFollowing: 0,
      followingByIdList: [],
      followingByList: [],
      followingBy: "",
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
    userId() {
      return this.$store.getters.userId
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
      if (this.edit_intro_open) {
        this.edit_intro_open = false
      } else {
        this.edit_intro_open = true
      }
    },
  },
  created() {
    // 自分の作品のみを表示する
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        firebase
          .firestore()
          .collection("collections")
          .orderBy("createdAt")
          .where("createdBy", "==", user.email)
          .get()
          .then((querySnapshot) => {
            let collections = []
            let collectionIds = []
            querySnapshot.forEach((doc) => {
              collections.push(doc.data())
              collectionIds.push(doc.id)
            })
            this.collections = collections
            this.collectionIds = collectionIds
          })
          .catch((error) => {
            console.log("Error getting documents: ", error)
          })
      } else {
        // No user is signed in.
      }
    })
    //この人が何人にフォローされているのかを探索
    firebase
      .firestore()
      .collection("follow")
      .where("to", "==", this.userId)
      .get()
      .then((querySnapshot) => {
        this.howManyFollowed = querySnapshot.size
        let followedByIdList = []
        querySnapshot.forEach((doc) => {
          followedByIdList.push(doc.data().from)
        })
        this.followedByIdList = followedByIdList
        for (let i = 0; i < this.followedByIdList.length; i++) {
          firebase
            .firestore()
            .collection("user_profiles")
            .where("id", "==", this.followedByIdList[i])
            .get()
            .then((querySnapshot) => {
              let followedBy = ""
              querySnapshot.forEach((doc) => {
                followedBy = {
                  name: doc.data().name,
                  id: followedByIdList[i],
                }
              })
              this.followedByList.push(followedBy)
            })
            .catch((error) => {
              console.log("Error getting documents: ", error)
            })
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
      })
    //この人が何人をフォローしているのかを探索
    firebase
      .firestore()
      .collection("follow")
      .where("from", "==", this.userId)
      .get()
      .then((querySnapshot) => {
        this.howManyFollowing = querySnapshot.size
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
                  name: doc.data().name,
                  id: followingByIdList[i],
                }
              })
              this.followingByList.push(followingBy)
              // this.followingByList[i] = followingBy
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
.work-space {
  display: flex;
  flex-direction: column-reverse;
}
.follower-display {
  display: flex;
}
.followed {
  margin-right: 15px;
}
</style>
