<template>
  <div class="my-page">
    <div v-if="isSignedIn">
      <div class="my-page-main">
        <div class="user-box">
          <div class="user_name_box">
            <div class="user_name">
              <h1>
                {{ userName }}
              </h1>
              <span
                v-if="!edit_name_open"
                class="fas fa-edit"
                @click="editNameDisplay"
              ></span>
              <span
                v-else
                class="fas fa-edit red"
                @click="editNameDisplay"
              ></span>
            </div>
            <div class="edit_name_display" :class="{ isNone: !edit_name_open }">
              <input type="text" v-model="inputName" />
              <button v-on:click="updateUserName">名前を更新</button>
            </div>
          </div>

          <div class="introduce_box">
            <div class="introduce">
              {{ userIntroText }}
              <span
                v-if="!edit_intro_open"
                class="fas fa-edit"
                @click="editIntroDisplay"
              ></span>
              <span
                v-else
                class="fas fa-edit red"
                @click="editIntroDisplay"
              ></span>
            </div>
            <div
              class="edit_intro_display"
              :class="{ isNone: !edit_intro_open }"
            >
              <textarea cols="30" rows="10" v-model="inputIntroText"></textarea>
              <button v-on:click="updateUserIntroText">自己紹介を更新</button>
            </div>
          </div>
        </div>
        <div class="follower-box">
          <div class="post-number">
            <h4>{{ howManyPosting }}</h4>
            <h3>投稿</h3>
          </div>

          <div class="followed">
            <h4>{{ howManyFollowed }}</h4>
            <h3>フォロワー</h3>
            <button @click="followedListClick">
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>

          <div class="following">
            <h4>{{ howManyFollowing }}</h4>
            <h3>フォロー中</h3>
            <button @click="followingListClick">
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>

          <div class="follow-list" :class="{ isNone: !followListOpen }">
            <div class="follow-list-close">
              <i class="fas fa-times" @click="DisplayNone"></i>
            </div>
            <div class="follow-top">
              <h4
                class="follower-title"
                @click="followedOpen"
                :class="{ Onfollower: followedMemOpen }"
              >
                フォロワー
              </h4>
              <h4
                @click="followingOpen"
                :class="{ Onfollower: followingMemOpen }"
              >
                フォロー中
              </h4>
            </div>
            <div
              class="follow-mem"
              :class="{ isNone: !followedMemOpen }"
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
              <i
                class="fas fa-trash-alt"
                @click="delFollower(follower.id, index)"
              ></i>
            </div>
            <div
              class="follow-mem"
              :class="{ isNone: !followingMemOpen }"
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
              <i
                class="fas fa-trash-alt"
                @click="unFollow(following.id, index)"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <div class="change_collection">
        <i v-if="my_collectionOpen" class="fas fa-user-alt fa-2x"></i>
        <i v-else class="fas fa-user-alt fa-2x off" @click="my_collection"></i>
        <i
          v-if="my_collectionOpen"
          class="fa fa-heart fa-2x off"
          @click="myfav_collection"
        ></i>
        <i v-else class="fa fa-heart fa-2x" @click="myfav_collection"></i>
      </div>
      <div class="work-space">
        <collection
          v-for="(collection, index) in collections"
          v-bind:key="index"
          v-bind:collection="collection"
          v-bind:collectionId="collectionIds[index]"
        />
      </div>
    </div>

    <div v-else class="nouser">
      <h2>サインインしていません！サインインをしてマイページを作成しよう！</h2>
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
      howManyPosting: "",
      myfav_collections: [],
      myfav_collectionIds: [],
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
      followListOpen: false,
      followedMemOpen: false,
      followingMemOpen: false,
      // isFollowed: true,
      my_collectionOpen: true,
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
    followedListClick() {
      if (!this.followListOpen) {
        this.followListOpen = true
        this.followedMemOpen = true
      }
    },
    followingListClick() {
      if (!this.followListOpen) {
        this.followListOpen = true
        this.followingMemOpen = true
      }
    },
    followedOpen() {
      if (this.followedMemOpen) {
        //
      } else {
        this.followedMemOpen = true
        this.followingMemOpen = false
      }
    },
    followingOpen() {
      if (this.followingMemOpen) {
        //
      } else {
        this.followingMemOpen = true
        this.followedMemOpen = false
      }
    },
    DisplayNone() {
      this.followListOpen = false
      this.followingMemOpen = false
      this.followedMemOpen = false
    },
    unFollow(followingId, index) {
      if (window.confirm("本当に削除してもいいですか？")) {
        // OKが選択された時の処理
        this.followingByList.splice(index, 1)
        this.howManyFollowing--
        firebase
          .firestore()
          .collection("follow")
          .where("from", "==", this.userId)
          .where("to", "==", followingId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete()
            })
          })
          .catch((error) => {
            console.error("Error removing document: ", error)
          })
      }
    },
    delFollower(followerId, index) {
      if (window.confirm("本当に削除してもいいですか？")) {
        // OKが選択された時の処理
        this.howManyFollowed--
        this.followedByList.splice(index, 1)
        firebase
          .firestore()
          .collection("follow")
          .where("from", "==", followerId)
          .where("to", "==", this.userId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete()
            })
          })
          .catch((error) => {
            console.error("Error removing document: ", error)
          })
      }
    },
    myfav_collection() {
      this.my_collectionOpen = false
      this.collections = []
      this.collectionIds = this.myfav_collectionIds
      // 自分のいいねした作品のidを取り出す
      firebase
        .firestore()
        .collection("fav")
        .where("from", "==", this.userId)
        .get()
        .then((querySnapshot) => {
          let myfav_collectionIds = []
          querySnapshot.forEach((doc) => {
            myfav_collectionIds.push(doc.data().to)
          })
          this.myfav_collectionIds = myfav_collectionIds
          for (let i = 0; i < this.myfav_collectionIds.length; i++) {
            firebase
              .firestore()
              .collection("collections")
              .doc(this.myfav_collectionIds[i])
              .get()
              .then((doc) => {
                // let myfav_collections = []
                this.collections.push(doc.data())
                // this.myfav_collections = myfav_collections
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
    my_collection() {
      this.my_collectionOpen = true
      this.collections = []
      this.collectionIds = []
      firebase
        .firestore()
        .collection("collections")
        .orderBy("createdAt")
        .where("createdBy", "==", this.user.email)
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
            this.howManyPosting = this.collections.length
          })
          .catch((error) => {
            console.log("Error getting documents: ", error)
          })
      } else {
        // No user is signed in.
      }
    })
    // 自分のいいねした作品のidを取り出す
    firebase
      .firestore()
      .collection("fav")
      .where("from", "==", this.userId)
      .get()
      .then((querySnapshot) => {
        let myfav_collectionIds = []
        querySnapshot.forEach((doc) => {
          myfav_collectionIds.push(doc.data().to)
        })
        this.myfav_collectionIds = myfav_collectionIds
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
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
              // this.followedByList[i] = followedBy
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
.my-page {
  /* text-align: center; */
  /* margin: 0 auto; */
}
.my-page-main {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.user-box {
  width: 50%;
}
.user_name {
  display: flex;
}
.introduce {
  display: flex;
  width: 50%;
  white-space: pre-wrap;
}
.edit {
  width: 20px;
  height: 20px;
}
.follower-box {
  display: flex;
}
.post-number {
  margin-right: 30px;
}
.followed {
  margin-right: 15px;
}
.change_collection {
  text-align: center;
  margin: 0 auto;
  width: 20%;
  display: flex;
  justify-content: space-between;
  margin-top: 100px;
}
.change_collection i {
  cursor: pointer;
}
.off {
  opacity: 60%;
}
.work-space {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  /* margin-top: 100px; */
}
.follow-list {
  /* display: flex; */
  background-color: #90b4ce;
  height: auto;
  width: 200px;
  border-radius: 4px;
  padding: 10px;
  /* position: fixed; */
  position: absolute;
  top: 250px;
}
.follow-list {
  cursor: pointer;
}
.follow-list-close {
  display: flex;
  flex-direction: row-reverse;
  cursor: pointer;
}
.follow-top {
  border-bottom: solid;
  display: flex;
  justify-content: center;
}
.follow-top h4 {
  cursor: pointer;
}
.follower-title {
  margin-right: 15px;
}
.Onfollower {
  color: #ef4565;
}
.follow-mem {
  background-color: #fffffe;
  border-radius: 4px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.isNone {
  display: none;
}
.nouser {
  text-align: center;
  color: #ef4565;
}
</style>
